<script setup lang="ts">
import { ref } from 'vue'

interface ReviewRecord {
  id: string
  title: string
  type: string
  user: string
  time: string
  status: string
}

const reviewList = ref<ReviewRecord[]>([
  { id: 'INFO-001', title: '出闲置教材《软件工程导论》九成新', type: '二手', user: '小明同学', time: '10分钟前', status: '待审核' },
  { id: 'INFO-002', title: '喜茶拼单，差2人，今晚8点', type: '拼单', user: '奶茶爱好者', time: '25分钟前', status: '待审核' },
  { id: 'INFO-003', title: '菜鸟驿站代取快递，大小件均可', type: '跑腿', user: '跑腿小王', time: '1小时前', status: '已通过' },
  { id: 'INFO-004', title: '图书馆一楼捡到黑色长柄雨伞', type: '失物', user: '热心读者', time: '1小时前', status: '待审核' },
  { id: 'INFO-005', title: '考研资料合集（已上岸学长出）', type: '二手', user: '上岸学长', time: '2小时前', status: '已通过' },
  { id: 'INFO-006', title: '周五晚拼车去高铁站，还差2人', type: '拼单', user: '回家同学', time: '3小时前', status: '已通过' },
  { id: 'INFO-007', title: '求购二手显示器，预算300元以内', type: '二手', user: '预算党', time: '4小时前', status: '已驳回' },
])
</script>

<template>
  <div class="admin-page">
    <div class="admin-layout">
      <div class="admin-sidebar">
        <div class="admin-sidebar-head">🛠 管理菜单</div>
        <RouterLink to="/admin" class="active">📊 数据总览</RouterLink>
        <RouterLink to="/admin/review">📝 信息审核 (12)</RouterLink>
        <a href="#">👥 用户管理</a>
        <a href="#">📬 举报处理 (3)</a>
        <a href="#">🏷 分类管理</a>
        <a href="#">📢 公告发布</a>
        <a href="#">⚙️ 系统设置</a>
        <a href="#" style="color: #EF4444;">🚪 退出登录</a>
      </div>

      <div>
        <div class="admin-main" style="margin-bottom: 16px; background: transparent; box-shadow: none; padding: 0;">
          <h2 class="admin-title">👋 早上好，管理员</h2>
          <div class="admin-subtitle">欢迎回来，以下是校园轻集市今日的运行概况</div>

          <div class="stat-grid">
            <div class="stat-card blue">
              <div class="stat-num">156</div>
              <div class="stat-label">今日新增信息</div>
              <div class="stat-trend">↑ 较昨日 +12%</div>
            </div>
            <div class="stat-card orange">
              <div class="stat-num">12</div>
              <div class="stat-label">待审核信息</div>
              <div class="stat-trend">⚠ 需要处理</div>
            </div>
            <div class="stat-card green">
              <div class="stat-num">3,856</div>
              <div class="stat-label">活跃用户数</div>
              <div class="stat-trend">↑ 较上周 +8%</div>
            </div>
            <div class="stat-card red">
              <div class="stat-num">3</div>
              <div class="stat-label">待处理举报</div>
              <div class="stat-trend">⚠ 请尽快处理</div>
            </div>
          </div>
        </div>

        <div class="admin-main">
          <div class="section-title">
            <span>📝 最新审核记录</span>
            <RouterLink to="/admin/review"><el-button size="default">查看全部</el-button></RouterLink>
          </div>

          <el-table :data="reviewList" style="width: 100%; margin-top: 10px;">
            <el-table-column prop="id" label="编号" width="80" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="type" label="分类" width="100" />
            <el-table-column prop="user" label="发布者" width="120" />
            <el-table-column prop="time" label="提交时间" width="160" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag v-if="scope.row.status === '待审核'" type="warning">待审核</el-tag>
                <el-tag v-else-if="scope.row.status === '已通过'" type="success">已通过</el-tag>
                <el-tag v-else type="danger">已驳回</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="admin-main" style="margin-top: 16px;">
          <div class="section-title"><span>🚀 快捷入口</span></div>
          <div class="quick-grid">
            <RouterLink to="/admin/review" class="quick-btn">
              <div class="quick-icon">✅</div>
              <div class="quick-text">信息审核</div>
            </RouterLink>
            <a href="#" class="quick-btn">
              <div class="quick-icon">⚠️</div>
              <div class="quick-text">举报处理</div>
            </a>
            <a href="#" class="quick-btn">
              <div class="quick-icon">👤</div>
              <div class="quick-text">用户管理</div>
            </a>
            <a href="#" class="quick-btn">
              <div class="quick-icon">📢</div>
              <div class="quick-text">发布公告</div>
            </a>
            <RouterLink to="/" class="quick-btn">
              <div class="quick-icon">🏠</div>
              <div class="quick-text">前台首页</div>
            </RouterLink>
            <a href="#" class="quick-btn">
              <div class="quick-icon">📊</div>
              <div class="quick-text">数据分析</div>
            </a>
            <a href="#" class="quick-btn">
              <div class="quick-icon">⚙️</div>
              <div class="quick-text">系统设置</div>
            </a>
            <a href="#" class="quick-btn">
              <div class="quick-icon">📚</div>
              <div class="quick-text">帮助中心</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page { width: 100%; }
