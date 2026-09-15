import React, { useState, useEffect } from 'react';
import { ARTICLE_META, ARTICLE_CHAPTERS } from '../data/historyArticle';
import { BookOpen, Clock, Share2, Quote, ArrowUp, Check, X, Printer, Mail, FileText, Sparkles } from 'lucide-react';
import { saveLead } from '../utils/leadStorage';
import { useLanguage } from '../i18n/LanguageContext';

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
  const [showSubscribeModal, setShowSubscribeModal] = useState<boolean>(false);
  const [showMobileTOC, setShowMobileTOC] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [copiedCite, setCopiedCite] = useState<boolean>(false);

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
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-24 px-3 sm:px-8 max-w-6xl mx-auto">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50 no-print">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Reader Header Pill */}
      <div className="liquid-glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 mb-8 sm:mb-10 shadow-2xl relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white no-print"
            title={isZh ? '返回展台' : 'Back to Stage'}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono text-amber-300">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
            {t.readerBadge}
          </span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400">{ARTICLE_META.version}</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400 flex items-center">
            <Clock className="w-3 h-3 mr-1 text-amber-400" />
            {ARTICLE_META.readingTimeMinutes} {t.readerReadingTime}
          </span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400">{ARTICLE_META.wordCountTotal}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2 leading-snug">
          {metaTitle}
        </h1>
        <p className="text-xs sm:text-sm font-mono text-amber-300/80 mb-5">
          {metaSubtitle}
        </p>

        <div className="p-3.5 sm:p-4 rounded-2xl liquid-glass border border-white/5 text-stone-300 text-xs sm:text-sm leading-relaxed font-light mb-6">
          <span className="text-amber-300 font-mono text-xs block mb-1">{abstractLabel}</span>
          {metaAbstract}
        </div>

        {/* Academic Utility Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 no-print">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.print()}
              className="liquid-glass-amber px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-mono text-amber-200 hover:text-white flex items-center space-x-1.5 transition-all shadow-sm"
              title="Print / Save as Academic PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.readerExportPDF}</span>
            </button>

            <button
              onClick={() => setShowCiteModal(true)}
              className="liquid-glass-pill px-3 py-1.5 rounded-full text-xs font-mono text-stone-300 hover:text-white flex items-center space-x-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.readerCiteBibtex}</span>
            </button>
          </div>

          <button
            onClick={() => setShowSubscribeModal(true)}
            className="liquid-glass-pill px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-mono text-amber-300 hover:text-white flex items-center space-x-1.5 transition-all border border-amber-400/20"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.readerSubscribeNewsletter}</span>
          </button>
        </div>
      </div>

      {/* Grid Layout: TOC Sidebar + Academic Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Chapter Navigator */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 liquid-glass p-4 rounded-3xl border border-white/10 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-stone-400">
            <span className="font-semibold text-stone-200 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-400" />
              {t.readerTOC}
            </span>
            <span className="text-[10px] text-amber-300">{Math.round(readProgress)}%</span>
          </div>

          <nav className="space-y-1">
            {ARTICLE_CHAPTERS.map((chapter) => {
              const isActive = activeChapterId === chapter.id;
              const chInfo = getChapterDisplay(chapter);
              return (
                <button
                  key={chapter.id}
                  onClick={() => scrollToChapter(chapter.id)}
                  className={`w-full text-left p-2 rounded-xl transition-all flex items-start space-x-2 ${
                    isActive
                      ? 'liquid-glass-amber text-amber-200 font-semibold'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'
                  }`}
                >
                  <span className="text-[10px] text-stone-500 flex-shrink-0 mt-0.5">
                    {chInfo.num}
                  </span>
                  <span className="line-clamp-1">{chInfo.title.split('：')[0]}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Article Content */}
        <main className="lg:col-span-9 space-y-12">
          {ARTICLE_CHAPTERS.map((chapter, idx) => {
            const chInfo = getChapterDisplay(chapter);
            return (
              <React.Fragment key={chapter.id}>
                <article
                  id={chapter.id}
                  className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 scroll-mt-24 shadow-xl"
                >
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
                      {chInfo.num}
                    </span>
                    <span className="text-stone-500">/</span>
                    <span className="text-stone-400">{chapter.timeSpan}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
                    {chInfo.title}
                  </h2>

                {/* Lead Epigraph Quote */}
                <div className="relative my-4 p-4 rounded-2xl liquid-glass border-l-4 border-amber-400 text-stone-300 font-serif italic text-sm">
                  <Quote className="w-4 h-4 text-amber-400/40 absolute top-3 right-3" />
                  <p className="mb-2">&ldquo;{chapter.leadQuote.text}&rdquo;</p>
                  <div className="flex items-center justify-between text-xs font-mono text-stone-400 not-italic">
                    <span>—— {chapter.leadQuote.attribution}</span>
                    <button
                      onClick={() => handleCopyQuote(chapter.leadQuote.text)}
                      className="hover:text-amber-300 transition-colors flex items-center space-x-1"
                    >
                      {copiedQuote === chapter.leadQuote.text ? (
                        <>
                          <Check className="w-3 h-3 text-amber-400" />
                          <span className="text-amber-400 text-[10px]">已复制</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          <span className="text-[10px]">引用</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-stone-300/90 font-light leading-relaxed text-sm sm:text-base text-justify">
                  {chapter.introParagraph}
                </p>
              </div>

              {/* Chapter Sections */}
              <div className="space-y-6 pt-4 border-t border-white/5">
                {chapter.sections.map((section, sIdx) => (
                  <section key={sIdx} className="space-y-3">
                    <h3 className="text-base sm:text-lg font-serif font-semibold text-white flex items-center">
                      <span className="w-1.5 h-3.5 bg-amber-400 mr-2 rounded-full" />
                      {section.subtitle}
                    </h3>

                    {section.content.map((p, pIdx) => (
                      <p key={pIdx} className="text-stone-300/90 text-xs sm:text-sm font-light leading-relaxed text-justify">
                        {p}
                      </p>
                    ))}

                    {section.highlightInsight && (
                      <div className="p-3.5 rounded-2xl liquid-glass border border-amber-400/25 bg-amber-500/[0.03]">
                        <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1">
                          ✦ 核心史学洞见
                        </div>
                        <div className="text-xs text-stone-200 font-serif leading-relaxed">
                          {section.highlightInsight}
                        </div>
                      </div>
                    )}
                  </section>
                ))}
              </div>
            </article>

            {/* High-Converting In-Article Sponsored Placement */}
            {idx === 2 && (
              <div className="my-8 p-6 rounded-3xl liquid-glass border border-amber-400/30 bg-gradient-to-r from-amber-500/[0.05] via-transparent to-amber-500/[0.03] text-center no-print shadow-xl relative glass-sheen">
                <div className="flex items-center justify-center space-x-2 text-xs font-mono text-amber-400 mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SPONSORED ACCELERATION · 算力与工程特约合作</span>
                </div>
                <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-2">
                  深度学习算力受限？体验按秒计费的 H100 / RTX 4090 GPU 集群
                </h4>
                <p className="text-xs text-stone-300 font-light max-w-xl mx-auto mb-4 leading-relaxed">
                  通过本通史专属通道开启前沿模型微调与大并发推理，秒级部署 PyTorch 与 vLLM 环境，免费领取开发者算力礼包。
                </p>
                <div className="flex justify-center items-center gap-3">
                  <a
                    href="https://runpod.io/?ref=ai-chronicle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass-amber px-5 py-2 rounded-full text-xs font-mono font-medium text-amber-200 hover:text-white inline-flex items-center space-x-1.5 transition-all shadow-md"
                  >
                    <span>领取 $10 专属算力体验金 →</span>
                  </a>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}

          <div className="flex justify-between items-center font-mono text-xs text-stone-400 pt-6 no-print">
            <span>通史长卷完 · 截至 2026.09.13 定本</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="liquid-glass-pill px-4 py-2 rounded-full text-stone-300 hover:text-white flex items-center space-x-1"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>回至卷首</span>
            </button>
          </div>
        </main>
      </div>

      {/* BibTeX Citation Modal */}
      {showCiteModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200 no-print"
          onClick={() => setShowCiteModal(false)}
        >
          <div 
            className="relative w-full max-w-lg liquid-glass-strong rounded-3xl p-6 text-stone-100 shadow-2xl border border-amber-400/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCiteModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>ACADEMIC CITATION · BIBTEX</span>
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-3">
              引用本篇通史
            </h3>

            <pre className="p-4 rounded-2xl bg-black/60 border border-white/10 text-[11px] font-mono text-amber-200/90 overflow-x-auto mb-4 select-all">
              {bibtexCitation}
            </pre>

            <div className="flex justify-between items-center">
              <span className="text-[11px] font-mono text-stone-400">
                可直接粘贴至 LaTeX、Overleaf 或 Zotero
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(bibtexCitation);
                  setCopiedCite(true);
                  setTimeout(() => setCopiedCite(false), 2000);
                }}
                className="liquid-glass-amber px-4 py-1.5 rounded-full text-xs font-mono text-amber-200 hover:text-white transition-all flex items-center space-x-1"
              >
                {copiedCite ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>已复制 BibTeX</span>
                  </>
                ) : (
                  <>
                    <span>复制 BibTeX</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Subscription Modal */}
      {showSubscribeModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200 no-print"
          onClick={() => setShowSubscribeModal(false)}
        >
          <div 
            className="relative w-full max-w-md liquid-glass-strong rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl border border-amber-400/40"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
              <Mail className="w-3.5 h-3.5" />
              <span>AI CHRONICLE DISPATCH</span>
            </div>

            <h3 className="text-xl font-serif font-bold text-white mb-2">
              订阅《2026-2030 AGI 演进内参》
            </h3>
            <p className="text-xs text-stone-300 font-light mb-5 leading-relaxed">
              每周五推送全球顶级实验室（OpenAI、Anthropic、Google DeepMind）最新测试时算力论文解读、新模型权重发布与量化技术动态。零垃圾邮件。
            </p>

            {subscribed ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                <div className="text-emerald-400 text-sm font-bold mb-1">
                  {isZh ? '🎉 订阅成功！' : '🎉 Subscribed Successfully!'}
                </div>
                <div className="text-xs text-stone-300">
                  {isZh ? '首期《2026 测试时算力白皮书》已发送至您的收件箱。' : 'The latest 2026-2030 AGI research brief has been dispatched to your inbox.'}
                </div>
              </div>
            ) : (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) {
                    saveLead(email, 'newsletter', currentLang);
                    setSubscribed(true);
                  }
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  required
                  placeholder={t.newsletterInputPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-black/50 border border-white/10 text-stone-100 text-xs font-mono focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl liquid-glass-amber text-xs font-mono font-bold text-amber-200 hover:text-white transition-all shadow-md"
                >
                  {t.newsletterSubmitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Mobile Floating TOC Quick-Jump Button */}
      <div className="fixed bottom-20 right-4 z-40 lg:hidden no-print">
        <button
          onClick={() => setShowMobileTOC(true)}
          className="liquid-glass-amber px-3.5 py-2 rounded-full text-xs font-mono text-amber-200 shadow-xl flex items-center space-x-1.5 backdrop-blur-xl border border-amber-400/40 hover:scale-105 transition-transform"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{Math.round(readProgress)}% {t.readerTOC}</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet TOC Drawer */}
      {showMobileTOC && (
        <div 
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-in fade-in duration-200 no-print"
          onClick={() => setShowMobileTOC(false)}
        >
          <div 
            className="w-full sm:max-w-md max-h-[80vh] overflow-y-auto liquid-glass-strong rounded-t-3xl sm:rounded-3xl p-6 text-stone-100 shadow-2xl border border-amber-400/40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <span className="font-serif font-bold text-white flex items-center text-sm">
                <BookOpen className="w-4 h-4 mr-2 text-amber-400" />
                {t.readerTOC} ({Math.round(readProgress)}%)
              </span>
              <button
                onClick={() => setShowMobileTOC(false)}
                className="w-7 h-7 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
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
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-start space-x-2.5 ${
                      isActive
                        ? 'liquid-glass-amber text-amber-200 font-semibold'
                        : 'liquid-glass text-stone-300 hover:text-white'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-amber-400/80 flex-shrink-0 mt-0.5">
                      {chInfo.num}
                    </span>
                    <span className="text-xs line-clamp-1">{chInfo.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


