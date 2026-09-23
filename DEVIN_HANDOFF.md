# DEVIN_HANDOFF.md — 项目交接报告

> 执行人：Devin（组长：Claude）。
> 方法说明：全部结论来自逐文件阅读 + grep 交叉验证，每条标注 `文件:行号`。无法执行的验证（git status、npm build、线上 curl）已标注「待组长核」。

---

## 第二轮：诚实化改造（本轮改动明细）

**目标**：站长未给收款链接，本轮只"去掉假的"，不接真的。所有改动均可对应任务卡条目。

### 改动的文件

| 文件 | 改动 |
|---|---|
| `src/utils/monetizationConfig.ts` | RunPod `?ref=ai-chronicle` 改为裸官网（:62）；删 `CHRONICLE10`/`AUTODL2026`/`TOGETHER2026` 三个 promoCode；9 家 perkBadge 全部由返利/立减/折扣话术改为中性产品特点（:64-65,79-80,94-95,110-111,125-126,141-142,156-157,172-173,186-187）；`DEFAULT_OWNER_CONTACT` 的 contactEmail/wechatId/telegramHandle/afdianUrl/buyMeACoffeeUrl/customNoticeZh 全部置空（:196-208）。赞助报价未动（任务卡明确不碰） |
| `src/components/SponsorCoffeeModal.tsx` | 删编造的"荣誉榜"4 条假赞助记录及渲染 UI；删 USDT/ETH 区块（35 位无效地址）；删引用空邮箱的 qrNote。新增 `hasWechatChannel/hasGlobalChannel/hasAnyChannel` 门控：二维码区仅在 `qrCodeUrl` 配置时渲染（不再显示占位插画冒充收款码）；爱发电/BMC 链接仅在对应 URL 存在时渲染；无任何渠道时显示如实提示"赞助收款通道暂未开通"。清掉无用的 Check/Copy/Sparkles import |
| `src/components/PremiumBundleModal.tsx` | 改为"免费下载"：删 ¥19.9/¥99 划线价、"限时研学特惠"、"待付"、订单核销话术；删爱发电/BMC 支付链接区与二维码容器；商品清单改为实际交付物（单个 Markdown：全文 + 内嵌 BibTeX 附录 + 公式附录，删 PDF/EPUB/4K 壁纸/HTML 仿真器的虚假承诺）；**移除邮箱字段**——原标签承诺"接收下载凭据与更新通知"，而邮箱只写进访客自己的 localStorage，不会通知任何人，属不实收集；"订单号"改称"下载编号"；delivered 页文件名显示改为与真实下载文件名一致。清掉 Image/QrCode/CreditCard/ArrowUpRight import 及 saveLead/getOwnerContact/recordAffiliateAction import |
| `src/components/ArticleReader.tsx` | **Newsletter 入口整个隐藏**（选择见下）：删订阅按钮、订阅弹窗、相关 state 与 saveLead/Mail import。赞助位文案中性化："算力与工程特约通道"→"算力与工程工具直达"；"免费领取开发者算力代金券"/"领 $10 体验金"/"Claim $10"→ 官网直达表述；"已被全球核心学术圈与工程团队实测验证"→"精选主流…均为官网直达"；"广告与特约赞助通道"→"站点支持通道"。资产包卡文案改为免费 Markdown 离线长卷 |
| `src/components/AffiliateEcosystem.tsx` | 删"所有优惠码与推荐位官方验证有效"徽章（含 ShieldCheck import）；标题/副标题去掉"特权/Perks/Verified"字样；`directPerkText`→"点击直达官网"；透明声明改为如实陈述"均为官网直达链接，当前不包含付费推广位"；商务邮箱区块加 `{contactEmail && ...}` 门控（mailto 不再产出空收件人） |
| `src/components/MonetizationBanner.tsx` | "4K 离线资产包"→"免费离线长卷"；标题"资产包下载"→"离线长卷免费下载"（五语言同步） |
| `src/components/LiquidParadigmWidget.tsx` | 4 个 fallback partner 对象同步去假码/假返利/假推荐链接；"领取 $10 并拉起算力"→"前往 RunPod 拉起算力" |
| `src/i18n/translations.ts` | 五语言同步修正死键中的不实文案：`verifiedOfficial`（含验收 grep 的"官方验证"）、`affiliateDisclaimerBody`、`ecosystemSubtitle`、`ecosystemTitle`、`directClaimBtn`；zh `navEcosystem`"生态特权"→"生态工具"；zh `newsletterSuccessMsg`"已发送至收件箱"→"订阅意向已记录" |

