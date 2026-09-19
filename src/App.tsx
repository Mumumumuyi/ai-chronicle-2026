import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { LiquidEpochStage } from './components/LiquidEpochStage';
import { LiquidParadigmWidget } from './components/LiquidParadigmWidget';
import { ArticleReader } from './components/ArticleReader';
import { MilestoneModal } from './components/MilestoneModal';
import { AffiliateEcosystem } from './components/AffiliateEcosystem';
import { AdminSecurityCheckpoint } from './components/admin/AdminSecurityCheckpoint';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Milestone } from './types';
import { EPOCHS } from './data/timelineData';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import { isSessionValid, checkSecretUrlTrigger } from './utils/securityWall';
import { recordVisitorLog } from './utils/analyticsTracker';
import { applyRouteMeta, hrefForTab, tabFromLocation } from './utils/routes';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => tabFromLocation());
  const [activeEpochIndex, setActiveEpochIndex] = useState<number>(6); // Default to current 2024-2026 epoch
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  
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

  // 2. Secret URL Route Trigger, Back/Forward Navigation & Initial Telemetry on Mount
  useEffect(() => {
    if (checkSecretUrlTrigger()) {
      handleOpenAdmin();
    }

    // Old links used #reader / #lab style hashes; upgrade them to the real path
    // in place so they keep working and stop competing as separate URLs.
    if (window.location.hash) {
      const landed = tabFromLocation();
      window.history.replaceState({}, '', hrefForTab(landed));
    }

    recordVisitorLog({ path: window.location.pathname });

    const handlePopState = () => setActiveTab(tabFromLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleOpenAdmin]);

  // 3. Keep <head> metadata in step with the active route
  useEffect(() => {
    applyRouteMeta(activeTab);
  }, [activeTab]);

  // 4. Navigate to a real URL and track the tab telemetry
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    const href = hrefForTab(tab);
    if (window.location.pathname !== href) {
      window.history.pushState({}, '', href);
    }
    recordVisitorLog({ path: href });
  };

  // 5. Track Milestone View Telemetry
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
      if (activeMilestone || showAdminCheckpoint || showAdminDashboard || activeTab !== 'stage') return;
      if (e.key === 'ArrowLeft' && activeEpochIndex > 0) {
        setActiveEpochIndex((prev) => prev - 1);
      } else if (e.key === 'ArrowRight' && activeEpochIndex < EPOCHS.length - 1) {
        setActiveEpochIndex((prev) => prev + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEpochIndex, activeMilestone, showAdminCheckpoint, showAdminDashboard, activeTab]);

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#F4F4F2] overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Architectural Deep Void Canvas (Blueprint Grid + Ambient Radial Sheen) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Subtle 48px Blueprint Coordinate Grid */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
        {/* Ethereal Warm Amber Atmosphere Glow */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-amber-500/12 via-amber-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-amber-400/[0.025] rounded-full blur-3xl pointer-events-none" />
        {/* Radial Edge Dark Vignette */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 30%, transparent 40%, rgba(7, 7, 9, 0.85) 100%)'
          }}
        />
      </div>

      {/* 2. Floating Liquid Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        activeEpochIndex={activeEpochIndex}
        onSelectEpoch={setActiveEpochIndex}
        onSecretTrigger={handleOpenAdmin}
      />

      {/* 3. Main Stage Content */}
      <main className="relative" key={activeTab}>
        {activeTab === 'stage' && (
          <div className="animate-tab-enter">
            <LiquidEpochStage
              activeEpochIndex={activeEpochIndex}
              onSelectEpoch={setActiveEpochIndex}
              onOpenMilestone={handleOpenMilestone}
              onOpenReader={() => handleTabChange('reader')}
            />
          </div>
        )}

        {activeTab === 'lab' && (
          <div className="animate-tab-enter">
            <LiquidParadigmWidget />
          </div>
        )}

        {activeTab === 'ecosystem' && (
          <div className="animate-tab-enter">
            <AffiliateEcosystem />
          </div>
        )}

        {activeTab === 'reader' && (
          <div className="animate-tab-enter">
            <ArticleReader onClose={() => handleTabChange('stage')} />
          </div>
        )}
      </main>

      {/* 4. Frontline Modals */}
      <MilestoneModal
        milestone={activeMilestone}
        onClose={() => setActiveMilestone(null)}
      />

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

      {/* 6. Minimalist Architectural Monograph Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 text-center text-stone-500 text-xs font-mono no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-stone-400">{t.footerCopyright}</span>
          <span className="text-amber-400/80">{t.footerDesignTag}</span>
          <span className="text-stone-500">{t.footerNavHint}</span>
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
