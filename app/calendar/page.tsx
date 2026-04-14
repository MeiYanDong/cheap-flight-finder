'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PriceCalendar from '@/components/calendar/PriceCalendar'
import { CITIES } from '@/lib/cities'
import { ArrowLeftRight, Search } from 'lucide-react'

function CalendarContent() {
  const params = useSearchParams()
  const [dep, setDep] = useState(params.get('dep') || 'BJS')
  const [arr, setArr] = useState(params.get('arr') || 'SHA')
  const [depCity, setDepCity] = useState(params.get('depCity') || '北京')
  const [arrCity, setArrCity] = useState(params.get('arrCity') || '上海')
  const [searching, setSearching] = useState(true) // default show BJS->SHA
  const [searchKey, setSearchKey] = useState(0)

  function swap() {
    setDep(arr); setArr(dep)
    setDepCity(arrCity); setArrCity(depCity)
  }

  function search() {
    setSearching(true)
    setSearchKey(k => k + 1)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6">
      {/* Search bar */}
      <div className="bg-white rounded-xl border border-border p-5 mb-5 flex items-end gap-3 shadow-sm">
        <div className="flex-1">
          <label className="block text-xs text-subtle mb-1.5 font-medium">出发城市</label>
          <select
            value={depCity}
            onChange={e => {
              const city = CITIES.find(c => c.name === e.target.value)
              setDepCity(e.target.value)
              setDep(city?.code || 'BJS')
            }}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary bg-white"
          >
            {CITIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <button
          onClick={swap}
          className="p-2 rounded-lg border border-border hover:bg-surface-raised mb-0.5 transition-colors"
        >
          <ArrowLeftRight className="w-4 h-4 text-muted" />
        </button>

        <div className="flex-1">
          <label className="block text-xs text-subtle mb-1.5 font-medium">目的地</label>
          <select
            value={arrCity}
            onChange={e => {
              const city = CITIES.find(c => c.name === e.target.value)
              setArrCity(e.target.value)
              setArr(city?.code || 'SHA')
            }}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary bg-white"
          >
            {CITIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <button
          onClick={search}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Search className="w-4 h-4" />
          查询
        </button>
      </div>

      {searching && (
        <div key={searchKey}>
          <div className="mb-3 text-sm text-muted flex items-center justify-between">
            <span>
              <span className="font-semibold text-foreground">{depCity}</span>
              <span className="mx-2 text-subtle">→</span>
              <span className="font-semibold text-foreground">{arrCity}</span>
              <span className="ml-2 text-subtle">未来30天价格参考</span>
            </span>
            <span className="text-xs text-subtle">价格为参考价，实际以购票平台为准</span>
          </div>
          <PriceCalendar dep={dep} arr={arr} depCity={depCity} arrCity={arrCity} />
        </div>
      )}

      {!searching && (
        <div className="text-center py-20 text-subtle">
          <p className="text-sm">选择出发城市和目的地，查看价格日历</p>
        </div>
      )}
    </div>
  )
}

export default function CalendarPage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border border-border p-5 h-20 animate-pulse" />
      </div>
    }>
      <CalendarContent />
    </Suspense>
  )
}
