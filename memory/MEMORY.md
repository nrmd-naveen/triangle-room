# Afterglow Production House Site

## Project
Premium edit & post house marketing site. Awwwards-quality bar.
Working dir: `/home/nr/projects/kiru/prod-hs`

## Stack
- Next.js 16 App Router + TypeScript
- Tailwind CSS v4 (config in `@theme` block in CSS, not tailwind.config.js)
- GSAP + ScrollTrigger + @gsap/react (scroll animation)
- Lenis 1.x smooth scroll → wired via `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add`
- Framer Motion (UI only: nav entrance on isLoaded)
- Fonts: Inter (--font-inter) + Cormorant Garamond (--font-cormorant) via next/font/google

## Architecture
```
app/
  globals.css       — Tailwind v4 @theme, CSS vars, film grain keyframe, marquee keyframe
  layout.tsx        — fonts, SmoothScroll wrapper, grain div, metadata
  page.tsx          — 'use client', useState isLoaded, composes all sections
components/
  SmoothScroll.tsx  — Lenis + GSAP ScrollTrigger integration
  Preloader.tsx     — counting percentage, bar, slides out, calls onComplete
  CustomCursor.tsx  — GSAP-animated dot + ring cursor
  Nav.tsx           — Framer Motion, animates in when isLoaded=true
  Marquee.tsx       — CSS animation marquee (no JS needed)
  sections/
    Hero.tsx        — two useGSAP: one for scroll setup (no deps), one for entrance (deps:[isLoaded])
    Reel.tsx        — 320vh pinned, frame expands to fullscreen via ScrollTrigger scrub
    Work.tsx        — 800vh wrapper, horizontal scroll driven by vertical via GSAP x tween
    Statement.tsx   — word-by-word opacity reveal scrubbed to scroll
    Clients.tsx     — staggered gsap.from opacity/y reveal on ScrollTrigger
    About.tsx       — two-column, award badge, stats
    Contact.tsx     — gsap.set initial state + gsap.to ScrollTrigger reveal
```

## CRITICAL: GSAP + Tailwind v4 percentage transform conflict
**Problem**: Tailwind `translate-y-[110%]` generates CSS custom property `--tw-translate-y: 110%`.
GSAP reads this as a pixel value via computed matrix(), not as `yPercent`. So:
- GSAP sees: `y: 108px` (pixel equivalent) and `yPercent: 0` (default)
- Animation `gsap.to({ yPercent: 0 })` → no-op (yPercent was already 0)
- Element stays hidden at the pixel offset, clipped by overflow-hidden parent

**Fix**: NEVER use Tailwind percentage transform classes (`translate-y-[110%]`) on elements
that GSAP will animate with `yPercent`. Instead:
1. Use `gsap.set(el, { yPercent: 110 })` to set initial state
2. Then `gsap.to(el, { yPercent: 0 })` to animate
3. OR use two `useGSAP` calls: first without deps (initial set), second with `[isLoaded]` (entrance)

## CRITICAL: overflow-x: hidden breaks position:sticky
**Problem**: `overflow-x: hidden` on `<body>` creates a scroll container. This breaks `position: sticky`
because sticky calculates relative to its scroll container, not the viewport.
**Fix**: Use `overflow-x: clip` instead. Clip doesn't create a scroll container.
```css
html, body { overflow-x: clip; }
```

## Hero Animation Pattern (two-useGSAP approach)
```tsx
// First useGSAP: scroll setup + initial state (no dependencies, runs once)
useGSAP(() => {
  gsap.set(['.line-1', '.line-2'], { yPercent: 110 })
  gsap.set('.hero-fade', { opacity: 0, y: 14 })
  // scroll triggers...
}, { scope: containerRef })

// Second useGSAP: entrance animation (fires when isLoaded changes)
useGSAP(() => {
  if (!isLoaded) return
  gsap.timeline().to(['.line-1', '.line-2'], { yPercent: 0, ... })
}, { dependencies: [isLoaded], scope: containerRef })
```

## Color Palette
- `--color-bg: #090909` — near-black
- `--color-fg: #f0ede8` — warm off-white
- `--color-accent: #c9a96e` — film amber/gold
- `--color-muted: #4a4a46`
- `--color-edge: #1c1c1a`

## Fonts in Tailwind v4
```css
@theme {
  --font-sans: var(--font-inter), ui-sans-serif, sans-serif;
  --font-display: var(--font-cormorant), "Cormorant Garamond", serif;
}
```
→ use as `font-sans` / `font-display` in JSX

## Lenis Wiring
```tsx
const lenis = new Lenis({ duration: 1.2, easing: ... })
lenis.on('scroll', ScrollTrigger.update)
const rafCallback = (time: number) => { lenis.raf(time * 1000) }
gsap.ticker.add(rafCallback)
gsap.ticker.lagSmoothing(0)
```

## Puppeteer Testing Note
`window.scrollTo()` in Puppeteer bypasses Lenis. ScrollTrigger doesn't update.
Scroll-triggered animations (opacity reveals, word reveals) won't fire in Puppeteer.
Work/Reel horizontal scroll and sticky DO work if `overflow-x: clip` is set.
Entrance animations (hero, contact) should be tested in a real browser.

## Open Questions (unresolved — ask before assuming)
- Final studio name ("Afterglow" is placeholder)
- Solo (Anu as face) vs. multi-editor house framing
- Hero: video loop vs. canvas image sequence (currently placeholder frame)
- CMS needs (hardcoded vs. Sanity/Contentful)
- Real email address for contact
- Real reel footage (currently placeholder dark frame)

## Client Content
- Studio: Afterglow (placeholder name)
- Clients: Netflix, NatGeo, Discovery, Mercedes, F1, L'Oréal, Prime Video, Disney+ Hotstar,
  JioCinema, Fox Life, Star Sports, Colors HD, NDTV Prime, Epic Channel, Olympic Channel
- Award: Best Editor Nominee, 24th Asian Television Awards 2019 (film: Tarini)
- Genre mix: Documentary, Sports, Reality, Travel, Ad-film

# currentDate
Today's date is 2026-08-01.
