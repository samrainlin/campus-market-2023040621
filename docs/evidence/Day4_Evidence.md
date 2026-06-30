# Day4 Evidence - 发布表单与数据新增

## 1. 今日完成内容

Day4 的目标是为"校园轻集市"打通**写入数据**这一关键链路：让用户可以通过界面表单发布二手商品、失物招领、拼单搭子、跑腿委托四类信息，并把发布内容真正写入 `db.json`，从而在列表页中实时看到新增数据。

具体完成工作：

1. **补充业务 API 模块**：分别在 `src/api/trade.ts`、`lostFound.ts`、`groupBuy.ts`、`errand.ts` 中新增 `createXxx()` 方法，统一通过 Axios 向 `http://localhost:3001/xxx` 发送 `POST` 请求，请求体字段与 `db.json` 中已有数据保持一一对应，包括 `publisher`、`publishTime`、`status` 等服务端字段。
2. **封装通用表单项组件**：在 `src/components/FormField.vue` 中实现一个最小化的通用表单项组件，支持 `label`、`required` 必填标识、`slot` 自定义控制内容、`error` 错误提示，避免在页面中重复写同样的 label/错误文本布局。
3. **实现发布表单**：在 `src/views/PublishView.vue` 中实现完整的发布页面，包含发布类型下拉选择、通用字段、按类型切换显示的专属字段、基础表单校验、提交状态管理、成功跳转、失败提示等。
4. **补充表单校验逻辑**：按四类业务分别实现必填校验和数字格式校验，价格必须大于 0、拼单目标人数不少于 2、酬劳不能为负数。校验失败时在对应字段下方显示中文错误提示，同时阻止提交。
5. **补充表单重置**：提供手动"重置"按钮，并在切换发布类型时自动清空表单数据和错误信息，避免不同业务类型的字段互相污染。
6. **补充交互反馈**：成功提交后弹出 alert 提示并自动跳转到对应列表页；失败时给出明确提示，告知学生检查 Mock 服务是否正常运行；提交期间按钮禁用并显示"提交中..."，防止重复提交。

---

## 2. 发布类型与字段设计

发布表单采用"通用字段 + 类型专属字段"的混合设计：标题、地点、描述三类字段在所有业务中通用，直接放在表单顶部；商品分类/价格、物品名称/时间、目标人数/截止时间、起终点/酬劳等字段按发布类型切换显示。

| 发布类型 | 对应数据集合 | 关键字段 | 设计理由 |
| :--- | :--- | :--- | :--- |
| 二手交易 | trades | title、category、price、condition、location、description、publisher、publishTime、image、status | 二手交易的核心信息是"我在卖什么（title + category）、卖多少钱（price）、新旧程度如何（condition）、在哪里交易（location）"。这 5 个字段构成判断是否值得联系的基础；description 用于补充商品细节；publisher/publishTime/status/image 由前端统一填充，避免用户输入不一致。 |
| 失物招领 | lostFounds | title、type、itemName、location、time、contact、description、status | 失物招领与其他业务最大的区别在于它需要区分"我丢了东西在找（寻物）"和"我捡到了东西在还给谁（招领）"，因此必须有 `type` 字段。`itemName` 描述物品本身；`time` 记录事件发生时间；`contact` 用于他人联系发布人；`status` 标记是否已解决。 |
| 拼单搭子 | groupBuys | title、type、targetCount、currentCount、deadline、location、publisher、description、status | 拼单/搭子的核心决策因素是"还差几个人就能成团"，因此 `targetCount`（目标人数）和 `currentCount`（当前已报名）是核心字段。`deadline` 表示拼单截止时间，`type` 表示是咖啡、餐拼、资料还是运动搭子。`publisher` 记录发起人。 |
| 跑腿委托 | errands | title、taskType、reward、pickupLocation、deliveryLocation、deadline、publisher、description、status | 跑腿委托本质是"请别人帮忙在 A 点取东西，送到 B 点，最多等到 C 时间，给 D 元酬劳"。因此 `pickupLocation`（取件地点）、`deliveryLocation`（送达地点）、`deadline`（截止时间）、`reward`（酬劳）四个字段缺一不可；`taskType` 用来描述任务类型（如取快递、带饭、代打印等）。 |

字段命名遵循的原则是：**以 `db.json` 中已存在的字段名为权威参考**，表单字段和 API 请求体字段都与之严格对齐，避免出现 `from/to` vs `pickupLocation/deliveryLocation` 这种写法不一致的 bug。

