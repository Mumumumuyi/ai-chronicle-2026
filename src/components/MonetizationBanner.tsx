import React, { useState } from 'react';
import { DollarSign, Download, Zap, Coffee } from 'lucide-react';
import { SponsorCoffeeModal } from './SponsorCoffeeModal';
import { PremiumBundleModal } from './PremiumBundleModal';
import { SponsorCalculator } from './SponsorCalculator';
import { useLanguage } from '../i18n/LanguageContext';

export const MonetizationBanner: React.FC = () => {
  const [showSponsorModal, setShowSponsorModal] = useState<boolean>(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState<boolean>(false);
  const [showBundleModal, setShowBundleModal] = useState<boolean>(false);
  const { currentLang } = useLanguage();

  const isZh = currentLang === 'zh';

  const badgeText = isZh 
    ? '全球 AI 极客、算力品牌与商业合作通道' 
    : currentLang === 'es'
    ? 'Canal Global de Patrocinio y Cómputo IA'
    : currentLang === 'de'
    ? 'Globaler Kanal für KI-Sponsoring & Rechenleistung'
    : currentLang === 'fr'
    ? 'Canal Mondial de Sponsoring IA & Calcul'
    : 'Global AI Builders, Compute Brands & Commercial Partners';

  const titleText = isZh
    ? '特约品牌展位 · 资产包下载 · 独立创作者赞助支持通道开启'
    : currentLang === 'es'
    ? 'Espacios de Marca · Paquete de Activos 4K · Apoyo a Creadores Independientes'
    : currentLang === 'de'
    ? 'Exklusive Markenplätze · 4K-Asset-Paket · Unterstützung unabhängiger Forschung'
    : currentLang === 'fr'
    ? 'Emplacements de Marque · Pack d’Actifs 4K · Soutien à la Recherche Indépendante'
    : 'Featured Brand Placements · 4K Digital Asset Pack · Independent Research Support';

  const tipBtnText = isZh ? '赞助打赏 ☕' : currentLang === 'es' ? 'Apoyar ☕' : currentLang === 'de' ? 'Spenden ☕' : currentLang === 'fr' ? 'Soutenir ☕' : 'Tip Coffee ☕';
  const bundleBtnText = isZh ? '4K 离线资产包' : currentLang === 'es' ? 'Paquete 4K' : currentLang === 'de' ? '4K-Asset-Paket' : currentLang === 'fr' ? 'Pack 4K' : '4K Asset Bundle';
  const sponsorBtnText = isZh ? '商业入驻 / 智能测算' : currentLang === 'es' ? 'Patrocinio y Tarifas' : currentLang === 'de' ? 'B2B-Präsenz & Preise' : currentLang === 'fr' ? 'Partenariat B2B' : 'B2B Placement & Pricing';

  return (
    <>
      {/* Sleek Liquid Glass Commercial & Ad Strip */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-amber-400/30 my-6 sm:my-8 shadow-xl relative overflow-hidden glass-sheen">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-500/30 flex-shrink-0">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs font-mono">
                <span className="text-amber-300 font-bold">MONETIZATION & SPONSOR</span>
                <span className="text-stone-500 hidden sm:inline">·</span>
                <span className="text-stone-400 truncate">{badgeText}</span>
              </div>
              <h4 className="text-xs sm:text-base font-serif font-semibold text-white mt-0.5 leading-snug">
                {titleText}
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-1 lg:pt-0">
            <button
              onClick={() => setShowCoffeeModal(true)}
              className="liquid-glass-amber flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white flex items-center justify-center space-x-1.5 transition-all shadow-sm whitespace-nowrap"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{tipBtnText}</span>
            </button>

            <button
              onClick={() => setShowBundleModal(true)}
              className="liquid-glass-pill flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-mono text-stone-200 hover:text-white flex items-center justify-center space-x-1.5 transition-all border border-amber-400/20 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>{bundleBtnText}</span>
            </button>

            <button
              onClick={() => setShowSponsorModal(true)}
              className="liquid-glass-pill w-full sm:w-auto px-3.5 py-1.5 sm:py-2 rounded-full text-xs font-mono text-stone-300 hover:text-white flex items-center justify-center space-x-1.5 transition-all whitespace-nowrap"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>{sponsorBtnText}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive B2B Sponsor Calculator Modal */}
      {showSponsorModal && (
        <SponsorCalculator onClose={() => setShowSponsorModal(false)} />
      )}

      {/* Coffee / Direct Support Modal */}
      {showCoffeeModal && (
        <SponsorCoffeeModal onClose={() => setShowCoffeeModal(false)} />
      )}

      {/* 4K Bundle / Digital Assets Modal */}
      {showBundleModal && (
        <PremiumBundleModal onClose={() => setShowBundleModal(false)} />
      )}
    </>
  );
};

