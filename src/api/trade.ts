import http from './http'

export interface TradeItem {
  id?: number
  title: string
  category: string
  price: number
  condition: string
  location: string
  publisher: string
  publishTime: string
  image: string
  status: string
  description?: string
  originalPrice?: number
  negotiateMethod?: string
  transactionMethod?: string
  contact?: string
}

export function getTrades() {
  return http.get<TradeItem[]>('/trades')
}

export function getTrade(id: number) {
  return http.get<TradeItem>(`/trades/${id}`)
}

export function createTrade(data: TradeItem) {
  return http.post<TradeItem>('/trades', data)
}
