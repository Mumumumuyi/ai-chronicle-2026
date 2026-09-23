import React, { useState, useEffect } from 'react';
import { ARTICLE_META, ARTICLE_CHAPTERS } from '../data/historyArticle';
import { BookOpen, Clock, Share2, ArrowUp, Check, X, Printer, FileText, Copy, ArrowUpRight, Download, Coffee, DollarSign } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getMonetizationPartners, DEFAULT_PARTNERS, MonetizationPartner } from '../utils/monetizationConfig';
import { recordAffiliateAction } from '../utils/analyticsTracker';
import { PremiumBundleModal } from './PremiumBundleModal';
import { SponsorCoffeeModal } from './SponsorCoffeeModal';
import { SponsorCalculator } from './SponsorCalculator';
import { useScrollReveal } from '../hooks/useScrollReveal';

const CHAPTER_TITLES_I18N: Record<string, Record<string, { num: string; title: string }>> = {
  'chap-0': {
    en: { num: 'Prologue', title: 'The Spark of Prometheus: Precursors of Rational Machines (1943 — 1956)' },
    es: { num: 'Prólogo', title: 'La Chispa de Prometeo: Precursores de las Máquinas Racionales (1943 — 1956)' },
    de: { num: 'Prolog', title: 'Der Funke des Prometheus: Vorläufer rationaler Maschinen (1943 — 1956)' },
    fr: { num: 'Prologue', title: 'L’Étincelle de Prométhée : Précurseurs des Machines Rationnelles (1943 — 1956)' },
  },
  'chap-1': {
    en: { num: 'Chapter I', title: 'The Golden Age & Combinatorial Explosion (1956 — 1974)' },
    es: { num: 'Capítulo I', title: 'La Edad de Oro y la Explosión Combinatoria (1956 — 1974)' },
    de: { num: 'Kapitel I', title: 'Das Goldene Zeitalter und die kombinatorische Explosion (1956 — 1974)' },
    fr: { num: 'Chapitre I', title: 'L’Âge d’Or et l’Explosion Combinatoire (1956 — 1974)' },
  },
  'chap-2': {
    en: { num: 'Chapter II', title: 'Expert Systems & The Backpropagation Undercurrent (1975 — 1993)' },
    es: { num: 'Capítulo II', title: 'Sistemas Expertos y la Corriente de Retropropagación (1975 — 1993)' },
    de: { num: 'Kapitel II', title: 'Expertensysteme und die Backpropagation-Welle (1975 — 1993)' },
    fr: { num: 'Chapitre II', title: 'Systèmes Experts et le Courant de Rétropropagation (1975 — 1993)' },
  },
  'chap-3': {
    en: { num: 'Chapter III', title: 'Statistical Learning & The Deep Blue Climax (1993 — 2011)' },
    es: { num: 'Capítulo III', title: 'Aprendizaje Estadístico y el Triunfo de Deep Blue (1993 — 2011)' },
    de: { num: 'Kapitel III', title: 'Statistisches Lernen und der Deep-Blue-Triumph (1993 — 2011)' },
    fr: { num: 'Chapitre III', title: 'Apprentissage Statistique et la Victoire de Deep Blue (1993 — 2011)' },
  },
  'chap-4': {
    en: { num: 'Chapter IV', title: 'The Deep Learning Revolution & Transformer Era (2012 — 2020)' },
    es: { num: 'Capítulo IV', title: 'La Revolución del Deep Learning y la Era Transformer (2012 — 2020)' },
    de: { num: 'Kapitel IV', title: 'Die Deep-Learning-Revolution & Transformer-Ära (2012 — 2020)' },
    fr: { num: 'Chapitre IV', title: 'La Révolution du Deep Learning et l’Ère Transformer (2012 — 2020)' },
  },
  'chap-5': {
    en: { num: 'Chapter V', title: 'Scaling Laws & Large Language Model Emergence (2020 — 2024)' },
    es: { num: 'Capítulo V', title: 'Leyes de Escala y la Emergencia de Grandes Modelos (2020 — 2024)' },
    de: { num: 'Kapitel V', title: 'Skalierungsgesetze & Die Entstehung von LLMs (2020 — 2024)' },
    fr: { num: 'Chapitre V', title: 'Lois d’Échelle et l’Émergence des Grands Modèles (2020 — 2024)' },
  },
  'chap-6': {
    en: { num: 'Chapter VI', title: 'Test-Time Compute, Runtime Loops & Silicon Singularity (2024 — 2026.09)' },
    es: { num: 'Capítulo VI', title: 'Cómputo en Inferencia, Bucles de Agentes y la Singularidad (2024 — 2026.09)' },
    de: { num: 'Kapitel VI', title: 'Testzeit-Berechnung, Runtime-Schleifen & Silizium-Singularität (2024 — 2026.09)' },
    fr: { num: 'Chapitre VI', title: 'Calcul au Temps de Test, Boucles d’Agents et la Singularité (2024 — 2026.09)' },
  },
};

