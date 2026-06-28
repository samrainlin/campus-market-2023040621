<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="app">
    <nav class="nav">
      <div class="nav-inner">
        <el-menu
          mode="horizontal"
          :default-active="route.path"
          router
          class="el-menu-custom"
        >
          <el-menu-item index="/home">
            <span>🏠</span>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/list">
            <span>📋</span>
            <span>列表</span>
          </el-menu-item>
          <el-menu-item index="/publish">
            <span>✏️</span>
            <span>发布</span>
          </el-menu-item>
          <el-menu-item index="/message">
            <span>💬</span>
            <span>消息</span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <span>👤</span>
            <span>个人中心</span>
          </el-menu-item>
        </el-menu>
      </div>
    </nav>

    <main class="page">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background:
    radial-gradient(circle at 20% 10%, #dbeafe 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, #e0f2fe 0%, transparent 40%),
    radial-gradient(circle at 50% 80%, #eff6ff 0%, transparent 40%),
    linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: rgba(255, 255, 255, 0.65);
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.nav-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 900px;
}

.el-menu-custom {
  width: 100%;
  background: transparent !important;
  border: none !important;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.el-menu-custom :deep(.el-menu-item) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 18px;
  margin: 10px 0;
  border-radius: 999px;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  line-height: 40px;
  border-bottom: none !important;
  border: 1px solid transparent;
  background: transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-menu-custom :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.el-menu-custom :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.35);
}

.el-menu-custom :deep(.el-menu-item.is-active:hover) {
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.45);
}

.page {
  padding: 32px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
