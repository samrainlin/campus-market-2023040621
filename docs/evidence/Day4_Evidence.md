# Day4 Evidence - 发布表单与数据新增

## 1. 今日完成内容

Day4 的目标很明确：把项目从"只能看"升级为"能写"。之前 Day3 已经做好了 4 个列表页和对应的 GET API，数据是写死在 db.json 里的。Day4 需要让用户可以通过界面表单发布新的二手商品、失物招领、拼单搭子和跑腿委托，并真正写入到后端。

今天的工作按顺序做了以下几件事：

1. **设计发布类型与字段**：先在纸上想了一下 4 类业务各需要哪些信息。二手交易需要标题、分类、价格、成色、地点；失物招领需要区分"寻物"还是"招领"，以及物品名称和发生时间；拼单搭子需要目标人数和截止时间；跑腿委托需要起终点和酬劳。这个过程花了大概 20 分钟，主要是想清楚哪些字段是共用的、哪些是各业务独有的。

2. **写 API 层**：在已有的 4 个 api 文件里补充 POST 方法。之前 Day3 只有 `getTrades()`，现在新增 `createTrade(data)` 调 `/trades` 接口，其他三个文件同理。这个部分不复杂，因为 axios 的 post 用法和 get 差不多，只是多传一个请求体。

3. **做 FormField 组件**：表单项的结构其实是重复的——每个字段都有标题、必填星号、输入框、错误提示。我把这部分抽成了一个 FormField.vue 组件，用 slot 放具体的 input/select/textarea，这样页面代码可以干净很多。

4. **写 PublishView.vue**：核心页面。页面顶部是"发布类型"下拉选择，下面是标题、地点、描述这三个通用字段，再下面根据类型显示专属字段。表单里写了校验逻辑（必填、数字范围、人数下限）、提交状态管理（按钮禁用+"提交中..."）、提交成功后的页面跳转、失败时的 alert 提示、表单重置、以及切换发布类型时自动清空旧数据。

5. **写证据卡**：就是这份文档，整理了今天的思考过程、遇到的问题和解决方法。

## 2. 发布类型与字段设计

字段设计的思路是：先看 db.json 里 Day3 已经写了哪些字段名和字段值，然后让表单字段尽量跟它对齐，避免"前端一个命名、后端一个命名"导致数据写入后列表页读不到。

### 二手交易 → trades

核心字段：title（标题）、category（分类）、price（价格）、condition（成色）、location（地点）、publisher（发布人）、publishTime（发布时间）、image（图片）、status（状态）、description（描述）。

为什么需要这些字段：买家看一条二手信息最关心三件事——"卖什么东西、多少钱、几成新、在哪里交易"，所以 category+title 描述物品，price 描述价格，condition 描述新旧程度，location 描述交易地点。publisher 和 publishTime 由前端自动填入，publisher 暂时写死成"当前用户"（等 Day5 引入用户系统后再改），publishTime 用 `new Date()` 生成。image 字段用 picsum 占位图代替真实上传，因为 JSON Server 存不了二进制文件。status 新发布的数据统一填 "open"，表示交易进行中。

### 失物招领 → lostFounds

核心字段：title、type（寻物/招领）、itemName（物品名称）、location（地点）、time（时间）、contact（联系方式）、description（描述）、status（状态）。

为什么需要 type：失物招领的信息方向是相反的——"我丢了东西在找"和"我捡到了东西在还给物主"，这两种信息对读者来说区别很大，必须有一个 type 字段区分。itemName 描述物品本身，time 记录事件发生的时间，contact 留联系方式让对方可以联系到你。

### 拼单搭子 → groupBuys

核心字段：title、type（拼单类型）、targetCount（目标人数）、currentCount（当前人数）、deadline（截止时间）、location（地点）、publisher（发布人）、description（描述）、status（状态）。

为什么需要 targetCount 和 currentCount：拼单的本质是"还差几个人就能成团"，targetCount 表示成团需要几个人，currentCount 表示已经报名的人数，列表页可以据此显示"还需 2 人"之类的信息。deadline 表示拼单的最后时间，过期后应该自动标记为 closed。

### 跑腿委托 → errands