interface ArticleReaderProps {
  onClose?: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ onClose }) => {
  const { currentLang, t } = useLanguage();
  const [activeChapterId, setActiveChapterId] = useState<string>('chap-0');
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState<number>(0);
  const [showCiteModal, setShowCiteModal] = useState<boolean>(false);
  const [showMobileTOC, setShowMobileTOC] = useState<boolean>(false);
  const [copiedCite, setCopiedCite] = useState<boolean>(false);
  const [showBundleModal, setShowBundleModal] = useState<boolean>(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState<boolean>(false);
  const [showSponsorModal, setShowSponsorModal] = useState<boolean>(false);
  const [partners, setPartners] = useState<MonetizationPartner[]>([]);
  const [copiedPartnerId, setCopiedPartnerId] = useState<string | null>(null);
  const revealRef = useScrollReveal<HTMLDivElement>([currentLang]);

  useEffect(() => {
    setPartners(getMonetizationPartners());
  }, []);

  const runpodPartner = partners.find(p => p.id === 'runpod') || DEFAULT_PARTNERS[0];
  const autodlPartner = partners.find(p => p.id === 'autodl') || DEFAULT_PARTNERS[1];
  const cursorPartner = partners.find(p => p.id === 'cursor') || DEFAULT_PARTNERS[3];
  const groqPartner = partners.find(p => p.id === 'groq') || DEFAULT_PARTNERS[5];

  const handleAffiliateClick = (partner: MonetizationPartner) => {
    recordAffiliateAction(partner.id, partner.name, 'click');
  };

  const handleCopyPromo = (code: string, partner: MonetizationPartner) => {
    navigator.clipboard.writeText(code);
    setCopiedPartnerId(partner.id);
    recordAffiliateAction(partner.id, partner.name, 'promo_copy');
    setTimeout(() => setCopiedPartnerId(null), 2000);
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadProgress(progress);
      }

      const chapterElements = ARTICLE_CHAPTERS.map(ch => ({
        id: ch.id,
        el: document.getElementById(ch.id),
      }));

      for (const item of chapterElements) {
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 100) {
            setActiveChapterId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToChapter = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleCopyQuote = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuote(text);
    setTimeout(() => setCopiedQuote(null), 2000);
  };

  const bibtexCitation = `@article{aichronicle2026,
  title={人工智能全景通史：从图灵火种到测试时算力新范式 (1943-2026)},
  author={AI Chronicle Research Group},
  year={2026},
  publisher={GitHub Pages},
  url={https://mumumumuyi.github.io/ai-chronicle-2026/}
}`;

  const isZh = currentLang === 'zh';

  const getChapterDisplay = (ch: (typeof ARTICLE_CHAPTERS)[0]) => {
    if (isZh) return { num: ch.chapterNumber, title: ch.title };
    const trans = CHAPTER_TITLES_I18N[ch.id]?.[currentLang] || CHAPTER_TITLES_I18N[ch.id]?.en;
    return {
      num: trans?.num || ch.chapterNumber,
      title: trans?.title || ch.title,
    };
  };

  const metaTitle = isZh ? ARTICLE_META.title : 'Fire, Winter & Silicon Singularity: A Panoramic History of AI (1943 — 2026.09)';
  const metaSubtitle = isZh ? ARTICLE_META.subtitle : 'From Turing’s Question and the Dialectics of Symbolism & Connectionism to Autonomous Agent Runtime Loops';
  const metaAbstract = isZh
    ? ARTICLE_META.abstract
    : 'An exhaustive academic treatise spanning eight decades of artificial intelligence philosophy, algorithmic history, and geopolitics. From Alan Turing’s 1950 operational definition of machine thinking and the 1956 Dartmouth summit, through the two harsh AI winters, the quiet triumph of backpropagation, to contemporary test-time compute, System 2 reasoning, and autonomous agent loops on the eve of the Silicon Singularity.';

  const abstractLabel = isZh ? '【史学立论与导言摘要】' : '[ Epistemological Abstract & Historical Thesis ]';

  return (
    <div ref={revealRef} className="relative min-h-screen bg-ob pt-24 sm:pt-28 pb-24 px-5 sm:px-8 max-w-6xl mx-auto">
      {/* Top Reading Progress Bar — a single gold hairline above the navbar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50 no-print">
        <div
          className="h-full bg-gold transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Reader Header — editorial masthead */}
      <header className="rv pb-10 border-b border-[#292524] mb-10 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-0 right-0 w-9 h-9 border border-[#44403C] flex items-center justify-center text-[#78716C] hover:text-gold2 hover:border-gold transition-colors no-print"
            title={isZh ? '返回展台' : 'Back to Stage'}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <p className="eyebrow on-dark mb-6">
          <i />
          {t.readerBadge}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-4 mono text-[#78716C]">
          <span className="text-gold">{ARTICLE_META.version}</span>
          <span className="text-[#44403C]">·</span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1.5 text-gold" />
            {ARTICLE_META.readingTimeMinutes} {t.readerReadingTime}
          </span>
          <span className="text-[#44403C]">·</span>
          <span>{ARTICLE_META.wordCountTotal}</span>
        </div>

        <h1 className="font-serif font-medium text-3xl sm:text-5xl text-pearl tracking-[-0.01em] mb-4 leading-[1.2]">
          {metaTitle}
        </h1>
        <p className="text-sm sm:text-base font-serif text-gold2/85 mb-8 max-w-3xl leading-relaxed">
          {metaSubtitle}
        </p>

        <div className="panel-dark-2 border-l-2 !border-l-gold p-4 sm:p-5 text-[#D6D3D1] text-xs sm:text-sm leading-[1.9] mb-8">
          <span className="mono text-gold block mb-2">{abstractLabel}</span>
          {metaAbstract}
        </div>

        {/* Academic Utility Action Bar */}
        <div className="flex flex-wrap items-center gap-3 no-print">
          <button
            onClick={() => window.print()}
            className="btn-gold !py-2.5 !px-5 text-xs"
            title="Print / Save as Academic PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.readerExportPDF}</span>
          </button>

          <button
            onClick={() => setShowCiteModal(true)}
            className="btn-ghost"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.readerCiteBibtex}</span>
          </button>
        </div>
      </header>

      {/* Grid Layout: TOC Sidebar + Academic Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Chapter Navigator — hairline editorial index */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 font-mono text-xs no-print">
          <div className="flex items-center justify-between pb-3 mb-1 border-b border-[#292524]">
            <span className="mono text-gold flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              {t.readerTOC}
            </span>
            <span className="mono text-[#78716C]">{Math.round(readProgress)}%</span>
          </div>

          <nav>
            {ARTICLE_CHAPTERS.map((chapter) => {
              const isActive = activeChapterId === chapter.id;
              const chInfo = getChapterDisplay(chapter);
              return (
                <button
                  key={chapter.id}
                  onClick={() => scrollToChapter(chapter.id)}
                  className={`w-full text-left px-3 py-2.5 border-l-2 transition-all flex items-start gap-2.5 ${
                    isActive
                      ? 'border-gold text-gold2 bg-[rgba(201,168,106,0.06)]'
                      : 'border-transparent text-[#78716C] hover:text-pearl hover:bg-[rgba(244,241,234,0.03)]'
                  }`}
                >
                  <span className={`mono flex-shrink-0 mt-px ${isActive ? 'text-gold' : 'text-[#57534E]'}`}>
                    {chInfo.num}
                  </span>
                  <span className="line-clamp-1 leading-snug">{chInfo.title.split('：')[0].split(':')[0]}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Article Content */}
        <main className="lg:col-span-9">
          {ARTICLE_CHAPTERS.map((chapter, idx) => {
            const chInfo = getChapterDisplay(chapter);
            return (
              <React.Fragment key={chapter.id}>
                <article
                  id={chapter.id}
                  className="border-t border-[#292524] pt-10 sm:pt-14 mt-10 sm:mt-14 first:mt-0 first:border-t-0 first:pt-0 scroll-mt-28"
                >
                <div>
                  <div className="flex items-center gap-3 mono text-gold mb-4">
                    <span className="px-3 py-1 border border-[rgba(201,168,106,0.4)]">
                      {chInfo.num}
                    </span>
                    <span className="text-[#44403C]">/</span>
                    <span className="text-[#78716C]">{chapter.timeSpan}</span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-serif font-medium text-pearl tracking-[-0.01em] mb-5 leading-[1.25]">
                    {chInfo.title}
                  </h2>

                {/* Lead Epigraph Quote — gold left rule, serif voice */}
                <div className="relative my-6 border-l-2 border-gold pl-5 sm:pl-7 py-1 text-[#D6D3D1] font-serif text-sm sm:text-base">
                  <p className="mb-3 leading-[1.9]">&ldquo;{chapter.leadQuote.text}&rdquo;</p>
                  <div className="flex items-center justify-between mono text-[#78716C]">
                    <span>—— {chapter.leadQuote.attribution}</span>
                    <button
                      onClick={() => handleCopyQuote(chapter.leadQuote.text)}
                      className="hover:text-gold2 transition-colors flex items-center gap-1.5 flex-shrink-0 ml-4"
                    >
                      {copiedQuote === chapter.leadQuote.text ? (
                        <>
                          <Check className="w-3 h-3 text-gold" />
                          <span className="text-gold">{isZh ? '已复制' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          <span>{isZh ? '引用' : 'Cite'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-[#D6D3D1] leading-[1.9] text-sm sm:text-base text-justify">
                  {chapter.introParagraph}
                </p>
              </div>

              {/* Chapter Sections */}
              <div className="space-y-8 pt-8 mt-8 border-t border-[#292524]">
                {chapter.sections.map((section, sIdx) => (
                  <section key={sIdx} className="space-y-4">
                    <h3 className="text-lg sm:text-xl font-serif font-medium text-pearl flex items-center">
                      <span className="w-3 h-px bg-gold mr-3" />
                      {section.subtitle}
                    </h3>

                    {section.content.map((p, pIdx) => (
                      <p key={pIdx} className="text-[#A8A29E] text-sm sm:text-[15px] leading-[1.9] text-justify">
                        {p}
                      </p>
                    ))}

                    {section.highlightInsight && (
                      <div className="panel-dark-2 border-l-2 !border-l-gold p-4 sm:p-5">
                        <div className="mono text-gold mb-2">
                          ✦ {isZh ? '核心史学洞见' : 'Key Historical Insight'}
                        </div>
                        <div className="text-sm text-[#D6D3D1] font-serif leading-[1.8]">
                          {section.highlightInsight}
                        </div>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </article>

            {/* In-Article Sponsored Placement 1: GPU Compute (After Chapter II) */}
            {idx === 2 && (
              <div className="my-12 panel-dark p-6 sm:p-8 no-print">
                <p className="eyebrow on-dark justify-center mb-4">
                  <i />
                  {isZh ? '算力与工程工具直达' : 'Compute & Engineering Tools'}
                </p>
                <h4 className="text-lg sm:text-2xl font-serif font-medium text-pearl text-center mb-3">
                  {isZh ? '深度学习与模型复现算力受限？可直达主流 GPU 算力云' : 'Scaling Constraints? Deploy On-Demand Cloud GPUs'}
                </h4>
                <p className="text-xs sm:text-sm text-[#A8A29E] max-w-2xl mx-auto text-center mb-8 leading-relaxed">
                  {isZh
                    ? '通过下方官网直达入口启动前沿模型微调与大并发推理，秒级拉起 PyTorch 与 vLLM 容器环境。'
                    : 'Provision on-demand H100, A100, and RTX 4090 instances in seconds via the official sites below.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#292524] border border-[#292524] max-w-2xl mx-auto">
                  {/* AutoDL Domestic Card */}
                  <div className="bg-ob p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-semibold text-pearl">{autodlPartner.name}</span>
                        <span className="mono px-2 py-0.5 border border-[#44403C] text-gold flex-shrink-0">
                          {isZh ? autodlPartner.perkBadgeZh : autodlPartner.perkBadgeEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A8A29E] leading-relaxed mb-3">
                        {isZh ? '国内高校与团队首选，预装主流框架镜像，微信/支付宝按时计费。' : 'Domestic low-latency mirrors & instant framework containers.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-[#292524]">
                      {autodlPartner.promoCode && (
                        <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 text-[11px] font-mono border border-[#292524]">
                          <span className="text-[#78716C]">{isZh ? '立减码:' : 'Code:'} <b className="text-pearl">{autodlPartner.promoCode}</b></span>
                          <button
                            type="button"
                            onClick={() => handleCopyPromo(autodlPartner.promoCode!, autodlPartner)}
                            className="text-gold hover:text-gold2 flex items-center gap-1"
                          >
                            {copiedPartnerId === autodlPartner.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>{isZh ? '已复制' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{isZh ? '复制' : 'Copy'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      <a
                        href={autodlPartner.affiliateUrl || autodlPartner.officialFallbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleAffiliateClick(autodlPartner)}
                        className="w-full py-2 px-3 border border-[rgba(201,168,106,0.35)] text-gold2 hover:bg-gold hover:text-ob hover:border-gold font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>{isZh ? '直通 AutoDL 开机' : 'Launch AutoDL'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* RunPod Global Card */}
                  <div className="bg-ob p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-semibold text-pearl">{runpodPartner.name}</span>
                        <span className="mono px-2 py-0.5 border border-[#44403C] text-gold flex-shrink-0">
                          {isZh ? runpodPartner.perkBadgeZh : runpodPartner.perkBadgeEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A8A29E] leading-relaxed mb-3">
                        {isZh ? '全球海外按秒计费，H100 / RTX 4090 裸金属即开即停。' : 'Global hyperscale GPU containers with spot pricing.'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-[#292524]">
                      {runpodPartner.promoCode && (
                        <div className="flex items-center justify-between bg-black/40 px-2.5 py-1.5 text-[11px] font-mono border border-[#292524]">
                          <span className="text-[#78716C]">{isZh ? '返利码:' : 'Code:'} <b className="text-pearl">{runpodPartner.promoCode}</b></span>
                          <button
                            type="button"
                            onClick={() => handleCopyPromo(runpodPartner.promoCode!, runpodPartner)}
                            className="text-gold hover:text-gold2 flex items-center gap-1"
                          >
                            {copiedPartnerId === runpodPartner.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>{isZh ? '已复制' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{isZh ? '复制' : 'Copy'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                      <a
                        href={runpodPartner.affiliateUrl || runpodPartner.officialFallbackUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleAffiliateClick(runpodPartner)}
                        className="w-full py-2 px-3 border border-[rgba(201,168,106,0.35)] text-gold2 hover:bg-gold hover:text-ob hover:border-gold font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>{isZh ? '前往 RunPod' : 'Visit RunPod'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* In-Article Sponsored Placement 2: Dev Tools (After Chapter IV) */}
            {idx === 4 && (
              <div className="my-12 panel-dark p-6 sm:p-8 no-print">
                <p className="eyebrow on-dark justify-center mb-4">
                  <i />
                  {isZh ? '开发者生态 · 智能体研发与极速推理工具' : 'Developer Ecosystem · AI IDEs & LPU Inference'}
                </p>
                <h4 className="text-lg sm:text-2xl font-serif font-medium text-pearl text-center mb-3">
                  {isZh ? '打造下一代自主 Agent：前沿研发工具直达' : 'Accelerate Your AI Engineering: Frontier Tools'}
                </h4>
                <p className="text-xs sm:text-sm text-[#A8A29E] max-w-2xl mx-auto text-center mb-8 leading-relaxed">
                  {isZh
                    ? '工欲善其事，必先利其器。精选主流的代码感知 IDE 与极速推理引擎，均为官网直达。'
                    : 'Frontier developer tooling: context-aware code editors and deterministic LPU inference chips.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#292524] border border-[#292524] max-w-2xl mx-auto">
                  {/* Cursor Card */}
                  <div className="bg-ob p-5 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-semibold text-pearl">{cursorPartner.name}</span>
                        <span className="mono px-2 py-0.5 border border-[#44403C] text-gold flex-shrink-0">
                          {isZh ? cursorPartner.perkBadgeZh : cursorPartner.perkBadgeEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A8A29E] leading-relaxed">
                        {isZh ? '全库语义索引与 Claude 3.5 智能改写，现代工程师必备的 AI IDE。' : 'Next-gen code editor with deep codebase indexing and contextual generation.'}
                      </p>
                    </div>

                    <a
                      href={cursorPartner.affiliateUrl || cursorPartner.officialFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleAffiliateClick(cursorPartner)}
                      className="w-full py-2 px-3 border border-[rgba(201,168,106,0.35)] text-gold2 hover:bg-gold hover:text-ob hover:border-gold font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>{isZh ? '免费体验 Cursor Pro' : 'Try Cursor Pro Free'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Groq Card */}
                  <div className="bg-ob p-5 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-semibold text-pearl">{groqPartner.name}</span>
                        <span className="mono px-2 py-0.5 border border-[#44403C] text-gold flex-shrink-0">
                          {isZh ? groqPartner.perkBadgeZh : groqPartner.perkBadgeEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A8A29E] leading-relaxed">
                        {isZh ? '500+ Tokens/秒硬件级极速 LPU，为智能体多步反思提供瞬间响应。' : '500+ Tokens/sec hardware LPU engine for deterministic low-latency agents.'}
                      </p>
                    </div>

                    <a
                      href={groqPartner.affiliateUrl || groqPartner.officialFallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleAffiliateClick(groqPartner)}
                      className="w-full py-2 px-3 border border-[rgba(201,168,106,0.35)] text-gold2 hover:bg-gold hover:text-ob hover:border-gold font-mono text-xs text-center flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>{isZh ? '获取免费极速 API Key' : 'Get Free Groq API Key'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Support note */}
                <div className="mt-5 pt-4 border-t border-[#292524] text-center">
                  <span className="mono text-[#57534E]">
                    {isZh ? '站点支持通道 · 广告与工具推荐帮助覆盖本站运维开销' : 'Support Channel · Ads and recommendations help cover hosting costs'}
                  </span>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}

          {/* Post-Monograph Academic Bundle & Patron Support Strip */}
          <div className="my-12 border-t-2 border-gold pt-8 no-print">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-xl">
                <p className="eyebrow on-dark">
                  <i />
                  {isZh ? '学术典藏离线包与创作者支持' : 'Academic Asset Pack & Patron Support'}
                </p>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-pearl leading-snug">
                  {isZh ? '《2026 AI 全景通史》离线长卷' : 'AI Chronicle Academic Bundle & Patron Support'}
                </h3>
                <p className="text-xs sm:text-sm text-[#A8A29E] leading-relaxed">
                  {isZh
                    ? '恭喜读完 1.8 万字全卷。本通史由独立极客潜心研创，您可以免费下载完整 Markdown 离线长卷（内嵌 BibTeX 引用附录与缩放定律公式附录），或为服务器与带宽开销添一杯咖啡。'
                    : 'Thank you for reading this 18,000-word canonical treatise. Download the complete offline Markdown treatise with embedded BibTeX citations and the scaling-law appendix, or tip a coffee toward hosting costs.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowBundleModal(true)}
                  className="btn-gold !py-2.5 !px-5 text-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>{isZh ? '免费下载离线长卷' : 'Download Free Treatise'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCoffeeModal(true)}
                  className="btn-ghost"
                >
                  <Coffee className="w-4 h-4" />
                  <span>{isZh ? '赞助打赏' : 'Tip Coffee'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSponsorModal(true)}
                  className="btn-ghost"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>{isZh ? '特约品牌合作' : 'B2B Partner'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mono text-[#78716C] pt-6 border-t border-[#292524] no-print">
            <span>{isZh ? '通史长卷完 · 截至 2026.09.13 定本' : 'End of Treatise · Canonical 2026.09.13'}</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#A8A29E] hover:text-gold2 flex items-center gap-1.5 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{isZh ? '回至卷首' : 'Back to Top'}</span>
            </button>
          </div>
        </main>
      </div>

      {/* BibTeX Citation Modal */}
      {showCiteModal && (
        <div
          className="modal-backdrop anim-fade no-print"
          onClick={() => setShowCiteModal(false)}
        >
          <div
            className="modal-panel max-w-lg p-6 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCiteModal(false)}
              className="absolute top-4 right-4 w-8 h-8 border border-[#44403C] flex items-center justify-center text-[#78716C] hover:text-gold2 hover:border-gold transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <p className="eyebrow on-dark mb-4">
              <i />
              ACADEMIC CITATION · BIBTEX
            </p>

            <h3 className="text-xl font-serif font-medium text-pearl mb-4">
              {isZh ? '引用本篇通史' : 'Cite This Treatise'}
            </h3>

            <pre className="p-4 bg-black/60 border border-[#292524] text-[11px] font-mono text-gold2/90 overflow-x-auto mb-5 select-all">
              {bibtexCitation}
            </pre>

            <div className="flex justify-between items-center gap-4">
              <span className="mono text-[#78716C]">
                {isZh ? '可直接粘贴至 LaTeX、Overleaf 或 Zotero' : 'Paste into LaTeX, Overleaf or Zotero'}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(bibtexCitation);
                  setCopiedCite(true);
                  setTimeout(() => setCopiedCite(false), 2000);
                }}
                className="btn-ghost flex-shrink-0"
              >
                {copiedCite ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-gold" />
                    <span>{isZh ? '已复制' : 'Copied'}</span>
                  </>
                ) : (
                  <span>{isZh ? '复制 BibTeX' : 'Copy BibTeX'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating TOC Quick-Jump Button */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden no-print">
        <button
          onClick={() => setShowMobileTOC(true)}
          className="bg-gold text-ob px-4 py-2.5 font-mono text-[11px] tracking-widest uppercase flex items-center gap-1.5 border border-gold hover:bg-gold2 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{Math.round(readProgress)}% {t.readerTOC}</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet TOC Drawer */}
      {showMobileTOC && (
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[rgba(12,10,9,0.9)] anim-fade no-print"
          onClick={() => setShowMobileTOC(false)}
        >
          <div
            className="w-full sm:max-w-md max-h-[80vh] overflow-y-auto bg-ob2 border-t sm:border border-[#44403C] p-6 text-pearl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#292524]">
              <span className="mono text-gold flex items-center">
                <BookOpen className="w-4 h-4 mr-2" />
                {t.readerTOC} ({Math.round(readProgress)}%)
              </span>
              <button
                onClick={() => setShowMobileTOC(false)}
                className="w-8 h-8 border border-[#44403C] flex items-center justify-center text-[#78716C] hover:text-gold2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              {ARTICLE_CHAPTERS.map((ch) => {
                const isActive = activeChapterId === ch.id;
                const chInfo = getChapterDisplay(ch);
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      scrollToChapter(ch.id);
                      setShowMobileTOC(false);
                    }}
                    className={`w-full text-left px-3 py-3 border-l-2 transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'border-gold text-gold2 bg-[rgba(201,168,106,0.06)]'
                        : 'border-transparent text-[#A8A29E] hover:text-pearl'
                    }`}
                  >
                    <span className="mono text-gold/80 flex-shrink-0 mt-0.5">
                      {chInfo.num}
                    </span>
                    <span className="text-xs line-clamp-1 leading-snug">{chInfo.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Monetization & Support Modals */}
      {showBundleModal && (
        <PremiumBundleModal onClose={() => setShowBundleModal(false)} />
      )}
      {showCoffeeModal && (
        <SponsorCoffeeModal onClose={() => setShowCoffeeModal(false)} />
      )}
      {showSponsorModal && (
        <SponsorCalculator onClose={() => setShowSponsorModal(false)} />
      )}
    </div>
  );
};
