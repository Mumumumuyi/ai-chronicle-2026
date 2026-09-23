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
import { useScrollReveal } from '../hooks/useScrollReveal';

export const AffiliateEcosystem: React.FC = () => {
  const { currentLang } = useLanguage();
  const isZh = currentLang === 'zh';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const revealRef = useScrollReveal<HTMLDivElement>([activeCategory, currentLang]);
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
    badge: isZh ? 'AI 生态与开发者工具' : 'AI ECOSYSTEM & DEVELOPER TOOLS',
    subBadge: isZh ? '2026 算力底座与工具推荐' : '2026 AI Compute & Tools',
    title: isZh
      ? '严选 AI 算力底座与前沿开发工具'
      : currentLang === 'es'
      ? 'Ecosistema de Cómputo IA y Herramientas de Desarrollo'
      : currentLang === 'de'
      ? 'KI-Rechenökosystem & Entwickler-Tools'
      : currentLang === 'fr'
      ? 'Écosystème Calcul IA & Outils Développeurs'
      : 'Frontier Compute Infrastructure & Developer Tools',
    subtitle: isZh
      ? '为探索通用人工智能的学者与工程师严选最具生产力价值的算力云、IDE 与推理 API，全部为官方网站直达链接。'
      : 'Curated GPU infrastructure, agentic IDEs, and high-throughput inference APIs — all linking directly to official sites.',
    submitBtn: isZh ? '提交你的 AI 产品 / 品牌赞助' : 'Submit AI Tool / Sponsorship',
    promoLabel: isZh ? '优惠码:' : 'Code:',
    directPerkText: isZh ? '点击直达官网' : 'Visit official site',
    directVisitBtn: isZh ? '立即直达' : 'Visit Partner',
    featuredBadge: isZh ? '★ 推荐' : '★ Featured',
    disclaimerTitle: isZh ? '生态工具声明' : 'Tool Directory Notice',
    disclaimerBody: isZh
      ? '本页所列均为官方网站直达链接，为站长实测推荐的工具清单，当前不包含任何付费推广位。'
      : 'All links above go directly to official sites. This directory lists tools the maintainer recommends; no paid placements are currently active.',
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
    recordAffiliateAction('b2b_sponsor', `B2B Sponsor (${tag})`, 'promo_copy');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sponsorMailtoUrl = `mailto:${ownerContact.contactEmail}?subject=${encodeURIComponent(
    isZh ? '【AI Chronicle 2026】品牌赞助与生态入驻咨询' : 'Inquiry: Sponsorship & Partnership for AI Chronicle 2026'
  )}&body=${encodeURIComponent(
    isZh
      ? `尊敬的 AI Chronicle 主理人：\n\n您好！我们希望申请 AI Chronicle 2026 的特约赞助/品牌展位/生态入驻合作。\n\n1. 品牌/产品名称：\n2. 意向合作档位（特约品牌展位 / 独家冠名 / 定制专栏）：\n3. 官方网址/产品链接：\n4. 意向合作周期：\n5. 期望上线时间：\n6. 商务联系人及电话/微信：\n\n期待与您的回复与合作！`
      : `Dear AI Chronicle Team,\n\nWe would like to explore partnership and sponsorship opportunities with AI Chronicle 2026.\n\n1. Brand / Product Name:\n2. Target Sponsorship Tier:\n3. Product URL:\n4. Desired Duration:\n5. Contact Information:\n\nLooking forward to hearing from you!`
  )}`;

  return (
    <div ref={revealRef} className="relative min-h-screen bg-ob pt-24 sm:pt-28 pb-24 px-5 sm:px-8 max-w-6xl mx-auto no-print">
      {/* Header */}
      <div className="rv pb-10 border-b border-[#292524] mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-3">
            <p className="eyebrow on-dark">
              <i />
              {texts.badge} · {texts.subBadge}
            </p>
            <h2 className="text-2xl sm:text-4xl font-serif font-medium text-pearl tracking-[-0.01em] leading-snug">
              {texts.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A29E] max-w-2xl leading-relaxed">
              {texts.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="btn-gold !py-2.5 !px-5 text-xs flex-shrink-0"
          >
            <DollarSign className="w-4 h-4" />
            <span>{texts.submitBtn}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Filter — dark hairline pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-7 -mx-5 px-5 sm:mx-0 sm:px-0 no-scrollbar touch-pan-x">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`pill-dark whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                isActive ? '!border-gold !text-gold' : ''
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="normal-case tracking-normal text-xs">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tools Grid — hairline cells */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#292524] border border-[#292524] mb-10">
        {filteredTools.map((tool) => {
          const tagline = isZh ? tool.taglineZh : tool.taglineEn;
          const desc = isZh ? tool.descZh : tool.descEn;
          const perk = isZh ? tool.perkBadgeZh : tool.perkBadgeEn;
          const destinationUrl = tool.affiliateUrl || tool.officialFallbackUrl;

          return (
            <div
              key={tool.id}
              className={`bg-ob p-5 sm:p-6 flex flex-col justify-between transition-colors hover:bg-ob2 ${
                tool.featured ? 'relative' : ''
              }`}
            >
              {tool.featured && <span className="absolute top-0 left-0 right-0 h-px bg-gold" aria-hidden="true" />}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className="text-base sm:text-lg font-serif font-medium text-pearl truncate">
                      {tool.name}
                    </h3>
                    {tool.featured && (
                      <span className="mono px-2 py-0.5 border border-[rgba(201,168,106,0.4)] text-gold flex-shrink-0">
                        {texts.featuredBadge}
                      </span>
                    )}
                  </div>
                  <span className="mono px-2 py-0.5 border border-[#44403C] text-[#A8A29E] flex items-center gap-1 flex-shrink-0">
                    <Tag className="w-3 h-3 text-gold" />
                    <span>{perk}</span>
                  </span>
                </div>

                <div className="mono text-gold mb-2.5">
                  {tagline}
                </div>

                <p className="text-xs text-[#A8A29E] leading-relaxed mb-4">
                  {desc}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-[#292524] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mt-auto">
                {tool.promoCode ? (
                  <div className="flex items-center justify-between sm:justify-start gap-2 bg-black/40 px-3 py-1.5 border border-[#292524]">
                    <span className="mono text-[#78716C]">{texts.promoLabel}</span>
                    <span className="text-xs font-mono font-semibold text-gold2">{tool.promoCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(tool.promoCode!, tool)}
                      className="text-[#78716C] hover:text-gold2 p-1 transition-colors"
                      title="Copy Coupon"
                    >
                      {copiedCode === tool.promoCode ? (
                        <Check className="w-3.5 h-3.5 text-gold" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="mono text-[#57534E] py-1">
                    {texts.directPerkText}
                  </div>
                )}

                <a
                  href={destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handlePartnerClick(tool)}
                  className="btn-ghost flex-shrink-0"
                >
                  <span>{texts.directVisitBtn}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Transparency Disclaimer */}
      <div className="rv panel-dark-2 border-l-2 !border-l-gold p-4 sm:p-5 space-y-2">
        <div className="mono text-gold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{texts.disclaimerTitle}</span>
        </div>
        <p className="text-xs text-[#A8A29E] leading-relaxed max-w-2xl">
          {texts.disclaimerBody}
        </p>
      </div>

      {/* Submit Tool / Sponsorship Modal */}
      {showSubmitModal && typeof document !== 'undefined' && createPortal(
        <div
          className="modal-backdrop anim-fade"
          onClick={() => setShowSubmitModal(false)}
        >
          <div
            className="modal-panel max-w-lg max-h-[88vh] overflow-y-auto p-5 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 w-8 h-8 border border-[#44403C] flex items-center justify-center text-[#78716C] hover:text-gold2 hover:border-gold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="eyebrow on-dark mb-3 pr-8">
              <i />
              {texts.submitModalBadge}
            </p>

            <h3 className="text-xl sm:text-2xl font-serif font-medium text-pearl mb-2 pr-8">
              {texts.submitModalTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A29E] mb-5 leading-relaxed">
              {texts.submitModalDesc}
            </p>

            <div className="space-y-px bg-[#292524] border border-[#292524] mb-5">
              <div className="bg-ob p-4">
                <div className="flex justify-between items-center mb-1.5 gap-2">
                  <span className="mono text-gold">{texts.tier1Title}</span>
                  <span className="mono text-gold2 flex-shrink-0">
                    {isZh ? ownerContact.sponsorTier1PriceZh : ownerContact.sponsorTier1PriceEn}
                  </span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  {texts.tier1Desc}
                </p>
              </div>

              <div className="bg-ob p-4">
                <div className="flex justify-between items-center mb-1.5 gap-2">
                  <span className="mono text-gold">{texts.tier2Title}</span>
                  <span className="mono text-gold2 flex-shrink-0">
                    {isZh ? ownerContact.sponsorTier2PriceZh : ownerContact.sponsorTier2PriceEn}
                  </span>
                </div>
                <p className="text-xs text-[#A8A29E] leading-relaxed">
                  {texts.tier2Desc}
                </p>
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-2.5 mb-5">
              {ownerContact.contactEmail && (
              <div className="panel-dark-2 border-l-2 !border-l-gold p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="mono text-gold flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    <span>{isZh ? '官方商务合作邮箱' : 'Official Business Email'}</span>
                  </div>
                  <div className="text-xs text-pearl font-mono mt-1 truncate">
                    {ownerContact.contactEmail}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={sponsorMailtoUrl}
                    onClick={() => recordAffiliateAction('b2b_sponsor', 'B2B Sponsor (mailto)', 'click')}
                    className="btn-ghost"
                  >
                    <span>{isZh ? '一键发信对接' : 'Send Email'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyText(ownerContact.contactEmail, 'email')}
                    className="btn-ghost"
                  >
                    {copiedCode === 'email' ? texts.copiedBtn : texts.copyEmailBtn}
                  </button>
                </div>
              </div>
              )}

              {ownerContact.wechatId && (
                <div className="panel-dark-2 border-l-2 !border-l-gold p-3.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="mono text-gold flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{isZh ? '主理人微信号 (商务即时对接)' : 'WeChat (Business)'}</span>
                    </div>
                    <div className="text-xs text-pearl font-mono mt-1 truncate">
                      {ownerContact.wechatId}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText(ownerContact.wechatId, 'wechat')}
                    className="btn-ghost flex-shrink-0"
                  >
                    {copiedCode === 'wechat' ? texts.copiedBtn : texts.copyWechatBtn}
                  </button>
                </div>
              )}
            </div>

            {/* Creator Support Links (Afdian / BuyMeACoffee) */}
            {(ownerContact.afdianUrl || ownerContact.buyMeACoffeeUrl) && (
              <div className="border border-[#292524] bg-black/40 p-3.5 mb-4">
                <div className="mono text-[#78716C] mb-2.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-gold" />
                  <span>{texts.supportCreatorTitle}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ownerContact.afdianUrl && (
                    <a
                      href={ownerContact.afdianUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono px-3 py-1.5 border border-[#44403C] text-[#A8A29E] hover:text-gold2 hover:border-gold flex items-center gap-1.5 transition-colors"
                    >
                      <Zap className="w-3 h-3 text-gold" />
                      <span>{isZh ? '爱发电赞助 (支持微信/支付宝)' : 'Afdian (WeChat/Alipay)'}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                  {ownerContact.buyMeACoffeeUrl && (
                    <a
                      href={ownerContact.buyMeACoffeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono px-3 py-1.5 border border-[#44403C] text-[#A8A29E] hover:text-gold2 hover:border-gold flex items-center gap-1.5 transition-colors"
                    >
                      <Coffee className="w-3 h-3 text-gold" />
                      <span>Buy Me a Coffee (Stripe/PayPal)</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {ownerContact.customNoticeZh && (
              <p className="text-[11px] text-[#78716C] leading-relaxed mb-4 p-3 border border-[#292524]">
                {ownerContact.customNoticeZh}
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              className="btn-ghost w-full justify-center"
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
