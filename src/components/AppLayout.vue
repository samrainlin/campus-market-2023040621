<template>
  <div class="app-layout">
    <AppHeader />

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at 20% 10%, #dbeafe 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, #e0f2fe 0%, transparent 40%),
    radial-gradient(circle at 50% 80%, #eff6ff 0%, transparent 40%),
    linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  box-sizing: border-box;
}
</style>
