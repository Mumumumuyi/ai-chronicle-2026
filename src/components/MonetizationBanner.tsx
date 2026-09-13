import React, { useState } from 'react';
import { Sparkles, DollarSign, Download, X, Zap } from 'lucide-react';

export const MonetizationBanner: React.FC = () => {
  const [showSponsorModal, setShowSponsorModal] = useState<boolean>(false);
  const [copiedContact, setCopiedContact] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

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
                <span className="text-amber-300 font-bold">SPONSOR & COMMERCIAL ADS</span>
                <span className="text-stone-500">·</span>
                <span className="text-stone-400 text-[11px]">全球 AI 极客与算力品牌赞助专区</span>
              </div>
              <h4 className="text-sm sm:text-base font-serif font-semibold text-white mt-0.5">
                特约品牌赞助位开放中 · 触达全球高净值技术人群与开发者
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowSponsorModal(true)}
              className="liquid-glass-amber px-4 py-2 rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>入驻广告 / 赞助合作</span>
            </button>

            <button
              onClick={() => setShowSponsorModal(true)}
              className="liquid-glass-pill px-3.5 py-2 rounded-full text-xs font-mono text-stone-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>获取商业白皮书与图谱</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sponsor / Monetization Inquiry Modal */}
      {showSponsorModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowSponsorModal(false)}
        >
          <div 
            className="relative w-full max-w-xl liquid-glass-strong rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/40 glass-sheen"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSponsorModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMMERCIAL & SPONSORSHIP DECK</span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-2">
              商业合作与商业化变现通道
            </h3>
            <p className="text-xs text-stone-300 font-light mb-6">
              本项目日均吸引大量高校学者、AI 初创团队、量化投资人与技术开发者。提供多种商业化合作模式：
            </p>

            <div className="space-y-3 font-mono text-xs mb-6">
              {/* Option A */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 hover:border-amber-400/40 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-300">1. 特约品牌展位 / 算力云厂商植入</span>
                  <span className="text-stone-400 text-[10px]">按月/季度赞助</span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  在时空展台与第二缩放定律计算器中挂牌展示品牌 Logo、专属算力算力券与官网外链。
                </p>
              </div>

              {/* Option B */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 hover:border-amber-400/40 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-300">2. 购买液态玻璃 UI 组件库商业授权</span>
                  <span className="text-amber-200 text-[10px]">¥299 / $49</span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  获得本项目全套 Liquid Glass 暖光交互组件源码（React + TypeScript + Tailwind），可直接用于商业产品。
                </p>
              </div>

              {/* Option C */}
              <div className="p-3.5 rounded-2xl liquid-glass border border-white/10 hover:border-amber-400/40 transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-amber-300">3. 企业展厅与科技峰会交互大屏定制</span>
                  <span className="text-stone-400 text-[10px]">高客单定制</span>
                </div>
                <p className="text-stone-300 font-sans text-xs">
                  为您公司的技术历程或特定行业大模型发展史定制专属线下交互大屏与触摸屏软件。
                </p>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-amber-300">商务合作联系通道</div>
                <div className="text-xs text-white font-mono mt-0.5">contact@aichronicle.com</div>
              </div>
              <button
                onClick={() => handleCopy('contact@aichronicle.com')}
                className="liquid-glass-amber px-3.5 py-1.5 rounded-full text-xs font-mono text-amber-200 hover:text-white transition-all"
              >
                {copiedContact ? '已复制邮箱' : '复制联系方式'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
