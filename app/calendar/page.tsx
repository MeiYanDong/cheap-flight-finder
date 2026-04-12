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
  const [searching, setSearching] = useState(!!(params.get('dep') && params.get('arr')))
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
    <>
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">价格日历</h1>
          <p className="text-blue-200">查看未来30天最低参考价，找到最便宜的出行日期</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">出发城市</label>
          <select
            value={depCity}
            onChange={e => {
              const city = CITIES.find(c => c.name === e.target.value)
              setDepCity(e.target.value)
              setDep(city?.code || 'BJS')
            }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          >
            {CITIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <button onClick={swap} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 mb-0.5">
          <ArrowLeftRight className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">目的地</label>
          <select
            value={arrCity}
            onChange={e => {
              const city = CITIES.find(c => c.name === e.target.value)
              setArrCity(e.target.value)
              setArr(city?.code || 'SHA')
            }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          >
            {CITIES.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <button
          onClick={search}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Search className="w-4 h-4" />
          查询
        </button>
      </div>

      {searching && (
        <div key={searchKey}>
          <div className="mb-3 text-sm text-gray-600 flex items-center justify-between">
            <span>
              <span className="font-semibold">{depCity}</span>
              <span className="mx-2 text-gray-400">→</span>
              <span className="font-semibold">{arrCity}</span>
              <span className="ml-2 text-gray-400">未来30天价格参考</span>
            </span>
            <span className="text-xs text-gray-400">价格为参考价，实际以购票平台为准</span>
          </div>
          <PriceCalendar dep={dep} arr={arr} depCity={depCity} arrCity={arrCity} />
        </div>
      )}

      {!searching && (
        <div className="text-center py-16 text-gray-400">
          <p>选择出发城市和目的地，查看价格日历</p>
        </div>
      )}
      </div>
    </>
  )
}

export default function CalendarPage() {
  return (
    <Suspense>
      <CalendarContent />
    </Suspense>
  )
}