### 第 5 条的选择：隐藏 Newsletter 入口（而非改提示语）

理由：填了邮箱也只写进访客自己浏览器的 localStorage（`leadStorage.ts`），站长收不到、也不会有任何邮件送达——即使提示语改诚实，收集动作本身仍无意义且在暗示一个不存在的订阅服务。隐藏入口最干净。`leadStorage.ts` 与 `translations.ts` 中的 newsletter 键保留（`types.ts` 接口要求，且不再被渲染）。

### 已知残留问题（本轮范围外，需组长/站长决策）

1. **`SponsorCalculator.tsx:76` 的"原价"**：验收 grep 会命中，但该文件在任务卡"不许动"清单里。它是计算器"周期总价"标签，不是虚假折扣锚点——请组长定夺是否破例改一字（如"合计"）或接受命中。
2. **SponsorCalculator 商务邮箱**：contactEmail 现为空，其生成的 mailto 为 `mailto:?subject=...`、方案 PDF 文本里"Official Inquiries:"为空——因不许动该文件未处理。填真实邮箱后自愈。
3. **站长本机 localStorage 残留**：若站长浏览器曾在后台保存过旧 partners/contact 配置，`getMonetizationPartners`/`getOwnerContact` 的 merge 会 resurrect 旧假码——站长需在后台重新保存一次或清 localStorage。
4. **测试脚本失配**：`scripts/test_monetization_loop.cjs:161`（断言订阅按钮）、`scripts/verify_monetization_funnel.cjs:168`（断言爱发电链接）会因本轮删除而失败——`npm run build` 不涉及它们，但若组长跑这些脚本需同步更新。
5. **HANDOFF.md:8 旧令牌明文**仍在（第一轮已报，本轮范围外）。

### 下一步需要站长提供（接"真的"）

- 微信/支付宝收款码图片（放 `public/`，后台填 `qrCodeUrl`）、爱发电主页、BuyMeACoffee 页面
- 真实商务邮箱与微信号（SponsorCalculator 与生态页 mailto 才能活）
- 各平台真实联盟链接/码（RunPod/ElevenLabs/AutoDL 优先）
- AdSense 审核结果 + CMP 同意方案

---

## 第一轮摸底：当前状态 / 本轮完成了什么 / 下一步（给组长的快速摘要）

- **本轮完成**：通读 HANDOFF.md、全部变现组件、`src/utils/` 四个核心文件、`index.html`、`public/`、`scripts/prerender.cjs`、`App.tsx` 路由与后台鉴权链路。产出下方 6 节报告 + 站长问题清单。
- **一句话结论**：**变现架子搭得很全，但几乎所有收款通道都断了**——9 个联盟链接全是裸官网链接或自编推荐码；赞助/订阅/购买三类线索只写进**访客自己的 localStorage**，站长永远收不到；收款二维码、爱发电、BuyMeACoffee、商务邮箱全是占位值；唯一真实打通的是 AdSense（审核中）。
- **最致命的单点**：`saveLead()`（`src/utils/leadStorage.ts:15`）写 localStorage → 访客的赞助意向、付费邮箱、订阅邮箱全部留在访客浏览器里。这不是「数据不真实」，是**数据根本到不了站长手里**。
- **下一步**：见 §6 优先级排序。组长需要先核两件事：① `git status` 确认本文件是唯一改动；② HANDOFF.md §八遗留的 push（线上仍在跑含旧令牌明文的旧 bundle）。