核心字段：title、taskType（任务类型）、reward（酬劳）、pickupLocation（取件地点）、deliveryLocation（送达地点）、deadline（截止时间）、publisher（发布人）、description（描述）、status（状态）。

为什么需要 pickupLocation/deliveryLocation 和 reward：跑腿委托本质是路线和报酬——"请你帮我从 A 点拿到 B 点，最晚 C 时间前送到，给你 D 元辛苦费"。所以起终点两个字段缺一不可（少一个就跑不了），reward 是发起人的报酬承诺。我在 FormField 里把起终点分别做成了独立的输入框，虽然看起来字段多，但信息完整。

### 字段命名上的选择

在写代码前做了一个重要决定：**以 db.json 中已有的字段名作为唯一标准**。也就是说，如果 Day3 的 db.json 里某个字段叫 `pickupLocation`，那我在 errand.ts 的接口里也写 `pickupLocation`，在 PublishView.vue 的提交逻辑中也传这个名字给 createErrand。我试过一次把表单内部简写为 `from` 和 `to`，结果提交后 db.json 写入的字段名变成了 `from/to`，列表页读 `pickupLocation` 读不到，显示了 undefined。后来改成了"表单内部可以用短名，但提交前必须映射到标准字段名"。

## 3. 表单校验规则

校验规则分两类：通用校验和各业务的专属校验。

**通用校验**：对所有 4 类业务都适用——title、location、description 三个字段不能为空。做法很直接：在 validateForm() 函数里判断 `if (!form.title)`、`if (!form.location)`、`if (!form.description)`，为空就往 errors 对象里写中文错误信息，FormField 组件读到 errors 里有值就把文字显示在字段下方。

**二手交易专属校验**：category 分类必填（否则发布出来的信息不知道属于哪一类）；price 价格必须大于 0（免费送可以写成 0.01，但我觉得在实训场景下大于 0 更简单，后续可以扩展"免费"选项）；condition 成色必须从下拉选项里选一项。

**失物招领专属校验**：itemName 物品名称必填；time 发生时间必填（datetime-local 选完时间后表单字段才有值，没选的话字符串是空的，校验会拦截）。

**拼单搭子专属校验**：groupType 拼单类型必填；targetCount 目标人数不能小于 2（一个人不存在"拼"这个动作）；deadline 截止时间必填。

**跑腿委托专属校验**：taskType 任务类型必填；reward 酬劳不能为负数（允许 0，对应"同学帮个忙"这种场景）；pickupLocation 和 deliveryLocation（在表单内部简写为 from 和 to）两个字段都必填；deadline 截止时间必填。

**校验流程**：点击"发布"按钮后先调用 validateForm()。这个函数返回 true 才会继续走 POST 请求；返回 false 就停住，显示各字段的错误信息让用户修改。提交过程中把按钮置为 disabled 并显示"提交中..."，防止网络慢的时候用户反复点击重复提交。

## 4. AI 协作记录

在做 Day4 的过程中，我让 AI 帮了两次小忙，一次是生成 PublishView.vue 的骨架代码，一次是生成表单校验函数的结构。

**第一次：生成发布页骨架**。我给了 AI 一个简单的描述，告诉它"Vue3 + TypeScript，一个页面里按类型切换显示不同字段，字段名参考 db.json"。AI 给的代码结构是：响应式 form 对象、errors 对象、computed 计算当前类型的专属字段列表、handleSubmit 里调用对应的 API 方法。

AI 生成版本的问题：字段名和 db.json 不完全对应（它把跑腿的起终点写成了 from/to，而我 db.json 里是 pickupLocation/deliveryLocation；它把失物招领的 type 值写成英文 lost/found，而我 db.json 里是中文"寻物"/"招领"）；没有做类型切换时的旧数据清理；没有 try/catch 包裹 POST 请求，JSON Server 挂掉时页面就崩了；表单校验规则写得过于笼统，缺少人数下限、价格范围等业务判断。

**第二次：生成表单校验逻辑**。AI 给了一个比较标准的写法：用一个 errors 对象存放各字段错误信息，validateForm() 里按字段依次判断，最后返回 Object.values(errors).every(v => !v)。这个结构基本是对的，我在它的基础上补了上面第 3 节里提到的业务判断。

