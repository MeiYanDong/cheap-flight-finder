'use client'
import { useState, useEffect, useCallback } from 'react'
import FlightCard from './FlightCard'
import FilterBar, { FilterState } from './FilterBar'
import { Flight } from '@/types/flight'
import { RefreshCw, Info } from 'lucide-react'

const FULL_PRICE: Record<string, number> = { '经济舱': 1200, '超值经济舱': 900, '商务舱': 4000 }
const getFullPrice = (cabin: string) => FULL_PRICE[cabin] ?? 1200

export default function FlightFeed() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const [isMock, setIsMock] = useState(false)
  const [feedDate, setFeedDate] = useState('')
  const [filters, setFilters] = useState<FilterState>({ depCity: '全部', maxPrice: 99999, sortBy: 'price' })

  const fetchFlights = useCallback(async (depCity?: string) => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (depCity && depCity !== '全部') {
        params.set('depCity', depCity)
      }
      const res = await fetch(`/api/flights${params.size ? '?' + params : ''}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setFlights(data.flights || [])
      setIsMock(!!data.isMock)
      setUpdatedAt(Date.now())
      // Extract the actual search date from the first flight
      const firstDate = data.flights?.[0]?.date
      if (firstDate) setFeedDate(firstDate)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchFlights() }, [fetchFlights])

  function handleFilter(f: FilterState) {
    // If city changed and we don't have data for it, re-fetch
    const availableCities = new Set(flights.map(fl => fl.depCity))
    if (f.depCity !== '全部' && !availableCities.has(f.depCity)) {
      fetchFlights(f.depCity)
    }
    setFilters(f)
  }

  const filtered = flights
    .filter(f => f.price <= filters.maxPrice)
    .filter(f => filters.depCity === '全部' || f.depCity === filters.depCity)
    .sort((a, b) => filters.sortBy === 'price'
      ? a.price - b.price
      : (a.price / getFullPrice(a.cabin)) - (b.price / getFullPrice(b.cabin))
    )

  // Format feed date label: "明日特价 · 4月14日" or "特价航班 · 4月14日"
  const dateLabel = (() => {
    if (!feedDate) return '特价航班'
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth()+1).padStart(2,'0')}-${String(tomorrow.getDate()).padStart(2,'0')}`
    const [, m, d] = feedDate.split('-')
    const dateStr = `${parseInt(m)}月${parseInt(d)}日`
    if (feedDate === todayStr) return `今日特价 · ${dateStr}`
    if (feedDate === tomorrowStr) return `明日特价 · ${dateStr}`
    return `特价航班 · ${dateStr}`
  })()

  // Relative time label
  const timeLabel = (() => {
    if (!updatedAt) return '刷新'
    const diff = Math.floor((Date.now() - updatedAt) / 1000)
    if (diff < 60) return '刚刚更新'
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前更新`
    return `${Math.floor(diff / 3600)}小时前更新`
  })()

  return (
    <div className="space-y-4">
      <FilterBar onFilter={handleFilter} />

      {isMock && (
        <div className="flex items-center gap-2 bg-deal-light border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-deal">
          <Info className="w-4 h-4 shrink-0" />
          <span>当前展示的是缓存数据（API 额度已用完），价格仅供参考，实际价格以购票平台为准</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-foreground text-sm">
          {dateLabel} <span className="text-subtle font-normal">共 {filtered.length} 条</span>
        </h2>
        <button
          onClick={() => fetchFlights()}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {timeLabel}
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="h-8 w-16 bg-surface-raised rounded" />
                  <div className="flex-1 h-8 bg-surface-raised rounded" />
                  <div className="h-8 w-16 bg-surface-raised rounded" />
                </div>
                <div className="h-10 w-24 bg-surface-raised rounded ml-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-danger-light border border-red-100 rounded-xl p-4 text-sm text-danger">
          数据加载失败：{error}
          <button onClick={() => fetchFlights()} className="ml-2 underline">重试</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 text-subtle">
          <p>暂无符合条件的特价航班</p>
          <p className="text-sm mt-1">试试调整筛选条件或切换出发城市</p>
        </div>
      )}

      <div className="space-y-2.5">
        {filtered.map((flight, i) => (
          <FlightCard key={`${flight.flightNo}-${i}`} flight={flight} index={i} />
        ))}
      </div>
    </div>
  )
}
