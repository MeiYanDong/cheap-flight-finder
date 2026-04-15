# 特价机票发现平台 — 可执行开发清单

> 基于 plan.md v2.0
> 按阶段排列，优先级从高到低

---

## Phase 1 — 紧急修复（影响产品可用性）

### 1.1 购票跳转改造

- [x] 修改 `lib/price-utils.ts`：删除 `getGoogleFlightsUrl`，新增 `getCtripUrl` 和 `getQunarUrl`
  - 携程格式：`https://flights.ctrip.com/online/list/oneway-{depIATA}-{arrIATA}?depdate={YYYY-MM-DD}`
  - 去哪儿格式：`https://www.qunar.com/site/oneway.jsp?from={depCity}&to={arrCity}&date={YYYY-MM-DD}`
- [x] 修改 `components/feed/FlightCard.tsx`：将单个「去购买」按钮改为「去携程」+「去去哪儿」双按钮
  - 携程按钮：蓝色 (`bg-blue-600`)
  - 去哪儿按钮：橙色 (`bg-orange-500`)
- [x] 修改 `components/calendar/PriceCalendar.tsx`：日期点击后展示的航班列表同步更新为双按钮
- [x] 修改 `components/inspiration/InspirationSearch.tsx`：目的地卡片跳转同步更新

### 1.2 价格透明度标注

- [x] 修改 `app/page.tsx`：首页顶部加数据来源说明横幅
  - 样式：黄色背景提示条，文案「价格来自飞常准，为参考价，实际以携程/去哪儿购票页面为准」
- [x] 修改 `components/feed/FlightCard.tsx`：价格数字旁加「参考价」灰色小字
- [x] 修改 `app/calendar/page.tsx`：日历下方加参考价说明文字
- [x] 修改 `components/inspiration/InspirationSearch.tsx`：结果列表上方加参考价说明

---

## Phase 2 — UI 全面升级

### 2.1 首页重设计

- [x] Header 优化
  - Logo 加飞机图标，字体加粗
  - 导航菜单增加 hover 动效
  - 整体高度和间距调整
- [x] Hero 区新增
  - 大标题：「今天，哪里的机票最便宜？」
  - 副标题：数据来源说明
  - 背景：渐变色或轻量插图
- [x] 筛选栏视觉升级
  - 改为胶囊按钮组样式，选中态更明显
  - 出发城市改为带图标的下拉选择器
- [x] 航班卡片重设计
  - 增加航线图示（出发地 ——✈—— 目的地）
  - 价格字号放大，颜色更醒目
  - 双按钮布局优化，携程/去哪儿视觉区分
  - 卡片 hover 效果：轻微上浮 + 阴影加深
  - 底部信息栏（航班号/舱位/准点率）样式统一
- [x] 侧边栏优化
  - 会员日倒计时卡片加航司 logo 色块
  - 省钱贴士加图标

### 2.2 价格日历重设计

- [x] 热力图颜色方案优化（更直观的绿→红渐变）
- [x] 日历格子尺寸调整，价格数字更清晰
- [x] 会员日日期加 🎯 标记（在日历格子右上角）
- [x] 选中日期高亮样式优化
- [x] 图例说明（低价→高价色阶）位置和样式优化

### 2.3 航司会员日页面重设计

- [x] 倒计时卡片升级
  - 加航司品牌色背景
  - 倒计时数字放大，更有紧迫感
  - 「去官网抢票」按钮改为各航司官网直链
- [x] 月历视图优化
  - 有促销的日期格子加彩色底色（按航司区分颜色）
  - 多航司同天促销时叠加显示
- [x] 各航司详情卡片
  - 加「可叠加平台」标签
  - 加「历史折扣力度」描述

### 2.4 目的地灵感页重设计

- [x] 搜索区域视觉升级，大标题更有吸引力
- [x] 目的地卡片加城市代表性背景色或图标（emoji）
- [x] 卡片网格布局优化（3列，响应式）
- [x] 加载状态骨架屏优化

### 2.5 全局样式

- [x] 统一圆角规范（卡片 `rounded-xl`，按钮 `rounded-lg`）
- [x] 统一阴影规范（默认 `shadow-sm`，hover `shadow-md`）
- [x] 统一间距规范（页面内边距 `px-6 py-8`）
- [x] Footer 优化：加数据来源说明 + 版权信息

---

## Phase 3 — 功能完善

### 3.1 航司会员日功能完善

- [x] 更新 `lib/airline-promotions.ts`：为每个航司加「官网直链」和「可叠加平台」字段
- [x] 更新 `components/airline/AirlineCalendar.tsx`：倒计时卡片按钮跳转各航司官网
  - 海南航空：`https://www.hnair.com`
  - 东方航空：`https://www.ceair.com`
  - 春秋航空：`https://www.ch.com`
  - 南方航空：`https://www.csair.com`
  - 厦门航空：`https://www.xiamenair.com`
