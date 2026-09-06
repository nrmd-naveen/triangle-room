'use client'

/**
 * WorkDeckScroll
 *
 * Three project cards in a horizontal strip, driven by scroll.
 * The section pins; as the user scrolls the strip translates left and
 * each card passes through a "centre zone" — arriving scattered
 * (translate% + rotation) and settling to 0, then scattering out again.
 *
 * Scatter values are taken verbatim from the nabilissa.com devtools
 * screenshots — sect-3-img translate/rotate at entry, settled, and exit
 * states. Container translation mirrors the sect-3-photos translateX logic.
 *
 * Timeline (3 time-units, one phase per card):
 *   Phase 0→1 : Card 0 settles then exits  — container 0 → -STEP
 *   Phase 1→2 : Card 1 settles then exits  — container -STEP → -2×STEP
 *   Phase 2→3 : Card 2 settles and stays   — container -2×STEP (done)
 *
 * Mobile (<768 px): static fallback — cards shown in a horizontal scroll row,
 * no pin, no animation.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'
const r2 = (folder: string, file: string) =>
  `${R2}/${encodeURIComponent(folder)}/${file}`

const CARDS = [
  {
    title: 'India from Above',
    client: 'National Geographic',
    genre: 'Documentary Series',
    src: r2('India From Above', '01.jpg'),
  },
  {
    title: 'Formula 1 After Movie',
    client: 'Abu Dhabi Grand Prix',
    genre: 'Motorsport Film',
    src: r2('F1 After movie', '01.jpg'),
  },
  {
    title: 'Great Overland Adventure',
    client: 'Mercedes-Benz',
    genre: 'Travel Series',
    src: r2('overland', '01.jpg'),
  },
] as const

// Scatter values from nabilissa.com devtools
// (xPercent / yPercent are % of the card's own size, matching GSAP's convention)
const SCATTER_IN = [
  { xPercent:  18.85, yPercent:  42.16, rotation:  8.33  },
  { xPercent:  43.06, yPercent:  73.50, rotation: -18.82 },
  { xPercent: -43.14, yPercent:  66.60, rotation:  16.55 },
] as const

const SCATTER_OUT = [
  { xPercent: -38.03, yPercent: -85.04, rotation: -16.82 },
  { xPercent: -35.19, yPercent: -60.06, rotation:  15.38 },
  { xPercent:  27.74, yPercent: -42.83, rotation: -10.64 },
] as const

// ─── Card geometry ─────────────────────────────────────────────────────────────

const CARD_W    = 276  // px  — portrait
const CARD_H    = 390  // px  — portrait ≈ 0.71 aspect
const CARD_STEP = 330  // px  — centre-to-centre distance in the flex strip
// gap in the flex row = CARD_STEP - CARD_W = 54 px
const TOTAL_TRAVEL = (CARDS.length - 1) * CARD_STEP  // 660 px

// ─── Component ─────────────────────────────────────────────────────────────────

export default function WorkDeckScroll() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef  = useRef<HTMLDivElement>(null)
  const photosRef  = useRef<HTMLDivElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([null, null, null])

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile       = window.innerWidth < 768

    // Reduced-motion / mobile: static layout, no pin
    if (prefersReduced || isMobile) {
      gsap.set(photosRef.current, { x: -CARD_STEP }) // centre the middle card
      gsap.set(cardRefs.current, { xPercent: 0, yPercent: 0, rotation: 0 })
      return
    }

    const cards = cardRefs.current as HTMLDivElement[]

    // Set the initial scatter state for every card
    SCATTER_IN.forEach((s, i) => {
      gsap.set(cards[i], { xPercent: s.xPercent, yPercent: s.yPercent, rotation: s.rotation })
    })

    /**
     * Main timeline — total duration 3 units.
     * ScrollTrigger maps scroll progress (0→1) → timeline progress (0→3),
     * so each unit = (scrollDistance / 3) of actual scroll travel.
     */
    const tl = gsap.timeline()

    // Container translates left linearly across the full 3 units
    tl.fromTo(
      photosRef.current,
      { x: 0 },
      { x: -TOTAL_TRAVEL, ease: 'none', duration: 3 },
      0
    )

    // ── Card 0: settle 0→0.5, exit 0.6→1.2 ──────────────────────────────────
    tl.to(cards[0], {
      xPercent: 0, yPercent: 0, rotation: 0,
      duration: 0.5, ease: 'power3.out',
    }, 0)
    tl.to(cards[0], {
      xPercent: SCATTER_OUT[0].xPercent,
      yPercent: SCATTER_OUT[0].yPercent,
      rotation:  SCATTER_OUT[0].rotation,
      duration: 0.65, ease: 'power2.in',
    }, 0.65)

    // ── Card 1: settle 1.0→1.5, exit 1.65→2.3 ───────────────────────────────
    tl.to(cards[1], {
      xPercent: 0, yPercent: 0, rotation: 0,
      duration: 0.5, ease: 'power3.out',
    }, 1.0)
    tl.to(cards[1], {
      xPercent: SCATTER_OUT[1].xPercent,
      yPercent: SCATTER_OUT[1].yPercent,
      rotation:  SCATTER_OUT[1].rotation,
      duration: 0.65, ease: 'power2.in',
    }, 1.65)

    // ── Card 2: settle 2.5→3.0, stays settled ────────────────────────────────
    tl.to(cards[2], {
      xPercent: 0, yPercent: 0, rotation: 0,
      duration: 0.5, ease: 'power3.out',
    }, 2.5)

    ScrollTrigger.create({
      trigger:      wrapperRef.current,
      start:        'top top',
      end:          () => '+=' + window.innerHeight * 2.6,
      scrub:        1.2,
      pin:          stickyRef.current,
      anticipatePin: 1,
      animation:    tl,
    })
  }, { scope: wrapperRef })

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div ref={wrapperRef}>
      <div
        ref={stickyRef}
        className="relative bg-bg"
        style={{ height: '100svh', overflow: 'hidden' }}
      >

        {/* ── Left text panel ────────────────────────────────────────────── */}
        <div
          className="absolute left-0 top-0 h-full flex flex-col justify-center z-20 pointer-events-none"
          style={{ width: '40%', padding: '0 clamp(2rem, 5vw, 5rem)' }}
        >
          <p className="font-mono text-[9px] tracking-[0.42em] uppercase text-muted mb-10">
            Selected Work
          </p>
          <h2
            className="font-display text-ink leading-[1.0] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(2.4rem, 4.8vw, 5rem)', fontWeight: 300 }}
          >
            18 years of<br />cinematic craft
          </h2>
          <p
            className="mt-8 text-muted leading-relaxed"
            style={{
              fontFamily: 'var(--font-dmsans)',
              fontSize: '0.82rem',
              maxWidth: '22ch',
            }}
          >
            Documentary. Sport. Reality. Travel.
            <br />
            Shaped for streaming and broadcast.
          </p>
        </div>

        {/* ── Card strip ─────────────────────────────────────────────────── */}
        {/*
          photosRef is a flex row. Its left edge is positioned so that
          card 0's centre aligns with the right 60 % zone's midpoint (≈70 % of vw).
          Formula: left = 70vw − CARD_W/2.
          As GSAP translates x by −TOTAL_TRAVEL, each successive card sweeps
          through that same 70 % centre point.
        */}
        <div
          ref={photosRef}
          className="absolute flex"
          style={{
            top:       '50%',
            left:      `calc(70% - ${CARD_W / 2}px)`,
            transform: 'translateY(-50%)',
            gap:       `${CARD_STEP - CARD_W}px`,
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              className="flex-none relative overflow-hidden"
              style={{
                width:           CARD_W,
                height:          CARD_H,
                borderRadius:    3,
                transformOrigin: 'center center',
                boxShadow:       '0 28px 72px rgba(0,0,0,0.18), 0 6px 20px rgba(0,0,0,0.10)',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.src}
                alt={card.title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              />

              {/* Caption gradient ------------------------------------------ */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-5"
                style={{
                  background:
                    'linear-gradient(to top, rgba(13,13,11,0.88) 0%, transparent 100%)',
                }}
              >
                <p className="font-mono text-[7.5px] tracking-[0.28em] uppercase mb-1.5 leading-none"
                  style={{ color: 'rgba(245,244,240,0.45)' }}>
                  {card.genre}
                </p>
                <p
                  className="leading-tight"
                  style={{
                    fontFamily: 'var(--font-spacegrotesk)',
                    fontWeight: 300,
                    fontSize:   '0.88rem',
                    color:      '#F5F4F0',
                  }}
                >
                  {card.title}
                </p>
                <p className="font-mono text-[7px] tracking-[0.2em] uppercase mt-1 leading-none"
                  style={{ color: 'rgba(245,244,240,0.32)' }}>
                  {card.client}
                </p>
              </div>

              {/* Card index ------------------------------------------------ */}
              <div className="absolute top-3 right-3">
                <span className="font-mono text-[8px] tracking-[0.18em]"
                  style={{ color: 'rgba(245,244,240,0.38)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom-right label ─────────────────────────────────────────── */}
        <div className="absolute bottom-8 right-10 z-20 pointer-events-none">
          <span className="font-mono text-[8px] tracking-[0.32em] uppercase text-muted/50">
            {String(CARDS.length).padStart(2, '0')} featured
          </span>
        </div>

      </div>
    </div>
  )
}
