<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

interface CardItem {
  id: number
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  category: string
  tag: string
  tagBg: string
  title: string
  price?: string
  priceColor: string
  location: string
  author: string
  authorAvatar: string
  image: string
  publishTime: string
}

const keyword = ref('')
const activeCategory = ref('全部')
const activeLocation = ref('不限')
const activeTime = ref('最新发布')
const activeSort = ref('综合排序')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = 12

const categories = [
  { label: '全部', icon: '' },
  { label: '二手商品', icon: '📚', key: 'trade' },
  { label: '失物招领', icon: '🔍', key: 'lostFound' },
  { label: '拼单搭子', icon: '🍜', key: 'groupBuy' },
  { label: '跑腿委托', icon: '🏃', key: 'errand' },
]

const locations = ['不限', '计算机学院', '图书馆', '北区宿舍', '三食堂', '南门菜鸟', '学生活动中心', '东门']
const times = ['最新发布', '近24小时', '近3天', '近一周', '近一月']
const sortOptions = ['综合排序', '价格从低到高', '价格从高到低', '浏览量最多', '最新发布']

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])
const loading = ref(false)

async function loadAll() {
  loading.value = true
  try {
    const [tr, lf, gb, er] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])
    trades.value = tr.data
    lostFounds.value = lf.data
    groupBuys.value = gb.data
    errands.value = er.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const allCards = computed<CardItem[]>(() => {
  const cards: CardItem[] = []
  trades.value.forEach((item) => {
    cards.push({
      id: item.id ?? 0,
      type: 'trade',
      category: '二手商品',
      tag: '📚 二手',
      tagBg: '#2563EB',
      title: item.title,
      price: `¥${item.price}`,
      priceColor: '#2563EB',
      location: item.location,
      author: item.publisher,
      authorAvatar: `https://picsum.photos/seed/user-${item.publisher}/50/50`,
      image: item.image || `https://picsum.photos/seed/trade-${item.id}/400/300`,
      publishTime: item.publishTime,
    })
  })
  lostFounds.value.forEach((item) => {
    const isLost = item.type === '寻物'
    cards.push({
      id: item.id ?? 0,
      type: 'lostFound',
      category: '失物招领',
      tag: isLost ? '🔍 寻物' : '✅ 招领',
      tagBg: isLost ? '#EF4444' : '#10B981',
      title: item.title,
      priceColor: isLost ? '#EF4444' : '#64748B',
      location: item.location,
      author: item.contact,
      authorAvatar: `https://picsum.photos/seed/user-${item.contact}/50/50`,
      image: `https://picsum.photos/seed/lf-${item.id}/400/300`,
      publishTime: item.time,
    })
  })
  groupBuys.value.forEach((item) => {
    cards.push({
      id: item.id ?? 0,
      type: 'groupBuy',
      category: '拼单搭子',
      tag: '🍜 拼单',
      tagBg: '#F59E0B',
      title: item.title,
      price: item.budget ? `人均¥${item.budget}` : '',
      priceColor: '#F59E0B',
      location: item.location,
      author: item.publisher,
      authorAvatar: `https://picsum.photos/seed/user-${item.publisher}/50/50`,
      image: `https://picsum.photos/seed/gb-${item.id}/400/300`,
      publishTime: item.deadline,
    })
  })
  errands.value.forEach((item) => {
    cards.push({
      id: item.id ?? 0,
      type: 'errand',
      category: '跑腿委托',
      tag: '🏃 跑腿',
      tagBg: '#10B981',
      title: item.title,
      price: `¥${item.reward} 起`,
      priceColor: '#10B981',
      location: item.pickupLocation,
      author: item.publisher,
      authorAvatar: `https://picsum.photos/seed/user-${item.publisher}/50/50`,
      image: `https://picsum.photos/seed/errand-${item.id}/400/300`,
      publishTime: item.deadline,
    })
  })
  return cards
})

const filteredCards = computed(() => {
  let list = allCards.value
  if (activeCategory.value !== '全部') {
    list = list.filter((c) => c.category === activeCategory.value)
  }
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter((c) => c.title.toLowerCase().includes(kw))
  }
  return list
})

const totalCount = computed(() => filteredCards.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))
const pagedCards = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredCards.value.slice(start, start + pageSize)
})

function selectCategory(cat: string) {
  activeCategory.value = cat
  currentPage.value = 1
}

function selectLocation(loc: string) {
  activeLocation.value = loc
  currentPage.value = 1
}

function selectTime(time: string) {
  activeTime.value = time
  currentPage.value = 1
}

function selectSort(opt: string) {
  activeSort.value = opt
  currentPage.value = 1
}

function cardRoute(card: CardItem) {
  const map: Record<string, string> = {
    trade: '/trade',
    lostFound: '/lost-found',
    groupBuy: '/group-buy',
    errand: '/errand',
  }
  return `${map[card.type]}/${card.id}`
}

onMounted(() => {
  loadAll()
})
</script>

