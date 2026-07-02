<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTrade, getTrades, type TradeItem } from '../api/trade'
import { useFavoriteStore } from '../stores/favorite'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const favoriteStore = useFavoriteStore()
const userStore = useUserStore()

const trade = ref<TradeItem | null>(null)
const allTrades = ref<TradeItem[]>([])
const loading = ref(false)
const error = ref(false)

const isFavorited = computed(() => {
  if (!trade.value?.id) return false
  return favoriteStore.isFavorite('trade', trade.value.id)
})

async function loadTrade() {
  const id = Number(route.params.id)
  if (!id) { error.value = true; return }
  loading.value = true
  try {
    const res = await getTrade(id)
    trade.value = res.data
    const all = await getTrades()
    allTrades.value = all.data.filter((t) => t.id !== id)
  } catch (err) {
    console.error(err)
    error.value = true
  } finally {
    loading.value = false
  }
}

function toggleFavorite() {
  if (!trade.value) return
  const item = {
    id: trade.value.id ?? 0,
    type: 'trade' as const,
    title: trade.value.title,
    description: trade.value.description || '',
    location: trade.value.location,
  }
  favoriteStore.toggleFavorite(item)
}

const relatedTrades = computed(() => allTrades.value.slice(0, 4))

function showAlert(msg: string) {
  window.alert(msg)
}

function startChatWithPublisher() {
  if (!userStore.isLoggedIn) {
    window.alert('请先登录后再发起私信')
    router.push('/login')
    return
  }
  const publisher = trade.value?.publisher
  if (publisher) {
    router.push(`/chat/${encodeURIComponent(publisher)}`)
  } else {
    router.push('/message')
  }
}

onMounted(() => {
  loadTrade()
})
</script>

