<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'
import { getTrades, type TradeItem } from '../api/trade'
import { getLostFounds, type LostFoundItem } from '../api/lostFound'
import { getGroupBuys, type GroupBuyItem } from '../api/groupBuy'
import { getErrands, type ErrandItem } from '../api/errand'

interface PublishedItem {
  id: number
  type: 'trade' | 'lostFound' | 'groupBuy' | 'errand'
  typeLabel: string
  title: string
  description: string
  location: string
  status: string
  image: string
  price?: string
  publishTime: string
}

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

const loading = ref(false)

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

const allPublished = computed<PublishedItem[]>(() => {
  const items: PublishedItem[] = []
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
        publishTime: item.publishTime,
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
        publishTime: item.time,
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
        publishTime: item.deadline,
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
        publishTime: item.deadline,
      })
    }
  })

  items.sort((a, b) => b.publishTime.localeCompare(a.publishTime))
  return items
})

const totalPublished = computed(() => allPublished.value.length)
const totalFavorites = computed(() => favoriteStore.favorites.length)
const completedCount = computed(() => allPublished.value.filter((i) => i.status === 'done').length)
const recentActivities = computed(() => allPublished.value.slice(0, 4))

const statusLabel = (s: string) => {
  const m: Record<string, string> = { open: '进行中', done: '已完成', closed: '已下架' }
  return m[s] || s
}

const defaultAvatar = 'https://picsum.photos/seed/campus-user/200/200'
const favoriteTypeLabels: Record<string, string> = {
  trade: '二手交易',
  lostFound: '失物招领',
  groupBuy: '拼单搭子',
  errand: '跑腿委托',
}

onMounted(() => {
  loadAllData()
})
</script>

