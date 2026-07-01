# Day5 Evidence - 状态管理与用户中心

## 1. 今日完成内容

今天主要学了怎么用 Pinia 管理状态。之前 Day2-Day4 的数据都是写在页面组件内部的，比如发布页面的 publisher 是硬编码成"当前用户"的。Day5 的任务就是把这些需要在多个页面共享的信息放到 Store 里。

具体做了以下几件事：
- 在 src/stores 下面创建了 user.ts，用来存当前登录用户的信息，比如用户名、学院、年级这些
- 创建了 favorite.ts，用来存用户收藏的东西，包括收藏、取消收藏和判断有没有收藏的功能
- 修改了个人中心页面，让用户信息和收藏列表从 Store 里面读取，而不是写死
- 在四个业务页面（二手交易、失物招领、拼单搭子、跑腿委托）的商品卡片下面都加了收藏按钮
- 把发布页面的 publisher 从固定字符串改成了从 userStore 取用户名

最后运行 npm run build 确认编译通过，没有报错。

## 2. Store 设计说明

| Store 文件 | 管理内容 | 主要状态 | 主要方法 |
|---|---|---|---|
| src/stores/user.ts | 当前登录用户的信息 | username、college、grade、avatar、isLoggedIn | setUser、logout、computed 的 displayName、profileText |
| src/stores/favorite.ts | 用户的收藏列表 | favorites（数组，每个元素包含 id、type、title、description、location） | addFavorite、removeFavorite、toggleFavorite、isFavorite |

两个 Store 都是用 Pinia 的 Composition API 写法（用 `ref` 和 `computed`），这一点是我按照 Day5 教程推荐的写法做的，因为官方文档说 Composition API 更轻量一些。

## 3. 状态边界说明

这是今天最关键的思考点，我需要判断"什么数据该放入 Store，什么不该放"。

**放入 Store 的数据**：
- 当前用户信息（username、college、grade 等）：因为顶部导航栏要显示用户名、发布页面要把 publisher 写成当前用户、个人中心要展示用户资料——这三个地方都需要同样的数据，所以必须放入 Store
- 收藏列表（favorites）：因为用户在列表页点的收藏要在个人中心里看到，而且收藏按钮要显示"已收藏"状态，这些状态需要在页面跳转后还保留，所以必须放入 Store

**不放入 Store 的数据**：
- 发布页面的表单字段（标题、描述、价格等）：这些只在发布页面内部用，表单提交完就用完了，不需要在其他页面共享，所以放在组件的 reactive 里就行，放 Store 反而多此一举
- 各列表页的数据（trades、lostFounds 等）：这些是从后端接口取的，刷新页面可以重新请求。如果当前页面显示的列表只是当前页面用，就不用放 Store。当然如果以后要做"我的发布"实时同步，可以再考虑
- 消息中心的消息列表：Day5 阶段只是静态展示，目前不需要跨页面共享，所以写在组件内部的 ref 就够了
- 分页信息、搜索关键词：这些只在当前页面有意义，换页面就不需要了

我理解的"边界原则"是：多个组件/页面都要用的数据才放 Store，单页面用的就放组件内部。

## 4. 页面使用记录

Store 在以下地方被用到：

- AppHeader.vue：读取 userStore 的 displayName 和 avatar，在导航栏右侧显示"用户名+头像"
- PublishView.vue：提交数据时，publisher 字段从 `userStore.displayName` 取，不再是写死的"当前用户"
- TradeView.vue：循环列表时，每个卡片的收藏按钮调用 `favoriteStore.toggleFavorite`，按钮文字根据 `favoriteStore.isFavorite('trade', item.id)` 判断
- LostFoundView.vue：和 TradeView 类似，只是 type 传 'lostFound'，另外因为失物招领用的是 contact 字段做发布者
- GroupBuyView.vue：type 传 'groupBuy'，收藏逻辑和上面一样
- ErrandView.vue：type 传 'errand'，发布者是 pickupLocation 对应的业务
- UserCenterView.vue：同时用到两个 Store，用户资料从 userStore 取，收藏列表从 favoriteStore 取，点击取消收藏时 removeFavorite

## 5. AI 协作记录

