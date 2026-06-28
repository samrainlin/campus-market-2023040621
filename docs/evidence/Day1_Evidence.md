# Day 1 · 过程证据

> 日期：2026-06-27
> 作者：开发学生
> 所属阶段：环境配置 + 项目分析 + 规划


## 1. 今日完成内容

### 1.1 开发环境搭建

根据 `docs/guide/Environment_Setup.md` 的指引，我完成了以下步骤：

- Node.js 版本升级：将系统的 Node.js 从 v22.14.0 升级到 v25.9.0。起初直接下载安装包安装失败（错误码 1603），后以管理员权限重新安装才成功。同时更新了项目根目录的 `.nvmrc` 文件。
- pnpm 安装：通过 `npm install -g pnpm` 全局安装了 pnpm 11.x 版本，与 `package.json` 中声明的版本约束保持一致。
- 项目依赖安装：在项目目录执行 `pnpm install`，完成 331 个依赖包的安装。过程中有一些 tarball 下载速度较慢（低于 50KB/s），还有少量包因网络波动需要重试，但最终成功。
- 启动开发服务器：执行 `pnpm dev`，Vite 开发服务器在 3 秒左右启动成功，监听在 `http://localhost:5173/`。浏览器打开后页面能正常显示「项目启动成功」。

### 1.2 代码调整

- 更新了 `.nvmrc` 文件内容：从 `24.12.0` 更新为 `25.9.0`。
- 更新了 `package.json` 的 `engines` 字段，使其明确支持 Node 25.x 版本。

### 1.3 AI 协作体验（Task 4）

使用 Trae 完成了 4 个分析任务：

1. 让 AI 分析项目目录结构并解释各文件夹的作用。
2. 让 AI 逐行解释 `src/main.ts` 的启动流程。
3. 让 AI 分析 `src/router/index.ts` 的路由配置与 Vue Router 的作用。
4. 让 AI 梳理 `package.json` 与各配置文件，总结项目的完整技术栈。

以上对话已记录在 `docs/ai/AI_Collaboration_Card.md`。

### 1.4 项目规划（Task 5）

根据对项目的理解，完成了 `docs/plan/Project_Plan.md`，内容包括：

- 项目概述：确定校园轻集市的产品定位与技术方向。
- 页面清单：规划了 9 个页面（首页、登录、注册、商品详情、发布、购物车、订单、个人中心、404）。
- 功能模块：将系统划分为用户模块、商品模块、购物车模块、订单模块、通用导航与布局模块，共 5 个模块。
- 开发顺序：设计了 4 个阶段、共 18 个步骤的详细开发路线。
- 开发重点：记录了自己判断的技术重点、业务重点与需要特别小心的 5 个「坑」。


## 2. 学习收获

### 2.1 工程化工具的理解

- 第一次真正理解了 `pnpm` 与 `npm` 的区别。`pnpm` 使用硬链接和内容寻址，磁盘占用和安装速度都有优势，同时避免了「幽灵依赖」问题。
- 学会了用 `.nvmrc` 约束团队的 Node.js 版本，保证所有成员在相同运行环境下开发。
- 理解了 `package.json` 中 `engines` 字段的作用——虽然它不强制阻止安装，但能在版本不匹配时给出警告。
- `eslint.config.ts` 使用的是 ESLint 的 Flat Config（新格式），而非常规的 `.eslintrc.js`，这点与我以往项目不同，值得注意。

### 2.2 Vue 3 工程结构

- `main.ts` 的三件套（`createApp` → 注册 Router/Pinia → `mount`）比 Vue 2 的 `new Vue({...})` 更清晰。
- 路径别名 `@/xxx` 让 import 语句干净很多，避免了 `../../` 的「相对路径地狱」。
- `src/` 目录按 `views`、`components`、`stores`、`router`、`api` 划分，是「关注点分离」的标准做法。

### 2.3 TypeScript 的价值

