# Day2 Evidence - 页面骨架与路由导航

## 1. 今日完成内容

今日围绕"校园轻集市"项目完成了页面骨架搭建和路由导航配置：

**页面组件（8 个）**
- 首页 (src/views/HomeView.vue)
- 二手交易 (src/views/TradeView.vue)
- 失物招领 (src/views/LostFoundView.vue)
- 拼单搭子 (src/views/GroupBuyView.vue)
- 跑腿委托 (src/views/ErrandView.vue)
- 发布信息 (src/views/PublishView.vue)
- 消息中心 (src/views/MessageView.vue)
- 个人中心 (src/views/UserCenterView.vue)

**公共布局组件（3 个）**
- 整体布局 (src/components/AppLayout.vue)
- 顶部导航 (src/components/AppHeader.vue)
- 分类导航 (src/components/AppNav.vue)

**路由配置**
- src/router/index.ts 完成 8 个路由与页面的一一映射
- 在 router.beforeEach 中动态设置页面标题
- src/main.ts 完成 Router 与 Pinia 挂载

**其他**
- src/App.vue 简化为仅引用 AppLayout
- src/assets/main.css 统一样式基础
- 项目构建验证 (npm run build 成功)

## 2. 页面与路由清单

| 页面名称 | 路由路径 | 文件位置 |
|---------|---------|---------|
| 首页 | / | src/views/HomeView.vue |
| 二手交易 | /trade | src/views/TradeView.vue |
| 失物招领 | /lost-found | src/views/LostFoundView.vue |
| 拼单搭子 | /group-buy | src/views/GroupBuyView.vue |
| 跑腿委托 | /errand | src/views/ErrandView.vue |
| 发布信息 | /publish | src/views/PublishView.vue |
| 消息中心 | /message | src/views/MessageView.vue |
| 个人中心 | /user | src/views/UserCenterView.vue |

## 3. AI 协作记录

**使用的 AI 工具**
- Trae IDE 内置 AI Coding 工具

**核心提示词**
1. 我正在开发一个名为“校园轻集市”的 PC 端 Vue3 Web App，技术栈为 Vue3 + Vite + TypeScript + Vue Router + Pinia，请帮我完成 Day2 的页面骨架与路由导航任务，创建 8 个页面、配置路由、创建公共布局组件。
2. 检查项目中是否存在页面空白、导航无法跳转、刷新报错、过度封装等 Day2 常见问题。
3. 将 el-input、el-pagination 等 Element Plus 组件替换为原生 HTML 实现，因为 Day2 不引入第三方 UI 框架。

**AI 生成的内容**
- 各页面基础模板 (HomeView/TradeView/LostFoundView/GroupBuyView/ErrandView/PublishView/MessageView/UserCenterView)
- 路由表结构与 beforeEach 守卫逻辑
- 布局组件嵌套关系 (AppLayout → AppHeader → AppNav)
- Element Plus 组件 → 原生 HTML 替换的代码段
- 证据卡模板与清单表格

**人工修改/删除/确认的内容**
- 删除了 AI 生成代码中的 Element Plus 相关内容 (从 main.ts 移除 ElementPlus 挂载代码，从 views 将 el-input、el-pagination 替换为原生 input 与原生按钮组)
- 将原先的 /home 路由修正为 /，/user-center 修正为 /user，并同步修正面包屑链接
- 将原先非业务相关 BoardView、DetailView、ListView、ProfileView 删除，仅保留 8 个核心业务页面
- 确认路由名称全部使用 kebab-case（如 lost-found、group-buy），与页面清单保持一致
- 在 AppNav.vue 中新增 totalPages 计算属性与原生分页控件
- 修复 TS 严格模式下 Object possibly undefined 报错（在 MessageView.sendMsg 处保存局部变量）
- 手动调整各页面的分类、标签、数据项等业务数据以符合校园轻集市场景
- 人工审阅了首页信息流条目、发布表单、消息中心会话与聊天区域等内容

## 4. 遇到的问题与解决方法

