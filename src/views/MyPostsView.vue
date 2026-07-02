<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

interface PostItem {
  id: number
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  typeLabel: string
  title: string
  description: string
  location: string
  status: string
  image: string
  price?: string
  views: number
  messages: number
  favorites: number
}

const router = useRouter()
const userStore = useUserStore()

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

const loading = ref(false)
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = 5

async function loadAllData() {
  loading.value = true
  try {
    const [tradeRes, lostFoundRes, groupBuyRes, errandRes] = await Promise.all([
      getTrades(),
      getLostFounds(),
      getGroupBuys(),
      getErrands(),
    ])
    trades.value = tradeRes.data
    lostFounds.value = lostFoundRes.data
    groupBuys.value = groupBuyRes.data
    errands.value = errandRes.data
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const publisherName = computed(() => userStore.displayName)

const allPosts = computed<PostItem[]>(() => {
  const items: PostItem[] = []
  const name = publisherName.value

  trades.value.forEach((item) => {
    if (item.publisher === name) {
      items.push({
        id: item.id ?? Date.now() + Math.random(),
        type: 'trade',
        typeLabel: '二手交易',
        title: item.title,
        description: item.description || '',
        location: item.location,
        status: item.status,
        image: item.image || `https://picsum.photos/seed/trade-${item.id}/400/300`,
        price: `¥${item.price}`,
        views: 0,
        messages: 0,
        favorites: 0,
      })
    }
  })

  lostFounds.value.forEach((item) => {
    if (item.contact === name) {
      items.push({
        id: item.id ?? Date.now() + Math.random(),
        type: 'lostFound',
        typeLabel: '失物招领',
        title: item.title,
        description: item.description,
        location: item.location,
        status: item.status,
        image: `https://picsum.photos/seed/lf-${item.id}/400/300`,
        views: 0,
        messages: 0,
        favorites: 0,
      })
    }
  })

  groupBuys.value.forEach((item) => {
    if (item.publisher === name) {
      items.push({
        id: item.id ?? Date.now() + Math.random(),
        type: 'groupBuy',
        typeLabel: '拼单搭子',
        title: item.title,
        description: item.description || '',
        location: item.location,
        status: item.status,
        image: `https://picsum.photos/seed/gb-${item.id}/400/300`,
        price: item.budget ? `人均¥${item.budget}` : '',
        views: 0,
        messages: 0,
        favorites: 0,
      })
    }
  })

  errands.value.forEach((item) => {
    if (item.publisher === name) {
      items.push({
        id: item.id ?? Date.now() + Math.random(),
        type: 'errand',
        typeLabel: '跑腿委托',
        title: item.title,
        description: item.description || '',
        location: item.pickupLocation,
        status: item.status,
        image: `https://picsum.photos/seed/errand-${item.id}/400/300`,
        price: `¥${item.reward}`,
        views: 0,
        messages: 0,
        favorites: 0,
      })
    }
  })

  return items
})

const statusCounts = computed(() => {
  const total = allPosts.value.length
  const open = allPosts.value.filter((i) => i.status === 'open').length
  const done = allPosts.value.filter((i) => i.status === 'done').length
  const closed = allPosts.value.filter((i) => i.status === 'closed').length
  return { total, open, done, closed }
})

const filteredPosts = computed(() => {
  if (activeTab.value === 'all') return allPosts.value
  return allPosts.value.filter((i) => i.status === activeTab.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

function switchTab(tab: string) {
  activeTab.value = tab
  currentPage.value = 1
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const typeTagClass = (type: string) => {
  const map: Record<string, string> = {
    trade: 'tag-blue',
    lostFound: 'tag-red',
    groupBuy: 'tag-orange',
    errand: 'tag-green',
  }
  return map[type] || 'tag-blue'
}

const statusLabel = (s: string) => {
  const m: Record<string, string> = { open: '进行中', done: '已完成', closed: '已下架' }
  return m[s] || s
}

function showAlert(msg: string) {
  window.alert(msg)
}

onMounted(() => {
  loadAllData()
})
</script>

<template>
  <section class="page" v-if="userStore.isLoggedIn">
    <div class="page-header">
      <div>
        <h2 class="page-title">📝 我的发布</h2>
        <div class="page-subtitle">共 {{ statusCounts.total }} 条信息 · 可管理、编辑、下架、重新发布</div>
      </div>
      <RouterLink to="/publish" class="publish-btn">✨ 发布新信息</RouterLink>
    </div>

    <div class="tabs-bar">
      <button
        :class="['tab-btn', { 'is-active': activeTab === 'all' }]"
        @click="switchTab('all')"
      >全部 ({{ statusCounts.total }})</button>
      <button
        :class="['tab-btn', { 'is-active': activeTab === 'open' }]"
        @click="switchTab('open')"
      >进行中 ({{ statusCounts.open }})</button>
      <button
        :class="['tab-btn', { 'is-active': activeTab === 'done' }]"
        @click="switchTab('done')"
      >已完成 ({{ statusCounts.done }})</button>
      <button
        :class="['tab-btn', { 'is-active': activeTab === 'closed' }]"
        @click="switchTab('closed')"
      >已下架 ({{ statusCounts.closed }})</button>
    </div>

    <div v-if="loading" class="loading-state">加载中...</div>

    <div v-else-if="paginatedPosts.length === 0" class="empty-state">
      <p>暂无发布信息</p>
    </div>

    <div v-else class="post-list">
      <div
        v-for="item in paginatedPosts"
        :key="`${item.type}-${item.id}`"
        class="post-card"
      >
        <img :src="item.image" class="post-img" alt="" />
        <div class="post-content">
          <h3 class="post-title">{{ item.title }}</h3>
          <div class="post-meta">
            <span :class="['post-tag', typeTagClass(item.type)]">{{ item.typeLabel }}</span>
            <span v-if="item.status === 'done'" class="post-tag tag-green">已完成</span>
            <span v-if="item.status === 'closed'" class="post-tag tag-red">已下架</span>
          </div>
        </div>
        <div class="post-price">{{ item.price || statusLabel(item.status) }}</div>
        <div class="post-actions">
          <button class="action-btn" @click="router.push(`/${item.type === 'lostFound' ? 'lost-found' : item.type === 'groupBuy' ? 'group-buy' : item.type}/${item.id}`)">查看</button>
          <button v-if="item.status === 'open'" class="action-btn action-btn-danger" @click="showAlert('下架功能开发中')">下架</button>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button class="page-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">‹</button>
      <button
        v-for="p in totalPages"
        :key="p"
        :class="['page-btn', { 'is-active': p === currentPage }]"
        @click="goToPage(p)"
      >{{ p }}</button>
      <button class="page-btn" :disabled="currentPage >= totalPages" @click="goToPage(currentPage + 1)">›</button>
    </div>
  </section>

  <section v-else class="page not-logged-in">
    <h1>请先登录</h1>
    <p>登录后可以查看和管理你的发布信息。</p>
    <RouterLink class="login-link" to="/login">去登录</RouterLink>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.not-logged-in {
  text-align: center;
  padding: 60px 24px;
  background: white;
  border-radius: 16px;
}

.not-logged-in h1 {
  margin: 0 0 12px;
  font-size: 22px;
  color: #1f2937;
}

.not-logged-in p {
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 14px;
}

.login-link {
  display: inline-block;
  padding: 10px 28px;
  background: #2563eb;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
}

.page-header {
  background: white;
  border-radius: 16px;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.page-subtitle {
  font-size: 13px;
  color: #64748B;
  margin-top: 6px;
}

.publish-btn {
  display: inline-block;
  padding: 10px 24px;
  background: #2563EB;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  transition: background 0.2s;
}

.publish-btn:hover {
  background: #1d4ed8;
}

.tabs-bar {
  background: white;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  gap: 4px;
}

.tab-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 14px;
  color: #64748B;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.tab-btn:hover {
  background: #F1F5F9;
  color: #0F172A;
}

.tab-btn.is-active {
  background: #2563EB;
  color: white;
  font-weight: 600;
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
  background: white;
  border-radius: 14px;
  color: #94A3B8;
  font-size: 14px;
}

.empty-state p {
  margin: 0;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  gap: 18px;
  align-items: center;
  transition: box-shadow 0.2s;
}

.post-card:hover {
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}

.post-img {
  width: 120px;
  height: 90px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f3f4f6;
}

.post-content {
  flex: 1;
  min-width: 0;
}

.post-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.post-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #EFF6FF;
  color: #2563EB;
  font-weight: 600;
}

.tag-red {
  background: #FEE2E2;
  color: #DC2626;
}

.tag-orange {
  background: #FEF3C7;
  color: #D97706;
}

.tag-green {
  background: #D1FAE5;
  color: #059669;
}

.tag-blue {
  background: #EFF6FF;
  color: #2563EB;
}

.post-price {
  font-size: 18px;
  font-weight: 800;
  color: #2563EB;
  flex-shrink: 0;
  width: 80px;
  text-align: right;
}

.post-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  background: white;
  color: #475569;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.action-btn:hover {
  border-color: #2563EB;
  color: #2563EB;
}

.action-btn-danger {
  border-color: #FECACA;
  color: #EF4444;
}

.action-btn-danger:hover {
  background: #FEF2F2;
  border-color: #EF4444;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
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

.page-btn:hover:not(:disabled):not(.is-active) {
  border-color: #2563EB;
  color: #2563EB;
}

.page-btn.is-active {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 800px) {
  .post-card {
    flex-direction: column;
    align-items: stretch;
  }

  .post-img {
    width: 100%;
    height: 160px;
  }

  .post-price {
    width: auto;
    text-align: left;
  }
}
</style>
