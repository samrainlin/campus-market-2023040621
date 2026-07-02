<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useFavoriteStore, type FavoriteItem } from '../stores/favorite'

const favoriteStore = useFavoriteStore()
const keyword = ref('')
const tab = ref('all')

interface FavCard {
  id: number
  type: string
  tag: string
  tagBg: string
  tagColor: string
  title: string
  price: string
  priceColor: string
  author: string
  time: string
  image: string
}

const typeLabels: Record<string, string> = {
  trade: '二手',
  lostFound: '失物',
  groupBuy: '拼单',
  errand: '跑腿',
}

const typeTagColors: Record<string, { bg: string; color: string }> = {
  trade: { bg: '#EFF6FF', color: '#2563EB' },
  lostFound: { bg: '#FEE2E2', color: '#DC2626' },
  groupBuy: { bg: '#FEF3C7', color: '#D97706' },
  errand: { bg: '#D1FAE5', color: '#059669' },
}

const typePriceColors: Record<string, string> = {
  trade: '#2563EB',
  lostFound: '#EF4444',
  groupBuy: '#F59E0B',
  errand: '#10B981',
}

const favCards = computed<FavCard[]>(() => {
  return favoriteStore.favorites.map((item) => {
    const t = item.type
    const colors = typeTagColors[t] || { bg: '#EFF6FF', color: '#2563EB' }
    return {
      id: item.id,
      type: t,
      tag: typeLabels[t] || t,
      tagBg: colors.bg,
      tagColor: colors.color,
      title: item.title,
      price: '',
      priceColor: typePriceColors[t] || '#2563EB',
      author: '',
      time: '',
      image: `https://picsum.photos/seed/fav-${t}-${item.id}/400/300`,
    }
  })
})

const filteredCards = computed(() => {
  let list = favCards.value
  if (tab.value !== 'all') {
    list = list.filter((c) => c.type === tab.value)
  }
  if (keyword.value.trim()) {
    const kw = keyword.value.trim().toLowerCase()
    list = list.filter((c) => c.title.toLowerCase().includes(kw))
  }
  return list
})

function getRoute(card: FavCard) {
  const map: Record<string, string> = {
    trade: '/trade',
    lostFound: '/lost-found',
    groupBuy: '/group-buy',
    errand: '/errand',
  }
  return `${map[card.type] || '/trade'}/${card.id}`
}

function removeFavorite(card: FavCard) {
  favoriteStore.removeFavorite(card.type as FavoriteItem['type'], card.id)
}
</script>

<template>
  <div class="favorites-page">
    <div class="breadcrumb">
      <RouterLink to="/" class="breadcrumb-link">首页</RouterLink>
      <span class="breadcrumb-sep">/</span>
      <RouterLink to="/user" class="breadcrumb-link">个人中心</RouterLink>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">我的收藏</span>
    </div>

    <div class="page-header">
      <div>
        <h2 class="page-title">⭐ 我的收藏</h2>
        <div class="page-subtitle">共收藏 {{ favCards.length }} 条信息 · 按收藏时间排序</div>
      </div>
      <el-input placeholder="搜索收藏" size="default" v-model="keyword" style="width: 260px;">
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
    </div>

    <div class="tabs-wrapper">
      <el-tabs v-model="tab">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="二手交易" name="trade"></el-tab-pane>
        <el-tab-pane label="失物招领" name="lostFound"></el-tab-pane>
        <el-tab-pane label="拼单搭子" name="groupBuy"></el-tab-pane>
        <el-tab-pane label="跑腿委托" name="errand"></el-tab-pane>
      </el-tabs>
    </div>

    <div v-if="filteredCards.length === 0" class="empty-state">
      <p v-if="favoriteStore.favorites.length === 0">还没有收藏任何内容，去 <RouterLink to="/">首页</RouterLink> 看看吧</p>
      <p v-else>当前分类没有收藏</p>
    </div>

    <div v-else class="card-grid">
      <RouterLink
        v-for="card in filteredCards"
        :key="`${card.type}-${card.id}`"
        :to="getRoute(card)"
        class="fav-card"
      >
        <button class="heart-btn" @click.prevent="removeFavorite(card)">⭐</button>
        <img :src="card.image" class="fav-img" alt="" />
        <div class="fav-body">
          <div style="margin-bottom: 8px;">
            <span class="fav-tag" :style="{ background: card.tagBg, color: card.tagColor }">{{ card.tag }}</span>
          </div>
          <h3 class="fav-title">{{ card.title }}</h3>
          <div class="fav-meta">
            <div class="fav-price" :style="{ color: card.priceColor }">{{ card.price || '查看详情' }}</div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.page-header { background: white; border-radius: 16px; padding: 28px 32px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(15,23,42,0.05); display: flex; justify-content: space-between; align-items: center; }
.page-title { font-size: 22px; font-weight: 700; color: #0F172A; margin: 0; }
.page-subtitle { font-size: 13px; color: #64748B; margin-top: 6px; }

.tabs-wrapper {
  background: white;
  border-radius: 12px;
  padding: 8px;
  margin-bottom: 20px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.fav-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(15,23,42,0.05);
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}
.fav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(15,23,42,0.1);
}
.fav-img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.fav-body { padding: 18px; }
.fav-title {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 46px;
}
.fav-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #64748B;
}
.fav-price {
  font-size: 18px;
  font-weight: 800;
  color: #2563EB;
}
.heart-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(15,23,42,0.1);
  z-index: 2;
}
.fav-tag {
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 999px;
  background: #FEF3C7;
  color: #D97706;
  font-weight: 600;
  margin-right: 6px;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #94A3B8;
  font-size: 14px;
}
.empty-state a { color: #2563EB; text-decoration: none; }

@media (max-width: 900px) { .card-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .card-grid { grid-template-columns: 1fr; } }
</style>
