<script setup lang="ts">
interface StatItem {
  label: string
  value: string
}

const stats: StatItem[] = [
  { label: '总用户数', value: '1,286' },
  { label: '今日访问', value: '342' },
  { label: '总发布量', value: '5,231' },
  { label: '总交易额', value: '¥89.6K' },
]
</script>

<template>
  <div class="board">
    <div class="board-header">
      <h2 class="board-title">数据概览</h2>
      <p class="board-subtitle">实时统计 · 平台运营情况</p>
    </div>

    <div class="stat-grid">
      <div
        v-for="item in stats"
        :key="item.label"
        class="stat-card"
      >
        <div class="stat-value">{{ item.value }}</div>
        <div class="stat-label">{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.board-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.board-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
}

.board-subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 28px 24px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
}

.stat-value {
  font-size: 30px;
  font-weight: 700;
  color: #409EFF;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

@media (max-width: 900px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
