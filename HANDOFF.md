# 项目交接与续接执行文档 (HANDOFF.md)

> **项目名称**：AI Chronicle 2026（火种、严冬与硅基奇点：人工智能演进全景通史 1943 — 2026.09）  
> **交接对象**：本地 Claude Code（agy / cc 环境）  
> **创建时间**：2026-09-19  
> **工作区绝对路径**：`C:\Users\Amu\Desktop\scratch_wb`  
> **线上公网地址**：[https://mumumumuyi.github.io/ai-chronicle-2026/](https://mumumumuyi.github.io/ai-chronicle-2026/)  
> **后台管理令牌**：`4/0ATsMZqDbEqJWdiTVSo1cTG7kOIk3fhnr68dn0c-lJTpRNOL5gm7JiAQB95oemjosrVXSwQ`

---

## 一、 用户核心指令与硬约束 (Provenance & Hard Constraints)

1. **[用户明确] 网站视觉与架构**：采用液态玻璃（Liquid Glass）暖光前沿美学与世界一流设计重构，已通过本地及移动端/平板响应式视觉校验。
2. **[用户明确] 隐私与红线**：严禁将用户电脑内本地知识库或任何隐私文件上传至公开网络。
3. **[用户明确] 100% 真实数据原则**：后台统计、访客监控与变现中心必须使用纯真实数据，**绝对禁止**任何 Mock 或伪造数据。
4. **[用户明确] 收益与变现**：打通 Google 商业化生态（AdSense 广告）与高客单价赞助/返佣体系，切实将访问转化为真实收益。
5. **[用户明确] 交接目标**：由本地 Claude Code 无缝续接剩余操作，按本文件列出的全部步骤依次推进。

---

## 二、 当前已完成工作与验证证据 (Current Status & Verified Evidence)

| 模块 | 完成动作 | 验证证据 / 状态 |
| :--- | :--- | :--- |
| **搜索引擎自动化收录** | 编写并通过 [`scripts/push_search_engines.cjs`](file:///C:/Users/Amu/Desktop/scratch_wb/scripts/push_search_engines.cjs) 执行 IndexNow 协议提交 | Bing / Yandex / Naver 接口返回 `HTTP 200 OK`，推送 7 个深度路由 |
| **Google Search Console** | 根目录 `<head>` 注入所有权标记并全站部署 | `curl.exe` 实测返回 `<meta name="google-site-verification" content="LMj9O8-Z49DiyMLAI15lCROJCblRF7ClLnXrzLAYwiI" />` |
| **Google AdSense ID 发现** | 使用 Computer Use 深入用户本地 Edge 窗口自动捕获发布商编号 | 确认真实 Publisher ID：`pub-8861051283907117`（Client ID：`ca-pub-8861051283907117`） |
| **AdSense 代码部署** | 在 [`index.html`](file:///C:/Users/Amu/Desktop/scratch_wb/index.html) 嵌入官方 AdSense 异步加载脚本 | 线上实测已生效并正常加载 |
| **广告反欺诈认证文件** | 创建 [`public/ads.txt`](file:///C:/Users/Amu/Desktop/scratch_wb/public/ads.txt) 与 [`dist/ads.txt`](file:///C:/Users/Amu/Desktop/scratch_wb/dist/ads.txt) | `curl.exe https://mumumumuyi.github.io/ai-chronicle-2026/ads.txt` 实测返回正式授权行 |
| **GitHub 根仓库准备** | 用户在 AdSense 提交的是根域名 `mumumumuyi.github.io` | 已通过 `gh repo create Mumumumuyi/mumumumuyi.github.io --public` 在 GitHub 成功建好根仓库 |

---

## 三、 核心阻断点根因分析 (Root Cause Analysis)

在 AdSense 界面点击验证时提示：`Couldn't verify your site`。
- **根本原因**：
  Google AdSense 将网站视作主域名 `mumumumuyi.github.io` 进行爬虫校验，其爬虫直接请求 `https://mumumumuyi.github.io/`（根路径）。
  而 GitHub Pages 的规则是：**用户级根域名必须由同名仓库 `Mumumumuyi/mumumumuyi.github.io` 承载**。在此仓库存在并有页面前，`https://mumumumuyi.github.io/` 会直接返回 `404 Not Found`，导致 AdSense 爬虫无法读取代码与 `ads.txt`。

---

## 四、 Claude Code 续接操作全流程 (Step-by-Step Execution Guide)

请 Claude Code 按照以下步骤依次执行：

### 任务 1：初始化并推送 `mumumumuyi.github.io` 根仓库页面

由于本地已在 `C:\Users\Amu\AppData\Local\Temp\root_gh_pages` 准备好了文件，Claude Code 可直接运行以下命令完成推送：

```bash
# 进入临时目录或克隆仓库
cd C:\Users\Amu\AppData\Local\Temp\root_gh_pages

# 配置提交身份（使用用户 GitHub 账号）
git config user.name "Mumumumuyi"
git config user.email "200943864+Mumumumuyi@users.noreply.github.com"

# 提交并推送到 GitHub 根域名仓库
git add .
git commit -m "feat: setup root user pages with Google AdSense tag, GSC verification and ads.txt"
git remote add origin https://github.com/Mumumumuyi/mumumumuyi.github.io.git
git push -u origin main
```

> **文件内容确认**：
> 1. `index.html`：包含 `<meta name="google-site-verification" ... />` 与 AdSense 官方 script，并包含自动跳向主站的 `<meta http-equiv="refresh" content="0; url=https://mumumumuyi.github.io/ai-chronicle-2026/">`。
> 2. `ads.txt`：包含 `google.com, pub-8861051283907117, DIRECT, f08c47fec0942fa0`。

### 任务 2：验证根域名 HTTP 200 连通性

推送完成后，等待约 30 秒 GitHub Pages CDN 生效，运行验证：

```bash
# 验证根路径是否返回 200 OK 并带有 AdSense 标签
curl.exe -s -L "https://mumumumuyi.github.io/" | Select-String -Pattern "ca-pub-8861051283907117"

# 验证根路径 ads.txt 是否返回 200 OK 并带有真实发布商 ID
curl.exe -s -L "https://mumumumuyi.github.io/ads.txt"
```
**通过标准**：两条请求均返回 `HTTP 200` 且包含 `pub-8861051283907117`。

### 任务 3：在 Google AdSense 后台完成最终核验

Claude Code 可调用 `computer-use-cc`（或提示用户在当前开启的 Edge 浏览器中）：
1. 访问/刷新页面：`https://adsense.google.com/adsense/u/0/pub-8861051283907117/sites/detail/url=mumumumuyi.github.io`
2. 勾选 **「I've placed the code」**。
3. 点击 **「Verify」** 按钮。
4. 验证通过后，在下方点击 **「Request review」** 提交审核。

---

## 五、 进阶变现落地（算力推广与赞助）

当用户提供 GPU 云或赞助商链接时：
1. **GPU 推广链接 (Affiliate CPS)**：
   - 涉及文件：[`src/components/ScalingLab.tsx`](file:///C:/Users/Amu/Desktop/scratch_wb/src/components/ScalingLab.tsx)
   - 在各前沿模型卡片旁配置“在 AutoDL / RunPod 一键开机复现”入口，带入用户的推荐码。
2. **赞助商与合作管理**：
   - 涉及文件：[`src/components/EcosystemView.tsx`](file:///C:/Users/Amu/Desktop/scratch_wb/src/components/EcosystemView.tsx)
   - 商业询盘与后台数据通过 LocalStorage 真实持久化，所有数据在 `#admin` 页面实时呈现。

---

## 六、 推荐 Claude Code 启用的专项技能 (Suggested Skills)

- `karpathy-guidelines`：编码与修改前置准则，严格保持外科手术式修改与真实验证。
- `computer-use-cc`：若需要继续操作 Edge 浏览器完成 UI 点击。
- `commit-work`：规范化 Git Commit。

---

## 七、 续接执行记录（2026-09-19，本地 Claude Code 追加 · 只增不改）

### 任务 1 — 根仓库上线：已完成
- 推送 `Mumumumuyi/mumumumuyi.github.io`，首次提交 `59b9084`。
- GitHub Pages 自动启用（`source=main /`，`https_enforced=true`），构建 `status=built`。

### 任务 2 — 根域名连通性：已通过
基线（推送前）：`/` 与 `/ads.txt` 均为 `HTTP 404`，与 §3 根因判断一致。
推送后全部 `HTTP 200`：

| 路径 | 状态 | Content-Type |
| :--- | :--- | :--- |
| `/` | 200 | text/html |
| `/ads.txt` | 200 | text/plain |
| `/robots.txt` | 200 | text/plain |
| `/sitemap.xml` | 200 | application/xml |
| `/assets/index-Bj7P-n0l.js` | 200 | application/javascript |
| `/assets/index-Bgye3mY_.css` | 200 | text/css |
| `/bg-warm-glass.jpg` | 200 | image/jpeg |

根首页含 `ca-pub-8861051283907117` 与 `google-site-verification`；根 `ads.txt` 含 `google.com, pub-8861051283907117, DIRECT, f08c47fec0942fa0`。

### 任务 2b — 根域名改为完整内容站（用户决定，非原计划）
原方案的根首页是 2.5 KB `meta refresh` 跳转壳页，存在 AdSense「低价值内容」拒批风险。
经用户确认后改为：把 `dist/` 完整站点部署到根仓库（提交 `0c09686`），根域名首页本身即完整通史站点。
- `vite.config.ts` 为 `base: './'`（相对路径），同一份构建产物在根路径可直接运行，**无需重新构建**。
- 副带修正：`robots.txt` 移到域名根目录后才真正生效（此前位于子路径，爬虫不读取）。
- 保留 `canonical -> /ai-chronicle-2026/`，避免同域重复内容争抢权重；子站 `/ai-chronicle-2026/` 未改动。

真实渲染验证（Playwright，走系统已装 Chrome 通道，未安装额外浏览器）：
`1440x900 / 1200x800 / 1024x768 / 768x1024 / 390x844 / 360x740` 六个断点 **全部 PASS** —
`#root` 有子节点、正文文本 1467–1524 字符、无横向溢出、无 pageerror、无站点资源加载失败。
唯一失败请求为 `pagead2.googlesyndication.com`（本机网络阻断），非站点缺陷。

### 任务 3 — AdSense 后台核验：已完成
- Chrome 未登录 AdSense（被重定向到登录页），改用 `computer-use-cc` 操作用户已登录的 Edge 窗口 `0x00700B1E`。
- 勾选 `I've placed the code` -> 点击 `Verify` -> 弹窗返回 **`Your site is verified`**。
- 点击 `Request review` -> 站点状态由 `Requires review` 变为 **`Getting ready`**，
  `Verify site ownership` 与 `Review requested` 均为绿色对勾。

### 遗留待办（需用户决定，未擅自处理）
1. **CMP 同意声明**：AdSense 页面新出现 `Create a consent message for your sites`（EEA/UK/瑞士）。
   提供三个选项（Google CMP 两选项 / 三选项 / 第三方认证 CMP），涉及法务与 UX 取舍，未代为选择。
2. **审核结果**：Google 人工审核通常需要数天，结果会在 AdSense 站点页面与邮件通知。
3. **根域名与子站并存**：两个 URL 提供同一内容，当前靠 canonical 指向子站消解。
   若希望根域名成为唯一主站，需另行调整 canonical / hreflang / sitemap 并重新提交收录。

---

## 八、 令牌泄露修复（2026-09-19 追加 · 只增不改）

### 根因
`src/components/admin/AdminDashboard.tsx` 曾硬编码明文令牌，仅用于在后台界面回显 + 提供「复制凭证」按钮。
它随 Vite 打包进 `dist/assets/*.js`，而该 bundle 在两个公开地址均可直接下载 —— 任何访客都能取得管理密钥。
`src/utils/securityWall.ts` 的加盐 SHA-256 设计本身是正确的（只存指纹、不存明文），是被这个「便利功能」旁路了。

### 已完成（本地已提交，提交 `1383728`）
- 删除 `SOVEREIGN_TOKEN` 常量、`handleCopyToken`、令牌回显 UI 与孤儿 import `Copy`/`Check`。
- 轮换 `SOVEREIGN_AUTHORIZED_HASH`（新令牌 240 位熵，明文不入库）。
- `securityWall.ts` 注释中的明文一并删除。
- `scripts/test_admin_security_vault.cjs`、`scripts/verify_real_monetization_and_admin.cjs` 改读 `ADMIN_TOKEN` 环境变量。
- 重新构建：旧 bundle `index-Bj7P-n0l.js` / `index-Bgye3mY_.css` 已被 `index-DJLSc3vt.js` / `index-BhZQXoOl.css` 取代。

验证证据：
- `grep` 确认 `src/`、`scripts/`、`dist/` 均无旧明文。
- 浏览器实算 `SHA-256(salt+新令牌)` == 代码常量 `1ca27dee…5188a`。
- Playwright 实测：新令牌可解锁控制台、旧令牌被拒、渲染后的页面不含任何明文令牌；审计日志记录 `LOGIN_SUCCESS`。

### 未完成（被权限拦截，需用户决定）
1. **`git push` 两个仓库**：auto mode 分类器以 `[Git Destructive]` 拒绝。
   后果：**线上仍在服务含明文令牌的旧 bundle**，实测
   `https://mumumumuyi.github.io/assets/index-Bj7P-n0l.js` 与
   `https://mumumumuyi.github.io/ai-chronicle-2026/assets/index-Bj7P-n0l.js` 均仍可读出旧令牌。
2. **历史重写**：`git filter-branch` 同样被拒；`git filter-repo` 未安装且未擅自安装。
   旧令牌仍存在于 `ai-chronicle-2026` 的 41 个提交历史中（已轮换，因此为失效凭据）。

### 备份
重写前已生成完整备份（含全部分支）：
`<scratchpad>/repo-backups/ai-chronicle-2026.bundle`（41 提交）、`mumumumuyi.github.io.bundle`（3 提交）。
