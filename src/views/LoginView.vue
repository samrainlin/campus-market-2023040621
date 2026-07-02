<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

import FormField from '../components/FormField.vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const submitting = ref(false)
const loginError = ref('')

const form = reactive({
  username: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
  loginError.value = ''
}

function validateForm() {
  clearErrors()

  if (!form.username) {
    errors.username = '请输入用户名'
  }

  if (!form.password) {
    errors.password = '请输入密码'
  }

  return Object.values(errors).every((message) => !message)
}

async function handleLogin() {
  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    await userStore.login(form.username, form.password)
    window.alert('登录成功')
    router.push('/user')
  } catch (error) {
    console.error(error)
    loginError.value = (error as Error)?.message || '登录失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="auth-page">
    <div class="auth-card">
      <h1>登录校园轻集市</h1>
      <p class="desc">登录后可以发布信息、收藏内容并进入个人中心。</p>

      <form class="auth-form" @submit.prevent="handleLogin">
        <FormField label="用户名 / 学号 / 邮箱" required :error="errors.username">
          <input v-model.trim="form.username" type="text" placeholder="请输入用户名、学号或邮箱" />
        </FormField>

        <FormField label="密码" required :error="errors.password">
          <input v-model.trim="form.password" type="password" placeholder="请输入密码" />
        </FormField>

        <p v-if="loginError" class="login-error">{{ loginError }}</p>

        <button class="primary" type="submit" :disabled="submitting">
          {{ submitting ? '登录中...' : '登录' }}
        </button>
      </form>

      <p class="switch">
        还没有账号？
        <RouterLink to="/register">去注册</RouterLink>
      </p>

      <p class="hint">测试账号：student / 123456</p>
    </div>
  </section>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 120px);
  display: grid;
  place-items: center;
  padding: 40px 20px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.auth-card h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #1f2937;
}

.desc {
  margin: 0 0 24px;
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
}

.auth-form {
  display: grid;
  gap: 16px;
}

input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
}

.login-error {
  margin: 0;
  color: #dc2626;
  font-size: 14px;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: 8px;
}

.primary {
  border: none;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  background: #2563eb;
  color: #fff;
  font-size: 15px;
  width: 100%;
}

.primary:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.switch {
  margin: 18px 0 0;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.switch a {
  color: #2563eb;
  text-decoration: none;
  margin-left: 4px;
}

.switch a:hover {
  text-decoration: underline;
}

.hint {
  margin: 12px 0 0;
  text-align: center;
  color: #9ca3af;
  font-size: 12px;
}
</style>