**我的使用感受**：AI 对"快速搭出一段能跑的代码骨架"确实很有帮助，节省了我大约 30 分钟的重复劳动。但它也有两个很明显的局限，需要我自己盯着。第一，AI 对数据结构的"一致性"没什么概念——它看到 from/to 就写 from/to，不会去查 db.json 里到底叫什么，结果就是字段名不一致会导致数据写进去但读不出来。第二，AI 给的代码结构虽然正确，但缺少"真实场景的细节"——比如提交状态管理（按钮 disabled）、类型切换清空旧字段、提交失败的兜底提示，这些都是我自己手写加上去的。

---

## 5.1 证据材料检查（Day4 阶段）

> 在 Day7 综合验收时回头检查 Day4 的证据材料。

**代码层面的检查：**

| 检查项 | 预期 | 实际结果 |
|-------|------|---------|
| 发布页（PublishView.vue）存在 | src/views/PublishView.vue 应有完整表单 | ✅ 存在，包含类型选择器和表单字段 |
| 四个 API 模块有 POST 方法 | trade.ts、lostFound.ts、groupBuy.ts、errand.ts 应都有 createXxx 方法 | ✅ 都有对应的 create 方法 |
| FormField 组件存在 | src/components/FormField.vue 可复用 | ✅ 存在，支持 label、required、error 等 props |
| 表单校验逻辑完整 | validateForm() 应校验必填、数字范围、人数下限等 | ✅ 完整实现 |
| 提交状态管理完整 | submitting ref + disabled 按钮 + loading 文案 | ✅ 实现 |
| 类型切换清空旧数据 | watch 监听 publishType 变化时调用 resetForm() | ✅ 实现 |
| try/catch 错误处理 | API 调用应捕获 Network Error，给出明确提示 | ✅ 实现 |
| datetime 格式统一 | publishTime 和 deadline 中 T 应替换为空格 | ✅ 实现 |
| 表单提交后跳转 | 提交成功后应跳转到对应列表页 | ✅ 实现 |

**文档层面的检查：**

| 检查项 | 预期 | 实际结果 |
|-------|------|---------|
| Day4_Evidence.md 存在 | docs/evidence/Day4_Evidence.md | ✅ 存在 |
| 测试记录完整 | 证据卡应包含端到端测试步骤和结果 | ✅ 已记录 4 类业务的发布测试 |

---

## 5.2 阶段性功能清单（Day4 阶段）

> Day4 阶段的核心任务是"发布表单与数据新增"。

| 功能模块 | 完成情况 | 说明 |
|---------|---------|------|
| 发布页表单容器 | ✅ | 包含类型选择器、通用字段区、专属字段区 |
| 二手交易专属字段 | ✅ | title、category、price、condition、location、description |
| 失物招领专属字段 | ✅ | title、type、itemName、location、time、contact、description |
| 拼单搭子专属字段 | ✅ | title、type、targetCount、currentCount、deadline、location、description |
| 跑腿委托专属字段 | ✅ | title、taskType、reward、pickupLocation、deliveryLocation、deadline、description |
| FormField 可复用组件 | ✅ | 统一的 label/必填/错误提示样式 |
| 表单校验（通用） | ✅ | title、location、description 不能为空 |
| 表单校验（二手交易专属） | ✅ | price>0、category 选择、condition 选择 |
| 表单校验（失物招领专属） | ✅ | itemName、time 必填 |
| 表单校验（拼单搭子专属） | ✅ | targetCount>=2、deadline 必填 |
| 表单校验（跑腿委托专属） | ✅ | reward>=0、pickupLocation/deliveryLocation 必填、deadline 必填 |
| 提交状态管理 | ✅ | submitting 控制按钮禁用 + 文案切换 |
| 类型切换清空旧数据 | ✅ | watch(publishType) 调用 resetForm() |
| Network Error 处理 | ✅ | try/catch 捕获后 alert 明确提示 |
| 时间格式统一 | ✅ | datetime-local 的 T 替换为空格 |
| createTrade API | ✅ | POST /trades，字段映射与 db.json 对齐 |
| createLostFound API | ✅ | POST /lostFounds，type 为中文 |
| createGroupBuy API | ✅ | POST /groupBuys |
| createErrand API | ✅ | POST /errands，from/to 映射为 pickupLocation/deliveryLocation |
| 提交成功跳转 | ✅ | 根据类型跳转到对应列表页 |
| 端到端测试验证 | ✅ | 4 类业务分别发布测试，db.json 中能看到新数据 |