---

## 1. 项目结构地图

**技术栈**：Vite 6 + React 18 + TS + Tailwind 3，纯静态站，零后端、零真实第三方 SDK（`package.json:12-30`，依赖仅 clsx/lucide-react/tailwind-merge）。

- **入口**：`index.html`（AdSense + GSC meta 在 `index.html:8,11`）→ `src/main.tsx:6` → `src/App.tsx`。
- **路由**：无 react-router，单页 4 个 tab（`stage`/`lab`/`reader`/`ecosystem`），用 `history.pushState` 切伪路径 `/`、`/reader/`、`/lab/`、`/ecosystem/`（`src/App.tsx:78-85`，路由表 `src/utils/routes.ts:16-45`）。旧 `#hash` 链接自动升级（`App.tsx:60-63`）。
- **数据文件**：`src/data/historyArticle.ts`（1.8万字长卷）、`src/data/timelineData.ts`（纪元/里程碑）、`src/data/timelineTranslations.ts`、`src/i18n/translations.ts`（zh/en/es/de/fr 五语）。
- **构建**：`npm run build` = `tsc && vite build && node scripts/prerender.cjs`（`package.json:8`），产出 `dist/`：`base:'/'`（`vite.config.ts:7`）+ 4 条路由的预渲染 HTML（`scripts/prerender.cjs:25,90-92`，Playwright 截图 DOM 快照）+ `404.html`（`prerender.cjs:106`）。`npm run build:subsite` 同流程但 `--base=/ai-chronicle-2026/`（`package.json:9`）。
- **部署**：**无 CI/CD、无 .github/workflows**——手工把 `dist/` 推到两个 GitHub 仓库：`Mumumumuyi/mumumumuyi.github.io`（根域名，现在就是完整站，`vite base:'/'` 同产物直接用）和 `ai-chronicle-2026`（子站，`/ai-chronicle-2026/`）。canonical 统一指向根域名（`src/utils/routes.ts:6,61-64`；`dist/index.html:19` 证实当前 dist 是根域名构建）。
- **后台**：`#admin` 入口 = Logo 1200ms 内连点 3 次（`src/components/Navbar.tsx:51-67`）/ `Ctrl+Shift+Alt+A`（`App.tsx:41-50`）/ URL 暗号 `?admin_vault=`、`?vault=`、`?admin=true`、`#vault-console`、`#admin-portal`（`src/utils/securityWall.ts:241-253`）→ `AdminSecurityCheckpoint` → `AdminDashboard`（4 tab：遥测/CRM/变现/安全）。
- **所有「数据」都是 localStorage**：访客日志 `ai_chronicle_visitor_logs_v1`、线索 `ai_chronicle_leads_ledger_v1`、联盟点击 `ai_chronicle_affiliate_metrics_v1`、站长配置 `ai_chronicle_owner_contact_v1` 等（`analyticsTracker.ts:36-39`、`leadStorage.ts:13`、`monetizationConfig.ts:50-53`）。**注意：这些数据存在每个访客各自的浏览器里，互不相通**；唯一的外发通道是可选 Supabase 同步（`analyticsTracker.ts:196-212`），默认关闭（`monetizationConfig.ts:213-217`），且只同步访客日志、**不同步线索**。

## 2. 变现渠道清单

