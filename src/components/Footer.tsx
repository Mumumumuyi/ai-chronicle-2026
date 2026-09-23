import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { hrefForTab } from '../utils/routes';
import { getOwnerContact } from '../utils/monetizationConfig';

interface FooterProps {
  onNavigate?: (tab: 'stage' | 'reader' | 'lab' | 'ecosystem') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, currentLang } = useLanguage();
  const isZh = currentLang === 'zh';
  const afdianUrl = getOwnerContact().afdianUrl || 'https://afdian.com/a/aichronicle';

  const handleTab = (tab: 'stage' | 'reader' | 'lab' | 'ecosystem') => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(tab);
  };

  return (
    <footer className="relative overflow-hidden bg-ob border-t border-[#292524] pt-16 sm:pt-20 pb-24 md:pb-12 px-5 sm:px-10 lg:px-16 text-[#78716C]">
      {/* Giant watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-4 sm:left-10 -bottom-8 sm:-bottom-10 font-display font-semibold text-[26vw] sm:text-[200px] leading-none whitespace-nowrap select-none"
        style={{ color: 'rgba(245,241,234,0.035)' }}
      >
        CHRONICLE
      </div>

      <div className="relative flex flex-col sm:flex-row justify-between gap-6 mono">
        <span>{t.footerCopyright}</span>
        <span className="flex flex-wrap gap-x-5 gap-y-2">
          <a
            href={afdianUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold2 transition-colors"
          >
            {isZh ? '爱发电赞助' : 'Afdian'}
          </a>
          <a href={hrefForTab('reader')} onClick={handleTab('reader')} className="hover:text-gold2 transition-colors">
            {t.navReader}
          </a>
          <a href={hrefForTab('lab')} onClick={handleTab('lab')} className="hover:text-gold2 transition-colors">
            {t.navLab}
          </a>
          <a
            href="https://github.com/Mumumumuyi"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold2 transition-colors"
          >
            GitHub
          </a>
        </span>
      </div>

      <div className="relative mt-10 pt-6 border-t border-[#292524] flex flex-col sm:flex-row justify-between gap-3 mono text-[#57534E]">
        <span>{isZh ? '一个人维护的免费网站 · 无付费墙' : 'A free, solo-maintained site · no paywall'}</span>
        <span>{isZh ? '黑曜石 × 香槟金 · 博物馆编年视觉' : 'Obsidian × Champagne — Museum Chronicle Edition'}</span>
      </div>
    </footer>
  );
};
