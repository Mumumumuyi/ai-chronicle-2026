# DEVIN_HANDOFF_SEO — SEO 第一期交接（worktree: scratch_wb-seo，分支 devin/seo-phase1）

日期：2026-09-23

## 当前状态

SEO 第一期已按任务书完成全部源码改动，**未经构建验证**（本机规则禁止执行命令，验收由组长跑 `npm run build`）。
本 worktree 的 `dist/` 仍是旧构建产物，重建后才会反映本期改动。

## 本轮完成的改动

### 1. 信号修正（index.html）

- 删掉全部 hreflang `<link>`（含 x-default）：原来 6 条 `?lang=` 假 URL（站点只支持 zh/en/es/de/fr 且 `?lang` 无人消费，`ja` 不存在）。等第二期真多语 URL 上线再重新生成正确的 hreflang。
- 静态 canonical 从子站改为根域名 `https://mumumumuyi.github.io/`（原先静态值指向子站、运行时 JS 才改成根域，对弱渲染爬虫是反向信号）。
- `og:url` / `og:image` / `twitter:url` / `twitter:image` 全部改到根域名。
- og:description 顺手把 "25+项" 改成 "30项" 里程碑（与实际数据一致）。
- JSON-LD：`@id` 改为 `https://mumumumuyi.github.io/reader/#article`，补 `mainEntityOfPage`；publisher logo、WebSite `@id`/`url` 全部改根域名；删除虚假 `SearchAction`（站内没有 `?search=` 消费端）；headline 年份 1950 → 1943（与页面标题一致）。

### 2. 里程碑独立页（30 页）

- `src/types.ts`：`Milestone` 接口新增 `slug: string`。
- `src/data/timelineData.ts`：30 个里程碑全部补上可读英文 slug（见下表）。
- `src/utils/routes.ts`：
  - `resolveLocation()` 取代 `tabFromLocation()`，返回 `{ tab, milestoneSlug }`；`/milestone/<slug>/` 优先于 4 个 tab 路由，`#hash` 兼容逻辑保留。
  - 新增 `ALL_MILESTONES`（按时序展开的 milestone+epoch 扁平表）、`findMilestoneBySlug`、`hrefForMilestone`、`canonicalForMilestone`、`milestoneMeta`。
  - `applyRouteMeta(tab, milestoneSlug?)`：里程碑页有自己的 title（`事件名（年份）· 人工智能通史 | AI Chronicle 2026`）、description（summary 截 150 字）、canonical。
  - 删除了 x-default hreflang 更新代码。
- `src/components/MilestonePage.tsx`（新增）：`<article>` + 单 `<h1>` + 面包屑（首页 › 纪元 › 事件）+ 摘要/正文/事实表（关键人物、标志文献、算力代价）+ 历史影响 callout + tags + 同纪元其它里程碑链接 + 上/下里程碑导航 + 回 `/reader/` 链接。未知 slug 渲染 not-found 面板。展示层走 `getLocalizedEpoch/getLocalizedMilestone`（非 zh 用户看到已有翻译）。**未编造任何新史实，全部字段来自 timelineData.ts。**
- `src/App.tsx`：`activeTab` 状态升级为 `routeState`；新增 `handleOpenMilestonePage`（pushState + 记录访问日志）；popstate 走 `resolveLocation`；里程碑页时方向键切纪元被禁用。
- `src/components/LiquidEpochStage.tsx`：
  - 新增 prop `onOpenMilestonePage`。
  - 每张里程碑卡片增加 `阅读详情 →` 真 `<a href>`（点击卡片仍开 modal，两个入口共存）。
  - 新增"完整里程碑索引"区块：7 个纪元 × 全部 30 条里程碑的真链接列表（这是首页 HTML 出现全部 30 个 `/milestone/` 链接的来源，也顺带解决首页薄页问题）。

### 3. 构建/推送脚本

- 新增 `scripts/site_segments.cjs`：路由段的唯一数据源。**方案选择：正则从 `timelineData.ts` 提取 `slug:` 行**（CJS 无法 import TS；正则只匹配里程碑对象上的 slug 字段，slug 是字面量、格式受控，比引入 vite 插件产 routes.json 少一层构建耦合）。带重复/为空断言，出错即中断构建。
- `scripts/prerender.cjs`：`SEGMENTS = getSegments()`（4 + 30 = 34）；渲染结束后 `writeSitemap()` 生成 `dist/sitemap.xml`（34 条根域名 URL，lastmod=构建日）并同步写回 `public/sitemap.xml`；**子站构建（BASE≠'/'）时删除 dist/sitemap.xml**（子站 sitemap 只能收子站 URL，而 canonical 全在根域，所以不输出）。
- `scripts/push_search_engines.cjs`：URL 列表改为从 `getSegments()` 生成；删除子站 URL 与子站 sitemap ping。
- `scripts/submit_indexnow.cjs`（旧脚本）：URL 列表同步为全部根域 URL；keyLocation 修正为根域（原先错指子站路径）。
- `public/sitemap.xml`：已按生成格式重写为 34 条（与构建产物一致，防止构建前仓库状态漂移）。

