'use client'

/**
 * FeaturedGrid — scroll-driven parallax reveal
 *
 * Each project panel lifecycle (driven by scrubbed timeline):
 *
 *   1. ENTER  — panel slides down from above + fades in
 *   2. ACTIVE — panel sits still; inner image parallaxes slower than scroll;
 *               left image crossfades through project srcs
 *   3. EXIT   — panel slides back up + fades out; next panel enters
 *
 * Panel 0 starts visible (no entry animation).
 * Panels stack by z-index; incoming panel overlaps outgoing near the cut point.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS, type Work } from '@/components/works/data'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ──────────────────────────────────────────────────────────────────────

const FEATURED_KEYS = [
  'India from Above',
  'Formula 1 After Movie',
  'Fabulous Lives of Bollywood Wives',
  'Doubles Trouble',
]

const FEATURED: Work[] = FEATURED_KEYS.reduce<Work[]>((acc, key) => {
  const w = WORKS.find(w => w.title === key && w.srcs.length >= 2)
  if (w) acc.push(w)
  return acc
}, [])

// ─── Section ───────────────────────────────────────────────────────────────────

export default function FeaturedGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const dotsRef    = useRef<(HTMLSpanElement | null)[]>([])

  const n = FEATURED.length

  useGSAP(() => {
    if (!sectionRef.current || n < 2) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const panels = gsap.utils.toArray<HTMLElement>('.fg-panel', sectionRef.current)
    const tl     = gsap.timeline()

    // Initialise: panel 0 already visible; all others hidden above
    panels.forEach((panel, i) => {
      if (i === 0) return
      gsap.set(panel, { opacity: 0, yPercent: -8 })
    })

    panels.forEach((panel, i) => {
      const imgInner = panel.querySelector<HTMLElement>('.fg-img-inner')
      const leftImgs = panel.querySelectorAll<HTMLElement>('.fg-left-img')
      const infoEl   = panel.querySelector<HTMLElement>('.fg-info')

      // Beat boundaries for this panel
      // Panel i is "centred" at t = i (snap point)
      // Active window  : i      → i + 0.65
      // Exit window    : i+0.60 → i + 1.0   (except last panel)
      // Next entry     : i+0.65 → i + 1.0

      // ── 1. ENTRY (panels 1+) ────────────────────────────────────────────────
      if (i > 0) {
        tl.fromTo(
          panel,
          { opacity: 0, yPercent: -8 },
          { opacity: 1, yPercent: 0, duration: 0.35, ease: 'power2.out' },
          i - 0.35,   // starts slightly before the previous panel finishes exiting
        )

        if (infoEl) {
          tl.fromTo(
            infoEl,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
            i - 0.1,
          )
        }
      }

      // ── 2. ACTIVE — inner image parallaxes while panel is stationary ─────────
      if (imgInner) {
        tl.fromTo(
          imgInner,
          { yPercent: -7 },
          { yPercent: 7, ease: 'none', duration: 0.65 },
          i,          // runs during the panel's active window
        )
      }

      // ── 3. IMAGE CYCLING — crossfade through srcs during active window ───────
      if (leftImgs.length > 1) {
        const m    = leftImgs.length
        const step = 0.50 / (m - 1)   // spread across t = i+0.05 → i+0.55

        leftImgs.forEach((img, j) => {
          if (j === 0) return
          const t = i + 0.05 + step * j

          tl.fromTo(img,
            { opacity: 0 },
            { opacity: 1, duration: 0.20, ease: 'power2.inOut' },
            t,
          )
          tl.fromTo(leftImgs[j - 1],
            { opacity: 1 },
            { opacity: 0, duration: 0.20, ease: 'power2.inOut' },
            t,
          )
        })
      }

      // ── 4. EXIT (all except last panel) ─────────────────────────────────────
      if (i < n - 1) {
        if (infoEl) {
          tl.fromTo(
            infoEl,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -10, duration: 0.20, ease: 'power2.in' },
            i + 0.60,
          )
        }

        tl.fromTo(
          panel,
          { opacity: 1, yPercent: 0 },
          { opacity: 0, yPercent: -8, duration: 0.35, ease: 'power2.in' },
          i + 0.65,
        )
      }
    })

    // ── ScrollTrigger ─────────────────────────────────────────────────────────
    ScrollTrigger.create({
      animation: tl,
      trigger:   sectionRef.current,
      pin:       true,
      pinSpacing: true,
      scrub:     0.55,    // tight enough to feel physical; slight smoothing
      start:     'top top',
      end:       () => `+=${(n - 1) * window.innerHeight}`,
      invalidateOnRefresh: true,
      snap: {
        snapTo: 1 / (n - 1),
        duration: { min: 0.3, max: 0.65 },
        ease: 'power2.inOut',
        delay: 0.08,
      },
      onUpdate(self) {
        const idx = Math.round(self.progress * (n - 1))
        dotsRef.current.forEach((dot, di) => {
          if (!dot) return
          dot.style.width   = di === idx ? '28px' : '10px'
          dot.style.opacity = di === idx ? '1'    : '0.3'
        })
        if (counterRef.current) {
          counterRef.current.textContent =
            `${String(idx + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`
        }
      },
    })
  }, { scope: sectionRef })

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* ── Top bar ── */}
      <div
        className="absolute inset-x-0 z-[200] flex items-center justify-between pointer-events-none px-8 md:px-16 lg:px-20"
        style={{ top: 0, height: '54px' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.22em] text-accent">03</span>
          <span className="w-px h-3 bg-edge" />
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted">FEATURED WORK</span>
        </div>
        <span
          ref={counterRef}
          className="font-mono text-[10px] tracking-[0.18em] text-muted tabular-nums"
        >
          01 / {String(n).padStart(2, '0')}
        </span>
      </div>

      {/* ── Bottom progress ── */}
      <div
        className="absolute bottom-0 inset-x-0 z-[200] flex items-center justify-between pointer-events-none px-8 md:px-16 lg:px-20"
        style={{ height: '50px' }}
      >
        <span className="font-mono text-[9px] text-edge select-none">×</span>
        <div className="flex items-center gap-[7px]">
          {FEATURED.map((_, i) => (
            <span
              key={i}
              ref={el => { dotsRef.current[i] = el }}
              className="block h-px bg-fg transition-[width,opacity] ease-out"
              style={{
                width:              i === 0 ? 28 : 10,
                opacity:            i === 0 ? 1  : 0.3,
                transitionDuration: '280ms',
              }}
            />
          ))}
        </div>
        <span className="font-mono text-[9px] text-edge select-none">×</span>
      </div>

      {/* ── Panels ── */}
      <div className="absolute inset-0">
        {FEATURED.map((project, i) => {
          const secondary = project.srcs.slice(1, 3)

          return (
            <div
              key={project.index}
              className="fg-panel absolute inset-0 flex flex-col bg-ink"
              style={{
                paddingTop:    '64px',
                paddingBottom: '58px',
                zIndex: i + 1,
                // Panel 0 visible; others are initialised by GSAP in useGSAP
                opacity: i === 0 ? 1 : undefined,
              }}
            >
              <div className="flex flex-1 min-h-0 gap-4 px-8 md:px-16 lg:px-20">

                {/* ── LEFT: image frame with parallax inner ── */}
                <div className="flex-1 min-w-0 flex flex-col gap-3">
                  <div className="relative flex-1 overflow-hidden">

                    {/* Inner div is taller than container; GSAP shifts it for parallax */}
                    <div
                      className="fg-img-inner absolute inset-x-0 will-change-transform"
                      style={{ top: '-7%', height: '114%' }}
                    >
                      {project.srcs.map((src, j) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={src}
                          src={src}
                          alt={`${project.title} — frame ${j + 1}`}
                          draggable={false}
                          className="fg-left-img absolute inset-0 w-full h-full object-cover"
                          style={{ opacity: j === 0 ? 1 : 0, zIndex: j }}
                        />
                      ))}
                    </div>

                    {/* Gradient + labels on top */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" style={{ zIndex: 20 }} />
                    <div className="absolute top-3.5 left-4 font-mono text-[8px] tracking-[0.28em] text-fg/40 select-none" style={{ zIndex: 21 }}>
                      × FRAME 01
                    </div>
                    <div className="absolute top-3.5 right-4 font-mono text-[8px] tracking-[0.2em] text-fg/35 uppercase select-none" style={{ zIndex: 21 }}>
                      {project.genre}
                    </div>
                  </div>

                  {/* Info row */}
                  <div
                    className="fg-info flex items-end justify-between gap-6 flex-shrink-0"
                    style={{ opacity: i === 0 ? 1 : 0 }}
                  >
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
                    <div
                      className="flex-shrink-0 font-display text-fg/[0.055] font-light select-none leading-none"
                      style={{ fontSize: 'clamp(52px, 7.5vw, 104px)' }}
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT: secondary 16:9 thumbnails ── */}
                {secondary.length > 0 && (
                  <div className="w-[26%] flex-shrink-0 hidden md:flex flex-col gap-3 justify-center">
                    {secondary.map((src, j) => (
                      <div
                        key={src}
                        className="relative overflow-hidden"
                        style={{ aspectRatio: '16 / 9' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${project.title} — frame ${j + 2}`}
                          draggable={false}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-ink/30" />
                        <div className="absolute top-2 left-2.5 font-mono text-[7px] tracking-[0.25em] text-fg/38 select-none">
                          × FRAME 0{j + 2}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
