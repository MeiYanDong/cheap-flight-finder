import InspirationSearch from '@/components/inspiration/InspirationSearch'

export default function InspirationPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">有预算，不知道去哪？</h1>
          <p className="text-blue-200">输入出发城市和预算，发现当前能飞到的目的地</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <InspirationSearch />
      </div>
    </>
  )
}
