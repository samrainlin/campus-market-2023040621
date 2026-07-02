import http from './http'

export interface ErrandItem {
  id?: number
  title: string
  taskType: string
  reward: number
  pickupLocation: string
  deliveryLocation: string
  deadline: string
  publisher: string
  status: string
  description?: string
  contact?: string
}

export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}

export function getErrand(id: number) {
  return http.get<ErrandItem>(`/errands/${id}`)
}

export function createErrand(data: ErrandItem) {
  return http.post<ErrandItem>('/errands', data)
}
