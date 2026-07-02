<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getErrand, getErrands, type ErrandItem } from '../api/errand'

const route = useRoute()

const errand = ref<ErrandItem | null>(null)
const allErrands = ref<ErrandItem[]>([])
const loading = ref(false)
const error = ref(false)

async function loadErrand() {
  const id = Number(route.params.id)
  if (!id) { error.value = true; return }
  loading.value = true
  try {
    const res = await getErrand(id)
    errand.value = res.data
    const all = await getErrands()
    allErrands.value = all.data.filter((e) => e.id !== id)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const relatedTasks = computed(() => allErrands.value.slice(0, 4))

function showAlert(msg: string) {
  window.alert(msg)
}

onMounted(() => {
  loadErrand()
})
</script>

<template>
  <div class="detail-page" v-if="loading">加载中...</div>
  <div class="detail-page" v-else-if="error">加载失败</div>
  <div class="detail-page" v-else-if="errand">
    <div class="detail-hero">
      <img :src="`https://picsum.photos/seed/task-hero-${errand.id}/1200/600`" alt="" />
      <div class="detail-hero-overlay">
        <div class="detail-hero-tags">
          <span class="tag" style="background: #10B981; color: white;">🏃 跑腿委托</span>
          <span class="tag" style="background: rgba(255,255,255,0.25); color: white;">⚡ 简单任务</span>
        </div>
        <h1 class="detail-hero-title">{{ errand.title }}</h1>
        <div class="detail-hero-meta">📍 {{ errand.pickupLocation }} → {{ errand.deliveryLocation }} · ⏰ {{ errand.deadline }} · 👁️ 已被浏览 132 次</div>
      </div>
      <div class="price-badge">
        <div class="price-label">报酬</div>
        <div class="price-value">¥{{ errand.reward }}</div>
        <div style="font-size: 12px; opacity: 0.9;">起 / 每件</div>
      </div>
    </div>

    <div class="detail-layout">
      <div class="detail-main">
        <div class="detail-section">
          <h3 class="detail-section-title">🗺️ 路线概览</h3>
          <div class="route-box">
            <div class="route-icon">📍</div>
            <div class="route-line">
              <span class="route-loc">{{ errand.pickupLocation }}</span>
              <span class="route-arrow">——→</span>
              <span class="route-loc">{{ errand.deliveryLocation }}</span>
            </div>
          </div>

          <h3 class="detail-section-title" style="margin-top: 8px;">📌 任务信息</h3>
          <div class="task-info-grid">
            <div class="task-info-item">
              <div class="task-info-label">任务类型</div>
              <div class="task-info-value">{{ errand.taskType }}</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">取件地址</div>
              <div class="task-info-value">{{ errand.pickupLocation }}</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">送达地址</div>
              <div class="task-info-value">{{ errand.deliveryLocation }}</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">期望完成时间</div>
              <div class="task-info-value">{{ errand.deadline }}</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">报酬</div>
              <div class="task-info-value" style="color: #059669;">¥{{ errand.reward }} 起 / 每件</div>
            </div>
            <div class="task-info-item">
              <div class="task-info-label">联系人</div>
              <div class="task-info-value">{{ errand.contact || errand.publisher }}</div>
            </div>
          </div>

          <h3 class="detail-section-title" style="margin-top: 24px;">📝 详细描述</h3>
          <div class="description-text">
            <p>{{ errand.description || '暂无详细描述' }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="detail-section-title">⚡ 快速操作</h3>
          <div class="action-row">
            <button class="action-btn action-btn-primary" @click="showAlert('报名成功！发布者会尽快联系您确认～')">🙋 我帮你跑</button>
            <RouterLink to="/message" class="action-btn action-btn-secondary">💬 私聊协商</RouterLink>
            <button class="action-btn action-btn-report" @click="showAlert('感谢您的举报')">🚩 举报</button>
          </div>
        </div>
      </div>

      <div>
        <div class="sidebar-card">
          <div class="author-section">
            <img :src="`https://picsum.photos/seed/user-errand-${errand.id}/150/150`" alt="发布者" class="author-avatar" />
            <div class="author-info">
              <div class="author-name">{{ errand.publisher }}</div>
              <div class="author-college">校园用户</div>
              <span class="credit-badge">✨ 信用优良 · 已实名</span>
            </div>
          </div>
          <div class="author-stats">
            <div><div class="author-stat-num">12</div><div class="author-stat-label">发布任务</div></div>
            <div><div class="author-stat-num">10</div><div class="author-stat-label">已完成</div></div>
            <div><div class="author-stat-num">100%</div><div class="author-stat-label">好评</div></div>
          </div>
          <RouterLink to="/message" style="display:block; width: 100%; margin-top: 16px;">
            <el-button size="large" style="width: 100%; background: #10B981; border-color: #10B981; color: white;">💬 私信TA</el-button>
          </RouterLink>
        </div>

        <div class="sidebar-card">
          <h3 class="sidebar-title">📋 信息摘要</h3>
          <div class="summary-item"><span class="summary-label">任务类型</span><span class="summary-value">{{ errand.taskType }}</span></div>
          <div class="summary-item">
            <span class="summary-label">状态</span>
            <span class="summary-value" :style="{ color: errand.status === 'open' ? '#10B981' : '#64748B' }">
              {{ errand.status === 'open' ? '招募中' : errand.status === 'done' ? '已完成' : '已关闭' }}
            </span>
          </div>
          <div class="summary-item"><span class="summary-label">发布时间</span><span class="summary-value">{{ errand.deadline }}</span></div>
          <div class="summary-item"><span class="summary-label">浏览次数</span><span class="summary-value">132 次</span></div>
          <div class="summary-item"><span class="summary-label">报名人数</span><span class="summary-value" style="color: #059669;">3 人</span></div>
          <div class="summary-item"><span class="summary-label">信息编号</span><span class="summary-value">#ERR-{{ String(errand.id).padStart(4, '0') }}</span></div>
        </div>

        <div class="sidebar-card" style="background: #FEF3C7;">
          <h3 class="sidebar-title" style="color: #A16207;">💡 跑腿小贴士</h3>
          <div class="safety-tip">
            · 请确认时间地点再接单<br />
            · 贵重物品请谨慎接单<br />
            · 保护隐私，信息真实<br />
            · 任务完成后请及时反馈
          </div>
        </div>
      </div>
    </div>

    <div class="recommend-section" v-if="relatedTasks.length > 0">
      <div class="detail-section-title" style="font-size: 18px;">🔗 相关任务 · 你可能也能帮上忙</div>
      <div class="recommend-grid">
        <RouterLink
          v-for="item in relatedTasks"
          :key="item.id"
          :to="`/errand/${item.id}`"
          class="recommend-card"
        >
          <div class="recommend-card-image">
            <img :src="`https://picsum.photos/seed/task-rec-${item.id}/400/250`" alt="" />
          </div>
          <div class="recommend-card-body">
            <h3 class="recommend-card-title">{{ item.title }}</h3>
            <div class="recommend-card-price">¥{{ item.reward }}</div>
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
  height: 420px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 28px rgba(15, 23, 42, 0.12);
}
.detail-hero img { width: 100%; height: 100%; object-fit: cover; }
.detail-hero-overlay {
  position: absolute; bottom: 0; left: 0; right: 0; padding: 32px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: white;
}
.detail-hero-tags { display: flex; gap: 8px; margin-bottom: 12px; }
.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}
.detail-hero-title { font-size: 26px; font-weight: 700; margin: 0 0 8px 0; }
.detail-hero-meta { font-size: 14px; opacity: 0.92; }

.price-badge {
  position: absolute; top: 32px; right: 32px;
  background: linear-gradient(135deg, #10B981, #059669);
  color: white; padding: 16px 28px; border-radius: 16px;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3); text-align: center;
}
.price-label { font-size: 12px; opacity: 0.9; }
.price-value { font-size: 28px; font-weight: 800; line-height: 1.2; }

.detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; margin-top: 24px; width: 100%; }
.detail-main { min-width: 0; }
.detail-section {
  background: white; border-radius: 14px; padding: 24px; margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}
