import React, { useState } from 'react';
import { DollarSign, Download, Zap, Coffee } from 'lucide-react';
import { SponsorCoffeeModal } from './SponsorCoffeeModal';
import { PremiumBundleModal } from './PremiumBundleModal';
import { SponsorCalculator } from './SponsorCalculator';

export const MonetizationBanner: React.FC = () => {
  const [showSponsorModal, setShowSponsorModal] = useState<boolean>(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState<boolean>(false);
  const [showBundleModal, setShowBundleModal] = useState<boolean>(false);

  return (
    <>
      {/* Sleek Liquid Glass Commercial & Ad Strip */}
      <div className="liquid-glass rounded-3xl p-4 sm:p-5 border border-amber-400/30 my-8 shadow-xl relative overflow-hidden glass-sheen">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/30 flex-shrink-0">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-amber-300 font-bold">MONETIZATION & SPONSOR ENGINE</span>
                <span className="text-stone-500">·</span>
                <span className="text-stone-400 text-[11px]">全球 AI 极客、算力品牌与商业合作通道</span>
              </div>
              <h4 className="text-sm sm:text-base font-serif font-semibold text-white mt-0.5">
                特约品牌展位 · 资产包下载 · 独立创作者赞助支持通道开启
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCoffeeModal(true)}
              className="liquid-glass-amber px-3.5 py-2 rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-sm"
              title="微信 / 支付宝 / 国际通道小额赞助打赏"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>赞助打赏 ☕</span>
            </button>

            <button
              onClick={() => setShowBundleModal(true)}
              className="liquid-glass-pill px-3.5 py-2 rounded-full text-xs font-mono text-stone-200 hover:text-white flex items-center space-x-1.5 transition-all border border-amber-400/20"
              title="下载 1.8 万字离线 PDF + 4K 图谱资产包"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>4K 离线资产包</span>
            </button>

            <button
              onClick={() => setShowSponsorModal(true)}
              className="liquid-glass-pill px-3.5 py-2 rounded-full text-xs font-mono text-stone-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>商业入驻 / 智能报价测算</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive B2B Sponsor Calculator Modal */}
      {showSponsorModal && (
        <SponsorCalculator onClose={() => setShowSponsorModal(false)} />
      )}

      {/* Coffee / Direct Support Modal */}
      {showCoffeeModal && (
        <SponsorCoffeeModal onClose={() => setShowCoffeeModal(false)} />
      )}

      {/* 4K Bundle / Digital Assets Modal */}
      {showBundleModal && (
        <PremiumBundleModal onClose={() => setShowBundleModal(false)} />
      )}
    </>
  );
};

