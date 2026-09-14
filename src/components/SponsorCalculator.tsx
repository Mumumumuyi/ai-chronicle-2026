import React, { useState } from 'react';
import { Sparkles, Calculator, Check, Copy, Send, Download, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';
import { saveLead, getLeads, exportLeadsToCSV } from '../utils/leadStorage';

interface SponsorSlot {
  id: string;
  name: string;
  nameEn: string;
  monthlyUsd: number;
  monthlyCny: number;
  description: string;
  perks: string[];
}

const SPONSOR_SLOTS: SponsorSlot[] = [
  {
    id: 'hero_bar',
    name: '头部全局超级展位 (Hero Header Sponsor)',
    nameEn: 'Global Header Sticky Banner',
    monthlyUsd: 500,
    monthlyCny: 3500,
    description: '位于全站首屏顶端常驻，支持品牌动态 Logo、Slogan 与专属直达外链，极高曝光。',
    perks: ['全站全端 100% 首屏可见', '月均预计 50,000+ 科技高净值曝光', '专属 UTM 来源追踪']
  },
  {
    id: 'scaling_lab',
    name: '第二缩放定律计算器冠名 (Scaling Lab Sponsor)',
    nameEn: 'Scaling Law Simulator Exclusive Naming',
    monthlyUsd: 350,
    monthlyCny: 2500,
    description: '精准锁定关注算力、推理芯片与大模型架构的顶级算法研究员与量化投资人。',
    perks: ['算力模拟器核心控制区品牌露出', '可配置云厂商/芯片测试算力抵扣券', 'AI 论文与极客用户定向渗透']
  },
  {
    id: 'in_article',
    name: '1.8万字学术通史原生赞助 (In-Article Native)',
    nameEn: '18k-Word Treatise Academic Placement',
    monthlyUsd: 300,
    monthlyCny: 2000,
    description: '在被全球高校、实验室高频引用的万字宏篇章节中植入学术研究支持与案例。',
    perks: ['嵌入白皮书核心章节与打印版', '永久性学术引用权威背书', '低跳出率深度研读人群']
  },
  {
    id: 'bundle_insert',
    name: '4K数字资产包与独家白皮书彩页 (Digital Bundle Insert)',
    nameEn: 'Digital Bundle & High-Res Poster Insert',
    monthlyUsd: 200,
    monthlyCny: 1500,
    description: '每一位购买/下载《AI全景资产包》的用户均可在离线归档中获取贵司官方技术方案。',
    perks: ['高净值付费买家专属交付文档', '100% 离线永久本地保存', 'B2B 决策者精准直达']
  }
];

const DURATION_TIERS = [
  { months: 1, label: '1 个月 (体验期)', discount: 0, tag: 'Standard' },
  { months: 3, label: '3 个月 (季度推广)', discount: 0.1, tag: '省 10%' },
  { months: 6, label: '6 个月 (半年战役)', discount: 0.2, tag: '省 20%' },
  { months: 12, label: '12 个月 (年度战略伙伴)', discount: 0.3, tag: '立省 30% · 最优推荐' }
];

interface SponsorCalculatorProps {
  onClose: () => void;
}

export const SponsorCalculator: React.FC<SponsorCalculatorProps> = ({ onClose }) => {
  const [selectedSlots, setSelectedSlots] = useState<string[]>(['hero_bar']);
  const [durationMonths, setDurationMonths] = useState<number>(3);
  const [currency, setCurrency] = useState<'CNY' | 'USD'>('CNY');
  
  // Form state
  const [brandName, setBrandName] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showAdminLeads, setShowAdminLeads] = useState<boolean>(false);

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
      .map(id => SPONSOR_SLOTS.find(s => s.id === id)?.name)
      .filter(Boolean)
      .join('\n  - ');

    const currencySymbol = currency === 'CNY' ? '¥' : '$';

    return `【AI纪元 2026】商业赞助与展位意向书 (RFP & Proposal)
--------------------------------------------------
申请品牌: ${brandName || '（待填写公司名称）'}
联系渠道: ${contactInfo || '（待填写联系电话/微信/邮箱）'}
意向投放展位:
  - ${slotNames}
投放排期周期: ${durationMonths} 个月 (${currentTier.label})
费用结算币种: ${currency}
方案原价总计: ${currencySymbol}${rawTotalAllDuration.toLocaleString()}
商务阶梯折扣: -${currencySymbol}${savedAmount.toLocaleString()} (${Math.round(currentTier.discount * 100)}% 折扣)
最终应付总额: ${currencySymbol}${discountedTotal.toLocaleString()}
补充需求/对接备注: ${message || '无特殊备注，请尽快安排商务排期对接。'}
--------------------------------------------------
官方合作邮箱: contact@aichronicle.com
系统自动核算时间: ${new Date().toLocaleString()}
官网访问链接: https://mumumumuyi.github.io/ai-chronicle-2026/`;
  };

  const handleCopyProposal = () => {
    const text = generateProposalText();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;

    // Save lead into persistent CRM
    saveLead(contactInfo, 'sponsor', 'zh', {
      brandName,
      selectedSlots,
      durationMonths,
      currency,
      discountedTotal,
      message
    });

    setIsSubmitted(true);
  };

  const leads = getLeads();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto liquid-glass-strong rounded-3xl p-5 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300">
              <Calculator className="w-4 h-4" />
              <span>B2B SPONSORSHIP & ADS BUDGET CALCULATOR</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
              企业赞助排期与预算智能测算器
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex rounded-full p-0.5 bg-black/40 border border-white/10 text-xs font-mono">
              <button
                onClick={() => setCurrency('CNY')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currency === 'CNY' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
                }`}
              >
                人民币 (CNY)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full transition-all ${
                  currency === 'USD' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400'
                }`}
              >
                美元 (USD)
              </button>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">商业合作意向提交成功！</h3>
            <p className="text-sm text-stone-300 max-w-lg mx-auto">
              感谢 <span className="text-amber-300 font-bold">{brandName || '贵公司'}</span> 的关注！专属合作编号已记录至商业合作库。我们的商务团队将在 24 小时内通过{' '}
              <span className="text-amber-200 font-mono">{contactInfo}</span> 联络您并锁定排期位。
            </p>
            <div className="p-4 rounded-2xl liquid-glass border border-white/10 max-w-md mx-auto text-left font-mono text-xs space-y-1">
              <div>拟定排期: <span className="text-amber-300">{durationMonths} 个月</span></div>
              <div>最终测算预算: <span className="text-amber-300">{currency === 'CNY' ? '¥' : '$'}{discountedTotal.toLocaleString()}</span></div>
              <div>官方直联通道: <span className="text-white">contact@aichronicle.com</span></div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                onClick={handleCopyProposal}
                className="liquid-glass-amber px-5 py-2.5 rounded-full text-xs font-mono text-amber-200 flex items-center space-x-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? '已复制意向书文本' : '复制标准 RFP 合作函草案'}</span>
              </button>
              <button
                onClick={() => setIsSubmitted(false)}
                className="liquid-glass-pill px-5 py-2.5 rounded-full text-xs font-mono text-stone-300"
              >
                重新测算或修改
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Configuration Form */}
            <div className="lg:col-span-7 space-y-5">
              {/* Step 1: Select Placements */}
              <div>
                <label className="text-xs font-mono text-amber-300 flex items-center justify-between mb-2">
                  <span>1. 选择意向赞助展位 (可多选组合)</span>
                  <span className="text-stone-400 text-[11px]">已选 {selectedSlots.length} 项</span>
                </label>
                <div className="space-y-2.5">
                  {SPONSOR_SLOTS.map((slot) => {
                    const isSelected = selectedSlots.includes(slot.id);
                    const priceStr = currency === 'CNY' ? `¥${slot.monthlyCny}/月` : `$${slot.monthlyUsd}/mo`;
                    return (
                      <div
                        key={slot.id}
                        onClick={() => toggleSlot(slot.id)}
                        className={`p-3.5 rounded-2xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'liquid-glass-amber border-amber-400/60 shadow-md shadow-amber-500/10'
                            : 'liquid-glass border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-2.5">
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${
                              isSelected ? 'bg-amber-400 border-amber-400 text-stone-950' : 'border-stone-500 bg-black/40'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white flex items-center space-x-2">
                                <span>{slot.name}</span>
                              </div>
                              <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">{slot.description}</p>
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {slot.perks.map((perk, i) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-amber-200/90 font-mono">
                                    ✓ {perk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-300 flex-shrink-0 ml-2">
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
                  2. 选择投放周期 (长期投放享阶梯专属立减折扣)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  {DURATION_TIERS.map((tier) => {
                    const isSelected = durationMonths === tier.months;
                    return (
                      <button
                        key={tier.months}
                        type="button"
                        onClick={() => setDurationMonths(tier.months)}
                        className={`p-3 rounded-2xl text-center transition-all border ${
                          isSelected
                            ? 'liquid-glass-amber border-amber-400/70 text-amber-100 font-bold shadow-md shadow-amber-500/20'
                            : 'liquid-glass border-white/10 text-stone-300 hover:text-white'
                        }`}
                      >
                        <div className="text-sm font-bold">{tier.months} 个月</div>
                        <div className={`text-[10px] mt-1 ${tier.discount > 0 ? 'text-amber-400 font-bold' : 'text-stone-400'}`}>
                          {tier.tag}
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
              <div className="liquid-glass rounded-3xl p-5 border border-amber-400/30 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                  <span className="text-stone-400">实时预算测算清单</span>
                  <span className="text-amber-400 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    商业通道有效
                  </span>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-stone-300">
                    <span>所选展位基准月费:</span>
                    <span>{currency === 'CNY' ? '¥' : '$'}{rawTotalMonthly.toLocaleString()}/月</span>
                  </div>
                  <div className="flex justify-between text-stone-300">
                    <span>周期 ({durationMonths} 个月) 原价:</span>
                    <span className="line-through text-stone-500">
                      {currency === 'CNY' ? '¥' : '$'}{rawTotalAllDuration.toLocaleString()}
                    </span>
                  </div>
                  {currentTier.discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>商务折扣立减 ({Math.round(currentTier.discount * 100)}% OFF):</span>
                      <span>-{currency === 'CNY' ? '¥' : '$'}{savedAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400">最终测算总额 (税前)</div>
                      <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-300">
                        {currency === 'CNY' ? '¥' : '$'}{discountedTotal.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      平均 {currency === 'CNY' ? '¥' : '$'}{Math.round(discountedTotal / durationMonths).toLocaleString()}/月
                    </span>
                  </div>
                </div>
              </div>

              {/* Lead Capture Form */}
              <form onSubmit={handleSubmitInquiry} className="liquid-glass rounded-3xl p-5 border border-white/10 space-y-3">
                <div className="text-xs font-mono text-amber-300 font-bold flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>预约档期与索取排期表</span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="公司/品牌名称 (如：智谱 AI、某云厂商)"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    required
                    placeholder="联系方式 (邮箱 / 微信号 / 电话)"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="补充推广目标 / 期望上线日期 (选填)"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl liquid-glass-amber text-xs font-mono font-bold text-amber-200 hover:text-white transition-all flex items-center justify-center space-x-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>提交意向并预约排期</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyProposal}
                    className="px-3 py-2.5 rounded-xl liquid-glass-pill text-xs font-mono text-stone-300 hover:text-white transition-all"
                    title="复制规范格式的商务合作草案到剪贴板，方便通过邮件或企微发送"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isCopied && (
                  <div className="text-[11px] font-mono text-emerald-400 text-center animate-in fade-in">
                    ✓ 标准合作提案函与预算明细已复制到剪贴板！
                  </div>
                )}
              </form>

              {/* CRM Leads Audit Toggle for Site Owner */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdminLeads(!showAdminLeads)}
                  className="text-[10px] font-mono text-stone-400 hover:text-amber-300 flex items-center space-x-1 transition-colors"
                >
                  <ShieldAlert className="w-3 h-3 text-amber-400" />
                  <span>站点所有者看板: 已收录线索 ({leads.length})</span>
                </button>

                {showAdminLeads && (
                  <div className="mt-2 p-3 rounded-2xl bg-black/60 border border-white/10 text-xs font-mono space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-300">本地线索总数: <b className="text-amber-300">{leads.length}</b> 条</span>
                      <button
                        type="button"
                        onClick={exportLeadsToCSV}
                        className="liquid-glass-amber px-2.5 py-1 rounded-lg text-[10px] text-amber-200 hover:text-white flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>导出 CSV 表格</span>
                      </button>
                    </div>
                    <div className="max-h-28 overflow-y-auto space-y-1 text-[10px] text-stone-400 divide-y divide-white/5">
                      {leads.length === 0 ? (
                        <div className="py-2 text-stone-500 text-center">暂无线索，首批用户提交后将实时展示于此。</div>
                      ) : (
                        leads.map((l, i) => (
                          <div key={i} className="pt-1 flex justify-between">
                            <span className="text-stone-200">{l.email}</span>
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
    </div>
  );
};
