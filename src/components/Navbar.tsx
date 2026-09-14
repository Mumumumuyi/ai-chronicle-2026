import React from 'react';
import { Sparkles, BookOpen, Layers, Zap, Info } from 'lucide-react';

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
  const epochPills = [
    { label: '黎明', era: '1943-56' },
    { label: '狂飙', era: '1956-74' },
    { label: '复兴', era: '1975-93' },
    { label: '理性', era: '1993-11' },
    { label: '爆发', era: '2012-20' },
    { label: '涌现', era: '2020-24' },
    { label: '奇点', era: '2026.09' },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none flex justify-center no-print">
      <div className="w-full max-w-6xl pointer-events-auto flex items-center justify-between gap-4">
        {/* Logo & Brand Pill */}
        <div 
          onClick={() => onTabChange('stage')}
          className="liquid-glass rounded-full px-4 py-2 flex items-center space-x-2.5 cursor-pointer hover:bg-white/10 transition-all select-none group"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-serif text-sm font-semibold tracking-wide text-stone-100 group-hover:text-amber-300 transition-colors">
              AI 全景通史
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
              1950 — 2026.09
            </span>
          </div>
        </div>

        {/* Central Epoch Fast Scrubber (Desktop) */}
        <div className="hidden md:flex items-center liquid-glass rounded-full p-1 gap-1">
          {epochPills.map((p, idx) => {
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

        {/* Navigation Mode Pill */}
        <nav className="liquid-glass rounded-full p-1 flex items-center gap-1">
          <button
            onClick={() => onTabChange('stage')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'stage'
                ? 'liquid-glass-amber text-amber-200 font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">剧场</span>
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
            <span className="hidden sm:inline">缩放律</span>
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
            <span className="hidden sm:inline">长卷</span>
          </button>

          <button
            onClick={() => onTabChange('ecosystem')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
              activeTab === 'ecosystem'
                ? 'liquid-glass-amber text-amber-200 font-semibold'
                : 'text-stone-300 hover:text-white'
            }`}
            title="严选 AI 算力与开发工具独家特权"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">生态特权</span>
          </button>

          <button
            onClick={() => onTabChange('about')}
            className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center ${
              activeTab === 'about'
                ? 'liquid-glass-amber text-amber-200 font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
            title="美学与设计底座"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </nav>
      </div>
    </header>
  );
};
