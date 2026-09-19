import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, BookOpen, Layers, Zap, VolumeX } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageDropdown } from './LanguageDropdown';
import { soundFX } from '../utils/audioEffects';

export type ActiveTab = 'stage' | 'lab' | 'reader' | 'ecosystem';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeEpochIndex: number;
  onSelectEpoch: (index: number) => void;
  onSecretTrigger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onSecretTrigger,
}) => {
  const { t } = useLanguage();
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundFX.getEnabled());
  const clickCountRef = useRef<number>(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSoundEnabled(soundFX.getEnabled());
  }, []);

  const handleToggleSound = () => {
    const newState = soundFX.toggle();
    setSoundEnabled(newState);
  };

  const handleTabClick = (tab: ActiveTab) => {
    soundFX.playClick(680);
    onTabChange(tab);
  };

  const handleLogoClick = () => {
    onTabChange('stage');

    // Secret stealth trigger: 3 clicks within 1200ms
    clickCountRef.current += 1;
    if (clickCountRef.current >= 3) {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickCountRef.current = 0;
      if (onSecretTrigger) onSecretTrigger();
      return;
    }

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 1200);
  };

  const navItems = [
    { id: 'stage' as const, label: t.navStage, icon: Layers },
    { id: 'lab' as const, label: t.navLab, icon: Zap },
    { id: 'reader' as const, label: t.navReader, icon: BookOpen },
    { id: 'ecosystem' as const, label: t.navEcosystem, icon: Sparkles },
  ];

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 px-3 sm:px-6 md:px-8 pointer-events-none flex justify-center no-print">
      <div className="w-full max-w-6xl pointer-events-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo Pill */}
        <div 
          onClick={handleLogoClick}
          className="liquid-glass rounded-full px-3.5 sm:px-4 py-2 flex items-center space-x-2 sm:space-x-2.5 cursor-pointer hover:bg-white/10 transition-all select-none group flex-shrink-0 border border-white/10"
          title="AI Chronicle"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-serif text-xs sm:text-sm font-semibold tracking-wide text-stone-100 group-hover:text-amber-300 transition-colors whitespace-nowrap">
              {t.brandTitle}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/25 whitespace-nowrap hidden lg:inline">
              {t.brandSubtitle}
            </span>
          </div>
        </div>

        {/* Center/Right: Desktop Primary Navigation Pill (md screens and up) */}
        <nav className="hidden md:flex liquid-glass rounded-full p-1 items-center gap-1 flex-shrink-0 shadow-lg border border-white/10">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 flex-shrink-0 select-none ${
                  isActive
                    ? 'liquid-glass-amber text-amber-200 font-semibold shadow-sm border border-amber-400/40'
                    : 'text-stone-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${item.id === 'ecosystem' ? 'text-amber-400' : ''}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Sound FX & Global Language Switcher */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Interactive Sound FX Toggle Pill */}
          <button
            onClick={handleToggleSound}
            className="liquid-glass rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 flex items-center space-x-1.5 cursor-pointer hover:bg-white/10 transition-all border border-white/10 text-xs font-mono select-none"
            title={soundEnabled ? '声效已开启 (点击静音)' : '声效已静音 (点击开启沉浸声效)'}
            aria-label="Sound Effects Toggle"
          >
            {soundEnabled ? (
              <div className="flex items-end space-x-0.5 h-3 px-0.5">
                <span className="w-0.5 bg-amber-400 rounded-full animate-sound-1" />
                <span className="w-0.5 bg-amber-400 rounded-full animate-sound-2" />
                <span className="w-0.5 bg-amber-400 rounded-full animate-sound-3" />
              </div>
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            )}
            <span className="hidden sm:inline text-[11px] text-stone-300">
              {soundEnabled ? 'FX' : 'Mute'}
            </span>
          </button>

          <LanguageDropdown />
        </div>
      </div>

      {/* ======================================================== */}
      {/* NATIVE MOBILE FLOATING BOTTOM DOCK (< md screens)         */}
      {/* ======================================================== */}
      <div className="fixed bottom-4 left-4 right-4 z-40 pointer-events-auto md:hidden flex justify-center no-print">
        <nav className="w-full max-w-sm liquid-glass-strong rounded-full p-1.5 shadow-2xl border border-amber-400/30 flex items-center justify-around backdrop-blur-2xl glass-sheen">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex-1 py-1.5 px-2 rounded-full text-[10px] font-medium transition-all flex flex-col items-center justify-center gap-0.5 select-none ${
                  isActive
                    ? 'liquid-glass-amber text-amber-200 font-bold shadow-md'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${item.id === 'ecosystem' ? 'text-amber-400' : ''}`} />
                <span className="truncate whitespace-nowrap text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
