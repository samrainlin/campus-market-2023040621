<script setup lang="ts">
import { ref, computed } from 'vue'

interface ChatMessage {
  id: number
  senderId: number
  content: string
  time: string
  type?: 'text' | 'system'
}

interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
  online: boolean
  relatedInfo?: {
    type: string
    title: string
    price?: string
    image: string
  }
}

// 当前用户 ID
const currentUserId = 1

// 会话列表
const conversations = ref<Conversation[]>([
  {
    id: 2,
    name: '小明同学',
    avatar: 'https://picsum.photos/seed/user1/200/200',
    lastMessage: '你好，《软件工程导论》还在吗？',
    lastTime: '10:32',
    unread: 2,
    online: true,
    relatedInfo: {
      type: '二手商品',
      title: '出闲置教材《软件工程导论》，九成新',
      price: '¥25',
      image: 'https://picsum.photos/seed/book1/200/200',
    },
  },
  {
    id: 3,
    name: '粗心小李',
    avatar: 'https://picsum.photos/seed/user2/200/200',
    lastMessage: '一卡通找到了！太感谢了！',
    lastTime: '09:15',
    unread: 0,
    online: true,
    relatedInfo: {
      type: '失物招领',
      title: '丢失校园一卡通，卡号尾号 3829',
      image: 'https://picsum.photos/seed/lost1/200/200',
    },
  },
  {
    id: 4,
    name: '奶茶爱好者',
    avatar: 'https://picsum.photos/seed/user3/200/200',
    lastMessage: '我在东食堂门口，快来集合！',
    lastTime: '昨天',
    unread: 1,
    online: false,
    relatedInfo: {
      type: '拼单搭子',
      title: '奶茶拼单！一点点3杯起送，差1人',
      price: '人均¥18',
      image: 'https://picsum.photos/seed/tea1/200/200',
    },
  },
  {
    id: 5,
    name: '跑腿小王',
    avatar: 'https://picsum.photos/seed/user4/200/200',
    lastMessage: '快递已送到宿舍楼下，请下来取',
    lastTime: '昨天',
    unread: 0,
    online: false,
    relatedInfo: {
      type: '跑腿委托',
      title: '代取快递，菜鸟驿站顺丰均可',
      price: '¥3/件',
      image: 'https://picsum.photos/seed/err1/200/200',
    },
  },
  {
    id: 6,
    name: '系统通知',
    avatar: 'https://picsum.photos/seed/system/200/200',
    lastMessage: '您发布的「代取快递」已被接单',
    lastTime: '2 天前',
    unread: 3,
    online: false,
  },
  {
    id: 7,
    name: '干饭达人',
    avatar: 'https://picsum.photos/seed/user5/200/200',
    lastMessage: '已发送拼单详情，请查收',
    lastTime: '3 天前',
    unread: 0,
    online: false,
  },
])

// 当前选中的会话
const activeConversationId = ref<number | null>(2)

