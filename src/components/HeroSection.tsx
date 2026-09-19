import React from 'react';
import { EPOCHS } from '../data/timelineData';
import { Shield, Sparkles, Activity, Layers } from 'lucide-react';

interface HeroSectionProps {
  activeEpochIndex: number;
  onSelectEpoch: (index: number) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  activeEpochIndex,
  onSelectEpoch,
  onExploreClick,
}) => {
  const currentEpoch = EPOCHS[activeEpochIndex];

  return (
    <section className="relative pt-8 pb-12 px-4 sm:px-6 border-b border-white/10 bg-radial-vignette overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00F0FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Anti-AI Design Badge & Top Category */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-2.5 py-1 rounded bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/25 text-xs font-mono tracking-wider flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            HISTORICAL CHRONICLE 1943 — 2026.09.13
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-xs font-mono border border-white/5 flex items-center">
            <Shield className="w-3 h-3 mr-1 text-slate-500" />
            基于严密史实与前沿认知框架
          </span>
        </div>

        {/* Masterpiece Title */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 leading-tight font-serif-sc">
              火种、严冬与硅基奇点
              <span className="block text-xl sm:text-2xl lg:text-3xl font-normal text-[#00F0FF] mt-2 font-mono">
                人工智能演进全景通史
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-6 font-light">
              从1950年阿兰·图灵的“模仿游戏”与达特茅斯的宏伟命名，穿越两次酷烈寒冬与三次狂飙；从符号与连接的百年辩证，到规模法则下的通用大模型，直至2026年9月当代——系统二慢思考推理、测试时计算与自主智能体集群的奇点破晓。
            </p>

            {/* High Density Metric Strip (Anti-AI Rule: Replace fluffy 4 large cards with clean high-density strip) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-3 rounded-md bg-white/[0.02] border border-white/10 font-mono text-xs max-w-3xl">
              <div>
                <div className="text-slate-500 text-[10px]">TIME SPAN</div>
                <div className="text-slate-200 font-semibold text-sm">83 年历程</div>
                <div className="text-[10px] text-slate-400">1943 — 2026.09.13</div>
              </div>
              <div className="border-l border-white/5 pl-3">
                <div className="text-slate-500 text-[10px]">HISTORICAL EPOCHS</div>
                <div className="text-slate-200 font-semibold text-sm">7 大纪元</div>
                <div className="text-[10px] text-[#00F0FF]">黎明破晓至自主集群</div>
              </div>
              <div className="border-l border-white/5 pl-3">
                <div className="text-slate-500 text-[10px]">COMPUTE EXPONENT</div>
                <div className="text-slate-200 font-semibold text-sm">10^25 倍扩张</div>
                <div className="text-[10px] text-slate-400">手算继电器至万卡集群</div>
              </div>
              <div className="border-l border-white/5 pl-3">
                <div className="text-slate-500 text-[10px]">CURRENT PARADIGM</div>
                <div className="text-[#00F0FF] font-semibold text-sm">系统二 + 神经符号</div>
                <div className="text-[10px] text-emerald-400">2026 现状已锁定</div>
              </div>
            </div>
          </div>

          {/* Interactive Epoch Preview Bento Deck */}
          <div className="lg:col-span-4 glass-panel rounded-lg p-5 border border-white/10 relative">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs font-mono">
              <span className="text-[#00F0FF] flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1.5" />
                当前聚焦纪元 · {currentEpoch.romanId}
              </span>
              <span className="text-slate-400">{currentEpoch.era}</span>
            </div>

            <div className="mb-3">
              <h3 className="text-lg font-bold text-white font-serif-sc mb-1">
                {currentEpoch.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {currentEpoch.summary}
              </p>
            </div>

            <div className="p-2.5 rounded bg-black/40 border border-white/5 mb-4 text-xs">
              <div className="text-[10px] font-mono text-slate-500 mb-1">纪元核心矛盾与哲学争论:</div>
              <div className="text-slate-300 italic text-[11px] leading-snug">
                “{currentEpoch.philosophicalTension}”
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-400">
                主导范式: <span className="text-[#00F0FF] font-medium">{currentEpoch.dominantParadigm}</span>
              </div>
              <button
                onClick={onExploreClick}
                className="px-3 py-1.5 rounded text-xs font-medium bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30 hover:bg-[#00F0FF] hover:text-black transition-all font-mono"
              >
                深入纪元档案 →
              </button>
            </div>
          </div>
        </div>

        {/* Epoch Interactive Scrub Bar */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
            <span className="flex items-center">
              <Layers className="w-3.5 h-3.5 mr-1 text-[#00F0FF]" />
              时空编年刻度尺 (点击切换时代视角)
            </span>
            <span>当前选中: {activeEpochIndex + 1} / {EPOCHS.length}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {EPOCHS.map((epoch, idx) => {
              const isSelected = idx === activeEpochIndex;
              return (
                <button
                  key={epoch.id}
                  onClick={() => onSelectEpoch(idx)}
                  className={`p-2.5 rounded text-left transition-all relative border ${
                    isSelected
                      ? 'bg-white/10 border-[#00F0FF] shadow-sm shadow-[#00F0FF]/20'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={isSelected ? 'text-[#00F0FF] font-bold' : 'text-slate-500'}>
                      {epoch.romanId}
                    </span>
                    <span className="text-slate-400 text-[9px]">{epoch.era.split('—')[0].trim()}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 truncate">
                    {epoch.title.split('：')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {epoch.dominantParadigm}
                  </div>
                  {isSelected && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00F0FF]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
