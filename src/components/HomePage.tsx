import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { EPOCHS } from '../data/timelineData';
import { getLocalizedEpoch, getLocalizedMilestone } from '../data/timelineTranslations';
import { ALL_MILESTONES, hrefForMilestone, hrefForTab } from '../utils/routes';
import { ARTICLE_META } from '../data/historyArticle';
import { getOwnerContact } from '../utils/monetizationConfig';
import { EpochSpecimen } from './EpochSpecimen';
import type { ActiveTab } from './Navbar';
import type { MilestoneCategory } from '../types';

// ---------------------------------------------------------------------------
// Data helpers (all numbers computed from timelineData, nothing hardcoded)
// ---------------------------------------------------------------------------

const YEAR_MIN = 1943;
const YEAR_MAX = 2026.75;

const yearNum = (y: string | number) => parseFloat(String(y));

export const CATEGORY_LABEL: Record<MilestoneCategory, { zh: string; en: string }> = {
  theory: { zh: '理论', en: 'Theory' },
  algorithm: { zh: '算法', en: 'Algorithm' },
  compute: { zh: '算力', en: 'Compute' },
  industry: { zh: '产业', en: 'Industry' },
  geopolitics: { zh: '地缘', en: 'Geopolitics' },
  breakthrough: { zh: '突破', en: 'Breakthrough' },
  debate: { zh: '论战', en: 'Debate' },
};

