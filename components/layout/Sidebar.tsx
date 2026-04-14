'use client'
import Link from 'next/link'
import { getSortedUpcomingPromotions } from '@/lib/airline-promotions'
import { Zap, Lightbulb } from 'lucide-react'

export default function Sidebar() {
  const promotions = getSortedUpcomingPromotions().slice(0, 4)

  return (
    <aside className="w-56 shrink-0 space-y-3">
      {/* Airline promotion countdown */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-2 border-b border-border">
          <Zap className="w-3.5 h-3.5 text-warning" />
          <h3 className="font-semibold text-foreground text-xs tracking-wide">航司会员日</h3>
        </div>
        <div className="divide-y divide-border">
          {promotions.map(p => (
            <div key={p.code} className="px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-6 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                <div>
                  <div className="text-xs font-medium text-foreground leading-tight">
                    {p.airline.replace('中国', '')}
                  </div>
                  <div className="text-[11px] text-subtle">每月{p.day}号</div>
                </div>
              </div>
              <div className={`text-xs font-bold tabular-nums ${p.daysUntil === 0 ? 'text-danger' : 'text-warning'}`}>
                {p.daysUntil === 0 ? '今天！' : `${p.daysUntil}天`}
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-border">
          <Link href="/airline-promotions" className="text-[11px] text-primary hover:text-primary-hover font-medium transition-colors">
            查看完整日历 →
          </Link>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-2 border-b border-border">
          <Lightbulb className="w-3.5 h-3.5 text-deal" />
          <h3 className="font-semibold text-foreground text-xs tracking-wide">省钱贴士</h3>
        </div>
        <ul className="px-4 py-3 space-y-2">
          {[
            '周二、周三出发通常最便宜',
            '提前21-30天购票性价比最高',
            '航司会员日可享额外折扣',
            '早班机和晚班机价格更低',
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-muted leading-relaxed">
              <span className="w-3.5 h-3.5 rounded-full bg-primary-light text-primary flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">{i + 1}</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Data notice */}
      <p className="text-[10px] text-subtle px-1 leading-relaxed">
        价格来自飞常准，为参考价，以携程/去哪儿实际页面为准
      </p>
    </aside>
  )
}
