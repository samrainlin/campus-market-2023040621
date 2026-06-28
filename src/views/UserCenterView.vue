<script setup lang="ts">
import { ref } from 'vue'

const activeTab = ref<'发布' | '收藏' | '消息'>('发布')

const publishedItems = [
  { id: 1, title: '出闲置教材《软件工程导论》', category: '二手', time: '2 小时前', status: '进行中' },
  { id: 2, title: '奶茶拼单！一点点3杯起送', category: '拼单', time: '5 小时前', status: '进行中' },
  { id: 3, title: '代取快递（菜鸟驿站）', category: '跑腿', time: '昨天', status: '已完成' },
  { id: 4, title: '丢失黑色雨伞一把', category: '失物', time: '3 天前', status: '已结束' },
]

const favoriteItems = [
  { id: 1, title: '考研资料合集（数学+英语+政治）', category: '二手', price: '¥120', author: '上岸学长' },
  { id: 2, title: '食堂午餐拼单，二食堂二楼黄焖鸡', category: '拼单', price: '人均¥22', author: '干饭达人' },
  { id: 3, title: '瑞幸咖啡拼单，新街口店', category: '拼单', price: '人均¥15', author: '早八党' },
]

const messageItems = [
  { id: 1, from: '奶茶爱好者', content: '你好，我想加入拼单，还差一人对吧？', time: '10 分钟前', unread: true },
  { id: 2, from: '粗心小李', content: '一卡通找到了！太感谢了！', time: '1 小时前', unread: false },
  { id: 3, from: '系统通知', content: '您发布的「代取快递」已被接单', time: '昨天', unread: true },
  { id: 4, from: '干饭达人', content: '已发送拼单详情，请查收', time: '2 天前', unread: false },
]

const userProfile = {
  name: '张同学',
  avatar: 'https://picsum.photos/seed/userprofile/200/200',
  college: '计算机与信息学院',
  major: '软件工程',
  grade: '大三',
  studentId: '2023****291',
  creditScore: 98,
  publishedCount: 12,
  completedCount: 8,
  joinDate: '2023-09-01',
}

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
      return '#64748b'
  }
}

const statusColor = (status: string): { color: string; bg: string } => {
  if (status === '进行中') return { color: '#ffffff', bg: '#409EFF' }
  if (status === '已完成') return { color: '#ffffff', bg: '#67C23A' }
  return { color: '#ffffff', bg: '#94a3b8' }
}

const unreadCount = messageItems.filter((m) => m.unread).length
</script>

<template>
  <div class="view-page">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <router-link to="/home" class="breadcrumb-link">首页</router-link>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">个人中心</span>
    </div>

    <!-- 用户信息卡 -->
    <div class="profile-card">
      <div class="profile-left">
        <img :src="userProfile.avatar" :alt="userProfile.name" class="avatar" />
        <div class="profile-info">
          <div class="profile-name">{{ userProfile.name }}</div>
          <div class="profile-sub">{{ userProfile.college }} · {{ userProfile.major }} · {{ userProfile.grade }}</div>
          <div class="profile-id">学号：{{ userProfile.studentId }} · 加入于 {{ userProfile.joinDate }}</div>
        </div>
      </div>
      <div class="profile-right">
        <div class="stat-item">
          <div class="stat-num">{{ userProfile.publishedCount }}</div>
          <div class="stat-label">发布</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num success">{{ userProfile.completedCount }}</div>
          <div class="stat-label">完成</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-num warning">{{ userProfile.creditScore }}</div>
          <div class="stat-label">信用分</div>
        </div>
      </div>
    </div>

    <!-- Tab 切换 -->
    <div class="tab-bar">
      <button
        class="tab-btn"
        :class="{ active: activeTab === '发布' }"
        @click="activeTab = '发布'"
      >
        <span class="tab-icon">📝</span>
        <span class="tab-text">我发布的</span>
        <span class="tab-count">{{ publishedItems.length }}</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === '收藏' }"
        @click="activeTab = '收藏'"
      >
        <span class="tab-icon">⭐</span>
        <span class="tab-text">我的收藏</span>
        <span class="tab-count">{{ favoriteItems.length }}</span>
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === '消息' }"
        @click="activeTab = '消息'"
      >
        <span class="tab-icon">💬</span>
        <span class="tab-text">消息中心</span>
        <span v-if="unreadCount > 0" class="tab-badge">{{ unreadCount }}</span>
      </button>
    </div>

    <!-- 我发布的 -->
    <div v-if="activeTab === '发布'" class="list-box">
      <div v-for="item in publishedItems" :key="item.id" class="list-item">
        <span class="list-tag" :style="{ backgroundColor: categoryColor(item.category) }">
          {{ item.category }}
        </span>
        <div class="list-content">
          <div class="list-title">{{ item.title }}</div>
          <div class="list-meta">
            <span>📅 {{ item.time }}</span>
          </div>
        </div>
        <span class="status-tag" :style="{ backgroundColor: statusColor(item.status).bg, color: statusColor(item.status).color }">
          {{ item.status }}
        </span>
      </div>
    </div>

    <!-- 我的收藏 -->
    <div v-if="activeTab === '收藏'" class="list-box">
      <div v-for="item in favoriteItems" :key="item.id" class="list-item">
        <span class="list-tag" :style="{ backgroundColor: categoryColor(item.category) }">
          {{ item.category }}
        </span>
        <div class="list-content">
          <div class="list-title">{{ item.title }}</div>
          <div class="list-meta">
            <span class="price-text">{{ item.price }}</span>
            <span>👤 {{ item.author }}</span>
          </div>
        </div>
        <button class="action-btn">查看</button>
      </div>
    </div>

    <!-- 消息中心 -->
    <div v-if="activeTab === '消息'" class="list-box">
      <div v-for="item in messageItems" :key="item.id" class="message-item">
        <div class="message-header">
          <span class="message-from">{{ item.from }}</span>
          <span class="message-time">{{ item.time }}</span>
          <span v-if="item.unread" class="unread-dot">●</span>
        </div>
        <div class="message-content">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  color: #409EFF;
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #2B6CB0;
}

