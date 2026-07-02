<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

interface FeedCard {
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
}

const keyword = ref('')
const activeTab = ref('全部')
const currentPage = ref(1)
const pageSize = 8

const tabs = ['全部', '二手', '失物', '拼单', '跑腿']

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

const allCards = computed<FeedCard[]>(() => {
  const cards: FeedCard[] = []

  trades.value.forEach((item) => {
    cards.push({
      id: item.id ?? 0,
      type: 'trade',
      category: '二手',
      tag: '📚 二手',
      tagBg: '#2563EB',
      title: item.title,
      price: `¥${item.price}`,
      priceColor: '#2563EB',
      location: item.location,
      author: item.publisher,
      authorAvatar: `https://picsum.photos/seed/user-${item.publisher}/50/50`,
      image: item.image || `https://picsum.photos/seed/trade-${item.id}/400/300`,
    })
  })

  lostFounds.value.forEach((item) => {
    const isLost = item.type === '寻物'
    cards.push({
      id: item.id ?? 0,
      type: 'lostFound',
      category: '失物',
      tag: isLost ? '🔍 寻物' : '✅ 招领',
      tagBg: isLost ? '#EF4444' : '#10B981',
      title: item.title,
      priceColor: isLost ? '#EF4444' : '#64748B',
      location: item.location,
      author: item.contact,
      authorAvatar: `https://picsum.photos/seed/user-${item.contact}/50/50`,
      image: `https://picsum.photos/seed/lf-${item.id}/400/300`,
    })
  })

  groupBuys.value.forEach((item) => {
    cards.push({
      id: item.id ?? 0,
      type: 'groupBuy',
      category: '拼单',
      tag: '🍜 拼单',
      tagBg: '#F59E0B',
      title: item.title,
      price: item.budget ? `人均¥${item.budget}` : '',
      priceColor: '#F59E0B',
      location: item.location,
      author: item.publisher,
      authorAvatar: `https://picsum.photos/seed/user-${item.publisher}/50/50`,
      image: `https://picsum.photos/seed/gb-${item.id}/400/300`,
    })
  })

  errands.value.forEach((item) => {
    cards.push({
      id: item.id ?? 0,
      type: 'errand',
      category: '跑腿',
      tag: '🏃 跑腿',
      tagBg: '#10B981',
      title: item.title,
      price: `¥${item.reward} 起`,
      priceColor: '#10B981',
      location: item.pickupLocation,
      author: item.publisher,
      authorAvatar: `https://picsum.photos/seed/user-${item.publisher}/50/50`,
      image: `https://picsum.photos/seed/errand-${item.id}/400/300`,
    })
  })

  cards.sort(() => Math.random() - 0.5)
  return cards
})

