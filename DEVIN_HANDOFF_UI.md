# UI v2 重建 — 分块交接记录

设计依据：`design/prototype-v2.html`（唯一视觉标准）。token：--ob/--ob2/--pearl/--mist/--ink/--stone/--gold/--gold2。

- [x] **块 1 · 全局 token + 字体 + Navbar + Footer**：重写 `tailwind.config.js`（ob/pearl/mist/ink/gold/gold2/goldd + display/serif/sans/mono 四套字体族）；重写 `src/index.css`（移植原型全部组件类：mono/fade/rv/lp/btn-gold/pill/pill-dark/eyebrow/hero-net/ch-row/roll/mq/arch-card/panel-dark/modal-* + 打印与 prefers-reduced-motion；删除全部 liquid-glass/sheen/spotlight/pulse-ring/sound-wave/dossier/epoch-slide 旧类）；`index.html` 换成原型同款 Google Fonts（Cormorant Garamond/Noto Serif SC/Inter/JetBrains Mono）并把 meta 描述里的「液态玻璃」改掉；重写 `Navbar.tsx`（obsidian 细线顶栏 + mono 链接 + 汉堡菜单 + 底部 Dock 重配色为黑金，音效开关整体移除，三连击后台入口保留，真实 href + aria-current 保留）；`LanguageDropdown.tsx` 改为 mono 细线风格；重写 `Footer.tsx`（CHRONICLE 大水印 + mono 链接行：爱发电/长卷/实验室/GitHub）。
- [x] **块 2 · 首页**：新增 `src/hooks/usePrefersReducedMotion.ts`（matchMedia）与 `src/hooks/useScrollReveal.ts`（IntersectionObserver + data-n 计数滚动）；新增 `src/components/EpochSpecimen.tsx`（原型 7 幅线稿逐行移植 + sand 溶解滤镜 defs）；新增 `src/components/HomePage.tsx`（五段式：全屏 hero 含几何 logotype + 里程碑刻度 + 延迟神经网络 canvas + 三栏 mono 子导航 + 当前展品；珍珠白「探索」区含分类 pill 与四格计数；黑曜石「时代藏品」浏览器 7 时代 3.5s 自动轮播 + sand 转场 + 编号滚动 + 进度条；里程碑字幕带；珍珠白 30 件藏品筛选网格，全部数字由 timelineData 实时计算，卡片链接 `/milestone/<slug>/`）；重写 `App.tsx`（接入 HomePage/Footer，删除 MilestoneModal 与 LiquidEpochStage 引用、activeEpoch/activeMilestone 状态与方向键时代切换）。
- [x] **块 3 · 里程碑页**：重写 `MilestonePage.tsx`——顶部黑曜石色块放该时代 EpochSpecimen 线稿 + 面包屑 + 金线眉题（时代罗马号/年代）+ Cormorant 大号年份；正文为 serif 标题/副题 + 事实表（hairline dl 栅格：关键人物/标志性文献/算力代价）+ 金左线「历史影响」引述 + pill-dark 标签 + 同时代藏品 hairline 列表 + 上一件/下一件 gap-px 分割卡 + 返回长卷 btn-ghost；404 态同语言。全部真实 href + 客户端导航、多语言、`.rv` 滚动出场保留。
- [x] **块 4 · 长卷**：重写 `ArticleReader.tsx`——顶部 2px 金色阅读进度条；刊头式头部（eyebrow + serif 大题 + mono 元数据 + 金左线摘要框 + btn-gold 导出/btn-ghost BibTeX）；粘性目录改为 hairline 章节索引（金左边线指示当前章）；章节改为 hairline 分隔的无卡片排版、epigraph 金左线引文、小节金短线题、洞见框 panel-dark-2 + 金线；两处赞助位与文末下载/咖啡/品牌合作条全部换成 hairline + 金按钮（链接、promoCode 复制、affiliate 埋点、window.print、回顶部、移动端 TOC 浮键与底抽屉、BibTeX modal 全部保留）；Icon import 清理（去 Server/Code/Quote/Sparkles）。
- [x] **块 5 · 实验室 + 工具页 + 弹窗**：
  - `LiquidParadigmWidget.tsx` 重写——黑曜石底 + eyebrow 眉题 + serif 标题；三范式（符号主义/连接主义/智能体系统）hairline 可切换卡（选中项金左边条）；scaling-law 滑块推演面板、硬件配置测算、四家算力/工具伙伴卡（affiliate 链接 + promoCode 复制 + 埋点）全部改为 panel-dark/hairline + 金强调；`.rv` 滚动出场接入。
  - `AffiliateEcosystem.tsx` 重写——编辑式页头 + 分类 pill-dark 筛选 + 工具 hairline 网格 + 官网直达链接 + promo 复制；工具提交弹窗与赞助/联系区块（爱发电/BMC/mailto 门控）换为 modal-backdrop/modal-panel 新弹窗规范；修复 `useScrollReveal` deps 引用 `activeCategory` 早于其 `useState` 声明的顺序问题；清掉未使用的 Server/Code2/Cpu icon import。
  - `MonetizationBanner.tsx` 重写——全宽 hairline 赞助条：合作伙伴徽章 + 赞助测算/离线长卷下载/咖啡三连 CTA，接三个弹窗。
  - `SponsorCoffeeModal.tsx` 重写——modal-backdrop + modal-panel + 金 Tab（爱发电/BMC/收款码），QR 门控与空渠道如实提示保留，affiliate 埋点保留。
  - `PremiumBundleModal.tsx` 定点改样式——modal-backdrop/modal-panel、eyebrow+serif 头、panel-dark-2 价格区、hairline 商品清单、btn-gold/btn-ghost；三步流（details/checkout/delivered）、样章与整包下载、编号复制逻辑零改动；清掉未使用的 FileText/Zap import。
  - `SponsorCalculator.tsx` 定点改样式——modal-panel 外壳、CNY/USD hairline 切换、展位卡改为 hairline 单元格（选中金左边条）、周期档 gap-px 网格、panel-dark-2 报价卡、hairline 输入框（focus 金边）、btn-gold 提交、站长 CRM 抽屉；清掉未使用的 Calculator icon import。
  - `src/index.css` 补回 `.animate-fadeIn`（AdminDashboard/AdminMonetizationHub 仍在用的自定义类，重写 tailwind.config 时随旧动画一并移除过，避免后台面板丢过渡）。
  - admin 三件套（AdminSecurityCheckpoint/AdminDashboard/AdminMonetizationHub）核查：全部使用标准 Tailwind 工具类，未引用任何已删除的自定义类，无需改动。
  - 无引用旧组件 `TimelineView.tsx`/`HeroSection.tsx`/`LiquidEpochStage.tsx`/`MilestoneModal.tsx`/`ParadigmSimulator.tsx` 保留未删（其中残留 liquid-glass 类不影响构建，若组长确认可删再清）。
  - 音效：块 1 已将 `audioEffects`/`soundFX` 调用与开关从 Navbar/App 移除，文件保留。

