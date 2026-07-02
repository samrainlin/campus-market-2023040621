<template>
  <header class="app-header">
    <div class="app-header-inner">
      <div class="brand">
        <router-link to="/" class="brand-link">
          <span class="brand-logo">🎓</span>
          <span class="brand-name">校园轻集市</span>
        </router-link>
        <span class="slogan">轻量、可信、面向校园生活</span>
      </div>

      <AppNav />

      <div class="user-actions">
        <template v-if="userStore.isLoggedIn">
          <RouterLink to="/user" class="user-link">
            <img class="user-avatar" :src="userStore.avatar || defaultAvatar" :alt="userStore.displayName" />
            <span class="user-name">{{ userStore.displayName }}</span>
          </RouterLink>
          <button type="button" class="logout-btn" @click="handleLogout">退出</button>
        </template>

        <template v-else>
          <RouterLink to="/login" class="auth-link">登录</RouterLink>
          <RouterLink to="/register" class="auth-link register">注册</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppNav from './AppNav.vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const defaultAvatar = 'https://picsum.photos/seed/campus-user/80/80'

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  background: linear-gradient(135deg, #409eff 0%, #2b6cb0 100%);
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2);
}

.app-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  padding: 14px 0;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #ffffff;
}

.brand-logo {
  font-size: 22px;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.slogan {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  text-decoration: none;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: #fff;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.logout-btn {
  border: none;
  border-radius: 8px;
  padding: 8px 14px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 13px;
  transition: background 0.2s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.auth-link {
  color: #fff;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.auth-link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.auth-link.register {
  background: #fff;
  color: #2563eb;
  font-weight: 500;
}

.auth-link.register:hover {
  background: #f3f4f6;
}

@media (max-width: 768px) {
  .slogan {
    display: none;
  }
  .user-name {
    display: none;
  }
}
</style>
