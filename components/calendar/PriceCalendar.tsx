'use client'
import { useState, useEffect } from 'react'
import { getPriceHeatColor, formatPrice } from '@/lib/price-utils'
import { addDays, formatDateKey } from '@/lib/price-utils'
import { AIRLINE_PROMOTIONS } from '@/lib/airline-promotions'
import FlightCard from '@/components/feed/FlightCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PriceCalendarProps {
  dep: string
  arr: string
  depCity: string
  arrCity: string
}

export default function PriceCalendar({ dep, arr, depCity, arrCity }: PriceCalendarProps) {
  const [calendar, setCalendar] = useState<Record<string, number | null>>({})
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedFlights, setSelectedFlights] = useState<any[]>([])
  const [loadingFlights, setLoadingFlights] = useState(false)
  const [monthOffset, setMonthOffset] = useState(0)

  useEffect(() => {
    if (!dep || !arr) return
    setLoading(true)
    fetch(`/api/calendar?dep=${dep}&arr=${arr}&depCity=${depCity}&arrCity=${arrCity}&days=30`)
      .then(r => r.json())
      .then(d => { setCalendar(d.calendar || {}); setLoading(false) })
      .catch(() => setLoading(false))
  }, [dep, arr])

  async function selectDate(date: string) {
    setSelectedDate(date)
    setLoadingFlights(true)
    try {
      const res = await fetch(`/api/flights?dep=${dep}&arr=${arr}&depCity=${depCity}&arrCity=${arrCity}&date=${date}`)
      const data = await res.json()
      setSelectedFlights(data.flights || [])
    } catch { setSelectedFlights([]) }
    setLoadingFlights(false)
  }

  const prices = Object.values(calendar).filter((p): p is number => p !== null && p > 0)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const today = new Date()
  const displayMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  // Build promotion day lookup
  const promotionDays = new Set(AIRLINE_PROMOTIONS.map(p => p.day))

  return (
    <div className="space-y-6">
      {/* Month navigation */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMonthOffset(o => o - 1)} disabled={monthOffset <= 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h3 className="font-semibold text-gray-900">{year}年{month + 1}月</h3>
            <p className="text-xs text-gray-400 mt-0.5">🎯 = 航司会员日，可能有额外优惠</p>
          </div>
          <button onClick={() => setMonthOffset(o => o + 1)} disabled={monthOffset >= 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        {loading ? (
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1
              const date = formatDateKey(new Date(year, month, day))
              const price = calendar[date]
              const isPast = new Date(year, month, day) < today
              const isSelected = selectedDate === date
              const isPromoDay = promotionDays.has(day)

              return (
                <button
                  key={day}
                  onClick={() => !isPast && price && selectDate(date)}
                  disabled={isPast || !price}
                  className={`h-16 rounded-lg flex flex-col items-center justify-center text-xs transition-all border-2 relative ${
                    isSelected ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent'
                  } ${
                    isPast || !price
                      ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                      : `${getPriceHeatColor(price, minPrice, maxPrice)} cursor-pointer hover:scale-105 hover:shadow-sm`
                  }`}
                >
                  {isPromoDay && !isPast && (
                    <span className="absolute top-1 right-1 text-[10px] leading-none">🎯</span>
                  )}
                  <span className="font-semibold">{day}</span>
                  {price && !isPast && (
                    <span className="text-[10px] mt-0.5 font-medium">¥{price}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-3 mt-4 justify-end">
          <span className="text-xs text-gray-400">价格：</span>
          {['bg-green-500', 'bg-green-300', 'bg-yellow-300', 'bg-orange-400', 'bg-red-500'].map((c, i) => (
            <div key={i} className={`w-4 h-4 rounded ${c}`} />
          ))}
          <span className="text-xs text-gray-400">低 → 高</span>
        </div>
      </div>

      {/* Selected date flights */}
      {selectedDate && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            {selectedDate} 可用航班
            {promotionDays.has(new Date(selectedDate).getDate()) && (
              <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                🎯 航司会员日，建议同时查看航司官网
              </span>
            )}
          </h3>
          {loadingFlights ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : selectedFlights.length > 0 ? (
            <div className="space-y-3">
              {selectedFlights.map((f, i) => (
                <FlightCard key={i} flight={f} date={selectedDate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-400 bg-white rounded-xl border">
              该日期暂无可用航班数据
            </div>
          )}
        </div>
      )}
    </div>
  )
}