const filteredCards = computed(() => {
  let list = allCards.value
  if (activeTab.value !== '全部') {
    list = list.filter((c) => c.category === activeTab.value)
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

function switchTab(tab: string) {
  activeTab.value = tab
  currentPage.value = 1
}

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function cardRoute(card: FeedCard) {
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
  <div class="home">
    <div class="hero-banner">
      <div class="hero-text">
        <h2>🎓 校园信息，一站发布</h2>
        <p>闲置转让 · 失物招领 · 拼单搭子 · 跑腿代取 —— 让校园生活更便捷</p>
      </div>
      <div class="hero-stats">
        <div class="hero-stat-item">
          <div class="hero-stat-num">{{ allCards.length }}</div>
          <div class="hero-stat-label">今日新增</div>
        </div>
        <div class="hero-stat-item">
          <div class="hero-stat-num">{{ trades.length + lostFounds.length + groupBuys.length + errands.length }}</div>
          <div class="hero-stat-label">累计发布</div>
        </div>
        <div class="hero-stat-item">
          <div class="hero-stat-num">{{ Math.max(1, Math.floor((trades.length + lostFounds.length + groupBuys.length + errands.length) / 3)) }}</div>
          <div class="hero-stat-label">活跃用户</div>
        </div>
      </div>
    </div>

    <div class="search-box">
      <div class="search-input-wrap">
        <span class="search-icon">🔍</span>
        <input v-model="keyword" type="text" placeholder="搜索：二手教材、校园卡、钥匙、奶茶拼单..." />
        <button v-if="keyword" class="clear-btn" @click="keyword = ''">×</button>
      </div>
      <button class="search-btn" @click="currentPage = 1">🔍 搜索</button>
      <RouterLink to="/publish" class="publish-btn">✏️ 发布信息</RouterLink>
    </div>

    <div class="quick-categories">
      <RouterLink to="/trade" class="category-card-home">
        <div class="cat-icon cat-blue">📚</div>
        <h3 class="cat-title">二手交易</h3>
        <p class="cat-desc">教材、自行车、数码...</p>
      </RouterLink>
      <RouterLink to="/lost-found" class="category-card-home">
        <div class="cat-icon cat-red">🔍</div>
        <h3 class="cat-title">失物招领</h3>
        <p class="cat-desc">校园卡、钥匙、雨伞...</p>
      </RouterLink>
      <RouterLink to="/group-buy" class="category-card-home">
        <div class="cat-icon cat-orange">🍜</div>
        <h3 class="cat-title">拼单搭子</h3>
        <p class="cat-desc">奶茶、外卖、打车...</p>
      </RouterLink>
      <RouterLink to="/errand" class="category-card-home">
        <div class="cat-icon cat-green">🏃</div>
        <h3 class="cat-title">跑腿委托</h3>
        <p class="cat-desc">代取快递、打印代购...</p>
      </RouterLink>
    </div>

    <div class="section-header">
      <div class="section-header-title">
        <h2 class="section-title">🔥 最新发布</h2>
        <span class="section-subtitle">· 来自全校同学的新鲜事</span>
      </div>
      <div class="tab-nav">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-btn', { active: activeTab === tab }]"
          @click="switchTab(tab)"
        >{{ tab }}</button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">加载中...</div>

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

    <div v-if="!loading && filteredCards.length === 0" class="empty-state">
      <p>暂无相关内容</p>
    </div>

    <div v-if="totalPages > 1" class="pagination-area">
      <button class="page-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">‹</button>
      <button
        v-for="p in totalPages"
        :key="p"
        :class="['page-btn', { active: p === currentPage }]"
        @click="goToPage(p)"
      >{{ p }}</button>
      <button class="page-btn" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">›</button>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-banner {
  background: linear-gradient(135deg, #2563EB 0%, #60A5FA 100%);
  border-radius: 20px;
  padding: 40px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-banner::before {
  content: "";
  position: absolute;
  right: -10%;
  top: -50%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%);
  border-radius: 50%;
}

.hero-text {
  z-index: 1;
}

.hero-text h2 {
  font-size: 26px;
  margin: 0 0 8px 0;
  font-weight: 700;
}

.hero-text p {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.hero-stats {
  display: flex;
  gap: 32px;
  z-index: 1;
}

.hero-stat-item {
  text-align: center;
}

.hero-stat-num {
  font-size: 26px;
  font-weight: 700;
}

.hero-stat-label {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 4px;
}

.search-box {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  transition: border-color 0.2s;
}

.search-input-wrap:focus-within {
  border-color: #2563EB;
}

.search-icon {
  font-size: 14px;
  color: #94A3B8;
}

.search-input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  font-family: inherit;
}

.search-input-wrap input::placeholder {
  color: #94A3B8;
}

.clear-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #CBD5E1;
  color: white;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.clear-btn:hover {
  background: #f56c6c;
}

.search-btn {
  padding: 10px 28px;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #1d4ed8;
}

.publish-btn {
  display: inline-block;
  padding: 10px 24px;
  background: #F59E0B;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}

.publish-btn:hover {
  background: #D97706;
}

.quick-categories {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.category-card-home {
  background: white;
  border-radius: 14px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.category-card-home:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1);
}

.cat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  margin: 0 auto 12px;
}

.cat-blue { background: #EFF6FF; color: #2563EB; }
.cat-red { background: #FEF2F2; color: #EF4444; }
.cat-orange { background: #FFFBEB; color: #F59E0B; }
.cat-green { background: #F0FDF4; color: #10B981; }

.cat-title {
  font-size: 15px;
  font-weight: 600;
  color: #0F172A;
  margin: 0 0 4px 0;
}

.cat-desc {
  font-size: 12px;
  color: #94A3B8;
  margin: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.section-subtitle {
  font-size: 13px;
  color: #64748B;
}

.tab-nav {
  display: flex;
  gap: 4px;
}

.tab-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: transparent;
  font-weight: 500;
}

.tab-btn:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.tab-btn.active {
  background: #2563EB;
  color: white;
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

.loading-state {
  text-align: center;
  padding: 48px 0;
  color: #94A3B8;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 48px 0;
  color: #94A3B8;
  font-size: 14px;
}

.empty-state p {
  margin: 0;
}

.pagination-area {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #E2E8F0;
  background: white;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover:not(:disabled):not(.active) {
  border-color: #2563EB;
  color: #2563EB;
}

.page-btn.active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 800px) {
  .card-grid { grid-template-columns: repeat(2, 1fr); }
  .quick-categories { grid-template-columns: repeat(2, 1fr); }
  .hero-banner { flex-direction: column; text-align: center; gap: 20px; }
  .publish-btn { display: none; }
}

@media (max-width: 500px) {
  .card-grid { grid-template-columns: 1fr; }
}
</style>
