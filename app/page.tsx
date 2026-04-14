import FlightFeed from '@/components/feed/FlightFeed'
import Sidebar from '@/components/layout/Sidebar'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="flex gap-7">
        <div className="flex-1 min-w-0">
          <FlightFeed />
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
