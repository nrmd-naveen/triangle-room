'use client'

/**
 * WorkScrolly
 *
 * Pinned horizontal scrollytelling — one project per viewport.
 * The track slides left on vertical scroll (GSAP scrub).
 * Each panel: large main card filling the content height + 1-2 secondary 16:9
 * cards on the right that stagger in as the panel enters.
 *
 * Layout (desktop):
 *   ┌──────────────────────────────────────┬──────────┐
 *   │  main card (flex-1, fills height)    │  side 2  │
 *   │                                      ├──────────┤
 *   ├─────────────────────────────────┬────┤  side 3  │
 *   │  title · category · client      │ N  │          │
 *   └─────────────────────────────────┴────┴──────────┘
 */

import { useRef, useMemo } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS, type Work } from '@/components/works/data'
import type { WorkConfig } from '@/lib/site-config'

gsap.registerPlugin(ScrollTrigger)

// Hand-picked featured order — works without images are skipped
const FEATURED_TITLES = [
  'Tarini',
  'India from Above',
  'Formula 1 After Movie',
  'Fabulous Lives of Bollywood Wives',
  'Great Overland Adventure',
  'Doubles Trouble',
]

// ─── Sub-component ─────────────────────────────────────────────────────────────

function ProjectPanel({
  project,
  index,
}: {
  project: Work
  index: number
}) {
  const secondary = project.srcs.slice(1, 3) // up to 2 side cards

  return (
    <div
      className="work-scrolly-panel relative flex-none h-full flex flex-col"
      style={{
        width: '100vw',
        paddingTop: '106px',  // 54px nav + 44px top bar + 8px gap
        paddingBottom: '54px',
        paddingLeft: 'clamp(32px, 5vw, 80px)',
        paddingRight: 'clamp(32px, 5vw, 80px)',
      }}
    >
      <div className="flex-1 flex gap-4 min-h-0">

        {/* ── Main card + info below ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Large image card — fills all available height */}
          <div
            className="relative flex-1 overflow-hidden"
            style={{ background: project.accent }}
          >
            {project.srcs[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.srcs[0]}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            )}

            {/* Tone gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/20 to-transparent" />

            {/* TL: frame label */}
            <div className="absolute top-3.5 left-4 font-mono text-[8px] tracking-[0.28em] text-fg/40 select-none">
              × FRAME 01
            </div>

            {/* TR: genre */}
            <div className="absolute top-3.5 right-4 font-mono text-[8px] tracking-[0.2em] text-fg/32 uppercase select-none">
              {project.genre}
            </div>

            {/* BR: client */}
            {project.client && (
              <div className="absolute bottom-3.5 right-4 font-mono text-[8px] tracking-[0.2em] text-fg/32 uppercase select-none">
                {project.client}
              </div>
            )}
          </div>

          {/* Info row below the card */}
          <div className="panel-info flex items-end justify-between gap-6 flex-shrink-0">
            <div className="flex-1 min-w-0">
              {project.award && (
                <div className="mb-2.5 inline-flex items-center border border-accent/40 px-2.5 py-[5px]">
                  <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-accent leading-none">
                    {project.award}
                  </span>
                </div>
              )}
              <h2
                className="font-display text-fg font-light leading-[1.06] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(22px, 3vw, 48px)' }}
              >
                {project.title}
              </h2>
              <p className="mt-1.5 font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
                {project.category}
                {project.client ? ` · ${project.client}` : ''}
              </p>
            </div>

            {/* Ghost index — decorative */}
            <div
              className="flex-shrink-0 font-display text-fg/[0.055] font-light select-none leading-none"
              style={{ fontSize: 'clamp(52px, 7.5vw, 104px)' }}
              aria-hidden
            >
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* ── Side cards (desktop only) ── */}
        {secondary.length > 0 && (
          <div className="w-[23%] flex-shrink-0 hidden md:flex flex-col gap-3 justify-center">
            {secondary.map((src, fi) => (
              <div
                key={fi}
                className="side-card relative overflow-hidden"
                style={{ aspectRatio: '16/9', background: project.accent }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} — frame ${fi + 2}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  draggable={false}
                />
                {/* Uniform tint so side cards read as secondary */}
                <div className="absolute inset-0 bg-ink/30" />

                {/* Frame label */}
                <div className="absolute top-2 left-2.5 font-mono text-[7px] tracking-[0.25em] text-fg/38 select-none">
                  × FRAME 0{fi + 2}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main section ──────────────────────────────────────────────────────────────

export default function WorkScrolly({ works: worksProp }: { works?: WorkConfig[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const dotsRef    = useRef<(HTMLSpanElement | null)[]>([])
  const counterRef = useRef<HTMLSpanElement>(null)

  // Build featured list from props (config-driven) or fall back to hardcoded WORKS
  const FEATURED = useMemo<Work[]>(() => {
    const source: Work[] = worksProp
      ? worksProp.map((w, i) => ({ ...w, index: String(i + 1).padStart(2, '0') }))
      : WORKS
    return FEATURED_TITLES.reduce<Work[]>((acc, title) => {
      const found = source.find(w => w.title === title && w.srcs.length > 0)
      if (found) acc.push(found)
      return acc
    }, [])
  }, [worksProp])

  const n = FEATURED.length

  useGSAP(() => {
    if (!trackRef.current || !sectionRef.current || n < 2) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const panels = gsap.utils.toArray<HTMLElement>(
      '.work-scrolly-panel',
      sectionRef.current,
    )

    // Build timeline —
    // Track tween has duration (n-1) so panel i centers at t = i.
    const tl = gsap.timeline()

    tl.to(trackRef.current, {
      x: () => -(n - 1) * window.innerWidth,
      ease: 'none',
      duration: n - 1,
    })

    // Per-panel entry animations for panels 1 → n-1
    panels.forEach((panel, i) => {
      if (i === 0) return

      const sideCards = panel.querySelectorAll<HTMLElement>('.side-card')
      const infoEl    = panel.querySelector<HTMLElement>('.panel-info')

      // t = i (panel i centres at timeline time i)
      // Start the sub-animations ~0.35 time units before the panel centres.
      const t0 = i - 0.35

      if (sideCards.length > 0) {
        tl.from(
          sideCards,
          { opacity: 0, x: 28, stagger: 0.12, duration: 0.38, ease: 'power2.out' },
          t0,
        )
      }
      if (infoEl) {
        tl.from(
          infoEl,
          { opacity: 0, y: 16, duration: 0.3, ease: 'power2.out' },
          t0 + 0.04,
        )
      }
    })

    // Wire up ScrollTrigger
    ScrollTrigger.create({
      animation: tl,
      trigger: sectionRef.current,
      pin: true,
      pinSpacing: true,
      scrub: 1.6,
      start: 'top top',
      end: () => `+=${(n - 1) * window.innerHeight}`,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / (n - 1),
        duration: { min: 0.25, max: 0.65 },
        ease: 'power2.inOut',
        delay: 0.06,
      },
      onUpdate(self) {
        const activeIdx = Math.round(self.progress * (n - 1))

        dotsRef.current.forEach((dot, i) => {
          if (!dot) return
          dot.style.width   = i === activeIdx ? '32px' : '12px'
          dot.style.opacity = i === activeIdx ? '1'    : '0.28'
        })

        if (counterRef.current) {
          counterRef.current.textContent =
            `${String(activeIdx + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`
        }
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative overflow-hidden bg-ink"
      style={{ height: '100vh' }}
    >
      {/* ── Top bar — sits below the fixed nav (~54px tall) ── */}
      <div className="absolute inset-x-0 z-20 flex items-center justify-between px-8 md:px-16 lg:px-20 pointer-events-none"
        style={{ top: '54px', height: '44px' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.22em] text-accent">04</span>
          <span className="w-px h-3 bg-edge" />
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted">SELECTED WORK</span>
        </div>
        <span
          ref={counterRef}
          className="font-mono text-[10px] tracking-[0.18em] text-muted tabular-nums"
        >
          01 / {String(n).padStart(2, '0')}
        </span>
      </div>

      {/* ── Bottom bar: progress + corner marks ── */}
      <div
        className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between px-8 md:px-16 lg:px-20 pointer-events-none"
        style={{ height: '50px' }}
      >
        <span className="font-mono text-[9px] text-edge select-none">×</span>

        {/* Progress hairlines */}
        <div className="flex items-center gap-[7px]">
          {FEATURED.map((_, i) => (
            <span
              key={i}
              ref={el => { dotsRef.current[i] = el }}
              className="block h-px bg-fg transition-[width,opacity] ease-out"
              style={{
                width:   i === 0 ? 32 : 12,
                opacity: i === 0 ? 1 : 0.28,
                transitionDuration: '300ms',
              }}
            />
          ))}
        </div>

        <span className="font-mono text-[9px] text-edge select-none">×</span>
      </div>

      {/* ── Horizontal track ── */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${n * 100}vw`, willChange: 'transform' }}
      >
        {FEATURED.map((project, i) => (
          <ProjectPanel key={project.index} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