---

## 3. 表单校验规则

提交前做以下基础校验，避免脏数据写入 JSON Server：

1. **通用必填校验**：`title`（标题）、`location`（地点）、`description`（描述）在所有四类业务中都为必填，`trim()` 后为空时显示错误提示"请输入xxx"。
2. **二手交易专属校验**：`category`（商品分类）必填；`price`（价格）必须是大于 0 的数字；`condition`（成色）必须从下拉框中选择一项。
3. **失物招领专属校验**：`itemName`（物品名称）必填；`eventTime`（发生时间）必填，确保时间字符串不为空；`type` 默认选中"寻物"，因此不做额外检查。
4. **拼单搭子专属校验**：`groupType`（拼单类型）必填；`targetCount`（目标人数）必须 ≥ 2，防止"1人拼单"之类的无意义信息；`deadline`（截止时间）必填。
5. **跑腿委托专属校验**：`taskType`（任务类型）必填；`reward`（酬劳）不能为负数（允许 0，对应帮同学义务跑腿）；`from`（取件地点）和 `to`（送达地点）都必填；`deadline`（截止时间）必填。
6. **提交状态管理**：点击"发布"按钮后 `submitting = true`，按钮禁用并显示"提交中..."，防止因网络较慢时用户重复点击；接口返回（无论成功或失败）后通过 `finally` 恢复 `submitting = false`。

校验通过后才真正发起 POST 请求；校验失败时聚焦在第一个错误字段（由浏览器的错误提示文字实现软定位），学生可以立即修正。

---

## 4. AI 协作记录

我使用 Trae 内置的 AI Coding 工具辅助完成了表单字段结构、API 方法和提交逻辑的代码骨架。核心提示词为："我正在开发一个名为校园轻集市的 Vue3 Web App，技术栈 Vue3 + Vite + TypeScript + Vue Router + Pinia + Axios + JSON Server。现在需要完成 Day4 发布表单与数据新增。已有的 db.json 包含 trades、lostFounds、groupBuys、errands 四类数据，也已经有 Axios 封装和基础列表渲染。请帮我实现发布表单，支持四类信息、按类型显示不同字段、基础表单校验、POST 提交，提交成功后跳转到对应列表页。代码保持简洁，不要加入登录鉴权和复杂后端逻辑。"

AI 生成的内容包括：

- 一个"大而全"的通用 `PublishItem` 接口，使用 `discriminator` 字段区分业务类型，并建议新增一个统一的 `POST /publish` 路由由后端分发。优点是代码看起来"统一"，缺点是它与现有 `db.json` 分四个独立数组的结构不兼容，JSON Server 无法直接处理这种统一路由方案。
- 一组 `useForm` 组合式函数，把表单项、校验规则、提交逻辑封装成可复用的 composable。对于只有一个发布页的实训项目来说，过度封装反而降低可读性。
- 建议引入 Element Plus 作为 UI 组件库，搭配 `ElMessage`、`ElNotification` 等全局提示组件。这是合理的建议，但在 Day4 阶段会大幅增加环境依赖和学习门槛。
- 在"跑腿委托"字段中 AI 直接使用了 `from` 和 `to` 两个字段，与我 Day3 中已调整为 `pickupLocation/deliveryLocation` 的 API 接口不一致，如果不加检查直接使用，会导致 JSON Server 写入的字段名与已有数据不一样，列表页读不到正确的起终点。

---

## 5. 人工调整内容

基于 AI 生成的骨架，我做了以下修改和取舍：

