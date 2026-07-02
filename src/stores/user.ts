import { defineStore } from 'pinia'
import { getUsers, type User } from '../api/user'

const STORAGE_KEY = 'campus-market-current-user'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    currentUser: null as User | null,
  }),

  getters: {
    displayName(state): string {
      return state.currentUser?.name || '未登录'
    },

    profileText(state): string {
      if (!state.currentUser) {
        return '请先登录'
      }
      return `${state.currentUser.college} · ${state.currentUser.grade}`
    },

    username(state): string {
      return state.currentUser?.username || ''
    },

    avatar(state): string {
      return state.currentUser?.avatar || ''
    },

    college(state): string {
      return state.currentUser?.college || ''
    },

    grade(state): string {
      return state.currentUser?.grade || ''
    },

    bio(state): string {
      return state.currentUser?.bio || ''
    },

    email(state): string {
      return state.currentUser?.email || ''
    },

    phone(state): string {
      return state.currentUser?.phone || ''
    },

    wechat(state): string {
      return state.currentUser?.wechat || ''
    },

    campus(state): string {
      return state.currentUser?.campus || ''
    },
  },

  actions: {
    async login(username: string, password: string) {
      let res
      try {
        res = await getUsers()
      } catch (_error) {
        console.error(_error);
        throw new Error('无法连接到 Mock 服务，请检查 JSON Server 是否启动')
      }

      const user = res.data.find((item) => {
        const matchesUsername = item.username === username
        const matchesStudentId = item.studentId === username
        const matchesEmail = item.email === username
        const matchesPassword = item.password === password
        return (matchesUsername || matchesStudentId || matchesEmail) && matchesPassword
      })

      if (!user) {
        throw new Error('账号或密码错误（可用用户名、学号或邮箱登录）')
      }

      this.currentUser = user
      this.isLoggedIn = true
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    },

    restoreLogin() {
      const raw = localStorage.getItem(STORAGE_KEY)

      if (!raw) {
        return
      }

      try {
        this.currentUser = JSON.parse(raw)
        this.isLoggedIn = true
      } catch (error) {
        console.error(error)
        localStorage.removeItem(STORAGE_KEY)
      }
    },

    logout() {
      this.currentUser = null
      this.isLoggedIn = false
      localStorage.removeItem(STORAGE_KEY)
    },

    updateProfile(data: Partial<User>) {
      if (!this.currentUser) return
      this.currentUser = { ...this.currentUser, ...data }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.currentUser))
    },
  },
})