// 各会话的聊天记录
const chatHistory: Record<number, ChatMessage[]> = {
  2: [
    { id: 1, senderId: 2, content: '同学你好！看到你在出《软件工程导论》', time: '10:20', type: 'text' },
    { id: 2, senderId: 2, content: '请问书还在吗？', time: '10:20', type: 'text' },
    { id: 3, senderId: currentUserId, content: '在的！九成新，几乎没有笔记', time: '10:25', type: 'text' },
    { id: 4, senderId: currentUserId, content: '你是计算机学院的同学吗？', time: '10:25', type: 'text' },
    { id: 5, senderId: 2, content: '对的，大三刚学完这门课', time: '10:30', type: 'text' },
    { id: 6, senderId: 2, content: '你好，《软件工程导论》还在吗？', time: '10:32', type: 'text' },
  ],
  3: [
    { id: 1, senderId: 3, content: '同学！我的一卡通找到了！', time: '昨天 16:20', type: 'text' },
    { id: 2, senderId: currentUserId, content: '真的吗！太好啦！🎉', time: '昨天 16:25', type: 'text' },
    { id: 3, senderId: 3, content: '一卡通找到了！太感谢了！', time: '昨天 16:30', type: 'text' },
    { id: 4, senderId: currentUserId, content: '不客气，祝你期末顺利！', time: '昨天 16:32', type: 'text' },
  ],
  4: [
    { id: 1, senderId: 4, content: '嗨，我想加入奶茶拼单', time: '昨天 13:00', type: 'text' },
    { id: 2, senderId: currentUserId, content: '欢迎！我们还差1人就可以起送了', time: '昨天 13:05', type: 'text' },
    { id: 3, senderId: 4, content: '好的，我要一杯波霸奶茶 三分糖', time: '昨天 13:08', type: 'text' },
    { id: 4, senderId: 4, content: '我在东食堂门口，快来集合！', time: '昨天 14:30', type: 'text' },
  ],
  5: [
    { id: 1, senderId: currentUserId, content: '你好，请问可以帮我取个快递吗？', time: '昨天 15:00', type: 'text' },
    { id: 2, senderId: 5, content: '可以的，在哪里？', time: '昨天 15:05', type: 'text' },
    { id: 3, senderId: currentUserId, content: '菜鸟驿站 3 号柜，取件码 8-2-1034', time: '昨天 15:08', type: 'text' },
    { id: 4, senderId: 5, content: '快递已送到宿舍楼下，请下来取', time: '昨天 15:30', type: 'text' },
  ],
  6: [
    { id: 1, senderId: 6, content: '欢迎使用校园轻集市！', time: '3 天前', type: 'system' },
    { id: 2, senderId: 6, content: '您发布的「代取快递」已通过审核', time: '2 天前', type: 'system' },
    { id: 3, senderId: 6, content: '您发布的「代取快递」已被接单', time: '2 天前', type: 'system' },
  ],
  7: [
    { id: 1, senderId: 7, content: '你好，食堂拼单还收人吗？', time: '3 天前', type: 'text' },
    { id: 2, senderId: currentUserId, content: '已经成团啦，下次一起吧！', time: '3 天前', type: 'text' },
    { id: 3, senderId: 7, content: '已发送拼单详情，请查收', time: '3 天前', type: 'text' },
  ],
}

// 搜索关键词
const searchKeyword = ref('')

// 输入框内容
const inputMessage = ref('')

// 过滤后的会话列表
const filteredConversations = computed(() => {
  if (!searchKeyword.value.trim()) return conversations.value
  const kw = searchKeyword.value.trim().toLowerCase()
  return conversations.value.filter(
    (c) => c.name.toLowerCase().includes(kw) || c.lastMessage.toLowerCase().includes(kw),
  )
})

// 当前会话
const activeConversation = computed(() => {
  if (!activeConversationId.value) return null
  return conversations.value.find((c) => c.id === activeConversationId.value) || null
})

// 当前聊天记录
const currentChatMessages = computed(() => {
  if (!activeConversationId.value) return []
  return chatHistory[activeConversationId.value] || []
})

// 总未读数
const totalUnread = computed(() => conversations.value.reduce((sum, c) => sum + c.unread, 0))

// 快捷回复
const quickReplies = ['还在的！', '可以的', '好的，谢谢！', '约个时间吧', '已联系']

// 选择会话
const selectConversation = (id: number) => {
  activeConversationId.value = id
  const conv = conversations.value.find((c) => c.id === id)
  if (conv) conv.unread = 0
}

// 发送消息
const sendMessage = () => {
  if (!inputMessage.value.trim() || !activeConversationId.value) return

  const newMsg: ChatMessage = {
    id: Date.now(),
    senderId: currentUserId,
    content: inputMessage.value.trim(),
    time: '刚刚',
    type: 'text',
  }

  if (!chatHistory[activeConversationId.value]) {
    chatHistory[activeConversationId.value] = []
  }
  const history = chatHistory[activeConversationId.value]
  if (history) {
    history.push(newMsg)
  }

  // 更新会话最后消息
  const conv = conversations.value.find((c) => c.id === activeConversationId.value)
  if (conv) {
    conv.lastMessage = newMsg.content
    conv.lastTime = '刚刚'
  }

  inputMessage.value = ''
}

const handleQuickReply = (text: string) => {
  inputMessage.value = text
  sendMessage()
}
</script>

