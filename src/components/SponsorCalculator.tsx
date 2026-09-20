import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Calculator, Check, Copy, Send, Download, Building2, CheckCircle2, ShieldAlert, X, Mail, ArrowUpRight } from 'lucide-react';
import { saveLead, getLeads, exportLeadsToCSV } from '../utils/leadStorage';
import { useLanguage } from '../i18n/LanguageContext';
import { getOwnerContact } from '../utils/monetizationConfig';
import { recordAffiliateAction } from '../utils/analyticsTracker';

interface SponsorSlot {
  id: string;
  monthlyUsd: number;
  monthlyCny: number;
}

const SPONSOR_SLOTS: SponsorSlot[] = [
  { id: 'hero_bar', monthlyUsd: 500, monthlyCny: 3500 },
  { id: 'scaling_lab', monthlyUsd: 350, monthlyCny: 2500 },
  { id: 'in_article', monthlyUsd: 300, monthlyCny: 2000 },
  { id: 'bundle_insert', monthlyUsd: 200, monthlyCny: 1500 }
];

const DURATION_TIERS = [
  { months: 1, discount: 0 },
  { months: 3, discount: 0.1 },
  { months: 6, discount: 0.2 },
  { months: 12, discount: 0.3 }
];

interface SponsorCalculatorProps {
  onClose: () => void;
}

