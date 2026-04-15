'use client'
import { useState, useEffect } from 'react'
import { getPriceHeatColor, formatPrice } from '@/lib/price-utils'
import { addDays, formatDateKey } from '@/lib/price-utils'
import { AIRLINE_PROMOTIONS } from '@/lib/airline-promotions'
import FlightCard from '@/components/feed/FlightCard'
import { ChevronLeft, ChevronRight, AlertCircle, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PriceCalendarProps {
  dep: string
  arr: string
  depCity: string
  arrCity: string
}

export default function PriceCalendar({ dep, arr, depCity, arrCity }: PriceCalendarProps) {
  const [calendar, setCalendar] = useState<Record<string, number | null>>({})
  const [loading, setLoading] = useState(true)
  const [calendarError, setCalendarError] = useState('')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedFlights, setSelectedFlights] = useState<any[]>([])
  const [loadingFlights, setLoadingFlights] = useState(false)
  const [flightError, setFlightError] = useState('')
  const [monthOffset, setMonthOffset] = useState(0)

  useEffect(() => {
    if (!dep || !arr) return
    setLoading(true)
    setCalendarError('')
    fetch(`/api/calendar?dep=${dep}&arr=${arr}&depCity=${depCity}&arrCity=${arrCity}&days=30`)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error)
        setCalendar(d.calendar || {})
        setLoading(false)
      })
      .catch((e) => {
        setCalendarError(e.message || '价格数据加载失败')
        setLoading(false)
      })
  }, [dep, arr])

  async function selectDate(date: string) {
    setSelectedDate(date)
    setLoadingFlights(true)
    setFlightError('')
    try {
      const res = await fetch(`/api/flights?dep=${dep}&arr=${arr}&depCity=${depCity}&arrCity=${arrCity}&date=${date}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setSelectedFlights(data.flights || [])
    } catch (e: any) {
      setFlightError(e.message || '航班数据加载失败')
      setSelectedFlights([])
    }
    setLoadingFlights(false)
  }

  const prices = Object.values(calendar).filter((p): p is number => p !== null && p > 0)
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0

  const today = new Date()
  const displayMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  // Promotion days for the displayed month only
  const promotionDays = new Set(AIRLINE_PROMOTIONS.map(p => p.day))

  return (
    <div className="space-y-5">
      {/* Month navigation */}
      <div className="bg-white rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setMonthOffset(o => o - 1)}
            disabled={monthOffset <= 0}
            className="p-1.5 rounded-lg hover:bg-surface-raised disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted" />
          </button>
          <div className="text-center">
            <h3 className="font-semibold text-foreground">{year}年{month + 1}月</h3>
            <p className="text-xs text-subtle mt-0.5">🎯 = 航司会员日</p>
          </div>
          <button
            onClick={() => setMonthOffset(o => o + 1)}
            disabled={monthOffset >= 1}
            className="p-1.5 rounded-lg hover:bg-surface-raised disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-center text-xs font-medium text-subtle py-1">{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        {calendarError ? (
          <div className="flex items-center gap-2 bg-danger-light rounded-xl px-4 py-3 text-sm text-danger">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {calendarError}
          </div>
        ) : loading ? (
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-raised rounded-lg animate-pulse" />
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
                    isSelected ? 'border-primary scale-105 shadow-md' : 'border-transparent'
                  } ${
                    isPast || !price
                      ? 'bg-surface-raised text-subtle cursor-not-allowed'
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
        {!calendarError && !loading && (
          <div className="flex items-center gap-2 mt-4 justify-end">
            <span className="text-xs text-subtle">价格：</span>
            {['bg-success', 'bg-green-300', 'bg-amber-300', 'bg-warning', 'bg-danger'].map((c, i) => (
              <div key={i} className={`w-4 h-4 rounded ${c}`} />
            ))}
            <span className="text-xs text-subtle">低 → 高</span>
          </div>
        )}
      </div>

      {/* Selected date flights */}
      {selectedDate && (
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            {selectedDate} 可用航班
            {promotionDays.has(new Date(selectedDate).getDate()) && (
              <span className="text-xs bg-deal-light text-deal px-2 py-0.5 rounded-full font-medium">
                🎯 航司会员日，建议同时查看航司官网
              </span>
            )}
          </h3>

          {/* ±3 day flex comparison */}
          {(() => {
            const base = new Date(selectedDate)
            const offsets = [-3, -2, -1, 0, 1, 2, 3]
            const compareDates = offsets.map(o => {
              const d = new Date(base)
              d.setDate(d.getDate() + o)
              return formatDateKey(d)
            })
            const comparePrices = compareDates.map(d => calendar[d] ?? null)
            const validPrices = comparePrices.filter((p): p is number => p !== null)
            const minCompare = validPrices.length ? Math.min(...validPrices) : 0

            return (
              <div className="bg-white rounded-xl border border-border p-4 mb-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <TrendingDown className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground">前后3天价格对比</span>
                  <span className="text-xs text-subtle ml-1">点击切换日期</span>
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {compareDates.map((date, i) => {
                    const price = comparePrices[i]
                    const isSelected = date === selectedDate
                    const isCheapest = price !== null && price === minCompare && validPrices.length > 1
                    const isPast = new Date(date) < new Date(new Date().toDateString())
                    const d = new Date(date)
                    const label = `${d.getMonth() + 1}/${d.getDate()}`
                    const dowLabels = ['日', '一', '二', '三', '四', '五', '六']
                    const dow = dowLabels[d.getDay()]

                    return (
                      <button
                        key={date}
                        onClick={() => !isPast && price && selectDate(date)}
                        disabled={isPast || !price}
                        className={cn(
                          'flex flex-col items-center py-2 px-1 rounded-lg text-xs transition-all border-2',
                          isSelected
                            ? 'border-primary bg-primary-light'
                            : 'border-transparent hover:border-border',
                          isPast || !price ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                        )}
                      >
                        <span className="text-subtle font-medium">{dow}</span>
                        <span className={cn('font-semibold mt-0.5', isSelected ? 'text-primary' : 'text-foreground')}>{label}</span>
                        {price ? (
                          <span className={cn(
                            'font-bold mt-1',
                            isCheapest ? 'text-success' : isSelected ? 'text-primary' : 'text-deal'
                          )}>
                            ¥{price}
                          </span>
                        ) : (
                          <span className="text-subtle mt-1">—</span>
                        )}
                        {isCheapest && <span className="text-[9px] text-success font-semibold mt-0.5">最低</span>}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })()}
          {flightError ? (
            <div className="flex items-center gap-2 bg-danger-light rounded-xl px-4 py-3 text-sm text-danger">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {flightError}
            </div>
          ) : loadingFlights ? (
            <div className="space-y-2.5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-border p-5 animate-pulse h-24" />
              ))}
            </div>
          ) : selectedFlights.length > 0 ? (
            <div className="space-y-2.5">
              {selectedFlights.map((f, i) => (
                <FlightCard key={i} flight={f} date={selectedDate} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-subtle bg-white rounded-xl border border-border">
              该日期暂无可用航班数据
            </div>
          )}
        </div>
      )}
    </div>
  )
}
