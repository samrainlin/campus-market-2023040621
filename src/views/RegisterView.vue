<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers, createUser } from '../api/user'

const router = useRouter()
const submitting = ref(false)

const nickname = ref('')
const studentId = ref('')
const college = ref('')
const grade = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agree = ref(false)

const errors = reactive<Record<string, string>>({})

const collegeOptions = ['计算机学院', '外国语学院', '经济学院', '理学院', '文学院', '艺术学院', '体育学院', '医学院', '法学院', '教育学院', '历史学院', '数学学院', '物理学院', '化学学院', '生命科学学院']
const gradeOptions = ['2021级', '2022级', '2023级', '2024级', '2025级']

function validate(): boolean {
  Object.keys(errors).forEach((k) => { errors[k] = '' })
  let valid = true

  if (!nickname.value.trim()) {
    errors.nickname = '请输入昵称'
    valid = false
  } else if (nickname.value.length < 2) {
    errors.nickname = '昵称至少 2 个字符'
    valid = false
  }

  if (!studentId.value.trim()) {
    errors.studentId = '请输入学号'
    valid = false
  }

  if (!college.value) {
    errors.college = '请选择学院'
    valid = false
  }

  if (!grade.value) {
    errors.grade = '请选择年级'
    valid = false
  }

  if (!email.value.trim()) {
    errors.email = '请输入邮箱'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = '请输入有效的邮箱地址'
    valid = false
  }

  if (!password.value) {
    errors.password = '请输入密码'
    valid = false
  } else if (password.value.length < 8) {
    errors.password = '密码至少 8 个字符'
    valid = false
  } else if (password.value.length > 20) {
    errors.password = '密码最多 20 个字符'
    valid = false
  } else if (!/[a-zA-Z]/.test(password.value) || !/[0-9]/.test(password.value)) {
    errors.password = '密码必须同时包含字母和数字'
    valid = false
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = '请确认密码'
    valid = false
  } else if (confirmPassword.value !== password.value) {
    errors.confirmPassword = '两次密码不一致'
    valid = false
  }

  if (!agree.value) {
    errors.agree = '请阅读并同意用户协议'
    valid = false
  }

  return valid
}

function extractErrorMessage(error: unknown): string {
  if (!error) return '网络错误'
  if (error instanceof Error) return error.message
  if (typeof error === 'object') {
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    if (err.response?.data?.message) return err.response.data.message
    if (err.message) return err.message
  }
  return '网络错误，请重试'
}

async function handleSubmit() {
  if (!validate()) return

  submitting.value = true

  try {
    const res = await getUsers()
    const exists = res.data.some((item) => item.username === nickname.value)

    if (exists) {
      errors.nickname = '该昵称已被使用'
      submitting.value = false
      return
    }

    await createUser({
      username: nickname.value,
      password: password.value,
      name: nickname.value,
      college: college.value,
      grade: grade.value,
      studentId: studentId.value,
      email: email.value,
      avatar: '',
      bio: '新用户注册，欢迎来到校园轻集市。',
      notify: true,
    })

    window.alert('注册成功，请前往登录')
    router.push('/login')
  } catch (error) {
    const message = extractErrorMessage(error)
    window.alert(`注册失败：${message}`)
  } finally {
    submitting.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <div class="reg-wrap">
    <div class="reg-box">
      <div class="reg-logo">🎉 欢迎加入校园轻集市</div>
      <div class="reg-slogan">创建你的校园账号，发现更多校园精彩</div>

      <div class="steps-wrap">
        <el-steps :active="0" finish-status="success" align-center>
          <el-step title="填写资料" />
          <el-step title="邮箱验证" />
          <el-step title="完成注册" />
        </el-steps>
      </div>

      <div class="form-group">
        <div class="form-label">昵称</div>
        <el-input size="large" v-model="nickname" placeholder="给自己取个好听的名字" />
        <p v-if="errors.nickname" class="error-text">{{ errors.nickname }}</p>
      </div>

      <div class="form-row">
        <div class="form-group">
          <div class="form-label">学号</div>
          <el-input size="large" v-model="studentId" placeholder="请输入学号" />
          <p v-if="errors.studentId" class="error-text">{{ errors.studentId }}</p>
        </div>
        <div class="form-group">
          <div class="form-label">学院</div>
          <el-select size="large" v-model="college" placeholder="选择学院" style="width: 100%;">
            <el-option v-for="opt in collegeOptions" :key="opt" :label="opt" :value="opt" />
          </el-select>
          <p v-if="errors.college" class="error-text">{{ errors.college }}</p>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <div class="form-label">年级</div>
          <el-select size="large" v-model="grade" placeholder="选择年级" style="width: 100%;">
            <el-option v-for="opt in gradeOptions" :key="opt" :label="opt" :value="opt" />
          </el-select>
          <p v-if="errors.grade" class="error-text">{{ errors.grade }}</p>
        </div>
        <div class="form-group">
          <div class="form-label">邮箱</div>
          <el-input size="large" v-model="email" placeholder="请输入学校邮箱" />
          <p v-if="errors.email" class="error-text">{{ errors.email }}</p>
        </div>
      </div>

      <div class="form-group">
        <div class="form-label">密码</div>
        <el-input size="large" type="password" v-model="password" placeholder="8-20位，包含字母和数字" show-password />
        <p v-if="errors.password" class="error-text">{{ errors.password }}</p>
      </div>

      <div class="form-group">
        <div class="form-label">确认密码</div>
        <el-input size="large" type="password" v-model="confirmPassword" placeholder="再次输入密码" show-password />
        <p v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</p>
      </div>

      <div class="agree-wrap">
        <el-checkbox v-model="agree">
          我已阅读并同意
          <a href="#" style="color: #2563EB; text-decoration: none;" @click.prevent>《用户协议》</a>
          和
          <a href="#" style="color: #2563EB; text-decoration: none;" @click.prevent>《隐私政策》</a>
        </el-checkbox>
        <p v-if="errors.agree" class="error-text" style="margin-top: 6px;">{{ errors.agree }}</p>
      </div>

      <el-button
        size="large"
        type="primary"
        :loading="submitting"
        style="width: 100%; height: 46px; font-size: 15px; font-weight: 700;"
        @click="handleSubmit"
      >
        {{ submitting ? '注册中...' : '立即注册' }}
      </el-button>

      <div class="login-link">
        已有账号？
        <a href="javascript:;" @click="goToLogin">去登录</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reg-wrap {
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, #10B981 0%, #2563EB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
}

.reg-wrap::before {
  content: "✨";
  font-size: 400px;
  position: absolute;
  bottom: -50px;
  left: -50px;
  opacity: 0.08;
  pointer-events: none;
}

.reg-box {
  background: white;
  border-radius: 24px;
  padding: 44px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
  position: relative;
  z-index: 1;
}

.reg-logo {
  text-align: center;
  font-size: 26px;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 8px;
}

.reg-slogan {
  text-align: center;
  color: #64748B;
  font-size: 13px;
  margin-bottom: 28px;
}

.steps-wrap {
  margin: 20px 0 28px 0;
}

.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 13px;
  color: #475569;
  margin-bottom: 8px;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.agree-wrap {
  margin: 20px 0;
  font-size: 13px;
}

.agree-wrap a {
  color: #2563EB;
  text-decoration: none;
}

.error-text {
  color: #F56C6C;
  font-size: 12px;
  margin: 4px 0 0 0;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #94A3B8;
  font-size: 12px;
}

.login-link a {
  color: #2563EB;
  text-decoration: none;
  font-weight: 600;
  margin-left: 2px;
}
</style>
