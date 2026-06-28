<script setup lang="ts">
import { ref, computed } from 'vue'

type PublishCategory = '二手' | '失物' | '拼单' | '跑腿'

const selectedCategory = ref<PublishCategory>('二手')
const currentStep = ref(1)
const isSubmitting = ref(false)
const showSuccess = ref(false)

// 发布须知
const publishRules = [
  '请确保信息真实有效，严禁发布虚假信息',
  '禁止发布违法违规、低俗或与校园无关的内容',
  '交易请在公开场合进行，注意个人财产安全',
  '信息发布后 30 天内有效，过期将自动下架',
  '如需紧急信息推荐，请合理使用，避免骚扰他人',
]

// 通用表单字段
const formData = ref({
  title: '',
  description: '',
  location: '',
  contact: '',
  // 二手
  price: '',
  condition: '九成新',
  // 失物
  lostType: '寻物启事',
  lostDate: '',
  reward: '',
  // 拼单
  peopleNeeded: '',
  avgPrice: '',
  deadline: '',
  // 跑腿
  pickup: '',
  delivery: '',
  errandReward: '',
  errandDeadline: '',
})

const conditionOptions = ['全新', '九成新', '八成新', '七成新', '其他']
const lostTypeOptions = ['寻物启事', '失物招领']

const categoryInfo: Record<PublishCategory, { title: string; subtitle: string; icon: string; color: string }> = {
  二手: {
    title: '发布二手商品',
    subtitle: '转让闲置物品，让资源循环利用',
    icon: '📚',
    color: '#409EFF',
  },
  失物: {
    title: '发布失物招领',
    subtitle: '帮助寻找丢失物品，传递温暖',
    icon: '🔍',
    color: '#F56C6C',
  },
  拼单: {
    title: '发起拼单搭子',
    subtitle: '一起省钱，一起吃美食，一起打车',
    icon: '🍜',
    color: '#E6A23C',
  },
  跑腿: {
    title: '发布跑腿委托',
    subtitle: '互助跑腿，节省时间，诚信高效',
    icon: '🏃',
    color: '#67C23A',
  },
}

const categoryGradient = (cat: PublishCategory): string => {
  switch (cat) {
    case '二手':
      return 'linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%)'
    case '失物':
      return 'linear-gradient(135deg, #F56C6C 0%, #d94848 100%)'
    case '拼单':
      return 'linear-gradient(135deg, #E6A23C 0%, #b8800c 100%)'
    case '跑腿':
      return 'linear-gradient(135deg, #67C23A 0%, #4a9b23 100%)'
  }
}

const isFormValid = computed(() => {
  if (!formData.value.title.trim()) return false
  if (!formData.value.description.trim()) return false
  if (!formData.value.location.trim()) return false
  if (!formData.value.contact.trim()) return false

  switch (selectedCategory.value) {
    case '二手':
      return formData.value.price.trim() && formData.value.condition
    case '失物':
      return formData.value.lostType && formData.value.lostDate
    case '拼单':
      return formData.value.peopleNeeded.trim() && formData.value.deadline
    case '跑腿':
      return (
        formData.value.pickup.trim() &&
        formData.value.delivery.trim() &&
        formData.value.errandReward.trim()
      )
    default:
      return false
  }
})

const handleSubmit = () => {
  if (!isFormValid.value) return
  isSubmitting.value = true

  setTimeout(() => {
    isSubmitting.value = false
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
      // 重置表单
      formData.value = {
        title: '',
        description: '',
        location: '',
        contact: '',
        price: '',
        condition: '九成新',
        lostType: '寻物启事',
        lostDate: '',
        reward: '',
        peopleNeeded: '',
        avgPrice: '',
        deadline: '',
        pickup: '',
        delivery: '',
        errandReward: '',
        errandDeadline: '',
      }
      currentStep.value = 1
    }, 2000)
  }, 1000)
}

