# AI Chronicle 推广帖草稿（launch-posts.md）

> 用途：站长本人账号手动发布。每稿含：标题 / 正文 / 建议发布时间段 / 社区规则要点（附查证出处）/ 发帖后第一条自评论要点。
>
> **写稿事实依据**（全部来自仓库交接文件与 `src/data/timelineData.ts`，未编造）：
> - 网址 `https://mumumumuyi.github.io/`，免费、无需注册、单人维护、零后端。
> - 7 个时代（1943 M-P 神经元 → 2026.09），30 个里程碑，每个有独立页 `/milestone/<slug>/`（面包屑、关键人物/标志文献/算力代价事实表、历史影响、上/下一件导航）。
> - 1.8 万字中文长卷 `/reader/`（带章节索引、BibTeX 导出、打印）。**长卷正文只有中文**。
> - 缩放律交互实验室 `/lab/`（范式切换卡、缩放律滑块推演、硬件配置测算）。
> - 界面 5 种语言：中 / 英 / 西 / 德 / 法（可切 UI 语言属实；勿声称长卷有英文版）。
> - 首页：全屏 hero、时代浏览器（自动轮播 + SVG 滤镜沙化转场）、30 件里程碑筛选网格、计数滚动动画。
> - 技术栈：Vite 6 + React 18 + TS + Tailwind 3，GitHub Pages 托管；构建期用 Playwright 预渲染 34 条路由（4 主路由 + 30 里程碑页）为静态 HTML，产出 sitemap.xml + 404.html。
>
> **通用红线**：不写用户数 / 流量 / 好评；不用「最全」「权威」「殿堂级」；英文稿不声称长卷有英文全文；需披露处写明 "I built this" / 「利益相关：我是作者」；不提赞助、收款、爱发电。

---

## 1. Reddit — r/InternetIsBeautiful

### 投稿类型与标题

**类型**：Link post（直接贴网站 URL）。该版块以链接帖为主，正文栏留空或极短。

**URL**：`https://mumumumuyi.github.io/`

**标题（首选）**：

> An interactive timeline of AI history — 30 milestones from the first artificial neuron (1943) to today's reasoning models, each with its own explainer page

**标题（备选，更短）**：

> A free, no-signup website that walks through 80+ years of AI history as an interactive timeline — with a scaling-law playground and an essay you can read start to finish

### 正文

链接帖无正文；若站长选择 text post（不推荐，链接帖更符合版规），可用：

> I built this solo: a free interactive history of AI. Seven eras, 30 milestone pages, a long-form essay, and a small lab where you can drag a scaling-law slider and see what changes. No signup. Would love feedback on what's missing.

### 建议发布时间段

- 美东时间周二至周四 **8:00–10:00 AM ET**（对应北京时间 20:00–22:00，夏令时）；备选：周六/周日 9:00–11:00 AM ET（受众更泛、竞争更小）。
- 发帖后**至少在线 2 小时**回评论，该版评论互动直接影响帖子热度。

### 社区规则要点（已查证）

- **90/10 自我推广规则**：你近期 Reddit 活动里约 90% 应与自己的网站无关。如果账号历史几乎全是推广，会被拒发甚至封禁。**站长若 Reddit 账号是纯新号或只发过推广，先发几周的普通评论/帖子养号，或给 mod 发 modmail 询问后再发。**（出处：https://rankhog.com/subreddits/internetisbeautiful ；https://launchkit.me/blog/how-to-post-on-r-internetisbeautiful/ ）
- 只收**网站**：不收 app、浏览器扩展、需要下载安装的东西。（同上出处 + 版规存档 https://web.archive.org/web/20150117145644/http://www.reddit.com/r/InternetIsBeautiful/ ）
- 网站**不得要求登录 / 邮箱 / 个人信息**才能体验——本站无注册墙，合规。
- 不收网店、付费墙、freemium 关键功能收费站——本站全站免费，合规。
- **AI-Generated Content 禁令**：主体内容由 AI 生成的网站禁发。本站内容是人工撰写的中文长卷与里程碑文案（讲的是 AI，不是 AI 生成内容），合规；但建议在自评论里主动说明内容是自己写的，避免误判。
- 对拿不准的帖，官方建议先 modmail 问版主。（出处：launchkit 同上）

### 发帖后第一条自评论要点

