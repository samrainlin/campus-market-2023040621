# Day3 Evidence - Mock 数据建模与列表渲染

## 1. 今日完成内容

Day3 的核心任务是让项目具备"数据驱动"的能力：从前端页面写死数据，转变为通过 HTTP 请求获取 Mock 数据并进行列表渲染。今日完成的工作包括：

1. **设计 Mock 数据**：在项目根目录创建 `db.json`，围绕"校园轻集市"业务场景设计四类数据集合——二手交易（trades）、失物招领（lostFounds）、拼单搭子（groupBuys）、跑腿委托（errands），每类数据不少于 6 条，内容全部贴近学生日常生活（教材、快递、咖啡拼单、校园一卡通等）。
2. **配置 JSON Server 启动命令**：在 `package.json` 的 `scripts` 中新增 `"mock": "json-server db.json --port 3001"`，确保启动后可以通过 `http://localhost:3001/trades` 等接口访问数据。
3. **封装 Axios 请求实例**：在 `src/api/http.ts` 中创建 Axios 实例，配置 `baseURL` 为 `http://localhost:3001`，`timeout` 为 5000ms。此处保持极简——不添加请求拦截器、响应拦截器、错误统一处理等后续阶段才需要的功能。
4. **创建业务 API 模块**：在 `src/api/` 目录下分别创建 `trade.ts`、`lostFound.ts`、`groupBuy.ts`、`errand.ts`，每个文件导出对应数据类型的 TypeScript 接口和 `getTrades()`、`getLostFounds()`、`getGroupBuys()`、`getErrands()` 请求方法。
5. **创建可复用组件**：在 `src/components/` 中创建 `ItemCard.vue`（通用卡片容器，含标题、标签、描述、元信息、底部插槽）和 `EmptyState.vue`（空状态提示组件）。
6. **完成页面数据渲染**：修改 `src/views/` 中 `TradeView.vue`、`LostFoundView.vue`、`GroupBuyView.vue`、`ErrandView.vue` 四个核心页面，在 `onMounted` 中调用对应 API，把数据渲染为卡片列表，并在数据为空时展示 `EmptyState`。

---

## 2. Mock 数据结构说明

| 数据集合 | 对应业务 | 主要字段 | 页面用途 |
| :--- | :--- | :--- | :--- |
| trades | 二手交易 | id、title、price、category、condition、publisher、publishTime、location、image、status | 展示学生发布的闲置/二手商品列表 |
| lostFounds | 失物招领 | id、title、type、itemName、location、time、contact、description、status | 区分"寻物启事"和"失物招领"两类信息列表 |
| groupBuys | 拼单搭子 | id、title、type、targetCount、currentCount、deadline、location、publisher、status、description | 展示拼单进度，支持"还差X人"可视化 |
| errands | 跑腿委托 | id、title、taskType、reward、pickupLocation、deliveryLocation、deadline、publisher、status、description | 展示从起点到终点的代取/代送任务 |

---

## 3. 我的设计

在确定字段时，我是从"页面需要展示什么"倒推"数据需要包含什么"来设计的：

- **为什么二手交易（trades）需要 `price` 和 `condition`**：二手交易的核心决策要素是"多少钱"和"几成新"。价格是买家最关心的信息，直接决定交易意愿；成色则帮助卖家说明商品使用状况（九成新/八成新/全新），降低沟通成本。
- **为什么失物招领（lostFounds）需要 `type` 字段**：同一条信息既可以是"我丢了东西在找"（寻物），也可以是"我拾到物品待认领"（招领），二者在同一页面并列展示时必须通过 `type` 来区分，否则用户无法快速识别信息性质。我将 `type` 的值设计为中文"寻物/招领"，而不是英文 `lost/found`，因为直接用中文更贴近阅读场景，后续在代码中也统一映射为中文。
- **为什么拼单搭子（groupBuys）需要 `targetCount` 和 `currentCount`**：拼单业务的核心是"还差几人成团"。只有 `targetCount`（目标人数）没有 `currentCount`（当前人数），拼单进度无法表达；反之亦然。两者结合可以在页面上渲染进度条或"还差 X 人"的文案，提升信息可读性。
- **为什么跑腿委托（errands）需要 `pickupLocation`、`deliveryLocation` 和 `reward`**：跑腿任务的本质是"从 A 点送到 B 点，给多少酬劳"。起终点是任务的空间约束，没有它们就无法判断是否顺路接取；`reward` 则是价格激励，是跑腿行为的核心驱动力。字段名我选择使用语义更完整的 `pickupLocation/deliveryLocation`，而不是简写 `from/to`，因为在真实代码协作中，明确的字段名能大幅降低沟通成本。

