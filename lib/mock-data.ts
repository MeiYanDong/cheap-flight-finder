import { FlightSummary } from '@/types/flight'

// Real data captured from VariFlight API on 2026-04-11
// Used as fallback when API quota is exhausted

export const MOCK_FLIGHTS: Record<string, FlightSummary> = {
  'BJS:SHA:2026-04-12': {
    depCityCode: 'BJS', arrCityCode: 'SHA',
    depCity: '北京', arrCity: '上海',
    date: '2026-04-12', minPrice: 470, minDuration: '1h55m', totalFlights: 188,
    flights: [
      { flightNo: 'HU7601', airline: '海南航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '上海', depAirport: '', arrAirport: '', depTime: '2026-04-12 07:45:00', arrTime: '2026-04-12 10:00:00', duration: '2h15m', transfer: false, cabin: '超值经济舱', price: 470 },
      { flightNo: 'HU7613', airline: '海南航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '上海', depAirport: '', arrAirport: '', depTime: '2026-04-12 07:30:00', arrTime: '2026-04-12 09:50:00', duration: '2h20m', transfer: false, cabin: '超值经济舱', price: 470 },
      { flightNo: 'KN5977', airline: '中国联合航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '上海', depAirport: '', arrAirport: '', depTime: '2026-04-12 20:50:00', arrTime: '2026-04-12 22:55:00', duration: '2h5m', transfer: false, cabin: '超值经济舱', price: 490 },
      { flightNo: 'MU5186', airline: '中国东方航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '上海', depAirport: '', arrAirport: '', depTime: '2026-04-12 07:45:00', arrTime: '2026-04-12 10:05:00', duration: '2h20m', transfer: false, cabin: '经济舱', price: 530 },
      { flightNo: 'CA8341', airline: '中国国际航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '上海', depAirport: '', arrAirport: '', depTime: '2026-04-12 22:00:00', arrTime: '2026-04-12 23:45:00', duration: '1h45m', transfer: false, cabin: '经济舱', price: 600 },
    ],
  },
  'BJS:CAN:2026-04-12': {
    depCityCode: 'BJS', arrCityCode: 'CAN',
    depCity: '北京', arrCity: '广州',
    date: '2026-04-12', minPrice: 719, minDuration: '2h50m', totalFlights: 106,
    flights: [
      { flightNo: 'AQ1002', airline: '九元航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '广州', depAirport: '', arrAirport: '', depTime: '2026-04-12 21:10:00', arrTime: '2026-04-13 00:20:00', duration: '3h10m', transfer: false, cabin: '超值经济舱', price: 719 },
      { flightNo: 'MU6297', airline: '中国东方航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '广州', depAirport: '', arrAirport: '', depTime: '2026-04-12 07:15:00', arrTime: '2026-04-12 10:35:00', duration: '3h20m', transfer: false, cabin: '经济舱', price: 860 },
      { flightNo: 'MF8339', airline: '厦门航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '广州', depAirport: '', arrAirport: '', depTime: '2026-04-12 16:40:00', arrTime: '2026-04-12 20:05:00', duration: '3h25m', transfer: false, cabin: '经济舱', price: 890 },
    ],
  },
  'BJS:CTU:2026-04-12': {
    depCityCode: 'BJS', arrCityCode: 'CTU',
    depCity: '北京', arrCity: '成都',
    date: '2026-04-12', minPrice: 670, minDuration: '2h40m', totalFlights: 80,
    flights: [
      { flightNo: 'KN5157', airline: '中国联合航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '成都', depAirport: '', arrAirport: '', depTime: '2026-04-12 19:35:00', arrTime: '2026-04-12 22:25:00', duration: '2h50m', transfer: false, cabin: '超值经济舱', price: 670 },
      { flightNo: 'CA4103', airline: '中国国际航空', depCode: '', arrCode: '', depCity: '北京', arrCity: '成都', depAirport: '', arrAirport: '', depTime: '2026-04-12 08:00:00', arrTime: '2026-04-12 10:40:00', duration: '2h40m', transfer: false, cabin: '经济舱', price: 780 },
    ],
  },
  'SHA:CAN:2026-04-12': {
    depCityCode: 'SHA', arrCityCode: 'CAN',
    depCity: '上海', arrCity: '广州',
    date: '2026-04-12', minPrice: 579, minDuration: '2h10m', totalFlights: 95,
    flights: [
      { flightNo: 'HU7332', airline: '海南航空', depCode: '', arrCode: '', depCity: '上海', arrCity: '广州', depAirport: '', arrAirport: '', depTime: '2026-04-12 08:00:00', arrTime: '2026-04-12 10:40:00', duration: '2h40m', transfer: false, cabin: '超值经济舱', price: 579 },
      { flightNo: 'MU5167', airline: '中国东方航空', depCode: '', arrCode: '', depCity: '上海', arrCity: '广州', depAirport: '', arrAirport: '', depTime: '2026-04-12 09:30:00', arrTime: '2026-04-12 11:50:00', duration: '2h20m', transfer: false, cabin: '经济舱', price: 650 },
    ],
  },
  'SHA:CTU:2026-04-12': {
    depCityCode: 'SHA', arrCityCode: 'CTU',
    depCity: '上海', arrCity: '成都',
    date: '2026-04-12', minPrice: 580, minDuration: '2h45m', totalFlights: 72,
    flights: [
      { flightNo: '9C6101', airline: '春秋航空', depCode: '', arrCode: '', depCity: '上海', arrCity: '成都', depAirport: '', arrAirport: '', depTime: '2026-04-12 19:50:00', arrTime: '2026-04-12 23:05:00', duration: '3h15m', transfer: false, cabin: '经济舱', price: 580 },
      { flightNo: 'MU5463', airline: '中国东方航空', depCode: '', arrCode: '', depCity: '上海', arrCity: '成都', depAirport: '', arrAirport: '', depTime: '2026-04-12 08:15:00', arrTime: '2026-04-12 11:00:00', duration: '2h45m', transfer: false, cabin: '经济舱', price: 680 },
    ],
  },
  'SHA:SIA:2026-04-12': {
    depCityCode: 'SHA', arrCityCode: 'SIA',
    depCity: '上海', arrCity: '西安',
    date: '2026-04-12', minPrice: 490, minDuration: '2h10m', totalFlights: 60,
    flights: [
      { flightNo: 'MU2177', airline: '中国东方航空', depCode: '', arrCode: '', depCity: '上海', arrCity: '西安', depAirport: '', arrAirport: '', depTime: '2026-04-12 07:00:00', arrTime: '2026-04-12 09:10:00', duration: '2h10m', transfer: false, cabin: '超值经济舱', price: 490 },
      { flightNo: 'HU7781', airline: '海南航空', depCode: '', arrCode: '', depCity: '上海', arrCity: '西安', depAirport: '', arrAirport: '', depTime: '2026-04-12 14:30:00', arrTime: '2026-04-12 16:45:00', duration: '2h15m', transfer: false, cabin: '超值经济舱', price: 520 },
    ],
  },
}

// Mock price calendar data (Beijing -> Shanghai, next 14 days)
export const MOCK_CALENDAR: Record<string, number> = {
  '2026-04-12': 470, '2026-04-13': 450, '2026-04-14': 480,
  '2026-04-15': 450, '2026-04-16': 490, '2026-04-17': 490,
  '2026-04-18': 390, '2026-04-19': 420, '2026-04-20': 560,
  '2026-04-21': 580, '2026-04-22': 490, '2026-04-23': 470,
  '2026-04-24': 460, '2026-04-25': 450,
}

// Mock inspiration destinations from Beijing, budget ¥800
export const MOCK_INSPIRATION = [
  { city: { name: '上海', code: 'SHA', airports: [{ name: '虹桥国际机场', code: 'SHA' }] }, summary: { depCity: '北京', arrCity: '上海', minPrice: 470, minDuration: '1h55m', totalFlights: 188, flights: [] } },
  { city: { name: '成都', code: 'CTU', airports: [{ name: '天府国际机场', code: 'TFU' }] }, summary: { depCity: '北京', arrCity: '成都', minPrice: 670, minDuration: '2h40m', totalFlights: 80, flights: [] } },
  { city: { name: '广州', code: 'CAN', airports: [{ name: '白云国际机场', code: 'CAN' }] }, summary: { depCity: '北京', arrCity: '广州', minPrice: 719, minDuration: '2h50m', totalFlights: 106, flights: [] } },
  { city: { name: '西安', code: 'SIA', airports: [{ name: '咸阳国际机场', code: 'XIY' }] }, summary: { depCity: '北京', arrCity: '西安', minPrice: 750, minDuration: '2h20m', totalFlights: 55, flights: [] } },
]
