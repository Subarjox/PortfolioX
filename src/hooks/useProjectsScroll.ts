"use client";

import { useState, useEffect, useRef } from "react";

export interface ScrollProgressState {
  targetProgress: number;
  currentProgress: number;
  activeIndex: number;
  activeProjectNumber: string;
}

/**
 * Calculates normalized pinned scroll progress (0.0 to 1.0)
 * based on section bounding client rect top, total height, and viewport height.
 */
export function calculateScrollProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number
): number {
  if (sectionTop > 0) return 0;
  const maxScroll = Math.max(sectionHeight - viewportHeight, 1);
  const scrolled = -sectionTop;
  const rawProgress = scrolled / maxScroll;
  return Math.max(0, Math.min(1, rawProgress));
}

/**
 * Hook to monitor scroll progress through the featured projects sticky container
 * with smooth lerp physics and active slide index tracking.
 */
export function useProjectsScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  totalCards: number = 6
): ScrollProgressState {
  const [progressState, setProgressState] = useState<ScrollProgressState>({
    targetProgress: 0,
    currentProgress: 0,
    activeIndex: 0,
    activeProjectNumber: "01",
  });

  const stateRef = useRef(progressState);
  stateRef.current = progressState;

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const target = calculateScrollProgress(rect.top, rect.height, window.innerHeight);

      const activeIdx = Math.max(0, Math.min(totalCards - 1, Math.round(target * (totalCards - 1))));
      const numStr = String(activeIdx + 1).padStart(2, "0");

      setProgressState((prev) => ({
        ...prev,
        targetProgress: target,
        activeIndex: activeIdx,
        activeProjectNumber: numStr,
      }));
    };

    const updateLerp = () => {
      const prev = stateRef.current;
      const diff = prev.targetProgress - prev.currentProgress;
      const nextProgress = prev.currentProgress + diff * 0.08;

      if (Math.abs(diff) > 0.0001) {
        setProgressState((s) => ({
          ...s,
          currentProgress: nextProgress,
        }));
      }
      animId = requestAnimationFrame(updateLerp);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();
    animId = requestAnimationFrame(updateLerp);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [containerRef, totalCards]);

  return progressState;
}
