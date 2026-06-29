import http from './http'

export interface ErrandItem {
  id: number
  title: string
  taskType: string
  reward: number
  pickupLocation: string
  deliveryLocation: string
  deadline: string
  publisher: string
  status: string
  description?: string
}

export function getErrands() {
  return http.get<ErrandItem[]>('/errands')
}