---

## 4. AI 设计

本项目的 Day3 使用了 AI Coding 工具辅助开发，AI 在以下方面提供了帮助：

1. **生成 `db.json` 的结构骨架**：AI 根据"二手、失物、拼单、跑腿"四类业务提示词，快速产出每类数据的基础字段列表和若干条示例数据。相比我手动从零设计，这至少节省了 30 分钟。
2. **生成 Axios 实例代码**：AI 能快速写出 `axios.create({ baseURL, timeout })` 的基础模板，并提醒 `baseURL` 要与 `json-server` 的端口一致。
3. **生成业务 API 模块**：对每类业务，AI 按"interface + getXxx()"的模式批量生成 `trade.ts`、`lostFound.ts` 等文件骨架，我只需核对字段名是否与 `db.json` 一致。
4. **生成 `ItemCard.vue` 和 `EmptyState.vue` 组件**：AI 对通用组件的基本结构（插槽、props、样式）有较稳定的生成能力。
5. **生成页面列表代码**：AI 能给出 Vue3 `<script setup>` + `onMounted` + `v-for` 的标准模式代码，作为页面改造的起点非常合适。

**但 AI 的输出也存在明显的不合理之处，必须人工审查**：

- **字段名不一致**：AI 在 `errands` 中使用的是 `from/to`，而我在 `db.json` 中实际写的是 `pickupLocation/deliveryLocation`。如果直接照抄 AI 代码，页面不会报错但起终点会显示为空。这是我本次最关键的人工审查点。
- **类型值不一致**：AI 建议在 `lostFounds` 中使用 `type: 'lost' | 'found'`（英文枚举），而我在 `db.json` 中实际使用的是中文 `"寻物"/"招领"`。如果不统一，筛选按钮虽然能渲染但不会过滤出任何结果。
- **数据内容偶尔脱离校园场景**：AI 最初为 trades 生成过"iPhone 15 Pro Max 9999元"这类不贴合学生实际消费的数据，我需要手动替换为"《线性代数》同济第六版"、"小米充电宝"等更贴近校园的内容。
- **过度设计 API 层**：AI 有自动加入"Token 拦截器、错误码处理、错误 toast 提示、自定义 Promise 封装"等倾向，而 Day3 阶段完全不需要，我必须人工删除这些冗余代码。

---

## 5.1 证据材料检查（Day3 阶段）

> 在 Day7 综合验收时回头检查 Day3 的证据材料。

**代码层面的检查：**

| 检查项 | 预期 | 实际结果 |
|-------|------|---------|
| db.json 存在 | 项目根目录应有 db.json | ✅ 存在 |
| db.json 包含四类业务数据 | 应有 trades、lostFounds、groupBuys、errands 四个数组 | ✅ 四类数据均存在，每类不少于 5 条 |
| Axios 封装存在 | src/api/http.ts 应有 axios.create 配置 baseURL 和 timeout | ✅ 存在，baseURL 指向 http://localhost:3001 |
| 业务 API 模块存在 | src/api/ 下应有 trade.ts、lostFound.ts、groupBuy.ts、errand.ts | ✅ 全部存在 |
| 可复用组件存在 | src/components/ 下应有 ItemCard.vue、EmptyState.vue | ✅ 存在 |
| 四个列表页能请求数据 | TradeView、LostFoundView、GroupBuyView、ErrandView 的 onMounted 中调用了对应 API | ✅ 全部实现 |
| JSON Server 启动正常 | 执行 `npm run mock` 后应能在 http://localhost:3001 访问数据 | ✅ 正常 |

