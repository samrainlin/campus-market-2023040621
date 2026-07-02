import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = __dirname

const results = []

function check(name, fn) {
  try {
    const result = fn()
    results.push({ name, status: result.status, detail: result.detail })
    console.log(`  [${result.status === 'pass' ? '✓' : '✗'}] ${name} - ${result.detail}`)
  } catch (e) {
    results.push({ name, status: 'fail', detail: e.message })
    console.log(`  [✗] ${name} - Error: ${e.message}`)
  }
}

function fileExists(relPath) {
  return fs.existsSync(path.join(projectRoot, relPath))
}

function dirExists(relPath) {
  const p = path.join(projectRoot, relPath)
  return fs.existsSync(p) && fs.statSync(p).isDirectory()
}

console.log('=== 校园轻集市 Day7 检测 ===')
console.log(`项目目录: ${projectRoot}`)
console.log('')

console.log('--- 1. 项目结构检查 ---')
check('src 目录存在', () => dirExists('src') ? { status: 'pass', detail: 'src 目录存在' } : { status: 'fail', detail: 'src 目录不存在' })
check('src/views 目录存在', () => dirExists('src/views') ? { status: 'pass', detail: 'src/views 目录存在' } : { status: 'fail', detail: 'src/views 目录不存在' })
check('src/components 目录存在', () => dirExists('src/components') ? { status: 'pass', detail: 'src/components 目录存在' } : { status: 'fail', detail: 'src/components 目录不存在' })
check('src/api 目录存在', () => dirExists('src/api') ? { status: 'pass', detail: 'src/api 目录存在' } : { status: 'fail', detail: 'src/api 目录不存在' })
check('src/stores 目录存在', () => dirExists('src/stores') ? { status: 'pass', detail: 'src/stores 目录存在' } : { status: 'fail', detail: 'src/stores 目录不存在' })
check('src/router 目录存在', () => dirExists('src/router') ? { status: 'pass', detail: 'src/router 目录存在' } : { status: 'fail', detail: 'src/router 目录不存在' })

