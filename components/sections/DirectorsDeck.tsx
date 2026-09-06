'use client'

/**
 * DirectorsDeck
 *
 * Three founders as scroll-driven portrait cards on an ink background.
 * Animation: card strip translates horizontally while pinned; each card
 * enters scattered, snaps to the focal column, then exits scattered.
 *
 * Mobile (<768px): plain column, no pin, no animation.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import type { Director } from '@/lib/site-config'

gsap.registerPlugin(ScrollTrigger)

// ─── Default content (used when no prop is passed) ─────────────────────────────

const DEFAULT_DIRECTORS: Director[] = [
  {
    name:     'Anu Kamala',
    role:     'Story & Post',
    years:    '18+',
    note:     'Series editor, The Greatest Rivalry. Film editor, Tarini. Best Editor — Asian Television Awards 2019.',
    portrait: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    name:     'Midhuna Pichy',
    role:     'Production & Delivery',
    years:    '11+',
    note:     'Three seasons of Bigg Boss Malayalam. Episode, post and creative producer across seven international formats.',
    portrait: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name:     'Jibin Babu',
    role:     'Development & Writing',
    years:    '9+',
    note:     'Writer-director. Pachamarakaikal — two Kerala State Awards. Music Mojo Season 7, Kappa TV.',
    portrait: 'https://randomuser.me/api/portraits/men/47.jpg',
  },
]

// ─── Scatter values ─────────────────────────────────────────────────────────────

const SCATTER_IN = [
  { xPercent:  16, yPercent:  38, rotation:  7.5,  scale: 0.93, opacity: 0 },
  { xPercent:  40, yPercent:  68, rotation: -17,   scale: 0.93, opacity: 0 },
  { xPercent: -40, yPercent:  62, rotation:  15,   scale: 0.93, opacity: 0 },
] as const

const SCATTER_OUT = [
  { xPercent: -36, yPercent: -80, rotation: -15,   scale: 0.93 },
  { xPercent: -33, yPercent: -56, rotation:  14,   scale: 0.93 },
  { xPercent:  26, yPercent: -40, rotation: -10,   scale: 0.93 },
] as const

// ─── Card geometry ─────────────────────────────────────────────────────────────

const CARD_W    = 340   // px
const CARD_H    = 520   // px
const CARD_STEP = 400   // px centre-to-centre
const FOCAL_LEFT = `calc(68% - ${CARD_W / 2}px)`
const SETTLED    = { xPercent: 0, yPercent: 0, rotation: 0, scale: 1 }

// ─── Component ─────────────────────────────────────────────────────────────────

export default function DirectorsDeck({ directors: directorsProp }: { directors?: Director[] }) {
  const DIRECTORS    = directorsProp ?? DEFAULT_DIRECTORS
  const TOTAL_TRAVEL = (DIRECTORS.length - 1) * CARD_STEP
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const photosRef  = useRef<HTMLDivElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>(DIRECTORS.map(() => null))

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile       = window.innerWidth < 768

    if (prefersReduced || isMobile) {
      gsap.set(photosRef.current, { x: -CARD_STEP })
      gsap.set(cardRefs.current, { xPercent: 0, yPercent: 0, rotation: 0, scale: 1 })
      return
    }

    const cards = cardRefs.current as HTMLDivElement[]

    SCATTER_IN.forEach((s, i) => {
      gsap.set(cards[i], {
        xPercent:   s.xPercent,
        yPercent:   s.yPercent,
        rotation:   s.rotation,
        scale:      s.scale,
        willChange: 'transform',
      })
    })

    const tl = gsap.timeline()

    tl.fromTo(
      photosRef.current,
      { x: 0 },
      { x: -TOTAL_TRAVEL, ease: 'none', duration: 3 },
      0
    )

    // Card 0
    tl.to(cards[0], { ...SETTLED,       duration: 0.52, ease: 'expo.out'   }, 0)
    tl.to(cards[0], { opacity: 1,        duration: 0.55, ease: 'power2.out' }, 0)
    tl.to(cards[0], { ...SCATTER_OUT[0], duration: 0.72, ease: 'power3.in' }, 0.75)
    tl.to(cards[0], { opacity: 0,        duration: 0.60, ease: 'power2.in' }, 0.75)

    // Card 1
    tl.to(cards[1], { ...SETTLED,       duration: 0.52, ease: 'expo.out'   }, 1.1)
    tl.to(cards[1], { opacity: 1,        duration: 0.55, ease: 'power2.out' }, 1.1)
    tl.to(cards[1], { ...SCATTER_OUT[1], duration: 0.72, ease: 'power3.in' }, 1.85)
    tl.to(cards[1], { opacity: 0,        duration: 0.60, ease: 'power2.in' }, 1.85)

    // Card 2 — settles and stays
    tl.to(cards[2], { ...SETTLED, duration: 0.52, ease: 'expo.out'   }, 2.48)
    tl.to(cards[2], { opacity: 1,  duration: 0.55, ease: 'power2.out' }, 2.48)

    ScrollTrigger.create({
      trigger:       wrapperRef.current,
      start:         'top top',
      end:           () => '+=' + window.innerHeight * 3.2,
      scrub:         1.5,
      pin:           stickyRef.current,
      anticipatePin: 1,
      animation:     tl,
    })
  }, { scope: wrapperRef })

  // ─── JSX ───────────────────────────────────────────────────────────────────

  return (
    <div id="directors">
      {/* ── Mobile layout ─────────────────────────────────────────────────── */}
      <section className="block md:hidden bg-ink px-6 py-24">
        {/* Label */}
        <p className="font-mono text-[9px] tracking-[0.42em] uppercase mb-3"
           style={{ color: 'rgba(243,244,240,0.25)' }}>
          The three directors
        </p>
        <h2
          className="font-display leading-[1.0] tracking-[-0.025em] mb-14"
          style={{ fontSize: 'clamp(2.4rem, 10vw, 3.6rem)', fontWeight: 300, color: 'rgba(243,244,240,0.88)' }}
        >
          Three makers,<br />one room.
        </h2>

        <div className="flex flex-col gap-10">
          {DIRECTORS.map((d) => (
            <div key={d.name} className="flex gap-5 items-start">
              <div
                className="flex-none overflow-hidden"
                style={{ width: 80, height: 106, borderRadius: 3, background: '#1C1F1B' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.portrait} alt={d.name}
                  loading="lazy" decoding="async"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
              </div>

              <div>
                <p className="font-display leading-tight mb-1"
                   style={{ fontWeight: 400, fontSize: '1rem', letterSpacing: '-0.01em', color: '#F3F4F0' }}>
                  {d.name}
                </p>
                <p className="font-mono text-[8px] tracking-[0.3em] uppercase mb-3"
                   style={{ color: 'var(--color-green)' }}>
                  {d.role}
                </p>
                <p className="font-sans leading-[1.65]"
                   style={{ fontSize: '0.75rem', color: 'rgba(243,244,240,0.42)' }}>
                  {d.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Desktop animated layout ───────────────────────────────────────── */}
      <div ref={wrapperRef} className="hidden md:block">
        <div
          ref={stickyRef}
          style={{ height: '100svh', overflow: 'hidden', background: '#141714', position: 'relative' }}
        >
          {/* Corner detail — consistent with Hero */}
          <div className="absolute top-6 right-8 font-mono text-[9px] tracking-[0.38em] pointer-events-none select-none"
               style={{ color: 'rgba(243,244,240,0.12)' }} aria-hidden>
            02
          </div>
          <div className="absolute bottom-14 left-8 font-mono text-[11px] pointer-events-none select-none"
               style={{ color: 'rgba(243,244,240,0.10)' }} aria-hidden>×</div>
          <div className="absolute bottom-14 right-8 font-mono text-[11px] pointer-events-none select-none"
               style={{ color: 'rgba(243,244,240,0.10)' }} aria-hidden>×</div>

          {/* Top hairline */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(243,244,240,0.06)' }} />

          {/* ── Left text panel ─────────────────────────────────────────── */}
          <div
            className="absolute left-0 top-0 h-full flex flex-col justify-center z-20 pointer-events-none"
            style={{ width: '38%', padding: '0 clamp(2.5rem, 5vw, 5.5rem)' }}
          >
            <p className="font-mono text-[9px] tracking-[0.42em] uppercase mb-5"
               style={{ color: 'rgba(243,244,240,0.25)' }}>
              The three directors
            </p>

            <h2
              className="font-display leading-[1.0] tracking-[-0.025em]"
              style={{ fontSize: 'clamp(2.8rem, 4.8vw, 5.2rem)', fontWeight: 300, color: 'rgba(243,244,240,0.90)' }}
            >
              Three makers,<br />one room.
            </h2>

            {/* Hairline separator */}
            <div className="my-8" style={{ width: 40, height: 1, background: 'rgba(243,244,240,0.12)' }} />

            <p className="font-sans leading-relaxed"
               style={{ fontSize: '0.82rem', maxWidth: '24ch', color: 'rgba(243,244,240,0.40)' }}>
              Combined 38 years across broadcast,
              streaming and ad film.
            </p>

            {/* Year range label */}
            <p className="font-mono text-[8.5px] tracking-[0.32em] uppercase mt-10"
               style={{ color: 'rgba(243,244,240,0.18)' }}>
              Est. 2025 · Trivandrum
            </p>
          </div>

          {/* ── Card strip ─────────────────────────────────────────────── */}
          <div
            ref={photosRef}
            className="absolute flex"
            style={{
              top:       '50%',
              left:      FOCAL_LEFT,
              transform: 'translateY(-50%)',
              gap:       `${CARD_STEP - CARD_W}px`,
            }}
          >
            {DIRECTORS.map((d, i) => (
              <div
                key={i}
                ref={el => { cardRefs.current[i] = el }}
                className="flex-none relative overflow-hidden"
                style={{
                  width:           CARD_W,
                  height:          CARD_H,
                  borderRadius:    4,
                  transformOrigin: 'center center',
                  background:      '#1C1F1B',
                  boxShadow:       '0 40px 100px rgba(0,0,0,0.55), 0 10px 30px rgba(0,0,0,0.30)',
                }}
              >
                {/* Portrait */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.portrait} alt={d.name}
                  loading="lazy" decoding="async"
                  className="absolute inset-x-0 top-0 w-full pointer-events-none select-none"
                  style={{ height: '60%', objectFit: 'cover', objectPosition: 'center top' }}
                />

                {/* Gradient bridge */}
                <div className="absolute inset-x-0" style={{
                  top:        'calc(60% - 64px)',
                  height:     64,
                  background: 'linear-gradient(to bottom, transparent, #1C1F1B)',
                  pointerEvents: 'none',
                }} />

                {/* Info band */}
                <div className="absolute inset-x-0 bottom-0 px-6 pt-3 pb-7"
                     style={{ background: '#1C1F1B' }}>

                  {/* Green accent line above name */}
                  <div style={{ width: 24, height: 1.5, background: 'var(--color-green)', marginBottom: '0.75rem', opacity: 0.7 }} />

                  <p className="font-display leading-tight mb-1"
                     style={{ fontWeight: 400, fontSize: '1.05rem', letterSpacing: '-0.015em', color: '#F3F4F0' }}>
                    {d.name}
                  </p>

                  <p className="font-mono text-[8px] tracking-[0.30em] uppercase mb-4 leading-none"
                     style={{ color: 'var(--color-green)' }}>
                    {d.role}
                  </p>

                  <p className="font-sans leading-[1.65]"
                     style={{ fontSize: '0.73rem', color: 'rgba(243,244,240,0.42)' }}>
                    {d.note}
                  </p>
                </div>

                {/* Experience badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-[2px]"
                     style={{ background: 'rgba(20,23,20,0.72)', backdropFilter: 'blur(6px)' }}>
                  <span className="font-mono text-[7.5px] tracking-[0.20em]"
                        style={{ color: 'rgba(243,244,240,0.40)' }}>
                    {d.years} yrs
                  </span>
                </div>

                {/* Bottom hairline on card */}
                <div className="absolute bottom-0 left-0 right-0 h-px"
                     style={{ background: 'rgba(21,122,80,0.20)' }} />
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
