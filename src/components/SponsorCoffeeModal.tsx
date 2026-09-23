import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Coffee, QrCode, CreditCard, X, Zap, ArrowUpRight } from 'lucide-react';
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
      className="modal-backdrop anim-fade no-print"
      onClick={onClose}
    >
      <div
        className="modal-panel max-w-lg max-h-[88vh] overflow-y-auto p-5 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 border border-[#44403C] flex items-center justify-center text-[#78716C] hover:text-gold2 hover:border-gold transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <p className="eyebrow on-dark mb-3 pr-10">
          <i />
          {texts.badge} · {texts.subBadge}
        </p>

        <h3 className="text-xl sm:text-2xl font-serif font-medium text-pearl mb-2 pr-8">
          {texts.title}
        </h3>
        <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed mb-6">
          {texts.desc}
        </p>

        {/* Channel Tabs (only when multiple channels configured) */}
        {hasWechatChannel && hasGlobalChannel && (
        <div className="flex items-center gap-px bg-[#292524] border border-[#292524] mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('wechat');
              setSelectedAmount(29.9);
            }}
            className={`flex-1 py-2.5 px-2 mono transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'wechat'
                ? 'bg-ob2 text-gold'
                : 'bg-ob text-[#78716C] hover:text-pearl'
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
            className={`flex-1 py-2.5 px-2 mono transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'global'
                ? 'bg-ob2 text-gold'
                : 'bg-ob text-[#78716C] hover:text-pearl'
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
            <div className="grid grid-cols-2 gap-px bg-[#292524] border border-[#292524]">
              {amountsCNY.map((item) => {
                const isSelected = selectedAmount === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedAmount(item.value)}
                    className={`p-3 text-left transition-colors relative ${
                      isSelected
                        ? 'bg-ob2 text-pearl'
                        : 'bg-ob text-[#A8A29E] hover:bg-ob2'
                    }`}
                  >
                    {isSelected && <span className="absolute top-0 left-0 right-0 h-px bg-gold" />}
                    <div className="text-xs sm:text-sm font-semibold text-gold2 font-mono mb-1">
                      {item.label}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-[#78716C] leading-tight">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* QR Code Presentation Slab (only when a real QR image is configured) */}
            {ownerContact.qrCodeUrl && (
              <div className="panel-dark-2 p-4 sm:p-6 text-center flex flex-col items-center justify-center">
                <div className="w-44 h-44 sm:w-48 sm:h-48 bg-white p-2.5 flex flex-col items-center justify-center border border-[rgba(201,168,106,0.4)] overflow-hidden">
                  <img
                    src={ownerContact.qrCodeUrl}
                    alt={isZh ? '微信/支付宝收款二维码' : 'WeChat/Alipay QR code'}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {ownerContact.afdianUrl && (
              <a
                href={ownerContact.afdianUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordAffiliateAction('creator_tip', 'Afdian Tip', 'click')}
                className="btn-gold w-full justify-center !text-xs"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isZh ? `通过爱发电在线赞助 ¥${selectedAmount} (支持微信/支付宝)` : `Tip via Afdian (WeChat/Alipay)`}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Tab 2: Global Payment Channels */}
        {hasGlobalChannel && effectiveTab === 'global' && (
          <div className="space-y-4">
            {/* Amount Selection Grid (USD) */}
            <div className="grid grid-cols-2 gap-px bg-[#292524] border border-[#292524]">
              {amountsUSD.map((item) => {
                const isSelected = selectedAmount === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSelectedAmount(item.value)}
                    className={`p-3 text-left transition-colors relative ${
                      isSelected
                        ? 'bg-ob2 text-pearl'
                        : 'bg-ob text-[#A8A29E] hover:bg-ob2'
                    }`}
                  >
                    {isSelected && <span className="absolute top-0 left-0 right-0 h-px bg-gold" />}
                    <div className="text-xs sm:text-sm font-semibold text-gold2 font-mono mb-1">
                      {item.label}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-[#78716C] leading-tight">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="panel-dark-2 p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-medium text-pearl text-sm">{texts.bmacTitle}</span>
                <span className="mono text-gold">${selectedAmount} USD</span>
              </div>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                {texts.bmacSubtitle}
              </p>
              <a
                href={ownerContact.buyMeACoffeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => recordAffiliateAction('creator_tip', 'BuyMeACoffee Tip', 'click')}
                className="btn-gold w-full justify-center !text-xs"
              >
                <Coffee className="w-4 h-4" />
                <span>{texts.bmacBtn}</span>
              </a>
            </div>
          </div>
        )}

        {/* Honest empty state when no payment channel is configured */}
        {!hasAnyChannel && (
          <div className="panel-dark-2 p-6 text-center">
            <Coffee className="w-8 h-8 mx-auto text-gold mb-3" />
            <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
              {texts.channelNotice}
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
