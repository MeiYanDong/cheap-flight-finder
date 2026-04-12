import { City } from '@/types/flight'

export const CITIES: City[] = [
  { name: '北京', code: 'BJS', airports: [{ name: '首都国际机场', code: 'PEK' }, { name: '大兴国际机场', code: 'PKX' }] },
  { name: '上海', code: 'SHA', airports: [{ name: '虹桥国际机场', code: 'SHA' }, { name: '浦东国际机场', code: 'PVG' }] },
  { name: '广州', code: 'CAN', airports: [{ name: '白云国际机场', code: 'CAN' }] },
  { name: '深圳', code: 'SZX', airports: [{ name: '宝安国际机场', code: 'SZX' }] },
  { name: '成都', code: 'CTU', airports: [{ name: '天府国际机场', code: 'TFU' }, { name: '双流国际机场', code: 'CTU' }] },
  { name: '杭州', code: 'HGH', airports: [{ name: '萧山国际机场', code: 'HGH' }] },
  { name: '重庆', code: 'CKG', airports: [{ name: '江北国际机场', code: 'CKG' }] },
  { name: '武汉', code: 'WUH', airports: [{ name: '天河国际机场', code: 'WUH' }] },
  { name: '西安', code: 'SIA', airports: [{ name: '咸阳国际机场', code: 'XIY' }] },
  { name: '南京', code: 'NKG', airports: [{ name: '禄口国际机场', code: 'NKG' }] },
  { name: '三亚', code: 'SYX', airports: [{ name: '凤凰国际机场', code: 'SYX' }] },
  { name: '昆明', code: 'KMG', airports: [{ name: '长水国际机场', code: 'KMG' }] },
  { name: '厦门', code: 'XMN', airports: [{ name: '高崎国际机场', code: 'XMN' }] },
  { name: '青岛', code: 'TAO', airports: [{ name: '胶东国际机场', code: 'TAO' }] },
  { name: '长沙', code: 'CSX', airports: [{ name: '黄花国际机场', code: 'CSX' }] },
  { name: '郑州', code: 'CGO', airports: [{ name: '新郑国际机场', code: 'CGO' }] },
  { name: '哈尔滨', code: 'HRB', airports: [{ name: '太平国际机场', code: 'HRB' }] },
  { name: '乌鲁木齐', code: 'URC', airports: [{ name: '地窝堡国际机场', code: 'URC' }] },
  { name: '贵阳', code: 'KWE', airports: [{ name: '龙洞堡国际机场', code: 'KWE' }] },
  { name: '南宁', code: 'NNG', airports: [{ name: '吴圩国际机场', code: 'NNG' }] },
]

export const POPULAR_ROUTES = [
  { dep: { name: '北京', code: 'BJS' }, arr: { name: '上海', code: 'SHA' } },
  { dep: { name: '北京', code: 'BJS' }, arr: { name: '广州', code: 'CAN' } },
  { dep: { name: '北京', code: 'BJS' }, arr: { name: '成都', code: 'CTU' } },
  { dep: { name: '北京', code: 'BJS' }, arr: { name: '三亚', code: 'SYX' } },
  { dep: { name: '上海', code: 'SHA' }, arr: { name: '广州', code: 'CAN' } },
  { dep: { name: '上海', code: 'SHA' }, arr: { name: '成都', code: 'CTU' } },
  { dep: { name: '上海', code: 'SHA' }, arr: { name: '三亚', code: 'SYX' } },
  { dep: { name: '上海', code: 'SHA' }, arr: { name: '西安', code: 'SIA' } },
  { dep: { name: '广州', code: 'CAN' }, arr: { name: '北京', code: 'BJS' } },
  { dep: { name: '广州', code: 'CAN' }, arr: { name: '成都', code: 'CTU' } },
  { dep: { name: '成都', code: 'CTU' }, arr: { name: '上海', code: 'SHA' } },
  { dep: { name: '深圳', code: 'SZX' }, arr: { name: '北京', code: 'BJS' } },
]

export function getCityByCode(code: string): City | undefined {
  return CITIES.find(c => c.code === code)
}

export function searchCities(query: string): City[] {
  const q = query.toLowerCase()
  return CITIES.filter(c =>
    c.name.includes(query) ||
    c.code.toLowerCase().includes(q) ||
    c.airports.some(a => a.code.toLowerCase().includes(q) || a.name.includes(query))
  )
}