- **使用的 AI 工具**：我看了 Day5 的推荐提示词，然后自己写了一份更简单的描述发给 AI 工具。我没有直接抄官方给的提示词，而是改成更口语化的表达，因为我觉得把需求想清楚再写更重要
- **核心提示词内容**：我告诉 AI 我的项目是 Vue3 + Vite + TypeScript，已经完成了路由、Mock 数据和发布功能，现在需要用 Pinia 做用户信息和收藏的状态管理，要求不做真实登录，代码要简洁适合教学
- **AI 生成的内容**：
  - 帮我生成了 `defineStore` 的基本骨架
  - 生成了收藏数据结构的 interface（FavoriteItem），以及 addFavorite、removeFavorite、toggleFavorite、isFavorite 四个函数
  - 给了一个很完整的用户中心页面草稿，包含头像、昵称、学院等展示样式
  - 给了收藏按钮的 HTML 片段
- **AI 生成内容的不合理之处**：
  - AI 给的用户 Store 太复杂了，带了登录/注册的 API 调用、JWT token 处理、持久化到 localStorage，这些 Day5 根本不需要，我全删了，只保留了用户名、学院、年级这些基本信息
  - AI 生成的收藏 Store 里还加了一个"收藏同步到后端"的逻辑，用 Axios POST 请求发到服务器，这也是 Day5 不需要的，我改成了只在前端内存里维护
  - 个人中心页面 AI 生成的代码里还加了很多 v-if、v-else 的权限判断逻辑，看起来很"高大上"但和当前阶段不匹配
  - AI 生成的收藏按钮样式用了 Tailwind CSS 的 class，但我的项目里没装 Tailwind，全部换成了普通的 CSS

## 6. 人工调整内容

根据 AI 生成的内容，我做了以下调整：

- **拆分 Store**：AI 一开始把用户和收藏都放在一个 Store 里，后来我自己又把它们分开，按照 Day5 的要求分成 user.ts 和 favorite.ts 两个文件，这样职责更清晰
- **简化用户 Store**：删除了 token、登录接口调用、持久化、权限校验等 AI 加的代码，最后只保留了 username、college、grade、avatar、isLoggedIn 等基本信息，方法只有 setUser 和 logout
- **收藏逻辑改成纯前端**：AI 生成的收藏 Store 里有 axios 请求，我全部移除，只保留对 favorites 数组的增删查操作。这样刷新页面数据会丢失，但 Day5 阶段是可以接受的
- **修正了 favoriteItem 的 type 字段**：AI 建议用数字 1/2/3/4，但我的业务数据是字符串标识，所以改成了 'trade'、'lostFound'、'groupBuy'、'errand' 四个枚举值
- **循环时判断发布者字段**：在写"我的发布"的时候，我发现四种数据结构不一样。二手交易、拼单搭子、跑腿委托都是 publisher 字段，但失物招领用的是 contact 字段（这是之前 Day3 设计数据时遗留的问题），只能在循环里分别判断
- **添加了非空判断**：在列表页收藏按钮的模板里，一开始直接写 `favoriteStore.isFavorite('trade', item.id)`，但 item.id 在 TypeScript 里可能是 undefined，我加了一层 `item.id &&` 的判断，避免类型报错
- **按钮交互优化**：每个业务页面的收藏按钮我给了不同的主题颜色（蓝色、红色、橙色、绿色），这样视觉上更容易区分不同业务

## 7. 测试记录

**真实测试步骤**：

1. 启动 Mock 服务和前端项目（npm run dev 和 json-server 两个终端）
2. 打开首页，确认顶部导航栏能正确显示当前用户的用户名和头像图片
3. 进入"二手交易"页面，在任意一条商品卡片下方点"收藏"按钮
4. 观察按钮文字立刻从"收藏"变成了"已收藏"，按钮背景色从白色变成了蓝色
5. 再点一次这个按钮，确认能取消收藏，按钮文字变回"收藏"
6. 重新收藏一条，然后继续在失物招领、拼单搭子、跑腿委托三个页面分别收藏一条
7. 进入"个人中心"页面，滚动到"我的收藏"区域，确认四个页面收藏的内容都显示在那里，每条都有对应的类型标签（二手交易、失物招领等）
8. 在个人中心收藏列表中点击"取消收藏"按钮，确认点击后那条记录会从列表中消失
9. 回到"发布信息"页面，填写一条二手商品信息并发布，不手动写发布人
10. 在个人中心的"我的发布"部分，确认刚刚发布的那条信息显示在列表里，并且发布人显示为当前用户的用户名

