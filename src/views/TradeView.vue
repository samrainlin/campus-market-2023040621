<script setup lang="ts">
import { ref, computed } from 'vue'

interface Item {
  id: number
  title: string
  price: string
  location: string
  author: string
  image: string
  condition: string
}

const keyword = ref('')
const currentPage = ref(1)
const pageSize = 6

const itemList: Item[] = [
  {
    id: 1,
    title: '出闲置教材《软件工程导论》，九成新',
    price: '¥25',
    location: '图书馆门口',
    author: '小明同学',
    image: 'https://picsum.photos/seed/trade1/400/300',
    condition: '九成新',
  },
  {
    id: 2,
    title: '自行车代步车（蓝色），保养良好',
    price: '¥280',
    location: '北门宿舍区',
    author: '毕业学长',
    image: 'https://picsum.photos/seed/trade2/400/300',
    condition: '八成新',
  },
  {
    id: 3,
    title: '考研资料合集（数学+英语+政治）',
    price: '¥120',
    location: '图书馆一楼',
    author: '上岸学长',
    image: 'https://picsum.photos/seed/trade3/400/300',
    condition: '全新',
  },
  {
    id: 4,
    title: 'USB 小电风扇（桌面款）',
    price: '¥35',
    location: '学生宿舍 3 号楼',
    author: '小明同学',
    image: 'https://picsum.photos/seed/trade4/400/300',
    condition: '九成新',
  },
  {
    id: 5,
    title: '《高等数学》同济大学第七版',
    price: '¥20',
    location: '数学学院',
    author: '张同学',
    image: 'https://picsum.photos/seed/trade5/400/300',
    condition: '八成新',
  },
  {
    id: 6,
    title: '宿舍收纳三件套（带轮收纳箱）',
    price: '¥65',
    location: '南门 3 号楼宿舍',
    author: '学姐杂货铺',
    image: 'https://picsum.photos/seed/trade6/400/300',
    condition: '全新',
  },
  {
    id: 7,
    title: '英语四级词汇书（乱序版）+ 真题',
    price: '¥25',
    location: '外国语学院',
    author: '四级已过',
    image: 'https://picsum.photos/seed/trade7/400/300',
    condition: '九成新',
  },
  {
    id: 8,
    title: '机械键盘（茶轴），使用半年',
    price: '¥180',
    location: '计算机学院',
    author: '码农同学',
    image: 'https://picsum.photos/seed/trade8/400/300',
    condition: '九成新',
  },
]

const filteredList = computed(() => {
  if (!keyword.value.trim()) return itemList
  const kw = keyword.value.trim().toLowerCase()
  return itemList.filter(
    (item) =>
      item.title.toLowerCase().includes(kw) ||
      item.author.toLowerCase().includes(kw),
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
      <span class="breadcrumb-current">二手市场</span>
    </div>

    <!-- 顶部标题栏 -->
    <div class="page-header">
      <div class="header-left">
        <div class="page-title">
          <span class="page-icon">📚</span>
          <span>二手市场</span>
        </div>
        <div class="page-subtitle">学生闲置交易专区 · 当面交易更放心</div>
      </div>
      <router-link to="/publish" class="publish-btn">
        <span>✏️</span>
        <span>发布闲置</span>
      </router-link>
    </div>

    <!-- 搜索栏 -->
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

    <!-- 卡片列表 -->
    <div class="card-grid">
      <div v-for="item in filteredList" :key="item.id" class="list-card">
        <div class="card-image-wrap">
          <img :src="item.image" :alt="item.title" class="card-image" />
          <span class="card-badge">{{ item.condition }}</span>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-price">{{ item.price }}</div>
          <div class="card-meta">
            <span class="meta-item">📍 {{ item.location }}</span>
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
  color: #409EFF;
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
  background: rgba(64, 158, 255, 0.92);
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