| # | 渠道 | 代码位置 | 状态判定 |
|---|---|---|---|
| 1 | **Google AdSense** | `index.html:11`（`ca-pub-8861051283907117`）；`public/ads.txt:5`；`dist/ads.txt:5` | ✅ **真实可收钱**。Publisher ID 是站长本人账号（HANDOFF §二：从站长已登录的 Edge AdSense 后台实抓）。站点已验证 + 已 Request review，状态「Getting ready」。遗留：EEA/UK CMP 同意声明未配置（HANDOFF §七） |
| 2 | **联盟返佣 9 家** | 配置 `src/utils/monetizationConfig.ts:56-197`；展示 `AffiliateEcosystem.tsx:191-273`（生态页）、`LiquidParadigmWidget.tsx:22-59`（Lab 页内嵌）、`ArticleReader.tsx:82-85,370-563`（文内两卡位） | ❌ **全部占位/疑似编造**。RunPod `?ref=ai-chronicle`（`monetizationConfig.ts:62`）是自编 slug，除非站长真在 RunPod 后台注册到这个 ref，否则零返佣；`CHRONICLE10`/`AUTODL2026`/`TOGETHER2026` 三个码（:64,:80,:158）格式是拍脑袋风格，无任何证据是官方下发的。其余 6 家（AutoDL/Lambda/Cursor/Windsurf/Groq/Together/Midjourney/ElevenLabs）链接全是**裸官网 URL 无返佣参数**，点了也是白送流量 |
| 3 | **B2B 赞助询盘** | `SponsorCalculator.tsx`（4 展位测算器 :15-27，¥1500-3500/月）；`AffiliateEcosystem.tsx:122-128,344-371`（mailto 直连）；落地 `SponsorCalculator.tsx:200` → `saveLead` | ⚠️ **断链**。两条路都收不到：① `saveLead` 写访客本地 localStorage（见 §3）；② mailto 指向 `contact@aichronicle.dev`（`monetizationConfig.ts:200`）——该域名大概率不属于站长，询盘邮件发往虚空 |
| 4 | **爱发电** | `monetizationConfig.ts:203`；引用 `SponsorCoffeeModal.tsx:191-205`、`PremiumBundleModal.tsx:434-445`、`AffiliateEcosystem.tsx:403-413` | ⚠️ **缺站长信息**。当前值 `https://afdian.com` 是平台首页，不是站长主页 |
| 5 | **Buy Me a Coffee** | `monetizationConfig.ts:204`；引用 `SponsorCoffeeModal.tsx:257-266`、`PremiumBundleModal.tsx:447-458`、`AffiliateEcosystem.tsx:415-425` | ⚠️ **缺站长信息**。当前值 `https://buymeacoffee.com` 平台首页 |
| 6 | **微信/支付宝收款码** | `SponsorCoffeeModal.tsx:173-211`；`PremiumBundleModal.tsx:462-482`；配置字段 `monetizationConfig.ts:205`（`qrCodeUrl`） | ⚠️ **缺站长信息**。`qrCodeUrl` 默认为空字符串，前台显示的是通用占位插画（`SponsorCoffeeModal.tsx:183-187`），扫不了也收不了钱 |
| 7 | **付费资料包 ¥19.9** | `PremiumBundleModal.tsx` 三步流（details→checkout→delivered）；触发于 `MonetizationBanner.tsx:99-102` 与 `ArticleReader.tsx:587-594,822` | ⚠️ **流程通但不真收款 + 货不对板**。无任何支付校验——填个邮箱就交付（`PremiumBundleModal.tsx:136-144`）；且实际交付物只是**一个 .md 文件**（:146-264 `triggerFileDownload`），与宣传的「PDF+EPUB+Markdown / 3840×2160 PNG/SVG / 独立 HTML 仿真器 / BibTeX 库」（:77-102）严重不符 |
| 8 | **加密货币 USDT/ETH** | `SponsorCoffeeModal.tsx:269-288` | ❌ **假地址**。硬编码 `0x71C2834bE2816f9173921098b18209849b2`——`0x` 后仅 34 位十六进制，合法 ERC-20 地址应为 40 位。这是无效地址，访客若真转账将永久丢失（当前不会到账任何人） |
| 9 | **Newsletter 订阅** | `ArticleReader.tsx:238`（入口按钮）,`:689-755`（弹窗）→ `saveLead(email,'newsletter')` | ⚠️ **不直接收钱但影响信任**。邮箱存访客本地；成功文案谎称已发邮件（见 §4）。需要真实邮件服务（或至少真实收件邮箱 + 手工导出链路）才有价值 |
| 10 | **Supabase 云同步**（基础设施，非渠道） | `analyticsTracker.ts:196-212,232-253`；配置 UI `AdminMonetizationHub.tsx:586-666`；建表 SQL `:211-234` | ⚠️ 默认关闭未配置。**这是目前唯一能把别的访客数据传回站长电脑的通道**，但只覆盖 visitor_logs，不覆盖 leads |

