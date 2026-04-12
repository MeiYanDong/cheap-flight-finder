import AirlineCalendar from '@/components/airline/AirlineCalendar'

export default function AirlinePromotionsPage() {
  return (
    <>
      <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">航司会员日日历</h1>
          <p className="text-orange-100">各大航司每月固定促销日，提前布局，抢到最低价</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <AirlineCalendar />
      </div>
    </>
  )
}
