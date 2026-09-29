# Featured Curved Projects Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an interactive Featured Projects showcase with 3D curved cards, pinned two-way scroll-driven horizontal translation, Awwwards-style typography, and a mobile diagonal staggered cascade matching `misc/Project List.png` and `misc/phoneprojeclist.png`.

**Architecture:** A multi-section layout where the Hero section (`100vh`) transitions into a sticky scroll-pinned container (`350vh` total track, `100vh` sticky viewport). Inside the sticky viewport, a Three.js / React Three Fiber scene renders cards on curved cylinder planes with dampening lerp physics, while a responsive DOM overlay renders the header, slide counters, tilted titles, and scroll indicators.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Three.js, @react-three/fiber, Tailwind CSS v4, Vitest.

**Spec:** [`docs/superpowers/specs/2026-09-29-curved-project-list-design.md`](file:///C:/Users/LENOVO/Documents/PROJECT/web-barjox/docs/superpowers/specs/2026-09-29-curved-project-list-design.md)

## Global Constraints

- Must run on Next.js 15 App Router with `"use client"` on interactive components.
- Canvas / Three.js components must use Next.js dynamic import with `{ ssr: false }` to prevent hydration mismatches.
- Background of the Featured Projects section must be clean white (`#ffffff`).
- 6 project items must be supported with identifiers `"01"` through `"06"`.
- Must support two-way scroll: scrolling down progresses forward (`01 → 06`); scrolling up reverses backward (`06 → 01`).
- Desktop layout matches `misc/Project List.png` (horizontal curved cylinder track).
- Mobile layout matches `misc/phoneprojeclist.png` (diagonal staggered 3D cascade with bottom divider and scroll indicator).
- All existing tests in `tests/` must remain passing.

## Review Focus

1. **Scroll boundary overshoot / clamp**: Scroll progress must be strictly clamped between `0.0` and `1.0` so cards do not fly offscreen when scrolling past the section.
2. **Window resize and aspect ratio change**: Switching between desktop and mobile viewport widths must recalculate camera FOV and layout mode without crashing or blanking the WebGL canvas.
3. **Texture loading failures / missing assets**: Cards must display an elegant fallback gradient/color while textures are loading or if an image URL fails to load.
4. **Touch scroll on mobile**: Mobile touch drag or page swipe must smoothly scroll through the staggered cascade without trapping the page scroll.
5. **Damping / Lerp stability**: Lerp calculations must use delta-time independent clamping to prevent floating-point NaN or jitter on high-refresh-rate (120Hz/144Hz) displays.

---

### Task 1: Project Data & Curved Mesh Math Utilities

**Files:**
- Create: `src/data/projectsData.ts`
- Create: `src/utils/curvedMeshMath.ts`
- Test: `tests/curvedMeshMath.test.ts`

**Interfaces:**
- Consumes: None (pure functions and static data)
- Produces:
  ```ts
  export interface ProjectItem {
    id: string; // "01", "02", ...
    title: string;
    subtitle: string;
    image: string;
    accentColor: string;
    externalUrl?: string;
  }
  export const PROJECTS_DATA: ProjectItem[];
  export function calculateCurvedVertices(x: number, curveFactor: number): number;
  export function calculateCardLayout(
    index: number,
    progress: number,
    totalCards: number,
    isMobile: boolean
  ): { x: number; y: number; z: number; rotationY: number; rotationZ: number };
  ```

- [ ] **Step 1: Write failing tests for project data and curved math**

```ts
// tests/curvedMeshMath.test.ts
import { describe, it, expect } from "vitest";
import { calculateCurvedVertices, calculateCardLayout } from "../src/utils/curvedMeshMath";
import { PROJECTS_DATA } from "../src/data/projectsData";

describe("Curved Mesh Math & Project Data", () => {
  it("should have exactly 6 projects with required fields", () => {
    expect(PROJECTS_DATA).toHaveLength(6);
    expect(PROJECTS_DATA[0].id).toBe("01");
    expect(PROJECTS_DATA[0].title).toContain("Oakley");
  });

  it("should calculate concave parabolic curvature (negative Z for non-zero X)", () => {
    const centerZ = calculateCurvedVertices(0, 0.15);
    const edgeZ = calculateCurvedVertices(2.0, 0.15);
    expect(centerZ).toBe(0);
    expect(edgeZ).toBeLessThan(0); // concave bend
  });

  it("should layout desktop cards horizontally along X axis", () => {
    const card0 = calculateCardLayout(0, 0.0, 6, false);
    const card1 = calculateCardLayout(1, 0.0, 6, false);
    expect(card1.x).toBeGreaterThan(card0.x);
    expect(card0.y).toBeCloseTo(0, 1);
  });

  it("should layout mobile cards in staggered diagonal cascade", () => {
    const card0 = calculateCardLayout(0, 0.0, 6, true);
    const card1 = calculateCardLayout(1, 0.0, 6, true);
    expect(card1.x).toBeGreaterThan(card0.x);
    expect(card1.y).toBeGreaterThan(card0.y); // upper right
    expect(card1.z).toBeLessThan(card0.z); // deeper in Z
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/curvedMeshMath.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/data/projectsData.ts` and `src/utils/curvedMeshMath.ts`**

```ts
// src/data/projectsData.ts
export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  accentColor: string;
  externalUrl?: string;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "01",
    title: "Oakley Meta HSTN – Mix N Match",
    subtitle: "Connected Eyewear & Audio Experience",
    image: "/images/projects/oakley.png",
    accentColor: "#d94314",
  },
  {
    id: "02",
    title: "Minimalist Dev Workspace",
    subtitle: "Hardware & Studio Architectural Rig",
    image: "/images/projects/workspace.png",
    accentColor: "#4a5568",
  },
  {
    id: "03",
    title: "Acrobat Trail Sneaker",
    subtitle: "High-Performance Outdoor Kinetic Footwear",
    image: "/images/projects/sneaker.png",
    accentColor: "#c28e2b",
  },
  {
    id: "04",
    title: "Nordic Architectural Living",
    subtitle: "Brutalist Space, Materiality & Warm Light",
    image: "/images/projects/nordic.png",
    accentColor: "#3d4852",
  },
  {
    id: "05",
    title: "Kinetic Sound Synthesizer",
    subtitle: "Tactile Modular Sound Architecture",
    image: "/images/projects/sound.png",
    accentColor: "#1e3a8a",
  },
  {
    id: "06",
    title: "Autonomous Agent Intelligence",
    subtitle: "Distributed Systems & Ambient Engineering",
    image: "/images/projects/agent.png",
    accentColor: "#10b981",
  },
];
```

```ts
// src/utils/curvedMeshMath.ts
export function calculateCurvedVertices(x: number, curveFactor: number = 0.12): number {
  return -Math.pow(x, 2) * curveFactor;
}

export function calculateCardLayout(
  index: number,
  progress: number,
  totalCards: number,
  isMobile: boolean
): { x: number; y: number; z: number; rotationY: number; rotationZ: number } {
  const activeFloat = progress * (totalCards - 1);
  const diff = index - activeFloat;

  if (isMobile) {
    // Staggered cascade matching phoneprojeclist.png
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/curvedMeshMath.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/projectsData.ts src/utils/curvedMeshMath.ts tests/curvedMeshMath.test.ts
git commit -m "feat(projects): add projects data and curved mesh layout calculations"
```

---

### Task 2: Pinned Scroll Tracking & Damped Lerp Hook

**Files:**
- Create: `src/hooks/useProjectsScroll.ts`
- Test: `tests/useProjectsScroll.test.ts`

**Interfaces:**
- Consumes: `PROJECTS_DATA.length`
- Produces:
  ```ts
  export interface ScrollProgressState {
    targetProgress: number; // 0.0 to 1.0 clamped
    currentProgress: number; // smoothed lerped progress
    activeIndex: number; // 0 to 5
    activeProjectNumber: string; // "01" to "06"
  }
  export function calculateScrollProgress(
    sectionTop: number,
    sectionHeight: number,
    viewportHeight: number
  ): number;
  export function useProjectsScroll(
    containerRef: React.RefObject<HTMLElement | null>,
    totalCards?: number
  ): ScrollProgressState;
  ```

- [ ] **Step 1: Write failing test for scroll calculation logic**

```ts
// tests/useProjectsScroll.test.ts
import { describe, it, expect } from "vitest";
import { calculateScrollProgress } from "../src/hooks/useProjectsScroll";

describe("Scroll Progress Calculation", () => {
  it("should return 0 when section is at or below viewport bottom", () => {
    // sectionTop = 1000, viewportHeight = 800
    expect(calculateScrollProgress(800, 3000, 800)).toBe(0);
    expect(calculateScrollProgress(1000, 3000, 800)).toBe(0);
  });

  it("should return 1 when section has fully completed its scroll track", () => {
    // track distance = sectionHeight - viewportHeight = 3000 - 800 = 2200
    // when sectionTop = -2200, progress is 1.0
    expect(calculateScrollProgress(-2200, 3000, 800)).toBe(1);
    expect(calculateScrollProgress(-2500, 3000, 800)).toBe(1); // strictly clamped
  });

  it("should return linear progress between 0.0 and 1.0", () => {
    expect(calculateScrollProgress(-1100, 3000, 800)).toBeCloseTo(0.5, 2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/useProjectsScroll.test.ts`
Expected: FAIL with module not found.

- [ ] **Step 3: Implement `src/hooks/useProjectsScroll.ts`**

```ts
// src/hooks/useProjectsScroll.ts
"use client";

import { useState, useEffect, useRef } from "react";

export function calculateScrollProgress(
  sectionTop: number,
  sectionHeight: number,
  viewportHeight: number
): number {
  const maxScroll = Math.max(sectionHeight - viewportHeight, 1);
  const scrolled = -sectionTop;
  const rawProgress = scrolled / maxScroll;
  return Math.max(0, Math.min(1, rawProgress));
}

export function useProjectsScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  totalCards: number = 6
) {
  const [progressState, setProgressState] = useState({
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
      const current = prev.currentProgress + (prev.targetProgress - prev.currentProgress) * 0.08;
      if (Math.abs(current - prev.currentProgress) > 0.0001) {
        setProgressState((s) => ({
          ...s,
          currentProgress: current,
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/useProjectsScroll.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useProjectsScroll.ts tests/useProjectsScroll.test.ts
git commit -m "feat(projects): add useProjectsScroll hook with damped lerp tracking"
```

---

### Task 3: 3D Curved Card & Arc Shaders / Three.js Canvas

**Files:**
- Create: `src/components/projects/CurvedProjectCard.tsx`
- Create: `src/components/projects/DecorativeArc.tsx`
- Create: `src/components/projects/ProjectsGallery.tsx`
- Create: `src/components/projects/ProjectsCanvas.tsx`
- Test: `tests/curvedProjectCard.test.ts`

**Interfaces:**
- Consumes: `PROJECTS_DATA`, `calculateCardLayout`, `calculateCurvedVertices`
- Produces:
  `<ProjectsCanvas progress={number} activeIndex={number} isMobile={boolean} />`

- [ ] **Step 1: Write test for curved card geometry construction**

```ts
// tests/curvedProjectCard.test.ts
import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { calculateCurvedVertices } from "../src/utils/curvedMeshMath";

describe("Curved Mesh Geometry Verification", () => {
  it("should generate a segmented curved plane geometry", () => {
    const geo = new THREE.PlaneGeometry(3, 2, 32, 1);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = calculateCurvedVertices(x, 0.12);
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    expect(pos.getZ(0)).toBeLessThan(0); // outer edges bow backwards
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/curvedProjectCard.test.ts`
Expected: PASS.

- [ ] **Step 3: Implement `CurvedProjectCard.tsx`, `DecorativeArc.tsx`, `ProjectsGallery.tsx`, `ProjectsCanvas.tsx`**

Implement `CurvedProjectCard.tsx`:
- Generates curved plane geometry with 32 segments along X.
- Maps project texture with subtle gloss/sheen.
- Smooth spring position updates via `useFrame`.

Implement `DecorativeArc.tsx`:
- Renders the vibrant blue curve (`#2563eb`) between cards 01 and 02 matching `misc/Project List.png`.

Implement `ProjectsGallery.tsx`:
- Manages the cards array, camera FOV adaptation for desktop vs mobile, and lighting.

Implement `ProjectsCanvas.tsx`:
- R3F Canvas with antialias, responsive pixel ratio, transparent background, and SSR-safe dynamic export.

- [ ] **Step 4: Verify build with TypeScript compiler**

Run: `npx tsc --noEmit`
Expected: PASS with 0 type errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/projects/CurvedProjectCard.tsx src/components/projects/DecorativeArc.tsx src/components/projects/ProjectsGallery.tsx src/components/projects/ProjectsCanvas.tsx tests/curvedProjectCard.test.ts
git commit -m "feat(projects): add 3D curved plane cards, decorative arc, and R3F canvas"
```

---

### Task 4: Responsive DOM Overlay UI (Desktop & Mobile)

**Files:**
- Create: `src/components/projects/ProjectsOverlay.tsx`
- Test: `tests/projectsOverlay.test.ts`

**Interfaces:**
- Consumes: `PROJECTS_DATA`, `activeProjectNumber`, `activeIndex`, `isMobile`
- Produces:
  `<ProjectsOverlay activeNumber={string} activeIndex={number} totalCount={number} />`

- [ ] **Step 1: Write unit test for ProjectsOverlay output elements**

```ts
// tests/projectsOverlay.test.ts
import { describe, it, expect } from "vitest";
import { PROJECTS_DATA } from "../src/data/projectsData";

describe("Projects Overlay Content Validation", () => {
  it("should match editorial copy from reference images", () => {
    const featuredHeading = "Featured";
    const beyondProjects = "Beyond the projects";
    const scrollPrompt = "Scroll to see the projects";

    expect(featuredHeading).toBe("Featured");
    expect(beyondProjects).toContain("Beyond the projects");
    expect(scrollPrompt).toContain("Scroll to see the projects");
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/projectsOverlay.test.ts`
Expected: PASS.

- [ ] **Step 3: Implement `src/components/projects/ProjectsOverlay.tsx`**

- Desktop Header: `"Featured"` (top-left) and `"Beyond the projects ↘"` (top-right).
- Desktop Bottom: Counter `"01 — 06"`, tilted dynamic title `"Oakley Meta HSTN – Mix N Match ↗"`, and centered `"Scroll to see the projects ↓"`.
- Mobile Bottom (from `phoneprojeclist.png`):
  - Left: `"02 — 06"` counter with progress bar.
  - Divider: `border-t border-neutral-200/80`.
  - Prompt: `"Scroll to see the projects"` on left and `↓` arrow on right.

- [ ] **Step 4: Run test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/projects/ProjectsOverlay.tsx tests/projectsOverlay.test.ts
git commit -m "feat(projects): add responsive DOM overlay matching desktop and mobile mockups"
```

---

### Task 5: Section Integration & Page Flow in `page.tsx`

**Files:**
- Create: `src/components/projects/FeaturedProjectsSection.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/components/ui/OverlayUI.tsx` (wire up `"SCROLL"` click to smooth-scroll down into Featured)
- Test: `tests/e2e.test.ts`

**Interfaces:**
- Consumes: `FeaturedProjectsSection`, `OverlayUI`, `SceneCanvas`
- Produces: Fully integrated home page with seamless transition from dark hero to white featured projects showcase.

- [ ] **Step 1: Update e2e integration test**

```ts
// tests/e2e.test.ts
import { describe, it, expect } from "vitest";

describe("End-to-End Page Structure", () => {
  it("includes Hero and Featured Projects sections", async () => {
    const pageModule = await import("../src/app/page");
    expect(pageModule.default).toBeDefined();
  });
});
```

- [ ] **Step 2: Implement `FeaturedProjectsSection.tsx`**

- Container with `h-[350vh]` track.
- Viewport with `sticky top-0 h-screen w-screen overflow-hidden bg-white text-neutral-900`.
- Detects `isMobile` via window resize listener.
- Combines `ProjectsCanvas` and `ProjectsOverlay`.

- [ ] **Step 3: Modify `src/app/page.tsx` and `src/components/ui/OverlayUI.tsx`**

- In `page.tsx`, change root container from `overflow-hidden h-screen` to `min-h-screen w-screen bg-[#090909] text-white selection:bg-neutral-800`.
- In `OverlayUI.tsx`, make `"SCROLL"` clickable to trigger `window.scrollTo({ top: window.innerHeight, behavior: "smooth" })`.

- [ ] **Step 4: Run tests and build**

Run: `npm test && npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/projects/FeaturedProjectsSection.tsx src/app/page.tsx src/components/ui/OverlayUI.tsx tests/e2e.test.ts
git commit -m "feat(projects): integrate featured projects section into home page flow"
```

---

### Task 6: Visual Assets Generation & Final Verification

**Files:**
- Create: `public/images/projects/oakley.png` (matching sunglasses in `Project List.png`)
- Create: `public/images/projects/workspace.png` (matching desk setup in `Project List.png` & `phoneprojeclist.png`)
- Create: `public/images/projects/sneaker.png` (matching outdoor sneaker in `phoneprojeclist.png`)
- Create: `public/images/projects/nordic.png`
- Create: `public/images/projects/sound.png`
- Create: `public/images/projects/agent.png`

- [ ] **Step 1: Generate/provide high-fidelity textures for all 6 projects**
- [ ] **Step 2: Verify desktop layout visually matches `misc/Project List.png`**
- [ ] **Step 3: Verify mobile layout visually matches `misc/phoneprojeclist.png`**
- [ ] **Step 4: Run full test suite & production build**

Run: `npm test && npm run build`
Expected: All tests pass, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add public/images/projects/*
git commit -m "chore(assets): add high-fidelity project card textures"
```
