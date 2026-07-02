<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getGroupBuy, getGroupBuys, type GroupBuyItem } from '../api/groupBuy'

const route = useRoute()

const groupBuy = ref<GroupBuyItem | null>(null)
const allGroupBuys = ref<GroupBuyItem[]>([])
const loading = ref(false)
const error = ref(false)

async function loadGroupBuy() {
  const id = Number(route.params.id)
  if (!id) { error.value = true; return }
  loading.value = true
  try {
    const res = await getGroupBuy(id)
    groupBuy.value = res.data
    const all = await getGroupBuys()
    allGroupBuys.value = all.data.filter((g) => g.id !== id)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const relatedGroupBuys = computed(() => allGroupBuys.value.slice(0, 4))

function showAlert(msg: string) {
  window.alert(msg)
}

const progressPercent = computed(() => {
  if (!groupBuy.value) return 0
  const { currentCount, targetCount } = groupBuy.value
  return Math.min(100, Math.round((currentCount / targetCount) * 100))
})

onMounted(() => {
  loadGroupBuy()
})
</script>

<template>
  <div class="detail-page" v-if="loading">加载中...</div>
  <div class="detail-page" v-else-if="error">加载失败</div>
  <div class="detail-page" v-else-if="groupBuy">
    <div class="detail-hero">
      <img :src="`https://picsum.photos/seed/gb-hero-${groupBuy.id}/1200/600`" alt="" />
      <div class="detail-hero-overlay">
        <div class="detail-hero-tags">
          <span class="tag tag-orange">🍜 拼单搭子</span>
          <span class="tag tag-urgent">🚀 紧急发车</span>
        </div>
        <h1 class="detail-hero-title">{{ groupBuy.title }}</h1>
        <div class="detail-hero-meta">📍 {{ groupBuy.location }} · ⏰ {{ groupBuy.deadline }} 截止 · 👁️ 已被浏览 256 次</div>
      </div>
      <div class="group-badge">
        <div class="group-label">人均</div>
        <div class="group-value">¥{{ groupBuy.budget }}</div>
        <div class="group-sub">满 {{ groupBuy.targetCount }} 人发车</div>
      </div>
    </div>

    <div class="detail-layout">
      <div class="detail-main">
        <div class="detail-section">
          <h3 class="detail-section-title">🚂 拼单进度</h3>
          <div class="join-progress">
            <div class="progress-header">
              <div class="progress-header-text">已加入 {{ groupBuy.currentCount }} / {{ groupBuy.targetCount }} 人</div>
              <div class="progress-header-time">⏰ 剩余 2 小时 15 分钟</div>
            </div>
            <div class="progress-bar"><div class="progress-fill" :style="{ width: progressPercent + '%' }"></div></div>
            <div class="progress-stats">
              <span>发起人 · {{ groupBuy.publisher }}</span>
              <span><span class="progress-num">{{ groupBuy.currentCount }}</span> 人已加入</span>
            </div>
          </div>

          <h3 class="detail-section-title" style="margin-top: 8px;">📌 拼单信息</h3>
          <div class="group-info-grid">
            <div class="group-info-item"><div class="group-info-label">拼单主题</div><div class="group-info-value">{{ groupBuy.title }}</div></div>
            <div class="group-info-item"><div class="group-info-label">店铺</div><div class="group-info-value">{{ groupBuy.type }}</div></div>
            <div class="group-info-item"><div class="group-info-label">人数上限</div><div class="group-info-value">{{ groupBuy.targetCount }} 人</div></div>
            <div class="group-info-item"><div class="group-info-label">已报名</div><div class="group-info-value" style="color: #D97706;">{{ groupBuy.currentCount }} 人</div></div>
            <div class="group-info-item"><div class="group-info-label">集合地点</div><div class="group-info-value">{{ groupBuy.location }}</div></div>
            <div class="group-info-item"><div class="group-info-label">截止时间</div><div class="group-info-value">{{ groupBuy.deadline }}</div></div>
            <div class="group-info-item"><div class="group-info-label">人均预算</div><div class="group-info-value" style="color: #D97706;">¥{{ groupBuy.budget }} 左右</div></div>
            <div class="group-info-item"><div class="group-info-label">分配方式</div><div class="group-info-value">自取 / 宿舍楼下</div></div>
          </div>

          <h3 class="detail-section-title" style="margin-top: 24px;">📝 拼单说明</h3>
          <div class="description-text">
            <p>{{ groupBuy.description || '暂无详细说明' }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="detail-section-title">⚡ 快速操作</h3>
          <div class="action-row">
            <button class="action-btn action-btn-primary" @click="showAlert('报名成功！请等待发布者联系您～')">
              🙋 我要拼单
            </button>
            <RouterLink to="/message" class="action-btn action-btn-secondary">
              💬 私聊询问
            </RouterLink>
            <button class="action-btn action-btn-report" @click="showAlert('感谢您的举报')">
              🚩 举报
            </button>
          </div>
        </div>
      </div>

      <div>
        <div class="sidebar-card">
          <div class="author-section">
            <img :src="`https://picsum.photos/seed/user-${groupBuy.publisher}/150/150`" alt="发布者" class="author-avatar" />
            <div class="author-info">
              <div class="author-name">{{ groupBuy.publisher }}</div>
              <div class="author-college">校园用户</div>
              <span class="credit-badge">✨ 信用优良 · 已实名</span>
            </div>
          </div>
          <div class="author-stats">
            <div><div class="author-stat-num">15</div><div class="author-stat-label">发布拼单</div></div>
            <div><div class="author-stat-num">12</div><div class="author-stat-label">成功</div></div>
            <div><div class="author-stat-num">96%</div><div class="author-stat-label">好评</div></div>
          </div>
          <RouterLink to="/message" style="display:block; width: 100%; margin-top: 16px;">
            <el-button size="large" style="width: 100%; background: #F59E0B; border-color: #F59E0B; color: white;">💬 私信询问</el-button>
          </RouterLink>
        </div>

        <div class="sidebar-card">
          <h3 class="sidebar-title">📋 信息摘要</h3>
          <div class="summary-item"><span class="summary-label">拼单类型</span><span class="summary-value">{{ groupBuy.type }}</span></div>
          <div class="summary-item"><span class="summary-label">状态</span><span class="summary-value" style="color: #F59E0B;">{{ groupBuy.status === 'open' ? '召集中' : groupBuy.status === 'done' ? '已完成' : '已关闭' }}</span></div>
          <div class="summary-item"><span class="summary-label">发布时间</span><span class="summary-value">{{ groupBuy.deadline }}</span></div>
          <div class="summary-item"><span class="summary-label">浏览</span><span class="summary-value">256 次</span></div>
          <div class="summary-item"><span class="summary-label">报名</span><span class="summary-value" style="color: #D97706;">{{ groupBuy.currentCount }} 人</span></div>
          <div class="summary-item"><span class="summary-label">信息编号</span><span class="summary-value">#GRP-{{ String(groupBuy.id).padStart(4, '0') }}</span></div>
        </div>

        <div class="sidebar-card sidebar-tip">
          <h3 class="sidebar-title" style="color: #A16207;">💡 拼单小贴士</h3>
          <div class="safety-tip">
            · 拼单前请确认可及时取餐<br />
            · 请按时参加，勿放鸽子<br />
            · 费用透明，按实付 AA<br />
            · 如有疑问请先私信发布者
          </div>
        </div>
      </div>
    </div>

    <div class="recommend-section" v-if="relatedGroupBuys.length > 0">
      <div class="detail-section-title" style="font-size: 18px;">🔗 相关拼单 · 你可能感兴趣</div>
      <div class="recommend-grid">
        <RouterLink
          v-for="item in relatedGroupBuys"
          :key="item.id"
          :to="`/group-buy/${item.id}`"
          class="recommend-card"
        >
          <div class="recommend-card-image">
            <img :src="`https://picsum.photos/seed/gb-rec-${item.id}/400/250`" alt="" />
          </div>
          <div class="recommend-card-body">
            <h3 class="recommend-card-title">{{ item.title }}</h3>
            <div class="recommend-card-price" style="color: #F59E0B;">人均 ¥{{ item.budget }}</div>
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
  margin-bottom: 24px;
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
.tag-orange { background: #F59E0B; color: white; }
.tag-urgent { background: rgba(255,255,255,0.25); color: white; }
.detail-hero-title { font-size: 26px; font-weight: 700; margin: 0 0 8px 0; }
.detail-hero-meta { font-size: 14px; opacity: 0.92; }

.group-badge {
  position: absolute; top: 32px; right: 32px;
  background: linear-gradient(135deg, #F59E0B, #D97706);
  color: white; padding: 16px 28px; border-radius: 16px;
  box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3); text-align: center;
}
.group-label { font-size: 12px; opacity: 0.9; }
.group-value { font-size: 28px; font-weight: 800; line-height: 1.2; }
.group-sub { font-size: 12px; opacity: 0.9; margin-top: 2px; }

.detail-layout {
  display: grid; grid-template-columns: 1fr 340px; gap: 24px; width: 100%;
}
.detail-main { min-width: 0; }
.detail-section {
  background: white; border-radius: 14px; padding: 24px; margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}
.detail-section-title {
  font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0;
  padding-bottom: 12px; border-bottom: 2px solid #F1F5F9;
}

.join-progress {
  background: linear-gradient(135deg, #FFFBEB, #FEF3C7);
  border-radius: 14px; padding: 20px; margin-bottom: 20px;
}
.progress-header {
  display: flex; justify-content: space-between; align-items: baseline;
}
.progress-header-text { font-size: 15px; font-weight: 600; color: #78350F; }
.progress-header-time { font-size: 12px; color: #92400E; }
.progress-bar {
  background: #FEF3C7; border-radius: 999px; height: 12px; overflow: hidden;
  margin-top: 8px;
}
.progress-fill {
  background: linear-gradient(90deg, #F59E0B, #D97706);
  height: 100%; border-radius: 999px;
}
.progress-stats {
  display: flex; justify-content: space-between; margin-top: 12px;
  font-size: 13px; color: #78350F;
}
.progress-num { font-size: 18px; font-weight: 700; color: #D97706; }

.group-info-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;
}
.group-info-item {
  background: #FFFBEB; border-left: 4px solid #F59E0B;
  padding: 14px 16px; border-radius: 10px;
}
.group-info-label { font-size: 12px; color: #92400E; margin-bottom: 6px; font-weight: 600; }
.group-info-value { font-size: 14px; color: #0F172A; font-weight: 600; }

.action-row { display: flex; gap: 12px; padding-top: 8px; }
.action-btn {
  flex: 1; padding: 14px; border-radius: 12px; font-size: 15px; font-weight: 600;
  border: none; cursor: pointer; transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;
}
.action-btn-primary {
  background: linear-gradient(135deg, #F59E0B, #D97706); color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.25);
}
.action-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(245, 158, 11, 0.35); }
.action-btn-secondary { background: white; color: #475569; border: 2px solid #E2E8F0; }
.action-btn-secondary:hover { border-color: #2563EB; color: #2563EB; }
.action-btn-report {
  background: white; color: #EF4444; border: 2px solid #FECACA;
  flex: 0 0 auto; padding: 14px 20px;
}
.action-btn-report:hover { background: #FEF2F2; border-color: #EF4444; }

.sidebar-card {
  background: white; border-radius: 14px; padding: 20px; margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}
.sidebar-tip { background: #FEF3C7; }
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

.description-text { font-size: 14px; line-height: 1.8; color: #475569; }
.description-text p { margin: 0 0 12px 0; }
.description-text p:last-child { margin-bottom: 0; }

.safety-tip {
  font-size: 12px; color: #78350F; line-height: 1.6;
}

.recommend-section {
  background: white; border-radius: 14px; padding: 24px; margin-top: 20px;
  width: 100%; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
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
.recommend-card-price { font-size: 15px; font-weight: 700; color: #F59E0B; }

@media (max-width: 1100px) { .detail-layout { grid-template-columns: 1fr; } .recommend-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 800px) { .recommend-grid { grid-template-columns: repeat(2, 1fr); } .group-info-grid { grid-template-columns: 1fr; } .group-badge { position: static; display: inline-block; margin-top: 16px; } }
</style>
