<script setup lang="ts">
import { ref } from 'vue'

interface MessageItem {
  id: number
  title: string
  content: string
  time: string
  type: '系统通知' | '收藏提醒' | '互动消息'
}

const messages = ref<MessageItem[]>([
  {
    id: 1,
    title: '欢迎使用校园轻集市',
    content: '你可以在这里发布二手商品、失物招领、拼单搭子和跑腿委托，让校园生活更便捷。',
    time: '刚刚',
    type: '系统通知',
  },
  {
    id: 2,
    title: '功能提示',
    content: '收藏的信息可以在个人中心中查看。',
    time: '1 分钟前',
    type: '收藏提醒',
  },
  {
    id: 3,
    title: '发布成功',
    content: '您的发布信息已成功提交，可以在个人中心查看。',
    time: '10 分钟前',
    type: '系统通知',
  },
  {
    id: 4,
    title: '新的拼单邀请',
    content: '室友发起了一个新的奶茶拼单，3人即可成团，快来加入吧！',
    time: '1 小时前',
    type: '互动消息',
  },
])

function getTypeColor(type: MessageItem['type']): string {
  switch (type) {
    case '系统通知':
      return '#3b82f6'
    case '收藏提醒':
      return '#10b981'
    case '互动消息':
      return '#f59e0b'
    default:
      return '#6b7280'
  }
}
</script>

<template>
  <section class="page">
    <div class="page-header">
      <h1>消息中心</h1>
      <p>查看系统通知、收藏提醒和互动消息，共 {{ messages.length }} 条。</p>
    </div>

    <div class="message-list">
      <article v-for="item in messages" :key="item.id" class="message-card">
        <div class="message-header">
          <span class="message-type" :style="{ backgroundColor: getTypeColor(item.type) }">
            {{ item.type }}
          </span>
          <span class="message-time">{{ item.time }}</span>
        </div>
        <h3 class="message-title">{{ item.title }}</h3>
        <p class="message-content">{{ item.content }}</p>
      </article>
    </div>

    <p class="hint">
      提示：本模块为 Day5 基础状态，后续可根据需要接入真实消息数据。
    </p>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  padding: 24px;
  border-radius: 16px;
  background: #fff;
}

.page-header h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #1f2937;
}

.page-header p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.message-list {
  display: grid;
  gap: 12px;
}

.message-card {
  padding: 20px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid #e5e7eb;
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.message-type {
  padding: 4px 12px;
  border-radius: 999px;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
}

.message-time {
  color: #9ca3af;
  font-size: 12px;
}

.message-title {
  margin: 0 0 8px;
  font-size: 16px;
  color: #1f2937;
}

.message-content {
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
}

.hint {
  margin: 0;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 8px;
  color: #9ca3af;
  font-size: 13px;
  line-height: 1.6;
}
</style>
