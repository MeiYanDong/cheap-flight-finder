'use client'
import { useState } from 'react'
import { CITIES } from '@/lib/cities'
import { formatPrice } from '@/lib/price-utils'
import { Search, MapPin, Plane, Compass, AlertCircle } from 'lucide-react'
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
  const [error, setError] = useState('')

  async function search() {
    setLoading(true)
    setSearched(true)
    setError('')
    try {
      const today = new Date()
      const localDate = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
      const res = await fetch(`/api/inspiration?dep=${depCode}&depCity=${depCity}&budget=${budget}&date=${localDate}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResults(data.destinations || [])
    } catch (e: any) {
      setError(e.message || '搜索失败，请重试')
      setResults([])
    }
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      {/* Search form */}
      <div className="bg-white rounded-xl border border-border p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-4 h-4 text-primary" />
          <h2 className="text-base font-bold text-foreground">
            ¥{budget} 从{depCity}出发，能飞哪里？
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-end">
          <div>
            <label className="block text-xs font-medium text-subtle mb-1.5">出发城市</label>
            <select
              value={depCity}
              onChange={e => {
                const city = CITIES.find(c => c.name === e.target.value)
                setDepCity(e.target.value)
                setDepCode(city?.code || 'BJS')
              }}
              className="w-full sm:w-auto border border-border rounded-lg px-3 py-2 text-sm font-medium text-foreground focus:outline-none focus:border-primary bg-white"
            >
              {CITIES.slice(0, 10).map(c => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-subtle mb-1.5">预算上限</label>
            <div className="flex gap-1.5">
              {[500, 800, 1200, 2000].map(b => (
                <button
                  key={b}
                  onClick={() => setBudget(b)}
                  className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    budget === b
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-raised text-muted hover:text-foreground'
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
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            {loading ? '搜索中...' : '探索目的地'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-danger-light border border-red-100 rounded-xl px-4 py-3 text-sm text-danger">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-border p-5 animate-pulse">
              <div className="h-8 w-8 bg-surface-raised rounded-lg mb-3" />
              <div className="h-5 w-20 bg-surface-raised rounded mb-2" />
              <div className="h-8 w-24 bg-surface-raised rounded mb-3" />
              <div className="h-8 bg-surface-raised rounded" />
            </div>
          ))}
        </div>
      )}

      {!loading && searched && !error && results.length === 0 && (
        <div className="text-center py-16 text-subtle bg-white rounded-xl border border-border">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">暂无符合预算的目的地</p>
          <p className="text-sm mt-1">试试提高预算上限</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-sm text-muted">
            从 <strong className="text-foreground">{depCity}</strong> 出发，预算 <strong className="text-foreground">¥{budget}</strong> 以内，找到 <strong className="text-foreground">{results.length}</strong> 个目的地
            <span className="ml-2 text-subtle text-xs">（参考价，实际以购票平台为准）</span>
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map(({ city, summary }) => (
              <div key={city.code} className="bg-white rounded-xl border border-border hover:border-border-strong hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-2xl mb-1">{CITY_EMOJIS[city.name] || '✈️'}</div>
                      <div className="font-bold text-foreground text-xl">{city.name}</div>
                      <div className="text-xs text-subtle mt-0.5">{city.airports[0]?.name}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-deal tabular-nums leading-none mb-1">
                    {formatPrice(summary.minPrice)}
                  </div>
                  <div className="text-xs text-subtle mb-4">
                    起 · 最短 {summary.minDuration} · 共 {summary.totalFlights} 班
                  </div>
                  <Link
                    href={`/calendar?dep=${depCode}&arr=${city.code}&depCity=${depCity}&arrCity=${city.name}`}
                    className="flex items-center justify-center gap-1.5 w-full bg-primary hover:bg-primary-hover text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
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