- 开门见山：**"I'm the person who built this."**
- 一句话动机：找不到一个按时间线讲清 AI 七十年、又不用注册就能读完的站，所以自己写了一个。
- 主动交代局限：长文 essay 目前只有中文（界面可切 5 种语言），欢迎指正史实或建议补哪些里程碑。
- 结尾抛一个具体问题引导讨论，例如："Which milestone do you think I overrated or missed entirely?"

---

## 2. Hacker News — Show HN

### 标题

> Show HN: AI Chronicle – an interactive timeline of AI history (1943–2026)

（朴素、无营销腔；符合 "Show HN:" 前缀要求。）

### 提交方式

- URL 栏填 `https://mumumumuyi.github.io/`，**text 栏留空**（无 URL 的 Show HN 会被降权）。
- 发布后立即在评论区贴下面的「首评」。

### 正文 = 首条评论（作者自述）

> Hi HN, I built this. AI Chronicle is a free, single-maintainer interactive history of AI: seven eras and 30 milestones, from the 1943 McCulloch–Pitts neuron to test-time-compute reasoning models. Each milestone gets its own page with key figures, the landmark paper, and a rough compute-cost note.
>
> How it's made: it's a Vite + React single-page app with zero backend, hosted on GitHub Pages. The part that might be interesting here: since GitHub Pages can't run a server, I prerender all 34 routes at build time with Playwright — the build boots each route in headless Chromium, snapshots the DOM, and writes a static index.html per route plus a sitemap. So the SPA is crawlable without moving to SSR. Era transitions on the homepage use an SVG feTurbulence/feDisplacementMap "dissolve" filter rather than video or a canvas particle soup.
>
> Content caveat: the UI switches between 5 languages, but the long-form essay (the main course) is Chinese-only for now — I'm aware that limits the HN crowd, and translating it is the next thing on the list.
>
> Happy to answer anything about the prerendering trick, the data model, or why I picked these 30 milestones over others.

### 建议发布时间段

- 美东时间**周二至周四上午 8:00–11:00 AM ET**（北京时间 20:00–23:00）；发布后前 2 小时务必守帖回复，Show HN 的互动窗口很短。
- 不要删了重发（"Don't delete and repost" 是明文规则），一次发好。

### 社区规则要点（已查证）

- Show HN 必须是**你本人做的、别人能玩/能用的东西**；博客文章、newsletter、landing page 不算——本站是可交互的成品，合规。（官方：https://news.ycombinator.com/showhn.html ）
- 项目需**非琐碎**且你**本人在场答疑**。（同上）
- **不要请朋友点赞或评论**，不要拉票；被发现后果严重。（同上 + https://news.ycombinator.com/newsguidelines.html ）
- 标题不加修饰词、不加站点名营销、不用感叹号。（newsguidelines 同上）
- 首评交代背景故事 + 是什么 + 有何不同，是社区推荐的写法。（社区经验帖：https://gist.github.com/tzmartin/88abb7ef63e41e27c2ec9a5ce5d9b5f9 ）
- 尽量零门槛可试：本站无注册，合规加分项。（showhn.html 同上）

### 发帖后第一条自评论要点

即上方「正文 = 首条评论」。要点：技术细节前置（预渲染、SVG 滤镜、零后端），诚实交代长卷仅中文，结尾留答疑钩子。**不要**在评论里求赞。

---

## 3. Product Hunt

### Tagline（≤60 字符）

首选（49 字符）：

> An interactive timeline of AI history, 1943–2026

备选（58 字符）：

> Explore 80 years of AI history in one interactive site

### Description（产品描述，约 260 字符内）

> A free, solo-built interactive history of artificial intelligence. Seven eras, 30 milestone pages — from the first artificial neuron to reasoning models — plus a long-form essay and a scaling-law playground. No signup, no paywall, no backend.

### Maker 首评（first comment）

> Hey Product Hunt — I'm the maker, and this is a one-person project.
>
> **Why I built it:** every "history of AI" I found was either a Wikipedia-length wall, a slideshow with five bullet points, or a book. I wanted one place where you can skim the timeline in five minutes or fall down a rabbit hole for an hour.
>
> **What it is:** a free interactive site covering AI from 1943 to today — 7 eras, 30 milestone pages (each with key figures, the landmark paper, and a compute-cost note), a long-form essay you can read straight through, and a small lab where you can play with scaling-law parameters. No signup, no backend, everything is a static page.
>
> **Honest limitation:** the UI is available in 5 languages, but the long essay is Chinese-only for now — English translation is next on the list.
>
> **What I'd love feedback on:** which milestones you'd add or cut, and whether the era structure makes sense to you. Thanks for taking a look.

