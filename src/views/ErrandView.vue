<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getErrands, type ErrandItem } from '../api/errand'
import EmptyState from '../components/EmptyState.vue'
import { useFavoriteStore, type FavoriteItem } from '../stores/favorite'

const favoriteStore = useFavoriteStore()

const keyword = ref('')
const currentPage = ref(1)
const pageSize = 6

const errands = ref<ErrandItem[]>([])

onMounted(async () => {
  const res = await getErrands()
  errands.value = res.data
})

const filteredList = computed(() => {
  if (!keyword.value.trim()) return errands.value
  const kw = keyword.value.trim().toLowerCase()
  return errands.value.filter(
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
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">首页</router-link>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">跑腿委托</span>
    </div>

    <!-- 顶部标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <div class="page-title">
          <span class="page-icon">🏃</span>
          <span>跑腿委托</span>
        </div>
        <div class="page-subtitle">互助跑腿 · 节省时间 · 诚信高效</div>
      </div>
      <router-link to="/publish" class="publish-btn">
        <span>✏️</span>
        <span>发布委托</span>
      </router-link>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <div class="search-input">
        <span class="search-icon">🔍</span>
        <input v-model="keyword" type="text" placeholder="搜索委托名称、发起人..." />
        <button v-if="keyword" type="button" class="clear-btn" @click="keyword = ''">×</button>
      </div>
      <div class="search-stats">
        共 <span class="stats-num">{{ totalCount }}</span> 条委托
      </div>
    </div>

    <EmptyState v-if="filteredList.length === 0" text="暂无跑腿委托信息" />

    <div v-else class="card-grid">
      <div v-for="item in filteredList" :key="item.id" class="list-card">
        <div class="card-image-wrap">
          <img
            :src="`https://picsum.photos/seed/err${item.id}/400/300`"
            :alt="item.title"
            class="card-image"
          />
          <span class="card-badge">¥{{ item.reward }}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <div v-if="item.taskType" class="card-sub">{{ item.taskType }}</div>
          <div v-if="item.description" class="card-desc">{{ item.description }}</div>
          <div class="card-info">
            <div class="info-row">
              <span class="info-label">起点</span>
              <span class="info-value">{{ item.pickupLocation }}</span>
            </div>
            <div class="info-arrow">↓</div>
            <div class="info-row">
              <span class="info-label">终点</span>
              <span class="info-value">{{ item.deliveryLocation }}</span>
            </div>
          </div>
          <div class="card-meta">
            <span class="meta-item deadline">⏰ {{ item.deadline }}</span>
            <span class="meta-item">👤 {{ item.publisher }}</span>
          </div>
          <div class="card-actions">
            <button
              class="favorite-btn"
              :class="{ active: item.id && favoriteStore.isFavorite('errand', item.id) }"
              @click="
                item.id && favoriteStore.toggleFavorite({
                  id: item.id,
                  type: 'errand',
                  title: item.title,
                  description: item.description || '',
                  location: item.pickupLocation,
                })
              "
            >
              {{ item.id && favoriteStore.isFavorite('errand', item.id) ? '已收藏' : '收藏' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-box">
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

/* 面包屑 */
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

.breadcrumb-link:hover {
  color: #2B6CB0;
}

.breadcrumb-sep {
  color: #cbd5e1;
}

.breadcrumb-current {
  color: #1e293b;
  font-weight: 500;
}

/* 页面标题栏 */
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

.page-icon {
  font-size: 28px;
}

.page-subtitle {
  font-size: 13px;
  color: #64748b;
}

.publish-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #67C23A 0%, #4a9b23 100%);
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
  transition: all 0.2s ease;
}

.publish-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(103, 194, 58, 0.4);
}

/* 搜索栏 */
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

.search-input input::placeholder {
  color: #94a3b8;
}

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
}

.clear-btn:hover {
  background: #f56c6c;
}

.search-stats {
  font-size: 13px;
  color: #64748b;
}

.stats-num {
  color: #67C23A;
  font-weight: 700;
}

/* 卡片网格 */
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

.list-card:hover .card-image {
  transform: scale(1.05);
}

.card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #67C23A 0%, #4a9b23 100%);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(103, 194, 58, 0.3);
}

.card-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

/* 起点终点信息 */
.card-sub {
  font-size: 13px;
  color: #475569;
  font-weight: 600;
}

.card-desc {
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-info {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
}

.info-label {
  color: #4a9b23;
  font-weight: 700;
  flex-shrink: 0;
  min-width: 30px;
}

.info-value {
  color: #1e293b;
  flex: 1;
}

.info-arrow {
  color: #67C23A;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  line-height: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  font-size: 12px;
  color: #64748b;
}

.meta-item.deadline {
  color: #E6A23C;
  font-weight: 600;
}

/* 分页 */
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
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 800px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input {
    max-width: none;
  }
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
  border-color: #67c23a;
  color: #67c23a;
}

.favorite-btn.active {
  background: #67c23a;
  color: #ffffff;
  border-color: #67c23a;
}

@media (max-width: 500px) {
  .card-grid {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
