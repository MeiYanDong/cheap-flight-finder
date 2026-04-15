import { NextRequest, NextResponse } from 'next/server'
import { searchFlights } from '@/lib/variflight'
import { addDays, formatDateKey } from '@/lib/price-utils'
import { getMockCalendarPrices } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dep = searchParams.get('dep')
  const arr = searchParams.get('arr')
  const depCity = searchParams.get('depCity') || ''
  const arrCity = searchParams.get('arrCity') || ''
  const days = Math.min(parseInt(searchParams.get('days') || '14'), 30)

  if (!dep || !arr) {
    return NextResponse.json({ error: 'dep and arr required' }, { status: 400 })
  }

  const today = new Date()
  const dates = Array.from({ length: days }, (_, i) => addDays(today, i + 1))
  const dateKeys = dates.map(formatDateKey)

  const results: Record<string, number | null> = {}
  let isMock = false
  const batchSize = 5

  for (let i = 0; i < dates.length; i += batchSize) {
    const batch = dates.slice(i, i + batchSize)
    const batchResults = await Promise.allSettled(
      batch.map(d => searchFlights(dep, arr, formatDateKey(d), depCity, arrCity))
    )
    batchResults.forEach((r, idx) => {
      const key = formatDateKey(batch[idx])
      if (r.status === 'fulfilled') {
        results[key] = r.value.minPrice || null
        if ((r.value as any).isMock) isMock = true
      } else {
        results[key] = null
      }
    })
    if (isMock) break
  }

  // Fill remaining dates with route-aware mock prices
  if (isMock) {
    const mockPrices = getMockCalendarPrices(dep, arr, dateKeys)
    dateKeys.forEach(key => {
      if (!results[key]) results[key] = mockPrices[key] || null
    })
  }

  return NextResponse.json({ calendar: results, dep, arr, depCity, arrCity, isMock })
}
