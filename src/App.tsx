import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LiquidParadigmWidget } from './components/LiquidParadigmWidget';
import { ArticleReader } from './components/ArticleReader';
import { AffiliateEcosystem } from './components/AffiliateEcosystem';
import { MonetizationBanner } from './components/MonetizationBanner';
import { Footer } from './components/Footer';
import { AdminSecurityCheckpoint } from './components/admin/AdminSecurityCheckpoint';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LanguageProvider } from './i18n/LanguageContext';
import { isSessionValid, checkSecretUrlTrigger } from './utils/securityWall';
import { recordVisitorLog } from './utils/analyticsTracker';
import { MilestonePage } from './components/MilestonePage';
import {
  applyRouteMeta,
  hrefForMilestone,
  hrefForTab,
  resolveLocation,
  type LocationResolution,
} from './utils/routes';

const AppContent: React.FC = () => {
  const [routeState, setRouteState] = useState<LocationResolution>(() => resolveLocation());
  const activeTab = routeState.tab;
  const milestoneSlug = routeState.milestoneSlug;

  // Sovereign Admin Vault State
  const [showAdminCheckpoint, setShowAdminCheckpoint] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);

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
      const landed = resolveLocation();
      window.history.replaceState(
        {},
        '',
        landed.milestoneSlug ? hrefForMilestone(landed.milestoneSlug) : hrefForTab(landed.tab)
      );
    }

    recordVisitorLog({ path: window.location.pathname });

    const handlePopState = () => setRouteState(resolveLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleOpenAdmin]);

  // 3. Keep <head> metadata in step with the active route
  useEffect(() => {
    applyRouteMeta(routeState.tab, routeState.milestoneSlug);
  }, [routeState]);

  // 4. Navigate to a real URL and track the tab telemetry
  const handleTabChange = (tab: ActiveTab) => {
    setRouteState({ tab, milestoneSlug: null });
    const href = hrefForTab(tab);
    if (window.location.pathname !== href) {
      window.history.pushState({}, '', href);
    }
    window.scrollTo({ top: 0 });
    recordVisitorLog({ path: href });
  };

  // 4b. Navigate to a milestone dossier page (/milestone/<slug>/)
  const handleOpenMilestonePage = (slug: string) => {
    setRouteState({ tab: 'stage', milestoneSlug: slug });
    const href = hrefForMilestone(slug);
    if (window.location.pathname !== href) {
      window.history.pushState({}, '', href);
    }
    window.scrollTo({ top: 0 });
    recordVisitorLog({ path: href });
  };

  return (
    <div className="relative min-h-screen bg-ob text-pearl overflow-x-hidden">
      {/* Editorial chrome — fixed obsidian navbar + mobile dock */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onSecretTrigger={handleOpenAdmin}
      />

      <main className="relative" key={milestoneSlug ? `milestone:${milestoneSlug}` : activeTab}>
        {milestoneSlug ? (
          <div className="animate-tab-enter">
            <MilestonePage
              slug={milestoneSlug}
              onSelectMilestone={handleOpenMilestonePage}
              onSelectTab={handleTabChange}
            />
          </div>
        ) : (
          <>
            {activeTab === 'stage' && (
              <div className="animate-tab-enter">
                <HomePage
                  onNavigate={handleTabChange}
                  onOpenMilestonePage={handleOpenMilestonePage}
                />
                <MonetizationBanner />
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
          </>
        )}
      </main>

      {/* Sovereign Admin Console Modals */}
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

      <Footer onNavigate={handleTabChange} />
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
