import http from './http'

export interface GroupBuyItem {
  id?: number
  title: string
  type: string
  targetCount: number
  currentCount: number
  deadline: string
  location: string
  publisher: string
  status: string
  description?: string
  budget?: number
  meetTime?: string
  contact?: string
}

export function getGroupBuys() {
  return http.get<GroupBuyItem[]>('/groupBuys')
}

export function getGroupBuy(id: number) {
  return http.get<GroupBuyItem>(`/groupBuys/${id}`)
}

export function createGroupBuy(data: GroupBuyItem) {
  return http.post<GroupBuyItem>('/groupBuys', data)
}
