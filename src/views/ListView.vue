<script setup lang="ts">
interface ProductItem {
  id: number
  title: string
  description: string
  price: string
}

const products: ProductItem[] = [
  {
    id: 1,
    title: '商品1 · 二手教材《高等数学》',
    description: '九成新，上下册两本打包出，无笔记无划线',
    price: '¥28',
  },
  {
    id: 2,
    title: '商品2 · 自行车代步车',
    description: '通勤专用，保养良好，刹车灵敏，适合校园短途',
    price: '¥380',
  },
  {
    id: 3,
    title: '商品3 · 考研资料合集',
    description: '数学、英语、政治全套笔记 + 真题解析，电子版可打印',
    price: '¥49',
  },
  {
    id: 4,
    title: '商品4 · 宿舍收纳三件套',
    description: '床下收纳箱 + 桌面整理架 + 衣架，毕业季搬家必备',
    price: '¥65',
  },
  {
    id: 5,
    title: '商品5 · 小电风扇',
    description: 'USB 供电，三档风速，夏天自习室必备，静音设计',
    price: '¥35',
  },
]
</script>

<template>
  <div class="list-page">
    <div class="list-header">
      <h2 class="list-title">商品列表</h2>
      <p class="list-subtitle">共 {{ products.length }} 条记录 · 点击查看详情</p>
    </div>

    <div class="list-content">
      <router-link
        v-for="item in products"
        :key="item.id"
        :to="`/detail/${item.id}`"
        class="list-item"
      >
        <div class="item-info">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-desc">{{ item.description }}</div>
        </div>
        <div class="item-meta">
          <div class="item-price">{{ item.price }}</div>
          <div class="item-action">查看详情 →</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.list-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-title {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
}

.list-subtitle {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.list-item:hover {
  transform: translateY(-2px);
  border-color: #409EFF;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.12);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.4;
}

.list-item:hover .item-title {
  color: #409EFF;
}

.item-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.item-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  flex-shrink: 0;
}

.item-price {
  font-size: 20px;
  font-weight: 700;
  color: #2B6CB0;
}

.item-action {
  font-size: 12px;
  color: #409EFF;
  font-weight: 500;
}
</style>
