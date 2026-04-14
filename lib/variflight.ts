import { Flight, FlightSummary } from '@/types/flight'
import { getCached, setCached, makeCacheKey } from './cache'
import { MOCK_FLIGHTS } from './mock-data'

const BASE_URL = 'https://mcp.variflight.com/api/v1/mcp/data'
const API_KEY = process.env.VARIFLIGHT_API_KEY!

// Returns true if the API is out of quota or unavailable
let apiQuotaExhausted = false

const API_TIMEOUT_MS = 5000

async function callApi(endpoint: string, params: Record<string, string>) {
  if (apiQuotaExhausted) throw new Error('quota_exhausted')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VARIFLIGHT-KEY': API_KEY,
      },
      body: JSON.stringify({ endpoint, params }),
      cache: 'no-store',
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (!res.ok) throw new Error(`VariFlight API error: ${res.status}`)
    const json = await res.json()

    if (json.code === 403) {
      apiQuotaExhausted = true
      throw new Error('quota_exhausted')
    }
    if (json.code !== 200) throw new Error(`VariFlight error: ${json.message}`)
    return json.data
  } catch (e: any) {
    clearTimeout(timer)
    if (e.name === 'AbortError') throw new Error('api_timeout')
    throw e
  }
}

function parseItinerariesText(text: string, depCity: string, arrCity: string, date: string): FlightSummary {
  const summaryMatch = text.match(/查询到了(\d+)条.*?最低价:(\d+)元.*?最短耗时:(\d+h\d+m)/)
  const totalFlights = summaryMatch ? parseInt(summaryMatch[1]) : 0
  const minPrice = summaryMatch ? parseInt(summaryMatch[2]) : 0
  const minDuration = summaryMatch ? summaryMatch[3] : ''

  const pattern = /航班号：(\w+)，起飞时间：([\d\- :]+)，到达时间：([\d\- :]+)，耗时：(\S+)，(.*?)，(\S+?)价格：(\d+)元/g
  const flights: Flight[] = []
  let match

  while ((match = pattern.exec(text)) !== null) {
    const airlineCode = match[1].slice(0, 2)
    flights.push({
      flightNo: match[1],
      airline: getAirlineName(airlineCode),
      depCode: '',
      arrCode: '',
      depCity,
      arrCity,
      depAirport: '',
      arrAirport: '',
      depTime: match[2].trim(),
      arrTime: match[3].trim(),
      duration: match[4],
      transfer: !match[5].includes('无需中转'),
      cabin: match[6],
      price: parseInt(match[7]),
    })
  }

  return {
    depCityCode: '',
    arrCityCode: '',
    depCity,
    arrCity,
    date,
    minPrice,
    minDuration,
    totalFlights,
    flights,
  }
}

export async function searchFlights(depCityCode: string, arrCityCode: string, date: string, depCity: string, arrCity: string): Promise<FlightSummary> {
  const cacheKey = makeCacheKey(depCityCode, arrCityCode, date)

  // 1. Check cache first
  const cached = getCached<FlightSummary>(cacheKey)
  if (cached) return cached

  // 2. Try real API
  try {
    const text = await callApi('searchFlightItineraries', { depCityCode, arrCityCode, depDate: date })
    if (typeof text === 'string' && !text.includes('查询到了')) {
      const empty: FlightSummary = { depCityCode, arrCityCode, depCity, arrCity, date, minPrice: 0, minDuration: '', totalFlights: 0, flights: [] }
      setCached(cacheKey, empty)
      return empty
    }
    const summary = parseItinerariesText(text, depCity, arrCity, date)
    summary.depCityCode = depCityCode
    summary.arrCityCode = arrCityCode
    setCached(cacheKey, summary)
    return summary
  } catch (e: any) {
    // Fallback to mock data when quota exhausted or any API error
    const mockKey = `${depCityCode}:${arrCityCode}:${date}`
    const mock = MOCK_FLIGHTS[mockKey]
      || Object.values(MOCK_FLIGHTS).find(m => m.depCityCode === depCityCode && m.arrCityCode === arrCityCode)
    if (mock) {
      const result = { ...mock, date, isMock: true } as any
      setCached(cacheKey, result)
      return result
    }
    // No mock available for this route — return empty rather than throw
    return { depCityCode, arrCityCode, depCity, arrCity, date, minPrice: 0, minDuration: '', totalFlights: 0, flights: [], isMock: true } as any
  }
}

export async function getFlightSchedule(dep: string, arr: string, date: string) {
  return callApi('flights', { dep, arr, date })
}

function getAirlineName(code: string): string {
  const map: Record<string, string> = {
    CA: '中国国际航空', MU: '中国东方航空', CZ: '中国南方航空',
    HU: '海南航空', MF: '厦门航空', ZH: '深圳航空',
    SC: '山东航空', KN: '中国联合航空', GS: '天津航空',
    'G5': '西部航空', '9C': '春秋航空', BK: '奥凯航空',
    EU: '成都航空', TV: '天航', AQ: '九元航空',
    PN: '西部航空', GJ: '长龙航空', NS: '河南航空',
    JD: '首都航空', HO: '吉祥航空', FM: '上海航空',
    '3U': '四川航空', OQ: '中原龙浩航空',
  }
  return map[code] || `${code}航空`
}