<template>
  <div class="view-page">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">首页</router-link>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">消息中心</span>
      <span v-if="totalUnread > 0" class="unread-badge">{{ totalUnread }} 条未读</span>
    </div>

    <!-- 消息主体 -->
    <div class="chat-container">
      <!-- 左侧会话列表 -->
      <div class="sidebar-left">
        <!-- 搜索框 -->
        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchKeyword"
            type="text"
            class="search-input"
            placeholder="搜索联系人、消息"
          />
        </div>

        <!-- 会话列表 -->
        <div class="conversation-list">
          <div
            v-for="conv in filteredConversations"
            :key="conv.id"
            class="conversation-item"
            :class="{ active: activeConversationId === conv.id }"
            @click="selectConversation(conv.id)"
          >
            <div class="avatar-wrap">
              <img :src="conv.avatar" :alt="conv.name" class="avatar" />
              <span v-if="conv.online" class="online-dot"></span>
            </div>
            <div class="conv-content">
              <div class="conv-header">
                <span class="conv-name">{{ conv.name }}</span>
                <span class="conv-time">{{ conv.lastTime }}</span>
              </div>
              <div class="conv-preview">
                <span class="preview-text">{{ conv.lastMessage }}</span>
                <span v-if="conv.unread > 0" class="conv-unread">{{ conv.unread }}</span>
              </div>
            </div>
          </div>

          <div v-if="filteredConversations.length === 0" class="empty-conv">
            <span class="empty-icon">📭</span>
            <span class="empty-text">暂无相关会话</span>
          </div>
        </div>
      </div>

      <!-- 右侧聊天区域 -->
      <div v-if="activeConversation" class="chat-area">
        <!-- 聊天头部 -->
        <div class="chat-header">
          <div class="chat-user">
            <img :src="activeConversation.avatar" :alt="activeConversation.name" class="user-avatar" />
            <div class="user-info">
              <div class="user-name">{{ activeConversation.name }}</div>
              <div class="user-status">
                <span
                  class="status-dot"
                  :style="{ background: activeConversation.online ? '#10b981' : '#94a3b8' }"
                ></span>
                {{ activeConversation.online ? '在线' : '离线' }}
              </div>
            </div>
          </div>
          <div class="chat-actions">
            <button class="action-btn" title="置顶">📌</button>
            <button class="action-btn" title="更多">⋯</button>
          </div>
        </div>

        <!-- 关联信息卡片 -->
        <div v-if="activeConversation.relatedInfo" class="related-card">
          <div class="related-tag">{{ activeConversation.relatedInfo.type }}</div>
          <div class="related-body">
            <img
              :src="activeConversation.relatedInfo.image"
              :alt="activeConversation.relatedInfo.title"
              class="related-img"
            />
            <div class="related-info">
              <div class="related-title">{{ activeConversation.relatedInfo.title }}</div>
              <div v-if="activeConversation.relatedInfo.price" class="related-price">
                {{ activeConversation.relatedInfo.price }}
              </div>
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="messages-scroll">
          <div
            v-for="msg in currentChatMessages"
            :key="msg.id"
            class="message-row"
            :class="{
              'is-mine': msg.senderId === currentUserId,
              'is-system': msg.type === 'system',
            }"
          >
            <template v-if="msg.type === 'system'">
              <div class="system-msg">
                <span class="system-icon">🔔</span>
                <span class="system-content">{{ msg.content }}</span>
                <span class="system-time">{{ msg.time }}</span>
              </div>
            </template>

            <template v-else>
              <template v-if="msg.senderId !== currentUserId">
                <img
                  :src="activeConversation.avatar"
                  :alt="activeConversation.name"
                  class="msg-avatar"
                />
              </template>
              <div class="msg-bubble-wrap">
                <div class="msg-bubble">{{ msg.content }}</div>
                <span class="msg-time">{{ msg.time }}</span>
              </div>
              <template v-if="msg.senderId === currentUserId">
                <img src="https://picsum.photos/seed/me/200/200" alt="我" class="msg-avatar" />
              </template>
            </template>
          </div>
        </div>

        <!-- 快捷回复 -->
        <div class="quick-reply">
          <button
            v-for="reply in quickReplies"
            :key="reply"
            class="quick-btn"
            @click="handleQuickReply(reply)"
          >
            {{ reply }}
          </button>
        </div>

        <!-- 输入区域 -->
        <div class="input-area">
          <div class="input-toolbar">
            <button class="tool-btn" title="表情">😊</button>
            <button class="tool-btn" title="图片">🖼️</button>
            <button class="tool-btn" title="文件">📎</button>
          </div>
          <div class="input-row">
            <input
              v-model="inputMessage"
              type="text"
              class="msg-input"
              placeholder="输入消息..."
              @keyup.enter="sendMessage"
            />
            <button class="send-btn" :disabled="!inputMessage.trim()" @click="sendMessage">
              发送
            </button>
          </div>
        </div>
      </div>

      <!-- 未选中会话时的占位 -->
      <div v-else class="chat-placeholder">
        <div class="placeholder-icon">💬</div>
        <h2 class="placeholder-title">选择一个会话开始聊天</h2>
        <p class="placeholder-text">从左侧列表中选择一个联系人，查看消息记录并继续沟通</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 面包屑 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.breadcrumb-link {
  color: #409eff;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #2b6cb0;
}

