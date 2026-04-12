import { AirlinePromotion } from '@/types/flight'

export const AIRLINE_PROMOTIONS: AirlinePromotion[] = [
  {
    airline: '海南航空',
    code: 'HU',
    day: 8,
    description: '海航会员日，会员专属特价，提前24小时开抢，国内线折扣力度大',
    officialUrl: 'https://www.hnair.com',
    color: '#E8B84B',
    stackPlatforms: ['飞猪'],
  },
  {
    airline: '中国东方航空',
    code: 'MU',
    day: 18,
    description: '东方万里行会员日，国内线特价，部分航线低至3折',
    officialUrl: 'https://www.ceair.com',
    color: '#1E5FA8',
    stackPlatforms: ['飞猪88VIP', '携程'],
  },
  {
    airline: '厦门航空',
    code: 'MF',
    day: 18,
    description: '白鹭嘉程会员日，与东航同日，东南沿海航线折扣明显',
    officialUrl: 'https://www.xiamenair.com',
    color: '#0066B3',
    stackPlatforms: ['携程'],
  },
  {
    airline: '春秋航空',
    code: '9C',
    day: 27,
    description: '春秋特价日，低价航班集中释放，部分航线低至1折起',
    officialUrl: 'https://www.ch.com',
    color: '#FF6600',
    stackPlatforms: ['去哪儿'],
  },
  {
    airline: '中国南方航空',
    code: 'CZ',
    day: 28,
    description: '明珠会员日，国内线为主，常旅客积分双倍',
    officialUrl: 'https://www.csair.com',
    color: '#0066CC',
    stackPlatforms: ['飞猪', '携程'],
  },
]

export function getDaysUntilPromotion(day: number): number {
  const today = new Date()
  const currentDay = today.getDate()
  if (day > currentDay) {
    return day - currentDay
  } else {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, day)
    const diff = nextMonth.getTime() - today.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }
}

export function getNextPromotionDate(day: number): Date {
  const today = new Date()
  const currentDay = today.getDate()
  if (day > currentDay) {
    return new Date(today.getFullYear(), today.getMonth(), day)
  } else {
    return new Date(today.getFullYear(), today.getMonth() + 1, day)
  }
}

export function getSortedUpcomingPromotions(): (AirlinePromotion & { daysUntil: number; nextDate: Date })[] {
  return AIRLINE_PROMOTIONS
    .map(p => ({
      ...p,
      daysUntil: getDaysUntilPromotion(p.day),
      nextDate: getNextPromotionDate(p.day),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil)
}
