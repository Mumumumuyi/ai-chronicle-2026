import React from 'react';
import { EPOCHS } from '../data/timelineData';
import { Milestone } from '../types';
import { ChevronLeft, ChevronRight, Sparkles, ArrowUpRight, Cpu, Compass, BookOpen } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedEpoch } from '../data/timelineTranslations';

interface LiquidEpochStageProps {
  activeEpochIndex: number;
  onSelectEpoch: (index: number) => void;
  onOpenMilestone: (milestone: Milestone) => void;
  onOpenReader: () => void;
}

export const LiquidEpochStage: React.FC<LiquidEpochStageProps> = ({
  activeEpochIndex,
  onSelectEpoch,
  onOpenMilestone,
  onOpenReader,
}) => {
  const { t, currentLang } = useLanguage();
  const currentEpoch = getLocalizedEpoch(EPOCHS[activeEpochIndex], currentLang);

  const handlePrev = () => {
    if (activeEpochIndex > 0) onSelectEpoch(activeEpochIndex - 1);
  };

  const handleNext = () => {
    if (activeEpochIndex < EPOCHS.length - 1) onSelectEpoch(activeEpochIndex + 1);
  };

  const heroTitle = currentLang === 'zh' ? (
    <>
      <span className="inline-block">火种、严冬与</span>{' '}
      <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 ml-1 inline-block whitespace-nowrap">
        硅基奇点
      </span>
    </>
  ) : currentLang === 'es' ? (
    <>
      <span className="inline-block">La Chispa, el Invierno y la</span>{' '}
      <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 ml-1 inline-block whitespace-nowrap">
        Singularidad
      </span>
    </>
  ) : currentLang === 'de' ? (
    <>
      <span className="inline-block">Der Funke, der Winter und die</span>{' '}
      <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 ml-1 inline-block whitespace-nowrap">
        Singularität
      </span>
    </>
  ) : currentLang === 'fr' ? (
    <>
      <span className="inline-block">L’Étincelle, l’Hiver et la</span>{' '}
      <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 ml-1 inline-block whitespace-nowrap">
        Singularité
      </span>
    </>
  ) : (
    <>
      <span className="inline-block">The Spark, The Winter &</span>{' '}
      <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 ml-1 inline-block whitespace-nowrap">
        Silicon Singularity
      </span>
    </>
  );

  const heroDesc = currentLang === 'zh'
    ? '从图灵之问、两次酷烈寒冬到测试时推理与自主智能体集群。以流动的液态玻璃视角，重现八十载智性觉醒长卷。'
    : currentLang === 'es'
    ? 'Desde el juego de imitación de Turing hasta el cómputo en tiempo de inferencia y enjambres de agentes. Una crónica interactiva de la inteligencia de máquinas.'
    : currentLang === 'de'
    ? 'Vom Turing-Test und zwei harten KI-Wintern bis zu Inferenzzeit-Schlussfolgerungen und autonomen Agenten-Schwärmen.'
    : currentLang === 'fr'
    ? 'Du jeu d’imitation de Turing aux hivers de l’IA, jusqu’au calcul en temps d’inférence et aux essaims d’agents autonomes.'
    : 'From the Turing imitation game and two harsh AI winters to test-time reasoning and autonomous agent swarms. An interactive chronicle of machine intelligence.';

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between pt-16 sm:pt-24 pb-28 md:pb-16 px-3 sm:px-6 md:px-8 max-w-7xl mx-auto">
      {/* Top Hero Headline: World-Class Editorial Precision */}
      <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-10 animate-in fade-in duration-700">
        {/* Editorial Eyebrow with Beacon */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full liquid-glass-pill text-[10px] sm:text-xs font-mono text-amber-300 mb-3 sm:mb-5 shadow-sm max-w-full">
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="tracking-widest uppercase font-semibold text-stone-200 whitespace-nowrap flex-shrink-0">
            CHRONICLE · VOL. IV
          </span>
          <span className="text-amber-500/60 flex-shrink-0">/</span>
          <span className="tracking-wider uppercase text-amber-300/90 whitespace-nowrap">
            1943 — 2026.09
          </span>
          <span className="hidden sm:inline tracking-wider uppercase text-amber-400/75">
            · 80 YRS OF COGNITION
          </span>
        </div>

        {/* Monumental Serif Headline */}
        <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-stone-100 tracking-tight leading-[1.12] mb-3 sm:mb-4">
          {heroTitle}
        </h1>

        {/* Lead Standfirst Description */}
        <p className="text-xs sm:text-base md:text-lg text-stone-300/80 font-light leading-relaxed max-w-2xl mx-auto px-2 mb-6">
          {heroDesc}
        </p>

        {/* Key Historical Metametrics (4-Column Bento Stat Strip) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-3xl mx-auto px-1 text-left">
          <div className="liquid-glass rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-white/10 hover:border-amber-400/30 transition-colors">
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-0.5">
              {currentLang === 'zh' ? '智性演进跨度' : 'Continuum'}
            </div>
            <div className="text-sm sm:text-base font-mono font-bold text-white">
              80 <span className="text-xs font-normal text-amber-400">Years</span>
            </div>
            <div className="text-[10px] font-mono text-stone-400">1943 — 2026.09</div>
          </div>

          <div className="liquid-glass rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-white/10 hover:border-amber-400/30 transition-colors">
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-0.5">
              {currentLang === 'zh' ? '断代历史纪元' : 'Epochs'}
            </div>
            <div className="text-sm sm:text-base font-mono font-bold text-white">
              7 <span className="text-xs font-normal text-amber-400">Eras</span>
            </div>
            <div className="text-[10px] font-mono text-stone-400">
              {currentLang === 'zh' ? '图灵火种 → 奇点' : 'Turing → Singularity'}
            </div>
          </div>

          <div className="liquid-glass rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-white/10 hover:border-amber-400/30 transition-colors">
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-0.5">
              {currentLang === 'zh' ? '算力扩张指数' : 'Compute Expansion'}
            </div>
            <div className="text-sm sm:text-base font-mono font-bold text-amber-300">
              10<sup className="text-[10px]">26</sup> <span className="text-xs font-normal text-stone-300">FLOPs</span>
            </div>
            <div className="text-[10px] font-mono text-stone-400">
              {currentLang === 'zh' ? '电子管 → Blackwell' : 'Vacuum Tubes → B200'}
            </div>
          </div>

          <div className="liquid-glass rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-white/10 hover:border-amber-400/30 transition-colors">
            <div className="text-[10px] font-mono text-stone-500 uppercase tracking-wider mb-0.5">
              {currentLang === 'zh' ? '当代核心范式' : 'Current Frontier'}
            </div>
            <div className="text-sm sm:text-base font-mono font-bold text-white">
              System 2 <span className="text-xs font-normal text-amber-400">Search</span>
            </div>
            <div className="text-[10px] font-mono text-stone-400">
              {currentLang === 'zh' ? '测试时计算 + Agent' : 'Test-Time Compute'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Epoch Timeline Scrubber Ribbon (All screens) */}
      <div className="flex items-center justify-start md:justify-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar px-1 -mx-1 select-none">
        {t.epochPills.map((p, idx) => {
          const isActive = activeEpochIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => onSelectEpoch(idx)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                isActive
                  ? 'liquid-glass-amber text-amber-200 font-semibold shadow-lg scale-105 border border-amber-400/50'
                  : 'liquid-glass text-stone-300/80 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              <span className="font-semibold">{p.label}</span>
              <span className="text-[10px] font-mono opacity-60">{p.era}</span>
            </button>
          );
        })}
      </div>

      {/* Main Liquid Glass Showcase Slab */}
      <div className="relative liquid-glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-2xl glass-sheen border border-white/10">
        {/* Soft Warm Internal Glow Accent */}
        <div className="hidden sm:block absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="hidden sm:block absolute -bottom-24 -right-24 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Epoch Essence & Epigraph */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 whitespace-nowrap flex-shrink-0">
                  {currentEpoch.romanId}
                </span>
                <span className="text-xs font-mono text-stone-400 tracking-wider whitespace-nowrap">
                  {currentEpoch.era}
                </span>
                <span className="text-stone-600 hidden sm:inline">·</span>
                <span className="text-[11px] font-mono text-amber-400/80">
                  {currentEpoch.dominantParadigm}
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-serif font-bold text-white tracking-tight leading-snug">
                {currentEpoch.title}
              </h2>
              
              <p className="text-xs sm:text-sm font-mono text-amber-300/90 mt-1">
                {currentEpoch.subtitle}
              </p>
            </div>

            {/* Pithy Abstract - Curated & Brief */}
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              {currentEpoch.summary}
            </p>

            {/* Illuminated Epigraph Callout Pill */}
            <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass border border-amber-400/25 text-stone-200 relative overflow-hidden">
              <div className="text-[9px] sm:text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1.5 flex items-center">
                <Compass className="w-3 h-3 mr-1.5" />
                {currentLang === 'zh' ? '时代哲学沉思' : 'Philosophical Epigraph'}
              </div>
              <blockquote className="text-xs sm:text-sm font-serif italic leading-relaxed text-stone-100">
                &ldquo;{currentEpoch.epigraph.quote}&rdquo;
              </blockquote>
              <div className="text-[10px] sm:text-[11px] font-mono text-amber-300/80 mt-2 text-right">
                —— {currentEpoch.epigraph.author}
              </div>
            </div>

            {/* Hardware & Compute Specs Bento Micro-Box */}
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-2.5 sm:p-3 rounded-xl liquid-glass border border-white/10">
                <div className="text-[10px] text-stone-500 mb-0.5 flex items-center">
                  <Cpu className="w-3 h-3 mr-1 text-amber-400" />
                  {t.computePower}
                </div>
                <div className="text-amber-200 font-semibold text-xs truncate">
                  {currentEpoch.computeOrderOfMagnitude}
                </div>
              </div>

              <div className="p-2.5 sm:p-3 rounded-xl liquid-glass border border-white/10">
                <div className="text-[10px] text-stone-500 mb-0.5 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                  {t.dominantParadigm}
                </div>
                <div className="text-stone-200 font-medium text-xs truncate">
                  {currentEpoch.dominantParadigm}
                </div>
              </div>
            </div>

            {/* Mobile jump to milestones indicator */}
            <div className="lg:hidden pt-1">
              <a
                href="#milestones-slab"
                className="inline-flex items-center space-x-1.5 text-xs font-mono text-amber-300 hover:text-white"
              >
                <span>
                  {currentLang === 'zh'
                    ? `查看本纪元 ${currentEpoch.milestones.length} 项核心里程碑档案 ↓`
                    : currentLang === 'es'
                    ? `Ver los ${currentEpoch.milestones.length} hitos clave abajo ↓`
                    : currentLang === 'de'
                    ? `Siehe die ${currentEpoch.milestones.length} Kern-Meilensteine unten ↓`
                    : currentLang === 'fr'
                    ? `Voir les ${currentEpoch.milestones.length} jalons clés ci-dessous ↓`
                    : `Inspect ${currentEpoch.milestones.length} Epoch Milestones Below ↓`}
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: Milestone Cards (Interactive Liquid Glass Bento) */}
          <div id="milestones-slab" className="lg:col-span-7 space-y-3 sm:space-y-3.5 scroll-mt-20">
            <div className="flex items-center justify-between text-xs font-mono text-stone-400 mb-1 px-1">
              <span className="flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                {t.milestoneArchiveTitle}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-300">
                {currentEpoch.milestones.length} Dossiers
              </span>
            </div>

            <div className="space-y-3">
              {currentEpoch.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  onClick={() => onOpenMilestone(milestone)}
                  className="group liquid-glass hover:liquid-glass-amber p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer border border-white/10 hover:border-amber-400/40 hover:-translate-y-0.5 relative"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-1.5">
                        <span className="font-bold text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-400/25">
                          {milestone.year}
                        </span>
                        <span className="text-stone-300 text-xs">
                          {milestone.keyFigures[0]}
                        </span>
                        <span className="text-stone-500">·</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-stone-400 border border-white/10">
                          {milestone.category}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-serif font-semibold text-white group-hover:text-amber-200 transition-colors">
                        {milestone.title}
                      </h3>

                      <p className="text-xs text-stone-300/80 font-light mt-1.5 line-clamp-2 leading-relaxed">
                        {milestone.summary}
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 group-hover:text-amber-300 group-hover:scale-110 transition-all flex-shrink-0 mt-1">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Read Full Treatise Trigger */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={onOpenReader}
                className="liquid-glass-pill px-4 py-2 rounded-full text-xs font-mono text-amber-300 flex items-center space-x-1.5 hover:text-amber-100 transition-colors border border-amber-400/25"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t.readFullTreatise} →</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Liquid Glass Scrubber Dock */}
      <div className="mt-8 liquid-glass rounded-full p-2.5 sm:p-3.5 flex items-center justify-between gap-4 shadow-xl border border-white/10">
        <button
          onClick={handlePrev}
          disabled={activeEpochIndex === 0}
          className="liquid-glass-pill w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
          title="上一纪元"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Interactive Timeline Track with Glowing Amber Beads */}
        <div className="flex-1 flex items-center justify-between px-2 sm:px-6 relative">
          <div className="absolute left-4 right-4 h-0.5 bg-stone-800 rounded-full" />
          <div 
            className="absolute left-4 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
            style={{ width: `${(activeEpochIndex / (EPOCHS.length - 1)) * 96}%` }}
          />

          {EPOCHS.map((epoch, idx) => {
            const isCurrent = idx === activeEpochIndex;
            return (
              <button
                key={epoch.id}
                onClick={() => onSelectEpoch(idx)}
                className="relative z-10 flex flex-col items-center group py-1"
              >
                <div 
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-amber-400 ring-4 ring-amber-400/30 scale-125 shadow-lg shadow-amber-400/50'
                      : 'bg-stone-700 hover:bg-amber-500/60'
                  }`}
                />
                <span className={`text-[10px] font-mono mt-1 transition-colors hidden sm:block ${
                  isCurrent ? 'text-amber-300 font-bold' : 'text-stone-500 group-hover:text-stone-300'
                }`}>
                  {epoch.romanId === 'PROLOGUE' ? '0' : idx}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNext}
            disabled={activeEpochIndex === EPOCHS.length - 1}
            className="liquid-glass-pill w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
            title="下一纪元"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-stone-500 hidden xl:inline-block pr-1 select-none">
            [← / →]
          </span>
        </div>
      </div>
    </div>
  );
};
