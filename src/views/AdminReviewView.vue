<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface ReviewItem {
  id: string
  title: string
  type: string
  user: string
  time: string
  status: string
}

const keyword = ref('')
const filterType = ref('')
const filterStatus = ref('待审核')

const reviewList = ref<ReviewItem[]>([
  { id: 'INFO-001', title: '出闲置教材《软件工程导论》九成新，可小刀', type: '二手', user: '小明同学', time: '2025-07-01 10:20', status: '待审核' },
  { id: 'INFO-002', title: '喜茶拼单，差2人，北门自取，人均¥22', type: '拼单', user: '奶茶爱好者', time: '2025-07-01 10:15', status: '待审核' },
  { id: 'INFO-003', title: '图书馆一楼捡到黑色长柄雨伞，失主联系', type: '失物', user: '热心读者', time: '2025-07-01 09:50', status: '待审核' },
  { id: 'INFO-004', title: '菜鸟驿站代取快递，大小件均可，3元/件', type: '跑腿', user: '跑腿小王', time: '2025-07-01 09:20', status: '待审核' },
  { id: 'INFO-005', title: '周五晚拼车去高铁站，还差2人，AA制', type: '拼单', user: '回家同学', time: '2025-07-01 09:05', status: '待审核' },
  { id: 'INFO-006', title: '求购二手显示器，预算300元以内', type: '二手', user: '预算党', time: '2025-06-30 18:30', status: '待审核' },
  { id: 'INFO-007', title: '九成新蓝色代步自行车，毕业出', type: '二手', user: '毕业学长', time: '2025-06-30 16:00', status: '待审核' },
  { id: 'INFO-008', title: '寻物：在西门打印店附近丢失黑色耳机盒', type: '失物', user: '丢耳机的人', time: '2025-06-30 15:20', status: '待审核' },
  { id: 'INFO-009', title: '考研资料合集（已上岸学长出）', type: '二手', user: '上岸学长', time: '2025-06-30 14:00', status: '已通过' },
  { id: 'INFO-010', title: '暑期求租校内房源，月租1500以内', type: '二手', user: '租房党', time: '2025-06-30 12:00', status: '已驳回' },
])

function handleApprove() {
  ElMessage.success('已通过审核')
}

function handleReject() {
  ElMessage.success('已驳回，已通知发布者')
}
</script>

<template>
  <div class="admin-page">
    <div class="admin-layout">
      <div class="admin-sidebar">
        <div class="admin-sidebar-head">🛠 管理菜单</div>
        <RouterLink to="/admin">📊 数据总览</RouterLink>
        <RouterLink to="/admin/review" class="active">📝 信息审核 (12)</RouterLink>
        <a href="#">👥 用户管理</a>
        <a href="#">📬 举报处理 (3)</a>
        <a href="#">🏷 分类管理</a>
        <a href="#">📢 公告发布</a>
        <a href="#">⚙️ 系统设置</a>
        <a href="#" style="color: #EF4444;">🚪 退出登录</a>
      </div>

      <div class="admin-main">
        <h2 class="admin-title">📝 信息审核</h2>
        <div class="admin-subtitle">对用户发布的信息进行审核，确保内容符合校园社区规范</div>

        <div class="filter-bar">
          <span style="font-size: 13px; color: #475569; font-weight: 600;">分类：</span>
          <el-select v-model="filterType" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="二手" value="二手" />
            <el-option label="拼单" value="拼单" />
            <el-option label="跑腿" value="跑腿" />
            <el-option label="失物" value="失物" />
          </el-select>

          <span style="font-size: 13px; color: #475569; font-weight: 600; margin-left: 10px;">状态：</span>
          <el-select v-model="filterStatus" placeholder="全部">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="待审核" />
            <el-option label="已通过" value="已通过" />
            <el-option label="已驳回" value="已驳回" />
          </el-select>

          <el-input v-model="keyword" placeholder="搜索标题 / 发布者" style="width: 220px; margin-left: 10px;" />

          <el-button type="primary" size="default">🔍 搜索</el-button>
        </div>

        <el-table :data="reviewList" style="width: 100%;" border stripe>
          <el-table-column prop="id" label="编号" width="100" />
          <el-table-column prop="title" label="信息标题" min-width="260" />
          <el-table-column prop="type" label="分类" width="90">
            <template #default="scope">
              <el-tag size="small">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="user" label="发布者" width="120" />
          <el-table-column prop="time" label="提交时间" width="160" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.status === '待审核'" type="warning" size="small">待审核</el-tag>
              <el-tag v-else-if="scope.row.status === '已通过'" type="success" size="small">已通过</el-tag>
              <el-tag v-else type="danger" size="small">已驳回</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="280" fixed="right">
            <template #default="scope">
              <el-button size="small" type="primary" v-if="scope.row.status === '待审核'" @click="handleApprove">✅ 通过</el-button>
              <el-button size="small" type="danger" v-if="scope.row.status === '待审核'" @click="handleReject">❌ 驳回</el-button>
              <el-button size="small">👁 查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
          <el-pagination background layout="prev, pager, next, jumper" :total="128" :page-size="10" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-page { width: 100%; }
.admin-layout { display: grid; grid-template-columns: 240px 1fr; gap: 20px; }
.admin-sidebar { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(15,23,42,0.05); position: sticky; top: 20px; height: fit-content; }
.admin-sidebar-head { padding: 10px 12px 20px 12px; border-bottom: 2px solid #F1F5F9; margin-bottom: 14px; font-size: 16px; font-weight: 700; color: #0F172A; }
.admin-sidebar a, .admin-sidebar .RouterLink { display: block; padding: 10px 12px; border-radius: 8px; color: #475569; text-decoration: none; font-size: 13px; margin-bottom: 4px; }
.admin-sidebar a:hover, .admin-sidebar .RouterLink:hover { background: #F8FAFC; color: #2563EB; }
.admin-sidebar a.active, .admin-sidebar .RouterLink.active { background: #2563EB; color: white; font-weight: 600; }

.admin-main { background: white; border-radius: 16px; padding: 32px; box-shadow: 0 2px 8px rgba(15,23,42,0.05); }
.admin-title { font-size: 22px; font-weight: 700; color: #0F172A; margin: 0 0 4px 0; }
.admin-subtitle { font-size: 13px; color: #64748B; margin-bottom: 28px; }

.filter-bar {
  background: #F8FAFC;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.filter-bar .el-select { width: 140px; }

@media (max-width: 1000px) { .admin-layout { grid-template-columns: 1fr; } }
</style>
