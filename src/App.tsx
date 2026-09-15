import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { LiquidEpochStage } from './components/LiquidEpochStage';
import { LiquidParadigmWidget } from './components/LiquidParadigmWidget';
import { ArticleReader } from './components/ArticleReader';
import { MilestoneModal } from './components/MilestoneModal';
import { AboutDesignHub } from './components/AboutDesignHub';
import { AffiliateEcosystem } from './components/AffiliateEcosystem';
import { Milestone } from './types';
import { EPOCHS } from './data/timelineData';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stage');
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(6); // Default to current 2024-2026 epoch
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const { t } = useLanguage();

  // Keyboard navigation for epochs (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMilestone || showAboutModal || activeTab !== 'stage') return;
      if (e.key === 'ArrowLeft' && activeEpochIndex > 0) {
        setActiveEpochIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && activeEpochIndex < EPOCHS.length - 1) {
        setActiveEpochIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEpochIndex, activeMilestone, showAboutModal, activeTab]);

  return (
    <div className="relative min-h-screen bg-[#0C0A09] text-[#F5F5F4] overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Cinematic Warm Liquid Glass Image Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="./bg-warm-glass.jpg"
          alt="Warm Liquid Glass Background"
          className="w-full h-full object-cover object-center opacity-70 filter brightness-[0.75] contrast-[1.1] scale-105 transition-transform duration-1000"
        />
        {/* Warm Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09]/60 via-[#0C0A09]/35 to-[#0C0A09]/95 hidden md:block md:backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C0A09]/80 via-[#0C0A09]/55 to-[#0C0A09]/95 md:hidden" />
        <div className="absolute inset-0 bg-warm-hero" />
      </div>

      {/* 2. Floating Liquid Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'about') {
            setShowAboutModal(true);
          } else {
            setActiveTab(tab);
          }
        }}
        activeEpochIndex={activeEpochIndex}
        onSelectEpoch={setActiveEpochIndex}
      />

      {/* 3. Main Stage Content */}
      <main className="relative">
        {activeTab === 'stage' && (
          <LiquidEpochStage
            activeEpochIndex={activeEpochIndex}
            onSelectEpoch={setActiveEpochIndex}
            onOpenMilestone={setActiveMilestone}
            onOpenReader={() => setActiveTab('reader')}
          />
        )}

        {activeTab === 'lab' && <LiquidParadigmWidget />}

        {activeTab === 'ecosystem' && <AffiliateEcosystem />}

        {activeTab === 'reader' && (
          <ArticleReader onClose={() => setActiveTab('stage')} />
        )}
      </main>

      {/* 4. Modals */}
      <MilestoneModal
        milestone={activeMilestone}
        onClose={() => setActiveMilestone(null)}
      />

      {showAboutModal && (
        <AboutDesignHub onClose={() => setShowAboutModal(false)} />
      )}

      {/* 5. Minimalist Ambient Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 text-center text-stone-500 text-xs font-mono no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>{t.footerCopyright}</span>
          <span className="text-amber-400/80">{t.footerDesignTag}</span>
          <span>{t.footerNavHint}</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;

