'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Plane, Calendar, MapPin, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/', label: '特价发现', icon: Plane },
  { href: '/calendar', label: '价格日历', icon: Calendar },
  { href: '/inspiration', label: '灵感', icon: MapPin },
  { href: '/airline-promotions', label: '会员日', icon: Star },
]

export default function Header() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 sm:h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary-hover transition-colors">
            <Plane className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
          </div>
          <span className="font-bold text-foreground text-xs sm:text-sm tracking-tight">特价机票</span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all',
                pathname === href
                  ? 'bg-primary-light text-primary'
                  : 'text-muted hover:text-foreground hover:bg-surface-raised'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
