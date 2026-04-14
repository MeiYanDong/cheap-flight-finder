import { NextRequest, NextResponse } from 'next/server'
import { searchFlights } from '@/lib/variflight'
import { POPULAR_ROUTES } from '@/lib/cities'

function localDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dep = searchParams.get('dep')
  const arr = searchParams.get('arr')
  const depCity = searchParams.get('depCity')
  const arrCity = searchParams.get('arrCity')
  const date = searchParams.get('date') || localDateStr(new Date())

  try {
    if (dep && arr && depCity && arrCity) {
      const result = await searchFlights(dep, arr, date, depCity, arrCity)
      return NextResponse.json(result)
    }

    // Feed mode: use tomorrow to ensure flights are available
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const feedDate = localDateStr(tomorrow)

    const results = await Promise.allSettled(
      POPULAR_ROUTES.map(r =>
        searchFlights(r.dep.code, r.arr.code, feedDate, r.dep.name, r.arr.name)
      )
    )

    const flights = results
      .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
      .filter(r => r.value.flights.length > 0)
      .flatMap(r => r.value.flights.slice(0, 3).map((f: any) => ({
        ...f,
        depCity: r.value.depCity,
        arrCity: r.value.arrCity,
        date: feedDate,
      })))
      .sort((a: any, b: any) => a.price - b.price)

    const isMock = flights.some((f: any) => f.isMock)
    return NextResponse.json({ flights, isMock })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
