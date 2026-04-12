'use client'
import Link from 'next/link'
import { getSortedUpcomingPromotions } from '@/lib/airline-promotions'
import { Zap, Lightbulb, ExternalLink } from 'lucide-react'

export default function Sidebar() {
  const promotions = getSortedUpcomingPromotions().slice(0, 4)

  return (
    <aside className="w-64 shrink-0 space-y-4">
      {/* Airline promotion countdown */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-orange-500" />
          <h3 className="font-semibold text-gray-800 text-sm">航司会员日倒计时</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {promotions.map(p => (
            <div key={p.code} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-1 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <div>
                  <div className="text-xs font-medium text-gray-700 leading-tight">
                    {p.airline.replace('中国', '')}
                  </div>
                  <div className="text-xs text-gray-400">每月{p.day}号</div>
                </div>
              </div>
              <div className={`text-sm font-bold tabular-nums ${p.daysUntil === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                {p.daysUntil === 0 ? '今天！' : `${p.daysUntil}天`}
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-gray-50">
          <Link href="/airline-promotions" className="text-xs text-blue-500 hover:text-blue-700 font-medium flex items-center gap-1">
            查看完整日历 <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-50 flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-yellow-500" />
          <h3 className="font-semibold text-gray-800 text-sm">省钱小贴士</h3>
        </div>
        <ul className="px-4 py-3 space-y-2.5">
          {[
            '周二、周三出发通常最便宜',
            '提前21-30天购票性价比最高',
            '航司会员日可享受额外折扣',
            '早班机和晚班机价格更低',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