.detail-section-title {
  font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0;
  padding-bottom: 12px; border-bottom: 2px solid #F1F5F9;
}

.task-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.task-info-item {
  background: #F0FDF4; border-left: 4px solid #10B981;
  padding: 14px 16px; border-radius: 10px;
}
.task-info-label { font-size: 12px; color: #064E3B; margin-bottom: 6px; font-weight: 600; }
.task-info-value { font-size: 14px; color: #0F172A; font-weight: 600; }

.route-box {
  background: linear-gradient(135deg, #F0FDF4, #DCFCE7);
  border: 2px solid #10B981;
  border-radius: 14px; padding: 20px; margin-bottom: 20px;
  display: flex; align-items: center; gap: 16px;
}
.route-icon {
  width: 48px; height: 48px; border-radius: 12px; background: #10B981; color: white;
  display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0;
}
.route-line { flex: 1; font-size: 14px; color: #0F172A; }
.route-loc { font-weight: 600; }
.route-arrow { color: #10B981; font-weight: 700; margin: 0 8px; }

.description-text { font-size: 14px; line-height: 1.8; color: #475569; }
.description-text p { margin: 0 0 12px 0; }
.description-text p:last-child { margin-bottom: 0; }

.action-row { display: flex; gap: 12px; padding-top: 8px; }
.action-btn {
  flex: 1; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600;
  border: none; cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;
}
.action-btn-primary {
  background: linear-gradient(135deg, #10B981, #059669); color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}
.action-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.35); }
.action-btn-secondary { background: white; color: #475569; border: 2px solid #E2E8F0; }
.action-btn-secondary:hover { border-color: #F59E0B; color: #F59E0B; }
.action-btn-report {
  background: white; color: #EF4444; border: 2px solid #FECACA;
  flex: 0 0 auto; padding: 14px 20px;
}
.action-btn-report:hover { background: #FEF2F2; border-color: #EF4444; }

.sidebar-card {
  background: white; border-radius: 14px; padding: 20px; margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}
.sidebar-title {
  font-size: 14px; font-weight: 700; color: #0F172A; margin: 0 0 14px 0;
  padding-bottom: 10px; border-bottom: 2px solid #F1F5F9;
}
.author-section {
  display: flex; align-items: center; gap: 12px; padding-bottom: 16px;
  border-bottom: 1px solid #F1F5F9; margin-bottom: 16px;
}
.author-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
.author-info { flex: 1; }
.author-name { font-size: 16px; font-weight: 700; color: #0F172A; }
.author-college { font-size: 12px; color: #64748B; margin-top: 4px; }
.credit-badge {
  display: inline-block; font-size: 11px; color: #10B981; background: #F0FDF4;
  padding: 3px 10px; border-radius: 999px; margin-top: 6px; font-weight: 600;
}
.author-stats { display: flex; justify-content: space-around; text-align: center; padding-top: 4px; }
.author-stat-num { font-size: 18px; font-weight: 700; color: #0F172A; }
.author-stat-label { font-size: 11px; color: #94A3B8; }
.summary-item {
  display: flex; justify-content: space-between; align-items: center; padding: 10px 0;
  font-size: 13px; border-bottom: 1px dashed #F1F5F9;
}
.summary-item:last-child { border-bottom: none; }
.summary-label { color: #64748B; }
.summary-value { color: #0F172A; font-weight: 600; text-align: right; }

.safety-tip {
  font-size: 12px; color: #78350F; line-height: 1.6;
}

.recommend-section {
  background: white; border-radius: 14px; padding: 24px; margin-top: 20px;
  width: 100%;
}
.recommend-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.recommend-card {
  background: #F8FAFC; border-radius: 12px; overflow: hidden; cursor: pointer;
  transition: all 0.3s; text-decoration: none; color: inherit; display: block;
}
.recommend-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px rgba(15, 23, 42, 0.1); }
.recommend-card-image { width: 100%; height: 140px; overflow: hidden; }
.recommend-card-image img { width: 100%; height: 100%; object-fit: cover; }
.recommend-card-body { padding: 12px 14px; }
.recommend-card-title {
  font-size: 13px; color: #0F172A; margin: 0 0 8px 0; line-height: 1.5; font-weight: 600;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 40px;
}
.recommend-card-price { font-size: 15px; font-weight: 700; color: #10B981; }

@media (max-width: 1100px) { .detail-layout { grid-template-columns: 1fr; } .recommend-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 800px) { .recommend-grid { grid-template-columns: repeat(2, 1fr); } .task-info-grid { grid-template-columns: 1fr; } .price-badge { position: static; display: inline-block; margin-top: 16px; } }
</style>
