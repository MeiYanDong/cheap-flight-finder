import FlightFeed from '@/components/feed/FlightFeed'
import Sidebar from '@/components/layout/Sidebar'
import { Info } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">今天，哪里的机票最便宜？</h1>
          <p className="text-blue-200 text-base">聚合国内热门航线低价航班，帮你发现出行机会</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Data source notice */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-700 mb-6">
          <Info className="w-4 h-4 shrink-0" />
          <span>以下价格来自飞常准，为<strong>参考价</strong>，实际价格以携程/去哪儿购票页面为准，可能存在差异。</span>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0">
            <FlightFeed />
          </div>
          <Sidebar />
        </div>
      </div>
    </>
  )
}
