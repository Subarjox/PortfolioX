"use client";

import { useState, useEffect } from "react";
import { applyMagneticSnap } from "@/utils/curvedMeshMath";

export interface ScrollProgressState {
  targetProgress: number;
  currentProgress: number;
  activeIndex: number;
  activeProjectNumber: string;
}

/**
 * Calculates normalized pinned scroll progress (0.0 to 1.0)
 * with magnetic lock snap so project cards settle centered without drifting.
 */
export function calculateScrollProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number,
  totalCards: number = 6
): number {
  if (sectionTop > 0) return 0;
  const maxScroll = Math.max(sectionHeight - viewportHeight, 1);
  const scrolled = -sectionTop;
  const rawProgress = scrolled / maxScroll;
  const clampedProgress = Math.max(0, Math.min(1, rawProgress));
  return applyMagneticSnap(clampedProgress, totalCards);
}

/**
 * Hook to monitor scroll progress through the featured projects sticky container.
 * Updates React state ONLY upon scroll/resize events, eliminating React render-cycle thrashing.
 * Smooth frame-rate independent interpolation is handled purely inside Three.js useFrame.
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

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const target = calculateScrollProgress(
        rect.top,
        rect.height,
        window.innerHeight,
        totalCards
      );

      const activeIdx = Math.max(
        0,
        Math.min(totalCards - 1, Math.round(target * (totalCards - 1)))
      );
      const numStr = String(activeIdx + 1).padStart(2, "0");

      setProgressState((prev) => {
        if (
          Math.abs(prev.targetProgress - target) < 0.0001 &&
          prev.activeIndex === activeIdx
        ) {
          return prev;
        }
        return {
          targetProgress: target,
          currentProgress: target,
          activeIndex: activeIdx,
          activeProjectNumber: numStr,
        };
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [containerRef, totalCards]);

  return progressState;
}
