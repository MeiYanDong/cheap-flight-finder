'use client'
import { useState } from 'react'
import { CITIES } from '@/lib/cities'
import { SlidersHorizontal, MapPin } from 'lucide-react'

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
  { label: '不限', value: 99999 },
]

export default function FilterBar({ onFilter }: FilterBarProps) {
  const [depCity, setDepCity] = useState('北京')
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
    <div className="bg-white rounded-xl border border-gray-100 px-5 py-3.5 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        筛选
      </div>

      {/* Departure city */}
      <div className="flex items-center gap-2">
        <MapPin className="w-3.5 h-3.5 text-gray-400" />
        <select
          value={depCity}
          onChange={e => apply({ depCity: e.target.value })}
          className="text-sm font-medium text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer"
        >
          {CITIES.slice(0, 10).map(c => (
            <option key={c.code} value={c.name}>{c.name}出发</option>
          ))}
        </select>
      </div>

      <div className="w-px h-4 bg-gray-200" />

      {/* Price limit */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400 mr-1">价格</span>
        {PRICE_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => apply({ maxPrice: opt.value })}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              maxPrice === opt.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="w-px h-4 bg-gray-200" />

      {/* Sort */}
      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-xs text-gray-400 mr-1">排序</span>
        {[{ value: 'price', label: '价格最低' }, { value: 'discount', label: '折扣最大' }].map(opt => (
          <button
            key={opt.value}
            onClick={() => apply({ sortBy: opt.value as any })}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
              sortBy === opt.value
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
