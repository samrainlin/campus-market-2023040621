<script setup lang="ts">
import { ref, computed } from 'vue'

type LostType = '寻物启事' | '失物招领'

interface Item {
  id: number
  title: string
  type: LostType
  location: string
  lostDate: string
  author: string
  image: string
  reward?: string
}

const keyword = ref('')
const activeType = ref<LostType | '全部'>('全部')
const currentPage = ref(1)
const pageSize = 6

const typeOptions: Array<LostType | '全部'> = ['全部', '寻物启事', '失物招领']

const itemList: Item[] = [
  {
    id: 1,
    title: '丢失校园一卡通，卡号尾号 3829',
    type: '寻物启事',
    location: '三食堂附近',
    lostDate: '2026-06-25',
    author: '粗心小李',
    image: 'https://picsum.photos/seed/lost1/400/300',
    reward: '¥20 酬谢',
  },
  {
    id: 2,
    title: '寻找丢失的黑色长柄雨伞一把',
    type: '寻物启事',
    location: '图书馆二楼自习区',
    lostDate: '2026-06-24',
    author: '淋雨的同学',
    image: 'https://picsum.photos/seed/lost2/400/300',
  },
  {
    id: 3,
    title: '【招领】在二食堂捡到蓝色保温杯',
    type: '失物招领',
    location: '二食堂一层',
    lostDate: '2026-06-26',
    author: '好心人',
    image: 'https://picsum.photos/seed/lost3/400/300',
  },
  {
    id: 4,
    title: 'AirPods Pro 二代遗失，充电盒有贴纸',
    type: '寻物启事',
    location: '教学楼 B-303',
    lostDate: '2026-06-23',
    author: '失主小王',
    image: 'https://picsum.photos/seed/lost4/400/300',
    reward: '¥50 酬谢',
  },
  {
    id: 5,
    title: '【招领】图书馆一楼捡到车钥匙一串',
    type: '失物招领',
    location: '图书馆一楼大厅',
    lostDate: '2026-06-27',
    author: '热心读者',
    image: 'https://picsum.photos/seed/lost5/400/300',
  },
  {
    id: 6,
    title: '丢失红色书包一个，内有教材若干',
    type: '寻物启事',
    location: '北门宿舍 5 号楼楼下',
    lostDate: '2026-06-22',
    author: '丢包同学',
    image: 'https://picsum.photos/seed/lost6/400/300',
    reward: '¥30 酬谢',
  },
  {
    id: 7,
    title: '【招领】校园内捡到金色项链一条',
    type: '失物招领',
    location: '操场跑道旁',
    lostDate: '2026-06-26',
    author: '保安大叔',
    image: 'https://picsum.photos/seed/lost7/400/300',
  },
  {
    id: 8,
    title: '遗失银色笔记本电脑（联想拯救者）',
    type: '寻物启事',
    location: '三食堂二楼',
    lostDate: '2026-06-21',
    author: '失主小张',
    image: 'https://picsum.photos/seed/lost8/400/300',
    reward: '¥100 酬谢',
  },
]

const filteredList = computed(() => {
  let list = itemList
  if (activeType.value !== '全部') {
    list = list.filter((item) => item.type === activeType.value)
  }
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) ||
        item.author.toLowerCase().includes(kw),
    )
  }
  return list
})

const totalCount = computed(() => filteredList.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))

const typeBadgeColor = (type: LostType): string => {
  return type === '寻物启事' ? '#F56C6C' : '#67C23A'
}

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
      <span class="breadcrumb-current">失物招领</span>
    </div>

    <!-- 顶部标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <div class="page-title">
          <span class="page-icon">🔍</span>
          <span>失物招领</span>
        </div>
        <div class="page-subtitle">校园失物信息共享 · 拾金不昧</div>
      </div>
      <router-link to="/publish" class="publish-btn">
        <span>✏️</span>
        <span>发布信息</span>
      </router-link>
    </div>

    <!-- 搜索 + 筛选 -->
    <div class="search-bar">
      <div class="search-input">
        <span class="search-icon">🔍</span>
        <input v-model="keyword" type="text" placeholder="搜索物品名称、发布者..." />
        <button v-if="keyword" type="button" class="clear-btn" @click="keyword = ''">×</button>
      </div>
      <div class="type-filter">
        <button
          v-for="opt in typeOptions"
          :key="opt"
          class="filter-btn"
          :class="{ active: activeType === opt }"
          @click="activeType = opt"
        >
          {{ opt }}
        </button>
      </div>
      <div class="search-stats">
        共 <span class="stats-num">{{ totalCount }}</span> 条信息
      </div>
    </div>

    <!-- 卡片列表 -->
    <div class="card-grid">
      <div v-for="item in filteredList" :key="item.id" class="list-card">
        <div class="card-image-wrap">
          <img :src="item.image" :alt="item.title" class="card-image" />
          <span class="card-badge" :style="{ backgroundColor: typeBadgeColor(item.type) }">
            {{ item.type }}
          </span>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <div v-if="item.reward" class="card-reward">{{ item.reward }}</div>
          <div class="card-meta">
            <span class="meta-item">📍 {{ item.location }}</span>
            <span class="meta-item">🕐 {{ item.lostDate }}</span>
            <span class="meta-item">👤 {{ item.author }}</span>
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
  background: linear-gradient(135deg, #F56C6C 0%, #d94848 100%);
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
  transition: all 0.2s ease;
}

.publish-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(245, 108, 108, 0.4);
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
  max-width: 320px;
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

.type-filter {
  display: flex;
  gap: 6px;
}

.filter-btn {
  padding: 6px 14px;
  font-size: 13px;
  color: #64748b;
  background: #f1f5f9;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: #1e293b;
  background: #e2e8f0;
}

.filter-btn.active {
  color: #ffffff;
  background: linear-gradient(135deg, #F56C6C 0%, #d94848 100%);
}

.search-stats {
  font-size: 13px;
  color: #64748b;
}

.stats-num {
  color: #F56C6C;
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
  left: 10px;
  padding: 4px 10px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  backdrop-filter: blur(4px);
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

.card-reward {
  font-size: 16px;
  font-weight: 700;
  color: #d94848;
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

  .type-filter {
    flex-wrap: wrap;
  }
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
