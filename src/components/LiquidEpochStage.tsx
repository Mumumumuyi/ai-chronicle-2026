import React, { useState, useEffect, useRef, useMemo } from 'react';
import { EPOCHS } from '../data/timelineData';
import { Milestone } from '../types';
import { ChevronLeft, ChevronRight, Sparkles, ArrowUpRight, Cpu, Compass, BookOpen, Play, Pause, Search } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedEpoch } from '../data/timelineTranslations';
import { soundFX } from '../utils/audioEffects';
import { hrefForMilestone } from '../utils/routes';

interface LiquidEpochStageProps {
  activeEpochIndex: number;
  onSelectEpoch: (index: number) => void;
  onOpenMilestone: (milestone: Milestone) => void;
  onOpenMilestonePage: (slug: string) => void;
  onOpenReader: () => void;
}

export const LiquidEpochStage: React.FC<LiquidEpochStageProps> = ({
  activeEpochIndex,
  onSelectEpoch,
  onOpenMilestone,
  onOpenMilestonePage,
  onOpenReader,
}) => {
  const { t, currentLang } = useLanguage();
  const currentEpoch = getLocalizedEpoch(EPOCHS[activeEpochIndex], currentLang);

  // Transition & Auto-Tour State
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [isAutoTouring, setIsAutoTouring] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const tourTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = () => {
    if (activeEpochIndex > 0) {
      setSlideDirection('left');
      soundFX.playEpochWarp(false);
      onSelectEpoch(activeEpochIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeEpochIndex < EPOCHS.length - 1) {
      setSlideDirection('right');
      soundFX.playEpochWarp(true);
      onSelectEpoch(activeEpochIndex + 1);
    }
  };

  const handlePillSelect = (idx: number) => {
    if (idx === activeEpochIndex) return;
    setSlideDirection(idx > activeEpochIndex ? 'right' : 'left');
    soundFX.playEpochWarp(idx > activeEpochIndex);
    onSelectEpoch(idx);
  };

  // Auto-Tour Loop: Advances every 6.5s
  useEffect(() => {
    if (isAutoTouring) {
      tourTimerRef.current = setInterval(() => {
        onSelectEpoch((activeEpochIndex + 1) % EPOCHS.length);
        setSlideDirection('right');
        soundFX.playEpochWarp(true);
      }, 6500);
    } else if (tourTimerRef.current) {
      clearInterval(tourTimerRef.current);
    }
    return () => {
      if (tourTimerRef.current) clearInterval(tourTimerRef.current);
    };
  }, [isAutoTouring, activeEpochIndex, onSelectEpoch]);

  const toggleAutoTour = () => {
    soundFX.playClick(isAutoTouring ? 450 : 750);
    setIsAutoTouring(!isAutoTouring);
  };

  // Dynamic Spotlight interaction
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  const handleMilestoneCardClick = (milestone: Milestone) => {
    soundFX.playClick(900);
    onOpenMilestone(milestone);
  };

  // Milestone deep links are real <a href> so crawlers can follow them; a
  // plain left click stays a client-side transition to the dossier page.
  const handleMilestoneLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    soundFX.playClick(750);
    onOpenMilestonePage(slug);
  };

  // Filter & Search Milestones
  const filteredMilestones = useMemo(() => {
    return currentEpoch.milestones.filter((m) => {
      const matchCat = categoryFilter === 'all' || m.category.toLowerCase().includes(categoryFilter.toLowerCase());
      const query = searchQuery.trim().toLowerCase();
      const matchQuery = !query || 
        m.title.toLowerCase().includes(query) || 
        m.summary.toLowerCase().includes(query) ||
        m.keyFigures.some(f => f.toLowerCase().includes(query)) ||
        m.tags.some(t => t.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
  }, [currentEpoch.milestones, categoryFilter, searchQuery]);

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
      <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-10 animate-tab-enter">
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
              onClick={() => handlePillSelect(idx)}
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

      {/* Main Liquid Glass Showcase Slab with Directional Entrance Animation */}
      <div 
        key={activeEpochIndex}
        className={`relative liquid-glass-strong rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 shadow-2xl glass-sheen border border-white/10 ${
          slideDirection === 'right' ? 'animate-epoch-slide-right' : 'animate-epoch-slide-left'
        }`}
      >
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

          {/* Right Column: Milestone Cards (Interactive Liquid Glass Bento with Spotlight) */}
          <div id="milestones-slab" className="lg:col-span-7 space-y-3 sm:space-y-3.5 scroll-mt-20">
            {/* Header with Live Filter and Search Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono text-stone-400 mb-2 px-1">
              <div className="flex items-center space-x-2">
                <span className="flex items-center text-amber-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  {t.milestoneArchiveTitle}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-300">
                  {filteredMilestones.length}/{currentEpoch.milestones.length}
                </span>
              </div>

              {/* Quick Search & Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <div className="relative flex items-center">
                  <Search className="w-3 h-3 absolute left-2 text-stone-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={currentLang === 'zh' ? '搜索档案...' : 'Search...'}
                    className="w-24 sm:w-28 pl-6 pr-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-stone-200 placeholder-stone-500 focus:outline-none focus:border-amber-400/50 transition-all font-mono"
                  />
                </div>

                {[
                  { id: 'all', label: currentLang === 'zh' ? '全部' : 'All' },
                  { id: 'breakthrough', label: currentLang === 'zh' ? '突破' : 'Feats' },
                  { id: 'model', label: currentLang === 'zh' ? '模型' : 'Models' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      soundFX.playClick(750);
                      setCategoryFilter(f.id);
                    }}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all flex-shrink-0 ${
                      categoryFilter === f.id
                        ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40 font-bold'
                        : 'bg-white/5 text-stone-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dossier Cards with Staggered Cascade Entrance and Mouse Spotlight */}
            <div className="space-y-3">
              {filteredMilestones.length === 0 ? (
                <div className="p-8 text-center rounded-2xl liquid-glass border border-white/5 text-xs font-mono text-stone-500">
                  {currentLang === 'zh' ? '未找到符合条件的档案' : 'No matching dossiers found'}
                </div>
              ) : (
                filteredMilestones.map((milestone, idx) => (
                  <div
                    key={milestone.id}
                    onClick={() => handleMilestoneCardClick(milestone)}
                    onMouseMove={handleCardMouseMove}
                    className={`group spotlight-card liquid-glass hover:liquid-glass-amber p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer border border-white/10 hover:border-amber-400/40 hover:-translate-y-0.5 active:scale-[0.99] relative ${
                      idx < 5 ? `animate-dossier-${idx}` : 'animate-tab-enter'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 relative z-10">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono mb-1.5">
                          <span className="font-bold text-amber-300 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-400/25 shadow-sm">
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

                        <a
                          href={hrefForMilestone(milestone.slug)}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMilestoneLinkClick(e, milestone.slug);
                          }}
                          className="inline-flex items-center space-x-1 mt-2 text-[11px] font-mono text-amber-400/90 hover:text-amber-300 transition-colors"
                        >
                          <span>{currentLang === 'zh' ? '阅读详情' : 'Full dossier'}</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 group-hover:text-amber-300 group-hover:scale-110 transition-all flex-shrink-0 mt-1">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))
              )}
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

      {/* Complete Milestone Index: every dossier gets a real crawlable link */}
      <section className="mt-10 sm:mt-14">
        <div className="liquid-glass rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-8">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-5 sm:mb-7">
            <BookOpen className="w-4 h-4 text-amber-400 flex-shrink-0 self-center" />
            <h2 className="font-serif text-lg sm:text-2xl font-semibold text-stone-100 tracking-tight">
              {currentLang === 'zh' ? '完整里程碑索引' : 'Complete Milestone Index'}
            </h2>
            <span className="text-[10px] sm:text-xs font-mono text-stone-500">
              1943 — 2026.09 · {EPOCHS.reduce((n, e) => n + e.milestones.length, 0)} {currentLang === 'zh' ? '条断代档案' : 'dossiers'}
            </span>
          </div>
          <div className="space-y-5 sm:space-y-6">
            {EPOCHS.map((epoch) => {
              const localizedEpoch = getLocalizedEpoch(epoch, currentLang);
              return (
                <div key={epoch.id}>
                  <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px] font-mono uppercase tracking-wider text-amber-300/80 mb-2.5 pb-2 border-b border-white/5">
                    <span className="flex-shrink-0">{localizedEpoch.romanId}</span>
                    <span className="text-stone-300 normal-case">{localizedEpoch.title}</span>
                    <span className="text-stone-600">{localizedEpoch.era}</span>
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {localizedEpoch.milestones.map((milestone) => (
                      <li key={milestone.id}>
                        <a
                          href={hrefForMilestone(milestone.slug)}
                          onClick={(e) => handleMilestoneLinkClick(e, milestone.slug)}
                          className="group flex items-baseline gap-2 py-1 text-xs sm:text-[13px] text-stone-300 hover:text-amber-200 transition-colors"
                        >
                          <span className="font-mono text-amber-400/80 flex-shrink-0">{milestone.year}</span>
                          <span className="leading-snug group-hover:underline underline-offset-4 decoration-amber-400/40">
                            {milestone.title}
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Liquid Glass Scrubber Dock with Auto-Tour Mode */}
      <div className="mt-8 liquid-glass rounded-full p-2.5 sm:p-3.5 flex items-center justify-between gap-2 sm:gap-4 shadow-xl border border-white/10">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={handlePrev}
            disabled={activeEpochIndex === 0}
            className="liquid-glass-pill w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-105 active:scale-95"
            title="上一纪元"
            aria-label="Previous Epoch"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Interactive Auto-Tour Mode Button */}
          <button
            onClick={toggleAutoTour}
            className={`liquid-glass-pill px-2.5 sm:px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-xs font-mono transition-all border ${
              isAutoTouring
                ? 'liquid-glass-amber text-amber-200 border-amber-400/50 shadow-md shadow-amber-400/20'
                : 'text-stone-300 hover:text-white border-white/10'
            }`}
            title={isAutoTouring ? '暂停全景自动巡礼' : '开启 80 年史诗自动演进巡礼'}
          >
            {isAutoTouring ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline text-[11px] font-semibold">{currentLang === 'zh' ? '暂停巡礼' : 'Pause'}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline text-[11px]">{currentLang === 'zh' ? '自动巡礼' : 'Auto-Tour'}</span>
              </>
            )}
          </button>
        </div>

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
                onClick={() => handlePillSelect(idx)}
                className="relative z-10 flex flex-col items-center group py-1 cursor-pointer"
                title={`${epoch.title} (${epoch.era})`}
              >
                <div 
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-300 flex items-center justify-center ${
                    isCurrent
                      ? 'bg-amber-400 ring-4 ring-amber-400/30 scale-125 shadow-lg shadow-amber-400/50 animate-pulse-ring'
                      : 'bg-stone-700 hover:bg-amber-500/60 group-hover:scale-110'
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
            className="liquid-glass-pill w-9 h-9 rounded-full flex items-center justify-center text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-105 active:scale-95"
            title="下一纪元"
            aria-label="Next Epoch"
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
