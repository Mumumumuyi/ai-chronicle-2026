export type SupportedLanguage = 'zh' | 'en' | 'es' | 'de' | 'fr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
];

export interface TranslationDictionary {
  // Brand & Nav
  brandTitle: string;
  brandSubtitle: string;
  navStage: string;
  navLab: string;
  navReader: string;
  navEcosystem: string;
  navAbout: string;
  
  // Epochs Nav Pills
  epochPills: { label: string; era: string }[];

  // Stage Hero & Controls
  heroBadge: string;
  computePower: string;
  dominantParadigm: string;
  keyPhilosophicalTension: string;
  eraJudgment: string;
  epochKeyFigure: string;
  milestoneArchiveTitle: string;
  clickToInspectDossier: string;
  readFullTreatise: string;
  enterScalingLab: string;
  switchEpochHint: string;

  // Lab & Paradigm Simulator
  labTitle: string;
  labSubtitle: string;
  pretrainCompute: string;
  testTimeCompute: string;
  reasoningEffortLabel: string;
  estimatedBenchmark: string;
  paradigmMatrixTitle: string;

  // Ecosystem & Perks
  ecosystemBadge: string;
  ecosystemTitle: string;
  ecosystemSubtitle: string;
  submitProductBtn: string;
  verifiedOfficial: string;
  directClaimBtn: string;
  promoCodeLabel: string;
  copiedCodeToast: string;
  affiliateDisclaimerTitle: string;
  affiliateDisclaimerBody: string;

  // Commercial / Sponsor Banner & Modal
  sponsorBannerBadge: string;
  sponsorBannerTitle: string;
  sponsorActionJoin: string;
  sponsorActionDeck: string;
  sponsorModalTitle: string;
  sponsorModalSubtitle: string;
  sponsorOption1Title: string;
  sponsorOption1Desc: string;
  sponsorOption2Title: string;
  sponsorOption2Desc: string;
  sponsorContactTitle: string;
  copyContactBtn: string;
  copiedContactToast: string;

  // Academic Reader & Citation
  readerBadge: string;
  readerReadingTime: string;
  readerTOC: string;
  readerExportPDF: string;
  readerCiteBibtex: string;
  readerSubscribeNewsletter: string;
  readerBackToTop: string;
  bibtexModalTitle: string;
  bibtexCopyBtn: string;
  bibtexCopiedToast: string;
  newsletterModalTitle: string;
  newsletterModalDesc: string;
  newsletterInputPlaceholder: string;
  newsletterSubmitBtn: string;
  newsletterSuccessMsg: string;

  // Footer
  footerCopyright: string;
  footerDesignTag: string;
  footerNavHint: string;
}
