import React, { useState } from 'react';
import { 
  Server, 
  Code2, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  Tag, 
  ArrowUpRight, 
  DollarSign, 
  ShieldCheck,
  Zap
} from 'lucide-react';

interface ToolItem {
  name: string;
  category: 'gpu' | 'code' | 'inference' | 'creative';
  tagline: string;
  description: string;
  perkBadge: string;
  promoCode?: string;
  affiliateUrl: string;
  featured?: boolean;
}

const TOOLS: ToolItem[] = [
  // 1. GPU & Compute
  {
    name: 'RunPod Cloud GPUs',
    category: 'gpu',
    tagline: '极速按秒计费 H100 / A100 / RTX 4090 算力云',
    description: '全球开发者构建大模型、微调与扩散模型的首选 GPU 容器平台。秒级拉起 PyTorch 与 vLLM 环境，支持按秒计费与 Spot 廉价实例。',
    perkBadge: '赠 $10 算力体验金',
    promoCode: 'CHRONICLE10',
    affiliateUrl: 'https://runpod.io/?ref=ai-chronicle',
    featured: true,
  },
  {
    name: 'Lambda Labs GPU Cloud',
    category: 'gpu',
    tagline: '最高性价比的预训练与深度学习集群',
    description: '被众多硅谷 AI 独角兽选用的高性能算力平台。提供单卡到 8xH100 裸金属节点，免去繁琐运维，专注前沿探索。',
    perkBadge: '单卡低至 $0.50/小时',
    affiliateUrl: 'https://lambdalabs.com/service/gpu-cloud',
  },
  {
    name: 'AutoDL 算力云 (国内首选)',
    category: 'gpu',
    tagline: '国内低延迟、高带宽高校与开发者算力首选',
    description: '支持国内各大高校与企业微信/支付宝充值，内置网盘加速与多种预置模型镜像，是中文社区最具性价比的实验利器。',
    perkBadge: '新人充值立减 20 元',
    promoCode: 'AUTODL2026',
    affiliateUrl: 'https://www.autodl.com',
  },

  // 2. Coding & Agents
  {
    name: 'Cursor AI IDE',
    category: 'code',
    tagline: '基于深度仓库感知的下一代 AI 编程编辑器',
    description: '深度集成 Claude 3.5 Sonnet 与 GPT-4o 的全新代码编辑器。支持全库语义索引、多文件自动改写与终端自动排障，研发效率跃迁 300%。',
    perkBadge: '首月免费试用 Pro 特权',
    affiliateUrl: 'https://www.cursor.com',
    featured: true,
  },
  {
    name: 'Windsurf Editor',
    category: 'code',
    tagline: 'Codeium 打造的全新 Flow 级协同编码 Agent',
    description: '以 Cascade 架构为核心，主动预测开发者意图并在本地工作流中自主演进，消除传统代码补全的割裂感。',
    perkBadge: '永久免费基础额度',
    affiliateUrl: 'https://codeium.com/windsurf',
  },

  // 3. High-Throughput Inference & API
  {
    name: 'Groq LPU Inference',
    category: 'inference',
    tagline: '500+ Tokens/秒的硬件级极限推理芯片',
    description: '基于专有 LPU 芯片架构，彻底颠覆传统 GPU 内存带宽瓶颈。为实时多智能体、低延迟语音交互提供前所未有的流式响应。',
    perkBadge: '免费试用极速 API',
    affiliateUrl: 'https://groq.com',
    featured: true,
  },
  {
    name: 'Together.ai API',
    category: 'inference',
    tagline: '全系列开源前沿模型（Llama 3.3 / DeepSeek）一键调用',
    description: '提供全球最快、最稳定的开源模型 Serverless API 与专用端点，支持极低成本的 Token 计费与自定 LoRA 适配。',
    perkBadge: '注册立赠 $5 API 调用额度',
    promoCode: 'TOGETHER2026',
    affiliateUrl: 'https://together.ai',
  },

  // 4. Creative & Multimodal
  {
    name: 'Midjourney v7',
    category: 'creative',
    tagline: '顶尖影院级审美与超细节视觉生成引擎',
    description: '全球公认视觉审美最强的美学生成平台。支持精准字符渲染、角色与材质一致性控制（Consistent Styles），设计师不可或缺的灵感之源。',
    perkBadge: '年付享 20% 专属折扣',
    affiliateUrl: 'https://www.midjourney.com',
  },
  {
    name: 'ElevenLabs',
    category: 'creative',
    tagline: '全球领先的逼真语音克隆与跨语言同声传译',
    description: '为 AI Agent、播客与影视提供高保真、带情感起伏与呼吸感的合成语音，支持 29 种语言超强复刻。',
    perkBadge: '首月 80% 专属抵扣',
    affiliateUrl: 'https://elevenlabs.io',
  },
];