- 虽然项目还没写业务代码，但通过阅读配置，我意识到 `tsconfig.json` + `@vue/tsconfig` 的组合能为 Vue 单文件组件提供完整的类型提示。
- `noUncheckedIndexedAccess` 选项让数组/对象通过下标访问时也要处理 `undefined`，虽然可能增加一些代码，但能避免运行时的「Cannot read properties of undefined」。

### 2.4 项目规划的重要性

- 通过写 Project_Plan.md，我发现如果不先规划好页面清单和路由表，直接开始写代码很容易出现「这个页面应该放哪」「这个状态应该放在哪个 Store」之类的反复返工。
- 先定义好 `Product`、`User`、`CartItem`、`Order` 四个核心类型，后续写页面、Store、API 时就有了统一的「语言」，不容易出现字段不一致的问题。


## 3. 遇到的问题

### 问题 1：Node.js 安装失败（错误 1603）

问题描述：
下载 `node-v25.9.0-x64.msi` 后双击静默安装，Windows Installer 返回错误码 1603，Node.js 没有被更新到 v25.9.0。

分析：
1603 通常是权限不足或被占用文件导致的。系统原有的 Node.js 正在被某些进程锁定（可能之前运行过的终端还在使用旧版），导致新版本无法写入安装目录。

解决：
- 先关闭所有可能正在使用 Node.js 的终端。
- 右键以管理员身份重新运行 MSI 安装包（在 PowerShell 中使用 `Start-Process ... -Verb RunAs -Wait`）。
- 安装完成后，在新终端执行 `node --version` 确认已升级到 v25.9.0。

### 问题 2：pnpm install 网络波动导致部分包下载失败

问题描述：
执行 `pnpm install` 时，控制台反复输出 `[WARN] GET ... error (ECONNRESET). Will retry in 10 seconds.`，安装过程持续近 4 分钟。

分析：
默认使用的 `registry.npmjs.org` 服务器不稳定，对国内网络不够友好。虽然最终重试成功，但如果配置国内镜像源（如 `https://registry.npmmirror.com`）可以明显提升速度。

解决：
- 本次先等自动重试完成。
- 后续计划通过 `pnpm config set registry https://registry.npmmirror.com` 配置国内镜像源。

### 问题 3：启动开发服务器后旧终端仍显示旧的 Node 版本

**问题描述：
Node.js 升级成功后，在同一个终端再次执行 `node --version`，有时仍显示旧版本 v22.14.0。

分析：是终端缓存了环境变量。Windows 的 PATH 环境变量在终端启动时加载，后续系统级别的修改不会立即反映到已开启的终端。

解决：
- 关闭旧终端，开一个全新的终端重新验证。
- 或在当前终端刷新环境变量。

### 问题 4：对 ESLint 新格式（eslint.config.ts）不太熟悉

**问题描述**：
项目根目录使用的是 `eslint.config.ts`（Flat Config），而不是我之前熟悉的 `.eslintrc.js`。需要花时间了解两者的差异。

**解决**：
- 通过阅读项目中已有的 `eslint.config.ts` 以及 ESLint 官方文档，学习 Flat Config 的写法。
- 先保持项目现有配置不动，等后续写代码时再通过 `pnpm lint` 逐步理解规则。

---

## 4. AI 协作情况

### 4.1 使用的 AI 工具

- **Trae**（主要工具）

### 4.2 如何使用

| Prompt 内容 | AI 的回答质量 | 是否采纳 |
|:-----------|:------------|:--------|
| 分析项目目录结构 | 结构清晰、分类合理 | ✅ 采纳 |
| 逐行解释 main.ts | 准确、流程清晰 | ✅ 采纳 |
| 分析 router 与 Vue Router 的作用 | 概念准确、指明了扩展方向 | ✅ 采纳 |
| 梳理完整技术栈 | 分类完整、各技术作用解释清楚 | ✅ 采纳 |

### 4.3 我对 AI 回答的二次加工

