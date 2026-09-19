'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Wordmark from '@/components/LogoWordmark'

gsap.registerPlugin(ScrollTrigger)

const DISCIPLINES = [
  'Documentary', 'Reality', 'Live', 'Music', 'Fiction', 'Audio Drama', 'Ad-Film', 'Post',
]

interface Props { isLoaded: boolean }

/**
 * V1 — "The Gate"
 *
 * The triangle is a containing form: all atmospheric energy (mist, depth) is
 * locked inside a triangular clip at rest. On scroll, the gate opens — the clip
 * expands outward until the triangle encompasses the entire viewport.
 *
 * Metaphor: the triangle is not decoration, it is a lens. You scroll to widen it.
 */
export default function HeroV1({ isLoaded }: Props) {
  const containerRef = useRef<HTMLElement>(null)
  const mistClipRef = useRef<HTMLDivElement>(null)

  // ── Scroll animations ────────────────────────────────────────────────────────
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!reduced) {
      // Mist layer: triangle clip → full viewport on scroll
      gsap.fromTo(
        mistClipRef.current,
        { clipPath: 'polygon(50% 5%, 8% 90%, 92% 90%)' },
        {
          clipPath: 'polygon(50% -90%, -140% 230%, 240% 230%)',
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.8,
          },
        }
      )

      // Headline slow parallax
      gsap.to('.v1-headline', {
        yPercent: -13,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.8,
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
    }
  }, { scope: containerRef })

  // ── Load animations ──────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!isLoaded) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(['.v1-word-svg', '.v1-gleam-rect', '.v1-sub', '.v1-ui'], { clearProps: 'all' })
      return
    }

    // Draw the triangle stroke
    gsap.fromTo(
      '.v1-tri-path',
      { strokeDashoffset: 300 },
      { strokeDashoffset: 0, duration: 2.0, ease: 'power3.out', delay: 0.1 }
    )

    // Wordmark entrance — each word clips in left-to-right, like an edit
    // holding before cutting to reveal the next frame. The reveal is a clip
    // on the glyphs themselves (not an opaque cover panel), so the misty
    // backdrop is never blocked or colour-mismatched behind it. Paced
    // deliberately (each word gets its own unhurried beat) rather than a
    // quick UI-style stagger.
    gsap.set('.v1-word-svg', { clipPath: 'inset(0% 100% 0% 0%)' })
    gsap.set('.v1-gleam-rect', { xPercent: -140, opacity: 0 })
    gsap.set(['.v1-sub', '.v1-ui'], { opacity: 0, y: 18 })

    const WIPE_DURATION = 2.1
    const WORD_HOLD = 0.85 // pause before the next word begins its own reveal
    const GLEAM_DURATION = 2.6

    const tl = gsap.timeline({ delay: 0.5 })

    ;['.v1-word-triangle', '.v1-word-room'].forEach((word, i) => {
      tl.to(`${word} .v1-word-svg`, { clipPath: 'inset(0% 0% 0% 0%)', duration: WIPE_DURATION, ease: 'power2.inOut' }, i * WORD_HOLD)
    })

    const wordsEnd = WORD_HOLD + WIPE_DURATION // both words fully revealed by here

    // A single shine, driven by tweens shared across both words' rects, so it
    // reads as one beam passing over the whole lockup rather than two
    // separate sweeps. It only starts once both words have fully landed. The
    // sweep itself is one continuous ease (never re-accelerates mid-flight —
    // splitting position across keyframes caused it to visibly stutter), while
    // opacity fades in and back out on its own, independent arc.
    const gleamStart = wordsEnd + 0.4
    tl.to('.v1-gleam-rect', { xPercent: 140, duration: GLEAM_DURATION, ease: 'sine.inOut' }, gleamStart)
      .to('.v1-gleam-rect', {
        keyframes: { opacity: [0, 1, 1, 0] },
        duration: GLEAM_DURATION,
        ease: 'sine.inOut',
      }, gleamStart)

    tl.to('.v1-sub', { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' }, wordsEnd - 0.5)
      .to('.v1-ui', { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', stagger: 0.08 }, '-=0.9')
  }, { dependencies: [isLoaded], scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ background: '#F5F6F3' }}
    >
      {/* ── Atmospheric mist — clipped to triangle, expands on scroll ─────────── */}
      <div
        ref={mistClipRef}
        className="absolute inset-0 pointer-events-none"
        style={{ clipPath: 'polygon(50% 5%, 8% 90%, 92% 90%)' }}
        aria-hidden
      >
        {/* Primary cool-blue mist pool */}
        <div style={{
          position: 'absolute',
          width: '68vw',
          height: '68vw',
          left: '16vw',
          top: '8vh',
          background: 'radial-gradient(circle, rgba(148,172,198,0.52) 0%, rgba(178,196,214,0.22) 38%, transparent 66%)',
          filter: 'blur(52px)',
        }} />
        {/* Warm-grey secondary bloom */}
        <div style={{
          position: 'absolute',
          width: '44vw',
          height: '44vw',
          right: '10vw',
          top: '20vh',
          background: 'radial-gradient(circle, rgba(200,210,220,0.28) 0%, transparent 62%)',
          filter: 'blur(70px)',
        }} />
        {/* Faint inner tint */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(185,198,214,0.06)',
        }} />
      </div>


      {/* ── Corner "01" — desktop only (conflicts with hamburger on mobile) ────── */}
      <div className="hidden md:block absolute top-6 right-8 font-mono text-[9px] tracking-[0.38em] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.18)' }} aria-hidden>
        01
      </div>
      <div className="absolute bottom-14 left-6 md:left-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>
      <div className="hidden md:block absolute bottom-14 right-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>

      {/* ── Top bar — desktop: both labels / mobile: single concise label ─────── */}
      <div className="v1-ui relative z-10 px-6 md:px-12 pt-20 md:pt-24">
        {/* Desktop: two labels across the width */}
        <div className="hidden md:flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
            Independent production house
          </span>
          <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
            Trivandrum, Kerala
          </span>
        </div>
        {/* Mobile: single clean label */}
        <div className="flex md:hidden">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(118,118,113,0.42)' }}>
            Trivandrum · Kerala
          </span>
        </div>
      </div>

      {/* ── Main headline ───────────────────────────────────────────────────── */}
      <div className="v1-headline relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 aria-label="Triangle Room" className="leading-[0.88] flex flex-col items-center">
          <div className="v1-word-triangle relative overflow-hidden flex justify-center w-full" style={{ color: '#0D0D0B' }}>
            <Wordmark
              word="triangle"
              shine
              className="v1-word-svg block"
              style={{ height: 'clamp(2.5rem, 10.8vw, 9.4rem)', clipPath: 'inset(0% 100% 0% 0%)' }}
            />
          </div>
          <div className="v1-word-room relative overflow-hidden flex justify-center w-full mt-1 md:mt-2" style={{ color: 'rgba(13,13,11,0.24)' }}>
            <Wordmark
              word="room"
              shine
              className="v1-word-svg block"
              style={{ height: 'clamp(2.5rem, 10.8vw, 9.4rem)', clipPath: 'inset(0% 100% 0% 0%)' }}
            />
          </div>
        </h1>

        {/* Subtext — clamp ensures legible size on mobile */}
        <p
          className="v1-sub font-mono text-muted mt-8 md:mt-10"
          style={{ fontSize: 'clamp(0.62rem, 2.8vw, 0.78rem)', letterSpacing: '0.22em', textTransform: 'uppercase' }}
        >
          New company.&ensp;Not new at this.
        </p>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div className="v1-ui relative z-10 px-6 md:px-12 pb-10 flex items-end justify-between">

        {/* Desktop: full discipline list */}
        <div className="hidden md:flex flex-wrap gap-x-5 gap-y-1.5">
          {DISCIPLINES.map((d) => (
            <span key={d} className="font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: 'rgba(118,118,113,0.4)' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Mobile: condensed discipline row */}
        <div className="flex md:hidden flex-wrap gap-x-4 gap-y-1">
          {DISCIPLINES.slice(0, 5).map((d) => (
            <span key={d} className="font-mono text-[8px] tracking-[0.2em] uppercase" style={{ color: 'rgba(118,118,113,0.32)' }}>
              {d}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-px h-10 md:h-12 overflow-hidden" style={{ background: 'rgba(13,13,11,0.1)' }}>
            <div className="absolute top-0 left-0 w-full h-1/2" style={{ background: 'rgba(13,13,11,0.22)', animation: 'v1ScrollLine 2s ease-in-out infinite' }} />
          </div>
          <span className="font-mono text-[8px] tracking-[0.28em] uppercase" style={{ color: 'rgba(118,118,113,0.32)' }}>Scroll</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(13,13,11,0.07)' }} />

      <style>{`
        @keyframes v1ScrollLine {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(200%) }
        }
      `}</style>
    </section>
  )
}
