export interface Flight {
  flightNo: string
  airline: string
  depCode: string
  arrCode: string
  depCity: string
  arrCity: string
  depAirport: string
  arrAirport: string
  depTime: string
  arrTime: string
  duration: string
  price: number
  cabin: string
  transfer: boolean
  ontimeRate?: string
  terminal?: string
}

export interface FlightSummary {
  depCityCode: string
  arrCityCode: string
  depCity: string
  arrCity: string
  date: string
  minPrice: number
  minDuration: string
  totalFlights: number
  flights: Flight[]
}

export interface PriceCalendarDay {
  date: string
  minPrice: number | null
  flights?: Flight[]
}

export interface AirlinePromotion {
  airline: string
  code: string
  day: number // day of month
  description: string
  officialUrl: string
  color: string
  stackPlatforms?: string[]
}

export interface City {
  name: string
  code: string // IATA city code
  airports: { name: string; code: string }[]
}