**Day4 阶段没有实现的功能：**
- 没有实现用户登录鉴权（Day6 才做）
- 没有实现 Pinia 状态管理（Day5 才做）
- publisher 暂时使用固定字符串（Day5 引入 Pinia 后改为 userStore.displayName）
- 没有实现图片上传功能（使用 picsum 占位图）

---

## 6. 人工调整内容

拿到 AI 生成的代码骨架后，我做了以下修改：

1. **字段名对齐 db.json**：在 handleSubmit() 中显式做了字段映射。form.from 映射为 pickupLocation，form.to 映射为 deliveryLocation，form.groupType 映射为 type，form.eventTime 映射为 time。这样虽然表单内部用短名写起来方便，但提交给 API 的字段名始终与 db.json 一致。

2. **type 值从英文改为中文**：AI 在下拉框里写的 value="lost" 和 "found"，但 lostFound.ts 里 LostFoundItem.type 的类型是 `'寻物' | '招领'`。我在提交逻辑里写了一行：`type: form.lostFoundType === 'lost' ? '寻物' : '招领'`，这样 TypeScript 编译通过，db.json 写入的值也是中文，列表页判断 `item.type === '寻物'` 就能正确显示标签。

3. **datetime-local 的时间字符串格式**：表单输入框产生的是 "YYYY-MM-DDTHH:mm"，而 Day3 db.json 已有数据里用的是空格分隔。如果不处理，新写入的数据格式会和旧数据不一致。我在提交前做了 `deadline.replace('T', ' ')` 这个替换，publishTime 也用同样的方式生成。

4. **补充提交状态管理**：加了一个 submitting ref。点击"发布"后把 submitting 设为 true，按钮变灰色并显示"提交中..."，按钮上再加 :disabled="submitting" 防止连点。无论 POST 请求成功或失败，finally 块里把 submitting 设回 false。

5. **补充 try/catch**：AI 生成的提交逻辑里没有异常处理。我用 try/catch 包裹了四个 createXxx() 调用，捕获 Network Error（常见原因是忘记启动 npm run mock）后弹出 alert 提示"发布失败，请检查 Mock 服务是否正常运行"，给出可操作的排查方向。

6. **补充类型切换时的清空**：watch(publishType, ...) 里监听发布类型变化，切换类型时调用 resetForm() 清空 form 对象和 errors 对象，避免用户先在"二手交易"下填了价格 50，切到"拼单搭子"后旧字段值还留在 reactive 对象里。

7. **删除 AI 建议的登录鉴权逻辑**：AI 代码里有一段"提交前先判断当前用户是否登录，未登录则跳转到登录页"。Day4 还没有用户系统，这段代码在实训场景下毫无意义，反而会让每次提交都跳走。我删掉了它，publisher 暂时写死为"当前用户"，Day5 引入 Pinia 用户状态后再替换成真实用户名。

8. **删除真实文件上传**：AI 还生成了一段 FileReader 相关的代码，让用户选择商品图片后转 base64 再提交。JSON Server 存不了大文件，存了也没法在列表页里读出来渲染。我直接改成用 picsum 生成随机图片 URL：`https://picsum.photos/seed/trade-${Date.now()}/400/300`，每次发布用不同的 seed 就有不同的图。

9. **删除建议的 axios 拦截器方案**：AI 建议在 http.ts 里新增 request/response 拦截器统一处理 token、统一错误处理。目前没有 token 需求，统一错误处理反而会让具体字段的错误信息变模糊。我保留了 Day3 的最简写法——http.ts 就做一件事：创建 axios 实例并配置 baseURL。

## 6. 测试记录

我在本地做了一次端到端测试，记录如下。

