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

      <div class="user-mini">
        <img class="user-avatar" :src="userStore.avatar" alt="avatar" />
        <div class="user-text">
          <span class="user-name">{{ userStore.displayName }}</span>
          <span class="user-profile">{{ userStore.profileText }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import AppNav from './AppNav.vue'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
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

.user-mini {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  background: #fff;
}

.user-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
}

.user-profile {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

@media (max-width: 768px) {
  .slogan {
    display: none;
  }
  .user-profile {
    display: none;
  }
}
</style>
