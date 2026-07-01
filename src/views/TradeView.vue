<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTrades, type TradeItem } from '../api/trade'
import EmptyState from '../components/EmptyState.vue'
import { useFavoriteStore, type FavoriteItem } from '../stores/favorite'

const favoriteStore = useFavoriteStore()

const keyword = ref('')
const currentPage = ref(1)
const pageSize = 6
const trades = ref<TradeItem[]>([])

onMounted(async () => {
  const res = await getTrades()
  trades.value = res.data
})

const filteredList = computed(() => {
  if (!keyword.value.trim()) return trades.value
  const kw = keyword.value.trim().toLowerCase()
  return trades.value.filter(
    (item) =>
      item.title.toLowerCase().includes(kw) ||
      item.publisher.toLowerCase().includes(kw),
  )
})

const totalCount = computed(() => filteredList.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="view-page">
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">首页</router-link>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">二手交易</span>
    </div>

    <div class="page-header">
      <div class="header-left">
        <div class="page-title">
          <span class="page-icon">📚</span>
          <span>二手交易</span>
        </div>
        <div class="page-subtitle">学生闲置交易专区 · 当面交易更放心</div>
      </div>
      <router-link to="/publish" class="publish-btn">
        <span>✏️</span>
        <span>发布闲置</span>
      </router-link>
    </div>

    <div class="search-bar">
      <div class="search-input">
        <span class="search-icon">🔍</span>
        <input v-model="keyword" type="text" placeholder="搜索商品名称、发布者..." />
        <button v-if="keyword" type="button" class="clear-btn" @click="keyword = ''">×</button>
      </div>
      <div class="search-stats">
        共 <span class="stats-num">{{ totalCount }}</span> 条商品
      </div>
    </div>

    <EmptyState v-if="filteredList.length === 0" text="暂无二手交易信息" />

    <div v-else class="card-grid">
      <div v-for="item in filteredList" :key="item.id" class="list-card">
        <div class="card-image-wrap">
          <img :src="item.image" :alt="item.title" class="card-image" />
          <span class="card-badge">{{ item.condition }}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-price">¥{{ item.price }}</div>
          <div class="card-meta">
            <span class="meta-item">📍 {{ item.location }}</span>
            <span class="meta-item">👤 {{ item.publisher }}</span>
          </div>
          <div class="card-actions">
            <button
              class="favorite-btn"
              :class="{ active: item.id && favoriteStore.isFavorite('trade', item.id) }"
              @click="
                item.id && favoriteStore.toggleFavorite({
                  id: item.id,
                  type: 'trade',
                  title: item.title,
                  description: item.description || '',
                  location: item.location,
                })
              "
            >
              {{ item.id && favoriteStore.isFavorite('trade', item.id) ? '已收藏' : '收藏' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredList.length > 0" class="pagination-box">
      <button
        type="button"
        class="page-btn"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
      >
        ‹
      </button>
      <span class="page-info">第 {{ currentPage }} / {{ totalPages }} 页</span>
      <button
        type="button"
        class="page-btn"
        :disabled="currentPage >= totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        ›
      </button>
    </div>
  </div>
</template>

<style scoped>
.view-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.breadcrumb-link {
  color: #409EFF;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover { color: #2B6CB0; }

.breadcrumb-sep { color: #cbd5e1; }

.breadcrumb-current {
  color: #1e293b;
  font-weight: 500;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.page-icon { font-size: 28px; }

.page-subtitle {
  font-size: 13px;
  color: #64748b;
}

.publish-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  transition: all 0.2s ease;
}

.publish-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #ffffff;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.search-input {
  flex: 1;
  max-width: 420px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.search-input:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.search-icon {
  font-size: 13px;
  color: #94a3b8;
  flex-shrink: 0;
}

.search-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
  font-family: inherit;
}

.search-input input::placeholder { color: #94a3b8; }

.clear-btn {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #cbd5e1;
  color: #ffffff;
  font-size: 13px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex-shrink: 0;
  border: none;
}

.clear-btn:hover { background: #f56c6c; }

.search-stats {
  font-size: 13px;
  color: #64748b;
}

.stats-num {
  color: #409EFF;
  font-weight: 700;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.list-card {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;
}

.list-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.card-image-wrap {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.list-card:hover .card-image { transform: scale(1.05); }

.card-badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  background: rgba(64, 158, 255, 0.92);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
}

.card-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.card-title {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.card-price {
  font-size: 20px;
  font-weight: 700;
  color: #2B6CB0;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 6px;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  font-size: 12px;
  color: #64748b;
}

.pagination-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
}

.page-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 6px;
  font-size: 15px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled) {
  border-color: #409eff;
  color: #409eff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  color: #64748b;
}

@media (max-width: 1100px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 800px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
  .search-bar { flex-direction: column; align-items: stretch; }
  .search-input { max-width: none; }
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.favorite-btn {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #64748b;
  border-radius: 999px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.favorite-btn:hover {
  border-color: #409eff;
  color: #409eff;
}

.favorite-btn.active {
  background: #409eff;
  color: #ffffff;
  border-color: #409eff;
}

@media (max-width: 500px) {
  .card-grid { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; align-items: flex-start; }
}
</style>