console.log('')
console.log('--- 2. 核心页面检查 ---')
const requiredViews = [
  'HomeView.vue',
  'TradeView.vue',
  'LostFoundView.vue',
  'GroupBuyView.vue',
  'ErrandView.vue',
  'PublishView.vue',
  'MessageView.vue',
  'UserCenterView.vue',
  'LoginView.vue',
  'RegisterView.vue',
]
requiredViews.forEach((v) => {
  check(`页面 ${v}`, () => fileExists(`src/views/${v}`) ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
})

console.log('')
console.log('--- 3. 核心组件检查 ---')
const requiredComponents = [
  'AppHeader.vue',
  'AppLayout.vue',
  'AppNav.vue',
  'ItemCard.vue',
  'EmptyState.vue',
]
requiredComponents.forEach((c) => {
  check(`组件 ${c}`, () => fileExists(`src/components/${c}`) ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
})

console.log('')
console.log('--- 4. db.json 数据检查 ---')
check('db.json 存在', () => fileExists('db.json') ? { status: 'pass', detail: 'db.json 存在' } : { status: 'fail', detail: 'db.json 不存在' })
if (fileExists('db.json')) {
  try {
    const db = JSON.parse(fs.readFileSync(path.join(projectRoot, 'db.json'), 'utf-8'))
    const collections = ['users', 'trades', 'lostFounds', 'groupBuys', 'errands']
    collections.forEach((col) => {
      check(`db.json 中 ${col} 节点`, () => {
        if (!db[col]) return { status: 'fail', detail: '节点不存在' }
        if (!Array.isArray(db[col])) return { status: 'fail', detail: '不是数组' }
        return { status: 'pass', detail: `存在，共 ${db[col].length} 条数据` }
      })
    })
  } catch (e) {
    check('db.json 格式解析', () => ({ status: 'fail', detail: `JSON 解析错误: ${e.message}` }))
  }
}

console.log('')
console.log('--- 5. API 模块检查 ---')
const requiredApis = ['trade.ts', 'lostFound.ts', 'groupBuy.ts', 'errand.ts', 'user.ts', 'http.ts']
requiredApis.forEach((a) => {
  check(`API ${a}`, () => fileExists(`src/api/${a}`) ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
})

console.log('')
console.log('--- 6. Store 模块检查 ---')
const requiredStores = ['user.ts', 'favorite.ts']
requiredStores.forEach((s) => {
  check(`Store ${s}`, () => fileExists(`src/stores/${s}`) ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
})

console.log('')
console.log('--- 7. 路由配置检查 ---')
check('router/index.ts 存在', () => fileExists('src/router/index.ts') ? { status: 'pass', detail: '路由配置文件存在' } : { status: 'fail', detail: '路由配置文件不存在' })

console.log('')
console.log('--- 8. 每日证据卡检查 ---')
for (let i = 1; i <= 7; i++) {
  check(`Day${i}_Evidence.md`, () => fileExists(`docs/evidence/Day${i}_Evidence.md`) ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
}

console.log('')
console.log('--- 9. 入口文件检查 ---')
check('index.html 存在', () => fileExists('index.html') ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
check('package.json 存在', () => fileExists('package.json') ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
check('vite.config.js 或 vite.config.ts 存在', () => (fileExists('vite.config.js') || fileExists('vite.config.ts')) ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
check('src/App.vue 存在', () => fileExists('src/App.vue') ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })
check('src/main.ts 存在', () => fileExists('src/main.ts') ? { status: 'pass', detail: '存在' } : { status: 'fail', detail: '缺失' })

console.log('')
console.log('--- 10. 项目构建检查 ---')
let buildStatus = 'pending'
let buildDetail = ''
try {
  console.log('  运行 npm run build ... (可能需要几分钟)')
  execSync('npm run build', { cwd: projectRoot, stdio: 'pipe', timeout: 300000 })
  buildStatus = 'pass'
  buildDetail = '构建成功'
  console.log('  [✓] 项目构建 - 成功')
} catch (e) {
  buildStatus = 'fail'
  const stderr = e.stderr ? e.stderr.toString() : ''
  buildDetail = `构建失败: ${stderr.slice(0, 500)}`
  console.log(`  [✗] 项目构建 - ${buildDetail}`)
}
results.push({ name: '项目构建 (npm run build)', status: buildStatus, detail: buildDetail })

console.log('')
console.log('=== 检测结果汇总 ===')
const passed = results.filter((r) => r.status === 'pass').length
const failed = results.filter((r) => r.status === 'fail').length
console.log(`总检查项: ${results.length}`)
console.log(`通过: ${passed} 项`)
console.log(`失败: ${failed} 项`)

const now = new Date()
const timestamp = now.toLocaleString('zh-CN', { hour12: false })

let report = '# 校园轻集市 - Day7 检测报告\n\n'
report += `**检测时间**: ${timestamp}\n\n`
report += `**项目目录**: \`${projectRoot}\`\n\n`
report += `**检测结果**: ${passed} 项通过 / ${failed} 项失败 / 共 ${results.length} 项\n\n`

report += '---\n\n'
report += '## 1. 项目结构检查\n\n'
report += '| 检查项 | 结果 | 说明 |\n|---|---|---|\n'
results.slice(0, 6).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 2. 核心页面检查\n\n'
report += '| 页面文件 | 结果 | 说明 |\n|---|---|---|\n'
results.slice(6, 16).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 3. 核心组件检查\n\n'
report += '| 组件文件 | 结果 | 说明 |\n|---|---|---|\n'
results.slice(16, 21).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 4. db.json 数据检查\n\n'
report += '| 检查项 | 结果 | 说明 |\n|---|---|---|\n'
const dbStart = 21
const dbEnd = dbStart + 6
results.slice(dbStart, dbEnd).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 5. API 模块检查\n\n'
report += '| API 文件 | 结果 | 说明 |\n|---|---|---|\n'
const apiStart = dbEnd
results.slice(apiStart, apiStart + 6).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 6. Store 模块检查\n\n'
report += '| Store 文件 | 结果 | 说明 |\n|---|---|---|\n'
const storeStart = apiStart + 6
results.slice(storeStart, storeStart + 2).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 7. 路由配置检查\n\n'
report += '| 检查项 | 结果 | 说明 |\n|---|---|---|\n'
const routerStart = storeStart + 2
results.slice(routerStart, routerStart + 1).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 8. 每日证据卡检查\n\n'
report += '| 证据卡文件 | 结果 | 说明 |\n|---|---|---|\n'
const evidenceStart = routerStart + 1
results.slice(evidenceStart, evidenceStart + 7).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 9. 入口文件检查\n\n'
report += '| 检查项 | 结果 | 说明 |\n|---|---|---|\n'
const entryStart = evidenceStart + 7
results.slice(entryStart, entryStart + 5).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n## 10. 项目构建检查\n\n'
report += '| 检查项 | 结果 | 说明 |\n|---|---|---|\n'
const buildStart = entryStart + 5
results.slice(buildStart).forEach((r) => {
  report += `| ${r.name} | ${r.status === 'pass' ? '✅ 通过' : '❌ 失败'} | ${r.detail} |\n`
})

report += '\n---\n\n'
if (failed === 0) {
  report += '## ✅ 检测结论\n\n'
  report += '全部检测项通过，项目结构完整，核心页面、组件、API、Store、数据和证据卡均齐全，构建成功，可以正常提交和展示。\n'
} else {
  report += '## ⚠️ 检测结论\n\n'
  report += `有 ${failed} 项未通过，请根据上方表格修复缺失内容后重新检测。\n`
}

report += '\n---\n\n'
report += '**备注**: 本检测报告由项目本地检测脚本自动生成，用于 Day7 项目验收阶段归档。\n'

const reportPath = path.join(projectRoot, 'CHECK_REPORT.md')
fs.writeFileSync(reportPath, report, 'utf-8')
console.log('')
console.log(`检测报告已生成: ${reportPath}`)

process.exit(failed === 0 ? 0 : 1)
