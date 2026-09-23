import type { ActiveTab } from '../components/Navbar';
import { EPOCHS } from '../data/timelineData';
import type { Epoch, Milestone } from '../types';

// The root domain is the canonical home of the site. The /ai-chronicle-2026/
// deployment serves the same pages but points every canonical link back here,
// so the two copies consolidate into one set of URLs for search engines.
export const CANONICAL_ORIGIN = 'https://mumumumuyi.github.io';

export interface RouteMeta {
  tab: ActiveTab;
  /** URL segment under the deployment base; empty string is the home route. */
  segment: string;
  title: string;
  description: string;
}

export const ROUTES: RouteMeta[] = [
  {
    tab: 'stage',
    segment: '',
    title: '火种、严冬与硅基奇点：人工智能演进全景通史 (1943 — 2026.09)',
    description:
      '全景解构人工智能从1943年M-P神经元、1950年图灵之问、1956达特茅斯会议，到两次严冬、深度学习爆发、GPT涌现，直至2026年9月系统二慢思考推理、测试时计算缩放定律与自主智能体集群的80年史诗长卷。',
  },
  {
    tab: 'reader',
    segment: 'reader',
    title: '人工智能演进全景通史 · 完整学术长卷 (1.8 万字) | AI Chronicle 2026',
    description:
      '一万八千字学术长卷，逐章梳理人工智能八十年的哲学基础、算法谱系与地缘格局：从图灵对“机器能否思考”的操作性定义、达特茅斯会议的符号主义纲领，到反向传播的静默胜利、测试时计算与系统二推理的当代范式转移。',
  },
  {
    tab: 'lab',
    segment: 'lab',
    title: '第二缩放定律模型实验室 · 测试时计算交互推演 | AI Chronicle 2026',
    description:
      '交互式推演算力、参数与数据的缩放关系：对比预训练缩放定律与测试时计算（Test-Time Compute）的边际收益曲线，直观理解从 GPT 系列到 o1 / R1 的范式转移为何发生。',
  },
  {
    tab: 'ecosystem',
    segment: 'ecosystem',
    title: '前沿模型生态矩阵与算力成本测算 | AI Chronicle 2026',
    description:
      '前沿模型生态全景对照：厂商阵营、开源与闭源路线、推理成本量级与算力采购测算，并提供面向研究者与团队的合作与赞助通道。',
  },
];

/** Vite injects the deployment base; it always starts and ends with '/'. */
const BASE = import.meta.env.BASE_URL;

export interface MilestoneRef {
  milestone: Milestone;
  epoch: Epoch;
}

/** Every milestone in chronological order (epoch order, then in-epoch order). */
export const ALL_MILESTONES: MilestoneRef[] = EPOCHS.flatMap((epoch) =>
  epoch.milestones.map((milestone) => ({ milestone, epoch }))
);

export function findMilestoneBySlug(slug: string): { ref: MilestoneRef; index: number } | null {
  const index = ALL_MILESTONES.findIndex((r) => r.milestone.slug === slug);
  return index >= 0 ? { ref: ALL_MILESTONES[index], index } : null;
}

function routeFor(tab: ActiveTab): RouteMeta {
  return ROUTES.find((r) => r.tab === tab) ?? ROUTES[0];
}

/** In-site href for a tab, correct for whichever base this build was made for. */
export function hrefForTab(tab: ActiveTab): string {
  const { segment } = routeFor(tab);
  return segment ? `${BASE}${segment}/` : BASE;
}

/** In-site href for a milestone dossier page: <base>milestone/<slug>/ */
export function hrefForMilestone(slug: string): string {
  return `${BASE}milestone/${slug}/`;
}

/** Canonical URL for a tab - always on the root domain, whatever the base. */
export function canonicalForTab(tab: ActiveTab): string {
  const { segment } = routeFor(tab);
  return segment ? `${CANONICAL_ORIGIN}/${segment}/` : `${CANONICAL_ORIGIN}/`;
}

/** Canonical URL for a milestone dossier page - always on the root domain. */
export function canonicalForMilestone(slug: string): string {
  return `${CANONICAL_ORIGIN}/milestone/${slug}/`;
}

export interface LocationResolution {
  tab: ActiveTab;
  /** Set when the URL is <base>milestone/<slug>/; slug validity is resolved by the caller. */
  milestoneSlug: string | null;
}

/**
 * Resolve the current URL to a view. Milestone deep links take precedence,
 * then the four tab routes, then the legacy #hash upgrade at the base path.
 */
export function resolveLocation(): LocationResolution {
  const path = window.location.pathname;
  const relative = path.startsWith(BASE) ? path.slice(BASE.length) : path.replace(/^\//, '');
  const segments = relative.replace(/\/+$/, '').split('/').filter(Boolean);

  if (segments[0] === 'milestone' && segments[1]) {
    return { tab: 'stage', milestoneSlug: decodeURIComponent(segments[1]) };
  }

  const byPath = segments[0] ? ROUTES.find((r) => r.segment === segments[0]) : undefined;
  if (byPath) return { tab: byPath.tab, milestoneSlug: null };

  // Only a bare base URL lets a legacy #hash decide the view.
  const hash = window.location.hash.replace('#', '');
  const byHash = ROUTES.find((r) => r.tab === hash);
  return { tab: byHash ? byHash.tab : 'stage', milestoneSlug: null };
}

/** Per-page meta for a milestone dossier, or null when the slug is unknown. */
export function milestoneMeta(
  slug: string
): { title: string; description: string; canonical: string } | null {
  const found = findMilestoneBySlug(slug);
  if (!found) return null;
  const m = found.ref.milestone;
  const description = m.summary.length > 150 ? `${m.summary.slice(0, 147)}…` : m.summary;
  return {
    title: `${m.title}（${m.year}）· 人工智能通史 | AI Chronicle 2026`,
    description,
    canonical: canonicalForMilestone(slug),
  };
}

function setMetaContent(selector: string, content: string): void {
  const el = document.head.querySelector<HTMLMetaElement>(selector);
  if (el) el.content = content;
}

/** Keep <head> in step with the active route so each URL has its own metadata. */
export function applyRouteMeta(tab: ActiveTab, milestoneSlug?: string | null): void {
  const mm = milestoneSlug ? milestoneMeta(milestoneSlug) : null;

  let title: string;
  let description: string;
  let canonical: string;
  if (mm) {
    ({ title, description, canonical } = mm);
  } else {
    const route = routeFor(tab);
    title = route.title;
    description = route.description;
    canonical = canonicalForTab(tab);
  }

  document.title = title;
  setMetaContent('meta[name="title"]', title);
  setMetaContent('meta[name="description"]', description);
  setMetaContent('meta[property="og:title"]', title);
  setMetaContent('meta[property="og:description"]', description);
  setMetaContent('meta[property="og:url"]', canonical);
  setMetaContent('meta[property="twitter:title"]', title);
  setMetaContent('meta[property="twitter:description"]', description);
  setMetaContent('meta[property="twitter:url"]', canonical);

  const canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalLink) canonicalLink.href = canonical;
}
