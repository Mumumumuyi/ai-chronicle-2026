import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Check, Copy, Send, Download, Building2, CheckCircle2, ShieldAlert, X, Mail, ArrowUpRight } from 'lucide-react';
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
      className="modal-backdrop anim-fade no-print"
      onClick={onClose}
    >
      <div
        className="modal-panel max-w-4xl max-h-[88vh] overflow-y-auto p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-5 mb-5 border-b border-[#292524] gap-4">
          <div>
            <p className="eyebrow on-dark mb-2">
              <i />
              {texts.headerBadge}
            </p>
            <h2 className="text-lg sm:text-2xl font-serif font-medium text-pearl">
              {texts.headerTitle}
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Currency Toggle */}
            <div className="flex gap-px bg-[#292524] border border-[#292524] mono">
              <button
                type="button"
                onClick={() => setCurrency('CNY')}
                className={`px-3 py-1.5 transition-colors ${
                  currency === 'CNY' ? 'bg-gold text-ob' : 'bg-ob text-[#78716C] hover:text-pearl'
                }`}
              >
                CNY (¥)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1.5 transition-colors ${
                  currency === 'USD' ? 'bg-gold text-ob' : 'bg-ob text-[#78716C] hover:text-pearl'
                }`}
              >
                USD ($)
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 border border-[#44403C] flex items-center justify-center text-[#78716C] hover:text-gold2 hover:border-gold transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isSubmitted ? (
          <div className="panel-dark-2 border-l-2 !border-l-gold p-6 sm:p-8 text-center space-y-4 anim-fade">
            <div className="w-14 h-14 border border-gold text-gold mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-medium text-pearl">
              {texts.successTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#A8A29E] max-w-lg mx-auto leading-relaxed">
              {texts.successDesc(brandName, contactInfo)}
            </p>
            <div className="p-4 border border-[#292524] bg-ob max-w-md mx-auto text-left font-mono text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#78716C]">{isZh ? '投放排期:' : 'Duration:'}</span>
                <span className="text-gold2">{durationMonths} {isZh ? '个月' : 'Mo'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">{isZh ? '测算预算:' : 'Estimate:'}</span>
                <span className="text-gold font-semibold">{currency === 'CNY' ? '¥' : '$'}{discountedTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78716C]">{isZh ? '官方商务对接:' : 'Contact:'}</span>
                <span className="text-pearl">{ownerContact.contactEmail}</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <a
                href={sponsorMailtoUrl}
                onClick={() => recordAffiliateAction('b2b_sponsor', 'B2B Calculator RFP (mailto)', 'click')}
                className="btn-gold !py-2.5 !px-5 text-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{isZh ? '一键直接发信对接' : 'Send RFP Email Now'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyProposal}
                className="btn-ghost"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? texts.copiedRfpBtn : texts.copyRfpBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="btn-ghost"
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
                <label className="mono text-gold flex items-center justify-between mb-3">
                  <span>{texts.step1Label}</span>
                  <span className="text-[#78716C]">{texts.step1SelectedCount}</span>
                </label>
                <div className="space-y-px bg-[#292524] border border-[#292524]">
                  {slotData.map((slot) => {
                    const isSelected = selectedSlots.includes(slot.id);
                    const slotObj = SPONSOR_SLOTS.find(s => s.id === slot.id)!;
                    const priceStr = currency === 'CNY' ? `¥${slotObj.monthlyCny}${texts.perMonthUnit}` : `$${slotObj.monthlyUsd}${texts.perMonthUnit}`;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => toggleSlot(slot.id)}
                        className={`p-3.5 sm:p-4 cursor-pointer transition-colors relative ${
                          isSelected ? 'bg-ob2' : 'bg-ob hover:bg-ob2'
                        }`}
                      >
                        {isSelected && <span className="absolute top-0 left-0 bottom-0 w-0.5 bg-gold" />}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 border transition-colors ${
                              isSelected ? 'bg-gold border-gold text-ob' : 'border-[#57534E] bg-black/40'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-serif font-medium text-pearl leading-snug">
                                {slot.name}
                              </div>
                              <p className="text-[11px] text-[#A8A29E] mt-1.5 leading-relaxed">{slot.desc}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {slot.perks.map((perk, i) => (
                                  <span key={i} className="mono px-2 py-0.5 border border-[#44403C] text-gold2/80">
                                    ✓ {perk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="mono text-gold flex-shrink-0">
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
                <label className="mono text-gold block mb-3">
                  {texts.step2Label}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#292524] border border-[#292524] font-mono text-xs">
                  {durationLabels.map((tier) => {
                    const isSelected = durationMonths === tier.months;
                    const tierConfig = DURATION_TIERS.find(t => t.months === tier.months)!;
                    return (
                      <button
                        key={tier.months}
                        type="button"
                        onClick={() => setDurationMonths(tier.months)}
                        className={`p-3 text-center transition-colors relative ${
                          isSelected ? 'bg-ob2 text-gold2' : 'bg-ob text-[#A8A29E] hover:bg-ob2'
                        }`}
                      >
                        {isSelected && <span className="absolute top-0 left-0 right-0 h-px bg-gold" />}
                        <div className="text-xs sm:text-sm font-semibold">{tier.label}</div>
                        <div className={`text-[10px] mt-1 ${tierConfig.discount > 0 ? 'text-gold' : 'text-[#57534E]'}`}>
                          {tier.sub}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Live Quote, RFP Generator & Lead Capture */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              {/* Quote Card */}
              <div className="panel-dark-2 p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#292524] mono">
                  <span className="text-[#78716C]">{texts.quoteTitle}</span>
                  <span className="text-gold flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {texts.channelActive}
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-[#A8A29E]">
                    <span>{texts.monthlyBase}</span>
                    <span>{currency === 'CNY' ? '¥' : '$'}{rawTotalMonthly.toLocaleString()}{texts.perMonthUnit}</span>
                  </div>
                  <div className="flex justify-between text-[#A8A29E]">
                    <span>{texts.originalPrice}</span>
                    <span className="line-through text-[#57534E]">
                      {currency === 'CNY' ? '¥' : '$'}{rawTotalAllDuration.toLocaleString()}
                    </span>
                  </div>
                  {currentTier.discount > 0 && (
                    <div className="flex justify-between text-gold2">
                      <span>{texts.discountLabel} ({Math.round(currentTier.discount * 100)}% OFF):</span>
                      <span>-{currency === 'CNY' ? '¥' : '$'}{savedAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#292524] flex items-end justify-between">
                    <div>
                      <div className="mono text-[#78716C] mb-1">{texts.finalTotal}</div>
                      <div className="text-2xl sm:text-3xl font-serif font-medium text-gold">
                        {currency === 'CNY' ? '¥' : '$'}{discountedTotal.toLocaleString()}
                      </div>
                    </div>
                    <span className="mono text-[#78716C]">
                      {texts.avgPerMonth} {currency === 'CNY' ? '¥' : '$'}{Math.round(discountedTotal / durationMonths).toLocaleString()}{texts.perMonthUnit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lead Capture Form */}
              <form onSubmit={handleSubmitInquiry} className="border border-[#292524] bg-ob p-5 space-y-3">
                <div className="mono text-gold flex items-center gap-1.5 mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{texts.formTitle}</span>
                </div>

                <input
                  type="text"
                  required
                  placeholder={texts.brandPlaceholder}
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#292524] text-pearl font-mono text-sm sm:text-xs focus:outline-none focus:border-gold transition-colors"
                />

                <input
                  type="text"
                  required
                  placeholder={texts.contactPlaceholder}
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#292524] text-pearl font-mono text-sm sm:text-xs focus:outline-none focus:border-gold transition-colors"
                />

                <input
                  type="text"
                  placeholder={texts.messagePlaceholder}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/40 border border-[#292524] text-pearl font-mono text-sm sm:text-xs focus:outline-none focus:border-gold transition-colors"
                />

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="btn-gold flex-1 justify-center !py-2.5 !text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{texts.submitBtn}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyProposal}
                    className="btn-ghost !py-2.5 !px-3.5 flex-shrink-0"
                    title={texts.copyBtnTitle}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isCopied && (
                  <div className="mono text-gold text-center anim-fade">
                    {texts.copySuccess}
                  </div>
                )}
              </form>

              {/* CRM Leads Audit Toggle */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowAdminLeads(!showAdminLeads)}
                  className="mono text-[#57534E] hover:text-gold flex items-center gap-1 transition-colors"
                >
                  <ShieldAlert className="w-3 h-3 text-gold" />
                  <span>{texts.ownerPanel}</span>
                </button>

                {showAdminLeads && (
                  <div className="mt-3 p-4 bg-black/60 border border-[#292524] font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#A8A29E]">本地线索: <b className="text-gold">{leads.length}</b></span>
                      <button
                        type="button"
                        onClick={exportLeadsToCSV}
                        className="btn-ghost !py-1.5 !px-2.5 !text-[10px]"
                      >
                        <Download className="w-3 h-3" />
                        <span>{texts.exportCsv}</span>
                      </button>
                    </div>
                    <div className="max-h-24 overflow-y-auto space-y-1 text-[10px] text-[#78716C] divide-y divide-[#292524]">
                      {leads.length === 0 ? (
                        <div className="py-2 text-[#57534E] text-center">{texts.noLeads}</div>
                      ) : (
                        leads.map((l, i) => (
                          <div key={i} className="pt-1.5 flex justify-between">
                            <span className="text-[#D6D3D1] truncate max-w-[180px]">{l.email}</span>
                            <span className="text-gold/80">[{l.source}]</span>
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
