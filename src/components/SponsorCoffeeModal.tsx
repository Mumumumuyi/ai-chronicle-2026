import React, { useState } from 'react';
import { Coffee, Heart, QrCode, CreditCard, Sparkles, X, Check, Copy } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SponsorCoffeeModalProps {
  onClose: () => void;
}

export const SponsorCoffeeModal: React.FC<SponsorCoffeeModalProps> = ({ onClose }) => {
  const { currentLang } = useLanguage();
  const [activeTab, setActiveTab] = useState<'wechat' | 'global'>('wechat');
  const [selectedAmount, setSelectedAmount] = useState<number>(30);
  const [copiedAccount, setCopiedAccount] = useState<boolean>(false);

  const amountsCNY = [
    { value: 6, label: '一杯咖啡 ☕', desc: '给作者添一杯提神美式' },
    { value: 30, label: '算力补贴 ⚡', desc: '支持全球 CDN 与服务器开销', popular: true },
    { value: 99, label: '硬核支持者 🚀', desc: '列入通史长卷永久荣誉致谢' },
    { value: 299, label: '白金赞助商 💎', desc: '获得商业授权与展位冠名' },
  ];

  const recentSupporters = [
    { name: 'Dr. Turing_Fan', amount: '¥99', time: '10分钟前', msg: '极具美感的通史长卷，值得被更多人看见！' },
    { name: 'NeuralNomad', amount: '¥30', time: '1小时前', msg: '测试时算力仿真器做得很惊艳，继续加油。' },
    { name: 'K. Takahashi', amount: '$15', time: '3小时前', msg: 'Exceptional UI aesthetics and profound historical depth!' },
    { name: 'QuantDev_99', amount: '¥299', time: '昨天', msg: '已将页面置顶为团队学习参考。' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200 no-print"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto liquid-glass-strong rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Header Badge */}
        <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
          <Heart className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
          <span className="tracking-wider font-semibold">SUPPORT & SPONSORSHIP</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400 text-[11px]">打赏赞助与创作者支持</span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-white mb-2">
          {currentLang === 'zh' ? '支持《AI 全景通史》独立研创' : 'Support the AI Chronicle Research'}
        </h3>
        <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed mb-6">
          {currentLang === 'zh'
            ? '本通史长卷与液态玻璃交互系统由独立研究者潜心打磨，无任何商业财团背景。您的每一份慷慨赞助，都将全额用于覆盖高密集 Anycast CDN 流量、服务器托管与知识库的每月持续更新。'
            : 'This canonical chronicle is independently maintained without big-tech backing. Your generous support keeps our global CDN nodes and continuous research running.'}
        </p>

        {/* Channel Tabs */}
        <div className="flex items-center space-x-2 p-1 liquid-glass rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('wechat')}
            className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'wechat'
                ? 'liquid-glass-amber text-amber-200 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>微信 / 支付宝 赞助</span>
          </button>

          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center justify-center space-x-2 ${
              activeTab === 'global'
                ? 'liquid-glass-amber text-amber-200 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>International (Card / Stripe / PayPal)</span>
          </button>
        </div>

        {/* Tab 1: Domestic WeChat / Alipay */}
        {activeTab === 'wechat' && (
          <div className="space-y-6">
            {/* Amount Selection Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {amountsCNY.map((item) => {
                const isSelected = selectedAmount === item.value;
                return (
                  <button
                    key={item.value}
                    onClick={() => setSelectedAmount(item.value)}
                    className={`p-3 rounded-2xl text-left transition-all relative border ${
                      isSelected
                        ? 'liquid-glass-amber border-amber-400/50 bg-amber-500/15 text-white'
                        : 'liquid-glass border-white/10 text-stone-300 hover:border-white/20'
                    }`}
                  >
                    {item.popular && (
                      <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full text-[9px] font-mono bg-amber-400 text-stone-950 font-bold">
                        HOT
                      </span>
                    )}
                    <div className="text-sm font-bold text-amber-300 font-mono mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-stone-400 leading-tight">
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* QR Code Presentation Slab */}
            <div className="p-6 rounded-3xl liquid-glass border border-amber-400/30 text-center flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-48 h-48 rounded-2xl bg-white p-3 shadow-2xl flex flex-col items-center justify-center border-4 border-amber-400/40 relative group">
                {/* SVG Simulated Clean QR Code with Amber Heart Icon */}
                <div className="w-full h-full border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center bg-stone-50 p-2 text-stone-800">
                  <Coffee className="w-10 h-10 text-amber-600 mb-2" />
                  <span className="text-xs font-mono font-bold text-stone-900">赞助 ¥{selectedAmount} 咖啡</span>
                  <span className="text-[10px] text-stone-500 mt-1">微信 / 支付宝 扫一扫</span>
                </div>
              </div>

              <div className="mt-4 text-xs font-mono text-stone-300 flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>赞助成功后，请将订单号或备注截图发至商务邮箱以登入荣誉致谢榜</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Global Payment Channels */}
        {activeTab === 'global' && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl liquid-glass border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-white text-sm">Buy Me a Coffee</span>
                <span className="text-xs font-mono text-amber-300">$5 / $15 / $50</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Support via credit card, Apple Pay, Google Pay, or international PayPal in seconds.
              </p>
              <a
                href="https://buymeacoffee.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl liquid-glass-amber text-xs font-mono font-bold text-amber-200 hover:text-white flex items-center justify-center space-x-2 transition-all block text-center"
              >
                <Coffee className="w-4 h-4" />
                <span>Tip via Buy Me a Coffee →</span>
              </a>
            </div>

            <div className="p-4 rounded-2xl liquid-glass border border-white/10 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-white">Direct USDT / Crypto Donation</div>
                <div className="text-[10px] font-mono text-stone-400 truncate max-w-[280px]">
                  0x71C...49b2 (ETH / ERC-20)
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('0x71C2834bE2816f9173921098b18209849b2');
                  setCopiedAccount(true);
                  setTimeout(() => setCopiedAccount(false), 2000);
                }}
                className="liquid-glass-pill px-3 py-1.5 rounded-full text-xs font-mono text-stone-300 hover:text-white flex items-center space-x-1"
              >
                {copiedAccount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedAccount ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Supporter Wall / Social Proof */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-3">
            <span className="flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
              近期赞助与支持者荣誉榜
            </span>
            <span className="text-[10px] text-amber-300">致谢所有共同建设者</span>
          </div>

          <div className="space-y-2">
            {recentSupporters.map((s, idx) => (
              <div 
                key={idx}
                className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-semibold text-white">{s.name}</span>
                  <span className="text-[11px] text-stone-400 font-light truncate max-w-[200px] sm:max-w-[280px]">
                    &ldquo;{s.msg}&rdquo;
                  </span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-[11px] flex-shrink-0">
                  <span className="text-amber-300 font-bold">{s.amount}</span>
                  <span className="text-stone-500">{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
