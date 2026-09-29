# Design Specification: Featured Curved Projects Showcase

- **Author**: Antigravity Assistant & User
- **Date**: 2026-09-29
- **Status**: Draft (Under Review)
- **References**: `misc/Project List.png`, `misc/phoneprojeclist.png`

---

## 1. Overview & Goals

This specification defines the implementation of an interactive, Awwwards-style **Featured Project List** section for `web-barjox`.

### Key Goals:
1. **Desktop Experience (`misc/Project List.png`)**:
   - Pinned vertical scroll driving horizontal movement through 6 curated projects.
   - 3D curved cylinder mesh for each card (concave curvature rather than flat cards).
   - Minimalist editorial typography: `"Featured"` header, `"Beyond the projects ↘"` navigation, dynamic slide counter (`"01 — 06"`), tilted project title, and bottom scroll indicator (`"Scroll to see the projects ↓"`).
   - Dynamic blue decorative arc between cards.
2. **Mobile Experience (`misc/phoneprojeclist.png`)**:
   - Staggered diagonal 3D cascade: cards arranged along an upward-right diagonal with depth layering (Z offset).
   - Active card in the foreground, next card peeking from the upper-right.
   - Clean mobile bottom bar with counter, divider line, and scroll indicator.
3. **Integration**:
   - Placed directly underneath the existing 3D particle Hero section.
   - Smooth transition from the dark hero (`#090909`) to the clean, crisp white background (`#ffffff`) of the Featured section.
   - Two-way scroll support: scrolling down progresses forward (`01 → 06`); scrolling up reverses backward (`06 → 01`).

---

## 2. Architecture & Components

```
src/
├── app/
│   ├── page.tsx                      # Multi-section layout: Hero + FeaturedProjectsSection
│   └── globals.css                   # Smooth scroll and global styles
├── components/
│   ├── projects/
│   │   ├── FeaturedProjectsSection.tsx # Sticky scroll pinning container (350vh -> 100vh sticky)
│   │   ├── ProjectsCanvas.tsx         # R3F Canvas container for the 3D gallery
│   │   ├── ProjectsGallery.tsx        # 3D curved plane carousel & camera/scene manager
│   │   ├── CurvedProjectCard.tsx      # Segmented plane with cylindrical vertex bend & texture
│   │   ├── DecorativeArc.tsx          # Dynamic 3D blue ribbon / curve element
│   │   └── ProjectsOverlay.tsx        # Responsive HTML/Tailwind overlay (header & footer)
│   ├── canvas/
│   │   └── SceneCanvas.tsx            # Existing particle hero canvas
│   └── ui/
│       └── OverlayUI.tsx              # Existing hero UI
├── data/
│   └── projectsData.ts                # Metadata and textures for the 6 showcase projects
└── hooks/
    └── useProjectsScroll.ts           # Scroll progress tracking, lerping, and active slide detection
```

---

## 3. Detailed Component Specifications

### 3.1 `FeaturedProjectsSection.tsx`
- **Container**: Outer element has height `350vh` (scroll track) with `position: relative`.
- **Viewport**: Inner element has `position: sticky; top: 0; height: 100vh; width: 100vw; overflow: hidden; background: #ffffff;`.
- **Scroll Measurement**:
  - Calculates normalized progress `t ∈ [0, 1]` based on the section's scroll offset relative to the viewport.
  - Applies lerp damping: `currentProgress += (targetProgress - currentProgress) * 0.08` for organic weight.

### 3.2 `ProjectsGallery.tsx` & `CurvedProjectCard.tsx`
- **Curved 3D Geometry**:
  - `PlaneGeometry(width, height, 32, 1)`.
  - Vertex shader or geometry vertex displacement applies cylindrical concave curvature:
    $$z = - (x^2) \times \text{curveFactor}$$
  - Preserves crisp texture aspect ratios using cover UV scaling.
- **Responsive Positioning Modes**:
  - **Desktop (`width >= 768px`)**:
    - Cards positioned along horizontal axis $X_i = (i - \text{progress} \times (N - 1)) \times \text{spacing}$.
    - Subtle horizontal arc curve and velocity-based tilt ($Z$ rotation & skew).
  - **Mobile (`width < 768px`)**:
    - Cards arranged in a staggered diagonal cascade matching `misc/phoneprojeclist.png`:
      $$X_i = (i - \text{active}) \times \Delta X + X_{\text{base}}$$
      $$Y_i = (i - \text{active}) \times \Delta Y + Y_{\text{base}}$$
      $$Z_i = -|i - \text{active}| \times \Delta Z$$
    - Active card centered and prominent, subsequent card tilted upward-right in background.

### 3.3 `ProjectsOverlay.tsx`
- **Pointer Events**: `pointer-events-none` container with `pointer-events-auto` on clickable interactive items.
- **Desktop UI**:
  - Top Bar:
    - `"Featured"`: `font-medium text-4xl text-neutral-900 tracking-tight`.
    - `"Beyond the projects ↘"`: interactive link to portfolio archives.
  - Bottom Bar:
    - Slide Indicator: `"01 — 06"` with animated active dash.
    - Large Project Title: tilted (`-rotate-2` to `-rotate-3`), e.g., `"Oakley Meta HSTN – Mix N Match ↗"`.
    - Centered prompt: `"Scroll to see the projects ↓"`, auto-fades after first user interaction.
- **Mobile UI (`phoneprojeclist.png`)**:
  - Counter: `"02 — 06"`.
  - Divider: Thin line `border-t border-neutral-200`.
  - Prompt: `"Scroll to see the projects ↓"` on the left with downward arrow `↓` on the right.

---

## 4. Projects Dataset (`src/data/projectsData.ts`)

Contains 6 projects with rich imagery:
1. **01**: `Oakley Meta HSTN – Mix N Match` (Smart audio sunglasses, bold crimson & orange)
2. **02**: `Minimalist Dev Workspace` (Clean desk setup, vertical blinds shadow, mechanical keyboard)
3. **03**: `Acrobat Trail Sneaker` (Dynamic outdoor footwear, aggressive silhouette)
4. **04**: `Nordic Architectural Living` (Sculptural brutalist interior & lighting)
5. **05**: `Kinetic Sound Interface` (Hardware synth & tactile digital controls)
6. **06**: `Autonomous Agent Framework` (Modern AI developer workspace visualization)

---

## 5. Error Handling & Performance

- **SSR / Hydration**: All Three.js canvas components use Next.js dynamic loading with `{ ssr: false }`.
- **Texture Preloading**: Textures preloaded with Three.js `TextureLoader` or `@react-three/drei`'s `useTexture` with fallback placeholders.
- **Performance**:
  - Frustum culling enabled for offscreen cards.
  - Frame budget: 60fps on desktop and mobile.
  - Pixel ratio capped at `Math.min(window.devicePixelRatio, 2)`.

---

## 6. Verification & Acceptance Criteria

1. Navigating to the page shows the Particle Hero section.
2. Scrolling down smoothly enters the white Featured section and locks the viewport.
3. Continued scrolling down translates cards to the left, showing project 01 through 06 sequentially.
4. Scrolling up reverses the card translation back towards project 01.
5. Desktop view matches `misc/Project List.png` with curved card geometry, tilted title, and blue arc.
6. Mobile view matches `misc/phoneprojeclist.png` with diagonal staggered 3D cascade and mobile bottom bar.
7. Automated build (`npm run build`) and test suite (`npm run test`) pass with zero errors.
