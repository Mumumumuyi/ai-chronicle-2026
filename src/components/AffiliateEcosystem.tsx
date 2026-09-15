import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
  Zap,
  X
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface ToolItem {
  id: string;
  name: string;
  category: 'gpu' | 'code' | 'inference' | 'creative';
  promoCode?: string;
  affiliateUrl: string;
  featured?: boolean;
}

const TOOLS_BASE: ToolItem[] = [
  // 1. GPU & Compute
  {
    id: 'runpod',
    name: 'RunPod Cloud GPUs',
    category: 'gpu',
    promoCode: 'CHRONICLE10',
    affiliateUrl: 'https://runpod.io/?ref=ai-chronicle',
    featured: true,
  },
  {
    id: 'lambdalabs',
    name: 'Lambda Labs GPU Cloud',
    category: 'gpu',
    affiliateUrl: 'https://lambdalabs.com/service/gpu-cloud',
  },
  {
    id: 'autodl',
    name: 'AutoDL 算力云 (国内首选)',
    category: 'gpu',
    promoCode: 'AUTODL2026',
    affiliateUrl: 'https://www.autodl.com',
  },

  // 2. Coding & Agents
  {
    id: 'cursor',
    name: 'Cursor AI IDE',
    category: 'code',
    affiliateUrl: 'https://www.cursor.com',
    featured: true,
  },
  {
    id: 'windsurf',
    name: 'Windsurf Editor (Codeium)',
    category: 'code',
    affiliateUrl: 'https://codeium.com/windsurf',
  },

  // 3. High-Throughput Inference & API
  {
    id: 'groq',
    name: 'Groq LPU Inference',
    category: 'inference',
    affiliateUrl: 'https://groq.com',
    featured: true,
  },
  {
    id: 'together',
    name: 'Together.ai API',
    category: 'inference',
    promoCode: 'TOGETHER2026',
    affiliateUrl: 'https://together.ai',
  },

  // 4. Creative & Multimodal
  {
    id: 'midjourney',
    name: 'Midjourney v7',
    category: 'creative',
    affiliateUrl: 'https://www.midjourney.com',
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs Voice AI',
    category: 'creative',
    affiliateUrl: 'https://elevenlabs.io',
  },
];

