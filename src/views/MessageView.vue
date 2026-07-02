<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useConversationStore } from '../stores/conversation'

const keyword = ref('')

const conversationStore = useConversationStore()

const totalUnread = computed(() => conversationStore.totalUnread)

const filteredConversations = computed(() => {
  if (!keyword.value.trim()) return conversationStore.conversations
  const kw = keyword.value.trim().toLowerCase()
  return conversationStore.conversations.filter((c) => c.name.includes(kw) || c.preview.includes(kw))
})
</script>

<template>
  <section class="page">
    <div class="messages-container">
      <div class="messages-header">
        <div>
          <h2>💬 消息中心</h2>
          <div class="messages-header-sub">来自同学的咨询、拼单确认、任务反馈 · 共 {{ totalUnread }} 条未读</div>
        </div>
        <div class="search-input-wrap">
          <span class="search-icon">🔍</span>
          <input v-model="keyword" type="text" placeholder="搜索联系人" />
        </div>
      </div>

      <div class="msg-list">
        <RouterLink
          v-for="conv in filteredConversations"
          :key="conv.id"
          :to="`/message/${conv.id}`"
          class="msg-item"
          @click="conversationStore.clearUnread(conv.id)"
        >
          <img :src="conv.avatar" class="msg-avatar" alt="头像" />
          <div class="msg-content">
            <div class="msg-top">
              <span class="msg-name">{{ conv.name }}</span>
              <span class="msg-time">{{ conv.time }}</span>
            </div>
            <div class="msg-bottom">
              <span class="msg-preview">{{ conv.preview }}</span>
              <span v-if="conv.unread > 0" class="msg-badge">{{ conv.unread }}</span>
            </div>
            <div class="msg-meta">
              <span class="msg-tag" :style="{ backgroundColor: conv.tagBg, color: conv.tagColor }">{{ conv.tag }}</span>
            </div>
          </div>
        </RouterLink>

        <div v-if="filteredConversations.length === 0" class="empty-state">
          暂无相关消息
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.messages-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.messages-header {
  padding: 24px 28px;
  border-bottom: 2px solid #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.messages-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.messages-header-sub {
  font-size: 13px;
  color: #64748B;
  margin-top: 6px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border: 1.5px solid #E2E8F0;
  border-radius: 10px;
  transition: border-color 0.2s;
  width: 260px;
}

.search-input-wrap:focus-within {
  border-color: #2563EB;
}

.search-icon {
  font-size: 14px;
  color: #94A3B8;
}

.search-input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
  font-family: inherit;
}

.search-input-wrap input::placeholder {
  color: #94A3B8;
}

.msg-list {
  padding: 8px;
}

.msg-item {
  padding: 18px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: background 0.2s;
  text-decoration: none;
  color: inherit;
}

.msg-item:hover {
  background: #F8FAFC;
}

.msg-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: #F1F5F9;
}

.msg-content {
  flex: 1;
  min-width: 0;
}

.msg-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.msg-name {
  font-size: 15px;
  font-weight: 700;
  color: #0F172A;
}

.msg-time {
  font-size: 12px;
  color: #94A3B8;
  flex-shrink: 0;
}

.msg-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.msg-preview {
  font-size: 13px;
  color: #64748B;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.msg-badge {
  background: #EF4444;
  color: white;
  font-size: 11px;
  font-weight: 700;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 7px;
  flex-shrink: 0;
}

.msg-meta {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 4px;
}

.msg-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #EFF6FF;
  color: #2563EB;
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: #94A3B8;
  font-size: 14px;
}

@media (max-width: 800px) {
  .msg-item {
    padding: 14px;
  }

  .msg-avatar {
    width: 44px;
    height: 44px;
  }

  .search-input-wrap {
    width: 180px;
  }
}
</style>