### 建议发布时间段

- **太平洋时间周二/周三/周四 0:01 AM PT**（北京时间约 15:01，夏令时）——PH 榜单按 PT 零点起算的 24 小时周期排名，0:01 发布可吃满全天窗口。可提前最多 1 个月用官方 scheduler 排期。
- 发布当天全天守帖，每条评论都回。

### 社区规则要点（已查证）

- Tagline 上限 **60 字符**，忌 "the best"/"AI-powered" 类空话；描述 ~260 字符。（官方准备指南：https://www.producthunt.com/launch/preparing-for-launch ；https://phlaunchkit.com/how-to-launch-on-product-hunt ）
- 12:01 AM PT 是惯例而非硬性，官方说"准备好时就是最好的时机"；但确实给满 24 小时曝光。（官方，同上）
- **自己 hunt 自己的产品没问题**——2023 年算法更新后 hunter 代发无优势。（phlaunchkit 同上）
- **禁止求票 / 买票**：vote manipulation 会被处罚；分享链接让人自己决定。（https://useneedle.net/guides/how-to-launch-on-product-hunt ；官方 https://www.producthunt.com/launch/preparing-for-launch ）
- Maker comment 是转化关键：why → what → 差异点 → 具体问题，上线后 90 秒内发出。（useneedle / phlaunchkit 同上）
- 可先发 "Launching soon" 页面攒 followers。（foundershub：https://foundershub.ai/blog/best-day-and-time-to-launch-on-product-hunt ）

### 发帖后第一条自评论要点

即上方 Maker 首评。要点：开场亮明 "I'm the maker"、单人项目、诚实说局限（长卷仅中文）、以一个具体问题收尾。避免 "let me know what you think" 这类空泛收尾。

---

## 4. 知乎 — 存量问题回答（3 篇）

> **给站长的备注**：知乎对「只丢链接」和「同一段推广文复制到多题」打击很重（多次发布含推广链接的低质内容属恶意营销；相同回答重复发到不同问题会被处理）。所以三篇是**各自独立的完整回答**，链接只在末尾自然带出，且都写了「利益相关」。三题不要同一天全发，间隔 1–3 天更自然。
> 规则出处：知乎创作者手册 https://www.zhihu.com/knowledge-plan/manual （营销导流、答非所问降负向反馈）；知乎机构号使用规范 https://www.zhihu.com/term/institution-usage （重复推广、导流低质内容条款——机构号规范，个人号同样适用社区规范底线）。

### 4.1 问题：如何快速入门机器学习？技术小白也能快速学习并掌握人工智能知识吗？

- 链接：https://www.zhihu.com/question/550824549 （搜索结果中出现的回答页 https://www.zhihu.com/question/550824549/answer/2655856733 证实问题存在且活跃）
- 为什么适合：新手最需要的是「地图」而非第一节课，本站的 7 时代 × 30 里程碑正好是地图。

**回答正文**：

> 利益相关：文末提到的网站是我做的。
>
> 入门最容易踩的坑，不是选错课，而是**没有地图就开始赶路**。公式学到一半不知道自己在学科史的哪个位置，很快会迷失。所以我建议先花一个晚上把学科骨架立起来，再回头啃课程。
>
> 一张精简的骨架长这样（每条都能追问"它解决了上一阶段的什么痛点"）：
>
> | 年份 | 事件 | 为什么重要 |
> |---|---|---|
> | 1943 | McCulloch-Pitts 神经元 | 把生物神经元抽象成逻辑门，神经网络的第一块基石 |
> | 1956 | 达特茅斯会议 | "Artificial Intelligence" 被命名，学科成立 |
> | 1958 | 感知机 | 第一个能自学习的神经网络硬件 |
> | 1969 | 《Perceptrons》 | 明斯基用 XOR 判决单层网络死刑 → 第一次寒冬 |
> | 1986 | 反向传播确立 | 多层网络可训练，连接主义复活 |
> | 1995 | SVM 与核方法 | 统计学习理论巅峰，神经网络一度被叫"炼金术" |
> | 2009 | ImageNet | "数据"成为与算法、算力并列的第三要素 |
> | 2012 | AlexNet | 两块 GTX 580 点燃深度学习工业革命 |
> | 2017 | Transformer | 自注意力废掉序列递推，统一文本/图像/语音 |
> | 2020 | GPT-3 与 Scaling Laws | 大模型变成可规划投入产出的重工业 |
> | 2022 | ChatGPT / RLHF | 模型被对齐成产品，AI 变成社会基础设施 |
> | 2024–25 | o1 / DeepSeek R1 | 第二缩放定律：测试时计算换推理能力 |
>
> 拿着这张地图再去看课，你会发现每个知识点都能挂回树上：吴恩达 Machine Learning 讲的东西大多在"统计学习"枝干；CS231n 是 AlexNet 那条线的延长；Transformer 之后的一切（RLHF、推理模型、Agent）是最近五年的新枝。
>
> 之后才是常规路线：Python + NumPy → 吴恩达 ML → 选一个方向（CV 看 CS231n，NLP 看 CS224n，RL 看 EasyRL）→ 复现一个经典项目。
>
> 我自己因为找不到满意的"地图"，干脆做了一个免费的 AI 通史站：7 个时代、30 个里程碑各有独立页面，另有一篇 1.8 万字长卷可以一口气读完：https://mumumumuyi.github.io/ （利益相关：我是作者，欢迎拍砖，尤欢迎指出史实硬伤。）