- [x] 价格日历中标注会员日：在 `components/calendar/PriceCalendar.tsx` 中引入 `airline-promotions.ts`，对应日期加 🎯 标记

### 3.2 首页 Feed 功能完善

- [x] 扩充热门航线：从当前6条扩展到12条（覆盖更多出发城市）
- [x] 筛选栏「出发城市」联动 Feed 数据（切换城市时按需重新请求 API）
- [x] FilterBar 默认「全部出发」，显示所有已加载航线
- [x] 修复「今日特价」标签误导 — 改为显示实际搜索日期（如「明日特价 · 4月14日」）
- [x] FlightCard 显示出发日期（月/日），用户知道是哪天的航班
- [x] 数据更新时间显示优化（「刚刚更新」/「X分钟前更新」）

### 3.3 价格日历功能完善

- [x] 价格日历页默认展示北京→上海，无需用户手动触发
- [x] 往返模式：支持切换单程/往返，往返模式展示两个日历
- [x] ±3天弹性对比：选中日期后展示前后3天价格对比表格

---

## Phase 4 — 数据与稳定性

### 4.1 飞常准额度恢复

- [ ] 方案A：用新邮箱注册新账号，获取新的免费5000点
- [ ] 方案B：充值当前账号（充¥100享充1送4，得价值¥500额度）
- [ ] 更新 `.env.local` 中的 `VARIFLIGHT_API_KEY`

### 4.2 Mock 数据完善

- [x] 扩充 `lib/mock-data.ts`：补充更多航线的 Mock 数据（12条全覆盖）
- [x] Mock 数据覆盖所有热门航线（12条）
- [x] Mock 日历数据覆盖未来30天

### 4.3 错误处理完善

- [x] PriceCalendar 和 InspirationSearch 的 API 失败加错误提示（不再静默吞掉）
- [x] Suspense 加 fallback（calendar/page.tsx）
- [x] API 超时处理：请求超过5秒自动降级到 Mock（AbortController + 5s timeout）
- [x] 无数据状态：展示「该航线暂无数据，试试其他日期」
- [x] 网络错误：友好提示 + 重试按钮

---

## Phase 5 — 部署上线

### 5.1 Vercel 部署

- [x] 确认 Vercel 账号已登录
- [x] 项目推送到 GitHub（https://github.com/MeiYanDong/cheap-flight-finder）
- [x] Vercel 导入 GitHub 仓库
- [x] 在 Vercel 环境变量中配置 `VARIFLIGHT_API_KEY`
- [x] 触发首次部署，确认构建成功
- [x] 验证线上版本各页面功能正常
- [x] 线上地址：https://cheap-flight-finder-omega.vercel.app

### 5.2 部署后验证

- [x] 首页 Feed 正常加载（26条航班，12条航线）
- [x] 价格日历可查询
- [x] 携程/去哪儿跳转链接正确
- [x] 航司会员日官网跳转正确
- [x] 移动端基础可用（不报错）

---

## 优先级速查

| 优先级 | 任务 | 状态 |
|---|---|---|
| 🔴 P0 | 购票跳转改为携程+去哪儿 | ✅ 已完成 |
| 🔴 P0 | 全站加「参考价」标注 | ✅ 已完成 |
| 🟠 P1 | UI 全面升级 | ✅ 已完成 |
| 🟠 P1 | 航司会员日加官网直链 | ✅ 已完成 |
| 🟡 P2 | 价格日历加会员日标记 | ✅ 已完成 |
| 🟡 P2 | 飞常准额度恢复 | ❌ 未做 |
| 🟢 P3 | Vercel 部署 | ✅ 已完成 |

---

## 额外完成项（plan 外）

> 以下是开发过程中发现并修复的问题，不在原始 plan 中

- [x] 去哪儿 URL 格式修正：`oneway.jsp` → `oneway_list.htm`（旧格式已 404）
- [x] 折扣排序 bug 修复：两个分支都是 `a.price - b.price`，改为按价格/舱位全价比值排序
- [x] 设计 token 系统：从裸 Tailwind 颜色换成 CSS 变量体系（indigo primary + amber deal accent）
- [x] 强制 light mode：修复系统深色模式下页面不可读的问题（`.next` 缓存残留 + dark mode override）
- [x] 去掉所有页面 hero banner：直接进内容，FilterBar 作为主入口
- [x] FlightCard 入场 stagger 动画
- [x] 字体换成 PingFang SC 优先的系统字体栈
- [x] FlightCard 日期修复：booking URL 使用 API 返回的实际搜索日期，而非 mock 数据的硬编码 depTime