**文档层面的检查：**

| 检查项 | 预期 | 实际结果 |
|-------|------|---------|
| Day3_Evidence.md 存在 | docs/evidence/Day3_Evidence.md | ✅ 存在 |
| AI_Collaboration_Card.md 更新 | docs/ai/AI_Collaboration_Card.md 有 Day3 的 AI 协作记录 | ✅ 有记录 |

---

## 5.2 阶段性功能清单（Day3 阶段）

> Day3 阶段的核心任务是"Mock 数据建模与列表渲染"。

| 功能模块 | 完成情况 | 说明 |
|---------|---------|------|
| db.json 二手交易数据（trades） | ✅ | 包含 title、price、category、condition、publisher、publishTime、location、image、status 等字段 |
| db.json 失物招领数据（lostFounds） | ✅ | 包含 title、type（寻物/招领）、itemName、location、time、contact、description、status |
| db.json 拼单搭子数据（groupBuys） | ✅ | 包含 title、type、targetCount、currentCount、deadline、location、publisher、description、status |
| db.json 跑腿委托数据（errands） | ✅ | 包含 title、taskType、reward、pickupLocation、deliveryLocation、deadline、publisher、description、status |
| Axios 实例封装（http.ts） | ✅ | baseURL=http://localhost:3001，timeout=5000 |
| 二手交易 API（trade.ts） | ✅ | 定义 TradeItem interface，实现 getTrades() 方法 |
| 失物招领 API（lostFound.ts） | ✅ | 定义 LostFoundItem interface，实现 getLostFounds() 方法 |
| 拼单搭子 API（groupBuy.ts） | ✅ | 定义 GroupBuyItem interface，实现 getGroupBuys() 方法 |
| 跑腿委托 API（errand.ts） | ✅ | 定义 ErrandItem interface，实现 getErrands() 方法 |
| 通用卡片组件（ItemCard.vue） | ✅ | 可复用，展示标题、描述、发布信息等 |
| 空状态组件（EmptyState.vue） | ✅ | 列表为空或 JSON Server 未启动时展示 |
| 二手交易列表页数据渲染 | ✅ | onMounted 调 getTrades()，v-for 渲染卡片列表 |
| 失物招领列表页数据渲染 | ✅ | onMounted 调 getLostFounds() |
| 拼单搭子列表页数据渲染 | ✅ | onMounted 调 getGroupBuys() |
| 跑腿委托列表页数据渲染 | ✅ | onMounted 调 getErrands() |
| 数据字段名一致性检查 | ✅ | 以 db.json 为准，API 接口字段、页面模板字段均对齐 |

**Day3 阶段没有实现的功能：**
- 没有实现发布表单和数据新增（Day4 才做）
- 没有实现用户状态管理和 Pinia（Day5 才做）
- 没有实现搜索、收藏、分页等交互功能
- 没有实现真实后端接口

---

## 6. 最终调整

基于 AI 生成内容和自己的判断，我做了以下主要调整：