## 3. 各渠道「真正收钱」缺站长提供什么

| 渠道 | 需要站长提供 |
|---|---|
| AdSense | 无代码层缺失。仅需站长：等审核结果；在 AdSense 后台决定 CMP 同意信息方案（HANDOFF §七遗留 1） |
| 联盟返佣 | 站长在各家真实注册联盟计划后给的**专属 referral 链接/码**。优先级：RunPod（有公开 CPS 返佣）、ElevenLabs（官方 affiliate ~22% 首年）、AutoDL（国内邀请返利）；拿到后填进 `AdminMonetizationHub` 或 `monetizationConfig.ts` 默认值 |
| B2B 赞助 | ① **真实商务邮箱**（替换 `contact@aichronicle.dev`）② 真实微信号（替换 `AICronicle_Admin`）③ 若想让表单询盘真正入库：一个后端收件通道（Formspree/Web3Forms 免费层即可，或扩展 Supabase 同步到 leads 表） |
| 爱发电 / BMC | 站长注册后的个人主页 URL（`afdian.com/a/xxx`、`buymeacoffee.com/xxx`） |
| 收款二维码 | 微信+支付宝收款码图片，放 `public/`（如 `public/sponsor-qr.png`），后台填路径即生效（`AdminMonetizationHub.tsx:487-508` 已有预览 UI） |
| 资料包 | 若要真收 ¥19.9：① 真实收款入口（爱发电商品页/BMC/收款码）② **真实交付物**（得真的产出 PDF/EPUB/4K 图/仿真器 HTML，否则现在宣传的全是空头支票）③ 核销机制（哪怕是「付款后截图发邮箱、人工发下载链接」的诚实流程） |
| 加密货币 | 站长自己的真实 ERC-20 地址（42 位），或干脆删掉这个通道 |
| Newsletter | 真实发信渠道（Substack/竹白/邮件列表服务），或改成「留下邮箱，站长手工导出 CSV 后群发」并在文案里说清楚 |

## 4. 对访客不诚实的文案（AdSense 审核与法律风险）

