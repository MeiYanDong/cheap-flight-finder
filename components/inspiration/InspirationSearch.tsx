'use client'
import { useState } from 'react'
import { CITIES } from '@/lib/cities'
import { formatPrice } from '@/lib/price-utils'
import { Search, MapPin, Plane, Compass } from 'lucide-react'
import Link from 'next/link'

const CITY_EMOJIS: Record<string, string> = {
  '上海': '🌆', '广州': '🌸', '深圳': '🏙️', '成都': '🐼', '杭州': '🍵',
  '重庆': '🌶️', '武汉': '🌸', '西安': '🏯', '南京': '🦆', '三亚': '🏖️',
  '昆明': '🌺', '厦门': '🌊', '青岛': '⛵', '长沙': '🍜', '郑州': '🏛️',
  '哈尔滨': '❄️', '乌鲁木齐': '🏔️', '贵阳': '🌿', '南宁': '🌴', '北京': '🏮',
}

export default function InspirationSearch() {
  const [depCity, setDepCity] = useState('北京')
  const [depCode, setDepCode] = useState('BJS')
  const [budget, setBudget] = useState(800)
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  async function search() {
    setLoading(true)
    setSearched(true)
    try {
      const today = new Date()
      const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
      const res = await fetch(`/api/inspiration?dep=${depCode}&depCity=${depCity}&budget=${budget}&date=${localDate}`)
      const data = await res.json()
      setResults(data.destinations || [])
    } catch { setResults([]) }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Search form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Compass className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900">
            ¥{budget} 从{depCity}出发，能飞哪里？
          </h2>
        </div>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">出发城市</label>
            <select
              value={depCity}
              onChange={e => {
                const city = CITIES.find(c => c.name === e.target.value)
                setDepCity(e.target.value)
                setDepCode(city?.code || 'BJS')
              }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
            >
              {CITIES.slice(0, 10).map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">预算上限</label>
            <div className="flex gap-1.5">
              {[500, 800, 1200, 2000].map(b => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    budget === b
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  ¥{b}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={search}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 shadow-sm"
          >
            <Search className="w-4 h-4" />
            {loading ? '搜索中...' : '探索目的地'}
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border p-5 animate-pulse">
              <div className="h-8 w-8 bg-gray-100 rounded-lg mb-3" />
              <div className="h-5 w-20 bg-gray-100 rounded mb-2" />
              <div className="h-8 w-24 bg-gray-100 rounded mb-3" />
              <div className="h-8 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">暂无符合预算的目的地</p>
          <p className="text-sm mt-1">试试提高预算上限</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-gray-500">
            从 <strong className="text-gray-800">{depCity}</strong> 出发，预算 <strong className="text-gray-800">¥{budget}</strong> 以内，找到 <strong className="text-gray-800">{results.length}</strong> 个目的地
            <span className="ml-2 text-gray-400 text-xs">（参考价，实际以购票平台为准）</span>
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(({ city, summary }) => (
              <div key={city.code} className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-2xl mb-1">{CITY_EMOJIS[city.name] || '✈️'}</div>
                      <div className="font-bold text-gray-900 text-xl">{city.name}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{city.airports[0]?.name}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-500 tabular-nums leading-none mb-1">
                    {formatPrice(summary.minPrice)}
                  </div>
                  <div className="text-xs text-gray-400 mb-4">
                    起 · 最短 {summary.minDuration} · 共 {summary.totalFlights} 班
                  </div>
                  <Link
                    href={`/calendar?dep=${depCode}&arr=${city.code}&depCity=${depCity}&arrCity=${city.name}`}
                    className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    查看价格日历
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