const handleSaveDraft = () => {
  alert('草稿已保存！（演示功能）')
}
</script>

<template>
  <div class="view-page">
    <!-- 面包屑 -->
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">首页</router-link>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">发布信息</span>
    </div>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="success-banner">
      <span class="success-icon">✅</span>
      <span class="success-text">信息发布成功！等待审核通过后将展示给其他用户。</span>
    </div>

    <div class="page-layout">
      <!-- 左侧：发布表单 -->
      <div class="form-area">
        <!-- 步骤指示器 -->
        <div class="step-bar">
          <div class="step-item" :class="{ active: currentStep === 1, done: currentStep > 1 }">
            <div class="step-num">1</div>
            <div class="step-label">选择分类</div>
          </div>
          <div class="step-line"></div>
          <div class="step-item" :class="{ active: currentStep === 2, done: currentStep > 2 }">
            <div class="step-num">2</div>
            <div class="step-label">填写信息</div>
          </div>
          <div class="step-line"></div>
          <div class="step-item" :class="{ active: currentStep === 3 }">
            <div class="step-num">3</div>
            <div class="step-label">发布</div>
          </div>
        </div>

        <!-- Step 1: 分类选择 -->
        <div v-if="currentStep === 1" class="category-select">
          <h2 class="section-title">请选择发布类型</h2>
          <div class="category-grid">
            <div
              v-for="cat in (['二手', '失物', '拼单', '跑腿'] as PublishCategory[])"
              :key="cat"
              class="category-card"
              :class="{ active: selectedCategory === cat }"
              @click="selectedCategory = cat"
            >
              <div class="category-icon" :style="{ background: categoryGradient(cat) }">
                {{ categoryInfo[cat].icon }}
              </div>
              <div class="category-name">{{ categoryInfo[cat].title }}</div>
              <div class="category-sub">{{ categoryInfo[cat].subtitle }}</div>
              <div class="category-check" v-if="selectedCategory === cat">✓</div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-primary" @click="currentStep = 2">下一步 →</button>
          </div>
        </div>

        <!-- Step 2 & 3: 表单填写 -->
        <div v-else class="form-body">
          <h2 class="section-title">
            <span class="title-icon" :style="{ background: categoryGradient(selectedCategory) }">
              {{ categoryInfo[selectedCategory].icon }}
            </span>
            {{ categoryInfo[selectedCategory].title }}
          </h2>

          <!-- 通用字段：标题 -->
          <div class="form-group">
            <label class="form-label">标题 <span class="required">*</span></label>
            <input
              v-model="formData.title"
              type="text"
              class="form-input"
              placeholder="简明扼要地描述你要发布的内容"
            />
          </div>

          <!-- 通用字段：详细描述 -->
          <div class="form-group">
            <label class="form-label">详细描述 <span class="required">*</span></label>
            <textarea
              v-model="formData.description"
              class="form-textarea"
              rows="5"
              placeholder="请详细描述物品/活动内容，便于其他同学了解和联系你"
            ></textarea>
          </div>

          <!-- 图片上传 -->
          <div class="form-group">
            <label class="form-label">图片上传</label>
            <div class="upload-area">
              <div class="upload-main">
                <div class="upload-icon">📷</div>
                <div class="upload-text">点击或拖拽上传图片</div>
                <div class="upload-hint">支持 JPG、PNG 格式，最多 6 张</div>
              </div>
              <div class="upload-preview">
                <div class="preview-item">
                  <img src="https://picsum.photos/seed/upload1/200/200" alt="示例1" />
                  <div class="preview-remove">×</div>
                </div>
                <div class="preview-item">
                  <img src="https://picsum.photos/seed/upload2/200/200" alt="示例2" />
                  <div class="preview-remove">×</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 二手特有字段 -->
          <template v-if="selectedCategory === '二手'">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">出售价格 <span class="required">*</span></label>
                <input
                  v-model="formData.price"
                  type="text"
                  class="form-input"
                  placeholder="如：50 元"
                />
              </div>
              <div class="form-group">
                <label class="form-label">新旧程度 <span class="required">*</span></label>
                <select v-model="formData.condition" class="form-select">
                  <option v-for="opt in conditionOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
            </div>
          </template>

          <!-- 失物特有字段 -->
          <template v-if="selectedCategory === '失物'">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">信息类型 <span class="required">*</span></label>
                <select v-model="formData.lostType" class="form-select">
                  <option v-for="opt in lostTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">丢失/拾获日期 <span class="required">*</span></label>
                <input v-model="formData.lostDate" type="date" class="form-input" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">悬赏金额（可选）</label>
              <input
                v-model="formData.reward"
                type="text"
                class="form-input"
                placeholder="如：20 元酬谢"
              />
            </div>
          </template>

          <!-- 拼单特有字段 -->
          <template v-if="selectedCategory === '拼单'">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">需要人数 <span class="required">*</span></label>
                <input
                  v-model="formData.peopleNeeded"
                  type="text"
                  class="form-input"
                  placeholder="如：还需 3 人"
                />
              </div>
              <div class="form-group">
                <label class="form-label">人均价格（可选）</label>
                <input
                  v-model="formData.avgPrice"
                  type="text"
                  class="form-input"
                  placeholder="如：人均 25 元"
                />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">截止时间 <span class="required">*</span></label>
              <input v-model="formData.deadline" type="datetime-local" class="form-input" />
            </div>
          </template>

          <!-- 跑腿特有字段 -->
          <template v-if="selectedCategory === '跑腿'">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">取件地点 <span class="required">*</span></label>
                <input
                  v-model="formData.pickup"
                  type="text"
                  class="form-input"
                  placeholder="如：菜鸟驿站 3 号"
                />
              </div>
              <div class="form-group">
                <label class="form-label">送达地点 <span class="required">*</span></label>
                <input
                  v-model="formData.delivery"
                  type="text"
                  class="form-input"
                  placeholder="如：学生宿舍 7 栋"
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">报酬金额 <span class="required">*</span></label>
                <input
                  v-model="formData.errandReward"
                  type="text"
                  class="form-input"
                  placeholder="如：5 元"
                />
              </div>
              <div class="form-group">
                <label class="form-label">期望完成时间（可选）</label>
                <input v-model="formData.errandDeadline" type="datetime-local" class="form-input" />
              </div>
            </div>
          </template>

          <!-- 通用字段：地点 + 联系方式 -->
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">交易/集合地点 <span class="required">*</span></label>
              <input
                v-model="formData.location"
                type="text"
                class="form-input"
                placeholder="如：图书馆门口、学生食堂等"
              />
            </div>
            <div class="form-group">
              <label class="form-label">联系方式 <span class="required">*</span></label>
              <input
                v-model="formData.contact"
                type="text"
                class="form-input"
                placeholder="微信号 / QQ 号 / 手机号"
              />
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="form-actions">
            <button v-if="currentStep === 2" class="btn-secondary" @click="currentStep = 1">
              ← 返回选择
            </button>
            <button class="btn-secondary" @click="handleSaveDraft">💾 保存草稿</button>
            <button
              class="btn-primary"
              :disabled="!isFormValid || isSubmitting"
              @click="handleSubmit"
            >
              <span v-if="isSubmitting">提交中...</span>
              <span v-else>📤 确认发布</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：发布须知 -->
      <aside class="sidebar">
        <div class="notice-card">
          <div class="notice-header">
            <span class="notice-icon">📋</span>
            <span class="notice-title">发布须知</span>
          </div>
          <ul class="notice-list">
            <li v-for="(rule, index) in publishRules" :key="index">
              <span class="notice-num">{{ index + 1 }}</span>
              <span class="notice-text">{{ rule }}</span>
            </li>
          </ul>
        </div>

        <div class="tips-card">
          <div class="notice-header">
            <span class="notice-icon">💡</span>
            <span class="notice-title">发布小贴士</span>
          </div>
          <ul class="tips-list">
            <li>标题简明扼要，突出重点信息</li>
            <li>描述越详细，越容易被感兴趣的同学找到</li>
            <li>上传真实清晰的图片，能大幅提高关注度</li>
            <li>填写准确的地点和时间，方便线下对接</li>
            <li>建议使用常用的联系方式，及时回复咨询</li>
          </ul>
        </div>

        <div class="contact-card">
          <div class="notice-header">
            <span class="notice-icon">❓</span>
            <span class="notice-title">遇到问题？</span>
          </div>
          <p class="contact-text">
            如在发布过程中遇到任何问题，可联系平台管理员或在个人中心查看帮助文档。
          </p>
          <router-link to="/user" class="contact-link">查看个人中心 →</router-link>
        </div>
      </aside>
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