### 4.2 问题：如何评价 DeepSeek 于 2026 年 4 月 24 日发布的 V4 预览版？

- 链接：https://www.zhihu.com/question/2030967375349163196
- 为什么适合：把 V4 放回 R1 → o1 开辟的"测试时计算"范式里看，是本站长卷的核心论点之一。

**回答正文**：

> 利益相关：文末提到的网站是我做的。
>
> 与其逐条过参数，不如把 V4 放回它所属的那条历史线索里看——这条线的起点不是 V4，而是 2024 年的 o1。
>
> **第一层：范式归属。** 2024 年 OpenAI o1 证明了第二缩放定律：除了预训练参数量，推理阶段花的 Token 和搜索分支同样能换正确率。2025 年初 DeepSeek R1 接着证明了更刺激的一件事——不用人工标注的冷启动 SFT，纯大规模强化学习也能让模型自己"顿悟"出反思和长链条推理。V4 系列（预览版到后来的 Flash 线）本质上是把这套"系统二推理"能力继续工程化、便宜化：稀疏注意力、超长上下文、KV cache 压缩、MoE 分层（Pro 吃性能、Flash 吃性价比），都是在回答同一个问题——怎么让慢思考便宜到能默认开启。
>
> **第二层：它改变了什么竞争维度。** R1 时代大家比的是"能不能推理"；到 V4，比的已经变成"推理成本曲线"——同样的正确率，谁的显存、时延、价格更低。这对用 Agent 产品的人是好事：能连续跑几十上百轮任务的 Agent，成本敏感性远高于单次问答。
>
> **第三层：一个不太讨喜的观察。** 预览版公告里自己写了与顶级闭源思考模式仍有差距，这反而是我觉得最值得给好评的地方——在"必须赢"的叙事里保持自我认知，比榜单上某个小数点更稀缺。
>
> 想看这条线索的更完整版本（o1 → R1 → Agentic Runtime 怎么接起来的），我做了一个免费的 AI 通史站，R1 和 o1 都有独立条目页：https://mumumumuyi.github.io/milestone/deepseek-r1/ 、https://mumumumuyi.github.io/milestone/openai-o1/ （利益相关：我是作者。）

### 4.3 问题：有哪些宝藏网站值得推荐？

- 链接：知乎搜索结果可定位到该题的回答页 https://www.zhihu.com/tardis/jm/ans/2063227199092683057 （题为「有哪些宝藏网站值得推荐？」的存量问题，站长发布前在知乎内搜标题确认问题页 URL 再答）
- 为什么适合：直接对口，但必须推荐多个网站 + 明确披露，否则就是纯广告。

**回答正文**：

> 分享几个我自己收藏夹里翻牌率高的，利益相关在最后一条。
>
> **纪妖（cbaigui）**——中国精怪神兽档案库，两千多种妖怪各附出处、外形和民间典故，志怪爱好者的天堂。
>
> **Gallerix**——古典油画高清原版图库，按画家和流派分类，适合不想翻画册的时候在线看展。
>
> **SkylineWebcams**——全球各地景区、街道、海岸的实时摄像头，写东西写累了点开看看别的地方现在什么样。
>
> **全历史**——把历史事件、人物关系做成时间轴和图谱的站，查"某年还发生了什么"很好用。
>
> **AI Chronicle / AI 编年史**（利益相关：我是作者）——我一个人维护的免费 AI 通史站：https://mumumumuyi.github.io/ 。从 1943 年 M-P 神经元到 2026 年的推理模型，分 7 个时代、30 个里程碑，每个里程碑有独立页面（关键人物、标志文献、算力代价），还有一篇 1.8 万字长卷和一个可以拖滑块玩的缩放律实验室。无注册无付费。如果你对 AI 史感兴趣可以翻翻，发现史实错误欢迎来骂我。
>
> 以上都是免费站，也是我本人真实在用的。

