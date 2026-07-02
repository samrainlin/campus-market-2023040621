<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { createTrade } from '../api/trade'
import { createLostFound } from '../api/lostFound'
import { createGroupBuy } from '../api/groupBuy'
import { createErrand } from '../api/errand'
import { useUserStore } from '../stores/user'

type PublishType = 'trade' | 'lostFound' | 'groupBuy' | 'errand'

const router = useRouter()
const selectedType = ref<PublishType | null>(null)
const submitting = ref(false)
const userStore = useUserStore()

const categories = [
  { type: 'trade' as PublishType, icon: '📚', title: '二手交易', desc: '教材、自行车、数码产品<br />衣服、生活用品闲置转让', color: 'cat-blue' },
  { type: 'lostFound' as PublishType, icon: '🔍', title: '失物招领', desc: '校园卡、钥匙、雨伞丢失<br />或拾到他人物品招领', color: 'cat-red' },
  { type: 'groupBuy' as PublishType, icon: '🍜', title: '拼单搭子', desc: '奶茶、外卖、打车拼车<br />结伴出行，分摊费用', color: 'cat-orange' },
  { type: 'errand' as PublishType, icon: '🏃', title: '跑腿委托', desc: '代取快递、代打印资料<br />校园服务类任务发布', color: 'cat-green' },
]

const form = reactive({
  title: '',
  location: '',
  description: '',
  category: '',
  price: 0,
  condition: '',
  originalPrice: 0,
  negotiateMethod: '',
  transactionMethod: '',
  contact: '',
  lostFoundType: 'lost',
  itemName: '',
  itemCategory: '',
  eventTime: '',
  reward: 0,
  where: '',
  groupType: '',
  targetCount: 2,
  budget: 0,
  meetTime: '',
  deadline: '',
  taskType: '',
  from: '',
  to: '',
})

const errors = reactive<Record<string, string>>({})

const titlePlaceholder: Record<PublishType, string> = {
  trade: '例如：出闲置《软件工程导论》九成新，可小刀',
  lostFound: '例如：丢失校园一卡通，学号尾号3829，拾到者重谢！',
  groupBuy: '例如：喜茶拼单！3杯起送，差1人就满，北门自取',
  errand: '例如：菜鸟驿站代取快递2件，送到南区6栋，酬谢5元',
}

const currentTitlePlaceholder = computed(() => selectedType.value ? titlePlaceholder[selectedType.value] : '')

const tradeCategories = [
  { label: '📖 教材书籍', value: 'book' },
  { label: '📚 考研/考证资料', value: 'exam' },
  { label: '💻 数码产品', value: 'digital' },
  { label: '🚲 自行车/代步工具', value: 'vehicle' },
  { label: '👕 服饰', value: 'clothing' },
  { label: '🏠 生活用品', value: 'daily' },
  { label: '🎮 其他', value: 'other' },
]

const groupTypes = [
  { label: '🥤 奶茶/咖啡', value: 'tea' },
  { label: '🍜 外卖/食堂', value: 'food' },
  { label: '🚕 打车/拼车', value: 'taxi' },
  { label: '🛒 网购拼单', value: 'shop' },
  { label: '🎬 电影/演出', value: 'movie' },
  { label: '🎫 其他结伴', value: 'other' },
]

const taskTypes = [
  { label: '📦 快递代取', value: 'express' },
  { label: '🖨 打印/复印', value: 'print' },
  { label: '🍜 食堂代购', value: 'food' },
  { label: '📚 图书馆代借', value: 'library' },
  { label: '📄 文件代办', value: 'doc' },
  { label: '🎁 物品代送', value: 'delivery' },
  { label: '🏪 其他代办', value: 'other' },
]

const lostItemCategories = [
  { label: '证件卡片类', value: 'card' },
  { label: '电子产品类', value: 'electronic' },
  { label: '钥匙类', value: 'key' },
  { label: '书籍文具类', value: 'book' },
  { label: '雨伞水杯类', value: 'umbrella' },
  { label: '衣物类', value: 'clothing' },
  { label: '手机/钱包类', value: 'phone' },
  { label: '其他', value: 'other' },
]

