<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ItemCard from '../components/ItemCard.vue'
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
}

const userStore = useUserStore()
const favoriteStore = useFavoriteStore()

const trades = ref<TradeItem[]>([])
const lostFounds = ref<LostFoundItem[]>([])
const groupBuys = ref<GroupBuyItem[]>([])
const errands = ref<ErrandItem[]>([])

const loading = ref(false)

const typeLabelMap: Record<string, string> = {
  trade: '二手交易',
  lostFound: '失物招领',
  groupBuy: '拼单搭子',
  errand: '跑腿委托',
}

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
    console.error('Failed to load published data:', error)
  } finally {
    loading.value = false
  }
}

const myPublished = computed<PublishedItem[]>(() => {
  const items: PublishedItem[] = []
  const publisherName = userStore.displayName

  // 二手交易
  trades.value.forEach((item) => {
    if (item.publisher === publisherName) {
      items.push({
        id: item.id || Date.now() + Math.random(),
        type: 'trade',
        typeLabel: '二手交易',
        title: item.title,
        description: item.description || '',
        location: item.location,
        status: item.status,
      })
    }
  })

  // 失物招领（失物招领用 contact 字段作为发布者标识）
  lostFounds.value.forEach((item) => {
    if (item.contact === publisherName) {
      items.push({
        id: item.id || Date.now() + Math.random(),
        type: 'lostFound',
        typeLabel: '失物招领',
        title: item.title,
        description: item.description,
        location: item.location,
        status: item.status,
      })
    }
  })

  // 拼单搭子
  groupBuys.value.forEach((item) => {
    if (item.publisher === publisherName) {
      items.push({
        id: item.id || Date.now() + Math.random(),
        type: 'groupBuy',
        typeLabel: '拼单搭子',
        title: item.title,
        description: item.description || '',
        location: item.location,
        status: item.status,
      })
    }
  })

  // 跑腿委托
  errands.value.forEach((item) => {
    if (item.publisher === publisherName) {
      items.push({
        id: item.id || Date.now() + Math.random(),
        type: 'errand',
        typeLabel: '跑腿委托',
        title: item.title,
        description: item.description || '',
        location: item.pickupLocation,
        status: item.status,
      })
    }
  })

  return items
})

onMounted(() => {
  loadAllData()
})
</script>

<template>
  <section class="page">
    <div class="profile-card">
      <img :src="userStore.avatar" class="avatar" :alt="userStore.displayName" />

      <div class="profile-info">
        <h1 class="display-name">{{ userStore.displayName }}</h1>
        <p class="profile-text">{{ userStore.profileText }}</p>
        <p class="bio">欢迎来到个人中心，在这里查看和管理您的收藏与发布信息。</p>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>我的收藏</h2>
        <span class="count-badge">共 {{ favoriteStore.favorites.length }} 条</span>
      </div>

      <EmptyState v-if="favoriteStore.favorites.length === 0" text="暂无收藏内容，可在各业务页面收藏感兴趣的信息" />

      <div v-else class="item-list">
        <ItemCard
          v-for="item in favoriteStore.favorites"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :tag="typeLabelMap[item.type] || item.type"
          :location="item.location"
        >
          <template #footer>
            <button class="remove-btn" @click="favoriteStore.removeFavorite(item.type, item.id)">
              取消收藏
            </button>
          </template>
        </ItemCard>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <h2>我的发布</h2>
        <span class="count-badge">共 {{ myPublished.length }} 条</span>
      </div>

      <EmptyState v-if="!loading && myPublished.length === 0" text="您还没有发布任何信息，快去发布吧" />

      <div v-else-if="myPublished.length > 0" class="item-list">
        <ItemCard
          v-for="item in myPublished"
          :key="`${item.type}-${item.id}`"
          :title="item.title"
          :description="item.description"
          :tag="item.typeLabel"
          :location="item.location"
        >
          <template #footer>
            <span class="status-text">状态：{{ item.status }}</span>
          </template>
        </ItemCard>
      </div>

      <p class="hint">
        提示：个人中心展示所有类型中发布者字段为「{{ userStore.displayName }}」的数据。
      </p>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card,
.panel {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  background: #f3f4f6;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.display-name {
  margin: 0 0 6px;
  font-size: 22px;
  color: #1f2937;
}

.profile-text {
  margin: 0 0 8px;
  color: #4b5563;
  font-size: 14px;
}

.bio {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
  line-height: 1.6;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.panel h2 {
  margin: 0;
  font-size: 18px;
  color: #1f2937;
}

.count-badge {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  padding: 4px 12px;
  border-radius: 999px;
}

.item-list {
  display: grid;
  gap: 12px;
}

.remove-btn {
  padding: 6px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  border-color: #f87171;
  color: #f87171;
  background: #fef2f2;
}

.status-text {
  font-size: 12px;
  color: #6b7280;
}

.hint {
  margin: 16px 0 0;
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.6;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
}
</style>
