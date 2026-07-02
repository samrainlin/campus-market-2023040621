# 校园轻集市

## 项目简介

"校园轻集市"是一个面向高校校园生活场景的 PC 端 Web App，主要支持二手交易、失物招领、拼单搭子、跑腿委托等功能。

本项目基于 Vue 3 + Vite + TypeScript 技术栈构建，使用 JSON Server 模拟后端接口，使用 Pinia 管理前端状态，是一个完整的前端实训项目。

---

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架，使用 Composition API 组织代码
- **Vite** - 下一代前端构建工具，提供快速的热更新体验
- **TypeScript** - 类型安全的 JavaScript 超集，提升代码可维护性
- **Vue Router** - Vue.js 官方路由管理器，实现多页面导航
- **Pinia** - Vue 官方状态管理库，管理用户状态和收藏状态
- **Axios** - 基于 Promise 的 HTTP 客户端，用于请求 Mock 数据接口
- **JSON Server** - 零配置的 REST API Mock 服务器，提供后端数据模拟
- **Element Plus** - 基于 Vue 3 的组件库，提供统一的 UI 风格

---

## 核心功能

- **首页与导航** - 项目入口页，展示各模块入口和导航菜单
- **二手交易** - 浏览、搜索校园二手商品信息
- **失物招领** - 发布和查看遗失物品与拾获物品
- **拼单搭子** - 寻找一起拼单、一起吃饭的小伙伴
- **跑腿委托** - 发布和接受各种校园跑腿任务
- **信息发布** - 登录用户可以在各模块发布新的信息
- **用户中心** - 展示用户资料、我的收藏、发布历史
- **收藏功能** - 对感兴趣的信息进行收藏管理
- **搜索与筛选** - 支持关键词搜索和分类筛选
- **状态提示** - 包含加载状态、空状态和错误状态的友好提示

---

## 项目运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动 Mock 服务

```bash
npm run mock
```

Mock 服务默认运行在 http://localhost:3001

### 3. 启动前端项目

```bash
npm run dev
```

前端服务默认运行在 http://localhost:5173

### 4. 构建项目

```bash
npm run build
```

构建产物输出到 `dist` 目录。

---

## 项目目录说明

```
campus-market-seed/
├── src/
│   ├── api/                 # 接口请求模块
│   │   ├── http.ts          # Axios 实例封装
│   │   ├── trade.ts         # 二手交易接口
│   │   ├── lostFound.ts     # 失物招领接口
│   │   ├── groupBuy.ts      # 拼单搭子接口
│   │   ├── errand.ts        # 跑腿委托接口
│   │   └── user.ts          # 用户相关接口
│   ├── components/          # 公共组件
│   │   ├── AppHeader.vue    # 页面顶部导航
│   │   ├── AppLayout.vue    # 统一页面布局
│   │   ├── AppNav.vue       # 导航栏组件
│   │   ├── ItemCard.vue     # 信息卡片组件
│   │   ├── EmptyState.vue   # 空状态提示组件
│   │   ├── LoadingState.vue # 加载状态提示组件
│   │   ├── ErrorState.vue   # 错误状态提示组件
│   │   ├── SearchBar.vue    # 搜索栏组件
│   │   └── FormField.vue    # 表单字段组件
│   ├── router/              # 路由配置
│   │   └── index.ts         # 路由定义
│   ├── stores/              # Pinia 状态管理
│   │   ├── user.ts          # 用户状态 store
│   │   └── favorite.ts      # 收藏状态 store
│   ├── views/               # 页面组件
│   │   ├── HomeView.vue     # 首页
│   │   ├── TradeView.vue    # 二手交易页
│   │   ├── LostFoundView.vue # 失物招领页
│   │   ├── GroupBuyView.vue # 拼单搭子页
│   │   ├── ErrandView.vue   # 跑腿委托页
│   │   ├── PublishView.vue  # 信息发布页
│   │   ├── MessageView.vue  # 消息通知页
│   │   ├── UserCenterView.vue # 用户中心页
│   │   ├── LoginView.vue    # 登录页
│   │   └── RegisterView.vue # 注册页
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── docs/
│   └── evidence/            # 每日过程性证据卡
│       ├── Day1_Evidence.md
│       ├── Day2_Evidence.md
│       ├── Day3_Evidence.md
│       ├── Day4_Evidence.md
│       ├── Day5_Evidence.md
│       ├── Day6_Evidence.md
│       └── Day7_Evidence.md
├── db.json                  # Mock 数据文件
├── check.js                 # 项目本地检测脚本
├── CHECK_REPORT.md          # 项目检测报告
├── package.json
└── README.md
```

---

## 测试账号

| 用户名 | 密码 |
|---|---|
| student | 123456 |

也可以通过注册页创建新账号。

---

## 功能说明

### 二手交易

浏览校园内的二手商品，支持搜索和收藏功能。用户登录后可以发布自己的闲置物品。

### 失物招领

发布遗失物品信息和拾获物品信息，帮助同学找回丢失的物品。

### 拼单搭子

寻找一起拼单购物、拼外卖、拼车的小伙伴，支持状态展示。

### 跑腿委托

发布和接受各种校园跑腿任务，如取快递、排队、打印等。

### 用户中心

展示个人资料、管理收藏的信息、查看历史发布。

---

## 开发说明

本项目基于以下技术选择：

1. **前端语言**：TypeScript，确保类型安全
2. **状态管理**：Pinia，管理用户登录状态和收藏状态
3. **数据来源**：JSON Server，提供 RESTful Mock 接口
4. **页面路由**：Vue Router，管理多页面导航
5. **HTTP 请求**：Axios，封装统一的请求方法

