import React, { useState, useEffect } from 'react';
import { ARTICLE_META, ARTICLE_CHAPTERS } from '../data/historyArticle';
import { BookOpen, Clock, Share2, Quote, ArrowUp, Check, X } from 'lucide-react';

interface ArticleReaderProps {
  onClose?: () => void;
}

export const ArticleReader: React.FC<ArticleReaderProps> = ({ onClose }) => {
  const [activeChapterId, setActiveChapterId] = useState<string>('chap-0');
  const [copiedQuote, setCopiedQuote] = useState<string | null>(null);
  const [readProgress, setReadProgress] = useState<number>(0);

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

  return (
    <div className="relative min-h-screen pt-24 pb-24 px-4 sm:px-8 max-w-6xl mx-auto">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Reader Header Pill */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/10 mb-10 shadow-2xl relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 rounded-full liquid-glass-pill flex items-center justify-center text-stone-400 hover:text-white"
            title="返回展台"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-mono text-amber-300">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
            学术通史精读长卷
          </span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400">{ARTICLE_META.version}</span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400 flex items-center">
            <Clock className="w-3 h-3 mr-1 text-amber-400" />
            {ARTICLE_META.readingTimeMinutes} 分钟
          </span>
          <span className="text-stone-500">·</span>
          <span className="text-stone-400">{ARTICLE_META.wordCountTotal}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-2">
          {ARTICLE_META.title}
        </h1>
        <p className="text-xs sm:text-sm font-mono text-amber-300/80 mb-6">
          {ARTICLE_META.subtitle}
        </p>

        <div className="p-4 rounded-2xl liquid-glass border border-white/5 text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
          <span className="text-amber-300 font-mono text-xs block mb-1">【史学立论与导言摘要】</span>
          {ARTICLE_META.abstract}
        </div>
      </div>

      {/* Grid Layout: TOC Sidebar + Academic Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sticky Chapter Navigator */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 liquid-glass p-4 rounded-3xl border border-white/10 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-stone-400">
            <span className="font-semibold text-stone-200 flex items-center">
              <BookOpen className="w-3.5 h-3.5 mr-1 text-amber-400" />
              章节目录
            </span>
            <span className="text-[10px] text-amber-300">{Math.round(readProgress)}%</span>
          </div>

          <nav className="space-y-1">
            {ARTICLE_CHAPTERS.map((chapter) => {
              const isActive = activeChapterId === chapter.id;
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
                    {chapter.chapterNumber}
                  </span>
                  <span className="line-clamp-1">{chapter.title.split('：')[0]}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Article Content */}
        <main className="lg:col-span-9 space-y-12">
          {ARTICLE_CHAPTERS.map((chapter) => (
            <article
              key={chapter.id}
              id={chapter.id}
              className="liquid-glass rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 scroll-mt-24 shadow-xl"
            >
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono text-amber-300 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
                    {chapter.chapterNumber}
                  </span>
                  <span className="text-stone-500">/</span>
                  <span className="text-stone-400">{chapter.timeSpan}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
                  {chapter.title}
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
          ))}

          <div className="flex justify-between items-center font-mono text-xs text-stone-400 pt-6">
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
    </div>
  );
};
