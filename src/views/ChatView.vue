<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useConversationStore, type Conversation } from '../stores/conversation'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const conversationStore = useConversationStore()
const userStore = useUserStore()

const messageError = ref(false)

const conv = computed(() => {
  const param = (route.params.userId as string) || (route.params.id as string)
  if (!param) return undefined as Conversation | undefined

  const id = Number(param)
  if (!Number.isNaN(id)) {
    return conversationStore.getConversationById(id)
  }

  return conversationStore.getConversationByUser(param)
})

onMounted(() => {
  if (!userStore.isLoggedIn) {
    window.alert('请先登录后再发起私信')
    router.push('/login')
    return
  }

  const currentConv = conv.value
  if (currentConv) {
    conversationStore.clearUnread(currentConv.id)
  } else {
    messageError.value = true
  }
})

const messages = computed(() => conv.value?.messages ?? [])

const msg = ref('')

const quickReplies = ['你好', '谢谢你～', '好的没问题', '方便当面交易吗？', '还在吗？', '我在北门了']

function sendMessage() {
  if (!msg.value.trim() || !conv.value) return
  conversationStore.sendMessage(conv.value.id, msg.value.trim())
  msg.value = ''
}

function insertQuick(text: string) {
  msg.value = text
}

function showTimeDivider(index: number): boolean {
  if (index === 0) return true
  const prev = messages.value[index - 1]
  if (!prev) return true
  return messages.value[index]!.time !== prev.time
}
</script>

<template>
  <div class="chat-page">
    <template v-if="conv">
    <div class="breadcrumb">
      <RouterLink to="/" class="breadcrumb-link">首页</RouterLink>
      <span class="breadcrumb-sep">/</span>
      <RouterLink to="/message" class="breadcrumb-link">消息</RouterLink>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">聊天详情</span>
    </div>

    <div class="chat-layout">
      <div class="chat-main">
        <div class="chat-header">
          <img :src="conv.avatar" class="chat-user-avatar" alt="头像" />
          <div class="chat-user-info">
            <div class="chat-user-name">{{ conv.name }}</div>
            <div class="chat-user-meta">在线 · 外国语学院 · 大二</div>
          </div>
          <el-button type="warning" size="default">⭐ 关注TA</el-button>
        </div>

        <div class="chat-body">
          <div v-for="(m, index) in messages" :key="m.id">
            <div
              v-if="showTimeDivider(index)"
              class="msg-time"
            >{{ m.time }}</div>
            <div :class="['msg-row', m.role === 'me' ? 'me' : 'other']">
              <img
                v-if="m.role === 'other'"
                :src="conv.avatar"
                class="msg-avatar"
                alt=""
              />
              <div>
                <div class="msg-bubble">
                  {{ m.content }}
                  <RouterLink
                    v-if="m.card"
                    :to="m.card.link"
                    class="card-preview card-preview-white"
                  >
                    <div class="card-preview-title">{{ m.card.title }}</div>
                    <div class="card-preview-content">{{ m.card.content }}</div>
                  </RouterLink>
                </div>
              </div>
              <img
                v-if="m.role === 'me'"
                src="https://picsum.photos/seed/myself/100/100"
                class="msg-avatar"
                alt=""
              />
            </div>
          </div>
        </div>

        <div class="chat-input-area">
          <div class="quick-replies">
            <span
              v-for="qr in quickReplies"
              :key="qr"
              class="quick-reply-btn"
              @click="insertQuick(qr)"
            >{{ qr }}</span>
          </div>
          <div class="chat-input-row">
            <span class="icon-btn">😊</span>
            <span class="icon-btn">📎</span>
            <span class="icon-btn">📷</span>
            <el-input size="large" placeholder="输入消息..." v-model="msg" @keyup.enter="sendMessage" />
            <el-button size="large" type="primary" @click="sendMessage">发送</el-button>
          </div>
        </div>
      </div>

      <div>
        <div class="sidebar-card" style="margin-bottom: 16px;">
          <h3 class="sidebar-title">👤 联系人信息</h3>
          <div class="user-profile-card">
            <img :src="conv.avatar" class="user-profile-avatar" alt="头像" />
            <div class="user-profile-name">{{ conv.name }}</div>
            <div class="user-profile-college">外国语学院 · 大二学生</div>
            <div class="user-profile-stats">
              <div>
                <div class="user-profile-stat-num">15</div>
                <div class="user-profile-stat-label">发布</div>
              </div>
              <div>
                <div class="user-profile-stat-num">98%</div>
                <div class="user-profile-stat-label">好评</div>
              </div>
              <div>
                <div class="user-profile-stat-num">23</div>
                <div class="user-profile-stat-label">收藏</div>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-card">
          <h3 class="sidebar-title">📌 相关信息</h3>
          <RouterLink to="/group-buy/1" class="related-info-card">
            <div class="related-info-card-title">🍜 {{ conv.tag }}</div>
            <div class="related-info-card-content">4人拼车 · 人均 ¥22<br />今天下午 4 点 · 北门自取</div>
          </RouterLink>
          <RouterLink to="/" class="related-info-card" style="background: linear-gradient(135deg, #D1FAE5, #A7F3D0);">
            <div class="related-info-card-title" style="color: #064E3B;">🏃 代取快递任务</div>
            <div class="related-info-card-content" style="color: #065F46;">3 小件 · 5 元 · 南校区</div>
          </RouterLink>
        </div>
      </div>
    </div>
    </template>
    <template v-else>
      <p>会话不存在</p>
      <RouterLink to="/message">返回消息列表</RouterLink>
    </template>
  </div>
