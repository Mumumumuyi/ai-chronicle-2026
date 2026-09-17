import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { LiquidEpochStage } from './components/LiquidEpochStage';
import { LiquidParadigmWidget } from './components/LiquidParadigmWidget';
import { ArticleReader } from './components/ArticleReader';
import { MilestoneModal } from './components/MilestoneModal';
import { AboutDesignHub } from './components/AboutDesignHub';
import { AffiliateEcosystem } from './components/AffiliateEcosystem';
import { AdminSecurityCheckpoint } from './components/admin/AdminSecurityCheckpoint';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Milestone } from './types';
import { EPOCHS } from './data/timelineData';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { isSessionValid, checkSecretUrlTrigger } from './utils/securityWall';
import { recordVisitorLog } from './utils/analyticsTracker';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stage');
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(6); // Default to current 2024-2026 epoch
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  
  // Sovereign Admin Vault State
  const [showAdminCheckpoint, setShowAdminCheckpoint] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);

  const { t } = useLanguage();

  // Open Admin Gate (checks session validity)
  const handleOpenAdmin = useCallback(() => {
    if (isSessionValid()) {
      setShowAdminDashboard(true);
      setShowAdminCheckpoint(false);
    } else {
      setShowAdminCheckpoint(true);
    }
  }, []);

  // 1. Secret Keystroke Listener (Ctrl + Shift + Alt + A)
  useEffect(() => {
    const handleAdminHotKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.altKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleOpenAdmin();
      }
    };

    window.addEventListener('keydown', handleAdminHotKey);
    return () => window.removeEventListener('keydown', handleAdminHotKey);
  }, [handleOpenAdmin]);

  // 2. Secret URL Route Trigger & Initial Telemetry on Mount
  useEffect(() => {
    if (checkSecretUrlTrigger()) {
      handleOpenAdmin();
    }
    // Record initial visitor landing
    recordVisitorLog({ path: '/stage (首屏启动)' });
  }, [handleOpenAdmin]);

  // 3. Track Tab Telemetry
  const handleTabChange = (tab: ActiveTab) => {
    if (tab === 'about') {
      setShowAboutModal(true);
      recordVisitorLog({ path: '/about (关于编年史)' });
    } else {
      setActiveTab(tab);
      recordVisitorLog({ path: `/${tab}` });
    }
  };

  // 4. Track Milestone View Telemetry
  const handleOpenMilestone = (m: Milestone) => {
    setActiveMilestone(m);
    recordVisitorLog({
      path: `/milestone/${m.id}`,
      milestoneId: m.id,
      milestoneTitle: m.title,
    });
  };

  // Keyboard navigation for epochs (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeMilestone || showAboutModal || showAdminCheckpoint || showAdminDashboard || activeTab !== 'stage') return;
      if (e.key === 'ArrowLeft' && activeEpochIndex > 0) {
        setActiveEpochIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && activeEpochIndex < EPOCHS.length - 1) {
        setActiveEpochIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEpochIndex, activeMilestone, showAboutModal, showAdminCheckpoint, showAdminDashboard, activeTab]);

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
        onTabChange={handleTabChange}
        activeEpochIndex={activeEpochIndex}
        onSelectEpoch={setActiveEpochIndex}
        isAboutOpen={showAboutModal}
        onSecretTrigger={handleOpenAdmin}
      />

      {/* 3. Main Stage Content */}
      <main className="relative">
        {activeTab === 'stage' && (
          <LiquidEpochStage
            activeEpochIndex={activeEpochIndex}
            onSelectEpoch={setActiveEpochIndex}
            onOpenMilestone={handleOpenMilestone}
            onOpenReader={() => handleTabChange('reader')}
          />
        )}

        {activeTab === 'lab' && <LiquidParadigmWidget />}

        {activeTab === 'ecosystem' && <AffiliateEcosystem />}

        {activeTab === 'reader' && (
          <ArticleReader onClose={() => handleTabChange('stage')} />
        )}
      </main>

      {/* 4. Frontline Modals */}
      <MilestoneModal
        milestone={activeMilestone}
        onClose={() => setActiveMilestone(null)}
      />

      {showAboutModal && (
        <AboutDesignHub onClose={() => setShowAboutModal(false)} />
      )}

      {/* 5. Sovereign Admin Console Modals */}
      <AdminSecurityCheckpoint
        isOpen={showAdminCheckpoint}
        onClose={() => setShowAdminCheckpoint(false)}
        onAuthenticated={() => {
          setShowAdminCheckpoint(false);
          setShowAdminDashboard(true);
        }}
      />

      <AdminDashboard
        isOpen={showAdminDashboard}
        onClose={() => setShowAdminDashboard(false)}
      />

      {/* 6. Minimalist Ambient Footer */}
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
