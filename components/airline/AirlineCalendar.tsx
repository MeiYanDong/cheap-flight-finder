'use client'
import { AIRLINE_PROMOTIONS, getSortedUpcomingPromotions } from '@/lib/airline-promotions'
import { ExternalLink, Calendar, Zap } from 'lucide-react'

export default function AirlineCalendar() {
  const upcoming = getSortedUpcomingPromotions()
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const promotionsByDay: Record<number, typeof AIRLINE_PROMOTIONS> = {}
  AIRLINE_PROMOTIONS.forEach(p => {
    if (!promotionsByDay[p.day]) promotionsByDay[p.day] = []
    promotionsByDay[p.day].push(p)
  })

  return (
    <div className="space-y-7">
      {/* Upcoming countdown cards */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-warning" />
          <h2 className="font-semibold text-foreground">即将到来的促销</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {upcoming.map(p => (
            <div key={p.code} className="bg-white rounded-xl border border-border hover:shadow-md transition-all overflow-hidden">
              <div className="h-1 w-full" style={{ backgroundColor: p.color }} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-foreground text-sm">{p.airline}</div>
                    <div className="text-xs text-subtle mt-0.5">每月 {p.day} 号</div>
                  </div>
                  <div
                    className="text-2xl font-bold tabular-nums leading-none"
                    style={{ color: p.daysUntil === 0 ? 'var(--danger)' : p.color }}
                  >
                    {p.daysUntil === 0 ? '今天' : p.daysUntil}
                    {p.daysUntil > 0 && <span className="text-sm font-medium ml-0.5">天</span>}
                  </div>
                </div>
                <p className="text-xs text-muted mb-3 line-clamp-2 leading-relaxed">{p.description}</p>
                {p.stackPlatforms && p.stackPlatforms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="text-xs text-subtle">可叠加：</span>
                    {p.stackPlatforms.map(platform => (
                      <span key={platform} className="text-xs bg-surface-raised text-muted px-1.5 py-0.5 rounded font-medium">
                        {platform}
                      </span>
                    ))}
                  </div>
                )}
                <a
                  href={p.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full text-xs font-semibold py-2 rounded-lg transition-colors text-white"
                  style={{ backgroundColor: p.color }}
                >
                  去官网抢票 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly calendar */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-foreground">
            {year}年{month + 1}月 促销日历
          </h2>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {weekDays.map(d => (
            <div key={d} className="text-center text-xs font-medium text-subtle py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} />)}
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1
            const promos = promotionsByDay[day]
            const isToday = day === today.getDate()

            return (
              <div
                key={day}
                className={`min-h-[60px] rounded-lg p-1.5 ${
                  isToday ? 'bg-primary text-white' : promos ? 'bg-surface-raised' : ''
                }`}
              >
                <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-white' : 'text-foreground'}`}>
                  {day}
                </div>
                {promos && (
                  <div className="space-y-0.5">
                    {promos.map(p => (
                      <div
                        key={p.code}
                        className="text-[9px] px-1 py-0.5 rounded text-white font-semibold truncate"
                        style={{ backgroundColor: p.color }}
                        title={p.airline}
                      >
                        {p.airline.replace('中国', '').replace('航空', '航')}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Airline details */}
      <div>
        <h2 className="font-semibold text-foreground mb-4">各航司促销详情</h2>
        <div className="space-y-2.5">
          {AIRLINE_PROMOTIONS.map(p => (
            <div key={p.code} className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-sm transition-shadow">
              <div className="flex items-stretch">
                <div className="w-1 shrink-0" style={{ backgroundColor: p.color }} />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{ backgroundColor: p.color }}
                      >
                        {p.code}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">{p.airline}</div>
                        <div className="text-xs text-subtle">每月 {p.day} 号</div>
                      </div>
                    </div>
                    <a
                      href={p.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:border-primary text-muted hover:text-primary transition-colors"
                    >
                      官网 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="mt-2.5 text-sm text-muted leading-relaxed">{p.description}</p>
                  {p.stackPlatforms && p.stackPlatforms.length > 0 && (
                    <div className="flex items-center gap-2 mt-2.5">
                      <span className="text-xs text-subtle">可叠加平台：</span>
                      {p.stackPlatforms.map(platform => (
                        <span key={platform} className="text-xs bg-primary-light text-primary px-2 py-0.5 rounded-full font-medium">
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