</template>

<style scoped>
.chat-page { max-width: 1100px; margin: 0 auto; }

.chat-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  height: calc(100vh - 220px);
  min-height: 600px;
}
.chat-main {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-header {
  padding: 18px 24px;
  border-bottom: 2px solid #F1F5F9;
  display: flex;
  align-items: center;
  gap: 14px;
}
.chat-user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
.chat-user-info { flex: 1; }
.chat-user-name { font-size: 16px; font-weight: 700; color: #0F172A; }
.chat-user-meta { font-size: 12px; color: #10B981; margin-top: 4px; }
.chat-user-meta::before { content: "● "; }

.chat-body {
  flex: 1;
  padding: 24px;
  background: #F8FAFC;
  overflow-y: auto;
}

.msg-row {
  display: flex;
  margin-bottom: 18px;
  align-items: flex-end;
  gap: 10px;
}
.msg-row.me { justify-content: flex-end; }

.msg-avatar {
  width: 36px; height: 36px; border-radius: 50%; object-fit: cover;
}
.msg-bubble {
  max-width: 65%;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.6;
}
.msg-row.other .msg-bubble {
  background: white;
  color: #0F172A;
  border: 1px solid #E2E8F0;
  border-top-left-radius: 4px;
}
.msg-row.me .msg-bubble {
  background: linear-gradient(135deg, #2563EB, #3B82F6);
  color: white;
  border-top-right-radius: 4px;
}
.msg-time {
  font-size: 11px;
  color: #94A3B8;
  text-align: center;
  margin: 10px 0;
}

.card-preview {
  display: block;
  margin-top: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.3);
  text-decoration: none;
  margin-bottom: 4px;
}
.card-preview-title {
  font-size: 13px;
  font-weight: 700;
  color: white;
  margin-bottom: 6px;
}
.card-preview-content {
  font-size: 12px;
  color: white;
  opacity: 0.85;
}

.card-preview-white {
  background: white;
  border: 1px solid #E2E8F0;
  color: #0F172A;
}
.card-preview-white .card-preview-title { color: #0F172A; }
.card-preview-white .card-preview-content { color: #475569; }

.chat-input-area {
  padding: 18px 22px;
  border-top: 2px solid #F1F5F9;
  background: white;
}

.quick-replies {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.quick-reply-btn {
  background: #EFF6FF;
  color: #2563EB;
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
  border: 1px solid rgba(37, 99, 235, 0.2);
}
.quick-reply-btn:hover {
  background: #2563EB;
  color: white;
}
.chat-input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}
.chat-input-row .el-input { flex: 1; }
.icon-btn {
  padding: 10px 14px;
  background: #F1F5F9;
  color: #475569;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
}

.sidebar-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}
.sidebar-title {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 14px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #F1F5F9;
}
.related-info-card {
  background: linear-gradient(135deg, #FEF3C7, #FDE68A);
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  display: block;
  text-decoration: none;
}
.related-info-card-title {
  font-size: 13px;
  font-weight: 700;
  color: #78350F;
  margin-bottom: 6px;
}
.related-info-card-content { font-size: 12px; color: #A16207; line-height: 1.6; }
.user-profile-card {
  text-align: center;
  padding: 12px;
}
.user-profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin: 0 auto 12px;
  object-fit: cover;
}
.user-profile-name { font-size: 17px; font-weight: 700; color: #0F172A; }
.user-profile-college { font-size: 12px; color: #64748B; margin-top: 4px; }
.user-profile-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid #F1F5F9;
}
.user-profile-stat-num { font-size: 17px; font-weight: 700; color: #0F172A; }
.user-profile-stat-label { font-size: 11px; color: #94A3B8; margin-top: 2px; }

@media (max-width: 1000px) {
  .chat-layout { grid-template-columns: 1fr; height: auto; }
}
</style>