**测试环境**：前端用 `npm run dev` 起在 5173 端口，Mock 服务用 `npm run mock` 起在 3001 端口，浏览器用 Chrome 无痕窗口访问 `http://localhost:5173`。

**步骤 1 - 发布一条二手商品**：导航到 /publish，默认类型就是二手交易。填了标题"线性代数同济第六版九成新无笔记"、分类"书籍教材"、价格 15、成色"九成新"、地点"东区3号楼"、描述"线性代数教材，几乎没笔记，自取"。点击发布，按钮变成"提交中..."约一秒后弹出 alert "二手商品发布成功"，自动跳转到 /trade 列表页，列表末尾出现了新记录，价格成色地点都正确。查看 db.json，trades 数组里多了一条新数据，id 是 JSON Server 自动累加的。

**步骤 2 - 发布一条失物招领**：从导航回到 /publish，选择发布类型"失物招领"。填了标题"图书馆丢失的水杯找回来了"、物品名称"蓝色保温杯"、地点"图书馆三楼自习区"、时间选当天 14:30、描述"杯身有我的姓名缩写，好心人捡到后请站内消息联系我"。发布成功后跳转到 /lost-found，列表页显示新记录，类型标签正确，时间显示正常。

**步骤 3 - 发布一条拼单搭子**：类型选择"拼单搭子"。填了标题"京东洗衣液拼单满99减30"、类型"生活用品"、目标人数 3、截止时间次日 20:00、地点"西区3号楼楼下"、描述"洗衣液每瓶原价45，拼单后每瓶约35，已有1人"。发布成功后跳转到 /group-buy，列表正确显示标题和人数信息。

**步骤 4 - 发布一条跑腿委托**：类型选择"跑腿委托"。填了标题"求代取快递菜鸟驿站一个大箱子"、任务类型"取快递"、酬劳 10、取件地点"东区菜鸟驿站"、送达地点"南区2号楼301"、截止时间当天晚上 19:00、描述"快递已经到了但我走不开，箱子有点大，有推车最好"。发布成功后跳转到 /errand，列表正确显示起终点和酬劳。

**步骤 5 - 测试校验失败**：故意不填标题直接点击发布。表单下方提示"请输入标题"，没有发出任何网络请求（Chrome devtools 的 Network 面板是空的），说明 validateForm() 在提交前就拦截住了。把价格改成 0 后点击发布，提示"价格应大于 0"；拼单的目标人数填 1，提示"目标人数不能少于 2 人"；跑腿酬劳填 -1，提示"酬劳不能为负数"。

**步骤 6 - 测试 Mock 服务异常**：关掉了 JSON Server 的终端窗口，然后在发布页填写完整信息后点击发布。弹出 alert "发布失败，请检查 Mock 服务是否正常运行"，按钮恢复可点击状态。重新启动 `npm run mock` 后再发布一次，正常写入。

**测试小结**：4 类业务的发布流程都跑通了，校验功能能够正确拦截非法输入，Mock 服务未启动时有明确提示，列表页能看到新发布的数据。

## 7. 遇到的问题与解决方法

今天遇到了几个比较典型的问题，记录一下以后不会再踩同样的坑。

**问题 1：字段名不一致导致列表页读不到新数据**。AI 生成的代码里跑腿委托用了 `form.from` 和 `form.to`，我最初直接把这两个字段塞进 createErrand 的请求体里了。发布成功后 db.json 写入的字段名就是 from/to，而列表页 errand.ts 里用的是 pickupLocation/deliveryLocation。结果很明显——列表页显示"取件地点：undefined"。一开始我以为是 API 请求没发对，检查了 Network 面板看请求体没问题；又以为是列表页渲染逻辑有 bug，看了半天模板代码才反应过来：是字段名对不上。解决方案就是前面第 5 节说的字段映射。现在我在提交前把 form.from 映射成 pickupLocation，form.to 映射成 deliveryLocation，再传给 API。

