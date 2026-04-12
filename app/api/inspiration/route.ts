import { NextRequest, NextResponse } from 'next/server'
import { searchFlights } from '@/lib/variflight'
import { CITIES } from '@/lib/cities'
import { MOCK_INSPIRATION } from '@/lib/mock-data'

function localDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dep = searchParams.get('dep')
  const depCity = searchParams.get('depCity') || ''
  const budget = parseInt(searchParams.get('budget') || '1000')
  const date = searchParams.get('date') || localDateStr(new Date())

  if (!dep) return NextResponse.json({ error: 'dep required' }, { status: 400 })

  const destinations = CITIES.filter(c => c.code !== dep).slice(0, 12)

  const results = await Promise.allSettled(
    destinations.map(d => searchFlights(dep, d.code, date, depCity, d.name))
  )

  const isMock = results.some(r => r.status === 'fulfilled' && (r.value as any).isMock)

  // If quota exhausted, fall back to mock inspiration data
  if (isMock || results.every(r => r.status === 'rejected')) {
    const mockFiltered = MOCK_INSPIRATION.filter(d => d.summary.minPrice <= budget)
    return NextResponse.json({ destinations: mockFiltered, isMock: true })
  }

  const destinations_with_price = results
    .map((r, i) => ({
      city: destinations[i],
      summary: r.status === 'fulfilled' ? r.value : null,
    }))
    .filter(d => d.summary && d.summary.minPrice > 0 && d.summary.minPrice <= budget)
    .sort((a, b) => (a.summary?.minPrice || 0) - (b.summary?.minPrice || 0))

  return NextResponse.json({ destinations: destinations_with_price, isMock: false })
}