---

## 5. V2EX — 「分享创造」节点（/go/create）

### 标题

> 做了一个 AI 通史网站，一个人维护，求拍砖

### 正文

> 如题，做了个 AI 编年史网站：https://mumumumuyi.github.io/ ，免费、无注册、一个人维护，发出来求各位拍砖。
>
> **是什么**：把人工智能 1943–2026 的历史按 7 个时代、30 个里程碑组织成一个可以逛的站。每个里程碑有独立页（关键人物 / 标志文献 / 算力代价 / 历史影响 / 上一件下一件），比如 /milestone/dartmouth-workshop/ 、/milestone/alphago/ 。另有一篇 1.8 万字中文长卷 /reader/ 可以一口气读完，一个缩放律实验室 /lab/ 可以拖滑块看参数变化。界面能切中英西德法五种语言（长卷正文目前只有中文，翻译在排期）。
>
> **怎么做的**：Vite + React 的纯静态 SPA，零后端，挂 GitHub Pages。比较折腾的一点是 SEO：GitHub Pages 起不了服务端，就在构建期用 Playwright 把 34 条路由挨个渲染一遍，把 DOM 快照写成各路由自己的静态 HTML + sitemap，这样 SPA 也能被正常收录。首页时代切换用了 SVG feTurbulence/feDisplacementMap 的溶解滤镜，没有用视频或重型粒子动画。
>
> **短板先说**：1) 长卷只有中文，英文读者只能看 UI 和里程碑页；2) 单人维护，更新慢；3) 手机上动效做了降级但肯定还有没覆盖到的机型。
>
> 想听的反馈：史实有没有硬伤、时代划分是否合理、移动端有没有布局翻车。感谢。

### 建议发布时间段

- 北京时间工作日 **20:00–23:00**（V 站活跃用户在线高峰）或午休 **12:00–14:00**。避开凌晨。

### 社区规则要点（已查证）

- 「分享创造」**官方明确欢迎**独立开发者发自己的作品，目的是拿第一批用户和反馈。（官方节点说明：https://www.v2ex.com/help/node ）
- **账号注册满 30 天**才能在该节点发帖（实测帖证实此限制：https://www.v2ex.com/t/1175853 ）。**站长若 V2EX 账号不满 30 天，这稿先压箱底，别去「推广」节点硬发。**
- 内容要真的"分享"：写清楚做了什么、怎么做的、踩了什么坑；只丢下载链接/使用说明容易被管理员移到「推广」节点。（社区讨论：https://www.v2ex.com/t/1058300 ）
- 营销内容必须发「推广」节点，错节点反复发会影响账号。（官方节点说明，同上）
- 不要同一项目频繁发帖、不要引流留群二维码。（社区共识，同上 /t/1058300 帖内回复）

### 发帖后第一条自回复要点

- 补充一句材料之外的细节，比如："补一个构建期的取舍：没上 SSR/SSG 框架是因为想让仓库保持零依赖重构建，代价是每个新页面都要在路由表登记一次才会进预渲染清单。"
- 对每个拍砖评论都回，收到 bug 类反馈记下并回复"收到，已记"。不辩解、不催赞。

---

## 6. 掘金 — 技术文（大纲 + 开头 300 字）

### 标题（按掘金规范：前半技术关键词，后半意图）

> GitHub Pages + React SPA 的 SEO 自救：用 Playwright 在构建期预渲染 34 个路由

### 文章大纲

