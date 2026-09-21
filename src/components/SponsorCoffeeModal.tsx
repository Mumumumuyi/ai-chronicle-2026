import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Coffee, Heart, QrCode, CreditCard, Sparkles, X, Check, Copy, Zap, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getOwnerContact } from '../utils/monetizationConfig';
import { recordAffiliateAction } from '../utils/analyticsTracker';

interface SponsorCoffeeModalProps {
  onClose: () => void;
}

export const SponsorCoffeeModal: React.FC<SponsorCoffeeModalProps> = ({ onClose }) => {
  const { currentLang } = useLanguage();
  const isZh = currentLang === 'zh';
  const ownerContact = getOwnerContact();
  const [activeTab, setActiveTab] = useState<'wechat' | 'global'>(() => (isZh ? 'wechat' : 'global'));
  const [selectedAmount, setSelectedAmount] = useState<number>(30);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  const texts = {
    badge: isZh ? '创作者支持与赞助打赏' : 'SUPPORT & SPONSORSHIP',
    subBadge: isZh ? '打赏赞助与服务器补贴' : 'Creator & Infrastructure Grant',
    title: isZh 
      ? '支持《AI 全景通史》独立研创' 
      : currentLang === 'es'
      ? 'Apoyar la Investigación Independiente'
      : currentLang === 'de'
      ? 'Unterstützen Sie die unabhängige KI-Forschung'
      : currentLang === 'fr'
      ? 'Soutenez la Recherche Indépendante'
      : 'Support Independent AI Chronicle Research',
    desc: isZh
      ? '本通史长卷与液态玻璃交互系统由独立研究者潜心打磨，无任何商业财团背景。您的每一份慷慨赞助，都将全额用于覆盖高密集 Anycast CDN 流量、服务器托管与知识库的每月持续更新。'
      : 'This canonical chronicle is independently crafted and hosted without corporate agenda. Your generous support funds high-bandwidth Anycast CDN egress, servers, and ongoing archival research.',
    tabWeChat: isZh ? '微信 / 支付宝' : 'WeChat / Alipay',
    tabGlobal: isZh ? '国际卡 / Stripe' : 'Cards / Stripe',
    qrNote: isZh 
      ? `赞助成功后，请将订单号或截图发至 ${ownerContact.contactEmail} 以登入荣誉致谢榜` 
      : `Send transaction proof or handle to ${ownerContact.contactEmail} to be listed on the Wall.`,
    bmacTitle: 'Buy Me a Coffee',
    bmacSubtitle: isZh ? '支持国际信用卡、Apple Pay、Google Pay 或 PayPal 秒级打赏' : 'Support via Credit Card, Apple Pay, Google Pay, or PayPal in seconds.',
    bmacBtn: isZh ? '前往 Buy Me a Coffee 打赏 →' : 'Tip via Buy Me a Coffee →',
    cryptoTitle: 'USDT / ETH (ERC-20)',
    copyBtn: isZh ? '复制' : 'Copy',
    copiedBtn: isZh ? '已复制' : 'Copied',
    wallTitle: isZh ? '近期赞助与支持者荣誉榜' : 'Recent Patrons & Contributors Wall',
    wallSubtitle: isZh ? '致谢所有共同建设者' : 'Honoring our community',
  };

  const amountsCNY = [
    { value: 6, label: '一杯咖啡 ☕', desc: '添一杯提神美式' },
    { value: 30, label: '算力补贴 ⚡', desc: '支持全球 CDN 开销', popular: true },
    { value: 99, label: '硬核支持者 🚀', desc: '列入通史长卷致谢' },
    { value: 299, label: '白金赞助商 💎', desc: '专属合作与鸣谢' },
  ];

  const amountsUSD = [
    { value: 5, label: '$5 · Coffee ☕', desc: 'A quick espresso' },
    { value: 15, label: '$15 · Server ⚡', desc: '1 month CDN egress', popular: true },
    { value: 50, label: '$50 · Patron 🚀', desc: 'Permanent wall tribute' },
    { value: 150, label: '$150 · Gold 💎', desc: 'Honorary research sponsor' },
  ];

  const recentSupporters = [
    { name: 'Dr. Turing_Fan', amount: isZh ? '¥99' : '$15', time: '10m ago', msg: isZh ? '极具美感的通史长卷，值得被更多人看见！' : 'Stunning canonical UI and profound depth!' },
    { name: 'NeuralNomad', amount: isZh ? '¥30' : '$5', time: '1h ago', msg: isZh ? '测试时算力仿真器做得很惊艳，继续加油。' : 'Test-time compute simulator is superb.' },
    { name: 'K. Takahashi', amount: '$15', time: '3h ago', msg: 'Exceptional visual aesthetics and historical depth!' },
    { name: 'QuantDev_99', amount: isZh ? '¥299' : '$50', time: '1d ago', msg: isZh ? '已将页面置顶为团队学习参考。' : 'Pinned as our team reference manual.' },
  ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-stone-950/90 backdrop-blur-md animate-in fade-in duration-200 no-print"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg max-h-[88vh] overflow-y-auto liquid-glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-7 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-mono text-amber-300 mb-2 pr-8">
          <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse flex-shrink-0" />
          <span className="tracking-wider font-semibold">{texts.badge}</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400 text-[10px] sm:text-[11px] truncate">{texts.subBadge}</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2 pr-8">
          {texts.title}
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-5">
          {texts.desc}
        </p>

        {/* Channel Tabs */}
        <div className="flex items-center space-x-1.5 p-1 liquid-glass rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('wechat');
              setSelectedAmount(30);
            }}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'wechat'
                ? 'liquid-glass-amber text-amber-200 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{texts.tabWeChat}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('global');
              setSelectedAmount(15);
            }}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'global'
                ? 'liquid-glass-amber text-amber-200 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{texts.tabGlobal}</span>
          </button>
        </div>

        {/* Tab 1: Domestic WeChat / Alipay */}
        {activeTab === 'wechat' && (
          <div className="space-y-4 sm:space-y-5">
            {/* Amount Selection Grid */}
            <div className="grid grid-cols-2 gap-2">
              {amountsCNY.map((item) => {
                const isSelected = selectedAmount === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedAmount(item.value)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all relative border ${
                      isSelected
                        ? 'liquid-glass-amber border-amber-400/60 bg-amber-500/15 text-white shadow-md'
                        : 'liquid-glass border-white/10 text-stone-300 hover:border-white/20'
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-amber-400 text-stone-950 font-bold">
                        HOT
                      </span>
                    )}
                    <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-stone-400 leading-tight">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* QR Code Presentation Slab */}
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl liquid-glass border border-amber-400/30 text-center flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-white p-2.5 shadow-2xl flex flex-col items-center justify-center border-4 border-amber-400/40 relative overflow-hidden">
                {ownerContact.qrCodeUrl ? (
                  <img
                    src={ownerContact.qrCodeUrl}
                    alt="微信/支付宝收款二维码"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center bg-stone-50 p-2 text-stone-800">
                    <Coffee className="w-9 h-9 text-amber-600 mb-1.5" />
                    <span className="text-xs font-mono font-bold text-stone-900">赞助 ¥{selectedAmount} 咖啡</span>
                    <span className="text-[10px] text-stone-500 mt-1">微信 / 支付宝 扫一扫</span>
                  </div>
                )}
              </div>

              {ownerContact.afdianUrl && (
                <div className="w-full max-w-sm mt-3.5">
                  <a
                    href={ownerContact.afdianUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => recordAffiliateAction('creator_tip', 'Afdian Tip', 'click')}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-700/40 to-purple-600/30 hover:from-purple-600/50 hover:to-purple-500/40 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-all shadow-lg shadow-purple-950/40 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Zap className="w-3.5 h-3.5 text-purple-300" />
                    <span>{isZh ? `通过爱发电在线赞助 ¥${selectedAmount} (支持微信/支付宝)` : `Tip via Afdian (WeChat/Alipay)`}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="mt-3 sm:mt-4 text-[11px] font-mono text-stone-300 flex items-center space-x-1.5 text-center max-w-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="leading-snug">{texts.qrNote}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Global Payment Channels */}
        {activeTab === 'global' && (
          <div className="space-y-3.5 sm:space-y-4">
            {/* Amount Selection Grid (USD) */}
            <div className="grid grid-cols-2 gap-2">
              {amountsUSD.map((item) => {
                const isSelected = selectedAmount === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedAmount(item.value)}
                    className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all relative border ${
                      isSelected
                        ? 'liquid-glass-amber border-amber-400/60 bg-amber-500/15 text-white shadow-md'
                        : 'liquid-glass border-white/10 text-stone-300 hover:border-white/20'
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-amber-400 text-stone-950 font-bold">
                        HOT
                      </span>
                    )}
                    <div className="text-xs sm:text-sm font-bold text-amber-300 font-mono mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-stone-400 leading-tight">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-4 sm:p-5 rounded-2xl liquid-glass border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-white text-sm">{texts.bmacTitle}</span>
                <span className="text-xs font-mono text-amber-300">${selectedAmount} USD</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {texts.bmacSubtitle}
              </p>
              <a
                href={ownerContact.buyMeACoffeeUrl || "https://buymeacoffee.com"}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordAffiliateAction('creator_tip', 'BuyMeACoffee Tip', 'click')}
                className="w-full py-2.5 rounded-xl liquid-glass-amber text-xs font-mono font-bold text-amber-200 hover:text-white flex items-center justify-center space-x-2 transition-all block text-center"
              >
                <Coffee className="w-4 h-4" />
                <span>{texts.bmacBtn}</span>
              </a>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-mono text-white truncate">{texts.cryptoTitle}</div>
                <div className="text-[10px] font-mono text-stone-400 truncate">
                  0x71C2834bE2816f9173921098b18209849b2
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('0x71C2834bE2816f9173921098b18209849b2');
                  setCopiedAccount(true);
                  setTimeout(() => setCopiedAccount(false), 2000);
                }}
                className="liquid-glass-pill px-3 py-1.5 rounded-full text-xs font-mono text-stone-300 hover:text-white flex items-center space-x-1 flex-shrink-0"
              >
                {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAccount ? texts.copiedBtn : texts.copyBtn}</span>
              </button>
            </div>
          </div>
        )}

        {/* Supporter Wall / Social Proof */}
        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-2.5">
            <span className="flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              {texts.wallTitle}
            </span>
            <span className="text-[10px] text-amber-300">{texts.wallSubtitle}</span>
          </div>

          <div className="space-y-1.5">
            {recentSupporters.map((s, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs gap-2"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="font-mono font-semibold text-white flex-shrink-0">{s.name}</span>
                  <span className="text-[11px] text-stone-400 font-light truncate max-w-[130px] sm:max-w-[260px]">
                    &ldquo;{s.msg}&rdquo;
                  </span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-[11px] flex-shrink-0">
                  <span className="text-amber-300 font-bold">{s.amount}</span>
                  <span className="text-stone-500 hidden sm:inline">{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
