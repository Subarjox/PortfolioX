/**
 * Math utilities for 3D curved cylinder meshes and responsive card layouts.
 */

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
}

/**
 * Calculates 3D position and orientation for each project card.
 * - Desktop: Horizontal curved cylinder track matching Project List.png.
 * - Mobile: Diagonal staggered 3D cascade matching phoneprojeclist.png.
 */
export function calculateCardLayout(
  index: number,
  progress: number,
  totalCards: number,
  isMobile: boolean
): CardLayoutResult {
  const activeFloat = progress * (totalCards - 1);
  const diff = index - activeFloat;

  if (isMobile) {
    // Staggered cascade matching phoneprojeclist.png
    // Active card (diff = 0) is foreground left-center
    // Next cards (diff > 0) are higher (Y positive), shifted right (X positive), and deeper in Z
    const x = diff * 1.5 - 0.2;
    const y = diff * 1.1 + 0.1;
    const z = -Math.abs(diff) * 1.2;
    const rotationY = -0.15;
    const rotationZ = -0.06;
    return { x, y, z, rotationY, rotationZ };
  } else {
    // Horizontal curved ribbon matching Project List.png
    const spacing = 3.6;
    const x = diff * spacing;
    const y = 0;
    const z = -Math.pow(x * 0.2, 2);
    const rotationY = -x * 0.04;
    const rotationZ = -0.02;
    return { x, y, z, rotationY, rotationZ };
  }
}