<template>
  <div class="detail-page" v-if="loading">加载中...</div>
  <div class="detail-page" v-else-if="error">加载失败</div>
  <div class="detail-page" v-else-if="trade">
    <div class="detail-hero">
      <img :src="trade.image || `https://picsum.photos/seed/trade-${trade.id}/1200/600`" :alt="trade.title" />
      <div class="detail-hero-overlay">
        <div class="detail-hero-tags">
          <span class="tag" style="background: #2563EB; color: white;">📚 二手商品</span>
          <span class="tag" style="background: rgba(255,255,255,0.25); color: white;">{{ trade.condition }}</span>
        </div>
        <h1 class="detail-hero-title">{{ trade.title }}</h1>
        <div class="detail-hero-meta">
          📍 {{ trade.location }} · ⏰ {{ trade.publishTime }} · 👁️ 已被浏览 128 次
        </div>
      </div>
      <div class="detail-hero-price">
        <div class="price-label-text">价格</div>
        <div class="price-main">¥{{ trade.price }}</div>
        <div v-if="trade.originalPrice" style="font-size: 12px; color: #94A3B8; text-decoration: line-through; margin-top: 4px;">原价 ¥{{ trade.originalPrice }}</div>
      </div>
    </div>

    <div class="detail-layout">
      <div class="detail-main">
        <div class="detail-section">
          <h3 class="detail-section-title">📦 商品信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-item-label">分类</div>
              <div class="info-item-value">{{ trade.category }}</div>
            </div>
            <div class="info-item">
              <div class="info-item-label">新旧程度</div>
              <div class="info-item-value">{{ trade.condition }}</div>
            </div>
            <div class="info-item">
              <div class="info-item-label">交易方式</div>
              <div class="info-item-value">{{ trade.transactionMethod || '当面交易' }}</div>
            </div>
            <div class="info-item">
              <div class="info-item-label">交易地点</div>
              <div class="info-item-value">{{ trade.location }}</div>
            </div>
            <div class="info-item">
              <div class="info-item-label">可议价</div>
              <div class="info-item-value">{{ trade.negotiateMethod || '支持小刀' }}</div>
            </div>
            <div class="info-item">
              <div class="info-item-label">联系方式</div>
              <div class="info-item-value">{{ trade.contact || '发起私信' }}</div>
            </div>
          </div>

          <h3 class="detail-section-title" style="margin-top: 24px;">📝 详细描述</h3>
          <div class="description-text">
            <p>{{ trade.description || '暂无详细描述' }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="detail-section-title">⚡ 快速操作</h3>
          <div class="action-row">
            <button class="action-btn action-btn-primary" @click="startChatWithPublisher">
              💬 联系发布者
            </button>
            <button :class="['action-btn', 'action-btn-secondary', { active: isFavorited }]" @click="toggleFavorite">
              {{ isFavorited ? '✅ 已收藏' : '⭐ 收藏' }}
            </button>
            <button class="action-btn action-btn-report" @click="showAlert('已收到您的举报，管理员会尽快审核处理。')">
              🚩 举报
            </button>
          </div>
        </div>
      </div>

      <div>
        <div class="sidebar-card">
          <div class="author-section">
            <img :src="`https://picsum.photos/seed/user-${trade.publisher}/150/150`" alt="发布者头像" class="author-avatar" />
            <div class="author-info">
              <div class="author-name">{{ trade.publisher }}</div>
              <div class="author-college">校园用户</div>
              <span class="credit-badge">✨ 信用优良 · 已实名</span>
            </div>
          </div>
          <div class="author-stats">
            <div>
              <div class="author-stat-num">23</div>
              <div class="author-stat-label">发布数</div>
            </div>
            <div>
              <div class="author-stat-num">18</div>
              <div class="author-stat-label">成交数</div>
            </div>
            <div>
              <div class="author-stat-num">98%</div>
              <div class="author-stat-label">好评率</div>
            </div>
          </div>
          <button class="sidebar-contact-btn" @click="startChatWithPublisher">💬 发起私信</button>
        </div>

        <div class="sidebar-card">
          <h3 class="sidebar-title">📋 信息摘要</h3>
          <div class="summary-item">
            <span class="summary-label">发布时间</span>
            <span class="summary-value">{{ trade.publishTime }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">浏览次数</span>
            <span class="summary-value">128 次</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">信息状态</span>
            <span class="summary-value" :style="{ color: trade.status === 'open' ? '#10B981' : '#64748B' }">{{ trade.status === 'open' ? '在售' : trade.status === 'done' ? '已售' : '已下架' }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">信息编号</span>
            <span class="summary-value">#TRADE-{{ String(trade.id).padStart(4, '0') }}</span>
          </div>
        </div>

        <div class="sidebar-card sidebar-tip">
          <h3 class="sidebar-title" style="color: #A16207;">💡 交易小贴士</h3>
          <div class="safety-tip">
            · 请优先选择校园内公共区域当面交易<br />
            · 交易前仔细检查商品状态<br />
            · 谨慎提前付款，建议货到付款<br />
            · 如遇问题，请点击"举报"按钮
          </div>
        </div>
      </div>
    </div>

    <div class="recommend-section" v-if="relatedTrades.length > 0">
      <div class="detail-section-title" style="font-size: 18px;">🔗 相关推荐 · 你可能感兴趣</div>
      <div class="recommend-grid">
        <RouterLink
          v-for="item in relatedTrades"
          :key="item.id"
          :to="`/trade/${item.id}`"
          class="recommend-card"
        >
          <div class="recommend-card-image">
            <img :src="item.image || `https://picsum.photos/seed/rec-${item.id}/400/250`" alt="" />
          </div>
          <div class="recommend-card-body">
            <h3 class="recommend-card-title">{{ item.title }}</h3>
            <div class="recommend-card-price">¥{{ item.price }}</div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  justify-content: center;
  align-items: center;
  color: #64748B;
  font-size: 14px;
}

.detail-hero {
  width: 100%;
  height: 460px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12);
  margin-bottom: 24px;
}

.detail-hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32px;
  background: linear-gradient(to top, rgba(0,0,0,0.75), transparent);
  color: white;
}

.detail-hero-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.detail-hero-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.detail-hero-meta {
  font-size: 14px;
  opacity: 0.9;
}

