'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LINES = [
  { text: 'New company.',                     bgL: -20, bgR: -44, initX:  -14, initRot: -2.2, y: 480, x: -120, rotation: -14, origin: '25% 50%' },
  { text: 'Not new at this.',                 bgL: -16, bgR: -28, initX:   22, initRot:  1.6, y: 580, x:  130, rotation:  18, origin: '72% 50%' },
  { text: 'Three careers. One company.',      bgL: -28, bgR: -56, initX:  -10, initRot: -1.0, y: 680, x:  -90, rotation: -22, origin: '18% 50%' },
  { text: "Very little we haven't shipped.",  bgL: -22, bgR: -40, initX:   18, initRot:  2.4, y: 780, x:  110, rotation:  20, origin: '80% 50%' },
]

// Each card's entrance resting position (scattered before settling)
const MOBILE_SCATTER_IN = [
  { x: -28, y: 36, rotation: -4 },
  { x:  32, y: 48, rotation:  3.5 },
  { x: -20, y: 60, rotation: -3 },
  { x:  24, y: 72, rotation:  4 },
]

export default function ScatterStatementV1() {
  const sectionRef  = useRef<HTMLElement>(null)   // desktop section
  const mobileRef   = useRef<HTMLElement>(null)   // mobile section

  // ── Desktop scatter animation ─────────────────────────────────────────────
  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    if (prefersReduced || isMobile) return

    const lines = sectionRef.current?.querySelectorAll<HTMLElement>('.scatter-line')
    if (!lines?.length) return

    lines.forEach((line, i) => {
      gsap.set(line, {
        transformOrigin: LINES[i].origin,
        x:        LINES[i].initX,
        rotation: LINES[i].initRot,
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1200',
        scrub: 1.8,
        pin: true,
      },
    })

    const heading = sectionRef.current?.querySelector<HTMLElement>('.scatter-heading')
    if (heading) {
      tl.to(heading, { opacity: 0, y: -16, ease: 'power2.in', duration: 0.3 }, 0)
    }

    lines.forEach((line, i) => {
      const { rotation, y, x } = LINES[i]
      const delay = i * 0.14
      tl.to(line, { y, x, rotation, opacity: 0, ease: 'power3.in', duration: 1 }, delay)
      const bg = line.querySelector<HTMLElement>('.line-bg')
      if (bg) {
        tl.to(bg, { x: rotation > 0 ? -32 : 32, scaleX: 0.82, ease: 'power3.in', duration: 1 }, delay)
      }
    })
  }, { scope: sectionRef })

  // ── Mobile scroll-driven scatter-settle animation ─────────────────────────
  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    if (!isMobile || prefersReduced) return

    const cards = mobileRef.current?.querySelectorAll<HTMLElement>('.scatter-mobile-card')
    if (!cards?.length) return

    // Set cards to their scattered starting position
    cards.forEach((card, i) => {
      gsap.set(card, {
        opacity:  0,
        x:        MOBILE_SCATTER_IN[i].x,
        y:        MOBILE_SCATTER_IN[i].y,
        rotation: MOBILE_SCATTER_IN[i].rotation,
        transformOrigin: 'center center',
      })
    })

    // Pin the section; scrub cards into position one by one, then let them scatter out
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mobileRef.current,
        start: 'top top',
        end: '+=1000',
        scrub: 1.6,
        pin: true,
        invalidateOnRefresh: true,
      },
    })

    // Phase 1: cards settle from scattered to resting
    cards.forEach((card, i) => {
      tl.to(card, {
        opacity:  1,
        x:        0,
        y:        0,
        rotation: 0,
        duration: 0.5,
        ease:     'power2.out',
      }, i * 0.42)
    })

    // Phase 2: brief hold with all cards visible (natural pause as you reach end of pin)
    // (just the last card staying settled handles this)

    // Phase 3: scatter exit — cards fly out in different directions
    cards.forEach((card, i) => {
      const out = LINES[i] // borrow the desktop exit values
      tl.to(card, {
        x:        out.x * 0.6,
        y:        -(out.y * 0.35),
        rotation: out.rotation * 0.7,
        opacity:  0,
        duration: 0.45,
        ease:     'power3.in',
      }, cards.length * 0.42 + 0.3 + i * 0.1)
    })
  }, { scope: mobileRef })

  return (
    <>
      {/* ── Mobile version ────────────────────────────────────────────────── */}
      <section
        ref={mobileRef}
        className="block md:hidden relative bg-paper overflow-hidden"
        style={{ minHeight: '100svh' }}
      >
        {/* Top hairline */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(13,13,11,0.07)' }} />

        <div className="flex flex-col items-center justify-center px-6 py-24" style={{ minHeight: '100svh' }}>
          <p
            className="font-mono mb-10 self-start"
            style={{ fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(13,13,11,0.28)' }}
          >
            Where we&apos;ve been
          </p>

          <div className="flex flex-col gap-3 w-full">
            {LINES.map((line, i) => (
              <div
                key={i}
                className="scatter-mobile-card relative overflow-hidden will-change-transform"
                style={{ borderRadius: 2 }}
              >
                {/* Green card bg */}
                <span
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, #136644 0%, #0D4A31 45%, #093321 100%)',
                    boxShadow: '0 4px 20px rgba(13,74,49,0.20)',
                  }}
                />
                {/* Text */}
                <span
                  className="relative font-display block select-none"
                  style={{
                    fontSize: 'clamp(1.55rem, 6.5vw, 2.2rem)',
                    fontWeight: 700,
                    lineHeight: 1.18,
                    letterSpacing: '-0.025em',
                    padding: '0.2em 0.55em',
                    color: '#F3F4F0',
                    textShadow: '0 1px 3px rgba(0,0,0,0.18)',
                  }}
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Desktop version ───────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        className="hidden md:flex relative h-screen bg-paper items-center justify-center overflow-hidden"
      >
        <div className="text-center w-full px-8">

          <h2
            className="scatter-heading font-display mb-14"
            style={{
              fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
              fontWeight: 300,
              letterSpacing: '0.01em',
              color: 'rgba(13,13,11,0.30)',
            }}
          >
            Where we&apos;ve been. What we&apos;ve built.
          </h2>

          <div className="flex flex-col items-center" style={{ gap: '0.72em' }}>
            {LINES.map((line, i) => (
              <div
                key={i}
                className="scatter-line relative will-change-transform"
                style={{ zIndex: LINES.length - i }}
              >
                <span
                  className="line-bg absolute inset-y-0 pointer-events-none will-change-transform"
                  style={{
                    left:         `${line.bgL}px`,
                    right:        `${line.bgR}px`,
                    background:   'linear-gradient(180deg, #136644 0%, #0D4A31 45%, #093321 100%)',
                    boxShadow:    '0 8px 32px rgba(13,74,49,0.22), 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.12)',
                    borderRadius: '2px',
                    zIndex:       -1,
                  }}
                />
                <span
                  className="line-text relative font-display select-none"
                  style={{
                    fontSize:      'clamp(2.4rem, 6vw, 5.2rem)',
                    fontWeight:    700,
                    lineHeight:    1.15,
                    letterSpacing: '-0.03em',
                    display:       'block',
                    padding:       '0.08em 0.5em',
                    color:         '#F3F4F0',
                    textShadow:    '0 1px 3px rgba(0,0,0,0.20)',
                    zIndex:        0,
                    whiteSpace:    'nowrap',
                  }}
                >
                  {line.text}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
