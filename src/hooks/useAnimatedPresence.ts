import { useState, useEffect } from 'react';

/**
 * useAnimatedPresence Hook
 * Enables smooth entrance and exit animations for conditionally mounted components (Modals, Drawers, Tabs)
 * without external animation libraries.
 */
export function useAnimatedPresence(isOpen: boolean, exitDurationMs: number = 220) {
  const [isMounted, setIsMounted] = useState<boolean>(isOpen);
  const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsAnimatingOut(false);
    } else if (isMounted) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setIsMounted(false);
        setIsAnimatingOut(false);
      }, exitDurationMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, exitDurationMs, isMounted]);

  return {
    isMounted,
    isAnimatingOut,
    animState: isAnimatingOut ? ('exiting' as const) : isMounted ? ('entering' as const) : ('idle' as const),
  };
}