export const SponsorCalculator: React.FC<SponsorCalculatorProps> = ({ onClose }) => {
  const { currentLang } = useLanguage();
  const isZh = currentLang === 'zh';
  const ownerContact = getOwnerContact();

  const [selectedSlots, setSelectedSlots] = useState<string[]>(['hero_bar']);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [currency, setCurrency] = useState<'CNY' | 'USD'>(() => (currentLang === 'zh' ? 'CNY' : 'USD'));
  
  // Form state
  const [brandName, setBrandName] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showAdminLeads, setShowAdminLeads] = useState<boolean>(false);

  // Localization strings
  const texts = {
    headerBadge: isZh 
      ? 'B2B 商业赞助与展位智能测算' 
      : 'B2B SPONSORSHIP & ADS BUDGET CALCULATOR',
    headerTitle: isZh 
      ? '企业赞助排期与预算智能测算器' 
      : currentLang === 'es'
      ? 'Calculadora de Presupuesto y Patrocinio B2B'
      : currentLang === 'de'
      ? 'B2B-Sponsoring & Werbebudget-Rechner'
      : currentLang === 'fr'
      ? 'Calculateur de Sponsoring & Budget B2B'
      : 'B2B Sponsorship & Commercial Placement Calculator',
    step1Label: isZh 
      ? '1. 选择意向赞助展位 (可多选组合)' 
      : '1. Select Sponsorship Placements (Multi-select)',
    step1SelectedCount: isZh 
      ? `已选 ${selectedSlots.length} 项` 
      : `${selectedSlots.length} selected`,
    step2Label: isZh 
      ? '2. 选择投放周期 (长期投放享阶梯立减折扣)' 
      : '2. Select Duration (Longer terms unlock tiered discounts)',
    quoteTitle: isZh ? '实时预算测算清单' : 'Live Budget Estimate',
    channelActive: isZh ? '商业通道有效' : 'Channel Active',
    monthlyBase: isZh ? '所选展位基准月费:' : 'Base Monthly Rate:',
    originalPrice: isZh ? `周期 (${durationMonths} 个月) 原价:` : `Gross Total (${durationMonths} Mo):`,
    discountLabel: isZh ? '商务折扣立减' : 'Tiered Savings',
    finalTotal: isZh ? '最终测算总额 (税前)' : 'Net Estimated Total',
    avgPerMonth: isZh ? '平均' : 'Avg.',
    perMonthUnit: isZh ? '/月' : '/mo',
    formTitle: isZh ? '预约档期与索取排期表' : 'Reserve Slot & Request Media Kit',
    brandPlaceholder: isZh ? '公司/品牌名称 (如：智谱 AI、某云厂商)' : 'Company / Brand Name (e.g., RunPod, Together AI)',
    contactPlaceholder: isZh ? '联系方式 (邮箱 / 微信号 / 电话)' : 'Contact Channel (Work Email / Telegram / LinkedIn)',
    messagePlaceholder: isZh ? '补充推广目标 / 期望上线日期 (选填)' : 'Objectives / Target launch date (Optional)',
    submitBtn: isZh ? '提交意向并预约排期' : 'Submit RFP & Reserve Slot',
    copyBtnTitle: isZh ? '复制规范格式的商务合作草案' : 'Copy standard RFP proposal text to clipboard',
    copySuccess: isZh ? '✓ 标准合作提案函与预算明细已复制到剪贴板！' : '✓ Standard RFP proposal copied to clipboard!',
    ownerPanel: isZh ? `站点所有者看板: 已收录线索 (${getLeads().length})` : `Owner CRM Portal: Captured Leads (${getLeads().length})`,
    exportCsv: isZh ? '导出 CSV 表格' : 'Export CSV',
    noLeads: isZh ? '暂无线索，首批用户提交后将实时展示于此。' : 'No leads recorded yet. Submissions will appear here.',
    successTitle: isZh ? '商业合作意向提交成功！' : 'Sponsorship Inquiry Submitted!',
    successDesc: (brand: string, contact: string) => isZh 
      ? `感谢 ${brand || '贵公司'} 的关注！专属合作编号已记录至商业合作库。我们的商务团队将在 24 小时内通过 ${contact} 联络您并锁定排期位。`
      : `Thank you, ${brand || 'your team'}! Your RFP has been logged. Our partnership team will contact you via ${contact} within 24 hours.`,
    recalcBtn: isZh ? '重新测算或修改' : 'Modify or Recalculate',
    copyRfpBtn: isZh ? '复制标准 RFP 合作函草案' : 'Copy Proposal Text',
    copiedRfpBtn: isZh ? '已复制意向书文本' : 'Copied to Clipboard'
  };

  const slotData = [
    {
      id: 'hero_bar',
      name: isZh ? '头部全局超级展位 (Hero Header)' : 'Global Header Sticky Banner',
      desc: isZh ? '位于全站首屏顶端常驻，支持品牌动态 Logo、Slogan 与专属直达外链。' : 'Fixed top visibility across all views with custom brand logo, slogan, and outbound link.',
      perks: isZh ? ['全站全端 100% 首屏可见', '月均 50,000+ 高净值曝光', '专属 UTM 追踪'] : ['100% Top Above-the-Fold', '50k+ Monthly AI Devs', 'UTM Analytics Tracking']
    },
    {
      id: 'scaling_lab',
      name: isZh ? '第二缩放定律计算器冠名 (Scaling Lab)' : 'Scaling Law Simulator Exclusive Naming',
      desc: isZh ? '精准锁定关注算力、推理芯片与大模型架构的顶级算法研究员与量化投资人。' : 'Direct targeting of frontier ML engineers, GPU cluster architects, and tech investors.',
      perks: isZh ? ['算力模拟器核心控制区品牌露出', '可配置算力体验券', '定向渗透极客用户'] : ['Interactive Simulator Placement', 'Redeemable Compute Credit Link', 'High-Intent Engagement']
    },
    {
      id: 'in_article',
      name: isZh ? '1.8万字学术通史原生赞助 (In-Article Native)' : '18k-Word Treatise Academic Placement',
      desc: isZh ? '在被全球高校、实验室高频引用的万字宏篇章节中植入学术研究支持与案例。' : 'Embedded natively inside canonical research chapters referenced by AI labs and universities.',
      perks: isZh ? ['嵌入白皮书核心章节与打印版', '永久性学术引用权威背书', '深度研读人群'] : ['In-treatise Citation Placement', 'Print & Export Endorsement', 'Zero Ad-fatigue Readership']
    },
    {
      id: 'bundle_insert',
      name: isZh ? '4K数字资产包与独家彩页 (Digital Bundle Insert)' : 'Digital Bundle & 4K Wallpaper Insert',
      desc: isZh ? '每一位购买/下载《AI全景资产包》的用户均可在离线归档中获取贵司技术方案。' : 'Delivered permanently inside offline 4K packs and study bundles downloaded by practitioners.',
      perks: isZh ? ['高净值付费买家专属交付文档', '100% 离线永久本地保存', 'B2B 决策者直达'] : ['Offline Permanent Distribution', 'High-LTV Paid Audience', 'B2B Decision Maker Reach']
    }
  ];

  const durationLabels = [
    { months: 1, label: isZh ? '1 个月' : '1 Month', sub: isZh ? '体验期' : 'Standard' },
    { months: 3, label: isZh ? '3 个月' : '3 Months', sub: isZh ? '省 10%' : 'Save 10%' },
    { months: 6, label: isZh ? '6 个月' : '6 Months', sub: isZh ? '省 20%' : 'Save 20%' },
    { months: 12, label: isZh ? '12 个月' : '12 Months', sub: isZh ? '省 30% · 最优' : 'Save 30% · Best' }
  ];

  // Toggle slot
  const toggleSlot = (id: string) => {
    if (selectedSlots.includes(id)) {
      if (selectedSlots.length > 1) {
        setSelectedSlots(selectedSlots.filter(s => s !== id));
      }
    } else {
      setSelectedSlots([...selectedSlots, id]);
    }
  };

  // Calculations
  const currentTier = DURATION_TIERS.find(t => t.months === durationMonths) || DURATION_TIERS[0];
  const rawTotalMonthly = selectedSlots.reduce((acc, slotId) => {
    const slot = SPONSOR_SLOTS.find(s => s.id === slotId);
    if (!slot) return acc;
    return acc + (currency === 'CNY' ? slot.monthlyCny : slot.monthlyUsd);
  }, 0);

  const rawTotalAllDuration = rawTotalMonthly * durationMonths;
  const discountedTotal = Math.round(rawTotalAllDuration * (1 - currentTier.discount));
  const savedAmount = rawTotalAllDuration - discountedTotal;

  // Generate proposal text
  const generateProposalText = () => {
    const slotNames = selectedSlots
      .map(id => slotData.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join('\n  - ');

    const currencySymbol = currency === 'CNY' ? '¥' : '$';

    return `【AI Chronicle 2026】Commercial Sponsorship & RFP Proposal
--------------------------------------------------
Organization / Brand: ${brandName || '(Pending Organization Name)'}
Contact Channel: ${contactInfo || '(Pending Work Email / Phone)'}
Selected Placements:
  - ${slotNames}
Duration: ${durationMonths} Months
Currency: ${currency}
Standard Rate: ${currencySymbol}${rawTotalAllDuration.toLocaleString()}
Tiered Savings: -${currencySymbol}${savedAmount.toLocaleString()} (${Math.round(currentTier.discount * 100)}% OFF)
Final Estimated Net: ${currencySymbol}${discountedTotal.toLocaleString()}
Notes / Launch Timeline: ${message || 'Standard timeline, ready for media kit onboarding.'}
--------------------------------------------------
Official Inquiries: ${ownerContact.contactEmail} (WeChat: ${ownerContact.wechatId})
Generated at: ${new Date().toLocaleString()}
Portal: https://mumumumuyi.github.io/ai-chronicle-2026/`;
  };

  const sponsorMailtoUrl = `mailto:${ownerContact.contactEmail}?subject=${encodeURIComponent(
    `【AI Chronicle 2026】商业赞助意向与排期咨询: ${brandName || '品牌商务'}`
  )}&body=${encodeURIComponent(generateProposalText())}`;

  const handleCopyProposal = () => {
    const text = generateProposalText();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    recordAffiliateAction('b2b_sponsor', `B2B Calculator RFP Copy (${brandName || 'Draft'})`, 'promo_copy');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;

    saveLead(contactInfo, 'sponsor', currentLang, {
      brandName,
      selectedSlots,
      durationMonths,
      currency,
      discountedTotal,
      message
    });

    recordAffiliateAction('b2b_sponsor', `B2B Calculator Inquiry (${brandName || 'RFP'})`, 'click');
    setIsSubmitted(true);
  };

  const leads = getLeads();

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200 no-print"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[88vh] overflow-y-auto liquid-glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 sm:pb-4 mb-4 border-b border-white/10 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono text-amber-300">
              <Calculator className="w-3.5 h-3.5" />
              <span>{texts.headerBadge}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-white mt-0.5">
              {texts.headerTitle}
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end space-x-2">
            {/* Currency Pill */}
            <div className="flex rounded-full p-0.5 bg-black/40 border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => setCurrency('CNY')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currency === 'CNY' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                CNY (¥)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currency === 'USD' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                USD ($)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {texts.successTitle}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto leading-relaxed">
              {texts.successDesc(brandName, contactInfo)}
            </p>
            <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass border border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-stone-400">投放排期:</span>
                <span className="text-amber-300">{durationMonths} 个月</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">测算预算:</span>
                <span className="text-amber-300 font-bold">{currency === 'CNY' ? '¥' : '$'}{discountedTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">官方商务对接:</span>
                <span className="text-white">{ownerContact.contactEmail}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2.5 pt-2">
              <a
                href={sponsorMailtoUrl}
                onClick={() => recordAffiliateAction('b2b_sponsor', 'B2B Calculator RFP (mailto)', 'click')}
                className="liquid-glass-amber px-4 py-2 rounded-full text-xs font-mono font-bold text-amber-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-md hover:scale-105"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isZh ? '一键直接发信对接' : 'Send RFP Email Now'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyProposal}
                className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-mono text-amber-200 flex items-center space-x-1.5 hover:text-white transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? texts.copiedRfpBtn : texts.copyRfpBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-mono text-stone-300 hover:text-white transition-all"
              >
                {texts.recalcBtn}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
            {/* Left: Configuration Form */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              {/* Step 1: Select Placements */}
              <div>
                <label className="text-xs font-mono text-amber-300 flex items-center justify-between mb-2">
                  <span>{texts.step1Label}</span>
                  <span className="text-stone-400 text-[11px]">{texts.step1SelectedCount}</span>
                </label>
                <div className="space-y-2">
                  {slotData.map((slot) => {
                    const isSelected = selectedSlots.includes(slot.id);
                    const slotObj = SPONSOR_SLOTS.find(s => s.id === slot.id)!;
                    const priceStr = currency === 'CNY' ? `¥${slotObj.monthlyCny}${texts.perMonthUnit}` : `$${slotObj.monthlyUsd}${texts.perMonthUnit}`;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => toggleSlot(slot.id)}
                        className={`p-3 sm:p-3.5 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'liquid-glass-amber border-amber-400/60 shadow-md shadow-amber-500/10'
                            : 'liquid-glass border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start space-x-2.5">
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border transition-colors ${
                              isSelected ? 'bg-amber-400 border-amber-400 text-stone-950' : 'border-stone-500 bg-black/40'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-bold text-white leading-snug">
                                {slot.name}
                              </div>
                              <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">{slot.desc}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {slot.perks.map((perk, i) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-amber-200/90 font-mono">
                                    ✓ {perk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300 flex-shrink-0">
                            {priceStr}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Duration & Discount Tier */}
              <div>
                <label className="text-xs font-mono text-amber-300 block mb-2">
                  {texts.step2Label}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  {durationLabels.map((tier) => {
                    const isSelected = durationMonths === tier.months;
                    const tierConfig = DURATION_TIERS.find(t => t.months === tier.months)!;
                    return (
                      <button
                        key={tier.months}
                        type="button"
                        onClick={() => setDurationMonths(tier.months)}
                        className={`p-2.5 sm:p-3 rounded-2xl text-center transition-all border ${
                          isSelected
                            ? 'liquid-glass-amber border-amber-400/70 text-amber-100 font-bold shadow-md shadow-amber-500/20'
                            : 'liquid-glass border-white/10 text-stone-300 hover:text-white'
                        }`}
                      >
                        <div className="text-xs sm:text-sm font-bold">{tier.label}</div>
                        <div className={`text-[10px] mt-0.5 ${tierConfig.discount > 0 ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
                          {tier.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Live Quote, RFP Generator & Lead Capture */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              {/* Quote Card */}
              <div className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-amber-400/30 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs font-mono">
                  <span className="text-stone-400">{texts.quoteTitle}</span>
                  <span className="text-amber-400 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {texts.channelActive}
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>{texts.monthlyBase}</span>
                    <span>{currency === 'CNY' ? '¥' : '$'}{rawTotalMonthly.toLocaleString()}{texts.perMonthUnit}</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>{texts.originalPrice}</span>
                    <span className="line-through text-stone-500">
                      {currency === 'CNY' ? '¥' : '$'}{rawTotalAllDuration.toLocaleString()}
                    </span>
                  </div>
                  {currentTier.discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>{texts.discountLabel} ({Math.round(currentTier.discount * 100)}% OFF):</span>
                      <span>-{currency === 'CNY' ? '¥' : '$'}{savedAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-2.5 border-t border-white/10 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400">{texts.finalTotal}</div>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                        {currency === 'CNY' ? '¥' : '$'}{discountedTotal.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {texts.avgPerMonth} {currency === 'CNY' ? '¥' : '$'}{Math.round(discountedTotal / durationMonths).toLocaleString()}{texts.perMonthUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lead Capture Form */}
              <form onSubmit={handleSubmitInquiry} className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/10 space-y-3">
                <div className="text-xs font-mono text-amber-300 font-bold flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{texts.formTitle}</span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder={texts.brandPlaceholder}
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-stone-100 text-sm sm:text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder={texts.contactPlaceholder}
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-stone-100 text-sm sm:text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder={texts.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-stone-100 text-sm sm:text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl liquid-glass-amber text-xs font-mono font-bold text-amber-200 hover:text-white transition-all flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{texts.submitBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyProposal}
                    className="px-3.5 py-3 rounded-xl liquid-glass-pill text-xs font-mono text-stone-300 hover:text-white transition-all flex-shrink-0"
                    title={texts.copyBtnTitle}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isCopied && (
                  <div className="text-[11px] font-mono text-emerald-400 text-center animate-in fade-in">
                    {texts.copySuccess}
                  </div>
                )}
              </form>

              {/* CRM Leads Audit Toggle */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowAdminLeads(!showAdminLeads)}
                  className="text-[10px] font-mono text-stone-400 hover:text-amber-300 flex items-center space-x-1 transition-colors"
                >
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span>{texts.ownerPanel}</span>
                </button>

                {showAdminLeads && (
                  <div className="mt-2 p-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-300">本地线索: <b className="text-amber-300">{leads.length}</b></span>
                      <button
                        type="button"
                        onClick={exportLeadsToCSV}
                        className="liquid-glass-amber px-2.5 py-1 rounded-lg text-[10px] text-amber-200 hover:text-white flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>{texts.exportCsv}</span>
                      </button>
                    </div>
                    <div className="max-h-24 overflow-y-auto space-y-1 text-[10px] text-stone-400 divide-y divide-white/5">
                      {leads.length === 0 ? (
                        <div className="py-2 text-stone-500 text-center">{texts.noLeads}</div>
                      ) : (
                        leads.map((l, i) => (
                          <div key={i} className="pt-1 flex justify-between">
                            <span className="text-stone-200 truncate max-w-[180px]">{l.email}</span>
                            <span className="text-amber-400/80">[{l.source}]</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