**问题 2：时间字符串格式不一致**。`<input type="datetime-local">` 产生的值里有一个大写 T 把日期和时间隔开（比如 "2025-03-15T10:30"），但 Day3 的 db.json 里已有 deadline 用的是空格（"2025-03-15 10:30"）。这不会立刻导致 bug——纯文本显示没有问题——但如果之后要把时间字符串传给 `new Date()` 做排序或判断是否已截止，两种格式混在一起就会出问题。我在提交前做了一次 `.replace('T', ' ')`，publishTime 也是用同样的格式生成的，新老数据就统一了。

**问题 3：切换发布类型后旧字段值残留**。我最初写 PublishView 的时候，整份 form 用一个 reactive 对象存所有字段。测试的时候"先在二手交易 tab 下填价格 50 → 切到拼单搭子 → 点击发布"，发现 price 字段虽然在界面上已经看不到了，但在 reactive 对象里还在。这不会影响拼单这条信息本身（因为 createGroupBuy 的请求体里根本没用到 price），但如果某一天我扩展了拼单字段也叫 price，旧值就会被带进去。觉得这种隐式状态很危险，所以加了 watch(publishType, ...) 来监听类型变化，一切换就调用 resetForm() 清空整份 form 和 errors。

**问题 4：type 字段的联合类型与实际值不匹配**。LostFoundItem.type 的类型是 `'寻物' | '招领'`，但我最初在 `<select>` 的 `<option value="lost">` 里写的是英文 value。结果两处都报错：TypeScript 编译时说 `'lost' 不能赋值给 '寻物' | '招领'`；就算我临时用 as any 绕过去，提交到 db.json 里的 type 值也是 lost，列表页里用 `item.type === '寻物'` 判断就永远为 false，类型标签就不显示。解决方法就是做一次映射：提交时把 form.lostFoundType 的 lost/found 翻译成寻物/招领。

**问题 5：Mock 服务未启动时直接崩溃**。这是个很简单的问题——try/catch 没写。JSON Server 没启动时 axios.post 会抛出 Network Error，控制台能看到，但用户什么提示都没有，只会看到按钮一直卡在"提交中..."。加了 try/catch 后捕获异常弹出 alert 提示，并在 finally 里把 submitting 恢复为 false。

## 8. 今日反思

Day4 完成后，整个项目从一个"只读的信息展示网站"变成了"可以写入数据"的简易信息发布系统。发布表单、表单校验和数据新增这三个能力组合起来，就能构成一个很基础的"用户 → 表单 → 后端 → 列表页 → 用户"的闭环。

今天最大的收获不是写了多少行代码，而是对"数据一致性"这件事有了比 Day3 更深的体会。一个字段叫 from 还是 pickupLocation、一个类型值写 lost 还是"寻物"、一个时间字符串里分隔符是 T 还是空格——这些看似"只是风格"的差异，在表单数据经过 API 层、写入数据库、再被列表页读出来的整个链路里，会在任何一个环节爆雷。我选择的做法是"以 db.json 的既有字段名为唯一权威标准"，所有上游代码（API 接口、表单提交逻辑、列表页渲染）都对齐这个标准，不允许各写各的。这个原则让我在调试 from/to 字段名不匹配时很快就定位了问题。

另一个感受是：在教学/实训场景下，代码"简单可理解"远比"架构优雅"重要。AI 给我的建议里包含统一路由、统一拦截器、UI 组件库、composable 复用等方向，这些在真实项目中都是合理的做法，但在 Day4 阶段只会增加环境依赖和理解门槛。我最后选择了"4 个独立的 API 方法 + 一个页面里写 4 个分支的 handleSubmit"，虽然看起来不够 DRY，但每类业务的逻辑都是自包含的，出了问题可以独立排查，对学习阶段来说反而是更好的选择。

最后我也注意到了几个 Day5 可以改进的地方：publisher 目前还是写死的字符串，等引入 Pinia 用户状态后应该从全局 store 读取；表单校验目前是手写 if/else，字段再多一点的话就会变得很长，可以考虑抽成更通用的校验规则；还有一个体验问题——成功发布后跳转到列表页，列表页是重新发起 GET 请求获取最新数据的，这个刷新过程肉眼可见，可以考虑在 Day5 用 Pinia 做一个发布成功后的即时通知，而不是让用户"等页面刷一下"。