## tsc 修复轮（组长 build 后回报，已全部修掉）

- `AffiliateEcosystem.tsx`：`Server`/`Code2`/`Cpu` 在 `categories` 数组的 `icon` 字段中被引用（非 JSX），上一轮误删 import——已补回。
- `PremiumBundleModal.tsx`：`FileText`/`Zap` 在 `bundleItems` 数组的 `icon` 字段中被引用——已补回。
- `HomePage.tsx`：`ALL_MILESTONES` 元素类型是 `MilestoneRef`（`{ milestone, epoch }`，见 `src/utils/routes.ts:52-60`）而非 `Milestone`——4 处遍历改为 `r.milestone.*`（logotype 刻度、本地化 map、年份 span、分类集合）；`categories` 显式标注 `useMemo<MilestoneCategory[]>`，`CATEGORY_LABEL[cat]` 索引报错随之消除。下游 `milestones`/`filtered` 均为 `Milestone[]`，无需再改。
- 自查结论：`MilestonePage.tsx` 的 `ALL_MILESTONES[i].milestone` 用法本就正确；`getLocalizedMilestone` 返回完整 `Milestone`（`timelineTranslations.ts:593`），`m.category` 保持 `MilestoneCategory` 类型；HomePage 的 `#sand` 滤镜是内联挂载的（`:333-336` `dispRef` 在 `feDisplacementMap` 上），`EpochSpecimen sand` prop 不悬空，`SandFilterDefs` 为备用导出未使用不报错；ArticleReader/LanguageDropdown/MonetizationBanner/LiquidParadigmWidget 等本轮新写文件 import 与使用已逐个对齐。
