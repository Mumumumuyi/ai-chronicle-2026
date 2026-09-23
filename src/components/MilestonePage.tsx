import React from 'react';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ActiveTab } from './Navbar';
import {
  ALL_MILESTONES,
  findMilestoneBySlug,
  hrefForMilestone,
  hrefForTab,
} from '../utils/routes';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedEpoch, getLocalizedMilestone } from '../data/timelineTranslations';
import { EPOCHS } from '../data/timelineData';
import { EpochSpecimen } from './EpochSpecimen';
import { useScrollReveal } from '../hooks/useScrollReveal';

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
  const revealRef = useScrollReveal<HTMLDivElement>([slug, currentLang]);

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
      <div className="relative min-h-screen bg-ob pt-28 sm:pt-32 pb-24 px-5 sm:px-8">
        <div className="max-w-xl mx-auto panel-dark p-8 sm:p-12 text-center">
          <p className="eyebrow on-dark justify-center mb-6">
            <i />
            {isZh ? '档案遗失' : 'Dossier Missing'}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-pearl mb-3">
            {isZh ? '里程碑档案不存在' : 'Milestone dossier not found'}
          </h1>
          <p className="text-xs font-mono text-[#78716C] mb-8 break-all">
            /milestone/{slug}/
          </p>
          <a
            href={hrefForTab('stage')}
            onClick={(e) => handleLinkClick(e, () => onSelectTab('stage'))}
            className="btn-ghost"
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
  const epochIndex = Math.max(0, EPOCHS.findIndex((e) => e.id === ref.epoch.id));
  const m = getLocalizedMilestone(ref.milestone, currentLang);
  const prev = index > 0 ? getLocalizedMilestone(ALL_MILESTONES[index - 1].milestone, currentLang) : null;
  const next =
    index < ALL_MILESTONES.length - 1
      ? getLocalizedMilestone(ALL_MILESTONES[index + 1].milestone, currentLang)
      : null;
  const siblings = epoch.milestones.filter((s) => s.id !== m.id);

  return (
    <div ref={revealRef} className="relative min-h-screen bg-ob pb-24">
      {/* Era specimen band — the epoch's line drawing on obsidian */}
      <div className="border-b border-[#292524] bg-ob2 pt-14">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-8 items-center">
          <div>
            {/* Breadcrumb: Home > Epoch > Milestone */}
            <nav
              aria-label={isZh ? '面包屑导航' : 'Breadcrumb'}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 mono text-[#78716C] mb-8"
            >
              <a
                href={hrefForTab('stage')}
                onClick={(e) => handleLinkClick(e, () => onSelectTab('stage'))}
                className="hover:text-gold2 transition-colors"
              >
                {isZh ? '编年史' : 'Chronicle'}
              </a>
              <span className="text-[#44403C]">/</span>
              <span className="text-[#A8A29E]">
                EPOCH {epoch.romanId}
              </span>
              <span className="text-[#44403C]">/</span>
              <span className="text-gold truncate max-w-[200px] sm:max-w-none">{m.title}</span>
            </nav>

            <p className="eyebrow on-dark rv">
              <i />
              {isZh
                ? `时代 ${epoch.romanId} · ${epoch.era}`
                : `Epoch ${epoch.romanId} · ${epoch.era}`}
            </p>

            {/* Giant Cormorant year */}
            <div className="rv mt-6 font-display font-medium text-[88px] sm:text-[120px] leading-none text-pearl" style={{ '--d': '100ms' } as React.CSSProperties}>
              {m.year}
            </div>
          </div>

          <div className="rv hidden sm:flex flex-col items-center gap-3" style={{ '--d': '200ms' } as React.CSSProperties}>
            <div className="w-[180px] h-[180px] grid place-items-center">
              <EpochSpecimen index={epochIndex} className="w-full h-full" />
            </div>
            <span className="mono text-[#57534E]">SPECIMEN · {epoch.romanId}</span>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
        {/* Dossier header */}
        <header className="rv">
          <div className="flex flex-wrap items-center gap-2.5 mono mb-5">
            <span className="px-3 py-1 border border-[rgba(201,168,106,0.4)] text-gold">
              {m.category}
            </span>
            <span className="px-3 py-1 border border-[#44403C] text-[#A8A29E]">
              {m.paradigm}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-pearl tracking-[-0.01em] leading-[1.2] mb-4">
            {m.title}
          </h1>
          <p className="text-base sm:text-lg text-gold2/90 font-serif leading-relaxed">
            {m.subtitle}
          </p>
        </header>

        {/* Summary + full narrative — verbatim from timelineData.ts */}
        <div className="rv space-y-5 border-t border-[#292524] mt-10 pt-8">
          <p className="text-base sm:text-lg font-serif text-pearl/90 leading-[1.9]">
            {m.summary}
          </p>
          <p className="text-sm sm:text-base text-[#A8A29E] leading-[1.9]">
            {m.fullNarrative}
          </p>
        </div>

        {/* Fact sheet — hairline editorial table */}
        <dl className="rv mt-10 border-t border-[#292524]">
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 py-4 border-b border-[#292524]">
            <dt className="mono text-[#78716C] pt-0.5">
              {isZh ? '关键人物' : 'Key Figures'}
            </dt>
            <dd className="text-sm sm:text-base font-serif text-pearl leading-relaxed">
              {m.keyFigures.join(isZh ? '、' : ', ')}
            </dd>
          </div>
          {m.landmarkPaperOrArtifact && (
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 py-4 border-b border-[#292524]">
              <dt className="mono text-[#78716C] pt-0.5">
                {isZh ? '标志性文献 / 器物' : 'Landmark Paper / Artifact'}
              </dt>
              <dd className="text-xs sm:text-sm font-mono text-[#D6D3D1] leading-relaxed break-words">
                {m.landmarkPaperOrArtifact}
              </dd>
            </div>
          )}
          {m.computeCostEstimate && (
            <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-6 py-4 border-b border-[#292524]">
              <dt className="mono text-[#78716C] pt-0.5">
                {isZh ? '算力代价' : 'Compute Cost'}
              </dt>
              <dd className="text-xs sm:text-sm font-mono text-gold2 leading-relaxed">
                {m.computeCostEstimate}
              </dd>
            </div>
          )}
        </dl>

        {/* Historical impact — gold left rule, serif voice */}
        <div className="rv mt-10 border-l-2 border-gold pl-5 sm:pl-7 py-1">
          <h2 className="mono text-gold mb-3">
            {isZh ? '历史影响' : 'Historical Impact'}
          </h2>
          <p className="text-base sm:text-lg font-serif text-[#D6D3D1] leading-[1.9]">
            {m.historicalImpact}
          </p>
        </div>

        {/* Tags */}
        <div className="rv flex flex-wrap gap-2 mt-10">
          {m.tags.map((tag) => (
            <span key={tag} className="pill-dark !normal-case !tracking-normal text-[11px]">
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Sibling milestones in the same epoch */}
      {siblings.length > 0 && (
        <section className="rv max-w-4xl mx-auto px-5 sm:px-8 mt-14">
          <h2 className="eyebrow on-dark mb-6">
            <i />
            {isZh
              ? `同纪元藏品 · EPOCH ${epoch.romanId}（${epoch.era}）`
              : `Same Epoch · ${epoch.romanId} (${epoch.era})`}
          </h2>
          <ul className="border-t border-[#292524]">
            {siblings.map((s) => (
              <li key={s.id} className="border-b border-[#292524]">
                <a
                  href={hrefForMilestone(s.slug)}
                  onClick={(e) => handleLinkClick(e, () => onSelectMilestone(s.slug))}
                  className="group flex items-baseline gap-4 py-3.5 text-[#A8A29E] hover:text-gold2 transition-colors"
                >
                  <span className="font-mono text-xs text-gold flex-shrink-0 w-12">{s.year}</span>
                  <span className="font-serif text-base sm:text-lg leading-snug group-hover:translate-x-1 transition-transform duration-300">
                    {s.title}
                  </span>
                  <span className="ml-auto text-gold opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Prev / next chronological navigation */}
      <nav
        aria-label={isZh ? '里程碑前后导航' : 'Milestone navigation'}
        className="rv max-w-4xl mx-auto px-5 sm:px-8 mt-12 grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#292524] border border-[#292524]"
      >
        {prev ? (
          <a
            href={hrefForMilestone(prev.slug)}
            onClick={(e) => handleLinkClick(e, () => onSelectMilestone(prev.slug))}
            className="group bg-ob p-5 sm:p-6 transition-colors hover:bg-ob2"
          >
            <span className="flex items-center mono text-[#78716C] mb-2">
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              {isZh ? '上一件藏品' : 'Previous Exhibit'}
            </span>
            <span className="font-serif text-base sm:text-lg text-[#D6D3D1] group-hover:text-gold2 transition-colors leading-snug">
              {prev.year} · {prev.title}
            </span>
          </a>
        ) : (
          <span className="hidden sm:block bg-ob" />
        )}
        {next ? (
          <a
            href={hrefForMilestone(next.slug)}
            onClick={(e) => handleLinkClick(e, () => onSelectMilestone(next.slug))}
            className="group bg-ob p-5 sm:p-6 transition-colors hover:bg-ob2 sm:text-right"
          >
            <span className="flex items-center sm:justify-end mono text-[#78716C] mb-2">
              {isZh ? '下一件藏品' : 'Next Exhibit'}
              <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </span>
            <span className="font-serif text-base sm:text-lg text-[#D6D3D1] group-hover:text-gold2 transition-colors leading-snug">
              {next.year} · {next.title}
            </span>
          </a>
        ) : (
          <span className="hidden sm:block bg-ob" />
        )}
      </nav>

      {/* Back to the full treatise */}
      <div className="mt-12 flex justify-center px-5">
        <a
          href={hrefForTab('reader')}
          onClick={(e) => handleLinkClick(e, () => onSelectTab('reader'))}
          className="btn-ghost"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{isZh ? '阅读完整 1.8 万字长卷' : 'Read the full 18,000-word treatise'}</span>
        </a>
      </div>
    </div>
  );
};
