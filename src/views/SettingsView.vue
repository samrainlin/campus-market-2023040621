<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const saving = ref(false)

const form = reactive({
  avatar: '',
  nickname: '',
  college: '',
  grade: '',
  campus: '',
  email: '',
  phone: '',
  wechat: '',
  bio: '',
  notify: true,
})

const collegeOptions = ['计算机学院', '外国语学院', '经济学院', '理学院', '文学院', '艺术学院', '体育学院', '医学院']
const gradeOptions = ['大一', '大二', '大三', '大四', '研究生']
const campusOptions = ['北校区', '南校区', '新校区']

const navItems = [
  { key: 'profile', label: '个人资料' },
  { key: 'security', label: '账号安全' },
  { key: 'notify', label: '消息通知' },
  { key: 'privacy', label: '隐私设置' },
  { key: 'wechat', label: '绑定微信' },
  { key: 'about', label: '关于我们' },
]

const activeNav = ref('profile')

onMounted(() => {
  if (!userStore.isLoggedIn || !userStore.currentUser) {
    router.push('/login')
    return
  }
  const u = userStore.currentUser
  form.avatar = u.avatar || ''
  form.nickname = u.name || ''
  form.college = u.college || ''
  form.grade = u.grade || ''
  form.campus = u.campus || ''
  form.email = u.email || ''
  form.phone = u.phone || ''
  form.wechat = u.wechat || ''
  form.bio = u.bio || ''
  form.notify = u.notify ?? true
})

function handleAvatarChange() {
  const url = prompt('输入新头像 URL（模拟上传）')
  if (url) form.avatar = url
}

async function handleSave() {
  saving.value = true
  try {
    await userStore.updateProfile({
      name: form.nickname,
      college: form.college,
      grade: form.grade,
      campus: form.campus,
      email: form.email,
      phone: form.phone,
      wechat: form.wechat,
      bio: form.bio,
      notify: form.notify,
    })
    window.alert('保存成功')
  } catch (error) {
    console.error(error)
    window.alert('保存失败，请检查 Mock 服务是否正常')
  } finally {
    saving.value = false
  }
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}

function goToUser() {
  router.push('/user')
}
</script>

