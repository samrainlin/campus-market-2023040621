<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

interface ProductDetail {
  title: string
  price: string
  description: string
  seller: string
  location: string
  stock: number
}

const productMap: Record<string, ProductDetail> = {
  '1': {
    title: '二手教材《高等数学》',
    price: '¥28',
    description: '九成新，上下册两本打包出，无笔记无划线。同济大学数学系编，第七版，适合大一新生使用，原价 ¥78/本，现 2 本 ¥28 转让。',
    seller: '学生小明',
    location: '图书馆附近',
    stock: 2,
  },
  '2': {
    title: '自行车代步车',
    price: '¥380',
    description: '通勤专用，保养良好，刹车灵敏，适合校园短途。美利达品牌，26 寸，购入一年，使用频率低，车况良好。送 U 型锁 + 车筐。',
    seller: '毕业生小李',
    location: '北门宿舍区',
    stock: 1,
  },
  '3': {
    title: '考研资料合集',
    price: '¥49',
    description: '数学、英语、政治全套笔记 + 真题解析，电子版可打印。整理自 2025 考研学长学姐，重点标记清晰，含冲刺阶段押题卷。',
    seller: '考研上岸学长',
    location: '线上分享',
    stock: 99,
  },
  '4': {
    title: '宿舍收纳三件套',
    price: '¥65',
    description: '床下收纳箱 + 桌面整理架 + 衣架，毕业季搬家必备。收纳箱带滑轮，整理架分层设计，衣架防滑加厚。毕业甩卖，原价 ¥150。',
    seller: '学姐杂货铺',
    location: '南门 3 号宿舍楼',
    stock: 5,
  },
  '5': {
    title: '小电风扇',
    price: '¥35',
    description: 'USB 供电，三档风速，夏天自习室必备，静音设计。桌面立式，角度可调，带氛围灯。使用仅一个夏天，功能完好。',
    seller: '在校生小张',
    location: '图书馆附近',
    stock: 3,
  },
}

const route = useRoute()
const id = computed(() => String(route.params.id || ''))
const product = computed<ProductDetail>(() => productMap[id.value] || {
  title: '商品信息加载中',
  price: '--',
  description: '暂无该商品的详细描述，请返回列表选择其他商品。',
  seller: '--',
  location: '--',
  stock: 0,
})
</script>

<template>
  <div class="detail-page">
    <div class="detail-header">
      <div class="id-badge">商品 ID: {{ id }}</div>
    </div>

    <div class="detail-card">
      <div class="product-main">
        <h1 class="product-title">{{ product.title }}</h1>
        <div class="product-price">{{ product.price }}</div>
        <p class="product-desc">{{ product.description }}</p>

        <div class="product-meta">
          <div class="meta-item">
            <span class="meta-label">卖家</span>
            <span class="meta-value">{{ product.seller }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">交易地点</span>
            <span class="meta-value">{{ product.location }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">库存</span>
            <span class="meta-value">{{ product.stock }} 件</span>
          </div>
        </div>

        <div class="product-actions">
          <button class="btn btn-primary">立即购买</button>
          <button class="btn btn-secondary">加入购物车</button>
          <router-link to="/list" class="back-link">← 返回列表</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.id-badge {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(64, 158, 255, 0.1);
  color: #409EFF;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(64, 158, 255, 0.2);
}

.detail-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.04);
}

.product-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.product-price {
  font-size: 36px;
  font-weight: 700;
  color: #2B6CB0;
  letter-spacing: 1px;
}

.product-desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #475569;
  background: #f8fafc;
  padding: 16px 20px;
  border-radius: 8px;
  border-left: 3px solid #409EFF;
}

.product-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.meta-value {
  font-size: 14px;
  color: #1e293b;
  font-weight: 600;
}

.product-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.btn-secondary {
  background: #ffffff;
  color: #409EFF;
  border: 1px solid #409EFF;
}

.btn-secondary:hover {
  background: rgba(64, 158, 255, 0.08);
}

.back-link {
  margin-left: auto;
  font-size: 13px;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: #409EFF;
}

@media (max-width: 640px) {
  .detail-card {
    padding: 24px;
  }

  .product-meta {
    grid-template-columns: 1fr;
  }

  .product-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .back-link {
    margin-left: 0;
    text-align: center;
    padding-top: 8px;
  }
}
</style>
