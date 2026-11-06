/**
 * Math utilities for 3D curved cylinder meshes, responsive layouts,
 * dynamic focus scaling, and magnetic snapping behavior.
 */

export const DESKTOP_CARD_SPACING = 5.2;
export const MOBILE_CARD_SPACING = 2.9;

/**
 * Calculates concave parabolic curvature along X axis.
 * Negative Z ensures outer edges bend backwards away from camera,
 * matching the concave cylinder perspective in Project List.png.
 */
export function calculateCurvedVertices(x: number, curveFactor: number = 0.12): number {
  const z = -Math.pow(x, 2) * curveFactor;
  return z === 0 ? 0 : z;
}

/**
 * Calculates dynamic curvature factor based on card proximity to center focus:
 * - Center card (diff ~ 0): returns 0 (perfect flat rectangle / "kotak sempurna").
 * - Scrolled/offset card (absDiff increases): smoothly curves up to maxCurveFactor ("sedikit melengkung").
 */
export function calculateDynamicCurveFactor(
  absDiff: number,
  maxCurveFactor: number = 0.11
): number {
  const edge0 = 0.05;
  const edge1 = 0.70;
  const t = Math.max(0, Math.min(1, (absDiff - edge0) / (edge1 - edge0)));
  const smooth = t * t * (3 - 2 * t);
  return smooth * maxCurveFactor;
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
 * - Focused project (currently highlighted in center): scaled larger (1.05x), flat and level.
 * - Other projects: scaled down to 70% (0.70x), curved and tilted along the ribbon.
 * - Desktop: Horizontal curved cylinder track with widened spacing.
 * - Mobile: Perfectly centered active card, subtle depth recession, and gentle non-obtrusive stagger.
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
    // Elegant mobile 3D layout: centered active card,
    // subtle depth recession, and gentle non-obtrusive stagger
    const x = diff * MOBILE_CARD_SPACING;
    const y = diff * 0.15 + 0.05;
    const z = -Math.abs(diff) * 1.1;
    const rotationY = -diff * 0.14;
    const rotationZ = 0;
    return { x, y, z, rotationY, rotationZ, scale };
  } else {
    // Horizontal curved ribbon matching Project List.png with widened breathing room
    // When in center (diff = 0), card stands completely upright and square (rotationZ = 0)
    const x = diff * DESKTOP_CARD_SPACING;
    const y = 0;
    const z = -Math.pow(x * 0.15, 2);
    const rotationY = -x * 0.035;
    const rotationZ = -0.02 * (1 - smoothProximity);
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