- AI 回答的目录结构描述非常好，但我需要根据实际项目情况补充「是否已有对应文件夹」的判断（例如 `components/` 已有但为空，`api/` 已有但为空，`stores/` 已有但为空），以便在规划后续开发时明确哪些目录需要新建文件。
- AI 对 Vue Router 的解释已经比较完整，但我额外补充了「路由懒加载」这一要点，因为这是优化首屏性能的关键手段。
- AI 列出的技术栈中把「pnpm」「Vite」「ESLint + Oxlint」等工具都介绍了一遍，我在自己的理解部分整理了一张对比表，帮助自己快速回忆各工具的定位。

### 4.4 AI 协作的心得

- **不要把 AI 当作「答案生成器」**：它给出的目录结构分析、技术栈总结等内容，需要我用自己的判断二次加工后才真正有价值。直接复制粘贴意义不大。
- **好的 Prompt 是关键**：提出具体的问题（如「逐行解释 main.ts」）比模糊的问题（如「帮我看看这个项目」）能获得更有用的回答。
- **AI 协作记录本身就是学习过程**：填写 AI_Collaboration_Card.md 的过程让我不得不再次梳理思路，对项目的理解比只看一遍 AI 回答更深刻。

---

## 5. 后续计划

### 5.1 短期计划（下一次开发 2-3 小时）

1. **完成路由表**：在 `src/router/index.ts` 中注册 `/login`、`/register`、`/product/:id`、`/publish`、`/cart`、`/orders`、`/profile`、`/404` 等 8 个路由，全部使用路由懒加载。
2. **创建空页面占位**：为上述 8 个路由创建对应的 View 文件（至少能正常渲染，有标题和返回按钮即可）。
3. **定义核心类型**：新建 `src/types/index.ts`，定义 `Product`、`User`、`CartItem`、`Order`、`Category` 等 interface。
4. **编写 mock 数据**：新建 `src/mock/` 目录，提供 10+ 条商品、2 个用户的示例数据，方便后续页面联调。

### 5.2 中期计划（按 Project_Plan.md 的 Phase 2 推进）

1. **完成登录与注册页面**（`LoginView.vue`、`RegisterView.vue`），并在 `userStore` 中管理登录态。
2. **完成发布商品页面**（`PublishView.vue`），包括表单校验与数据提交。
3. **完善首页**（`HomeView.vue`）：商品列表、分类筛选、关键词搜索。
4. **完成商品详情页**（`ProductDetailView.vue`）：从路由参数读取商品 ID，展示商品信息。

### 5.3 长期计划（按 Project_Plan.md 的 Phase 3 & 4 推进）

1. **购物车页面** + `cartStore`
2. **订单页面** + `orderStore`
3. **个人中心页面**
4. **路由守卫**：购物车、订单、发布页登录拦截
5. **全局样式统一**与响应式适配
6. **最终验证**：`pnpm lint` + `pnpm type-check` + 手工主流程测试

### 5.4 还需要补充的知识

- **Pinia 的使用**：虽然项目已引入 Pinia，但我还需要深入学习 store 的 `state` / `getters` / `actions` 的标准写法，尤其是异步 action 的处理方式。
- **Vue Router 导航守卫**：需要理解 `beforeEach`、`beforeResolve`、`afterEach` 的差异，设计合理的登录拦截逻辑。
- **表单校验**：发布商品和登录注册都需要校验，需要研究一种轻量的校验方式（不引入额外库的情况下）。

---

## 6. 今日小结

- **环境搭建**：完成了 Node.js 25.9.0 的安装、pnpm 的配置、项目依赖的安装，开发服务器能正常启动。✅
- **项目分析**：通过 AI 协作的方式，系统地理解了项目结构、入口文件、路由机制与技术栈。✅
- **项目规划**：完成了详细的 Project_Plan.md，包括页面清单、功能模块、开发顺序与重点判断。✅
- **过程证据**：这份 Day1_Evidence.md 就是对上述过程的真实记录。✅
