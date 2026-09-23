import React from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { ActiveTab } from './Navbar';
import {
  ALL_MILESTONES,
  findMilestoneBySlug,
  hrefForMilestone,
  hrefForTab,
} from '../utils/routes';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedEpoch, getLocalizedMilestone } from '../data/timelineTranslations';

interface MilestonePageProps {
  slug: string;
  onSelectMilestone: (slug: string) => void;
  onSelectTab: (tab: ActiveTab) => void;
}

/**
 * Standalone dossier page for one timeline milestone. Renders only data that
 * already lives in timelineData.ts — no new facts are invented here.
 * All internal links are real <a href> so crawlers can follow them; plain
 * left clicks stay client-side transitions.
 */
export const MilestonePage: React.FC<MilestonePageProps> = ({
  slug,
  onSelectMilestone,
  onSelectTab,
}) => {
  const { currentLang } = useLanguage();
  const isZh = currentLang === 'zh';

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    navigate: () => void
  ) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    navigate();
  };

  const found = findMilestoneBySlug(slug);

  if (!found) {
    return (
      <div className="relative min-h-screen pt-24 sm:pt-32 pb-24 px-3 sm:px-8 max-w-3xl mx-auto">
        <div className="liquid-glass rounded-2xl sm:rounded-3xl border border-white/10 p-8 sm:p-12 text-center">
          <h1 className="font-serif text-xl sm:text-2xl font-semibold text-stone-100 mb-3">
            {isZh ? '里程碑档案不存在' : 'Milestone dossier not found'}
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-500 mb-8 break-all">
            /milestone/{slug}/
          </p>
          <a
            href={hrefForTab('stage')}
            onClick={(e) => handleLinkClick(e, () => onSelectTab('stage'))}
            className="liquid-glass-pill inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-mono text-amber-300 border border-amber-400/25 hover:text-amber-100 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>{isZh ? '返回编年史首页' : 'Back to the Chronicle'}</span>
          </a>
        </div>
      </div>
    );
  }

  const { ref, index } = found;
  const epoch = getLocalizedEpoch(ref.epoch, currentLang);
  const m = getLocalizedMilestone(ref.milestone, currentLang);
  const prev = index > 0 ? getLocalizedMilestone(ALL_MILESTONES[index - 1].milestone, currentLang) : null;
  const next =
    index < ALL_MILESTONES.length - 1
      ? getLocalizedMilestone(ALL_MILESTONES[index + 1].milestone, currentLang)
      : null;
  const siblings = epoch.milestones.filter((s) => s.id !== m.id);

  return (
    <div className="relative min-h-screen pt-20 sm:pt-24 pb-24 px-3 sm:px-8 max-w-4xl mx-auto">
      {/* Breadcrumb: Home > Epoch > Milestone */}
      <nav
        aria-label={isZh ? '面包屑导航' : 'Breadcrumb'}
        className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-mono text-stone-500 mb-5 sm:mb-8"
      >
        <a
          href={hrefForTab('stage')}
          onClick={(e) => handleLinkClick(e, () => onSelectTab('stage'))}
          className="hover:text-amber-300 transition-colors"
        >
          {isZh ? '首页' : 'Chronicle'}
        </a>
        <ChevronRight className="w-3 h-3 text-stone-600 flex-shrink-0" />
        <span className="text-stone-400">
          {epoch.romanId} · {epoch.title}
        </span>
        <ChevronRight className="w-3 h-3 text-stone-600 flex-shrink-0" />
        <span className="text-amber-300/90">{m.title}</span>
      </nav>

      <article className="liquid-glass rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-10 space-y-7 sm:space-y-8">
        {/* Dossier header */}
        <header>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono mb-4">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-300 font-bold">
              {m.year}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-400">
              {m.category}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-stone-400">
              {m.paradigm}
            </span>
            <span className="text-stone-600">{epoch.era}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-stone-100 tracking-tight leading-snug mb-3">
            {m.title}
          </h1>
          <p className="text-sm sm:text-base text-amber-200/80 font-serif italic leading-relaxed">
            {m.subtitle}
          </p>
        </header>

        {/* Summary + full narrative — verbatim from timelineData.ts */}
        <div className="space-y-4 border-t border-white/5 pt-6">
          <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed text-justify">
            {m.summary}
          </p>
          <p className="text-xs sm:text-sm text-stone-300/80 font-light leading-relaxed text-justify">
            {m.fullNarrative}
          </p>
        </div>

        {/* Fact sheet */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/5 pt-6">
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5">
            <dt className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">
              {isZh ? '关键人物' : 'Key Figures'}
            </dt>
            <dd className="text-xs sm:text-sm text-stone-200 leading-relaxed">
              {m.keyFigures.join(isZh ? '、' : ', ')}
            </dd>
          </div>
          {m.landmarkPaperOrArtifact && (
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5">
              <dt className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">
                {isZh ? '标志性文献 / 器物' : 'Landmark Paper / Artifact'}
              </dt>
              <dd className="text-xs sm:text-sm font-mono text-stone-200 leading-relaxed break-words">
                {m.landmarkPaperOrArtifact}
              </dd>
            </div>
          )}
          {m.computeCostEstimate && (
            <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5">
              <dt className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">
                {isZh ? '算力代价' : 'Compute Cost'}
              </dt>
              <dd className="text-xs sm:text-sm font-mono text-amber-200/90 leading-relaxed">
                {m.computeCostEstimate}
              </dd>
            </div>
          )}
        </dl>

        {/* Historical impact callout */}
        <div className="relative rounded-2xl liquid-glass border-l-4 border-amber-400 p-4 sm:p-5">
          <Quote className="w-4 h-4 text-amber-400/40 absolute top-4 right-4" />
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-amber-300/80 mb-2">
            {isZh ? '历史影响' : 'Historical Impact'}
          </h2>
          <p className="text-xs sm:text-sm font-serif italic text-stone-300 leading-relaxed pr-6">
            {m.historicalImpact}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {m.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-stone-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Sibling milestones in the same epoch */}
      {siblings.length > 0 && (
        <section className="mt-8 sm:mt-10 liquid-glass rounded-2xl border border-white/10 p-5 sm:p-7">
          <h2 className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-4">
            {isZh
              ? `同纪元里程碑 · ${epoch.romanId}（${epoch.era}）`
              : `Same epoch · ${epoch.romanId} (${epoch.era})`}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {siblings.map((s) => (
              <li key={s.id}>
                <a
                  href={hrefForMilestone(s.slug)}
                  onClick={(e) => handleLinkClick(e, () => onSelectMilestone(s.slug))}
                  className="group flex items-baseline gap-2 py-1 text-xs sm:text-sm text-stone-300 hover:text-amber-200 transition-colors"
                >
                  <span className="font-mono text-amber-400/80 flex-shrink-0">{s.year}</span>
                  <span className="group-hover:underline underline-offset-4 decoration-amber-400/40 leading-snug">
                    {s.title}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prev / next chronological navigation */}
      <nav
        aria-label={isZh ? '里程碑前后导航' : 'Milestone navigation'}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 sm:mt-8"
      >
        {prev ? (
          <a
            href={hrefForMilestone(prev.slug)}
            onClick={(e) => handleLinkClick(e, () => onSelectMilestone(prev.slug))}
            className="group liquid-glass rounded-2xl border border-white/10 hover:border-amber-400/30 p-4 transition-colors"
          >
            <span className="flex items-center text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              {isZh ? '上一里程碑' : 'Previous'}
            </span>
            <span className="text-xs sm:text-sm font-serif text-stone-200 group-hover:text-amber-200 transition-colors leading-snug">
              {prev.year} · {prev.title}
            </span>
          </a>
        ) : (
          <span className="hidden sm:block" />
        )}
        {next ? (
          <a
            href={hrefForMilestone(next.slug)}
            onClick={(e) => handleLinkClick(e, () => onSelectMilestone(next.slug))}
            className="group liquid-glass rounded-2xl border border-white/10 hover:border-amber-400/30 p-4 transition-colors sm:text-right"
          >
            <span className="flex items-center sm:justify-end text-[10px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">
              {isZh ? '下一里程碑' : 'Next'}
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </span>
            <span className="text-xs sm:text-sm font-serif text-stone-200 group-hover:text-amber-200 transition-colors leading-snug">
              {next.year} · {next.title}
            </span>
          </a>
        ) : (
          <span className="hidden sm:block" />
        )}
      </nav>

      {/* Back to the full treatise */}
      <div className="mt-8 sm:mt-10 flex justify-center">
        <a
          href={hrefForTab('reader')}
          onClick={(e) => handleLinkClick(e, () => onSelectTab('reader'))}
          className="liquid-glass-pill inline-flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-mono text-amber-300 border border-amber-400/25 hover:text-amber-100 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isZh ? '阅读完整 1.8 万字长卷 →' : 'Read the full 18,000-word treatise →'}</span>
        </a>
      </div>
    </div>
  );
};