1. **字段名统一以 db.json 为准**：把 `src/api/errand.ts` 中 `ErrandItem` 接口的 `from/to` 字段更名为 `pickupLocation/deliveryLocation`，同时同步修改 `ErrandView.vue` 中 `item.from`、`item.to` 的引用。保证"数据源 → API 类型 → 页面模板"三处字段名一致。
2. **把失物类型值从英文改为中文**：将 `LostFoundView.vue` 中的 `typeLabel/typeBadgeColor/typeOptions` 三个函数的判断值从英文 `'lost'/'found'` 改为中文 `'寻物'/'招领'`，与 `db.json` 中实际值对齐。
3. **补充 `description?` 可选字段**：在 `groupBuys` 和 `errands` 的接口定义中补充 `description?: string`，方便卡片中展示任务详情。由于是可选字段，不会对已有数据产生破坏性影响。
4. **删除 AI 建议的拦截器和错误码逻辑**：`http.ts` 保持极简，只包含 `axios.create` 基础配置，不做任何鉴权和错误处理。这些能力会在后续 Day5+ 阶段根据后端实际情况逐步加入。
5. **清理页面中的硬编码 mock 数据**：AI 生成的页面中有时会保留 `const itemList: Item[] = [...]` 的本地数据数组。我将这些本地数据全部删除，统一改为在 `onMounted` 中调用 `getTrades/getLostFounds/getGroupBuys/getErrands`，确保页面完全由 Mock 数据驱动。
6. **补充 `EmptyState` 空状态兜底**：在四个业务页面的列表前加入 `EmptyState`，当 `filteredList.length === 0` 时展示"暂无信息"。这样即使 JSON Server 未启动或返回空数组，用户也能得到友好反馈，而不是看到一片空白。

---

## 6. 遇到的问题与解决方法

**问题：字段名不一致导致页面关键信息显示为空**

在首次启动 `npm run dev` + `npm run mock` 后发现一个明显问题：`ErrandView.vue` 的"起点/终点"两栏在浏览器中全部显示为空，但浏览器控制台没有任何报错。排查过程如下：

1. 先打开 DevTools Network 面板，确认 `/errands` 返回的 JSON 是否正常——确认返回正常，字段为 `pickupLocation` 和 `deliveryLocation`。
2. 打开 `src/api/errand.ts` 查看 `ErrandItem` 接口定义——发现接口写的是 `from` 和 `to`，与 JSON 字段不一致。
3. 由于 TypeScript 在编译时只是做类型检查，而运行时 Axios 返回的是实际 JSON 对象，`item.from` 这种访问在 TS 眼中"看起来没问题"，但运行时实际属性名是另一个，所以结果就是 `undefined` 却没有报错。
4. **解决方法**：以 `db.json` 为权威来源，把 API 接口和页面中引用的字段名全部改为 `pickupLocation/deliveryLocation`。同时对 `lostFounds` 的 `type` 字段进行同样的核对。
5. **事后反思**：数据驱动项目中"字段名"和"字段值的内容"是最脆弱也是最常见的 bug 来源。后续应该在 API 层加入 `Zod` 或类似的运行时校验工具，在开发阶段就让字段不一致问题抛出显式错误。

**辅助说明**：在 Windows 下启动 Mock 服务使用的是 PowerShell。直接执行 `npm run mock` 即可（json-server 需要先 `npm i -D json-server`，本项目已安装）。

---

## 7. 今日反思

今天的工作让我意识到，Mock 数据建模、JSON Server 提供的接口、以及页面上的列表渲染这三件事，其实定义了整个项目后续开发的"骨架"。一旦 Mock 数据的字段确定下来，API 层、组件 props、页面样式都必须围绕这些字段来设计；同样地，列表渲染把"数据 → 界面"的通路打通后，后续增加筛选、搜索、分页、详情页、发布页等功能，本质上只是在同一套通路上扩展。换句话说，Day3 完成后，项目已经从"静态 HTML/CSS 骨架"升级为"具有真实数据流动的动态前端工程"，这对后续联调真实后端非常关键——到时只需把 `baseURL` 从 `localhost:3001` 切换到真实后端地址，并将 JSON Server 返回的字段结构与后端字段做一次对齐即可。此外，这次人工审查 AI 生成代码的过程也让我对"AI 是辅助工具"有了更具体的体会：AI 在产出结构和填充重复性代码方面非常高效，但它生成的字段名、字段值、甚至业务逻辑并不天然与具体项目一致，必须由开发者以"数据源为权威"做最后把关。