function selectType(type: PublishType) {
  selectedType.value = type
  resetForm()
}

function goBack() {
  selectedType.value = null
  resetForm()
}

function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function validateForm() {
  clearErrors()

  if (!form.title) {
    errors.title = '请输入标题'
  }

  if (selectedType.value === 'trade') {
    if (!form.category) {
      errors.category = '请选择商品分类'
    }
    if (form.price <= 0) {
      errors.price = '价格应大于 0'
    }
    if (!form.condition) {
      errors.condition = '请选择新旧程度'
    }
    if (!form.location) {
      errors.location = '请输入交易地点'
    }
    if (!form.description) {
      errors.description = '请输入商品描述'
    }
  }

  if (selectedType.value === 'lostFound') {
    if (!form.itemName) {
      errors.itemName = '请输入物品名称'
    }
    if (!form.eventTime) {
      errors.eventTime = '请选择发生时间'
    }
    if (!form.where) {
      errors.where = '请输入地点'
    }
  }

  if (selectedType.value === 'groupBuy') {
    if (!form.groupType) {
      errors.groupType = '请选择拼单类型'
    }
    if (form.targetCount < 2) {
      errors.targetCount = '目标人数不能少于 2 人'
    }
    if (!form.deadline) {
      errors.deadline = '请选择截止时间'
    }
    if (!form.location) {
      errors.location = '请输入地点'
    }
  }

  if (selectedType.value === 'errand') {
    if (!form.taskType) {
      errors.taskType = '请选择任务类型'
    }
    if (form.reward < 0) {
      errors.reward = '酬劳不能为负数'
    }
    if (!form.from) {
      errors.from = '请输入起始地点'
    }
    if (!form.to) {
      errors.to = '请输入送达地点'
    }
    if (!form.deadline) {
      errors.deadline = '请选择截止时间'
    }
  }

  return Object.values(errors).every((message) => !message)
}

function getCurrentTime() {
  const now = new Date()
  return now.toISOString().slice(0, 16).replace('T', ' ')
}

