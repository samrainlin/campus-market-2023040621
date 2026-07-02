<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import FormField from '../components/FormField.vue'
import { getUsers, createUser } from '../api/user'

const router = useRouter()
const submitting = ref(false)

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  college: '',
  grade: '',
})

const errors = reactive<Record<string, string>>({})

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function validateForm(): boolean {
  clearErrors()
  let valid = true

  if (!form.username) {
    errors.username = '请输入用户名'
    valid = false
  } else if (form.username.length < 3) {
    errors.username = '用户名至少 3 个字符'
    valid = false
  }

  if (!form.password) {
    errors.password = '请输入密码'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少 6 个字符'
    valid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    valid = false
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = '两次密码不一致'
    valid = false
  }

  if (!form.name) {
    errors.name = '请输入姓名'
    valid = false
  }

  if (!form.college) {
    errors.college = '请输入学院'
    valid = false
  }

  if (!form.grade) {
    errors.grade = '请输入年级'
    valid = false
  }

  return valid
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    // 检查用户名是否已存在
    const res = await getUsers()
    const exists = res.data.some((item) => item.username === form.username)

    if (exists) {
      errors.username = '该用户名已被使用'
      submitting.value = false
      return
    }

    // 创建新用户
    await createUser({
      username: form.username,
      password: form.password,
      name: form.name,
      college: form.college,
      grade: form.grade,
      avatar: '',
      bio: '新用户注册，欢迎来到校园轻集市。',
    })

    window.alert('注册成功，请前往登录')
    router.push('/login')
  } catch (error) {
    console.error(error)
    const message = (error as Error)?.message || '网络错误'
    window.alert(`注册失败：${message}\n\n请确认：\n1. 已启动 Mock 服务（运行命令：npm run mock）\n2. JSON Server 运行在端口 3001\n3. db.json 文件存在且包含 users 节点`)
  } finally {
    submitting.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <section class="page">
    <div class="register-card">
      <div class="register-header">
        <h1>注册账号</h1>
        <p>创建您的校园轻集市账号</p>
      </div>

      <form class="register-form" @submit.prevent="handleSubmit">
        <FormField label="用户名" required :error="errors.username">
          <input v-model.trim="form.username" type="text" placeholder="请输入用户名" />
        </FormField>

        <div class="password-row">
          <FormField label="密码" required :error="errors.password">
            <input v-model.trim="form.password" type="password" placeholder="请输入密码" />
          </FormField>

          <FormField label="确认密码" required :error="errors.confirmPassword">
            <input v-model.trim="form.confirmPassword" type="password" placeholder="请再次输入密码" />
          </FormField>
        </div>

        <FormField label="姓名" required :error="errors.name">
          <input v-model.trim="form.name" type="text" placeholder="请输入您的姓名" />
        </FormField>

        <div class="info-row">
          <FormField label="学院" required :error="errors.college">
            <input v-model.trim="form.college" type="text" placeholder="如：计算机学院" />
          </FormField>

          <FormField label="年级" required :error="errors.grade">
            <input v-model.trim="form.grade" type="text" placeholder="如：2023级" />
          </FormField>
        </div>

        <div class="actions">
          <button type="submit" class="primary" :disabled="submitting">
            {{ submitting ? '提交中...' : '立即注册' }}
          </button>
        </div>

        <p class="login-link">
          已有账号？
          <a href="javascript:;" @click="goToLogin">去登录</a>
        </p>
      </form>
    </div>
  </section>
</template>

<style scoped>
.page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.register-card {
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #1f2937;
}

.register-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.register-form {
  display: grid;
  gap: 16px;
}

.password-row,
.info-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.actions {
  display: flex;
  justify-content: center;
  margin-top: 8px;
}

button {
  border: none;
  border-radius: 8px;
  padding: 10px 28px;
  cursor: pointer;
  font-size: 14px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.primary {
  background: #2563eb;
  color: #fff;
  width: 100%;
  padding: 12px;
  font-size: 15px;
}

.primary:hover {
  background: #1d4ed8;
}

.login-link {
  text-align: center;
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.login-link a {
  color: #2563eb;
  text-decoration: none;
  margin-left: 4px;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