<template>
  <div class="browse-page">
    <div class="breadcrumb">
      <RouterLink to="/" class="breadcrumb-link">首页</RouterLink>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">分类浏览</span>
    </div>

    <div class="search-input-el">
      <el-input size="large" placeholder="搜索信息标题、描述、发布者..." v-model="keyword">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
    </div>

    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">分类</span>
        <div class="filter-options">
          <span
            v-for="cat in categories"
            :key="cat.label"
            :class="['filter-option', { active: activeCategory === cat.label }]"
            @click="selectCategory(cat.label)"
          >{{ cat.icon }} {{ cat.label }}</span>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">地点</span>
        <div class="filter-options">
          <span
            v-for="loc in locations"
            :key="loc"
            :class="['filter-option', { active: activeLocation === loc }]"
            @click="selectLocation(loc)"
          >{{ loc }}</span>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">时间</span>
        <div class="filter-options">
          <span
            v-for="t in times"
            :key="t"
            :class="['filter-option', { active: activeTime === t }]"
            @click="selectTime(t)"
          >{{ t }}</span>
        </div>
      </div>
      <div class="filter-row">
        <span class="filter-label">排序</span>
        <div class="filter-options">
          <span
            v-for="opt in sortOptions"
            :key="opt"
            :class="['filter-option', { active: activeSort === opt }]"
            @click="selectSort(opt)"
          >{{ opt }}</span>
        </div>
      </div>
    </div>

    <div class="list-page-header">
      <div>
        <h2 class="list-page-title">📋 浏览全部信息</h2>
        <div class="list-count">共 <span class="list-count-num">{{ totalCount }}</span> 条匹配结果</div>
      </div>
      <div class="sort-select">
        <el-select v-model="sortBy" size="default" style="width: 140px;">
          <el-option label="综合排序" value="default" />
          <el-option label="最新发布" value="new" />
          <el-option label="价格最低" value="price-low" />
          <el-option label="浏览最多" value="view" />
        </el-select>
        <RouterLink to="/publish">
          <el-button type="primary">✏️ 我也发布</el-button>
        </RouterLink>
      </div>
    </div>

    <div v-if="loading" class="loading-state">加载中...</div>

    <div v-else-if="pagedCards.length === 0" class="empty-state">暂无匹配结果</div>

    <div v-else class="card-grid">
      <RouterLink
        v-for="card in pagedCards"
        :key="`${card.type}-${card.id}`"
        :to="cardRoute(card)"
        class="info-card"
      >
        <div class="info-card-image">
          <img :src="card.image" :alt="card.title" />
          <div class="info-card-tag">
            <span class="tag" :style="{ backgroundColor: card.tagBg }">{{ card.tag }}</span>
          </div>
        </div>
        <div class="info-card-body">
          <h3 class="info-card-title">{{ card.title }}</h3>
          <div v-if="card.price" class="info-card-price" :style="{ color: card.priceColor }">{{ card.price }}</div>
          <div class="info-card-meta">
            <div class="info-card-author">
              <img :src="card.authorAvatar" class="avatar-sm" />{{ card.author }}
            </div>
            <span>{{ card.location }}</span>
          </div>
        </div>
      </RouterLink>
    </div>

    <div v-if="totalPages > 1" class="pagination-area">
      <el-pagination
        background
        layout="prev, pager, next, total, jumper"
        :total="totalCount"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<style scoped>
.breadcrumb { margin-top: 0; }
.filter-bar {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
}
.filter-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px dashed #E2E8F0;
}
.filter-row:last-child { border-bottom: none; }
.filter-label {
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
  min-width: 60px;
}
.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}
.filter-option {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  color: #475569;
  background: #F8FAFC;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-option:hover {
  border-color: #2563EB;
  color: #2563EB;
}
.filter-option.active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}

.list-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.list-page-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}
.list-count {
  font-size: 13px;
  color: #64748B;
}
.list-count-num {
  color: #2563EB;
  font-weight: 700;
}
.sort-select {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.info-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
  display: block;
}
.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
}
.info-card-image {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #F1F5F9;
}
.info-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.info-card:hover .info-card-image img {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}
.info-card-tag {
  position: absolute;
  top: 12px;
  left: 12px;
}
.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: white;
}
.info-card-body {
  padding: 14px;
}
.info-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 8px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}
.info-card-price {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
}
.info-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #64748B;
}
.info-card-author {
  display: flex;
  align-items: center;
  gap: 6px;
}
.avatar-sm {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  object-fit: cover;
  background: #E2E8F0;
}

.search-input-el {
  margin-bottom: 20px;
}

.pagination-area {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 48px 0;
  color: #94A3B8;
  font-size: 14px;
}

@media (max-width: 1100px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 800px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
  .list-page-header { flex-direction: column; align-items: flex-start; gap: 12px; }
}
@media (max-width: 500px) {
  .card-grid { grid-template-columns: 1fr; }
}
</style>
