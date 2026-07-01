import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref('校园用户')
  const college = ref('计算机学院')
  const grade = ref('大二')
  const avatar = ref('https://picsum.photos/seed/campus-user/80/80')
  const isLoggedIn = ref(true)

  const displayName = computed(() => username.value)

  const profileText = computed(() => {
    return `${college.value} · ${grade.value}`
  })

  function setUser(user: {
    username: string
    college?: string
    grade?: string
    avatar?: string
  }) {
    username.value = user.username
    if (user.college !== undefined) college.value = user.college
    if (user.grade !== undefined) grade.value = user.grade
    if (user.avatar !== undefined) avatar.value = user.avatar
    isLoggedIn.value = true
  }

  function logout() {
    username.value = '校园用户'
    college.value = '计算机学院'
    grade.value = '大二'
    avatar.value = 'https://picsum.photos/seed/campus-user/80/80'
    isLoggedIn.value = false
  }

  return {
    username,
    college,
    grade,
    avatar,
    isLoggedIn,
    displayName,
    profileText,
    setUser,
    logout,
  }
})