| 位置 | 文案 | 问题 |
|---|---|---|
| `SponsorCoffeeModal.tsx:64-69` | 「近期赞助与支持者荣誉榜」：Dr. Turing_Fan ¥99「10m ago」、NeuralNomad、K. Takahashi、QuantDev_99 共 4 条 | **纯编造**的假赞助记录+假留言+假时间戳 |
| `SponsorCalculator.tsx:105` | 「月均 50,000+ 高净值曝光」/ "50k+ Monthly AI Devs" | 无任何流量证据；本站连统计后端都没有，纯属虚构卖点，面向的是付数千元的 B2B 客户——欺诈风险最高的一条 |
| `AffiliateEcosystem.tsx:62` | 「所有优惠码与推荐位官方验证有效」/ "All coupons & referral links officially verified" | 假。没有一个码经过官方验证 |
| `monetizationConfig.ts:65,81,96,113,128,144,159,175,190` | perkBadge：「立享10%算力返利」「新人立减¥20」「注册立赠$5」「首月80%专属抵扣」「年付享20%专属折扣」等 | 均声称了未经证实的优惠权益；访客拿着 `CHRONICLE10` 去 RunPod 结账只会报错 |
| `ArticleReader.tsx:378,443,477` | 「免费领取开发者算力代金券」「领 $10 体验金」/ "Claim $10 on RunPod" | RunPod 并无此 $10 赠送活动（待站长确认），裸链接也不含任何券 |
| `ArticleReader.tsx:723` | 「首期《2026 测试时算力白皮书》已发送至您的收件箱」 | 什么都没发送，只写了 localStorage |
| `PremiumBundleModal.tsx:377-378` | 「¥19.9（~~原价 ¥99.0~~）」+「限时研学特惠」 | 虚构原价锚点 + 虚假限时，典型违规促销话术 |
| `PremiumBundleModal.tsx:77-102` | 商品清单承诺 PDF+EPUB、4K PNG/SVG 壁纸包、Standalone HTML 仿真器、BibTeX 库 | 实际交付只有单个 .md（:264）。若真收钱了属于货不对板 |
| `SponsorCalculator.tsx:92-94` | 「我们的商务团队将在 24 小时内通过 X 联络您并锁定排期位」 | 线索进不了站长手，不会有人联络；「商务团队」实为单人站长 |
| `monetizationConfig.ts:210` | 「支持微信/支付宝/PayPal/USDT 结算。合作申请将在 4 小时内由主理人亲自响应」 | 四条结算通道无一真实接通 |
| `AdminDashboard.tsx:145,635` | `estimatedRevenue = bundleCount*299 + sponsorCount*5000`；「单价 ¥299 终身特权」 | 后台 GMV 估算口径与前台 ¥19.9 售价自相矛盾（仅站长可见，优先级低但说明数字是编的） |

## 5. 安全问题

1. **HANDOFF.md:8 含后台令牌明文**。该令牌已轮换失效（HANDOFF §八），危害有限，但 HANDOFF.md **不在 `.gitignore`**（`.gitignore:1-7` 只排了 `CLAUDE.md`/`.vercel`/`.antigravity`/`node_modules` 等）——若此文件被 commit 进 git，旧令牌将留在历史里。`CLAUDE.md` 内同款令牌因 gitignore 不会入库。**待组长核**：`git ls-files HANDOFF.md`。
2. **#admin 鉴权是纯前端、可绕过**：`verifyPasskey` 只做 `SHA-256(salt+input)` 与常量 `SOVEREIGN_AUTHORIZED_HASH` 比对（`securityWall.ts:18,112-137`）。绕过方式任选：往 localStorage/sessionStorage 手写 `ai_chronicle_sec_session_v1`（`expiresAt` 设未来）即可过 `isSessionValid()`（:156-171）；或 React DevTools 直改 `showAdminDashboard`。审计日志也写 localStorage（:221-238），同样可篡改。**但影响面低**：后台保护的只是当前浏览器自己的 localStorage 数据，无服务端资源；真正需要说的实话是——这套「安全墙」防的是好奇访客，不是攻击者。
3. **`updateMasterPasskey` 是死功能**：写入 `CUSTOM_HASH_KEY`（`securityWall.ts:199-209`），但 `verifyPasskey` 从不读它（:126 只比对 `SOVEREIGN_AUTHORIZED_HASH`）。在 UI 里「改密码」不会有任何效果。
4. **令牌泄露修复未上线**：HANDOFF §八——本地 `dist/assets/index-IlxjbBy7.js` 已确认**不含明文**（本轮 grep `4/0ATsMZ` 全仓仅命中 `HANDOFF.md:8`；新 bundle 只含 hash `1ca27dee`，属正常公开），但线上两个 URL 仍在服务含旧令牌的 `index-Bj7P-n0l.js`，push 被权限拦截。**这是当前唯一悬空的线上安全问题**，等组长/用户手动 push。
5. **Supabase 建表脚本默认全开公读写**（`AdminMonetizationHub.tsx:230-234`：`Allow public insert` + `Allow public read`）。若站长启用云同步，任何人拿到 anon key（它在站长自己浏览器 localStorage，不会外泄——但表是公网的）都能往里灌假访客记录、读走全表。建议至少改成 insert-only + 给站长一把 read key，或接受脏数据风险。
6. 其它：`public/c7a456e3f281483ea190105307b22108.txt` 是 IndexNow 公开验证文件（必须公开，非泄露）；`ads.txt`/`sitemap.xml`/`robots.txt` 正常；`scripts/` 内无密钥；未发现 `.env` 文件。

