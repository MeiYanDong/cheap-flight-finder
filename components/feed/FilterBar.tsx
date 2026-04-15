'use client'
import { useState } from 'react'
import { CITIES } from '@/lib/cities'
import { SlidersHorizontal, MapPin, ChevronDown } from 'lucide-react'

interface FilterBarProps {
  onFilter: (filters: FilterState) => void
}

export interface FilterState {
  depCity: string
  maxPrice: number
  sortBy: 'price' | 'discount'
}

const PRICE_OPTIONS = [
  { label: '¥300以下', value: 300 },
  { label: '¥500以下', value: 500 },
  { label: '¥800以下', value: 800 },
  { label: '不限价', value: 99999 },
]

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [depCity, setDepCity] = useState('全部')
  const [maxPrice, setMaxPrice] = useState(99999)
  const [sortBy, setSortBy] = useState<'price' | 'discount'>('price')

  function apply(updates: Partial<FilterState>) {
    const next = { depCity, maxPrice, sortBy, ...updates }
    if (updates.depCity !== undefined) setDepCity(updates.depCity)
    if (updates.maxPrice !== undefined) setMaxPrice(updates.maxPrice)
    if (updates.sortBy !== undefined) setSortBy(updates.sortBy)
    onFilter(next)
  }

  return (
    <div className="bg-white border border-border rounded-xl px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3 sm:gap-5 shadow-sm">
      {/* Departure city */}
      <div className="flex items-center gap-1.5 relative">
        <MapPin className="w-3.5 h-3.5 text-subtle shrink-0" />
        <select
          value={depCity}
          onChange={e => apply({ depCity: e.target.value })}
          className="text-sm font-semibold text-foreground bg-transparent border-none focus:outline-none cursor-pointer appearance-none pr-5"
        >
          <option value="全部">全部出发</option>
          {CITIES.slice(0, 10).map(c => (
            <option key={c.code} value={c.name}>{c.name}出发</option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-subtle absolute right-0 pointer-events-none" />
      </div>

      <div className="hidden sm:block w-px h-4 bg-border shrink-0" />

      {/* Price limit */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-subtle mr-0.5">价格上限</span>
        {PRICE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => apply({ maxPrice: opt.value })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              maxPrice === opt.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-surface-raised'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="hidden sm:block w-px h-4 bg-border shrink-0" />

      {/* Sort */}
      <div className="flex items-center gap-1.5 ml-auto">
        <SlidersHorizontal className="w-3.5 h-3.5 text-subtle" />
        {[{ value: 'price', label: '价格最低' }, { value: 'discount', label: '折扣最大' }].map(opt => (
          <button
            key={opt.value}
            onClick={() => apply({ sortBy: opt.value as 'price' | 'discount' })}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
              sortBy === opt.value
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted hover:text-foreground hover:bg-surface-raised'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