1. **放弃统一 POST 路由方案**：不引入 `discriminator` 字段，改为 4 个独立的 API 方法（`createTrade`、`createLostFound`、`createGroupBuy`、`createErrand`），分别请求 `/trades`、`/lostFounds`、`/groupBuys`、`/errands`，直接匹配 JSON Server 的默认行为，后端不需要写任何额外代码。
2. **字段名严格对齐 `db.json`**：AI 在跑腿委托业务中建议使用 `from`、`to` 两个字段，但 db.json 和 errand API 中使用的是 `pickupLocation`、`deliveryLocation`。我在 `handleSubmit` 中做了字段映射：`pickupLocation: form.from`、`deliveryLocation: form.to`，确保写入后端的字段名与现有数据一致，同时保留表单内部短变量名以便代码简洁。
3. **时间字段格式对齐**：AI 生成的代码中直接把 `<input type="datetime-local">` 产生的 `YYYY-MM-DDTHH:mm` 字符串写入了 `deadline` 字段，但 Day3 `db.json` 中旧数据使用的是 `YYYY-MM-DD HH:mm`（空格分隔）。我在提交前做了一次简单处理：`deadline.replace('T', ' ')`，保证新写入数据与旧数据格式一致，列表页的渲染逻辑无需额外分支。
4. **`lostFoundType` 值与 API 对齐**：表单中下拉框的值是英文 `'lost'` 和 `'found'`，但 `LostFoundItem` 接口中 `type` 字段的类型是中文联合类型 `'寻物' | '招领'`。如果直接把表单值传入 API，TypeScript 在编译时就会报错。我在 `handleSubmit` 中做了显式映射：`type: form.lostFoundType === 'lost' ? '寻物' : '招领'`。
5. **删除登录鉴权逻辑**：AI 建议在提交前校验"当前用户是否登录"，若未登录则跳转登录页。Day4 阶段还没有登录系统，我删掉了这部分逻辑，`publisher` 统一填充为"当前用户"或"校园用户"，后续接入 Pinia 用户模块时只需要替换这一处即可。
6. **删除图片上传相关代码**：AI 建议支持用户上传商品图片并保存到后端，但 JSON Server 并不支持文件存储（只能写入 JSON 文本），我删掉了上传文件的 input 和对应的 `FileReader` 代码，`image` 字段由前端统一填充为 `https://picsum.photos/seed/trade-${Date.now()}/400/300`，既不影响显示效果，又保证每次发布的图片地址不同。
7. **删除 AI 建议的复杂拦截器**：AI 建议在 `src/api/http.ts` 中新增 request/response 拦截器，统一处理 token、统一错误提示。当前阶段没有 token 需求，拦截器的成本大于收益，我保留了 Day3 中"一个简单 create + 一个简单 post"的 API 风格。
8. **补充 `watch(publishType, () => resetForm())`**：AI 生成的代码没有在用户切换发布类型时清空旧字段，导致"先在二手交易 tab 填了价格 → 切到失物招领 → 提交时 price 字段虽然隐藏但仍被携带"之类的隐式 bug。我在 PublishView 中显式加入了这段逻辑，只要类型切换就重置整份表单。
9. **补充 try/catch 兜底**：AI 生成的提交逻辑没有异常处理，当 JSON Server 未启动时页面会直接崩溃。我用 `try/catch` 包裹 `await createXxx(...)` 调用，捕获异常后弹出 alert 提示"发布失败，请检查 Mock 服务是否正常运行"，给出学生可操作的自查路径。

---

## 6. 测试记录

按照以下步骤完成了一次端到端测试：

**测试环境**：
- JSON Server Mock 服务：`npm run mock`，端口 3001
- Vite 前端开发服务：`npm run dev`，端口 5173
- 浏览器：Chrome，无痕窗口打开 `http://localhost:5173`

**测试步骤 1 - 发布二手商品**：
1. 导航到 `/publish`，默认显示"二手交易"类型。
2. 填写标题"《微积分》《线性代数》《概率论》考研数学三本打包出"、分类"书籍教材"、价格 50、成色"九成新"、地点"西区图书馆门口"、描述"自用考研数学教材，无笔记无画线，三本打包 50 元，不议价，西区图书馆一楼自提。"
3. 点击"发布"按钮 → 按钮变为"提交中..."
4. 约 0.5 秒后弹出 alert "二手商品发布成功"
5. 自动跳转到 `/trade` 列表页
6. 列表末尾出现了一条新记录，标题、价格、地点、成色、发布人（"当前用户"）、图片（picsum 随机图）均正确
7. 在浏览器另一个标签页访问 `http://localhost:3001/trades`，返回的 JSON 数组中出现了 id=7 的新记录，字段完整且与表单一致

**测试步骤 2 - 发布失物招领**：
1. 从列表页点击导航回到 `/publish`
2. 选择发布类型"失物招领" → 表单自动清空旧字段
3. 填写标题"寻找遗忘在自习室的蓝色水杯"、物品名称"蓝色保温杯（盖子白色）"、地点"图书馆三楼自习区 305 号座"、时间选择当天下午 15:30、描述"保温杯杯身有我名字缩写，请好心人拾到联系我，非常感谢！"
4. 点击"发布" → 成功并跳转到 `/lost-found`
5. 列表页显示新增记录，类型标签为"寻物"，时间字段显示正确