<template>
  <div class="settings-page" v-if="userStore.isLoggedIn">
    <div class="breadcrumb">
      <a href="javascript:;" class="breadcrumb-link" @click="goToUser">个人中心</a>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">账号设置</span>
    </div>

    <div class="settings-layout">
      <nav class="settings-nav">
        <div class="settings-nav-title">⚙️ 设置菜单</div>
        <a
          v-for="item in navItems"
          :key="item.key"
          href="javascript:;"
          :class="{ active: activeNav === item.key }"
          @click="activeNav = item.key"
        >
          {{ item.label }}
        </a>
        <a href="javascript:;" class="nav-logout" @click="handleLogout">退出登录</a>
      </nav>

      <div class="settings-content">
        <!-- 个人资料 -->
        <template v-if="activeNav === 'profile'">
          <h2 class="settings-title">👤 个人资料设置</h2>
          <div class="settings-subtitle">完善你的个人信息，让同学更信任你</div>
          <div class="settings-subtitle-card" />

          <div class="form-row">
            <div class="form-label">头像</div>
            <div class="avatar-edit">
              <img :src="form.avatar || 'https://picsum.photos/seed/myprofile/200/200'" alt="头像" />
              <el-button size="default" type="primary" @click="handleAvatarChange">更换头像</el-button>
              <span style="font-size: 12px; color: #64748B;">支持 JPG/PNG，不超过 2MB</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-label form-label-required">昵称</div>
            <el-input v-model="form.nickname" size="large" placeholder="请输入昵称" style="max-width: 420px;" />
          </div>

          <div class="form-row">
            <div class="form-label">学院</div>
            <el-select v-model="form.college" placeholder="请选择学院" size="large" style="width: 420px;">
              <el-option v-for="opt in collegeOptions" :key="opt" :label="opt" :value="opt" />
            </el-select>
          </div>

          <div class="form-row">
            <div class="form-label">年级</div>
            <el-select v-model="form.grade" placeholder="请选择年级" size="large" style="width: 420px;">
              <el-option v-for="opt in gradeOptions" :key="opt" :label="opt" :value="opt" />
            </el-select>
          </div>

          <div class="form-row">
            <div class="form-label">校区</div>
            <el-select v-model="form.campus" placeholder="请选择校区" size="large" style="width: 420px;">
              <el-option v-for="opt in campusOptions" :key="opt" :label="opt" :value="opt" />
            </el-select>
          </div>

          <div class="form-row">
            <div class="form-label">邮箱</div>
            <el-input v-model="form.email" size="large" placeholder="用于通知回复" style="max-width: 420px;" />
          </div>

          <div class="form-row">
            <div class="form-label form-label-required">手机号</div>
            <el-input v-model="form.phone" size="large" placeholder="用于接收消息" style="max-width: 420px;" />
          </div>

          <div class="form-row">
            <div class="form-label">微信号</div>
            <el-input v-model="form.wechat" size="large" placeholder="选填，方便同学联系" style="max-width: 420px;" />
          </div>

          <div class="form-row">
            <div class="form-label">个人简介</div>
            <el-input
              type="textarea"
              :rows="4"
              placeholder="一句话介绍自己，让大家更了解你～"
              v-model="form.bio"
              style="max-width: 520px;"
            />
          </div>

          <div class="form-row">
            <div class="form-label">消息通知</div>
            <el-switch v-model="form.notify" size="large" active-text="开启" inactive-text="关闭" />
          </div>

          <div class="form-row">
            <div class="form-label" />
            <div style="display: flex; gap: 12px;">
              <el-button size="large" type="primary" :loading="saving" @click="handleSave">
                {{ saving ? '保存中...' : '保存修改' }}
              </el-button>
              <el-button size="large" @click="goToUser">取消</el-button>
            </div>
          </div>
        </template>

        <!-- 占位内容 -->
        <template v-else>
          <h2 class="settings-title" v-if="activeNav === 'security'">🔒 账号安全</h2>
          <h2 class="settings-title" v-else-if="activeNav === 'notify'">🔔 消息通知</h2>
          <h2 class="settings-title" v-else-if="activeNav === 'privacy'">🛡️ 隐私设置</h2>
          <h2 class="settings-title" v-else-if="activeNav === 'wechat'">💬 绑定微信</h2>
          <h2 class="settings-title" v-else-if="activeNav === 'about'">ℹ️ 关于我们</h2>
          <div class="settings-subtitle">功能开发中，敬请期待</div>
          <div class="settings-subtitle-card" />
          <div class="placeholder-content">
            <div class="placeholder-icon">🚧</div>
            <p>该功能正在加紧开发中，将在后续版本上线。</p>
          </div>
        </template>
      </div>
    </div>
  </div>

  <div v-else class="not-logged-in">
    <h1>请先登录</h1>
    <p>登录后可以管理您的账号设置。</p>
    <RouterLink class="login-link" to="/login">去登录</RouterLink>
  </div>
</template>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-link {
  color: #409eff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: #2b6cb0;
}

.breadcrumb-sep {
  color: #94a3b8;
}

.breadcrumb-current {
  color: #475569;
}

.settings-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 20px;
}

.settings-nav {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  height: fit-content;
}

.settings-nav-title {
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  padding: 10px 12px;
}

.settings-nav a {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  color: #475569;
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 4px;
  cursor: pointer;
}

.settings-nav a:hover {
  background: #F8FAFC;
}

.settings-nav a.active {
  background: #2563EB;
  color: white;
  font-weight: 600;
}

.settings-nav a.nav-logout {
  color: #EF4444;
}

.settings-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}

.settings-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 6px 0;
}

.settings-subtitle {
  font-size: 13px;
  color: #64748B;
}

.settings-subtitle-card {
  padding: 20px 0;
  border-bottom: 2px solid #F1F5F9;
  margin-bottom: 28px;
}

.form-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 16px;
  align-items: center;
  padding: 16px 0;
}

.form-label {
  font-size: 14px;
  color: #475569;
  text-align: right;
}

.form-label-required::before {
  content: "* ";
  color: #EF4444;
}

.avatar-edit {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-edit img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.placeholder-content {
  text-align: center;
  padding: 48px 24px;
  color: #94A3B8;
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.placeholder-content p {
  font-size: 14px;
  margin: 0;
}

.not-logged-in {
  text-align: center;
  padding: 48px 24px;
}

.not-logged-in h1 {
  margin: 0 0 12px;
  font-size: 22px;
  color: #1f2937;
}

.not-logged-in p {
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 14px;
}

.login-link {
  display: inline-block;
  padding: 10px 28px;
  background: #2563eb;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
}

@media (max-width: 800px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }

  .settings-nav {
    display: none;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-label {
    text-align: left;
  }
}
</style>