<template>
  <section class="page">
    <div v-if="!userStore.isLoggedIn" class="not-logged-in">
      <h1>请先登录</h1>
      <p>登录后可以查看个人资料、我的收藏和我的发布。</p>
      <RouterLink class="login-link" to="/login">去登录</RouterLink>
    </div>

    <template v-else>
      <div class="profile-header">
        <img :src="userStore.avatar || defaultAvatar" class="avatar-lg" alt="头像" />
        <div class="profile-info">
          <h1 class="profile-name">{{ userStore.displayName }}</h1>
          <div class="profile-college">{{ userStore.college }} · {{ userStore.grade }}</div>
          <div class="profile-tags">
            <span class="profile-tag">✨ 信用优秀</span>
            <span class="profile-tag">🌟 已实名</span>
            <span class="profile-tag">📚 校园用户</span>
          </div>
        </div>
        <div class="profile-stats">
          <RouterLink to="/user/posts" class="stat-block">
            <div class="stat-num">{{ totalPublished }}</div>
            <div class="stat-label">我的发布</div>
          </RouterLink>
          <RouterLink to="/user/favorites" class="stat-block">
            <div class="stat-num">{{ totalFavorites }}</div>
            <div class="stat-label">我的收藏</div>
          </RouterLink>
          <div class="stat-block">
            <div class="stat-num">{{ completedCount }}</div>
            <div class="stat-label">已完成</div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <RouterLink to="/user/posts" class="action-card">
          <div class="action-card-icon">📝</div>
          <div class="action-card-title">我的发布</div>
          <div class="action-card-sub">管理你发布的所有信息</div>
        </RouterLink>
        <RouterLink to="/user/favorites" class="action-card">
          <div class="action-card-icon">⭐</div>
          <div class="action-card-title">我的收藏</div>
          <div class="action-card-sub">已收藏的优质信息</div>
        </RouterLink>
        <RouterLink to="/message" class="action-card">
          <div class="action-card-icon">💬</div>
          <div class="action-card-title">消息中心</div>
          <div class="action-card-sub">查看和回复消息</div>
        </RouterLink>
        <RouterLink to="/user/settings" class="action-card">
          <div class="action-card-icon">⚙️</div>
          <div class="action-card-title">账号设置</div>
          <div class="action-card-sub">个人资料与偏好</div>
        </RouterLink>
      </div>

      <div class="main-layout">
        <div>
          <div class="section-card">
            <div class="section-title">
              <span>⭐ 我的收藏</span>
              <span class="count-badge">共 {{ totalFavorites }} 条</span>
            </div>
            <div v-if="totalFavorites === 0" class="empty-state">
              <p>暂无收藏内容，可在各业务页面收藏感兴趣的信息</p>
            </div>
            <div v-else class="activity-list">
              <div
                v-for="item in favoriteStore.favorites"
                :key="`${item.type}-${item.id}`"
                class="activity-item"
              >
                <div class="activity-text">
                  <div class="activity-title">{{ item.title }}</div>
                  <div class="activity-meta">{{ favoriteTypeLabels[item.type] || item.type }} · {{ item.description }}</div>
                </div>
                <span class="activity-tag">{{ favoriteTypeLabels[item.type] || item.type }}</span>
                <button class="remove-btn" @click="favoriteStore.removeFavorite(item.type, item.id)">取消收藏</button>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title">
              <span>📋 最近动态</span>
              <RouterLink to="/user/posts" class="view-all-link">查看全部</RouterLink>
            </div>
            <div v-if="loading" class="empty-state"><p>加载中...</p></div>
            <div v-else-if="recentActivities.length === 0" class="empty-state">
              <p>暂无发布记录，快去发布吧</p>
            </div>
            <div v-else class="activity-list">
              <div
                v-for="item in recentActivities"
                :key="`${item.type}-${item.id}`"
                class="activity-item"
              >
                <img :src="item.image" class="activity-img" alt="" />
                <div class="activity-text">
                  <div class="activity-title">{{ item.title }}</div>
                  <div class="activity-meta">{{ item.publishTime }} · {{ item.location }}</div>
                </div>
                <span :class="['activity-tag', item.type === 'lostFound' ? 'tag-red' : item.type === 'groupBuy' ? 'tag-orange' : item.type === 'errand' ? 'tag-green' : 'tag-blue']">{{ item.typeLabel }}</span>
              </div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-title">
              <span>🏆 我的发布 · 精选</span>
              <RouterLink to="/user/posts" class="view-all-link">全部</RouterLink>
            </div>
            <div v-if="allPublished.length === 0" class="empty-state">
              <p>您还没有发布任何信息</p>
            </div>
            <div v-else class="featured-grid">
              <div
                v-for="item in allPublished.slice(0, 6)"
                :key="`f-${item.type}-${item.id}`"
                class="featured-card"
              >
                <img :src="item.image" class="featured-img" alt="" />
                <div class="featured-body">
                  <div class="featured-title">{{ item.title }}</div>
                  <div class="featured-price">{{ item.price || statusLabel(item.status) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="sidebar-card">
            <h3 class="sidebar-title">📈 账户信息</h3>
            <div class="info-list">
              <div class="info-item"><span class="info-label">学院</span><span class="info-value">{{ userStore.college || '未填写' }}</span></div>
              <div class="info-item"><span class="info-label">年级</span><span class="info-value">{{ userStore.grade || '未填写' }}</span></div>
              <div class="info-item"><span class="info-label">邮箱</span><span class="info-value">{{ userStore.email || '未填写' }}</span></div>
              <div class="info-item"><span class="info-label">手机</span><span class="info-value">{{ userStore.phone || '未填写' }}</span></div>
              <div class="info-item"><span class="info-label">微信</span><span class="info-value">{{ userStore.wechat || '未填写' }}</span></div>
              <div class="info-item"><span class="info-label">校区</span><span class="info-value">{{ userStore.campus || '未填写' }}</span></div>
              <div class="info-item"><span class="info-label">累计发布</span><span class="info-value">{{ totalPublished }} 条</span></div>
              <div class="info-item"><span class="info-label">累计成交</span><span class="info-value">{{ completedCount }} 笔</span></div>
            </div>
          </div>

          <div class="sidebar-card">
            <h3 class="sidebar-title">⚡ 快捷操作</h3>
            <RouterLink to="/publish" class="sidebar-btn sidebar-btn-primary">✨ 发布新信息</RouterLink>
            <RouterLink to="/message" class="sidebar-btn">💬 查看消息</RouterLink>
            <RouterLink to="/user/settings" class="sidebar-btn">⚙️ 账号设置</RouterLink>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.login-link:hover {
  background: #1d4ed8;
}

.profile-header {
  background: linear-gradient(135deg, #2563EB 0%, #4F46E5 100%);
  border-radius: 20px;
  padding: 40px;
  display: flex;
  align-items: center;
  gap: 32px;
  color: white;
  position: relative;
  overflow: hidden;
}

.profile-header::before {
  content: "";
  position: absolute;
  right: -10%;
  top: -60%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}

.avatar-lg {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid rgba(255,255,255,0.3);
  z-index: 1;
  background: #f3f4f6;
}

.profile-info {
  flex: 1;
  z-index: 1;
}

.profile-name {
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px 0;
}

.profile-college {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 14px;
}

.profile-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.profile-tag {
  background: rgba(255,255,255,0.2);
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.profile-stats {
  display: flex;
  gap: 40px;
  z-index: 1;
}

.stat-block {
  text-align: center;
  text-decoration: none;
  color: white;
  cursor: pointer;
  transition: transform 0.2s, opacity 0.2s;
  padding: 8px 12px;
  border-radius: 10px;
}

.stat-block:hover {
  transform: translateY(-2px);
  opacity: 0.95;
  background: rgba(255, 255, 255, 0.08);
}

.stat-num {
  font-size: 30px;
  font-weight: 800;
}

.stat-label {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 4px;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.action-card {
  background: white;
  padding: 24px 20px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  text-decoration: none;
  color: inherit;
  display: block;
}

.action-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
  background: #F8FAFC;
}

.action-card:hover .action-card-title {
  color: #2563EB;
}

.action-card-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.action-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
  transition: color 0.2s;
}

.action-card-sub {
  font-size: 12px;
  color: #64748B;
  margin-top: 6px;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
}

.section-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 18px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #F1F5F9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.count-badge {
  font-size: 12px;
  color: #64748B;
  background: #F1F5F9;
  padding: 4px 12px;
  border-radius: 999px;
  font-weight: 400;
}

.view-all-link {
  font-size: 13px;
  color: #2563EB;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 999px;
}

.view-all-link:hover {
  background: #EFF6FF;
  text-decoration: underline;
}

.empty-state {
  padding: 32px 0;
  text-align: center;
  color: #94A3B8;
  font-size: 14px;
}

.empty-state p {
  margin: 0;
}

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  padding: 14px 12px;
  border-bottom: 1px dashed #E2E8F0;
  cursor: pointer;
  transition: background 0.2s;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.activity-item:hover {
  background: #F8FAFC;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-img {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  background: #f3f4f6;
  flex-shrink: 0;
}

.activity-text {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 14px;
  font-weight: 600;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-meta {
  font-size: 12px;
  color: #94A3B8;
  margin-top: 4px;
}

.activity-tag {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 999px;
  background: #EFF6FF;
  color: #2563EB;
  font-weight: 600;
  flex-shrink: 0;
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

.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.featured-card {
  background: #F8FAFC;
  border-radius: 12px;
  padding: 12px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: all 0.3s;
}

.featured-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.1);
}

.featured-img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  background: #e5e7eb;
}

.featured-body {
  margin-top: 8px;
}

.featured-title {
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.featured-price {
  font-size: 13px;
  color: #2563EB;
  font-weight: 700;
  margin-top: 4px;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 14px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #F1F5F9;
}

.info-list {
  font-size: 13px;
  line-height: 2;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 2px 0;
}

.info-label {
  color: #64748B;
}

.info-value {
  color: #0F172A;
  font-weight: 500;
  text-align: right;
}

.sidebar-btn {
  display: block;
  width: 100%;
  padding: 10px 0;
  margin-bottom: 8px;
  text-align: center;
  border: 1px solid #E2E8F0;
  border-radius: 10px;
  font-size: 14px;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s;
}

.sidebar-btn:hover {
  border-color: #2563EB;
  color: #2563EB;
}

.sidebar-btn-primary {
  background: #2563EB;
  color: white;
  border-color: #2563EB;
}

.sidebar-btn-primary:hover {
  background: #1d4ed8;
  color: white;
}

.remove-btn {
  padding: 4px 12px;
  border: 1px solid #E2E8F0;
  border-radius: 999px;
  background: white;
  color: #94A3B8;
  cursor: pointer;
  font-size: 11px;
  flex-shrink: 0;
  transition: all 0.2s;
}

.remove-btn:hover {
  border-color: #f87171;
  color: #f87171;
  background: #fef2f2;
}

@media (max-width: 1000px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-stats {
    justify-content: center;
  }

  .featured-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
