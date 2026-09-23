import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Coffee, Heart, QrCode, CreditCard, X, Zap, ArrowUpRight } from 'lucide-react';
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
  const hasWechatChannel = Boolean(ownerContact.qrCodeUrl || ownerContact.afdianUrl);
  const hasGlobalChannel = Boolean(ownerContact.buyMeACoffeeUrl);
  const hasAnyChannel = hasWechatChannel || hasGlobalChannel;
  const [activeTab, setActiveTab] = useState<'wechat' | 'global'>(() =>
    hasGlobalChannel && (!isZh || !hasWechatChannel) ? 'global' : 'wechat'
  );
  const [selectedAmount, setSelectedAmount] = useState<number>(29.9);
  const effectiveTab = hasWechatChannel && hasGlobalChannel
    ? activeTab
    : hasWechatChannel ? 'wechat' : 'global';

  const texts = {
    badge: isZh ? '创作者支持与赞助打赏' : 'SUPPORT & SPONSORSHIP',
    subBadge: isZh ? '爱发电 · 支持微信 / 支付宝' : 'Support the author',
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
      ? '这部通史由一个人业余维护，网站免费、没有付费墙。如果它对你有帮助，你的赞助会让我有更多时间写新章节、补史料。'
      : 'This chronicle is maintained by one person in their spare time. The site is free with no paywall. Your support buys time to write new chapters.',
    tabWeChat: isZh ? '微信 / 支付宝' : 'WeChat / Alipay',
    tabGlobal: isZh ? '国际卡 / Stripe' : 'Cards / Stripe',
    bmacTitle: 'Buy Me a Coffee',
    bmacSubtitle: isZh ? '支持国际信用卡、Apple Pay、Google Pay 或 PayPal 秒级打赏' : 'Support via Credit Card, Apple Pay, Google Pay, or PayPal in seconds.',
    bmacBtn: isZh ? '前往 Buy Me a Coffee 打赏 →' : 'Tip via Buy Me a Coffee →',
    channelNotice: isZh
      ? '赞助收款通道暂未开通。如果本通史对您有帮助，欢迎收藏或分享给更多朋友。'
      : 'Tipping channels are not enabled yet. If this chronicle helped you, sharing it with others is appreciated.',
  };

  const amountsCNY = [
    { value: 9.9, label: '请喝杯咖啡 ☕', desc: '爱发电动态里致谢' },
    { value: 29.9, label: '支持者 🚀', desc: '新章节在爱发电抢先看', popular: true },
  ];

  const amountsUSD = [
    { value: 5, label: '$5 · Coffee ☕', desc: 'A quick espresso' },
    { value: 15, label: '$15 · Supporter 🚀', desc: 'Keeps new chapters coming', popular: true },
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

        {/* Channel Tabs (only when multiple channels configured) */}
        {hasWechatChannel && hasGlobalChannel && (
        <div className="flex items-center space-x-1.5 p-1 liquid-glass rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('wechat');
              setSelectedAmount(29.9);
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
        )}

        {/* Tab 1: Domestic WeChat / Alipay */}
        {hasWechatChannel && effectiveTab === 'wechat' && (
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

            {/* QR Code Presentation Slab (only when a real QR image is configured) */}
            {ownerContact.qrCodeUrl && (
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl liquid-glass border border-amber-400/30 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-2xl bg-white p-2.5 shadow-2xl flex flex-col items-center justify-center border-4 border-amber-400/40 relative overflow-hidden">
                  <img
                    src={ownerContact.qrCodeUrl}
                    alt="微信/支付宝收款二维码"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              </div>
            )}

            {ownerContact.afdianUrl && (
              <div className="w-full max-w-sm mx-auto">
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
          </div>
        )}

        {/* Tab 2: Global Payment Channels */}
        {hasGlobalChannel && effectiveTab === 'global' && (
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
                href={ownerContact.buyMeACoffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordAffiliateAction('creator_tip', 'BuyMeACoffee Tip', 'click')}
                className="w-full py-2.5 rounded-xl liquid-glass-amber text-xs font-mono font-bold text-amber-200 hover:text-white flex items-center justify-center space-x-2 transition-all block text-center"
              >
                <Coffee className="w-4 h-4" />
                <span>{texts.bmacBtn}</span>
              </a>
            </div>

          </div>
        )}

        {/* Honest empty state when no payment channel is configured */}
        {!hasAnyChannel && (
          <div className="p-5 rounded-2xl liquid-glass border border-white/10 text-center">
            <Coffee className="w-8 h-8 mx-auto text-amber-400/60 mb-2" />
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              {texts.channelNotice}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
