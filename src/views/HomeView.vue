<script setup lang="ts">
import { ref, computed } from 'vue'

interface FeedItem {
  id: number
  title: string
  category: '二手' | '失物' | '拼单' | '跑腿'
  price?: string
  location?: string
  author: string
  image: string
}

const searchKeyword = ref('')
const activeCategory = ref<string>('全部')
const currentPage = ref(1)
const pageSize = 6

const categories = ['全部', '二手', '失物', '拼单', '跑腿']

const feedList: FeedItem[] = [
  {
    id: 1,
    title: '出闲置教材《软件工程导论》，九成新',
    category: '二手',
    price: '¥25',
    author: '小明同学',
    image: 'https://picsum.photos/seed/1/400/300',
  },
  {
    id: 2,
    title: '丢失校园一卡通，捡到者重谢！',
    category: '失物',
    location: '三食堂附近',
    author: '粗心小李',
    image: 'https://picsum.photos/seed/2/400/300',
  },
  {
    id: 3,
    title: '奶茶拼单！一点点3杯起送，差1人',
    category: '拼单',
    price: '人均¥18',
    author: '奶茶爱好者',
    image: 'https://picsum.photos/seed/3/400/300',
  },
  {
    id: 4,
    title: '代取快递，菜鸟驿站/顺丰均可',
    category: '跑腿',
    price: '¥3/件',
    author: '跑腿小王',
    image: 'https://picsum.photos/seed/4/400/300',
  },
  {
    id: 5,
    title: '自行车代步车，九成新，诚心出',
    category: '二手',
    price: '¥280',
    author: '毕业学长',
    image: 'https://picsum.photos/seed/5/400/300',
  },
  {
    id: 6,
    title: '寻找丢失的黑色雨伞，望好心人归还',
    category: '失物',
    location: '图书馆二楼',
    author: '淋雨的同学',
    image: 'https://picsum.photos/seed/6/400/300',
  },
  {
    id: 7,
    title: '考研资料合集（数学+英语+政治）',
    category: '二手',
    price: '¥120',
    author: '上岸学长',
    image: 'https://picsum.photos/seed/7/400/300',
  },
  {
    id: 8,
    title: '食堂午餐拼单，二食堂二楼黄焖鸡',
    category: '拼单',
    price: '人均¥22',
    author: '干饭达人',
    image: 'https://picsum.photos/seed/8/400/300',
  },
  {
    id: 9,
    title: '代购学校门口打印店资料，可加急',
    category: '跑腿',
    price: '¥5起',
    author: '打印小能手',
    image: 'https://picsum.photos/seed/9/400/300',
  },
]

const filteredList = computed(() => {
  let list = feedList
  if (activeCategory.value !== '全部') {
    list = list.filter((item) => item.category === activeCategory.value)
  }
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
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

const categoryColor = (cat: string): string => {
  switch (cat) {
    case '二手':
      return '#409EFF'
    case '失物':
      return '#F56C6C'
    case '拼单':
      return '#E6A23C'
    case '跑腿':
      return '#67C23A'
    default:
      return '#409EFF'
  }
}

const handleCategoryChange = (cat: string) => {
  activeCategory.value = cat
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  currentPage.value = page
}
</script>

<template>
  <div class="home">
    <!-- 搜索框 -->
    <div class="search-box">
      <div class="search-input">
        <span class="search-icon">🔍</span>
        <input v-model="searchKeyword" type="text" placeholder="搜索商品、发布者..." />
        <button v-if="searchKeyword" type="button" class="clear-btn" @click="searchKeyword = ''">
          ×
        </button>
      </div>
    </div>

    <!-- 分类快捷入口 -->
    <div class="category-bar">
      <div
        v-for="cat in categories"
        :key="cat"
        class="category-item"
        :class="{ active: activeCategory === cat }"
        @click="handleCategoryChange(cat)"
      >
        <span class="category-icon">
          <template v-if="cat === '全部'">📦</template>
          <template v-else-if="cat === '二手'">📚</template>
          <template v-else-if="cat === '失物'">🔍</template>
          <template v-else-if="cat === '拼单'">🧋</template>
          <template v-else-if="cat === '跑腿'">🏃</template>
        </span>
        <span class="category-label">{{ cat }}</span>
      </div>
    </div>

    <!-- 信息流卡片列表 -->
    <div class="feed-list">
      <router-link
        v-for="item in filteredList"
        :key="item.id"
        :to="`/detail/${item.id}`"
        class="feed-card"
      >
        <div class="card-image">
          <img :src="item.image" :alt="item.title" />
          <span
            class="card-tag"
            :style="{ backgroundColor: categoryColor(item.category) }"
          >
            {{ item.category }}
          </span>
        </div>
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-meta">
            <span v-if="item.price" class="card-price">{{ item.price }}</span>
            <span v-if="item.location" class="card-location">📍 {{ item.location }}</span>
          </div>
          <div class="card-footer">
            <span class="card-author">👤 {{ item.author }}</span>
            <span class="card-more">查看详情 →</span>
          </div>
        </div>
      </router-link>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredList.length === 0" class="empty-state">
      <p>暂无相关内容</p>
    </div>

    <!-- 分页 -->
    <div v-if="filteredList.length > 0" class="pagination-box">
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
.home {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-box {
  display: flex;
  justify-content: center;
}

.search-input {
  max-width: 600px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 999px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.search-input:focus-within {
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.search-icon {
  font-size: 14px;
  color: #94a3b8;
  flex-shrink: 0;
}

.search-input input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
  font-family: inherit;
}

.search-input input::placeholder {
  color: #94a3b8;
}

.clear-btn {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #cbd5e1;
  color: #ffffff;
  font-size: 14px;
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

.category-bar {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.category-item:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.category-item.active {
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.35);
}

.category-icon {
  font-size: 16px;
}

.category-label {
  font-size: 14px;
  font-weight: 500;
}

.feed-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feed-card {
  display: block;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
}

.feed-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f1f5f9;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.feed-card:hover .card-image img {
  transform: scale(1.05);
  transition: transform 0.4s ease;
}

.card-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.card-price {
  font-size: 18px;
  font-weight: 700;
  color: #409EFF;
}

.card-location {
  font-size: 13px;
  color: #64748b;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #f1f5f9;
}

.card-author {
  font-size: 13px;
  color: #64748b;
}

.card-more {
  font-size: 13px;
  color: #409EFF;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
  font-size: 15px;
}

.pagination-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding-top: 12px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  border-radius: 6px;
  font-size: 16px;
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

@media (max-width: 900px) {
  .feed-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .feed-list {
    grid-template-columns: 1fr;
  }
}
</style>
