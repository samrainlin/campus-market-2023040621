import http from './http'

export interface LostFoundItem {
  id: number
  title: string
  type: string
  itemName: string
  location: string
  time: string
  contact: string
  description: string
  status: string
}

export function getLostFounds() {
  return http.get<LostFoundItem[]>('/lostFounds')
}
