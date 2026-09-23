import React, { useState } from 'react';
import { DollarSign, Download, Coffee } from 'lucide-react';
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
    ? '特约品牌展位 · 离线长卷免费下载 · 独立创作者赞助支持通道开启'
    : currentLang === 'es'
    ? 'Espacios de Marca · Edición Offline Gratuita · Apoyo a Creadores Independientes'
    : currentLang === 'de'
    ? 'Exklusive Markenplätze · Kostenlose Offline-Ausgabe · Unterstützung unabhängiger Forschung'
    : currentLang === 'fr'
    ? 'Emplacements de Marque · Édition Hors Ligne Gratuite · Soutien à la Recherche Indépendante'
    : 'Featured Brand Placements · Free Offline Edition · Independent Research Support';

  const tipBtnText = isZh ? '赞助打赏' : currentLang === 'es' ? 'Apoyar' : currentLang === 'de' ? 'Spenden' : currentLang === 'fr' ? 'Soutenir' : 'Tip Coffee';
  const bundleBtnText = isZh ? '免费离线长卷' : currentLang === 'es' ? 'Edición Gratuita' : currentLang === 'de' ? 'Gratis-Paket' : currentLang === 'fr' ? 'Pack Gratuit' : 'Free Offline Pack';
  const sponsorBtnText = isZh ? '商业入驻 / 智能测算' : currentLang === 'es' ? 'Patrocinio y Tarifas' : currentLang === 'de' ? 'B2B-Präsenz & Preise' : currentLang === 'fr' ? 'Partenariat B2B' : 'B2B Placement & Pricing';

  return (
    <>
      {/* Editorial sponsor strip — hairline rule above the footer */}
      <div className="border-t border-[#292524] bg-ob px-5 sm:px-10 lg:px-16 py-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="eyebrow on-dark mb-3">
              <i />
              {badgeText}
            </p>
            <h4 className="text-base sm:text-xl font-serif font-medium text-pearl leading-snug">
              {titleText}
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto flex-shrink-0">
            <button
              onClick={() => setShowCoffeeModal(true)}
              className="btn-gold !py-2.5 !px-5 text-xs flex-1 sm:flex-initial justify-center"
            >
              <Coffee className="w-3.5 h-3.5" />
              <span>{tipBtnText}</span>
            </button>

            <button
              onClick={() => setShowBundleModal(true)}
              className="btn-ghost flex-1 sm:flex-initial justify-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{bundleBtnText}</span>
            </button>

            <button
              onClick={() => setShowSponsorModal(true)}
              className="btn-ghost w-full sm:w-auto justify-center"
            >
              <DollarSign className="w-3.5 h-3.5" />
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

      {/* Offline Bundle Modal */}
      {showBundleModal && (
        <PremiumBundleModal onClose={() => setShowBundleModal(false)} />
      )}
    </>
  );
};