.breadcrumb-sep {
  color: #cbd5e1;
}

.breadcrumb-current {
  color: #1e293b;
  font-weight: 500;
}

/* 用户信息卡 */
.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%);
  padding: 28px 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.profile-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.profile-name {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
}

.profile-sub {
  font-size: 14px;
  color: #475569;
}

.profile-id {
  font-size: 12px;
  color: #94a3b8;
}

.profile-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 60px;
}

.stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #409EFF;
}

.stat-num.success {
  color: #67C23A;
}

.stat-num.warning {
  color: #E6A23C;
}

.stat-label {
  font-size: 12px;
  color: #64748b;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e2e8f0;
}

/* Tab 切换 */
.tab-bar {
  display: flex;
  gap: 12px;
  background: #ffffff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f8fafc;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.tab-btn.active {
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.tab-icon {
  font-size: 16px;
}

.tab-text {
  font-weight: 600;
}

.tab-count {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  font-size: 12px;
}

.tab-btn:not(.active) .tab-count {
  background: #e2e8f0;
  color: #475569;
}

.tab-badge {
  padding: 2px 8px;
  background: #F56C6C;
  color: #ffffff;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.tab-btn:not(.active) .tab-badge {
  background: #F56C6C;
  color: #ffffff;
}

/* 列表框 */
.list-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.list-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 10px;
  transition: background 0.2s ease;
}

.list-item:hover {
  background: #f1f5f9;
}

.list-tag {
  padding: 4px 10px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  flex-shrink: 0;
}

.list-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.list-meta {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 12px;
}

.price-text {
  color: #2B6CB0;
  font-weight: 700;
}

.status-tag {
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  flex-shrink: 0;
}

.action-btn {
  padding: 6px 16px;
  background: #e0f2fe;
  color: #409EFF;
  font-size: 12px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #409EFF;
  color: #ffffff;
}

/* 消息项 */
.message-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
}

.message-item:first-child {
  border-left-color: #409EFF;
  background: #f0f9ff;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.message-from {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.message-time {
  font-size: 12px;
  color: #94a3b8;
}

.unread-dot {
  font-size: 10px;
  color: #F56C6C;
  margin-left: auto;
}

.message-content {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

@media (max-width: 700px) {
  .profile-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px;
  }

  .profile-right {
    width: 100%;
    justify-content: space-around;
    padding-top: 20px;
    border-top: 1px solid #e2e8f0;
  }

  .tab-bar {
    overflow-x: auto;
  }

  .tab-btn {
    white-space: nowrap;
  }
}
</style>
