<template>
  <div class="error-state">
    <div class="error-icon">⚠️</div>
    <p class="error-message">{{ message || '请求失败，请稍后重试' }}</p>
    <button
      v-if="showRetry"
      type="button"
      class="retry-btn"
      @click="$emit('retry')"
    >
      重新加载
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
  showRetry?: boolean
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>

<style scoped>
.error-state {
  padding: 48px 24px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  color: #6b7280;
}

.error-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.error-message {
  margin: 0 0 20px;
  font-size: 14px;
  color: #4b5563;
}

.retry-btn {
  padding: 10px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.retry-btn:hover {
  background: #1d4ed8;
}
</style>
