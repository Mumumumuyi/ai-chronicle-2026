import { useEffect, useRef } from 'react';

/**
 * Observes `.rv` descendants of the returned element and sets `[data-in]` when they
 * scroll into view (prototype reveal). Descendants carrying `[data-n]` get a
 * 1.6s ease-out cubic count-up; `data-fmt="compact-zh"` renders 1.8万-style
 * values, `data-fmt="compact-en"` renders 18k-style values.
 *
 * Pass deps that re-render `.rv` children (e.g. the active filter, language)
 * so newly mounted nodes get observed again.
 */
export function useScrollReveal<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          // An attribute, not a class: React rewrites className on re-render (e.g. a
          // card turning "selected"), which would silently strip a DOM-added class
          // and hide the element again.
          el.setAttribute('data-in', '');

          const n = el.querySelector<HTMLElement>('[data-n]');
          if (n && !n.dataset.done) {
            n.dataset.done = '1';
            const target = Number(n.dataset.n || '0');
            const fmt = n.dataset.fmt || '';
            const t0 = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - t0) / 1600);
              const v = Math.round(target * (1 - Math.pow(1 - p, 3)));
              n.textContent =
                fmt === 'compact-zh'
                  ? `${(v / 10000).toFixed(1)}万`
                  : fmt === 'compact-en'
                  ? `${(v / 1000).toFixed(0)}k`
                  : String(v);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -80px 0px' }
    );

    root.querySelectorAll<HTMLElement>('.rv').forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
