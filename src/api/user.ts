import http from './http'

export interface User {
  id?: number
  username: string
  password: string
  name: string
  college: string
  grade: string
  avatar: string
  bio: string
  studentId?: string
  email?: string
  phone?: string
  wechat?: string
  campus?: string
  notify?: boolean
  agree?: boolean
}

export function getUsers() {
  return http.get<User[]>('/users')
}

export function createUser(data: User) {
  return http.post<User>('/users', data)
}

export function updateUser(id: number, data: Partial<User>) {
  return http.patch<User>(`/users/${id}`, data)
}