**测试过程中发现的小问题**：
- 一开始"我的发布"列表是空的，后来发现是因为我在测试时用的发布人是"当前用户"这个固定字符串，而 userStore 里的 username 默认是"校园用户"，所以匹配不上。解决方法是在 PublishView.vue 改成 `userStore.displayName`，然后重新发布一条就正常了

## 8. 遇到的问题与解决方法

**问题 1：Pinia 没有挂载，页面报错 "useUserStore is not defined"**

- 现象：在 AppHeader.vue 中写 `const userStore = useUserStore()` 后保存，浏览器控制台报错
- 原因：一开始忘了在 main.ts 里加上 `app.use(createPinia())`，虽然我看了 Day2 的代码，但是当时 Day2 的时候只保留了 Pinia 的安装占位，没实际写
- 解决：在 main.ts 的 `app.use(router)` 之前加上 `app.use(createPinia())`，重新运行 dev 服务就正常了

**问题 2：favoriteStore 的 type 字段与数据不匹配**

- 现象：在列表页点击收藏后，个人中心能看到记录，但点击"取消收藏"没有反应
- 原因：收藏时 type 传的是字符串 'trade'，但在 isFavorite 方法里判断用的是数字类型的比较，所以 `item.type === type` 永远是 false
- 解决：统一把 type 都改成字符串字面量类型，并且在 favorite.ts 的 FavoriteItem interface 里把 type 定义为 `'trade' | 'lostFound' | 'groupBuy' | 'errand'`

**问题 3：TypeScript 报错 "id | undefined 不能赋值给 number"**

- 现象：在 UserCenterView.vue 的 myPublished computed 里面，给 PublishedItem 的 id 字段赋值 `item.id || Date.now() + Math.random()` 时，TS 报错说 item.id 可能是 undefined（因为接口定义里 id 是可选字段）
- 解决：给 id 加上 `||` 默认值处理，但因为 Math.random() 返回的是数字，TS 已经能推断了。后来还在模板层加了 `item.id &&` 的防御性判断，确保模板里调用 favoriteStore 方法时传的 id 一定是 number

**问题 4：刷新页面后收藏数据就没了**

- 现象：这不是 bug，但一开始我以为是代码有问题
- 理解：看了 Day5 的说明才明白，收藏现在是纯前端内存状态，没有做 localStorage 持久化，刷新页面后 Store 会重新初始化。按照实训要求，Day5 阶段是可以接受的
- 后续方案：如果以后要优化，可以用 `watch` 监听 favorites 变化，写入 localStorage，或者调用后端接口保存

## 9. 今日反思

通过今天学习 Pinia 状态管理，我最大的收获是理解了"状态"和"组件数据"的区别。之前做项目时，所有数据都写在页面组件内部，比如把发布人写成固定字符串，用户信息硬编码在 header 组件里，这在单页面是可以的，但当多个页面需要共享同一份信息时，就会出现数据不一致和重复维护的问题。

Pinia 让我明白了，应该把"跨页面共享的数据"抽出来放到 Store 里，组件只负责读取和展示，不负责持有和修改这份共享数据。这样做的好处是，当用户信息或收藏状态发生变化时，所有使用了这个 Store 的组件都会自动更新——比如我在列表页点了收藏，个人中心立刻能看到，不需要手动刷新或者传数据。

但同时我也意识到，不能什么东西都往 Store 里塞。比如发布页面的表单校验错误、搜索关键词、临时选中的发布类型，这些只属于当前页面，放 Store 只会增加复杂度。状态管理的核心不是"怎么用 Pinia"，而是"哪些数据需要共享，哪些不需要"。

用户中心的实现也让我对多页面应用有了更深的理解。一个看起来简单的个人中心页面，实际上用到了 userStore 和 favoriteStore 两个 Store，还需要请求四类业务数据来展示"我的发布"。这背后涉及数据结构的统一、字段的映射处理、TypeScript 类型安全等多个层面的问题。如果没有 Pinia，这些分散在不同页面的数据会很难管理。
