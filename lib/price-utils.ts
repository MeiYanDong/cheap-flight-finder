export function getPriceTag(price: number, cabin: string): { label: string; color: string } {
  if (price <= 300) return { label: '超低价', color: 'text-danger' }
  if (price <= 500) return { label: '低价', color: 'text-deal' }
  if (price <= 800) return { label: '较低价', color: 'text-warning' }
  return { label: '正常价', color: 'text-subtle' }
}

export function formatPrice(price: number): string {
  return `¥${price.toLocaleString()}`
}

export function formatDuration(duration: string): string {
  return duration.replace('h', '小时').replace('m', '分钟')
}

export function formatDateTime(dateTime: string): { date: string; time: string } {
  const d = new Date(dateTime)
  return {
    date: `${d.getMonth() + 1}月${d.getDate()}日`,
    time: `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`,
  }
}

export function getCtripUrl(depIATA: string, arrIATA: string, date: string): string {
  // depIATA/arrIATA: airport or city IATA code (e.g. PEK, SHA)
  const dep = depIATA.toLowerCase()
  const arr = arrIATA.toLowerCase()
  return `https://flights.ctrip.com/online/list/oneway-${dep}-${arr}?depdate=${date}`
}

export function getQunarUrl(depCity: string, arrCity: string, date: string): string {
  return `https://flight.qunar.com/site/oneway_list.htm?searchDepartureAirport=${encodeURIComponent(depCity)}&searchArrivalAirport=${encodeURIComponent(arrCity)}&searchDepartureTime=${date}&startSearch=true&from=flight_dom_search`
}

export function getPriceHeatColor(price: number, minPrice: number, maxPrice: number): string {
  if (!price) return 'bg-surface-raised text-subtle'
  const ratio = (price - minPrice) / (maxPrice - minPrice || 1)
  if (ratio <= 0.2) return 'bg-success text-white'
  if (ratio <= 0.4) return 'bg-green-300 text-green-900'
  if (ratio <= 0.6) return 'bg-amber-300 text-amber-900'
  if (ratio <= 0.8) return 'bg-warning text-white'
  return 'bg-danger text-white'
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Use local (CST) date to avoid UTC offset causing wrong date
export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