### 4. slug 列表（30，按时间序）

| slug | id | 年份 |
|---|---|---|
| mcculloch-pitts-neuron | m-1943 | 1943 |
| turing-test | m-1950 | 1950 |
| dartmouth-workshop | m-1956 | 1956 |
| perceptron | m-1958 | 1958 |
| eliza | m-1965 | 1965 |
| perceptrons-book | m-1969 | 1969 |
| lighthill-report | m-1973 | 1973 |
| mycin | m-1976 | 1976 |
| hopfield-network | m-1982 | 1982 |
| backpropagation | m-1986 | 1986 |
| lenet | m-1989 | 1989 |
| fifth-generation-computer | m-1990 | 1990 |
| support-vector-machine | m-1995 | 1995 |
| deep-blue | m-1997 | 1997 |
| lstm | m-1997-lstm | 1997 |
| imagenet | m-2009 | 2009 |
| alexnet | m-2012 | 2012 |
| gan | m-2014 | 2014 |
| resnet | m-2015 | 2015 |
| alphago | m-2016 | 2016 |
| attention-is-all-you-need | m-2017 | 2017 |
| alphafold-2 | m-2020 | 2020 |
| gpt-3-scaling-laws | m-2020-gpt3 | 2020 |
| chatgpt | m-2022 | 2022 |
| gpt-4 | m-2023 | 2023 |
| llama-open-source | m-2023-open | 2023 |
| openai-o1 | m-2024-reasoning | 2024 |
| deepseek-r1 | m-2025-r1 | 2025 |
| agentic-runtime | m-2025-agents | 2025 |
| neuro-symbolic-convergence | m-2026-present | 2026.09 |

## 验收要点（组长执行）

- `npm run build`（tsc + vite build + prerender 34 页）。
- `dist/milestone/` 下 30 个目录，每个 index.html 含该事件 `<h1>`、独立 `<title>`、canonical `https://mumumumuyi.github.io/milestone/<slug>/`。
- `dist/sitemap.xml` 34 个 `<loc>` 全在根域。
- `dist/index.html` 无 hreflang、无 SearchAction、canonical=根域、含 30 个 `/milestone/` 链接。
- Playwright 1440 / 390 截图首页 + 两个里程碑页。
- `npm run build:subsite`：子站产物里不应再有 sitemap.xml；子站各页 canonical 仍指根域。

## 已知边界 / 注意点

- 里程碑页 title/description 当前只有中文（`milestoneMeta` 直接取 zh 数据）。本期站长拍板只做中文页，合理。
- 未知 slug 的 `/milestone/xxx/` 由 404.html 兜底 → SPA 渲染 not-found 面板，canonical 回落到 `/`。GitHub Pages 无法返回真 404 状态码，属平台限制。
- modal 弹窗保留（`onOpenMilestone` → `MilestoneModal` 未动）；里程碑页是并列入口。
- `dist/` 是旧产物，验收前必须重新 build。

## 下一期（多语）需要做什么

1. **语言 URL 化**：`resolveLocation` 支持 `/<lang>/...` 前缀（en/es/de/fr），`LanguageContext` 从 URL 而不是仅 localStorage/navigator 取语言；`hrefForTab`/`hrefForMilestone` 带语言前缀。
2. **hreflang 回归**：按真实存在的语言版本生成 hreflang 互链（注意回链对 + x-default），只列实际渲染的语言。
3. **prerender 矩阵**：`site_segments.cjs` 的 `getSegments()` 升级为 `lang × segment` 矩阵；`prerender.cjs` 里 localStorage 语言注入参数化（现在写死 `zh`）。
4. **内容缺口**：里程碑字段已有五语翻译（timelineTranslations.ts），但 `historyArticle.ts` 长文正文只有中文，`/en/reader/` 若上线需先翻译或隐藏。
5. **里程碑页 meta 本地化**：`milestoneMeta` 按语言取 localized summary/title。
6. sitemap 可加 `<xhtml:link rel="alternate">` 子节点，或保持 4 份语言 sitemap 分离。

## 没做（按约束）

- 未动变现组件 / monetizationConfig / translations.ts 变现文案 / AdSense / ads.txt。
- 未装依赖、未 git commit/push、未执行任何命令（仅 ls）。
- 未碰 `C:\Users\Amu\Desktop\scratch_wb`（变现任务在另一 worktree）。