async function handleSubmit() {
  if (!userStore.isLoggedIn || !userStore.currentUser) {
    window.alert('请先登录后再发布信息')
    router.push('/login')
    return
  }

  if (!validateForm()) {
    return
  }

  submitting.value = true

  try {
    if (selectedType.value === 'trade') {
      await createTrade({
        title: form.title,
        category: form.category,
        price: form.price,
        condition: form.condition,
        location: form.location,
        publisher: userStore.displayName,
        publishTime: getCurrentTime(),
        image: `https://picsum.photos/seed/trade-${Date.now()}/400/300`,
        status: 'open',
        description: form.description,
        originalPrice: form.originalPrice || undefined,
        negotiateMethod: form.negotiateMethod || undefined,
        transactionMethod: form.transactionMethod || undefined,
        contact: form.contact || undefined,
      })
      window.alert('二手商品发布成功')
      router.push('/trade')
    }

    if (selectedType.value === 'lostFound') {
      await createLostFound({
        title: form.title,
        type: form.lostFoundType === 'lost' ? '寻物' : '招领',
        itemName: form.itemName,
        location: form.where,
        time: form.eventTime,
        contact: form.contact || userStore.displayName,
        status: 'open',
        description: form.description,
      })
      window.alert('失物招领信息发布成功')
      router.push('/lost-found')
    }

    if (selectedType.value === 'groupBuy') {
      await createGroupBuy({
        title: form.title,
        type: form.groupType,
        targetCount: form.targetCount,
        currentCount: 1,
        deadline: form.deadline,
        location: form.location,
        publisher: userStore.displayName,
        status: 'open',
        description: form.description,
        budget: form.budget || undefined,
        meetTime: form.meetTime || undefined,
        contact: form.contact || undefined,
      })
      window.alert('拼单搭子信息发布成功')
      router.push('/group-buy')
    }

    if (selectedType.value === 'errand') {
      await createErrand({
        title: form.title,
        taskType: form.taskType,
        reward: form.reward,
        pickupLocation: form.from,
        deliveryLocation: form.to,
        deadline: form.deadline,
        publisher: userStore.displayName,
        contact: form.contact || undefined,
        status: 'open',
        description: form.description,
      })
      window.alert('跑腿委托发布成功')
      router.push('/errand')
    }
  } catch (error) {
    console.error(error)
    window.alert('发布失败，请确认 JSON Server 已启动，并检查表单数据是否完整。')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  form.title = ''
  form.location = ''
  form.description = ''
  form.category = ''
  form.price = 0
  form.condition = ''
  form.originalPrice = 0
  form.negotiateMethod = ''
  form.transactionMethod = ''
  form.contact = ''
  form.lostFoundType = 'lost'
  form.itemName = ''
  form.itemCategory = ''
  form.eventTime = ''
  form.where = ''
  form.reward = 0
  form.groupType = ''
  form.targetCount = 2
  form.budget = 0
  form.meetTime = ''
  form.deadline = ''
  form.taskType = ''
  form.from = ''
  form.to = ''

  clearErrors()
}
</script>

<template>
  <section class="page">
    <div class="breadcrumb">
      <router-link to="/" class="breadcrumb-link">首页</router-link>
      <span class="breadcrumb-sep">/</span>
      <span v-if="!selectedType" class="breadcrumb-current">发布信息</span>
      <template v-else>
        <a href="javascript:;" class="breadcrumb-link" @click="goBack">发布信息</a>
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-current">{{ categories.find(c => c.type === selectedType)?.title }}</span>
      </template>
    </div>

    <!-- 分类选择页 -->
    <template v-if="!selectedType">
      <div class="publish-hero">
        <h1>✏️ 想发布什么信息？</h1>
        <p>选择合适的分类，让你的信息被更多同学看到</p>
      </div>

      <div class="category-picker">
        <a
          v-for="cat in categories"
          :key="cat.type"
          href="javascript:;"
          class="cat-card"
          :class="cat.color"
          @click="selectType(cat.type)"
        >
          <div class="cat-icon-lg">{{ cat.icon }}</div>
          <h3 class="cat-title-lg">{{ cat.title }}</h3>
          <p class="cat-desc-lg" v-html="cat.desc"></p>
        </a>
      </div>

      <div class="form-layout">
        <div class="main-form">
          <h2 class="form-title">📖 发布须知</h2>
          <p class="form-subtitle">发布前请阅读以下规则，共建友善校园社区</p>
          <div style="line-height: 1.9; font-size: 14px; color: #475569;">
            <div class="notice-card"><strong style="color: #A16207;">✓ 诚信真实：</strong>发布的信息必须真实有效，商品描述要与实际一致。</div>
            <div class="notice-card"><strong style="color: #A16207;">✓ 遵守法律：</strong>禁止发布违法、违规、低俗、商业广告类信息。</div>
            <div class="notice-card"><strong style="color: #A16207;">✓ 信息完整：</strong>填写完整描述和联系方式，上传真实图片。</div>
            <div class="notice-card"><strong style="color: #A16207;">✓ 及时处理：</strong>信息完成或失效后，请及时下架或删除。</div>
            <div class="notice-card"><strong style="color: #A16207;">✓ 保护隐私：</strong>请勿发布他人姓名、电话、照片等隐私信息。</div>
          </div>
        </div>

        <div>
          <div class="tips-card">
            <h3 class="tips-title">💡 发布小技巧</h3>
            <div class="tip-item">清晰的标题更易被搜索到</div>
            <div class="tip-item">上传真实图片可提升关注度</div>
            <div class="tip-item">详细描述可减少沟通成本</div>
            <div class="tip-item">合理的价格能快速成交</div>
            <div class="tip-item">准确填写地点方便面交</div>
          </div>
          <div class="tips-card" style="background: #FEF3C7;">
            <h3 class="tips-title" style="color: #A16207;">⚠️ 违规内容</h3>
            <div style="font-size: 12px; color: #78350F; line-height: 1.7;">
              · 商业广告与推销<br />
              · 违法违禁物品<br />
              · 虚假信息与欺诈<br />
              · 侵犯他人权益<br />
              · 代写代考类服务
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 具体表单 -->
    <template v-else>
      <div class="form-layout">
        <div class="main-form">
          <template v-if="selectedType === 'trade'">
            <h2 class="form-title">📚 发布二手商品</h2>
            <p class="form-subtitle">填写以下信息发布你的闲置物品，让有需要的同学能看到～</p>
            <div class="section-divider"><span>🎯 基本信息</span></div>

            <div class="form-group">
              <label class="form-label">商品标题</label>
              <el-input size="large" v-model="form.title" :placeholder="currentTitlePlaceholder" :class="{ 'is-error': errors.title }" />
              <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
            </div>

            <div class="row-2">
              <div class="form-group">
                <label class="form-label">商品分类</label>
                <el-select size="large" v-model="form.category" placeholder="选择商品分类" style="width: 100%;">
                  <el-option v-for="opt in tradeCategories" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
                <p v-if="errors.category" class="error-text">{{ errors.category }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">新旧程度</label>
                <el-select size="large" v-model="form.condition" placeholder="选择新旧程度" style="width: 100%;">
                  <el-option label="全新未拆" value="new" />
                  <el-option label="九成新" value="99" />
                  <el-option label="八成新" value="80" />
                  <el-option label="七成新" value="70" />
                  <el-option label="六成新及以下" value="60" />
                </el-select>
                <p v-if="errors.condition" class="error-text">{{ errors.condition }}</p>
              </div>
            </div>

            <div class="row-3">
              <div class="form-group">
                <label class="form-label">售价（元）</label>
                <el-input size="large" v-model.number="form.price" type="number" min="0" placeholder="请输入售价" />
                <p v-if="errors.price" class="error-text">{{ errors.price }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">原价（元）</label>
                <el-input size="large" v-model.number="form.originalPrice" type="number" min="0" placeholder="可填写原购买价格" />
              </div>
              <div class="form-group">
                <label class="form-label">议价方式</label>
                <el-select size="large" v-model="form.negotiateMethod" placeholder="选择" style="width: 100%;">
                  <el-option label="可小刀" value="small" />
                  <el-option label="可大刀" value="big" />
                  <el-option label="不议价" value="no" />
                </el-select>
              </div>
            </div>

            <div class="section-divider"><span>📍 交易信息</span></div>

            <div class="row-2">
              <div class="form-group">
                <label class="form-label">交易地点</label>
                <el-input size="large" v-model="form.location" placeholder="例如：计算机学院门口 / 北区3栋" />
                <p v-if="errors.location" class="error-text">{{ errors.location }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">交易方式</label>
                <el-select size="large" v-model="form.transactionMethod" placeholder="选择交易方式" style="width: 100%;">
                  <el-option label="当面交易" value="face" />
                  <el-option label="快递寄送" value="express" />
                  <el-option label="均可" value="both" />
                </el-select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">联系方式</label>
              <el-input size="large" v-model="form.contact" placeholder="建议填写微信号或QQ号，方便沟通" />
            </div>

            <div class="section-divider"><span>📝 详细描述</span></div>
            <div class="form-group">
              <el-input type="textarea" :rows="6" v-model="form.description"
                placeholder="请详细描述商品的状态、使用感受、购买时间、是否有包装等，越详细越容易被关注哦～" />
              <p v-if="errors.description" class="error-text">{{ errors.description }}</p>
            </div>
          </template>

          <template v-if="selectedType === 'lostFound'">
            <h2 class="form-title">🔍 发布失物招领</h2>
            <p class="form-subtitle">帮你快速找到丢失的物品，或帮他人寻回失主</p>
            <div class="section-divider"><span>📌 选择类型</span></div>
            <div class="type-switcher">
              <div class="type-option" :class="{ active: form.lostFoundType === 'lost' }" @click="form.lostFoundType = 'lost'">
                <div class="type-icon">🙋</div>
                <div class="type-text">我丢了东西</div>
                <div class="type-sub">寻找丢失的物品</div>
              </div>
              <div class="type-option" :class="{ active: form.lostFoundType === 'found' }" @click="form.lostFoundType = 'found'">
                <div class="type-icon">🤝</div>
                <div class="type-text">我拾到了东西</div>
                <div class="type-sub">发布招领信息</div>
              </div>
            </div>
            <div class="section-divider"><span>📋 物品信息</span></div>
            <div class="form-group">
              <label class="form-label">标题</label>
              <el-input size="large" v-model="form.title" :placeholder="currentTitlePlaceholder" :class="{ 'is-error': errors.title }" />
              <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
            </div>
            <div class="row-2">
              <div class="form-group">
                <label class="form-label">物品名称</label>
                <el-input size="large" v-model="form.itemName" placeholder="例如：校园一卡通 / 蓝色雨伞" :class="{ 'is-error': errors.itemName }" />
                <p v-if="errors.itemName" class="error-text">{{ errors.itemName }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">物品类型</label>
                <el-select size="large" v-model="form.itemCategory" placeholder="选择类型" style="width: 100%;">
                  <el-option v-for="opt in lostItemCategories" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
              </div>
            </div>
            <div class="section-divider"><span>📍 时间 / 地点</span></div>
            <div class="row-2">
              <div class="form-group">
                <label class="form-label">{{ form.lostFoundType === 'lost' ? '丢失' : '拾到' }}时间</label>
                <el-date-picker size="large" v-model="form.eventTime" type="datetime" placeholder="选择日期时间" style="width: 100%;" value-format="YYYY-MM-DD HH:mm" />
                <p v-if="errors.eventTime" class="error-text">{{ errors.eventTime }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">地点</label>
                <el-input size="large" v-model="form.where" :placeholder="form.lostFoundType === 'lost' ? '例如：三食堂一楼' : '例如：操场跑道'" />
                <p v-if="errors.where" class="error-text">{{ errors.where }}</p>
              </div>
            </div>
            <div class="section-divider"><span>💝 联系方式与酬谢</span></div>
            <div class="row-2">
              <div class="form-group">
                <label class="form-label">酬谢金（元，选填）</label>
                <el-input size="large" v-model.number="form.reward" type="number" min="0" placeholder="例如：20" />
              </div>
              <div class="form-group">
                <label class="form-label">联系方式</label>
                <el-input size="large" v-model="form.contact" placeholder="微信号或QQ号" />
              </div>
            </div>
            <div class="section-divider"><span>📝 详细描述</span></div>
            <div class="form-group">
              <el-input type="textarea" :rows="6" v-model="form.description" placeholder="请详细描述物品的特征，例如颜色、大小、品牌、是否有特殊标记等，越详细越容易被认出哦～" />
            </div>
          </template>

          <template v-if="selectedType === 'groupBuy'">
            <h2 class="form-title">🍜 发布拼单搭子</h2>
            <p class="form-subtitle">召集同学一起拼单，分摊费用，校园生活更划算</p>
            <div class="section-divider"><span>📌 基本信息</span></div>
            <div class="form-group">
              <label class="form-label">拼单标题</label>
              <el-input size="large" v-model="form.title" :placeholder="currentTitlePlaceholder" :class="{ 'is-error': errors.title }" />
              <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
            </div>
            <div class="row-2">
              <div class="form-group">
                <label class="form-label">拼单类型</label>
                <el-select size="large" v-model="form.groupType" placeholder="选择类型" style="width: 100%;">
                  <el-option v-for="opt in groupTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
                </el-select>
                <p v-if="errors.groupType" class="error-text">{{ errors.groupType }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">人数上限</label>
                <el-input size="large" v-model.number="form.targetCount" type="number" min="2" placeholder="总人数" />
                <p v-if="errors.targetCount" class="error-text">{{ errors.targetCount }}</p>
              </div>
            </div>
            <div class="row-3">
              <div class="form-group">
                <label class="form-label">人均预算（元）</label>
                <el-input size="large" v-model.number="form.budget" type="number" min="0" placeholder="例如：22" />
              </div>
              <div class="form-group">
                <label class="form-label">报名截止时间</label>
                <el-date-picker size="large" v-model="form.deadline" type="datetime" placeholder="选择截止时间" style="width: 100%;" value-format="YYYY-MM-DD HH:mm" />
                <p v-if="errors.deadline" class="error-text">{{ errors.deadline }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">集合/配送时间</label>
                <el-input size="large" v-model="form.meetTime" placeholder="例如：今天下午4点" />
              </div>
            </div>
            <div class="section-divider"><span>📍 地点与联系</span></div>
            <div class="row-2">
              <div class="form-group">
                <label class="form-label">集合/配送地点</label>
                <el-input size="large" v-model="form.location" placeholder="例如：北门传达室 / 南区3栋" />
                <p v-if="errors.location" class="error-text">{{ errors.location }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">联系方式</label>
                <el-input size="large" v-model="form.contact" placeholder="建议填写微信号" />
              </div>
            </div>
            <div class="section-divider"><span>📝 拼单描述</span></div>
            <div class="form-group">
              <el-input type="textarea" :rows="6" v-model="form.description"
                placeholder="请详细说明拼单的内容，例如：&#10;• 拼单对象和来源&#10;• 每人分摊的方式和金额&#10;• 具体取/配送方式&#10;• 其他需要说明的事项" />
            </div>
          </template>

          <template v-if="selectedType === 'errand'">
            <h2 class="form-title">🏃 发布跑腿委托</h2>
            <p class="form-subtitle">发布任务让有时间的同学帮你跑一趟，提供合理的报酬即可</p>
            <div class="section-divider"><span>📌 任务信息</span></div>
            <div class="form-group">
              <label class="form-label">任务标题</label>
              <el-input size="large" v-model="form.title" :placeholder="currentTitlePlaceholder" :class="{ 'is-error': errors.title }" />
              <p v-if="errors.title" class="error-text">{{ errors.title }}</p>
            </div>
            <div class="form-group">
              <label class="form-label">任务类型</label>
              <el-select size="large" v-model="form.taskType" placeholder="选择类型" style="width: 100%;">
                <el-option v-for="opt in taskTypes" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
              <p v-if="errors.taskType" class="error-text">{{ errors.taskType }}</p>
            </div>
            <div class="section-divider"><span>📍 路线与时间</span></div>
            <div class="row-2">
              <div class="form-group">
                <label class="form-label">起始地点</label>
                <el-input size="large" v-model="form.from" placeholder="例如：南门菜鸟驿站" />
                <p v-if="errors.from" class="error-text">{{ errors.from }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">送达地点</label>
                <el-input size="large" v-model="form.to" placeholder="例如：南区6栋宿舍楼下" />
                <p v-if="errors.to" class="error-text">{{ errors.to }}</p>
              </div>
            </div>
            <div class="row-2">
              <div class="form-group">
                <label class="form-label">期望完成时间</label>
                <el-date-picker size="large" v-model="form.deadline" type="datetime" placeholder="选择时间" style="width: 100%;" value-format="YYYY-MM-DD HH:mm" />
                <p v-if="errors.deadline" class="error-text">{{ errors.deadline }}</p>
              </div>
              <div class="form-group">
                <label class="form-label">报酬（元）</label>
                <el-input size="large" v-model.number="form.reward" type="number" min="0" placeholder="例如：5" />
                <p v-if="errors.reward" class="error-text">{{ errors.reward }}</p>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">联系方式</label>
              <el-input size="large" v-model="form.contact" placeholder="建议填写微信号" />
            </div>
            <div class="section-divider"><span>📝 任务描述</span></div>
            <div class="form-group">
              <el-input type="textarea" :rows="6" v-model="form.description"
                placeholder="请详细描述任务内容，例如：&#10;• 需要做什么（取件码多少、要打印什么文件等）&#10;• 物品的大小、数量&#10;• 有什么特殊注意事项&#10;• 付款方式和时间" />
            </div>
          </template>

          <div class="form-actions">
            <el-button size="large" @click="goBack">取消</el-button>
            <el-button size="large" type="primary" :loading="submitting" @click="handleSubmit">
              {{ submitting ? '发布中...' : '✨ 立即发布' }}
            </el-button>
          </div>
        </div>

        <div class="sidebar-tips">
          <div class="tips-card" v-if="selectedType === 'trade'">
            <h3 class="tips-title">💡 填写小技巧</h3>
            <div class="tip-item">标题简洁明了，突出重点</div>
            <div class="tip-item">图片要真实清晰，避免美化过度</div>
            <div class="tip-item">合理定价可提升交易成功率</div>
            <div class="tip-item">提供原价比对更有说服力</div>
            <div class="tip-item">详细描述可减少反复沟通</div>
          </div>
          <div class="tips-card" style="background: #FEFCE8;" v-if="selectedType === 'trade'">
            <h3 class="tips-title" style="color: #A16207;">⚠️ 禁止发布</h3>
            <div style="font-size: 12px; color: #78350F; line-height: 1.7;">
              · 虚假/盗版书籍<br />
              · 违法违规物品<br />
              · 商业广告推销<br />
              · 仿冒/山寨产品
            </div>
          </div>
          <div class="tips-card" v-if="selectedType === 'lostFound'">
            <h3 class="tips-title">💡 发布小技巧</h3>
            <div class="tip-item">详细描述物品特征，方便辨认</div>
            <div class="tip-item">准确填写丢失时间和地点</div>
            <div class="tip-item">如有酬金可提高关注度</div>
            <div class="tip-item">保护隐私，勿泄露个人信息</div>
          </div>
          <div class="tips-card" style="background: #FEF2F2;" v-if="selectedType === 'lostFound'">
            <h3 class="tips-title" style="color: #991B1B;">⚠️ 注意事项</h3>
            <div style="font-size: 12px; color: #7F1D1D; line-height: 1.7;">
              · 不要发布他人身份证、学生证号等<br />
              · 拾取证件请交至学生事务中心<br />
              · 警惕虚假认领
            </div>
          </div>
          <div class="tips-card" v-if="selectedType === 'groupBuy'">
            <h3 class="tips-title">💡 拼单小技巧</h3>
            <div class="tip-item">起送金额/满减金额写清楚</div>
            <div class="tip-item">设置合理的截止时间</div>
            <div class="tip-item">准确的集合地点和时间</div>
            <div class="tip-item">费用分摊方式写清楚</div>
          </div>
          <div class="tips-card" style="background: #FEF3C7;" v-if="selectedType === 'groupBuy'">
            <h3 class="tips-title" style="color: #A16207;">⚠️ 温馨提示</h3>
            <div style="font-size: 12px; color: #78350F; line-height: 1.7;">
              · 请勿发布商业推销类信息<br />
              · 谨慎拼单涉及现金的内容<br />
              · 请按时参加拼单，勿放鸽子
            </div>
          </div>
          <div class="tips-card" v-if="selectedType === 'errand'">
            <h3 class="tips-title">💡 发布小技巧</h3>
            <div class="tip-item">明确描述任务内容</div>
            <div class="tip-item">给出合理的报酬金额</div>
            <div class="tip-item">时间地点准确清晰</div>
            <div class="tip-item">及时回复报名的同学</div>
          </div>
          <div class="tips-card" style="background: #D1FAE5;" v-if="selectedType === 'errand'">
            <h3 class="tips-title" style="color: #064E3B;">⚠️ 注意事项</h3>
            <div style="font-size: 12px; color: #065F46; line-height: 1.7;">
              · 请勿委托违反学校规定的事项<br />
              · 现金、证件类请谨慎委托<br />
              · 保护个人隐私信息
            </div>
          </div>
          <div class="tips-card" v-if="selectedType === 'errand'">
            <h3 class="tips-title">💰 报酬建议</h3>
            <div style="font-size: 12px; color: #475569; line-height: 1.8;">
              • 小件快递：3-5 元<br />
              • 大件快递：5-10 元<br />
              • 资料打印：2-5 元<br />
              • 食堂代购：5-8 元
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.breadcrumb-link {
  color: #409eff;
  text-decoration: none;
}

.breadcrumb-link:hover {
  color: #2b6cb0;
}

.breadcrumb-sep {
  color: #cbd5e1;
}

.breadcrumb-current {
  color: #475569;
}

.publish-hero {
  background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%);
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 24px;
  color: white;
  text-align: center;
}

.publish-hero h1 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
}

.publish-hero p {
  font-size: 14px;
  opacity: 0.95;
  margin: 0;
}

.category-picker {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.cat-card {
  background: white;
  border-radius: 18px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  text-decoration: none;
  color: inherit;
  border: 3px solid transparent;
}

.cat-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.15);
}

.cat-icon-lg {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34px;
  margin: 0 auto 16px;
}

.cat-blue .cat-icon-lg { background: #EFF6FF; }
.cat-red .cat-icon-lg { background: #FEF2F2; }
.cat-orange .cat-icon-lg { background: #FFFBEB; }
.cat-green .cat-icon-lg { background: #F0FDF4; }

.cat-title-lg {
  font-size: 17px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 8px 0;
}

.cat-desc-lg {
  font-size: 13px;
  color: #64748B;
  line-height: 1.6;
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.main-form {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
}

.form-title {
  font-size: 22px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 6px 0;
}

.form-subtitle {
  font-size: 13px;
  color: #64748B;
  margin-bottom: 28px;
}

.section-divider {
  font-size: 13px;
  font-weight: 700;
  color: #2563EB;
  padding: 8px 0;
  margin: 8px 0 16px 0;
  border-top: 2px solid #DBEAFE;
}

.section-divider span {
  background: #DBEAFE;
  padding: 6px 14px;
  border-radius: 999px;
  display: inline-block;
}

.form-group {
  margin-bottom: 22px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #0F172A;
  margin-bottom: 10px;
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.row-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.error-text {
  color: #F56C6C;
  font-size: 12px;
  margin: 4px 0 0 0;
}

.type-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 28px;
}

.type-option {
  padding: 20px;
  border-radius: 14px;
  border: 3px solid #E2E8F0;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
  background: white;
}

.type-option:hover {
  border-color: #CBD5E1;
}

.type-option.active {
  border-color: #EF4444;
  background: #FEF2F2;
}

.type-icon {
  font-size: 30px;
}

.type-text {
  font-size: 16px;
  font-weight: 700;
  color: #0F172A;
  margin-top: 8px;
}

.type-sub {
  font-size: 12px;
  color: #64748B;
  margin-top: 4px;
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #F1F5F9;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.notice-card {
  padding: 12px 16px;
  background: #FEFCE8;
  border-radius: 10px;
  margin-bottom: 12px;
}

.tips-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
  margin-bottom: 16px;
}

.tips-title {
  font-size: 14px;
  font-weight: 700;
  color: #0F172A;
  margin: 0 0 12px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #F1F5F9;
}

.tip-item {
  font-size: 12px;
  color: #475569;
  padding: 6px 0;
  line-height: 1.6;
}

.tip-item::before {
  content: "✓ ";
  color: #10B981;
  font-weight: 700;
}

.sidebar-tips {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 1100px) {
  .form-layout { grid-template-columns: 1fr; }
  .category-picker { grid-template-columns: repeat(2, 1fr); }
  .row-2, .row-3 { grid-template-columns: 1fr; }
}

@media (max-width: 500px) {
  .category-picker { grid-template-columns: 1fr; }
}
</style>
