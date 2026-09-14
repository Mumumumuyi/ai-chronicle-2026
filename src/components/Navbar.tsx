import React from 'react';
import { Sparkles, BookOpen, Layers, Zap, Info } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageDropdown } from './LanguageDropdown';

export type ActiveTab = 'stage' | 'lab' | 'reader' | 'ecosystem' | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeEpochIndex: number;
  onSelectEpoch: (index: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  activeEpochIndex,
  onSelectEpoch,
}) => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-3 sm:px-8 pointer-events-none flex justify-center no-print">
      <div className="w-full max-w-6xl pointer-events-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand Pill */}
        <div 
          onClick={() => onTabChange('stage')}
          className="liquid-glass rounded-full px-3 sm:px-4 py-2 flex items-center space-x-2 sm:space-x-2.5 cursor-pointer hover:bg-white/10 transition-all select-none group flex-shrink-0"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <span className="font-serif text-xs sm:text-sm font-semibold tracking-wide text-stone-100 group-hover:text-amber-300 transition-colors whitespace-nowrap">
              {t.brandTitle}
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 whitespace-nowrap hidden sm:inline">
              {t.brandSubtitle}
            </span>
          </div>
        </div>

        {/* Central Epoch Fast Scrubber (Desktop) */}
        <div className="hidden lg:flex items-center liquid-glass rounded-full p-1 gap-1">
          {t.epochPills.map((p, idx) => {
            const isActive = activeEpochIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectEpoch(idx);
                  if (activeTab !== 'stage') onTabChange('stage');
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  isActive
                    ? 'liquid-glass-amber text-amber-200 font-semibold shadow-sm'
                    : 'text-stone-300/80 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{p.label}</span>
                <span className="text-[9px] font-mono opacity-60">{p.era}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Navigation Mode Pill & Language Dropdown */}
        <div className="flex items-center space-x-2">
          {/* Desktop/Tablet Nav Pill */}
          <nav className="hidden md:flex liquid-glass rounded-full p-1 items-center gap-1">
            <button
              onClick={() => onTabChange('stage')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'stage'
                  ? 'liquid-glass-amber text-amber-200 font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.navStage}</span>
            </button>

            <button
              onClick={() => onTabChange('lab')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'lab'
                  ? 'liquid-glass-amber text-amber-200 font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t.navLab}</span>
            </button>

            <button
              onClick={() => onTabChange('reader')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'reader'
                  ? 'liquid-glass-amber text-amber-200 font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.navReader}</span>
            </button>

            <button
              onClick={() => onTabChange('ecosystem')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'ecosystem'
                  ? 'liquid-glass-amber text-amber-200 font-semibold'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Global AI Ecosystem & Compute Perks"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.navEcosystem}</span>
            </button>

            <button
              onClick={() => onTabChange('about')}
              className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center ${
                activeTab === 'about'
                  ? 'liquid-glass-amber text-amber-200 font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
              title={t.navAbout}
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Mobile About Button */}
          <button
            onClick={() => onTabChange('about')}
            className={`md:hidden liquid-glass rounded-full w-8 h-8 flex items-center justify-center text-xs transition-all ${
              activeTab === 'about'
                ? 'liquid-glass-amber text-amber-200'
                : 'text-stone-300 hover:text-white'
            }`}
            title={t.navAbout}
          >
            <Info className="w-3.5 h-3.5" />
          </button>

          {/* Global Language Switcher */}
          <LanguageDropdown />
        </div>
      </div>

      {/* ======================================================== */}
      {/* NATIVE-QUALITY MOBILE LIQUID GLASS FLOATING BOTTOM DOCK  */}
      {/* ======================================================== */}
      <div className="fixed bottom-4 left-3 right-3 z-50 pointer-events-auto md:hidden flex justify-center no-print">
        <nav className="w-full max-w-sm liquid-glass-strong rounded-full p-1.5 shadow-2xl border border-amber-400/30 flex items-center justify-around backdrop-blur-2xl glass-sheen">
          <button
            onClick={() => onTabChange('stage')}
            className={`flex-1 py-2 px-1 rounded-full text-[11px] font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'stage'
                ? 'liquid-glass-amber text-amber-200 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="truncate">{t.navStage}</span>
          </button>

          <button
            onClick={() => onTabChange('lab')}
            className={`flex-1 py-2 px-1 rounded-full text-[11px] font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'lab'
                ? 'liquid-glass-amber text-amber-200 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="truncate">{t.navLab}</span>
          </button>

          <button
            onClick={() => onTabChange('reader')}
            className={`flex-1 py-2 px-1 rounded-full text-[11px] font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'reader'
                ? 'liquid-glass-amber text-amber-200 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="truncate">{t.navReader}</span>
          </button>

          <button
            onClick={() => onTabChange('ecosystem')}
            className={`flex-1 py-2 px-1 rounded-full text-[11px] font-medium transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'ecosystem'
                ? 'liquid-glass-amber text-amber-200 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="truncate">{t.navEcosystem}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
