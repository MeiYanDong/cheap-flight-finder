'use client'
import { useState, useEffect } from 'react'
import FlightCard from './FlightCard'
import FilterBar, { FilterState } from './FilterBar'
import { Flight } from '@/types/flight'
import { RefreshCw, Info } from 'lucide-react'

export default function FlightFeed() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState('')
  const [isMock, setIsMock] = useState(false)
  const [filters, setFilters] = useState<FilterState>({ depCity: '北京', maxPrice: 99999, sortBy: 'price' })

  async function fetchFlights() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/flights')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setFlights(data.flights || [])
      setIsMock(!!data.isMock)
      setUpdatedAt(new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchFlights() }, [])

  const filtered = flights
    .filter(f => f.price <= filters.maxPrice)
    .filter(f => filters.depCity === '全部' || f.depCity === filters.depCity)
    .sort((a, b) => filters.sortBy === 'price' ? a.price - b.price : a.price - b.price)

  return (
    <div className="space-y-4">
      <FilterBar onFilter={setFilters} />

      {isMock && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-700">
          <Info className="w-4 h-4 shrink-0" />
          <span>当前展示的是缓存数据（API 额度已用完），价格仅供参考，实际价格以购票平台为准</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">
          今日特价 <span className="text-gray-400 font-normal text-sm">共 {filtered.length} 条</span>
        </h2>
        <button
          onClick={fetchFlights}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {updatedAt ? `${updatedAt} 更新` : '刷新'}
        </button>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="h-8 w-16 bg-gray-100 rounded" />
                  <div className="flex-1 h-8 bg-gray-100 rounded" />
                  <div className="h-8 w-16 bg-gray-100 rounded" />
                </div>
                <div className="h-10 w-24 bg-gray-100 rounded ml-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">
          数据加载失败：{error}
          <button onClick={fetchFlights} className="ml-2 underline">重试</button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>暂无符合条件的特价航班</p>
          <p className="text-sm mt-1">试试调整筛选条件</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((flight, i) => (
          <FlightCard key={`${flight.flightNo}-${i}`} flight={flight} />
        ))}
      </div>
    </div>
  )
}
