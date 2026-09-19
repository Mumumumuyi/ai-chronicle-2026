import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
  ExternalLink,
  Save,
  MessageCircle,
  Database,
  Share2,
  TrendingUp,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  getMonetizationPartners,
  saveMonetizationPartners,
  getOwnerContact,
  saveOwnerContact,
  getCloudSyncConfig,
  saveCloudSyncConfig,
  getAffiliateMetrics,
  MonetizationPartner,
  OwnerBusinessContact,
  CloudSyncConfig,
  AffiliateClickMetric,
} from '../../utils/monetizationConfig';

export const AdminMonetizationHub: React.FC = () => {
  const [partners, setPartners] = useState<MonetizationPartner[]>([]);
  const [contact, setContact] = useState<OwnerBusinessContact>(getOwnerContact());
  const [cloudSync, setCloudSync] = useState<CloudSyncConfig>(getCloudSyncConfig());
  const [metrics, setMetrics] = useState<Record<string, AffiliateClickMetric>>({});
  
  const [activeCopyChannel, setActiveCopyChannel] = useState<'v2ex' | 'zhihu' | 'twitter' | 'hackernews' | 'jike'>('v2ex');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [testingCloud, setTestingCloud] = useState(false);
  const [cloudTestResult, setCloudTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const loadData = () => {
    setPartners(getMonetizationPartners());
    setContact(getOwnerContact());
    setCloudSync(getCloudSyncConfig());
    setMetrics(getAffiliateMetrics());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showNotification = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Partner URL/Code input updates
  const handlePartnerChange = (id: string, field: 'affiliateUrl' | 'promoCode', val: string) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleSaveAllPartners = () => {
    saveMonetizationPartners(partners);
    showNotification('所有生态合作伙伴推广链接与优惠码已保存并实时生效！');
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    saveOwnerContact(contact);
    showNotification('商务联系方式、收款通道与展位报价已成功保存！');
  };

  const handleSaveCloudSync = (e: React.FormEvent) => {
    e.preventDefault();
    saveCloudSyncConfig(cloudSync);
    showNotification('云端实时同步配置已更新！');
  };

  const handleTestCloudConnection = async () => {
    if (!cloudSync.supabaseUrl || !cloudSync.supabaseAnonKey) {
      setCloudTestResult({ success: false, message: '请先填写 Supabase URL 与 Anon Key' });
      return;
    }
    setTestingCloud(true);
    setCloudTestResult(null);
    try {
      const endpoint = `${cloudSync.supabaseUrl.replace(/\/$/, '')}/rest/v1/visitor_logs?select=count`;
      const res = await fetch(endpoint, {
        headers: {
          apikey: cloudSync.supabaseAnonKey,
          Authorization: `Bearer ${cloudSync.supabaseAnonKey}`,
        },
      });
      if (res.ok) {
        setCloudTestResult({ success: true, message: '成功连通 Supabase 数据库！全球访客数据将实时双向同步。' });
      } else {
        setCloudTestResult({ success: false, message: `连接异常 HTTP ${res.status}：请检查表是否存在或 RLS 策略是否开放。` });
      }
    } catch (err) {
      setCloudTestResult({ success: false, message: `网络错误：无法连接至指定的 Supabase 实例 (${(err as Error).message})` });
    } finally {
      setTestingCloud(false);
    }
  };

  // Metrics summary
  const totalClicks = Object.values(metrics).reduce((sum, m) => sum + (m.clicks || 0), 0);
  const totalCopies = Object.values(metrics).reduce((sum, m) => sum + (m.promoCopies || 0), 0);

  // Marketing Copy Templates
  const siteUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://mumumumuyi.github.io/ai-chronicle-2026/';
  
  const copyTemplates = {
    v2ex: {
      title: 'V2EX 程序员技术分享帖',
      target: '节点: /go/programmer 或 /go/ai 或 /go/share',
      content: `【分享】纯手工打磨的《2026 AI 全景通史》交互式长卷：GPU 算力集群演进、Scaling Law 实验室与前沿 Agent 生态

大家好，最近我花了大量心血独立完成了这个关于人工智能前沿技术全景的项目——《AI Chronicle 2026》（2026 AI 全景通史）。

体验地址：${siteUrl}
源码开源：GitHub 开放托管，纯零臃肿第三方重量级框架依赖

整个项目不仅是一份技术发展文档，更是一个充满交互感的技术世界：
1. 【时空剧场 (Stage)】：深度沉浸式全屏画卷，全景收录从 AlexNet、Transformer 到 2026 年前沿 Agent 体系、DeepSeek、MoE 架构演进与芯片算力纪元；
2. 【Scaling Law 算力实验室 (Lab)】：内置 Chinchilla 算力分配模型、前向/反向 FLOPs 交互式推算器，实时模拟不同参数量大模型所需的 H100 集群天数与电力能耗；
3. 【严选算力云与前沿工具生态 (Ecosystem)】：汇总了 RunPod、AutoDL、Cursor 等实战必备生产力工具，并为社区争取到了专属兑换特权；
4. 【原生响应式与无障碍音效】：为键盘快捷键与交互按钮适配了精妙的 Web Audio 晶体音效与移动端手势支持。

所有内容无广告打扰，欢迎大家体验、把玩并提提建议！如果你也正在探索大模型底层或 Agent 开发，希望它能为你提供一份清晰立体的全景坐标系。`
    },
    zhihu: {
      title: '知乎回答 / 专栏长文',
      target: '适合回答：“如何看待 2026 年大模型的技术演进路线？”或专栏发布',
      content: `深度复盘：从 Scaling Law 到 Agent 自主进化，如何看懂 2026 年的 AI 全景大变局？

回顾这一轮大模型浪潮，我们正在经历从“暴力扩大参数”到“测试期计算（Test-time Compute）与多模态物理世界理解”的关键拐点。为了把近几年错综复杂的技术脉络和底层数学逻辑梳理清楚，我做了一个交互式的《2026 AI 全景通史与算力演进图谱》：

体验链接：${siteUrl}

在构建这个系统的过程中，有三个核心认知值得分享：
1. 算力底座的物理极限与能耗突围：传统单机 8xH100 已经无法满足前沿训练需求，万卡集群的通信拓扑（RoCEv2 / InfiniBand）与液冷已成决胜点。我们在实验室模块中内置了精确的 FLOPs 换算器，大家可以直观拉拽滑块查看不同参数量模型的训练门槛。
2. 数据飞轮与合成数据质量：后预训练（Post-training）与强化学习（RLVR）成为新护城河。
3. 从 Copilot 到真正在代码库自主演进的 Agentic IDE：以 Cursor、Windsurf 为代表的 Agent 彻底改变了软件工程。

完整图谱、核心论文索引以及算力推算实验室均已整理在线上，纯网页无门槛交互，欢迎大家前往探索交流！`
    },
    twitter: {
      title: 'X / Twitter (全球极客 Thread)',
      target: '推荐配图时空剧场或 Scaling Lab 截图，打上 #AI #DeepLearning #LLM 标签',
      content: `🚀 Proud to introduce AI Chronicle 2026: An interactive, living deep-dive into frontier intelligence, compute clusters, and scaling laws.

Explore live here: ${siteUrl}

✨ What's inside:
1️⃣ Interactive Stage: 7 Epochs from AlexNet & Attention to 2026 Agentic swarms.
2️⃣ Scaling Law Lab: Interactive compute & Chinchilla FLOPs simulator for H100 clusters.
3️⃣ Verified Ecosystem: Curated compute clouds (RunPod, AutoDL) & frontier coding tools (Cursor).
4️⃣ Zero-bloat, lightning fast, and built with pure craft.

Feedback and PRs welcome! Let's chronicle the intelligence explosion together. 🌐🔥

#ArtificialIntelligence #MachineLearning #AIAgents #ScalingLaws #OpenSource`
    },
    hackernews: {
      title: 'Hacker News (Show HN)',
      target: '提交至 news.ycombinator.com/submit',
      content: `Show HN: AI Chronicle 2026 – Interactive history, scaling law lab, and compute calculator

URL: ${siteUrl}

Hey HN,

I built AI Chronicle 2026, an interactive chronicle and analytical playground covering the evolution of modern artificial intelligence from deep convolutional breakthroughs to 2026 autonomous agent architectures.

Highlights:
- Full timeline covering foundational breakthroughs with interactive zoomable viewports
- Interactive Scaling Law Laboratory: calculate training FLOPs, optimal parameter-to-token tokens (Chinchilla frontier), and GPU-days (H100/A100)
- Curated developer perks for GPU clouds and coding agents
- Zero bloated heavy UI libraries; pure high-performance TypeScript + Tailwind with Web Audio synthetic soundscapes.

Would love your thoughts, critique, and suggestions on timeline milestones!`
    },
    jike: {
      title: '即刻 / 小红书 / 掘金 (视觉向种草)',
      target: '即刻 #独立开发 #AI探索者圈子；小红书 #AI工具 #程序员日常',
      content: `🔥 熬夜打造的《2026 AI 全景通史》网页上线了！可能是目前质感最震撼的 AI 技术全景长卷。

🔗 直达传送门：${siteUrl}

作为一名开发者，我总觉得市面上的大模型发展图太零散、太枯燥。于是我从零手写了这个兼具“硬核技术深度”与“电影级交互视觉”的通史系统：
✨ 7 大纪元全景：从 AlexNet 到 DeepSeek，所有里程碑一览无余
🧮 算力实验室：拉动滑块就能推算千亿参数大模型需要烧掉多少张 H100、多少万度电
🎁 开发者福利：整理了 RunPod、AutoDL 等算力云专属优惠码

完全开源免费，电脑/手机双端完美自适应。喜欢 AI 技术和极简审美的极客朋友千万别错过，求个体验反馈和赞！🙌`
    }
  };

  const sqlSetupScript = `-- 在 Supabase SQL Editor 中执行以创建访客流转表：
CREATE TABLE IF NOT EXISTS visitor_logs (
  id TEXT PRIMARY KEY,
  "visitorId" TEXT,
  "sessionId" TEXT,
  timestamp TIMESTAMPTZ,
  path TEXT,
  "milestoneId" TEXT,
  "milestoneTitle" TEXT,
  referrer TEXT,
  "deviceType" TEXT,
  os TEXT,
  browser TEXT,
  "screenResolution" TEXT,
  language TEXT,
  "dwellSeconds" INT
);

-- 开放免鉴权公开写入与查询策略 (零后端直连)
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public insert" ON visitor_logs;
CREATE POLICY "Allow public insert" ON visitor_logs FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public read" ON visitor_logs;
CREATE POLICY "Allow public read" ON visitor_logs FOR SELECT USING (true);`;

  return (
    <div className="space-y-6 animate-fadeIn text-stone-100">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500 text-stone-950 font-bold text-xs shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top 4 Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">生态合作真实点击 (Clicks)</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
            {totalClicks}
          </div>
          <div className="text-[11px] font-mono text-stone-400 mt-2">
            100% 来自真实访客点击
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">优惠码复制数 (Promo Copies)</span>
            <Tag className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-300">
            {totalCopies}
          </div>
          <div className="text-[11px] font-mono text-emerald-400 mt-2">
            高意向转化行为
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">在列变现项目数</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-cyan-300">
            {partners.length}
          </div>
          <div className="text-[11px] font-mono text-stone-400 mt-2">
            GPU云 / IDE / 推理 API
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-stone-900/90 to-stone-950/90 border border-stone-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-medium">单笔商业赞助定价</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-purple-300">
            {contact.sponsorTier1PriceZh.split(' ')[0]}
          </div>
          <div className="text-[11px] font-mono text-purple-400 mt-2">
            主理人直收 100% 收益
          </div>
        </div>
      </div>

      {/* SECTION 1: 真实生态伙伴推广返佣配置 */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
              <LinkIcon className="w-4 h-4 text-amber-400" />
              <span>各合作项目真实推广返佣链接与邀请码设置</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              将您在 RunPod、AutoDL、Cursor 等平台申请到的真实 Referral 链接与优惠码填入下方，前台立即替换为您的专属链接，产生的佣金 100% 结算至您的个人账户。
            </p>
          </div>
          <button
            type="button"
            onClick={handleSaveAllPartners}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-amber-500/20 flex-shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            <span>保存所有合作链接</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left text-xs text-stone-300 font-mono">
            <thead className="bg-stone-950/80 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
              <tr>
                <th className="p-3">合作项目与分类</th>
                <th className="p-3">官方返利机制说明</th>
                <th className="p-3">您的专属推广链接 (Affiliate URL)</th>
                <th className="p-3">专属优惠/邀请码</th>
                <th className="p-3 text-center">累计点击</th>
                <th className="p-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {partners.map((p) => {
                const metric = metrics[p.id];
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-bold text-white flex items-center space-x-1.5">
                        <span>{p.name}</span>
                        {p.featured && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] border border-amber-400/30">
                            精选
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 uppercase">{p.category}</span>
                    </td>
                    <td className="p-3 text-stone-400 max-w-[220px]">
                      <span className="text-[11px] text-stone-300 font-sans block leading-relaxed">
                        {p.commissionNote}
                      </span>
                    </td>
                    <td className="p-3 min-w-[280px]">
                      <input
                        type="url"
                        value={p.affiliateUrl}
                        onChange={(e) => handlePartnerChange(p.id, 'affiliateUrl', e.target.value)}
                        placeholder={p.officialFallbackUrl}
                        className="w-full bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 font-mono focus:outline-none"
                      />
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <input
                        type="text"
                        value={p.promoCode || ''}
                        onChange={(e) => handlePartnerChange(p.id, 'promoCode', e.target.value)}
                        placeholder="无代码则留空"
                        className="w-28 bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-lg px-2 py-1.5 text-xs text-amber-300 font-mono focus:outline-none"
                      />
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 font-bold">
                        {metric ? metric.clicks : 0} 次
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <a
                        href={p.affiliateUrl || p.officialFallbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white inline-flex items-center"
                        title="直达验证"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2 & 3: 商务对接通道 + 全网多平台宣发中心 (两列排版) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* SECTION 2: 主理人商务对接与打赏通道 */}
        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>主理人商务对接、赞助收款与展位定价</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              直连本人
            </span>
          </div>

          <form onSubmit={handleSaveContact} className="space-y-3.5 text-xs font-mono">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 text-[11px] mb-1">官方合作邮箱</label>
                <input
                  type="email"
                  value={contact.contactEmail}
                  onChange={(e) => setContact({ ...contact, contactEmail: e.target.value })}
                  placeholder="contact@yourdomain.com"
                  className="w-full bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 text-[11px] mb-1">主理人商务微信号</label>
                <input
                  type="text"
                  value={contact.wechatId}
                  onChange={(e) => setContact({ ...contact, wechatId: e.target.value })}
                  placeholder="你的微信号"
                  className="w-full bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 text-[11px] mb-1">推荐展位月费报价 (Tier 1)</label>
                <input
                  type="text"
                  value={contact.sponsorTier1PriceZh}
                  onChange={(e) => setContact({ ...contact, sponsorTier1PriceZh: e.target.value })}
                  placeholder="¥699 / 月 或 $99"
                  className="w-full bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 text-[11px] mb-1">独家冠名季度报价 (Tier 2)</label>
                <input
                  type="text"
                  value={contact.sponsorTier2PriceZh}
                  onChange={(e) => setContact({ ...contact, sponsorTier2PriceZh: e.target.value })}
                  placeholder="¥4,999 / 季 (独家冠名)"
                  className="w-full bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 text-[11px] mb-1">爱发电赞助主页 (可选)</label>
                <input
                  type="url"
                  value={contact.afdianUrl || ''}
                  onChange={(e) => setContact({ ...contact, afdianUrl: e.target.value })}
                  placeholder="https://afdian.com/a/yourname"
                  className="w-full bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-400 text-[11px] mb-1">Buy Me a Coffee / Stripe (可选)</label>
                <input
                  type="url"
                  value={contact.buyMeACoffeeUrl || ''}
                  onChange={(e) => setContact({ ...contact, buyMeACoffeeUrl: e.target.value })}
                  placeholder="https://buymeacoffee.com/yourname"
                  className="w-full bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 text-[11px] mb-1">商务结算说明 / 声明提示</label>
              <textarea
                value={contact.customNoticeZh || ''}
                onChange={(e) => setContact({ ...contact, customNoticeZh: e.target.value })}
                rows={2}
                className="w-full bg-black/50 border border-stone-800 focus:border-amber-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none font-sans text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center space-x-1.5 transition-all shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存商务与打赏配置</span>
            </button>
          </form>
        </div>

        {/* SECTION 3: 全网顶级技术社群 1 键复制宣发文案库 */}
        <div className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>全网顶级技术平台高转化推广文案库</span>
              </h3>
              <button
                type="button"
                onClick={() => handleCopyText(copyTemplates[activeCopyChannel].content, 'promo-copy')}
                className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center space-x-1 transition-colors border border-cyan-500/30"
              >
                {copiedKey === 'promo-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'promo-copy' ? '已复制文案' : '1键复制此渠道文案'}</span>
              </button>
            </div>
            <p className="text-xs text-stone-400 mb-3">
              已针对各平台受众精心调校高转化引流文案。直接一键复制，去发帖即能为您带来真实精准的极客与工程师流量！
            </p>

            {/* Platform Selector Tabs */}
            <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-stone-800 text-xs font-mono mb-3 overflow-x-auto">
              {[
                { id: 'v2ex', label: 'V2EX' },
                { id: 'zhihu', label: '知乎' },
                { id: 'twitter', label: 'X / Twitter' },
                { id: 'hackernews', label: 'Hacker News' },
                { id: 'jike', label: '即刻/掘金' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCopyChannel(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeCopyChannel === tab.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-amber-400/90 mb-1">
              建议投递：{copyTemplates[activeCopyChannel].target}
            </div>

            <pre className="w-full h-56 bg-black/60 border border-stone-800 rounded-xl p-3 text-[11px] text-stone-300 font-mono overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
              {copyTemplates[activeCopyChannel].content}
            </pre>
          </div>
        </div>
      </div>

      {/* SECTION 4: 全球真实访客跨端汇聚 (Zero-Cost Supabase Cloud Sync) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-serif font-bold text-stone-100 flex items-center space-x-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>全球真实访客跨端数据汇聚 (零成本 Supabase 实时同步)</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                cloudSync.enableCloudSync && cloudSync.supabaseUrl
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}>
                {cloudSync.enableCloudSync && cloudSync.supabaseUrl ? '云端双向同步已启用' : '当前为本地独立模式'}
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              网站目前通过 GitHub Pages 静态托管。如需在您自己的电脑后台<strong className="text-stone-200">实时看到全球其他访客的访问记录</strong>，只需在免费的 Supabase 创建一个免费数据库并填入下方：
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleCopyText(sqlSetupScript, 'sql')}
            className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 text-xs font-mono flex items-center space-x-1.5 transition-all flex-shrink-0"
          >
            {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'sql' ? '已复制建表 SQL' : '复制 Supabase 建表 SQL'}</span>
          </button>
        </div>

        <form onSubmit={handleSaveCloudSync} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono">
          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Supabase Project URL</label>
            <input
              type="url"
              value={cloudSync.supabaseUrl}
              onChange={(e) => setCloudSync({ ...cloudSync, supabaseUrl: e.target.value })}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-black/50 border border-stone-800 focus:border-purple-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-stone-400 text-[11px] mb-1">Supabase Public Anon Key</label>
            <input
              type="text"
              value={cloudSync.supabaseAnonKey}
              onChange={(e) => setCloudSync({ ...cloudSync, supabaseAnonKey: e.target.value })}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full bg-black/50 border border-stone-800 focus:border-purple-500/60 rounded-xl px-3 py-2 text-stone-200 focus:outline-none"
            />
          </div>

          <div className="flex items-end space-x-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all"
            >
              保存并生效
            </button>
            <button
              type="button"
              onClick={handleTestCloudConnection}
              disabled={testingCloud}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-all"
            >
              {testingCloud ? '测试中...' : '测试连通性'}
            </button>
          </div>
        </form>

        {cloudTestResult && (
          <div className={`p-3 rounded-xl text-xs font-mono flex items-center space-x-2 ${
            cloudTestResult.success
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}>
            {cloudTestResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{cloudTestResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};
