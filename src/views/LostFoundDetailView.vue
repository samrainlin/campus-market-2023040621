<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { getLostFound, getLostFounds, type LostFoundItem } from '../api/lostFound'

const route = useRoute()

const lostFound = ref<LostFoundItem | null>(null)
const allLostFounds = ref<LostFoundItem[]>([])
const loading = ref(false)
const error = ref(false)

async function loadLostFound() {
  const id = Number(route.params.id)
  if (!id) { error.value = true; return }
  loading.value = true
  try {
    const res = await getLostFound(id)
    lostFound.value = res.data
    const all = await getLostFounds()
    allLostFounds.value = all.data.filter((l) => l.id !== id)
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

const relatedItems = computed(() => allLostFounds.value.slice(0, 4))
const isLost = computed(() => lostFound.value?.type === '寻物')

function showAlert(msg: string) {
  window.alert(msg)
}

onMounted(() => {
  loadLostFound()
})
</script>

<template>
  <div class="detail-page" v-if="loading">加载中...</div>
  <div class="detail-page" v-else-if="error">加载失败</div>
  <div class="detail-page" v-else-if="lostFound">
    <div class="detail-hero">
      <img :src="`https://picsum.photos/seed/lf-hero-${lostFound.id}/1200/600`" alt="" />
      <div class="detail-hero-overlay">
        <div class="detail-hero-tags">
          <span class="tag" :style="{ background: isLost ? '#EF4444' : '#10B981', color: 'white' }">
            {{ isLost ? '🔍 寻物启事' : '✅ 招领启事' }}
          </span>
          <span v-if="isLost" class="tag" style="background: rgba(255,255,255,0.25); color: white;">🆘 紧急寻找</span>
        </div>
        <h1 class="detail-hero-title">{{ lostFound.title }}</h1>
        <div class="detail-hero-meta">📍 {{ lostFound.location }} · ⏰ {{ lostFound.time }} · 👁️ 已被浏览 86 次</div>
      </div>
      <div v-if="isLost" class="reward-badge">
        <div class="reward-label">酬金</div>
        <div class="reward-value">¥{{ lostFound.description ? '20' : '面议' }}</div>
      </div>
    </div>

    <div class="detail-layout">
      <div class="detail-main">
        <div class="detail-section">
          <h3 class="detail-section-title">📌 失物信息</h3>
          <div class="lost-info-grid">
            <div class="lost-info-item">
              <div class="lost-info-label">物品名称</div>
              <div class="lost-info-value">{{ lostFound.itemName }}</div>
            </div>
            <div class="lost-info-item">
              <div class="lost-info-label">{{ isLost ? '丢失时间' : '捡到时间' }}</div>
              <div class="lost-info-value">{{ lostFound.time }}</div>
            </div>
            <div class="lost-info-item">
              <div class="lost-info-label">{{ isLost ? '丢失地点' : '捡到地点' }}</div>
              <div class="lost-info-value">{{ lostFound.location }}</div>
            </div>
            <div class="lost-info-item">
              <div class="lost-info-label">联系人</div>
              <div class="lost-info-value">{{ lostFound.contact }}</div>
            </div>
            <div class="lost-info-item">
              <div class="lost-info-label">物品特征</div>
              <div class="lost-info-value">{{ lostFound.description?.slice(0, 50) || '详见描述' }}</div>
            </div>
            <div class="lost-info-item">
              <div class="lost-info-label">{{ isLost ? '酬谢金额' : '认领方式' }}</div>
              <div class="lost-info-value" :style="{ color: isLost ? '#EF4444' : '#10B981' }">
                {{ isLost ? '面议' : '免费认领' }}
              </div>
            </div>
          </div>

          <h3 class="detail-section-title" style="margin-top: 24px;">📝 详细描述</h3>
          <div class="description-text">
            <p>{{ lostFound.description || '暂无详细描述' }}</p>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="detail-section-title">⚡ 快速操作</h3>
          <div class="action-row">
            <RouterLink to="/message" class="action-btn action-btn-primary" style="background: linear-gradient(135deg, #EF4444, #DC2626);">
              💬 联系发布者
            </RouterLink>
            <button class="action-btn action-btn-secondary" @click="showAlert('已收藏')">⭐ 收藏</button>
            <button class="action-btn action-btn-report" @click="showAlert('已收到您的举报')">🚩 举报</button>
          </div>
        </div>
      </div>

      <div>
        <div class="sidebar-card">
          <div class="author-section">
            <img :src="`https://picsum.photos/seed/user-${lostFound.contact}/150/150`" alt="发布者" class="author-avatar" />
            <div class="author-info">
              <div class="author-name">{{ lostFound.contact }}</div>
              <div class="author-college">校园用户</div>
              <span class="credit-badge">✨ 信用优良 · 已实名</span>
            </div>
          </div>
          <div class="author-stats">
            <div><div class="author-stat-num">8</div><div class="author-stat-label">发布</div></div>
            <div><div class="author-stat-num">3</div><div class="author-stat-label">寻回</div></div>
            <div><div class="author-stat-num">100%</div><div class="author-stat-label">好评率</div></div>
          </div>
          <RouterLink to="/message" style="display:block; width: 100%; margin-top: 16px;">
            <el-button :type="isLost ? 'danger' : 'primary'" size="large" style="width: 100%;">
              💬 {{ isLost ? '我有线索 · 联系TA' : '联系认领' }}
            </el-button>
          </RouterLink>
        </div>

        <div class="sidebar-card">
          <h3 class="sidebar-title">📋 信息摘要</h3>
          <div class="summary-item"><span class="summary-label">物品类型</span><span class="summary-value">{{ lostFound.type }}</span></div>
          <div class="summary-item">
            <span class="summary-label">状态</span>
            <span class="summary-value" :style="{ color: lostFound.status === 'open' ? '#EF4444' : '#10B981' }">
              {{ lostFound.status === 'open' ? (isLost ? '寻找中' : '待认领') : lostFound.status === 'done' ? '已寻回' : '已关闭' }}
            </span>
          </div>
          <div class="summary-item"><span class="summary-label">发布时间</span><span class="summary-value">{{ lostFound.time }}</span></div>
          <div class="summary-item"><span class="summary-label">浏览次数</span><span class="summary-value">86 次</span></div>
          <div class="summary-item"><span class="summary-label">信息编号</span><span class="summary-value">#LF-{{ String(lostFound.id).padStart(4, '0') }}</span></div>
        </div>

        <div class="sidebar-card sidebar-tip">
          <h3 class="sidebar-title" style="color: #A16207;">💡 温馨提示</h3>
          <div class="safety-tip">
            · 拾到他人物品请及时归还或交至失物招领处<br />
            · 不要轻信非官方的"找回"服务<br />
            · 如发现冒用他人信息，请立即举报<br />
            · 学生事务中心失物招领电话：6228-1234
          </div>
        </div>
      </div>
    </div>

    <div class="recommend-section" v-if="relatedItems.length > 0">
      <div class="detail-section-title" style="font-size: 18px;">🔗 相关信息 · 你可能也在寻找</div>
      <div class="recommend-grid">
        <RouterLink
          v-for="item in relatedItems"
          :key="item.id"
          :to="`/lost-found/${item.id}`"
          class="recommend-card"
        >
          <div class="recommend-card-image">
            <img :src="`https://picsum.photos/seed/lf-rec-${item.id}/400/250`" alt="" />
          </div>
          <div class="recommend-card-body">
            <h3 class="recommend-card-title">{{ item.title }}</h3>
            <div class="recommend-card-price" :style="{ color: '#EF4444' }">{{ item.type === '寻物' ? '¥面议' : '免费认领' }}</div>
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
.detail-hero-title { font-size: 26px; font-weight: 700; margin: 0 0 8px 0; }
.detail-hero-meta { font-size: 14px; opacity: 0.92; }

.reward-badge {
  position: absolute; top: 32px; right: 32px;
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: white; padding: 16px 28px; border-radius: 16px;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3); text-align: center;
}
.reward-label { font-size: 12px; opacity: 0.9; }
.reward-value { font-size: 28px; font-weight: 800; line-height: 1.2; }

.detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 24px; width: 100%; }
.detail-main { min-width: 0; }
.detail-section {
  background: white; border-radius: 14px; padding: 24px; margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}
.detail-section-title {
  font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0;
  padding-bottom: 12px; border-bottom: 2px solid #F1F5F9;
}

.lost-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.lost-info-item {
  background: #FEF2F2; border-left: 4px solid #EF4444;
  padding: 14px 16px; border-radius: 10px;
}
.lost-info-label { font-size: 12px; color: #991B1B; margin-bottom: 6px; font-weight: 600; }
.lost-info-value { font-size: 14px; color: #0F172A; font-weight: 600; }

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
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: white; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
}
.action-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(239, 68, 68, 0.35); }
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
.recommend-card-price { font-size: 15px; font-weight: 700; color: #EF4444; }

@media (max-width: 1100px) { .detail-layout { grid-template-columns: 1fr; } .recommend-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 800px) { .detail-hero { height: 300px; } .recommend-grid { grid-template-columns: repeat(2, 1fr); } .lost-info-grid { grid-template-columns: 1fr; } .reward-badge { position: static; display: inline-block; margin-top: 16px; } }
</style>
