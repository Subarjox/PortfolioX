/**
 * Math utilities for 3D curved cylinder meshes, responsive layouts,
 * dynamic focus scaling, and magnetic snapping behavior.
 */

export const DESKTOP_CARD_SPACING = 5.2;
export const MOBILE_CARD_SPACING = 2.2;

/**
 * Calculates concave parabolic curvature along X axis.
 * Negative Z ensures outer edges bend backwards away from camera,
 * matching the concave cylinder perspective in Project List.png.
 */
export function calculateCurvedVertices(x: number, curveFactor: number = 0.12): number {
  const z = -Math.pow(x, 2) * curveFactor;
  return z === 0 ? 0 : z;
}

export interface CardLayoutResult {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
}

/**
 * Calculates 3D position, orientation, and focus scale for each project card.
 * - Focused project (currently highlighted): scaled larger (1.05x).
 * - Other projects: scaled down to 70% (0.70x).
 * - Desktop: Horizontal curved cylinder track with widened spacing.
 * - Mobile: Diagonal staggered 3D cascade with comfortable depth offsets.
 */
export function calculateCardLayout(
  index: number,
  progress: number,
  totalCards: number,
  isMobile: boolean
): CardLayoutResult {
  const activeFloat = progress * (totalCards - 1);
  const diff = index - activeFloat;
  const absDiff = Math.abs(diff);

  // Smoothstep transition: focused card is 1.05x (larger), others smoothly settle at 0.70x (70%)
  const proximity = Math.max(0, 1 - absDiff);
  const smoothProximity = proximity * proximity * (3 - 2 * proximity);
  const scale = 0.70 + 0.35 * smoothProximity;

  if (isMobile) {
    // Staggered cascade matching phoneprojeclist.png
    // Active card (diff = 0) is foreground left-center
    // Next cards (diff > 0) are higher, shifted right, and deeper in Z
    const x = diff * MOBILE_CARD_SPACING - 0.25;
    const y = diff * 1.35 + 0.1;
    const z = -Math.abs(diff) * 1.3;
    const rotationY = -0.15;
    const rotationZ = -0.06;
    return { x, y, z, rotationY, rotationZ, scale };
  } else {
    // Horizontal curved ribbon matching Project List.png with widened breathing room
    const x = diff * DESKTOP_CARD_SPACING;
    const y = 0;
    const z = -Math.pow(x * 0.15, 2);
    const rotationY = -x * 0.035;
    const rotationZ = -0.02;
    return { x, y, z, rotationY, rotationZ, scale };
  }
}

/**
 * Applies a smooth magnetic attraction towards integer project indices
 * so that when the user scrolls near a card, it locks cleanly in view
 * without drifting or overshooting ("tidak nyasar").
 */
export function applyMagneticSnap(
  progress: number,
  totalCards: number = 6,
  strength: number = 1.35
): number {
  if (totalCards <= 1) return progress;
  const maxIdx = totalCards - 1;
  const activeFloat = Math.max(0, Math.min(maxIdx, progress * maxIdx));
  const nearest = Math.round(activeFloat);
  const delta = activeFloat - nearest; // [-0.5, 0.5]

  // S-curve magnetic compression towards integer detents
  const absDelta = Math.abs(delta);
  const factor = Math.pow(absDelta * 2, strength) / 2;
  const snappedDelta = Math.sign(delta) * factor;

  const snappedFloat = Math.max(0, Math.min(maxIdx, nearest + snappedDelta));
  return snappedFloat / maxIdx;
}
