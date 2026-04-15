'use client'
import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import PriceCalendar from '@/components/calendar/PriceCalendar'
import { CITIES } from '@/lib/cities'
import { ArrowLeftRight, Search, Plane, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type TripType = 'oneway' | 'roundtrip'

function CalendarContent() {
  const params = useSearchParams()
  const [dep, setDep] = useState(params.get('dep') || 'BJS')
  const [arr, setArr] = useState(params.get('arr') || 'SHA')
  const [depCity, setDepCity] = useState(params.get('depCity') || '北京')
  const [arrCity, setArrCity] = useState(params.get('arrCity') || '上海')
  const [tripType, setTripType] = useState<TripType>('oneway')
  const [searching, setSearching] = useState(true)
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Search bar */}
      <div className="bg-white rounded-xl border border-border p-4 sm:p-5 mb-4 sm:mb-5 shadow-sm space-y-4">
        {/* Trip type toggle */}
        <div className="flex gap-1 p-1 bg-surface-raised rounded-lg w-fit">
          {(['oneway', 'roundtrip'] as TripType[]).map(t => (
            <button
              key={t}
              onClick={() => setTripType(t)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                tripType === t ? 'bg-white text-foreground shadow-sm' : 'text-muted hover:text-foreground'
              )}
            >
              {t === 'oneway' ? <><Plane className="w-3.5 h-3.5" />单程</> : <><ArrowRight className="w-3.5 h-3.5" />往返</>}
            </button>
          ))}
        </div>

        {/* City selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
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
            className="p-2 rounded-lg border border-border hover:bg-surface-raised self-center transition-colors"
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
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Search className="w-4 h-4" />
            查询
          </button>
        </div>
      </div>

      {searching && (
        <div key={searchKey} className="space-y-6">
          {/* Outbound calendar */}
          <div>
            <div className="mb-3 text-sm text-muted flex items-center justify-between flex-wrap gap-2">
              <span>
                {tripType === 'roundtrip' && <span className="text-xs font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-full mr-2">去程</span>}
                <span className="font-semibold text-foreground">{depCity}</span>
                <span className="mx-2 text-subtle">→</span>
                <span className="font-semibold text-foreground">{arrCity}</span>
                <span className="ml-2 text-subtle">未来30天价格参考</span>
              </span>
              <span className="text-xs text-subtle">价格为参考价，实际以购票平台为准</span>
            </div>
            <PriceCalendar dep={dep} arr={arr} depCity={depCity} arrCity={arrCity} />
          </div>

          {/* Return calendar */}
          {tripType === 'roundtrip' && (
            <div>
              <div className="mb-3 text-sm text-muted flex items-center justify-between flex-wrap gap-2">
                <span>
                  <span className="text-xs font-semibold text-warning bg-deal-light px-2 py-0.5 rounded-full mr-2">回程</span>
                  <span className="font-semibold text-foreground">{arrCity}</span>
                  <span className="mx-2 text-subtle">→</span>
                  <span className="font-semibold text-foreground">{depCity}</span>
                  <span className="ml-2 text-subtle">未来30天价格参考</span>
                </span>
                <span className="text-xs text-subtle">价格为参考价，实际以购票平台为准</span>
              </div>
              <PriceCalendar dep={arr} arr={dep} depCity={arrCity} arrCity={depCity} />
            </div>
          )}
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="bg-white rounded-xl border border-border p-5 h-20 animate-pulse" />
      </div>
    }>
      <CalendarContent />
    </Suspense>
  )
}
