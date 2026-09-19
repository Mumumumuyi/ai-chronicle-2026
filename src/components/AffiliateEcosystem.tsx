import React, { useState, useEffect } from 'react';
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
  X,
  Mail,
  MessageCircle,
  Coffee,
  Heart
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  getMonetizationPartners, 
  getOwnerContact, 
  MonetizationPartner, 
  OwnerBusinessContact 
} from '../utils/monetizationConfig';
import { recordAffiliateAction } from '../utils/analyticsTracker';

export const AffiliateEcosystem: React.FC = () => {
  const { currentLang } = useLanguage();
  const isZh = currentLang === 'zh';

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [partners, setPartners] = useState<MonetizationPartner[]>([]);
  const [ownerContact, setOwnerContact] = useState<OwnerBusinessContact>(getOwnerContact());

  // Load live configured partners & contact details on mount
  useEffect(() => {
    setPartners(getMonetizationPartners());
    setOwnerContact(getOwnerContact());
  }, [showSubmitModal]);

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
    submitBtn: isZh ? '提交你的 AI 产品 / 品牌赞助' : 'Submit AI Tool / Sponsorship',
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
    tier1Desc: isZh 
      ? '永久收录于生态列表，首月尊享置顶与加精高光徽章，支持返利与专属转化代码跟踪。'
      : 'Permanent directory listing with verified coupon code and monthly performance reporting.',
    tier2Title: isZh ? '独家冠名赞助商（顶部全站轮播）' : 'Exclusive Headline Sponsor (Global)',
    tier2Desc: isZh 
      ? '在时空剧场首屏与 Scaling Lab 算力实验室核心交互组件中挂牌展示“由 XXX 独家支持”。'
      : 'Prominent headline banner across Stage, Scaling Lab, and offline asset downloads.',
    contactChannelTitle: isZh ? '官方商务合作直连通道' : 'Official Partnership Channels',
    copyEmailBtn: isZh ? '复制邮箱' : 'Copy Email',
    copyWechatBtn: isZh ? '复制微信' : 'Copy WeChat',
    copiedBtn: isZh ? '已复制' : 'Copied',
    closeModalBtn: isZh ? '关闭窗口' : 'Close',
    supportCreatorTitle: isZh ? '个人赞助与打赏通道' : 'Support & Tip Creator',
  };

  const categories = [
    { id: 'all', label: isZh ? '全部严选生态' : 'All Curated', icon: Sparkles },
    { id: 'gpu', label: isZh ? 'GPU 算力集群' : 'GPU Clouds', icon: Server },
    { id: 'code', label: isZh ? 'AI 编码 & Agent' : 'AI Coding & IDEs', icon: Code2 },
    { id: 'inference', label: isZh ? '推理加速 & API' : 'LPU & Fast APIs', icon: Cpu },
    { id: 'creative', label: isZh ? '创意与多模态' : 'Creative & Audio', icon: Zap },
  ];

  const filteredTools = activeCategory === 'all' 
    ? partners 
    : partners.filter(t => t.category === activeCategory);

  const handleCopy = (code: string, tool: MonetizationPartner) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    recordAffiliateAction(tool.id, tool.name, 'promo_copy');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handlePartnerClick = (tool: MonetizationPartner) => {
    recordAffiliateAction(tool.id, tool.name, 'click');
  };

  const handleCopyText = (text: string, tag: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(tag);
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
              className="liquid-glass-amber px-5 py-2.5 rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white flex items-center justify-center space-x-2 transition-all shadow-md w-full sm:w-auto hover:scale-105 active:scale-95"
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

      {/* Category Pills Filter */}
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
          const tagline = isZh ? tool.taglineZh : tool.taglineEn;
          const desc = isZh ? tool.descZh : tool.descEn;
          const perk = isZh ? tool.perkBadgeZh : tool.perkBadgeEn;
          const destinationUrl = tool.affiliateUrl || tool.officialFallbackUrl;

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
                    <span>{perk}</span>
                  </span>
                </div>

                <div className="text-xs font-mono text-amber-400/90 mb-2">
                  {tagline}
                </div>

                <p className="text-xs text-stone-300 font-light leading-relaxed mb-4">
                  {desc}
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
                      onClick={() => handleCopy(tool.promoCode!, tool)}
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
                  href={destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handlePartnerClick(tool)}
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
                  <span className="text-emerald-400 text-[10px] font-bold">
                    {isZh ? ownerContact.sponsorTier1PriceZh : ownerContact.sponsorTier1PriceEn}
                  </span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  {texts.tier1Desc}
                </p>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl liquid-glass border border-white/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-300">{texts.tier2Title}</span>
                  <span className="text-amber-300 text-[10px] font-bold">
                    {isZh ? ownerContact.sponsorTier2PriceZh : ownerContact.sponsorTier2PriceEn}
                  </span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  {texts.tier2Desc}
                </p>
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-2.5 mb-5">
              <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-amber-300 flex items-center space-x-1">
                    <Mail className="w-3 h-3" />
                    <span>官方商务合作邮箱</span>
                  </div>
                  <div className="text-xs text-white font-mono mt-0.5 truncate font-semibold">
                    {ownerContact.contactEmail}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(ownerContact.contactEmail, 'email')}
                  className="liquid-glass-amber px-3.5 py-1.5 rounded-full text-xs font-mono text-amber-200 hover:text-white transition-all flex-shrink-0"
                >
                  {copiedCode === 'email' ? texts.copiedBtn : texts.copyEmailBtn}
                </button>
              </div>

              {ownerContact.wechatId && (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-emerald-300 flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>主理人微信号 (商务即时对接)</span>
                    </div>
                    <div className="text-xs text-white font-mono mt-0.5 truncate font-semibold">
                      {ownerContact.wechatId}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(ownerContact.wechatId, 'wechat')}
                    className="liquid-glass-emerald px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-200 hover:text-white transition-all flex-shrink-0"
                  >
                    {copiedCode === 'wechat' ? texts.copiedBtn : texts.copyWechatBtn}
                  </button>
                </div>
              )}
            </div>

            {/* Optional Creator Support Links (Afdian / BuyMeACoffee) */}
            {(ownerContact.afdianUrl || ownerContact.buyMeACoffeeUrl) && (
              <div className="p-3 rounded-2xl bg-black/40 border border-white/10 mb-4 text-xs">
                <div className="text-[11px] font-mono text-stone-400 mb-2 flex items-center space-x-1.5">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  <span>{texts.supportCreatorTitle}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ownerContact.afdianUrl && (
                    <a
                      href={ownerContact.afdianUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-[11px] font-mono flex items-center space-x-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>爱发电赞助 (支持微信/支付宝)</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                  {ownerContact.buyMeACoffeeUrl && (
                    <a
                      href={ownerContact.buyMeACoffeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-center space-x-1"
                    >
                      <Coffee className="w-3 h-3" />
                      <span>Buy Me a Coffee (Stripe/PayPal)</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {ownerContact.customNoticeZh && (
              <p className="text-[11px] text-stone-400 font-sans leading-relaxed mb-4 p-2.5 rounded-xl bg-stone-900/50 border border-white/5">
                {ownerContact.customNoticeZh}
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="w-full py-2.5 rounded-full liquid-glass-pill text-xs font-mono text-stone-400 hover:text-white transition-colors"
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