export const AffiliateEcosystem: React.FC = () => {
  const { currentLang } = useLanguage();
  const isZh = currentLang === 'zh';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  const texts = {
    badge: isZh ? 'AI 商业化生态与开发者特权' : 'AI ECOSYSTEM & AFFILIATE PERKS',
    subBadge: isZh ? '2026 算力底座与工具推荐' : '2026 Verified AI Compute & Tools',
    title: isZh 
      ? '严选 AI 算力底座、前沿 Agent 与开发特权' 
      : currentLang === 'es'
      ? 'Ecosistema de Cómputo IA, Modelos y Beneficios Exclusivos'
      : currentLang === 'de'
      ? 'Verifiziertes KI-Rechenökosystem & Entwickler-Vorteile'
      : currentLang === 'fr'
      ? 'Écosystème Calcul IA & Avantages Développeurs'
      : 'Frontier Compute Infrastructure, Coding Agents & Perks',
    subtitle: isZh
      ? '为探索通用人工智能的学者与工程师严选最具生产力价值的算力云、IDE 与推理 API。通过独家特权兑换码享受立减折扣，同时支持本通史项目的持续运维。'
      : 'Curated GPU infrastructure, agentic IDEs, and high-throughput inference APIs. Activate exclusive partner discounts while sustaining our open research.',
    submitBtn: isZh ? '提交你的 AI 产品 / 赞助' : 'Submit AI Tool / Sponsorship',
    verifiedBadge: isZh ? '所有优惠码与推荐位官方验证有效' : 'All coupons & referral links officially verified',
    promoLabel: isZh ? '优惠码:' : 'Code:',
    directPerkText: isZh ? '点击直达激活专属特权' : 'Click to activate partner tier',
    directVisitBtn: isZh ? '立即直达' : 'Visit Partner',
    featuredBadge: isZh ? '★ 推荐' : '★ Featured',
    disclaimerTitle: isZh ? '商业化变现与透明声明' : 'Affiliate Transparency Notice',
    disclaimerBody: isZh
      ? '本页面包含部分合作伙伴的返利推荐链接（Affiliate Links）。当您通过链接注册或购买云算力服务时，您将获得专属折扣或额外体验额度，同时平台可能会获得小额返佣以维持本站服务器托管与持续内容更新。这不会向您产生任何额外费用。'
      : 'This directory contains verified affiliate and partnership links. Registering or provisioning compute via these links grants you exclusive promo credits while supporting our infrastructure. It incurs no additional cost to you.',
    submitModalBadge: isZh ? '入驻 AI 全景生态与品牌赞助' : 'SUBMIT YOUR AI TOOL & SPONSORSHIP',
    submitModalTitle: isZh ? '申请入驻生态专区与展台' : 'List in AI Chronicle Directory',
    submitModalDesc: isZh 
      ? '您的产品将展示在通史展台顶部横幅与生态专区，直接触达全球 AI 算法工程师、模型研究员与极客开发者。'
      : 'Showcase your compute cloud, developer tool, or API directly to frontier ML practitioners and researchers worldwide.',
    tier1Title: isZh ? '生态推荐展位（带优惠码）' : 'Directory Placement (with Promo Code)',
    tier1Price: isZh ? '$99 / 月 或 ¥699' : '$99 / mo or ¥699 CNY',
    tier1Desc: isZh 
      ? '永久收录于生态列表，首月尊享置顶与加精高光徽章，支持返利与专属转化代码跟踪。'
      : 'Permanent directory listing with verified coupon code and monthly performance reporting.',
    tier2Title: isZh ? '独家冠名赞助商（顶部全站轮播）' : 'Exclusive Headline Sponsor (Global)',
    tier2Price: isZh ? '商务定制' : 'Custom Enterprise',
    tier2Desc: isZh 
      ? '在时空剧场首屏与 Scaling Lab 算力实验室核心交互组件中挂牌展示“由 XXX 独家支持”。'
      : 'Prominent headline banner across Stage, Scaling Lab, and offline asset downloads.',
    contactChannelTitle: isZh ? '商业投放直达通道' : 'Official Partnership Desk',
    copyEmailBtn: isZh ? '复制商务邮箱' : 'Copy Email',
    copiedEmailBtn: isZh ? '已复制邮箱' : 'Copied',
    closeModalBtn: isZh ? '关闭窗口' : 'Close'
  };

  const categories = [
    { id: 'all', label: isZh ? '全部严选生态' : 'All Curated', icon: Sparkles },
    { id: 'gpu', label: isZh ? 'GPU 算力集群' : 'GPU Clouds', icon: Server },
    { id: 'code', label: isZh ? 'AI 编码 & Agent' : 'AI Coding & IDEs', icon: Code2 },
    { id: 'inference', label: isZh ? '推理加速 & API' : 'LPU & Fast APIs', icon: Cpu },
    { id: 'creative', label: isZh ? '创意与多模态' : 'Creative & Audio', icon: Zap },
  ];

  const toolDetails: Record<string, { tagline: string; description: string; perkBadge: string }> = {
    runpod: {
      tagline: isZh ? '极速按秒计费 H100 / A100 / RTX 4090 算力云' : 'Pay-per-second H100, A100, and RTX 4090 cloud GPUs',
      description: isZh ? '全球开发者构建大模型、微调与扩散模型的首选 GPU 容器平台。秒级拉起 PyTorch 与 vLLM 环境，支持按秒计费与 Spot 廉价实例。' : 'Deploy PyTorch & vLLM containers in seconds. Secure spot & on-demand instances at fraction of hyperscaler cost.',
      perkBadge: isZh ? '赠 $10 算力体验金' : '$10 Free Compute Credit',
    },
    lambdalabs: {
      tagline: isZh ? '最高性价比的预训练与深度学习集群' : 'Cost-effective high-performance clusters for deep learning',
      description: isZh ? '被众多硅谷 AI 独角兽选用的高性能算力平台。提供单卡到 8xH100 裸金属节点，免去繁琐运维，专注前沿探索。' : 'Bare-metal and cloud 8xH100/H200 instances for foundational research without long waitlists.',
      perkBadge: isZh ? '单卡低至 $0.50/小时' : 'Starting at $0.50/hr',
    },
    autodl: {
      tagline: isZh ? '国内低延迟、高带宽高校与开发者算力首选' : 'Leading domestic cloud GPU provider for Chinese universities & labs',
      description: isZh ? '支持国内各大高校与微信/支付宝充值，内置网盘加速与多种预置模型镜像，是中文社区最具性价比的实验利器。' : 'Fast localized mirrors, pre-configured weights, and student subsidies with simple mobile billing.',
      perkBadge: isZh ? '新人充值立减 20 元' : '¥20 CNY Welcome Voucher',
    },
    cursor: {
      tagline: isZh ? '基于深度仓库感知的下一代 AI 编程编辑器' : 'The AI-first code editor with deep repository awareness',
      description: isZh ? '深度集成 Claude 3.5 Sonnet 与 GPT-4o 的全新代码编辑器。支持全库语义索引、多文件自动改写与终端自动排障。' : 'Seamless multi-file edits, codebase indexing, and contextual generation with frontier LLMs.',
      perkBadge: isZh ? '首月免费试用 Pro 特权' : 'Free Pro Trial Available',
    },
    windsurf: {
      tagline: isZh ? 'Codeium 打造的全新 Flow 级协同编码 Agent' : 'Agentic IDE powered by Codeium Cascade architecture',
      description: isZh ? '以 Cascade 架构为核心，主动预测开发者意图并在本地工作流中自主演进，消除传统补全的割裂感。' : 'Real-time proactive workflow coordination that lives inside your terminal and codebase.',
      perkBadge: isZh ? '永久免费基础额度' : 'Generous Free Tier',
    },
    groq: {
      tagline: isZh ? '500+ Tokens/秒的硬件级极限推理芯片' : '500+ Tokens/second hardware LPU inference engine',
      description: isZh ? '基于专有 LPU 芯片架构，彻底颠覆传统 GPU 内存带宽瓶颈。为实时多智能体与语音交互提供极致流式响应。' : 'Deterministic SRAM processing engineered specifically for extreme low-latency LLM generations.',
      perkBadge: isZh ? '免费试用极速 API' : 'Free High-Speed API Key',
    },
    together: {
      tagline: isZh ? '全系列开源前沿模型（Llama 3.3 / DeepSeek）一键调用' : 'Serverless inference endpoints for open-weight models',
      description: isZh ? '提供全球最快、最稳定的开源模型 Serverless API 与专用端点，支持极低成本的 Token 计费与自定 LoRA 适配。' : 'Fast, reliable API endpoints for Llama 3.3, DeepSeek, and custom fine-tuned weights.',
      perkBadge: isZh ? '注册立赠 $5 API 额度' : '$5 Instant API Credit',
    },
    midjourney: {
      tagline: isZh ? '顶尖影院级审美与超细节视觉生成引擎' : 'Cinematic aesthetic generation with photorealistic fidelity',
      description: isZh ? '全球公认视觉审美最强的美学生成平台。支持精准字符渲染、角色与材质一致性控制。' : 'State-of-the-art diffusion visuals with consistent character and style parameter controls.',
      perkBadge: isZh ? '年付享 20% 专属折扣' : 'Save 20% on Annual Plans',
    },
    elevenlabs: {
      tagline: isZh ? '全球领先的逼真语音克隆与跨语言同声传译' : 'Natural voice synthesis and cross-language dubbing',
      description: isZh ? '为 AI Agent、播客与影视提供高保真、带情感起伏与呼吸感的合成语音，支持 29 种语言超强复刻。' : 'Emotionally nuanced speech generation across 29 languages for interactive voice agents.',
      perkBadge: isZh ? '首月 80% 专属抵扣' : '80% Off First Month',
    },
  };

  const filteredTools = activeCategory === 'all' 
    ? TOOLS_BASE 
    : TOOLS_BASE.filter(t => t.category === activeCategory);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-24 px-3 sm:px-8 max-w-6xl mx-auto no-print">
      {/* Header Banner */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-amber-400/30 mb-6 sm:mb-8 shadow-2xl relative overflow-hidden glass-sheen">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping flex-shrink-0" />
              <span className="font-semibold tracking-wider">{texts.badge}</span>
              <span className="text-stone-500">·</span>
              <span className="text-stone-400 truncate">{texts.subBadge}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-wide leading-snug">
              {texts.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-light max-w-2xl leading-relaxed">
              {texts.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 flex-shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowSubmitModal(true)}
              className="liquid-glass-amber px-5 py-2.5 rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white flex items-center justify-center space-x-2 transition-all shadow-md w-full sm:w-auto"
            >
              <DollarSign className="w-4 h-4" />
              <span>{texts.submitBtn}</span>
            </button>
            <div className="text-[10px] sm:text-[11px] font-mono text-stone-400 flex items-center justify-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{texts.verifiedBadge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter - Horizontal touch scroll */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-5 -mx-3 px-3 sm:mx-0 sm:px-0 no-scrollbar touch-pan-x">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 flex-shrink-0 ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-10">
        {filteredTools.map((tool) => {
          const details = toolDetails[tool.id] || {
            tagline: 'High-performance AI Service',
            description: 'Verified AI tool with special community perks.',
            perkBadge: 'Partner Discount'
          };

          return (
            <div
              key={tool.id}
              className={`liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                tool.featured 
                  ? 'border-amber-400/40 bg-amber-500/[0.03] shadow-lg shadow-amber-500/5' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2 min-w-0">
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white truncate">
                      {tool.name}
                    </h3>
                    {tool.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30 flex-shrink-0">
                        {texts.featuredBadge}
                      </span>
                    )}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1 flex-shrink-0">
                    <Tag className="w-3 h-3" />
                    <span>{details.perkBadge}</span>
                  </span>
                </div>

                <div className="text-xs font-mono text-amber-400/90 mb-2">
                  {details.tagline}
                </div>

                <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                  {details.description}
                </p>
              </div>

              {/* Card Footer: Responsive stack on mobile */}
              <div className="pt-3.5 border-t border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-auto">
                {tool.promoCode ? (
                  <div className="flex items-center justify-between sm:justify-start space-x-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                    <span className="text-[10px] font-mono text-stone-400">{texts.promoLabel}</span>
                    <span className="text-xs font-mono font-bold text-amber-300">{tool.promoCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(tool.promoCode!)}
                      className="text-stone-400 hover:text-white p-1"
                      title="Copy Coupon"
                    >
                      {copiedCode === tool.promoCode ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] sm:text-[11px] font-mono text-stone-500 py-1">
                    {texts.directPerkText}
                  </div>
                )}

                <a
                  href={tool.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass-amber px-4 py-2 sm:py-1.5 rounded-xl sm:rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white flex items-center justify-center space-x-1.5 transition-all flex-shrink-0"
                >
                  <span>{texts.directVisitBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monetization / Affiliate Transparency Disclaimer */}
      <div className="p-4 sm:p-5 rounded-2xl liquid-glass border border-white/10 text-xs font-mono text-stone-400 text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bold">{texts.disclaimerTitle}</span>
        </div>
        <p className="text-stone-300 font-sans text-xs max-w-2xl mx-auto leading-relaxed">
          {texts.disclaimerBody}
        </p>
      </div>

      {/* Submit Tool / Sponsorship Modal */}
      {showSubmitModal && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowSubmitModal(false)}
        >
          <div 
            className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto liquid-glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono text-amber-300 mb-2 pr-8">
              <DollarSign className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{texts.submitModalBadge}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2 pr-8">
              {texts.submitModalTitle}
            </h3>
            <p className="text-xs text-stone-300 font-light mb-5 leading-relaxed">
              {texts.submitModalDesc}
            </p>

            <div className="space-y-2.5 font-mono text-xs mb-5">
              <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-300">{texts.tier1Title}</span>
                  <span className="text-emerald-400 text-[10px]">{texts.tier1Price}</span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  {texts.tier1Desc}
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-300">{texts.tier2Title}</span>
                  <span className="text-amber-300 text-[10px]">{texts.tier2Price}</span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  {texts.tier2Desc}
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-amber-300">{texts.contactChannelTitle}</div>
                <div className="text-xs text-white font-mono mt-0.5 truncate">sponsor@aichronicle.com</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('sponsor@aichronicle.com');
                  setCopiedCode('sponsor-copied');
                  setTimeout(() => setCopiedCode(null), 2000);
                }}
                className="liquid-glass-amber px-3.5 py-1.5 rounded-full text-xs font-mono text-amber-200 hover:text-white transition-all flex-shrink-0"
              >
                {copiedCode === 'sponsor-copied' ? texts.copiedEmailBtn : texts.copyEmailBtn}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="mt-4 w-full py-2.5 rounded-full liquid-glass-pill text-xs font-mono text-stone-400 hover:text-white transition-colors"
            >
              {texts.closeModalBtn}
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