.breadcrumb-sep {
  color: #cbd5e1;
}

.breadcrumb-current {
  color: #1e293b;
  font-weight: 500;
}

.unread-badge {
  margin-left: 8px;
  padding: 3px 10px;
  background: #fef2f2;
  color: #ef4444;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

/* 聊天容器 */
.chat-container {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 0;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-height: 600px;
}

/* 左侧 */
.sidebar-left {
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

/* 搜索 */
.search-bar {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 32px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: #ffffff;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.search-input::placeholder {
  color: #94a3b8;
}

/* 会话列表 */
.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 4px;
}

.conversation-item:hover {
  background: #ffffff;
}

.conversation-item.active {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  background: #e2e8f0;
}

.online-dot {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10b981;
  border: 2px solid #f8fafc;
  border-radius: 50%;
}

.conv-content {
  flex: 1;
  min-width: 0;
}

.conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.conv-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conv-time {
  font-size: 11px;
  color: #94a3b8;
  flex-shrink: 0;
  margin-left: 8px;
}

.conv-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-text {
  font-size: 12px;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.conv-unread {
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  background: #ef4444;
  color: #ffffff;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-left: 8px;
}

.empty-conv {
  padding: 40px 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-icon {
  font-size: 36px;
}

.empty-text {
  font-size: 13px;
  color: #94a3b8;
}

/* 右侧聊天区 */
.chat-area {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  min-height: 600px;
}

/* 聊天头部 */
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.chat-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.user-status {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.chat-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: #f1f5f9;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e2e8f0;
}

/* 关联信息卡片 */
.related-card {
  margin: 12px 20px;
  padding: 12px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  position: relative;
}

.related-tag {
  position: absolute;
  top: -8px;
  left: 12px;
  padding: 3px 10px;
  background: #409eff;
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
}

.related-body {
  display: flex;
  align-items: center;
  gap: 12px;
}

.related-img {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  object-fit: cover;
  background: #e2e8f0;
}

.related-info {
  flex: 1;
  min-width: 0;
}

.related-title {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.related-price {
  font-size: 14px;
  font-weight: 700;
  color: #409eff;
}

/* 消息滚动区 */
.messages-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fafbfc;
}

.message-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 70%;
}

.message-row.is-mine {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-row.is-system {
  align-self: center;
  max-width: 90%;
}

.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: #e2e8f0;
}

.msg-bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 100%;
}

.message-row.is-mine .msg-bubble-wrap {
  align-items: flex-end;
}

.msg-bubble {
  padding: 10px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  word-break: break-word;
}

.message-row.is-mine .msg-bubble {
  background: linear-gradient(135deg, #409eff 0%, #2b6cb0 100%);
  color: #ffffff;
  border-color: transparent;
}

.msg-time {
  font-size: 11px;
  color: #94a3b8;
  padding: 0 4px;
}

/* 系统消息 */
.system-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f1f5f9;
  border-radius: 10px;
  font-size: 12px;
  color: #64748b;
}

.system-icon {
  font-size: 14px;
}

.system-content {
  flex: 1;
}

.system-time {
  color: #94a3b8;
}

/* 快捷回复 */
.quick-reply {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

.quick-btn {
  padding: 6px 14px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-btn:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
  color: #0369a1;
}

/* 输入区 */
.input-area {
  border-top: 1px solid #e2e8f0;
  padding: 12px 20px 16px;
  background: #ffffff;
}

.input-toolbar {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.2s ease;
}

.tool-btn:hover {
  background: #f1f5f9;
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.msg-input {
  flex: 1;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.msg-input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.msg-input::placeholder {
  color: #94a3b8;
}

.send-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #409eff 0%, #2b6cb0 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
}

.send-btn:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  box-shadow: none;
}

/* 聊天占位 */
.chat-placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  background: #fafbfc;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.placeholder-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}

.placeholder-text {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

@media (max-width: 900px) {
  .chat-container {
    grid-template-columns: 1fr;
  }

  .sidebar-left {
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
    max-height: 300px;
  }

  .message-row {
    max-width: 85%;
  }
}
</style>