/* 成功提示 */
.success-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
  padding: 16px 20px;
  border-radius: 12px;
  color: #166534;
  font-weight: 600;
}

.success-icon {
  font-size: 24px;
}

/* 页面布局 */
.page-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: flex-start;
}

/* 表单区域 */
.form-area {
  background: #ffffff;
  padding: 28px 32px;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

/* 步骤条 */
.step-bar {
  display: flex;
  align-items: center;
  padding: 0 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 28px;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.step-num {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
}

.step-item.active .step-num {
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.35);
}

.step-item.done .step-num {
  background: #67C23A;
  color: #ffffff;
}

.step-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.step-item.active .step-label {
  color: #1e293b;
  font-weight: 600;
}

.step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 16px;
  margin-bottom: 24px;
}

/* 区域标题 */
.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px;
}

.title-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  color: #ffffff;
  font-size: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 分类选择 */
.category-select {
  padding: 8px 0 16px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.category-card {
  position: relative;
  background: #f8fafc;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-card:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.category-card.active {
  background: #f0f9ff;
  border-color: #409EFF;
  box-shadow: 0 4px 16px rgba(64, 158, 255, 0.2);
}

.category-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  color: #ffffff;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-name {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
}

.category-sub {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.category-check {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 28px;
  height: 28px;
  background: #409EFF;
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

/* 表单主体 */
.form-body {
  padding: 8px 0;
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.required {
  color: #F56C6C;
  margin-left: 2px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #409EFF;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.15);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #94a3b8;
}

/* 上传区域 */
.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 24px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.upload-area:hover {
  border-color: #409EFF;
  background: #f0f9ff;
}

.upload-main {
  text-align: center;
  margin-bottom: 16px;
}

.upload-icon {
  font-size: 40px;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 15px;
  color: #334155;
  font-weight: 600;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #94a3b8;
}

.upload-preview {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.preview-item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #e2e8f0;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background: rgba(245, 108, 108, 0.95);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

/* 按钮 */
.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.btn-primary,
.btn-secondary {
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(64, 158, 255, 0.4);
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
  color: #1e293b;
}

/* 右侧栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 20px;
}

.notice-card,
.tips-card,
.contact-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.notice-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.notice-icon {
  font-size: 18px;
}

.notice-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.notice-list,
.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.notice-list li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.notice-num {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #409EFF 0%, #2B6CB0 100%);
  color: #ffffff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notice-text {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

.tips-list li {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  padding-left: 18px;
  position: relative;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #67C23A;
  font-weight: 700;
}

.contact-text {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 12px;
}

.contact-link {
  display: inline-block;
  font-size: 13px;
  color: #409EFF;
  text-decoration: none;
  font-weight: 600;
}

.contact-link:hover {
  color: #2B6CB0;
}

@media (max-width: 1000px) {
  .page-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
  }
}

@media (max-width: 600px) {
  .form-area {
    padding: 20px;
  }

  .category-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
