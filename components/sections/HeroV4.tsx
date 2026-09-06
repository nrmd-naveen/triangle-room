'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DISCIPLINES = [
  'Documentary', 'Reality', 'Live', 'Music', 'Fiction', 'Audio Drama', 'Ad-Film', 'Post',
]

interface Props { isLoaded: boolean }

/**
 * V4 — "Fog of Creation"
 *
 * Three heavy mist clouds start stacked over the center of the viewport,
 * completely obscuring the hero content behind a wall of atmosphere.
 * On load, the clouds slowly part — drifting to opposite corners — while
 * the headline sharpens from a soft blur into crisp type.
 *
 * The moment the text clears is the signature: the name emerging as if the
 * room is materialising for the first time. Like watching a photograph develop.
 *
 * On scroll, the residual mist follows at different parallax depths —
 * some close, some distant — creating a sense of genuine atmospheric space.
 */
export default function HeroV4({ isLoaded }: Props) {
  const containerRef = useRef<HTMLElement>(null)
  const mistARef = useRef<HTMLDivElement>(null)
  const mistBRef = useRef<HTMLDivElement>(null)
  const mistCRef = useRef<HTMLDivElement>(null)

  // ── Scroll animations (run independently of load) ────────────────────────────
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // Mist A (upper-left anchor) — slow drift, deep plane
    gsap.to(mistARef.current, {
      y: '-12vh',
      x: '-6vw',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 3,
      },
    })

    // Mist B (upper-right) — slightly faster, mid plane
    gsap.to(mistBRef.current, {
      y: '-18vh',
      x: '8vw',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 2.2,
      },
    })

    // Mist C (bottom) — fastest, near plane
    gsap.to(mistCRef.current, {
      y: '10vh',
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.6,
      },
    })

    // Headline — standard parallax, slightly faster than mist A
    gsap.to('.v4-headline', {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.8,
      },
    })

    // Triangle stroke fades on scroll
    gsap.to('.v4-tri-svg', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: '30% top',
        end: '65% top',
        scrub: 1.2,
      },
    })

    // Section fade-out
    gsap.to(containerRef.current, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: '68% top',
        end: 'bottom top',
        scrub: 1,
      },
    })
  }, { scope: containerRef })

  // ── Load animations — the reveal ────────────────────────────────────────────
  useGSAP(() => {
    if (!isLoaded) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      // Skip to end state immediately
      gsap.set([mistARef.current, mistBRef.current, mistCRef.current], { clearProps: 'all' })
      gsap.set(['.v4-line-1', '.v4-line-2', '.v4-sub', '.v4-ui'], { clearProps: 'all' })
      return
    }

    // Mist blobs start stacked at center with heavy overlap
    gsap.set(mistARef.current, { x: '14vw', y: '8vh', opacity: 1 })
    gsap.set(mistBRef.current, { x: '-10vw', y: '6vh', opacity: 1 })
    gsap.set(mistCRef.current, { x: '4vw', y: '-4vh', opacity: 1 })

    // Text starts invisible + blurred
    gsap.set(['.v4-line-1', '.v4-line-2'], { opacity: 0, filter: 'blur(14px)' })
    gsap.set(['.v4-sub', '.v4-ui'], { opacity: 0, y: 18 })

    // Triangle stroke starts invisible
    gsap.set('.v4-tri-path', { strokeDashoffset: 300 })

    // Master reveal timeline — mists part, world clarifies
    const tl = gsap.timeline({ delay: 0.15 })

    // Phase 1: mists drift apart (like curtains parting)
    tl.to(mistARef.current, {
      x: '-28vw',
      y: '-22vh',
      opacity: 0.52,
      duration: 2.6,
      ease: 'power3.inOut',
    }, 0)
    .to(mistBRef.current, {
      x: '24vw',
      y: '-18vh',
      opacity: 0.42,
      duration: 2.4,
      ease: 'power3.inOut',
    }, 0)
    .to(mistCRef.current, {
      x: '2vw',
      y: '28vh',
      opacity: 0.28,
      duration: 2.8,
      ease: 'power3.inOut',
    }, 0)

    // Phase 2: headline clears from blur — staggered so each line sharpens in sequence
    .to('.v4-line-1', {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.6,
      ease: 'power2.out',
    }, 0.85)
    .to('.v4-line-2', {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.6,
      ease: 'power2.out',
    }, 1.05)

    // Phase 3: triangle draws as text settles
    .to('.v4-tri-path', {
      strokeDashoffset: 0,
      duration: 1.8,
      ease: 'power3.out',
    }, 1.2)

    // Phase 4: supporting UI fades in
    .to('.v4-sub', { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out' }, 1.6)
    .to('.v4-ui', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 1.7)
  }, { dependencies: [isLoaded], scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ background: '#F5F6F3' }}
    >
      {/* ── Mist blobs — start covering center, part on load ────────────────── */}
      {/* Mist A — upper-left after reveal */}
      <div
        ref={mistARef}
        className="absolute pointer-events-none"
        style={{
          width: '80vw',
          height: '80vw',
          left: '-22vw',
          top: '-18vw',
          background: 'radial-gradient(circle, rgba(148,172,198,0.60) 0%, rgba(178,196,214,0.28) 40%, transparent 68%)',
          filter: 'blur(72px)',
        }}
        aria-hidden
      />
      {/* Mist B — upper-right after reveal */}
      <div
        ref={mistBRef}
        className="absolute pointer-events-none"
        style={{
          width: '68vw',
          height: '68vw',
          right: '-18vw',
          top: '-14vw',
          background: 'radial-gradient(circle, rgba(200,210,220,0.52) 0%, rgba(188,202,218,0.22) 42%, transparent 65%)',
          filter: 'blur(80px)',
        }}
        aria-hidden
      />
      {/* Mist C — bottom pool after reveal */}
      <div
        ref={mistCRef}
        className="absolute pointer-events-none"
        style={{
          width: '90vw',
          height: '55vw',
          left: '5vw',
          bottom: '-28vw',
          background: 'radial-gradient(ellipse, rgba(168,186,206,0.46) 0%, rgba(185,200,216,0.18) 45%, transparent 68%)',
          filter: 'blur(88px)',
        }}
        aria-hidden
      />

      {/* ── Triangle stroke — sharpens as mist clears ───────────────────────── */}
      <svg
        className="v4-tri-svg absolute pointer-events-none"
        viewBox="0 0 100 88"
        style={{
          width: '54vw',
          left: '23vw',
          top: '14vh',
          opacity: 0.07,
        }}
        aria-hidden
      >
        <path
          className="v4-tri-path"
          d="M 50,2 L 97,86 L 3,86 Z"
          fill="none"
          stroke="#0D0D0B"
          strokeWidth="0.55"
          strokeDasharray="300"
          strokeDashoffset="300"
          pathLength="300"
        />
      </svg>

      {/* ── Corner details ───────────────────────────────────────────────────── */}
      <div className="absolute top-6 right-8 font-mono text-[9px] tracking-[0.38em] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.18)' }} aria-hidden>04</div>
      <div className="absolute bottom-14 left-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>
      <div className="absolute bottom-14 right-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="v4-ui relative z-10 flex items-center justify-between px-8 md:px-12 pt-24">
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
          Independent production house
        </span>
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
          Trivandrum, Kerala
        </span>
      </div>

      {/* ── Main headline — emerges from blur as mist clears ────────────────── */}
      <div className="v4-headline relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="font-display text-ink leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(5rem, 15vw, 13rem)', fontWeight: 300 }}
        >
          {/*
            Lines are NOT wrapped in overflow-hidden here — the blur animation
            needs to be visible from outside the element bounds on both axes.
          */}
          <div>
            <span className="v4-line-1 block">Triangle</span>
          </div>
          <div>
            <span className="v4-line-2 block" style={{ color: 'rgba(13,13,11,0.24)' }}>
              Room
            </span>
          </div>
        </h1>

        <p
          className="v4-sub font-sans font-light text-muted leading-[1.55] mt-10 max-w-[28ch]"
          style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.15rem)' }}
        >
          New company.&ensp;Not new at this.
        </p>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div className="v4-ui relative z-10 px-8 md:px-12 pb-10 flex items-end justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {DISCIPLINES.map((d) => (
            <span key={d} className="font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: 'rgba(118,118,113,0.4)' }}>
              {d}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-px h-12 overflow-hidden" style={{ background: 'rgba(13,13,11,0.1)' }}>
            <div className="absolute top-0 left-0 w-full h-1/2" style={{ background: 'rgba(13,13,11,0.22)', animation: 'v4ScrollLine 2s ease-in-out infinite' }} />
          </div>
          <span className="font-mono text-[8.5px] tracking-[0.3em] uppercase" style={{ color: 'rgba(118,118,113,0.35)' }}>Scroll</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(13,13,11,0.07)' }} />

      <style>{`
        @keyframes v4ScrollLine {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(200%) }
        }
      `}</style>
    </section>
  )
}