/** Geometric logotype pieces: "A", "I", then a timeline bar with one tick per milestone. */
function useLogotype() {
  return useMemo(() => {
    const aPolys = [
      '0,100 70,0 90,0 20,100',
      '70,0 90,0 160,100 140,100',
      '42,62 118,62 124,74 36,74',
    ];
    const iPolys = ['0,0 16,0 16,100 0,100'];
    const barPolys = ['250,90 840,90 840,100 250,100'];
    ALL_MILESTONES.forEach((r) => {
      const x = 250 + ((yearNum(r.milestone.year) - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * 586;
      const h = r.milestone.category === 'breakthrough' ? 62 : r.milestone.category === 'theory' ? 44 : 30;
      barPolys.push(
        `${x.toFixed(1)},${90 - h} ${(x + 3).toFixed(1)},${90 - h} ${(x + 3).toFixed(1)},90 ${x.toFixed(1)},90`
      );
    });
    let i = 0;
    const stamp = (points: string) => ({ points, i: i++ });
    return {
      a: aPolys.map(stamp),
      i: iPolys.map(stamp),
      bar: barPolys.map(stamp),
    };
  }, []);
}

interface HomePageProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenMilestonePage: (slug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenMilestonePage }) => {
  const { t, currentLang } = useLanguage();
  const isZh = currentLang === 'zh';
  const reduced = usePrefersReducedMotion();
  const reducedRef = useRef(reduced);
  useEffect(() => {
    reducedRef.current = reduced;
  }, [reduced]);

  const milestones = useMemo(
    () => ALL_MILESTONES.map((r) => getLocalizedMilestone(r.milestone, currentLang)),
    [currentLang]
  );
  const epochs = useMemo(() => EPOCHS.map((e) => getLocalizedEpoch(e, currentLang)), [currentLang]);
  const total = ALL_MILESTONES.length;
  const span = useMemo(() => {
    const years = ALL_MILESTONES.map((r) => yearNum(r.milestone.year));
    return Math.ceil(Math.max(...years)) - Math.min(...years);
  }, []);
  const wordCount = useMemo(
    () => parseInt(ARTICLE_META.wordCountTotal.replace(/\D/g, ''), 10) || 0,
    []
  );
  const categories = useMemo<MilestoneCategory[]>(
    () => [...new Set(ALL_MILESTONES.map((r) => r.milestone.category))],
    []
  );

  const [filter, setFilter] = useState<string>('all');
  const revealRef = useScrollReveal<HTMLDivElement>([filter, currentLang]);

  // -------------------------------------------------------------------------
  // 01 · Hero — delayed neural-network canvas backdrop
  // -------------------------------------------------------------------------
  const netRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = netRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let P: { x: number; y: number; vx: number; vy: number }[] = [];
    let raf = 0;
    const dpr = () => window.devicePixelRatio || 1;

    const resize = () => {
      W = c.width = c.offsetWidth * dpr();
      H = c.height = c.offsetHeight * dpr();
      P = Array.from({ length: 70 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      const D = 150 * dpr();
      for (const p of P) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      for (let i = 0; i < P.length; i++) {
        for (let j = i + 1; j < P.length; j++) {
          const a = P[i];
          const b = P[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < D) {
            ctx.strokeStyle = `rgba(201,168,106,${0.22 * (1 - d / D)})`;
            ctx.lineWidth = dpr();
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of P) {
        ctx.fillStyle = 'rgba(227,200,146,.5)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4 * dpr(), 0, 7);
        ctx.fill();
      }
      if (!reducedRef.current) raf = requestAnimationFrame(frame);
    };

    const timer = window.setTimeout(() => {
      c.classList.add('show');
      frame();
    }, 2800);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  const logo = useLogotype();
  const current = useMemo(
    () =>
      milestones.find((m) => m.slug === 'attention-is-all-you-need') ||
      milestones.find((m) => m.category === 'breakthrough') ||
      milestones[milestones.length - 1],
    [milestones]
  );
  const currentEpoch = useMemo(
    () => (current ? epochs.find((e) => e.id === current.epochId) : undefined),
    [current, epochs]
  );

  // -------------------------------------------------------------------------
  // 03 · Epoch browser — auto-cycle + sand-dissolve specimen transition
  // -------------------------------------------------------------------------
  const [epochIdx, setEpochIdx] = useState(2);
  const [shownIdx, setShownIdx] = useState(2);
  const curRef = useRef(2);
  const busyRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const visibleRef = useRef(false);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const specWrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const sand = (from: number, to: number, dur: number) =>
    new Promise<void>((resolve) => {
      const disp = dispRef.current;
      const wrap = specWrapRef.current;
      if (!disp || !wrap) {
        resolve();
        return;
      }
      const t0 = performance.now();
      const step = (n: number) => {
        const p = Math.min(1, (n - t0) / dur);
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        disp.setAttribute('scale', String(from + (to - from) * e));
        wrap.style.opacity = String(to > from ? 1 - e : e);
        if (p < 1) requestAnimationFrame(step);
        else resolve();
      };
      requestAnimationFrame(step);
    });

  const go = async (i: number) => {
    if (i === curRef.current || busyRef.current) return;
    busyRef.current = true;
    curRef.current = i;
    setEpochIdx(i);
    if (!reducedRef.current) await sand(0, 90, 450);
    setShownIdx(i);
    if (!reducedRef.current) await sand(90, 0, 450);
    busyRef.current = false;
    arm();
  };

  function arm() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    if (reducedRef.current || !visibleRef.current) return;
    timerRef.current = window.setTimeout(() => {
      void go((curRef.current + 1) % epochs.length);
    }, 3500);
  }

  useEffect(() => {
    const el = panelRef.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) arm();
      else if (timerRef.current) window.clearTimeout(timerRef.current);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, epochs.length]);

  // -------------------------------------------------------------------------
  // Navigation helpers
  // -------------------------------------------------------------------------
  const goTab = (tab: ActiveTab) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onNavigate(tab);
  };

  const goMilestone = (slug: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onOpenMilestonePage(slug);
  };

  const scrollToId = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  const afdianUrl = getOwnerContact().afdianUrl || 'https://afdian.com/a/aichronicle';

  // -------------------------------------------------------------------------
  // Copy (zh / en; other languages fall back to en)
  // -------------------------------------------------------------------------
  const copy = {
    subDesc: isZh
      ? '从一个神经元的数学模型，到会自己做研究的智能体——八十三年的思想、算法与机器。'
      : 'From the math of a single neuron to agents that do their own research — eighty-three years of ideas, algorithms and machines.',
    headline: isZh ? ['八十年', '智能史'] : [`${span} Years`, 'of Intelligence'],
    heroDesc: isZh
      ? `两次寒冬、${epochs.length} 个时代、${total} 件关键藏品。按时间排好，每一件都能点开细看。`
      : `Two winters, ${epochs.length} epochs, ${total} key exhibits — arranged in order, each open for close inspection.`,
    cta: t.readFullTreatise,
    nowShowing: isZh ? '当前展品' : 'Now Showing',
    statEpoch: isZh ? '时代' : 'Epoch',
    statCat: isZh ? '类别' : 'Field',
    viewDetail: isZh ? '查看详情' : 'Open Dossier',
    scrollHint: isZh ? '向下滚动探索' : 'Scroll to Explore',
    exploreNo: '[ 02 ]',
    exploreLabel: isZh ? '探索时间线' : 'Explore the Timeline',
    exploreBigA: isZh ? '从达特茅斯的那个夏天，' : 'From that summer at Dartmouth,',
    exploreBigEm: isZh ? '会自己推理和行动' : 'reason and act',
    treatisePill: isZh ? '阅读长卷' : 'Read the Treatise',
    countLabels: isZh
      ? ['件里程碑藏品', '个时代', '年跨度', '字长卷']
      : ['Milestone Exhibits', 'Epochs', 'Years Spanned', 'Word Treatise'],
    footLeft: isZh ? '不只讲故事，也讲清来龙去脉。' : 'Not just stories — the whole causal chain.',
    colHeadA: isZh ? `${span} 年的思想，` : `${span} years of ideas,`,
    colHeadB: isZh ? '按时代陈列于此。' : 'exhibited by epoch.',
    colTag: isZh ? '我们不只陈列成果·也陈列当时的困惑' : 'Not just the breakthroughs — the doubts of their time.',
    colTags: isZh ? ['史料', '可考', '免费'] : ['Sourced', 'Verifiable', 'Free'],
    listTop: isZh ? '看懂过去，才看得懂现在。' : 'To read the present, read the past.',
    archiveEyebrow: isZh ? `全部藏品 · ${total} 件` : `All Exhibits · ${total}`,
    archiveHead: isZh ? '按年份翻阅每一件里程碑' : 'Every milestone, filed by year',
    filterAll: isZh ? '全部' : 'All',
    viewCard: isZh ? '查看藏品' : 'View Exhibit',
    navLinks: [
      { label: isZh ? '时间线' : 'Timeline', href: '#collection', onClick: scrollToId('collection') },
      { label: isZh ? '长卷' : 'Treatise', href: hrefForTab('reader'), onClick: goTab('reader') },
      { label: isZh ? '缩放律实验室' : 'Scaling Lab', href: hrefForTab('lab'), onClick: goTab('lab') },
      { label: isZh ? '工具' : 'Tools', href: hrefForTab('ecosystem'), onClick: goTab('ecosystem') },
      { label: isZh ? '赞助' : 'Sponsor', href: afdianUrl, onClick: undefined, external: true },
    ],
  };

  const filtered = filter === 'all' ? milestones : milestones.filter((m) => m.category === filter);
  const marqueeItems = useMemo(() => {
    const names = milestones.map((m) => m.title.replace(/（.*?）|\(.*?\)/g, ''));
    return [...names, ...names];
  }, [milestones]);

  const activeEpoch = epochs[epochIdx];
  const epochNo = String(epochIdx + 1).padStart(2, '0');

  return (
    <div ref={revealRef} className="relative">
      {/* Sand-dissolve filter for the epoch specimen (scale driven via ref) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="sand" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={3} result="n" />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="n"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* ==================== 01 · HERO ==================== */}
      <section className="relative min-h-screen flex flex-col overflow-hidden bg-ob">
        <canvas ref={netRef} className="hero-net" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(120% 80% at 70% 40%, transparent 0, var(--ob) 75%)' }}
        />

        <header className="relative z-[3] px-5 sm:px-10 lg:px-16 pt-[calc(3.5rem+24px)]">
          <h1 className="sr-only">{isZh ? 'AI 编年史 · 人工智能演进全景通史' : 'AI Chronicle — A History of Artificial Intelligence'}</h1>

          {/* Geometric logotype: AI + milestone tick bar */}
          <svg className="w-full block overflow-visible" viewBox="0 0 840 100" aria-hidden="true">
            <g transform="translate(0,0)">
              {logo.a.map((p) => (
                <polygon key={p.i} className="lp" style={{ '--i': p.i } as React.CSSProperties} points={p.points} />
              ))}
            </g>
            <g transform="translate(200,0)">
              {logo.i.map((p) => (
                <polygon key={p.i} className="lp" style={{ '--i': p.i } as React.CSSProperties} points={p.points} />
              ))}
            </g>
            <g className="lp-gold">
              {logo.bar.map((p) => (
                <polygon key={p.i} className="lp" style={{ '--i': p.i } as React.CSSProperties} points={p.points} />
              ))}
            </g>
          </svg>

          {/* Three-column mono sub-navigation */}
          <div className="mono flex justify-between items-start gap-3 mt-8 text-[#A8A29E]">
            <div className="fade w-auto lg:w-[16%]" style={{ '--d': '300ms' } as React.CSSProperties}>
              Artificial<br />Intelligence<br />Chronicle
            </div>
            <div className="hidden lg:block w-[5%] text-center text-[#57534E] fade" style={{ '--d': '400ms' } as React.CSSProperties}>→</div>
            <div className="hidden lg:block w-[32%] text-[#D6D3D1] leading-[1.8] fade" style={{ '--d': '500ms' } as React.CSSProperties}>
              {copy.subDesc}
            </div>
            <div className="hidden lg:block w-[5%] text-center text-[#57534E] fade" style={{ '--d': '600ms' } as React.CSSProperties}>→</div>
            <ul className="hidden lg:block w-[15%] list-none fade" style={{ '--d': '700ms' } as React.CSSProperties}>
              {copy.navLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    onClick={l.onClick}
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-block py-[2px] transition-colors duration-300 hover:text-gold2"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <div className="relative z-[3] flex-1 flex flex-col lg:flex-row justify-between items-start px-5 sm:px-10 lg:px-16 pb-24">
          {/* Left — editorial headline + gold CTA */}
          <div className="mt-16 max-w-[420px]">
            <div className="fade flex items-center gap-4 text-gold mono" style={{ '--d': '700ms' } as React.CSSProperties}>
              <span>01</span>
              <i className="block h-px w-16 bg-gold opacity-60" />
            </div>
            <h2 className="fade mt-6 font-serif font-medium text-[56px] lg:text-[88px] leading-none tracking-[-0.01em]" style={{ '--d': '850ms' } as React.CSSProperties}>
              {copy.headline[0]}
              <br />
              <em className="not-italic text-gold">{copy.headline[1]}</em>
            </h2>
            <p className="fade mt-6 max-w-[300px] text-sm text-[#A8A29E] leading-[1.8]" style={{ '--d': '1000ms' } as React.CSSProperties}>
              {copy.heroDesc}
            </p>
            <div className="fade mt-10" style={{ '--d': '1150ms' } as React.CSSProperties}>
              <a className="btn-gold" href={hrefForTab('reader')} onClick={goTab('reader')}>
                <span className="gl">✦</span>
                <span>{copy.cta}</span>
              </a>
            </div>
          </div>

          {/* Right — current exhibit panel */}
          {current && (
            <div className="mt-12 lg:mt-24 w-full lg:w-[220px] flex flex-col gap-10">
              <div className="fade" style={{ '--d': '1000ms' } as React.CSSProperties}>
                <h3 className="mono font-semibold text-gold">
                  {copy.nowShowing} · {current.year}
                </h3>
                <p className="mt-2 text-[12.5px] text-[#A8A29E] leading-[1.7]">{current.title}</p>
              </div>
              <div className="fade flex gap-9" style={{ '--d': '1150ms' } as React.CSSProperties}>
                <div>
                  <div className="mono text-[#78716C]">{copy.statEpoch}</div>
                  <div className="mt-1 font-mono font-medium text-sm text-pearl">
                    {currentEpoch ? currentEpoch.romanId : '—'}
                  </div>
                </div>
                <div>
                  <div className="mono text-[#78716C]">{copy.statCat}</div>
                  <div className="mt-1 font-mono font-medium text-sm text-pearl">
                    {isZh ? CATEGORY_LABEL[current.category].zh : CATEGORY_LABEL[current.category].en}
                  </div>
                </div>
              </div>
              <a
                href={hrefForMilestone(current.slug)}
                onClick={goMilestone(current.slug)}
                className="fade flex items-center gap-4 group"
                style={{ '--d': '1300ms' } as React.CSSProperties}
              >
                <b className="w-10 h-10 rounded-full border border-[#57534E] grid place-items-center font-light text-lg transition-all duration-300 group-hover:bg-gold group-hover:border-gold group-hover:text-ob">
                  <Plus className="w-4 h-4" />
                </b>
                <span className="mono">{copy.viewDetail}</span>
              </a>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="fade absolute z-[3] left-5 sm:left-10 lg:left-16 bottom-10 hidden lg:flex items-center gap-4 text-[#78716C]" style={{ '--d': '1600ms' } as React.CSSProperties}>
          <b className="w-12 h-12 rounded-full border border-[#44403C] flex items-center justify-center gap-1">
            <i className="block w-px h-3 bg-[#A8A29E]" />
            <i className="block w-px h-3 bg-[#A8A29E]" />
          </b>
          <span className="mono">{copy.scrollHint}</span>
        </div>
      </section>

      {/* ==================== 02 · EXPLORE (pearl) ==================== */}
      <section className="relative bg-pearl text-ink px-5 sm:px-6 pt-32 pb-0 flex flex-col items-center text-center">
        <p className="rv mono text-[#6B6E76]">
          <span>{copy.exploreNo}</span> <b className="text-ink font-semibold">{copy.exploreLabel}</b>
        </p>
        <h2 className="rv mt-12 max-w-[1040px] font-serif font-medium text-[34px] sm:text-5xl lg:text-[60px] leading-[1.18] tracking-[-0.01em]">
          {copy.exploreBigA}
          <br />
          {isZh ? (
            <>到<em className="not-italic text-goldd">{copy.exploreBigEm}</em>的机器。</>
          ) : (
            <>to machines that <em className="not-italic text-goldd">{copy.exploreBigEm}</em> alone.</>
          )}
        </h2>

        <div className="mt-12 flex flex-wrap justify-center gap-3 max-w-3xl">
          {categories.map((cat, i) => (
            <a
              key={cat}
              href="#archive"
              onClick={(e) => {
                setFilter(cat);
                scrollToId('archive')(e);
              }}
              className="pill rv"
              style={{ '--d': `${i * 100}ms` } as React.CSSProperties}
            >
              {isZh ? CATEGORY_LABEL[cat].zh : CATEGORY_LABEL[cat].en}
            </a>
          ))}
          <a
            href={hrefForTab('reader')}
            onClick={goTab('reader')}
            className="pill rv"
            style={{ '--d': `${categories.length * 100}ms` } as React.CSSProperties}
          >
            {copy.treatisePill}
          </a>
        </div>

        {/* Count-up stats */}
        <div className="mt-16 sm:mt-20 w-full max-w-[1040px] grid grid-cols-2 lg:grid-cols-4 border-t border-[#D9D3C7]">
          <div className="rv py-7 pl-5 text-left border-r border-b lg:border-b-0 border-[#D9D3C7]">
            <b className="block font-display font-medium text-[44px] lg:text-[56px] leading-none text-ink" data-n={total}>0</b>
            <span className="block mt-2 mono text-[#6B6E76]">{copy.countLabels[0]}</span>
          </div>
          <div className="rv py-7 pl-5 text-left lg:border-r border-b lg:border-b-0 border-[#D9D3C7]" style={{ '--d': '100ms' } as React.CSSProperties}>
            <b className="block font-display font-medium text-[44px] lg:text-[56px] leading-none text-ink" data-n={epochs.length}>0</b>
            <span className="block mt-2 mono text-[#6B6E76]">{copy.countLabels[1]}</span>
          </div>
          <div className="rv py-7 pl-5 text-left border-r border-[#D9D3C7]" style={{ '--d': '200ms' } as React.CSSProperties}>
            <b className="block font-display font-medium text-[44px] lg:text-[56px] leading-none text-ink" data-n={span}>0</b>
            <span className="block mt-2 mono text-[#6B6E76]">{copy.countLabels[2]}</span>
          </div>
          <div className="rv py-7 pl-5 text-left" style={{ '--d': '300ms' } as React.CSSProperties}>
            <b
              className="block font-display font-medium text-[44px] lg:text-[56px] leading-none text-ink"
              data-n={wordCount}
              data-fmt={isZh ? 'compact-zh' : 'compact-en'}
            >
              0
            </b>
            <span className="block mt-2 mono text-[#6B6E76]">{copy.countLabels[3]}</span>
          </div>
        </div>

        <div className="h-28 sm:h-40 lg:h-[260px]" />
        <div className="hidden lg:flex absolute left-0 right-0 bottom-0 justify-between px-16 pb-10 mono text-[#6B6E76]">
          <span>{copy.footLeft}</span>
          <span>AI CHRONICLE © 2026</span>
        </div>
      </section>

      {/* ==================== 03 · COLLECTION (obsidian) ==================== */}
      <section id="collection" className="relative bg-ob">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12 px-5 sm:px-10 lg:px-16 pt-24 lg:pt-40 pb-10 lg:pb-16">
          <h2 className="rv max-w-[820px] font-serif font-medium text-[32px] sm:text-5xl lg:text-[56px] leading-[1.15]">
            {copy.colHeadA}
            <span className="hidden lg:inline-flex gap-3 align-middle mx-3 -translate-y-1.5">
              {['θ', '∑', '∞'].map((g) => (
                <b
                  key={g}
                  className="w-[52px] h-[52px] rounded-full border border-[#44403C] grid place-items-center font-display font-normal text-xl text-[#A8A29E] transition-all duration-300 hover:bg-pearl hover:text-ob hover:border-pearl"
                >
                  {g}
                </b>
              ))}
            </span>
            {copy.colHeadB}
          </h2>
          <div className="rv" style={{ '--d': '150ms' } as React.CSSProperties}>
            <p className="mono text-[#78716C] leading-[2] lg:text-right">{copy.colTag}</p>
            <div className="mono mt-5 flex gap-2.5 lg:justify-end">
              {copy.colTags.map((tag) => (
                <span key={tag} className="border border-[#44403C] rounded-full px-4 py-2 text-[#D6D3D1]">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div ref={panelRef} className="flex flex-col lg:flex-row border-t border-b border-[#292524]">
          {/* Specimen viewer */}
          <div className="relative w-full lg:w-[35%] min-h-[340px] lg:min-h-[560px] border-b lg:border-b-0 lg:border-r border-[#292524] p-6 sm:p-8 flex flex-col justify-between">
            <p className="tracking-[0.3em] text-[#57534E] font-mono text-xs">***</p>
            <div className="spec-stage">
              <div ref={specWrapRef} className="w-full h-full grid place-items-center">
                <EpochSpecimen index={shownIdx} sand className="w-[72%] h-[72%]" />
              </div>
            </div>
            <div className="relative mono flex items-center gap-2 text-[#78716C]">
              <span className="roll" style={{ width: '20px' }}>
                <span key={epochNo} className="roll-anim">{epochNo}</span>
              </span>
              <span className="text-[#44403C]">/</span>
              <span>{String(epochs.length).padStart(2, '0')}</span>
            </div>
          </div>

          {/* Chapter list */}
          <div className="w-full lg:w-[65%]">
            <div className="mono flex justify-between px-5 sm:px-8 py-6 sm:py-7 border-b border-[#292524] text-[#78716C]">
              <span>{copy.listTop}</span>
              <span className="roll" style={{ width: '90px', textAlign: 'right' }}>
                <span key={`l${epochNo}`} className="roll-anim">Epoch {epochNo}</span>
              </span>
            </div>

            {epochs.map((ep, i) => {
              const on = i === epochIdx;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => void go(i)}
                  className={`ch-row ${on ? 'on' : ''}`}
                >
                  <span className="ch-no">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ch-name">{ep.title.split(/[：:]/)[0]}</span>
                  <span className="ch-era">{ep.era.replace(/\s/g, '')}</span>
                  <span className="ch-arrow">↗</span>
                  {on && <span className="ch-bar" key={`bar-${epochIdx}`} />}
                </button>
              );
            })}

            <p className="px-5 sm:px-8 py-7 text-[#A8A29E] text-sm leading-[1.9] min-h-[120px] border-b border-[#292524]">
              {activeEpoch?.summary}
            </p>
          </div>
        </div>
      </section>

      {/* ==================== 04 · MARQUEE ==================== */}
      <div className="mq" aria-hidden="true">
        <div className="mq-t">
          {marqueeItems.map((name, i) => (
            <React.Fragment key={i}>
              <span>{name}</span>
              <i>◆</i>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ==================== 05 · ARCHIVE (mist) ==================== */}
      <section id="archive" className="bg-mist text-ink px-5 sm:px-10 lg:px-16 py-20 lg:py-[120px]">
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-8 flex-wrap">
          <div>
            <p className="rv eyebrow on-light mb-4">
              <i />
              {copy.archiveEyebrow}
            </p>
            <h2 className="rv font-serif font-medium text-[32px] sm:text-5xl leading-[1.15]">{copy.archiveHead}</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              className={`pill ${filter === 'all' ? 'on' : ''}`}
              onClick={() => setFilter('all')}
            >
              {copy.filterAll}
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`pill ${filter === cat ? 'on' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {isZh ? CATEGORY_LABEL[cat].zh : CATEGORY_LABEL[cat].en}
              </button>
            ))}
          </div>
        </div>

        <div className="arch-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m, i) => (
            <a
              key={`${filter}-${m.slug}`}
              href={hrefForMilestone(m.slug)}
              onClick={goMilestone(m.slug)}
              className="arch-card rv"
              style={{ '--d': `${(i % 3) * 80}ms` } as React.CSSProperties}
            >
              <span className="flex justify-between items-baseline">
                <span className="c-yr">{m.year}</span>
                <span className="c-cat">{isZh ? CATEGORY_LABEL[m.category].zh : CATEGORY_LABEL[m.category].en}</span>
              </span>
              <span className="c-t">{m.title}</span>
              <span className="c-s">{m.summary}</span>
              <span className="c-more">
                {copy.viewCard} <b>→</b>
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