**测试步骤 3 - 发布拼单搭子**：
1. 切到 `/publish`，选择"拼单搭子"
2. 填写标题"京东超市洗衣液拼单 满99减30"、类型"生活用品"、目标人数 3、截止时间次日 20:00、地点"西区3号楼楼下"、描述"洗衣液 3kg 装原价 45，满减后每瓶约 35，3 人拼单即可，已有 1 人（我自己）"
3. 点击"发布" → 成功并跳转到 `/group-buy`
4. 列表页正确显示标题、类型、目标人数 3、当前人数 1

**测试步骤 4 - 发布跑腿委托**：
1. 切到 `/publish`，选择"跑腿委托"
2. 填写标题"求代取快递 菜鸟驿站 大箱子一件"、任务类型"取快递"、酬劳 10、取件地点"东区菜鸟驿站"、送达地点"南区2号楼301"、截止时间当天晚上 19:00、描述"快递已经到驿站了但是我在上课走不开，箱子比较大，请尽量选有推车或自行车的同学，站内短信联系我。"
3. 点击"发布" → 成功并跳转到 `/errand`
4. 列表页显示新增记录，起终点、酬劳、截止时间均正确

**测试步骤 5 - 校验失败场景**：
1. 故意不填写标题、地点、描述，选择二手交易
2. 点击"发布" → 表单下方显示"请输入标题"、"请输入地点"等错误提示，没有发起 POST 请求
3. 填写价格为 0 → 点击"发布" → 显示"价格应大于 0"
4. 选择跑腿委托，填写酬劳为 -5 → 点击"发布" → 显示"酬劳不能为负数"
5. 选择拼单搭子，填写目标人数 1 → 点击"发布" → 显示"目标人数不能少于 2 人"

**测试步骤 6 - Mock 服务未启动场景**：
1. 关掉运行 JSON Server 的终端
2. 在表单中填写一份完整的二手商品信息并提交
3. 弹出 alert "发布失败，请检查 Mock 服务是否正常运行"
4. 重新启动 `npm run mock` 后再次点击"发布" → 正常写入

**结论**：四类业务的发布流程全部跑通，JSON Server 中的 `trades`、`lostFounds`、`groupBuys`、`errands` 四个数组都新增了对应记录，列表页刷新后也能看到新数据。表单校验能够正确拦截非法输入，Mock 服务未启动时也有明确的错误提示。

---

## 7. 遇到的问题与解决方法

**问题 1：表单字段名与 API 接口字段名不一致**

AI 生成的代码在跑腿委托业务中使用了 `from` 和 `to` 两个字段，但我在 Day3 的 errand API 接口和 `db.json` 中使用的是 `pickupLocation` 和 `deliveryLocation`。如果不加检查直接把表单对象传给 `createErrand`，JSON Server 写入的字段名就是 `from/to`，而列表页读取时使用的是 `pickupLocation/deliveryLocation`，结果列表页显示"取件地点：undefined / 送达地点：undefined"。

**解决方法**：以 `db.json` 中已有字段名为权威参考，在 `handleSubmit` 中做一次字段映射，把 `form.from` 映射到请求体的 `pickupLocation` 字段，`form.to` 映射到 `deliveryLocation` 字段。这样表单内部仍保持短变量名便于阅读，同时对外写入时与现有数据结构完全兼容。

**问题 2：`datetime-local` 的时间字符串与旧数据格式不一致**

`<input type="datetime-local">` 产生的时间字符串是 `YYYY-MM-DDTHH:mm`（中间有字母 T），而 Day3 `db.json` 中 `deadline` 字段的已有数据是 `YYYY-MM-DD HH:mm`（中间空格）。如果直接写入新格式，列表页读取时不会有问题（纯文本显示），但如果后续新增"按截止时间排序"功能，两种格式混合会给 `new Date()` 解析带来不确定性。

**解决方法**：在提交前对 `deadline`、`eventTime`、`publishTime` 做一次简单处理：`deadline.replace('T', ' ')`。仅需一行代码，保证新写入数据与旧数据格式一致，不需要修改渲染组件或 db.json 历史数据。

**问题 3：切换发布类型后旧字段值仍然存在**

最初 `PublishView.vue` 中只有一个"重置"按钮，用户切换发布类型时不会触发重置。测试时发现：在二手交易 tab 下填了价格 50 → 切到失物招领 → 点击发布，虽然价格字段在界面上已被隐藏，但响应式对象中 `form.price` 仍然是 50。

