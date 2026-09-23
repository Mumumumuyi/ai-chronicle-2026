import React, { useState, useEffect, useRef } from 'react';
import { Clock, BookOpen, BrainCircuit, Network, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageDropdown } from './LanguageDropdown';
import { hrefForTab } from '../utils/routes';

export type ActiveTab = 'stage' | 'reader' | 'lab' | 'ecosystem';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onSecretTrigger?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, onSecretTrigger }) => {
  const { t, currentLang } = useLanguage();
  const isZh = currentLang === 'zh';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Secret admin trigger: triple-click the brand within 1.4s.
  // A single click navigates home like a normal link.
  const clickTimesRef = useRef<number[]>([]);
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    const now = Date.now();
    clickTimesRef.current = clickTimesRef.current.filter(t => now - t < 1400);
    clickTimesRef.current.push(now);
    e.preventDefault();
    if (clickTimesRef.current.length >= 3) {
      clickTimesRef.current = [];
      onSecretTrigger?.();
      return;
    }
    setIsMobileMenuOpen(false);
    onTabChange('stage');
  };

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'stage', label: t.navStage, icon: Clock },
    { id: 'lab', label: t.navLab, icon: BrainCircuit },
    { id: 'reader', label: t.navReader, icon: BookOpen },
    { id: 'ecosystem', label: t.navEcosystem, icon: Network },
  ];

  const goTab = (tab: ActiveTab) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Real href stays for crawlers/new-tab; plain left clicks route client-side.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onTabChange(tab);
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Fixed editorial chrome — obsidian hairline bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[rgba(12,10,9,0.86)] backdrop-blur-md border-b border-[rgba(201,168,106,0.16)]">
        <div className="flex items-center justify-between h-14 px-4 sm:px-8 lg:px-16">
          {/* Brand — triple-click opens admin checkpoint */}
          <a
            href={hrefForTab('stage')}
            onClick={handleLogoClick}
            className="flex items-baseline gap-3 group flex-shrink-0 select-none"
          >
            <span className="font-display font-semibold text-xl tracking-tight text-pearl group-hover:text-gold2 transition-colors">
              AI<span className="text-gold">.</span>
            </span>
            <span className="hidden sm:block mono text-[#78716C] group-hover:text-stone-300 transition-colors">
              {t.brandSubtitle}
            </span>
          </a>

          {/* Desktop nav — mono, hairline, gold current indicator */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={hrefForTab(item.id)}
                  onClick={goTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative mono py-1.5 transition-colors duration-300 ${
                    isActive ? 'text-gold' : 'text-[#A8A29E] hover:text-pearl'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 -bottom-[3px] h-px bg-gold transition-transform duration-500 origin-left w-full ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                    aria-hidden="true"
                  />
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <LanguageDropdown />
            {/* Hamburger — mobile only (desktop shows nav links above) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-label={isZh ? '菜单' : 'Menu'}
              className="md:hidden flex flex-col justify-center gap-[6px] p-2 text-pearl"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <>
                  <i className="block w-6 h-px bg-pearl" />
                  <i className="block w-6 h-px bg-pearl" />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet — obsidian editorial list */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden anim-fade">
          <div
            className="absolute inset-0 bg-ob/95 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className="absolute top-14 left-0 right-0 border-b border-[#292524] bg-ob2 px-6 py-4" aria-label="Mobile">
            {navItems.map((item, i) => {
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={hrefForTab(item.id)}
                  onClick={goTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-baseline gap-4 py-4 border-b border-[#292524] last:border-b-0 transition-colors ${
                    isActive ? 'text-gold' : 'text-pearl hover:text-gold2'
                  }`}
                >
                  <span className="mono text-[#57534E]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-serif text-2xl">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      )}

      {/* Mobile bottom dock — obsidian hairline, gold active tick */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#292524] bg-[rgba(12,10,9,0.92)] backdrop-blur-md"
        aria-label="Dock"
      >
        <div className="grid grid-cols-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <a
                key={item.id}
                href={hrefForTab(item.id)}
                onClick={goTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex flex-col items-center justify-center py-2.5 gap-1 transition-colors duration-300 ${
                  isActive ? 'text-gold' : 'text-[#78716C] hover:text-pearl'
                }`}
              >
                <span
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-px bg-gold transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  aria-hidden="true"
                />
                <Icon className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-mono tracking-widest uppercase">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </>
  );
};

