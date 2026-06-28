<script setup lang="ts">
const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/trade', label: '二手', icon: '📚' },
  { path: '/lost-found', label: '失物', icon: '🔍' },
  { path: '/group-buy', label: '拼单', icon: '🍜' },
  { path: '/errand', label: '跑腿', icon: '🏃' },
  { path: '/publish', label: '发布', icon: '✏️' },
  { path: '/message', label: '消息', icon: '💬' },
  { path: '/user', label: '个人中心', icon: '👤' },
]
</script>

<template>
  <nav class="app-nav">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="app-nav-link"
      active-class="is-active"
    >
      <span class="app-nav-link-icon">{{ item.icon }}</span>
      <span class="app-nav-link-text">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.app-nav {
  display: flex;
  align-items: center;
  gap: 4px;
}

.app-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.app-nav-link:hover {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.app-nav-link.is-active {
  background: #ffffff;
  color: #2b6cb0;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
}

.app-nav-link-icon {
  font-size: 14px;
}

@media (max-width: 768px) {
  .app-nav-link-text {
    display: none;
  }

  .app-nav-link {
    padding: 8px 10px;
  }
}
</style>