**解决方法**：在 `watch(publishType, () => resetForm())` 中监听类型变化，只要类型变化就自动调用 `resetForm()` 清空整份表单和错误信息。同时在提交成功后也调用一次 `resetForm()`，确保用户从列表页再次返回 `/publish` 时表单是干净状态。

**问题 4：`type` 字段类型不匹配**

`LostFoundItem` 接口中 `type` 字段的类型是 `'寻物' | '招领'`（中文联合类型），但表单中 `<select>` 的 `value` 属性我最初写的是英文 `'lost'` 和 `'found'`。这样做会导致两个后果：一是 TypeScript 编译时会报错，`'lost'` 不能赋值给 `'寻物' | '招领'`；二是 JSON Server 写入的 type 字段值是英文，列表页渲染时按中文匹配就会显示错误的类型标签。

**解决方法**：在 `handleSubmit` 中做显式映射：`type: form.lostFoundType === 'lost' ? '寻物' : '招领'`。这样表单中保持英文值以便于前端区分，提交时转成 db.json 中的中文值，列表页通过 `item.type === '寻物'` 做判断即可正确渲染。

**问题 5：Mock 服务未启动时页面直接报错**

最初的 `handleSubmit` 中没有对 `await createXxx(...)` 做异常处理，JSON Server 未启动时 Axios 抛出 Network Error，页面没有任何反馈，控制台才看得见报错信息。对于实训场景而言这是不可接受的，学生不知道自己错了什么。

**解决方法**：用 `try/catch` 包裹所有 POST 调用，捕获异常后通过 `window.alert` 显示"发布失败，请检查 Mock 服务是否正常运行"的提示。虽然不是最优交互方案（`alert` 会阻塞），但足够简单、无需额外依赖，符合 Day4 代码"简洁、可验证"的原则。

---

## 8. 今日反思

完成 Day4 后，整个项目从"只能读取 Mock 数据渲染列表"升级为"可以接收用户输入并持久化写入"，**发布表单**、**表单校验**、**数据新增**这三个能力的组合才真正让项目有了"可交互的应用"的感觉。

在这个过程中，我最大的体会有两点。第一是**字段命名一致性的重要性被严重低估**：`from` vs `pickupLocation`、`T` vs 空格、`'lost'` vs `'寻物'`，这些看似只是"命名风格"的差异，却会在"表单 → API → JSON Server → 列表页 → 再次回填"的整条链路中反复爆雷，每一处不一致都需要额外的代码处理或人工排查。我选择了"以 `db.json` 已存在的字段名为唯一权威参考"这一原则，所有新增代码都按这个原则对齐，虽然在代码中多了几处字段映射，但换来了整条数据链路的稳定——任何一个字段出问题，我都可以在 db.json 中查到标准命名再做调整，不会出现"前端这样写、后端那样写、两边都说自己没问题"的扯皮现象。

第二是**在实训/教学场景下，"简单"比"漂亮"更有教学价值**。AI 给我的建议几乎都在"提升专业度"方向：统一路由、统一请求拦截器、统一表单 composable、UI 组件库、Toast 全局提示。这些方案在真实商业项目中是合理的，但在 Day4 这个阶段（学生可能还没完全理解 `ref` 和 `reactive` 的区别），它们只会增加环境依赖和学习门槛。我最终选择了"4 个独立 API 方法 + 一张页面里写 4 个分支的 handleSubmit"这样的笨办法，好处是每类业务的数据链路都清晰、独立，学生可以拿 `trades` 这条链路当模板，一步步理解"用户在表单里打字 → reactive 对象接收到 → validate → POST → JSON Server 写入 db.json → 列表页 GET 新数据 → 渲染"的完整流程。这种"看起来不高级但能独立跑通"的代码，对实训场景而言反而是有价值的。

最后，我也意识到 Day4 的实现还存在几个明显的可改进之处，留给后续阶段处理：发布人字段目前硬编码为"当前用户"，后续接入 Pinia 用户状态后应从全局 store 中读取；缺少"发布成功后把新数据即时推送到列表页"的机制，目前依赖列表页刷新，未来可以引入事件总线或 pinia 共享发布结果；表单校验目前是手写 if/else，当字段数量变多时可读性会下降，后续引入组件库时可以考虑使用成熟的表单校验方案。

**Git 提交建议信息**：`git add . && git commit -m "Day4: add publish form with validation and POST APIs"`
