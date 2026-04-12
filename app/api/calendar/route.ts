import { NextRequest, NextResponse } from 'next/server'
import { searchFlights } from '@/lib/variflight'
import { addDays, formatDateKey } from '@/lib/price-utils'
import { MOCK_CALENDAR } from '@/lib/mock-data'

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
    // Stop batching if quota exhausted — use mock for remaining dates
    if (isMock) break
  }

  // If mock mode, fill remaining dates from MOCK_CALENDAR
  if (isMock) {
    dates.forEach(d => {
      const key = formatDateKey(d)
      if (!results[key]) {
        // Offset mock dates to match requested dates
        const mockKeys = Object.keys(MOCK_CALENDAR)
        const idx = dates.indexOf(d)
        const mockKey = mockKeys[idx % mockKeys.length]
        results[key] = MOCK_CALENDAR[mockKey] || null
      }
    })
  }

  return NextResponse.json({ calendar: results, dep, arr, depCity, arrCity, isMock })
}
