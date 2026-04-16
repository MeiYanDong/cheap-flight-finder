'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import { formatPrice, getCtripUrl, getQunarUrl, getPriceHeatColor, formatDateKey, addDays } from '@/lib/price-utils'
import { CITIES } from '@/lib/cities'
import { Plane, ExternalLink, ArrowLeft, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

function PriceTrendChart({ prices }: { prices: { date: string; price: number | null }[] }) {
  const valid = prices.filter(p => p.price !== null) as { date: string; price: number }[]
  if (valid.length < 2) return null

  const min = Math.min(...valid.map(p => p.price))
  const max = Math.max(...valid.map(p => p.price))
  const range = max - min || 1

  const W = 560
  const H = 120
  const PAD = { top: 16, right: 16, bottom: 32, left: 48 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const points = prices.map((p, i) => {
    const x = PAD.left + (i / (prices.length - 1)) * chartW
    const y = p.price !== null
      ? PAD.top + chartH - ((p.price - min) / range) * chartH
      : null
    return { x, y, ...p }
  })

  const pathD = points
    .filter(p => p.y !== null)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 120 }}>
      {/* Grid lines */}
      {[0, 0.5, 1].map(t => {
        const y = PAD.top + t * chartH
        const price = Math.round(max - t * range)
        return (
          <g key={t}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">¥{price}</text>
          </g>
        )
      })}

      {/* Line */}
      <path d={pathD} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round" />

      {/* Dots + labels */}
      {points.map((p, i) => {
        if (p.y === null) return null
        const d = new Date(p.date)
        const label = `${d.getMonth() + 1}/${d.getDate()}`
        const isCheapest = p.price === min
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={isCheapest ? 5 : 3}
              fill={isCheapest ? 'var(--success)' : 'var(--primary)'}
              stroke="white" strokeWidth="1.5" />
            <text x={p.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#9ca3af">{label}</text>
            {isCheapest && (
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="9" fill="var(--success)" fontWeight="600">
                最低
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

function FlightDetailContent() {
  const params = useSearchParams()
  const flightNo = params.get('flightNo') || ''
  const airline = params.get('airline') || ''
  const depCity = params.get('depCity') || ''
  const arrCity = params.get('arrCity') || ''
  const depTime = params.get('depTime') || ''
  const arrTime = params.get('arrTime') || ''
  const duration = params.get('duration') || ''
  const cabin = params.get('cabin') || ''
  const price = parseInt(params.get('price') || '0')
  const date = params.get('date') || ''
  const dep = params.get('dep') || ''
  const arr = params.get('arr') || ''

  const depCityObj = CITIES.find(c => c.name === depCity)
  const arrCityObj = CITIES.find(c => c.name === arrCity)
  const depIATA = depCityObj?.airports[0]?.code || dep
  const arrIATA = arrCityObj?.airports[0]?.code || arr

  const ctripUrl = getCtripUrl(depIATA, arrIATA, date)
  const qunarUrl = getQunarUrl(depCity, arrCity, date)

  const [trend, setTrend] = useState<{ date: string; price: number | null }[]>([])
  const [loadingTrend, setLoadingTrend] = useState(false)

  useEffect(() => {
    if (!dep || !arr || !depCity || !arrCity) return
    setLoadingTrend(true)
    const today = new Date()
    const dates = Array.from({ length: 7 }, (_, i) => {
      const d = addDays(today, i + 1)
      return formatDateKey(d)
    })

    fetch(`/api/calendar?dep=${dep}&arr=${arr}&depCity=${depCity}&arrCity=${arrCity}&days=7`)
      .then(r => r.json())
      .then(data => {
        const cal = data.calendar || {}
        setTrend(dates.map(d => ({ date: d, price: cal[d] ?? null })))
      })
      .finally(() => setLoadingTrend(false))
  }, [dep, arr])

  const depHour = depTime ? depTime.split(' ')[1]?.slice(0, 5) : ''
  const arrHour = arrTime ? arrTime.split(' ')[1]?.slice(0, 5) : ''
  const dateLabel = date ? (() => {
    const d = new Date(date)
    return `${d.getMonth() + 1}月${d.getDate()}日`
  })() : ''

  const trendMin = trend.filter(t => t.price).map(t => t.price as number)
  const cheapestDate = trend.find(t => t.price === Math.min(...trendMin))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground mb-5 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        返回
      </Link>

      {/* Flight header */}
      <div className="bg-white rounded-xl border border-border p-5 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-subtle mb-1">{airline} · {flightNo} · {cabin}</div>
            <div className="text-sm font-medium text-muted">{dateLabel}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-deal tabular-nums">{formatPrice(price)}</div>
            <div className="text-xs text-subtle mt-0.5">含税参考价</div>
          </div>
        </div>

        {/* Route */}
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground tabular-nums">{depHour}</div>
            <div className="text-sm font-medium text-muted mt-1">{depCity}</div>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-1 text-xs text-subtle">
              <Clock className="w-3 h-3" />
              {duration}
            </div>
            <div className="w-full flex items-center gap-1.5">
              <div className="h-px flex-1 bg-border" />
              <Plane className="w-4 h-4 text-subtle" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-success-light text-success">直飞</span>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground tabular-nums">{arrHour}</div>
            <div className="text-sm font-medium text-muted mt-1">{arrCity}</div>
          </div>
        </div>

        {/* Buy buttons */}
        <div className="flex gap-2 mt-5">
          <a href={ctripUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            去携程购买 <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a href={qunarUrl} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-warning hover:bg-deal-hover text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            去去哪儿购买 <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 7-day price trend */}
      <div className="bg-white rounded-xl border border-border p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground text-sm">未来7天同航线价格走势</h2>
          <span className="text-xs text-subtle">（参考价）</span>
        </div>

        {loadingTrend ? (
          <div className="h-[120px] bg-surface-raised rounded-lg animate-pulse" />
        ) : trend.length > 0 ? (
          <>
            <PriceTrendChart prices={trend} />
            {cheapestDate && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-success font-medium">
                <CheckCircle className="w-3.5 h-3.5" />
                {(() => {
                  const d = new Date(cheapestDate.date)
                  return `${d.getMonth() + 1}月${d.getDate()}日`
                })()} 价格最低，仅 {formatPrice(cheapestDate.price!)}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-subtle py-8 justify-center">
            <AlertCircle className="w-4 h-4" />
            暂无价格走势数据
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl border border-border p-4 shadow-sm">
        <h2 className="font-semibold text-foreground text-sm mb-3">省钱建议</h2>
        <ul className="space-y-2 text-xs text-muted">
          <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span>周二、周三出发通常最便宜</li>
          <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span>提前21天购买性价比最高</li>
          <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span>同时对比携程和去哪儿，价格可能不同</li>
          <li className="flex items-start gap-2"><span className="text-success mt-0.5">✓</span>航司会员日（每月8/18/27/28号）可能有额外折扣</li>
        </ul>
      </div>
    </div>
  )
}

export default function FlightPage() {
  return (
    <Suspense fallback={
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-xl border border-border p-5 h-48 animate-pulse" />
      </div>
    }>
      <FlightDetailContent />
    </Suspense>
  )
}
