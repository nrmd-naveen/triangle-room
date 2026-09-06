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
 * V3 — "The Edit Cut"
 *
 * "Triangle" sweeps in from the left; "Room" sweeps from the right —
 * two separate pieces of footage being spliced together. The triangle stroke
 * draws as they arrive, stitching the form at the join point.
 *
 * On scroll: the words come apart. Triangle climbs left, Room falls right.
 * A subtle counter-rotation on each word sells the idea of frames slipping
 * out of sync — the edit reversing itself.
 *
 * Metaphor: assembly → cut. The site IS the reel room.
 */
export default function HeroV3({ isLoaded }: Props) {
  const containerRef = useRef<HTMLElement>(null)

  // ── Scroll animations ────────────────────────────────────────────────────────
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // "Triangle" — climbs and drifts left on scroll
    gsap.to('.v3-word-triangle', {
      yPercent: -28,
      rotation: -1.8,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
    })

    // "Room" — slower upward drift, tilts right — they diverge
    gsap.to('.v3-word-room', {
      yPercent: -9,
      rotation: 1.4,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
    })

    // Triangle stroke shrinks and fades as the words pull apart
    gsap.to('.v3-tri-svg', {
      scale: 0.72,
      opacity: 0,
      transformOrigin: '50% 50%',
      ease: 'power1.in',
      scrollTrigger: {
        trigger: containerRef.current,
        start: '15% top',
        end: '55% top',
        scrub: 1.5,
      },
    })

    // Splice hairline fades when words diverge
    gsap.to('.v3-splice-line', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: '20% top',
        end: '40% top',
        scrub: 1,
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

  // ── Load animations ──────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!isLoaded) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(['.v3-word-triangle', '.v3-word-room', '.v3-sub', '.v3-ui'], { clearProps: 'all' })
      return
    }

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440

    // Words slide in from opposite sides (off-screen)
    gsap.set('.v3-word-triangle', { x: -vw * 0.88 })
    gsap.set('.v3-word-room', { x: vw * 0.88 })
    gsap.set(['.v3-sub', '.v3-ui'], { opacity: 0, y: 18 })
    gsap.set('.v3-splice-line', { opacity: 0, scaleX: 0 })

    const tl = gsap.timeline({ delay: 0.1 })

    // Both words sweep in simultaneously — like a splice
    tl.to(['.v3-word-triangle', '.v3-word-room'], {
      x: 0,
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.06,
    })
    // Splice hairline extends from center as words land
    .to('.v3-splice-line', {
      opacity: 1,
      scaleX: 1,
      duration: 0.6,
      ease: 'power3.out',
      transformOrigin: '50% 50%',
    }, '-=0.55')
    // Triangle stroke draws after words settle
    .fromTo('.v3-tri-path',
      { strokeDashoffset: 300 },
      { strokeDashoffset: 0, duration: 1.6, ease: 'power3.out' },
      '-=0.4'
    )
    .to('.v3-sub', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=1.0')
    .to('.v3-ui', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.05 }, '-=0.7')
  }, { dependencies: [isLoaded], scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ background: '#F5F6F3' }}
    >
      {/* ── Atmospheric mist ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div style={{
          position: 'absolute',
          width: '75vw',
          height: '75vw',
          left: '-14vw',
          bottom: '-26vw',
          background: 'radial-gradient(circle, rgba(148,172,198,0.38) 0%, rgba(178,196,214,0.14) 38%, transparent 66%)',
          filter: 'blur(68px)',
        }} />
        <div style={{
          position: 'absolute',
          width: '46vw',
          height: '46vw',
          right: '-4vw',
          top: '-4vw',
          background: 'radial-gradient(circle, rgba(200,210,220,0.22) 0%, transparent 62%)',
          filter: 'blur(84px)',
        }} />
      </div>

      {/* ── Splice hairline — appears as words land at center ───────────────── */}
      <div
        className="v3-splice-line absolute left-0 right-0 pointer-events-none"
        style={{
          top: '50%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(13,13,11,0.10) 20%, rgba(13,13,11,0.10) 80%, transparent 100%)',
          transformOrigin: '50% 50%',
        }}
        aria-hidden
      />

      {/* ── Triangle stroke ──────────────────────────────────────────────────── */}
      <svg
        className="v3-tri-svg absolute pointer-events-none"
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
          className="v3-tri-path"
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
      <div className="absolute top-6 right-8 font-mono text-[9px] tracking-[0.38em] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.18)' }} aria-hidden>03</div>
      <div className="absolute bottom-14 left-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>
      <div className="absolute bottom-14 right-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="v3-ui relative z-10 flex items-center justify-between px-8 md:px-12 pt-24">
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
          Independent production house
        </span>
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
          Trivandrum, Kerala
        </span>
      </div>

      {/* ── Main headline — two independently animated words ─────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="font-display text-ink leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(5rem, 15vw, 13rem)', fontWeight: 300 }}
        >
          {/*
            Each word is its own block so GSAP can move them independently.
            inline-block so transforms apply while keeping them line-centered.
          */}
          <div>
            <span className="v3-word-triangle" style={{ display: 'inline-block' }}>
              Triangle
            </span>
          </div>
          <div>
            <span
              className="v3-word-room"
              style={{ display: 'inline-block', color: 'rgba(13,13,11,0.24)' }}
            >
              Room
            </span>
          </div>
        </h1>

        <p
          className="v3-sub font-sans font-light text-muted leading-[1.55] mt-10 max-w-[28ch]"
          style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.15rem)' }}
        >
          New company.&ensp;Not new at this.
        </p>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div className="v3-ui relative z-10 px-8 md:px-12 pb-10 flex items-end justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {DISCIPLINES.map((d) => (
            <span key={d} className="font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: 'rgba(118,118,113,0.4)' }}>
              {d}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-px h-12 overflow-hidden" style={{ background: 'rgba(13,13,11,0.1)' }}>
            <div className="absolute top-0 left-0 w-full h-1/2" style={{ background: 'rgba(13,13,11,0.22)', animation: 'v3ScrollLine 2s ease-in-out infinite' }} />
          </div>
          <span className="font-mono text-[8.5px] tracking-[0.3em] uppercase" style={{ color: 'rgba(118,118,113,0.35)' }}>Scroll</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(13,13,11,0.07)' }} />

      <style>{`
        @keyframes v3ScrollLine {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(200%) }
        }
      `}</style>
    </section>
  )
}