.admin-layout { display: grid; grid-template-columns: 240px 1fr; gap: 20px; }
.admin-sidebar {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(15,23,42,0.05);
  height: fit-content;
  position: sticky; top: 20px;
}
.admin-sidebar-head {
  padding: 10px 12px 20px 12px;
  border-bottom: 2px solid #F1F5F9;
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
}
.admin-sidebar a, .admin-sidebar .RouterLink {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  color: #475569;
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 4px;
}
.admin-sidebar a:hover, .admin-sidebar .RouterLink:hover { background: #F8FAFC; color: #2563EB; }
.admin-sidebar a.active, .admin-sidebar .RouterLink.active { background: #2563EB; color: white; font-weight: 600; }

.admin-main {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(15,23,42,0.05);
  min-height: 500px;
}
.admin-title { font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 4px 0; }
.admin-subtitle { font-size: 13px; color: #64748B; margin-bottom: 28px; }

.stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
.stat-card {
  padding: 24px;
  border-radius: 14px;
  color: white;
  position: relative;
  overflow: hidden;
}
.stat-card.blue { background: linear-gradient(135deg, #2563EB, #3B82F6); }
.stat-card.green { background: linear-gradient(135deg, #10B981, #34D399); }
.stat-card.orange { background: linear-gradient(135deg, #F59E0B, #FBBF24); }
.stat-card.red { background: linear-gradient(135deg, #EF4444, #F87171); }
.stat-card::before {
  content: "";
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 120px;
  height: 120px;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
}
.stat-num { font-size: 30px; font-weight: 800; position: relative; z-index: 1; }
.stat-label { font-size: 13px; opacity: 0.95; margin-top: 6px; position: relative; z-index: 1; }
.stat-trend { font-size: 11px; margin-top: 8px; position: relative; z-index: 1; opacity: 0.9; }

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 18px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.quick-btn {
  padding: 20px 12px;
  border-radius: 12px;
  background: #F8FAFC;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  color: #0F172A;
  display: block;
  transition: all 0.3s;
}
.quick-btn:hover { background: #2563EB; color: white; transform: translateY(-3px); }
.quick-icon { font-size: 28px; }
.quick-text { font-size: 13px; font-weight: 600; margin-top: 8px; }

@media (max-width: 1000px) {
  .admin-layout { grid-template-columns: 1fr; }
  .admin-sidebar { position: static; display: flex; flex-wrap: wrap; gap: 8px; }
  .admin-sidebar-head { display: none; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .quick-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