**问题一：路由路径与页面清单不一致**
- 现象：在初次配置路由时，首页路由写为 /home，个人中心写为 /user-center，与页面清单要求 / 和 /user 不符
- 原因：路由路径语义与页面清单命名风格不一致
- 解决：在 router/index.ts 修改了路由 path 上修正，并在 AppNav.vue、各页面面包屑同步更新链接
- 验证：启动项目点击导航全部页面均能正常跳转与高亮

**问题二：页面中残留 Element Plus 组件，导致功能失效**
- 现象：HomeView、TradeView、LostFoundView、GroupBuyView、ErrandView 中使用了 el-input 和 el-pagination 组件，但 main.ts 中未注册 Element Plus
- 原因：Day2 不引入第三方 UI 框架，页面中用的 el-* 标签在浏览器中直接被作为普通 HTML 元素解析，无法渲染为原生按钮组
- 解决：逐一将 el-input 替换为外层 div + input 元素，并补充 CSS 统一样式（聚焦蓝色边框 + 清除按钮
- 效果：el-pagination 替换为左右箭头按钮组 + 当前页 / 总页数文本，统一样式为 为为为

**问题三：TypeScript 严格模式下的类型检查报错**
- 现象：npm run build type-check 阶段报 TS2532: Object is possibly undefined'
- 原因：MessageView.sendMsg 中在 if (!chatHistory[x]) 检查后又使用 chatHistory[x].push(xx，TS strict 模式下不能保证该索引值不变
- 解决：将 chatHistory[activeConversationId.value 保存到局部变量 const history = ... 后再在 if (history) 的范围内 push
- 效果：TS 类型检查通过

**问题四：AI 生成代码过度复杂，包含登录鉴权、接口请求、第三方 UI 框架**
- 现象：AI 一次性输出 element-plus、axios、pinia store 等复杂代码
- 原因：提示词未明确限制 Day2 范围
- 解决：仅保留页面组件、路由、布局相关代码；删除鉴权/API/引入第三方 UI 框架相关代码；不提前设计复杂权限系统。

## 5. 今日反思

Day2 的核心任务是搭建项目骨架，虽然看起来只是"搭架子"，但对后续业务开发的影响非常深远。**页面骨架**为后续每个业务页面提供了统一的入口文件命名和组件结构，后续无论是扩展发布页、详情页、订单页都可以按照同样的模式快速扩展。**路由导航**是单页应用的骨架通道，统一使用 Vue Router 的 createWebHistory 模式和 router-link 组件，保证了用户在页面间的切换不需要重新加载页面，提升了用户体验。同时在路由守卫中增加 meta.title 动态设置页面标题，可以让用户在浏览器标签页一眼看到当前所在位置，这是小但实用的用户体验细节。

**公共布局**（AppLayout + AppHeader + AppNav）则是所有页面共享的"容器"，头部导航固定在顶部，导航菜单 active-class 自动高亮，让用户清晰地感知当前位置。公共布局把页面结构从"每个页面自己写导航"变为"所有页面共用一个容器"，后续要加搜索、加页脚、加主题切换等功能时，只需在公共布局中修改，所有页面同步更新，极大地降低了维护成本。

关于 AI 参与，我使用了 Trae IDE 的 AI Coding 工具辅助生成基础页面和路由配置。AI 在"生成结构"方面表现很好，能快速输出 8 个页面的基础结构，为节省了大量重复的模板代码。但 AI 的问题也很明显：它倾向于一次性输出过度封装的代码，包含登录鉴权、接口请求、第三方 UI 框架等 Day2 不需要的内容，我需要人工去识别、删除、修正。例如 AI 生成的 el-input、el-pagination、Element Plus 引入等内容全部人工替换为原生 HTML，路由路径 /home、/user-center 也被人工修正为符合清单要求。这正好对应 Day2 教学实训的核心目的：学习使用 AI 辅助，但不要被 AI"代劳"，人工审查与判断才是关键。

通过今日的工作，我深刻认识到页面骨架、路由导航、公共布局三者共同构成了项目的"基础设施"。基础设施一旦确定，后续业务功能就可以在上面有序发展；基础设施一旦不统一，后续每加一个页面都要重写一遍导航、一遍样式、一遍路由，维护成本会指数级上升。这也正是 Day2 为什么要在 Day1 项目初始化之后，优先完成这三项基础工作的教学逻辑。