1. **问题**：GitHub Pages 只能托管静态文件，React SPA 的 HTML 几乎为空壳，爬虫拿不到内容；平台还无法返回真 404。
2. **方案对比**（各写 3-5 行取舍）：迁移 SSR/SSG 框架（Next/Astro）—— 要重写路由与数据层，成本高；付费 prerender 服务 —— 多一层外部依赖；vite 插件 —— 与自定义伪路由（pushState + 无 react-router）不匹配；**最终选自写 Playwright 快照**：零新运行时依赖、路由完全可控。
3. **实现**：
   - 路由清单单一数据源：`site_segments.cjs` 用正则从 `timelineData.ts` 抽 `slug`（CJS 不能 import TS），带重复/为空断言；
   - `prerender.cjs`：构建后启动本地静态服务，headless Chromium 逐路由访问 → 注入语言等 localStorage 参数 → 序列化 DOM → 按路由目录写 `index.html`（4 主路由 + 30 里程碑页 = 34 条）；
   - 每页写入独立 title / description / canonical（里程碑页 meta 从数据文件取）；
   - 同步生成 `sitemap.xml`、根域 `404.html`；子站构建（base≠"/"）时删除 sitemap 避免错误信号。
4. **坑**：SPA 接管后 hash 旧链接要做 `/#x → /x` 升级；GitHub Pages 无法返回真 404 状态码，只能 404.html + SPA 内 not-found 面板兜底；canonical 全指根域防止子站稀释权重。
5. **验收方式**：`view-source:` 检查每页有真实 `<h1>` 与正文、sitemap 34 条、GSC 收录变化。
6. **结论与适用边界**：适合"路由有限、内容以静态数据为主"的站；内容频繁更新或路由上万的站还是该上真 SSG。
7. **声明**：文末按掘金 AIGC 公告注明"本文部分内容由 AI 辅助整理"。

### 开头 300 字（可直接用）

> 把一个 React SPA 部署到 GitHub Pages 很容易，`npm run build` 丢上去就完事。但要让搜索引擎收录就是另一回事了：Pages 只认静态文件，而 SPA 的 index.html 里除了一个 `<div id="root">` 和几行 script 标签什么都没有——爬虫拿到的就是一具空壳。我的个人站点（一个人维护的 AI 通史站，34 条路由）就卡在这：又不想为了 SEO 把整个项目迁去 Next 重构路由，也不想在页面外再多养一个预渲染服务。最后的解法是自建一个"穷人版 SSG"：构建完成后用 Playwright 启 headless Chromium，把每一条路由挨个打开，等 React 渲染完，把 DOM 快照序列化回各路由自己的 index.html。这篇文章记录这套方案怎么落地、踩了哪些坑，以及它的适用边界在哪——它不是万能药，但对"路由数量有限、内容以静态数据为主"的站，投入产出比相当划算。

### 建议发布时间段

- 北京时间工作日 **8:30–10:30**（掘金技术读者通勤刷文高峰），周二至周四为佳。

### 社区规则要点（已查证）

- **必须原创技术文**：百科式罗列、无个人研究/实践的文章不推荐；全文与他人内容重复超 50% 视为非原创。（掘金官方规则更新帖：https://juejin.cn/post/7049199895575527437/ ）
- **推广类文章（招聘、广告、SEO、活动等推广）不允许发布**，发现即删；正文不得放微信群/公众号二维码（仅允许文字引导关注公众号）。（同上 + 掘金基本法 https://juejin.cn/post/6844903448794808328 ）——所以正文里**不要贴本站推广链接**，最多在"我以个人站点为例"处提及，或在文末作者简介里放。
- 标题规范：简单不夸张、前半技术关键词后半意图、含主要技术名词。（基本法，同上）
- **AIGC 辅助创作需声明**。（掘金公告：https://juejin.cn/post/7226357862967623738 ）——本稿为 AI 起草、站长发布，发布时请在文末加一句声明。
- 字数建议 ≥700 字、代码文字比不过 60%、结构完整。（活动规则同口径：https://juejin.cn/post/7275225666030026809 ）

### 发帖后第一条自评论要点

- 主动补充正文没写的细节或勘误位："评论区补一个没写进正文的坑：预渲染时 localStorage 里注入界面语言（我们写死 zh），否则生成的英文/西语快照会串语言。"
- 有人问"为什么不用 xxx 方案"时如实回答取舍，不贬低别的方案。
- 文章里若被指出事实错误，修改后在评论区置顶说明改了什么。

---

## 附：发布顺序建议（给站长）

1. **先发掘金 + V2EX**（中文技术社区，受众与"预渲染"技术点最匹配，且能为帖子积累真实讨论）。
2. **隔 1–3 天发知乎三题**，每题间隔至少 1 天。
3. **英文平台选一周集中发**：周二 Reddit 上午（美东）→ 周三 HN 上午（美东）→ 周四 PH 0:01 AM PT。同一周内站长需有整块时间守评论区。
4. 所有平台发布后把链接和反馈记回 `DEVIN_HANDOFF.md`，方便复盘。