## 6. 最该先做的 5 件事（按「离真实收入最近」排序）

1. **填真实收款通道**：站长提供微信/支付宝收款码图片（放 `public/`）+ 真实商务邮箱 + 微信号 + 爱发电/BMC 主页，填进 `monetizationConfig.ts:199-211` 默认值（注意：后台表单改的是 localStorage，只对本机生效——**要全网民生效必须改代码默认值并重新 build+push**）。改完打赏二维码这条链路当天就能收钱。
2. **修线索黑洞**：`saveLead` 换一个真实出站通道——最低成本是把 `contactEmail` 换成真邮箱（mailto 询盘立刻可达）；更彻底是接 Formspree/Supabase 把 newsletter/sponsor/bundle 三类 lead 真正收集起来。否则所有商业意向都在流失。
3. **清掉不实文案**：删假荣誉榜（`SponsorCoffeeModal.tsx:64-69`）、删 50k 曝光（`SponsorCalculator.tsx:105`）、删「官方验证」徽章、把未证实的 perkBadge/优惠码改成客观描述或下线。**这是 AdSense 人工审核能否过关的关键变量**，也消掉法律风险。
4. **等 AdSense 审核 + 配 CMP**：审核过即开始产生真实广告收入，零额外开发。CMP 决定需要站长拍板（HANDOFF §七）。
5. **换真联盟链接**：站长去 RunPod/ElevenLabs/AutoDL 官方申请 referral，拿到真链接后填入。在拿到真码之前，优先做第 3 条把假码撤了——假码的负收益（信誉+审核）大于它带来的零收入。

> 另有一项第 0 优先级但不在我权限内：**push 新 bundle 上线**（HANDOFF §八遗留，线上仍跑含旧令牌的旧 bundle，令牌虽已轮换也应尽快推）。归组长/用户处理。

## 7. 要问站长的问题

1. `contact@aichronicle.dev` 是你的邮箱吗？`aichronicle.dev` 域名在你手里吗？真实商务邮箱和微信号是什么？
2. 你是否已在 RunPod / AutoDL / ElevenLabs / Together 等平台注册过联盟/推荐计划？`?ref=ai-chronicle`、`CHRONICLE10`、`AUTODL2026`、`TOGETHER2026` 这些码是平台下发给你的，还是占位？
3. 有没有微信/支付宝**收款码图片**、爱发电主页、Buy Me a Coffee 页面？（有就给我链接/图片路径）
4. `0x71C2834bE2816f9173921098b18209849b2` 这个 ERC-20 地址哪来的？（它位数不对是无效地址；建议要么换真地址要么删通道）
5. ¥19.9 资料包是否真打算收费卖？若卖：交付物（PDF/EPUB/4K图/仿真器）是已存在还是待制作？接受「扫码付款→邮件截图→人工发链接」的人工核销流程吗？
6. AdSense 审核出结果了吗？CMP 同意信息（EEA/UK）三个方案选哪个？
7. Newsletter 打算用什么发？（竹白/Substack/手动群发）——决定文案怎么改才诚实。
8. HANDOFF.md 里有旧令牌明文（虽已失效）。要不要把它从 git 历史清掉 / 至少把文件加进 `.gitignore`？**待组长先核 `git ls-files HANDOFF.md` 确认是否已被跟踪。**
9. 展台报价（¥699/月、¥4999/季、SponsorCalculator 的 ¥1500-3500/月）是你定的真实报价还是占位？要不要先撤掉报价等接到真实询盘再谈？
