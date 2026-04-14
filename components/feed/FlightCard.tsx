'use client'
import { Flight } from '@/types/flight'
import { formatPrice, formatDateTime, getPriceTag, getCtripUrl, getQunarUrl } from '@/lib/price-utils'
import { CITIES } from '@/lib/cities'
import { Plane, ExternalLink, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface FlightCardProps {
  flight: Flight
  date?: string
  index?: number
}

export default function FlightCard({ flight, date, index = 0 }: FlightCardProps) {
  const dep = formatDateTime(flight.depTime)
  const arr = formatDateTime(flight.arrTime)
  const tag = getPriceTag(flight.price, flight.cabin)
  // Prefer explicit date prop, then API-attached date field, then depTime date
  // (mock data has hardcoded historical depTime, so we must not rely on it)
  const flightDate = date || (flight as any).date || flight.depTime.split(' ')[0]

  const depCityObj = CITIES.find(c => c.name === flight.depCity)
  const arrCityObj = CITIES.find(c => c.name === flight.arrCity)
  const depCode = depCityObj?.code || flight.depCode || ''
  const arrCode = arrCityObj?.code || flight.arrCode || ''
  const depIATA = depCityObj?.airports[0]?.code || depCode
  const arrIATA = arrCityObj?.airports[0]?.code || arrCode

  const ctripUrl = getCtripUrl(depIATA, arrIATA, flightDate)
  const qunarUrl = getQunarUrl(flight.depCity, flight.arrCity, flightDate)

  return (
    <div
      className="flight-card-enter bg-white rounded-xl border border-border hover:border-border-strong hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 px-5 py-4"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-center gap-5">
        {/* Route */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Departure */}
          <div className="text-center min-w-[56px]">
            <div className="text-2xl font-bold text-foreground tabular-nums leading-none">{dep.time}</div>
            <div className="text-xs font-medium text-muted mt-1">{flight.depCity}</div>
            {flightDate && (
              <div className="text-[10px] text-subtle mt-0.5">
                {parseInt(flightDate.split('-')[1])}月{parseInt(flightDate.split('-')[2])}日
              </div>
            )}
          </div>

          {/* Flight line */}
          <div className="flex-1 flex flex-col items-center gap-1.5">
            <span className="text-[11px] text-subtle font-medium">{flight.duration}</span>
            <div className="w-full flex items-center gap-1.5">
              <div className="h-px flex-1 bg-border" />
              <Plane className="w-3.5 h-3.5 text-subtle" />
              <div className="h-px flex-1 bg-border" />
            </div>
            <span className={cn(
              'text-[11px] font-semibold px-2 py-0.5 rounded-full',
              flight.transfer
                ? 'bg-warning-light text-warning'
                : 'bg-success-light text-success'
            )}>
              {flight.transfer ? '中转' : '直飞'}
            </span>
          </div>

          {/* Arrival */}
          <div className="text-center min-w-[56px]">
            <div className="text-2xl font-bold text-foreground tabular-nums leading-none">{arr.time}</div>
            <div className="text-xs font-medium text-muted mt-1">{flight.arrCity}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-12 bg-border shrink-0" />

        {/* Price */}
        <div className="text-right shrink-0 min-w-[88px]">
          <div className="text-3xl font-bold text-deal tabular-nums leading-none">{formatPrice(flight.price)}</div>
          <div className="flex items-center gap-1 justify-end mt-1.5">
            <span className={cn('text-[11px] font-semibold', tag.color)}>{tag.label}</span>
            <span className="text-[11px] text-subtle">参考价</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <a
            href={ctripUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors w-[76px]"
          >
            携程 <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={qunarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-warning hover:bg-deal-hover text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors w-[76px]"
          >
            去哪儿 <ExternalLink className="w-3 h-3" />
          </a>
          <Link
            href={`/calendar?dep=${depCode}&arr=${arrCode}&depCity=${flight.depCity}&arrCity=${flight.arrCity}`}
            className="flex items-center justify-center gap-1 border border-border hover:border-primary hover:text-primary text-muted text-xs font-medium px-4 py-1.5 rounded-lg transition-colors w-[76px]"
          >
            日历 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-border flex items-center gap-2.5 text-[11px] text-subtle">
        <span className="font-medium text-muted">{flight.airline}</span>
        <span className="text-border-strong">·</span>
        <span>{flight.flightNo}</span>
        <span className="text-border-strong">·</span>
        <span>{flight.cabin}</span>
        {flight.ontimeRate && (
          <>
            <span className="text-border-strong">·</span>
            <span>准点率 <span className="text-success font-semibold">{flight.ontimeRate}</span></span>
          </>
        )}
      </div>
    </div>
  )
}