.detail-hero-price {
  position: absolute;
  top: 32px;
  right: 32px;
  background: rgba(255,255,255,0.95);
  color: #2563EB;
  padding: 16px 32px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.price-label-text {
  font-size: 12px;
  color: #64748B;
}

.price-main {
  font-size: 36px;
  font-weight: 800;
  line-height: 1.1;
}

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
}

.detail-main {
  min-width: 0;
}

.detail-section {
  background: white;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
}

.detail-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #F1F5F9;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  background: #F8FAFC;
  padding: 14px;
  border-radius: 10px;
}

.info-item-label {
  font-size: 12px;
  color: #64748B;
  margin-bottom: 6px;
}

.info-item-value {
  font-size: 14px;
  color: #0F172A;
  font-weight: 600;
}

.description-text {
  font-size: 14px;
  line-height: 1.8;
  color: #475569;
}

.description-text p {
  margin: 0;
}

.action-row {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.action-btn {
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.action-btn-primary {
  background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.action-btn-primary:hover {
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.35);
  transform: translateY(-1px);
}

.action-btn-secondary {
  background: white;
  color: #475569;
  border: 2px solid #E2E8F0;
}

.action-btn-secondary:hover {
  border-color: #F59E0B;
  color: #F59E0B;
}

.action-btn-secondary.active {
  background: #FEF3C7;
  border-color: #F59E0B;
  color: #D97706;
}

.action-btn-report {
  background: white;
  color: #EF4444;
  border: 2px solid #FECACA;
  flex: 0 0 auto;
  padding: 14px 20px;
}

.action-btn-report:hover {
  background: #FEF2F2;
  border-color: #EF4444;
}

.sidebar-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 16px;
}

.sidebar-tip {
  background: #FEFCE8;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 14px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #F1F5F9;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #F1F5F9;
  margin-bottom: 16px;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  background: #F1F5F9;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}

.author-college {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
}

.credit-badge {
  display: inline-block;
  font-size: 11px;
  color: #10B981;
  background: #F0FDF4;
  padding: 3px 10px;
  border-radius: 999px;
  margin-top: 6px;
  font-weight: 600;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  text-align: center;
  padding-top: 4px;
}

.author-stat-num {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
}

.author-stat-label {
  font-size: 11px;
  color: #94A3B8;
}

.sidebar-contact-btn {
  width: 100%;
  padding: 12px;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.sidebar-contact-btn:hover {
  background: #1d4ed8;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 13px;
  border-bottom: 1px dashed #F1F5F9;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  color: #64748B;
}

.summary-value {
  color: #0F172A;
  font-weight: 600;
  text-align: right;
}

.safety-tip {
  font-size: 12px;
  color: #78350F;
  line-height: 1.6;
}

.recommend-section {
  background: white;
  border-radius: 14px;
  padding: 24px;
  margin-top: 20px;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.recommend-card {
  background: #F8FAFC;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  color: inherit;
  display: block;
}

.recommend-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1);
}

.recommend-card-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  background: #F1F5F9;
}

.recommend-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommend-card-body {
  padding: 12px 14px;
}

.recommend-card-title {
  font-size: 13px;
  color: #0F172A;
  margin: 0 0 8px 0;
  line-height: 1.5;
  font-weight: 600;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 40px;
}

.recommend-card-price {
  font-size: 16px;
  font-weight: 700;
  color: #2563EB;
}

@media (max-width: 1100px) {
  .detail-layout { grid-template-columns: 1fr; }
  .recommend-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (max-width: 800px) {
  .detail-hero { height: 320px; }
  .detail-hero-title { font-size: 20px; }
  .detail-hero-price { position: static; margin-top: 16px; display: inline-block; }
  .recommend-grid { grid-template-columns: repeat(2, 1fr); }
  .info-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 500px) {
  .recommend-grid { grid-template-columns: 1fr 1fr; }
  .info-grid { grid-template-columns: 1fr; }
}
</style>