export const AffiliateEcosystem: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: '全部严选生态', icon: Sparkles },
    { id: 'gpu', label: 'GPU 算力集群', icon: Server },
    { id: 'code', label: 'AI 编码 & Agent', icon: Code2 },
    { id: 'inference', label: '推理加速 & API', icon: Cpu },
    { id: 'creative', label: '创意与多模态', icon: Zap },
  ];

  const filteredTools = activeCategory === 'all' 
    ? TOOLS 
    : TOOLS.filter(t => t.category === activeCategory);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="relative min-h-screen pt-24 pb-24 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-10 border border-amber-400/30 mb-8 shadow-2xl relative overflow-hidden glass-sheen">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-semibold tracking-wider">AI ECOSYSTEM & AFFILIATE PERKS</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400">2026 商业化变现与开发者特权</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              严选 AI 算力底座、前沿 Agent 与开发特权
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-2xl leading-relaxed">
              为探索通用人工智能的学者与工程师严选最具生产力价值的算力云、IDE 与推理 API。通过独家特权兑换码享受立减折扣，同时为本通史项目的持续运维注入动力。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="liquid-glass-amber px-5 py-2.5 rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <DollarSign className="w-4 h-4" />
              <span>提交你的 AI 产品 / 赞助</span>
            </button>
            <div className="text-[11px] font-mono text-stone-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>所有优惠码与推荐位官方验证有效</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-2 ${
                isActive
                  ? 'liquid-glass-amber text-amber-200 font-semibold shadow-sm'
                  : 'liquid-glass text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
        {filteredTools.map((tool, idx) => (
          <div
            key={idx}
            className={`liquid-glass rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between ${
              tool.featured 
                ? 'border-amber-400/40 bg-amber-500/[0.03] shadow-lg shadow-amber-500/5' 
                : 'border-white/10 hover:border-white/20'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                    {tool.name}
                  </h3>
                  {tool.featured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30">
                      ★ 推荐
                    </span>
                  )}
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{tool.perkBadge}</span>
                </span>
              </div>

              <div className="text-xs font-mono text-amber-400/90 mb-2.5">
                {tool.tagline}
              </div>

              <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                {tool.description}
              </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 mt-auto">
              {tool.promoCode ? (
                <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-stone-400">优惠码:</span>
                  <span className="text-xs font-mono font-bold text-amber-300">{tool.promoCode}</span>
                  <button
                    onClick={() => handleCopy(tool.promoCode!)}
                    className="text-stone-400 hover:text-white p-1"
                    title="复制优惠码"
                  >
                    {copiedCode === tool.promoCode ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-stone-500">
                  点击直达激活专属特权
                </div>
              )}

              <a
                href={tool.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="liquid-glass-amber px-4 py-1.5 rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white flex items-center space-x-1 transition-all"
              >
                <span>立即直达</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Monetization / Affiliate Transparency Disclaimer */}
      <div className="p-5 rounded-2xl liquid-glass border border-white/10 text-xs font-mono text-stone-400 text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bold">商业化变现与透明声明</span>
        </div>
        <p className="text-stone-300 font-sans text-xs max-w-2xl mx-auto leading-relaxed">
          本页面包含部分合作伙伴的返利推荐链接（Affiliate Links）。当您通过链接注册或购买云算力服务时，您将获得专属折扣或额外体验额度，同时平台可能会获得小额返佣以维持本站服务器托管与持续内容更新。这不会向您产生任何额外费用。
        </p>
      </div>

      {/* Submit Tool / Sponsorship Modal */}
      {showSubmitModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowSubmitModal(false)}
        >
          <div 
            className="relative w-full max-w-lg liquid-glass-strong rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              <span>SUBMIT YOUR AI TOOL & SPONSORSHIP</span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              入驻 AI 全景生态与品牌赞助
            </h3>
            <p className="text-xs text-stone-300 font-light mb-6">
              您的产品将展示在通史展台顶部横幅与生态专区，直接触达海量 AI 算法工程师、模型研究员与极客开发者。
            </p>

            <div className="space-y-3 font-mono text-xs mb-6">
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-300">生态推荐展位（带优惠码）</span>
                  <span className="text-emerald-400 text-[10px]">$99 / 月 或 ¥699</span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  永久收录于生态列表，首月尊享置顶与加精高光徽章，支持返利与专属转化代码跟踪。
                </p>
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-300">独家冠名赞助商（顶部全站轮播）</span>
                  <span className="text-amber-300 text-[10px]">商务定制</span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  在时空剧场首屏与 Scaling Lab 算力实验室核心交互组件中挂牌展示“由 XXX 算力独家支持”。
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-amber-300">商业投放直达通道</div>
                <div className="text-xs text-white font-mono mt-0.5">sponsor@aichronicle.com</div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('sponsor@aichronicle.com');
                  setCopiedCode('sponsor-copied');
                  setTimeout(() => setCopiedCode(null), 2000);
                }}
                className="liquid-glass-amber px-3.5 py-1.5 rounded-full text-xs font-mono text-amber-200 hover:text-white transition-all"
              >
                {copiedCode === 'sponsor-copied' ? '已复制邮箱' : '复制商务邮箱'}
              </button>
            </div>

            <button
              onClick={() => setShowSubmitModal(false)}
              className="mt-4 w-full py-2 rounded-full liquid-glass-pill text-xs font-mono text-stone-400 hover:text-white transition-colors"
            >
              关闭窗口
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
