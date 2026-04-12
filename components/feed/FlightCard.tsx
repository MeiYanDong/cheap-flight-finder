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
}

export default function FlightCard({ flight, date }: FlightCardProps) {
  const dep = formatDateTime(flight.depTime)
  const arr = formatDateTime(flight.arrTime)
  const tag = getPriceTag(flight.price, flight.cabin)
  const flightDate = date || flight.depTime.split(' ')[0]

  const depCityObj = CITIES.find(c => c.name === flight.depCity)
  const arrCityObj = CITIES.find(c => c.name === flight.arrCity)
  const depCode = depCityObj?.code || flight.depCode || ''
  const arrCode = arrCityObj?.code || flight.arrCode || ''
  const depIATA = depCityObj?.airports[0]?.code || depCode
  const arrIATA = arrCityObj?.airports[0]?.code || arrCode

  const ctripUrl = getCtripUrl(depIATA, arrIATA, flightDate)
  const qunarUrl = getQunarUrl(flight.depCity, flight.arrCity, flightDate)

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 p-5">
      <div className="flex items-center gap-6">
        {/* Route visualization */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="text-center min-w-[60px]">
            <div className="text-2xl font-bold text-gray-900 tabular-nums">{dep.time}</div>
            <div className="text-sm font-medium text-gray-600 mt-0.5">{flight.depCity}</div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="text-xs text-gray-400 font-medium">{flight.duration}</div>
            <div className="w-full flex items-center gap-2">
              <div className="h-px flex-1 bg-gray-200" />
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                <Plane className="w-3 h-3 text-blue-500" />
              </div>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              flight.transfer ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
            )}>
              {flight.transfer ? '中转' : '直飞'}
            </div>
          </div>

          <div className="text-center min-w-[60px]">
            <div className="text-2xl font-bold text-gray-900 tabular-nums">{arr.time}</div>
            <div className="text-sm font-medium text-gray-600 mt-0.5">{flight.arrCity}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-14 bg-gray-100 shrink-0" />

        {/* Price */}
        <div className="text-right shrink-0 min-w-[90px]">
          <div className="text-3xl font-bold text-red-500 tabular-nums leading-none">{formatPrice(flight.price)}</div>
          <div className="flex items-center gap-1 justify-end mt-1.5">
            <span className={cn('text-xs font-semibold', tag.color)}>{tag.label}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">参考价</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <a href={ctripUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors w-20">
            携程 <ExternalLink className="w-3 h-3" />
          </a>
          <a href={qunarUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors w-20">
            去哪儿 <ExternalLink className="w-3 h-3" />
          </a>
          <Link href={`/calendar?dep=${depCode}&arr=${arrCode}&depCity=${flight.depCity}&arrCity=${flight.arrCity}`}
            className="flex items-center justify-center gap-1 border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-500 text-xs font-medium px-4 py-2 rounded-lg transition-colors w-20">
            日历 <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-3 text-xs text-gray-400">
        <span className="font-medium text-gray-500">{flight.airline}</span>
        <span>·</span>
        <span>{flight.flightNo}</span>
        <span>·</span>
        <span>{flight.cabin}</span>
        {flight.ontimeRate && (
          <>
            <span>·</span>
            <span>准点率 <span className="text-green-600 font-medium">{flight.ontimeRate}</span></span>
          </>
        )}
      </div>
    </div>
  )
}

