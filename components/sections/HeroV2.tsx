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
 * V2 — "Depth Bow"
 *
 * Each letter of "Triangle" and "Room" scrolls at its own velocity.
 * Outer letters drift faster; inner letters barely move. The headline
 * fans open like a spread of film frames — the word becoming a wave.
 *
 * The ghost triangle simultaneously skews + compresses (simulated perspective
 * tilt), as though the geometry of the page is rotating in depth.
 *
 * Metaphor: the edit-room timeline, where every clip rides at its own speed.
 */
export default function HeroV2({ isLoaded }: Props) {
  const containerRef = useRef<HTMLElement>(null)

  // ── Scroll animations ────────────────────────────────────────────────────────
  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // Triangle: perspective-skew effect as if rotating in 3D
    gsap.to('.v2-tri-svg', {
      scaleY: 0.62,
      skewX: 10,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '60% top',
        scrub: 2,
      },
    })

    // Fan effect — each letter fans open at its own scroll rate
    const tLetters = gsap.utils.toArray<HTMLElement>('.v2-t-letter', containerRef.current)
    const rLetters = gsap.utils.toArray<HTMLElement>('.v2-r-letter', containerRef.current)

    ;[[tLetters, 115] as const, [rLetters, 72] as const].forEach(([letters, spread]) => {
      letters.forEach((letter, i) => {
        const progress = letters.length > 1 ? i / (letters.length - 1) : 0
        // Linear spread: first letter goes up (negative), last goes down (positive)
        const yOffset = (progress - 0.5) * spread

        gsap.to(letter, {
          y: yOffset,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2.2,
          },
        })
      })
    })

    // Subline fades earlier (gets swallowed as letters fan)
    gsap.to('.v2-sub', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: '20% top',
        end: '50% top',
        scrub: 1,
      },
    })

    // Section fade-out
    gsap.to(containerRef.current, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: '65% top',
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
      gsap.set(['.v2-word-t', '.v2-word-r', '.v2-sub', '.v2-ui'], { clearProps: 'all' })
      return
    }

    // Draw triangle
    gsap.fromTo(
      '.v2-tri-path',
      { strokeDashoffset: 300 },
      { strokeDashoffset: 0, duration: 1.8, ease: 'power3.out', delay: 0.15 }
    )

    // Words fade + rise as blocks; letters are inside so they inherit
    gsap.set(['.v2-word-t', '.v2-word-r'], { opacity: 0, y: 28 })
    gsap.set(['.v2-sub', '.v2-ui'], { opacity: 0, y: 16 })

    gsap.timeline({ delay: 0.12 })
      .to(['.v2-word-t', '.v2-word-r'], {
        opacity: 1,
        y: 0,
        duration: 1.25,
        ease: 'power4.out',
        stagger: 0.1,
      })
      .to('.v2-sub', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .to('.v2-ui', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.05 }, '-=0.65')
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
          width: '78vw',
          height: '78vw',
          left: '-16vw',
          bottom: '-24vw',
          background: 'radial-gradient(circle, rgba(148,172,198,0.40) 0%, rgba(178,196,214,0.16) 38%, transparent 66%)',
          filter: 'blur(70px)',
        }} />
        <div style={{
          position: 'absolute',
          width: '48vw',
          height: '48vw',
          right: '-5vw',
          top: '-5vw',
          background: 'radial-gradient(circle, rgba(200,210,220,0.24) 0%, transparent 62%)',
          filter: 'blur(88px)',
        }} />
        <div style={{
          position: 'absolute',
          width: '55vw',
          height: '38vw',
          left: '22vw',
          top: '30vh',
          background: 'radial-gradient(ellipse, rgba(185,200,215,0.14) 0%, transparent 65%)',
          filter: 'blur(75px)',
        }} />
      </div>

      {/* ── Triangle — compresses + tilts in simulated perspective on scroll ─── */}
      <svg
        className="v2-tri-svg absolute pointer-events-none"
        viewBox="0 0 100 88"
        style={{
          width: '56vw',
          left: '22vw',
          top: '13vh',
          opacity: 0.07,
          transformOrigin: '50% 50%',
        }}
        aria-hidden
      >
        <path
          className="v2-tri-path"
          d="M 50,2 L 97,86 L 3,86 Z"
          fill="none"
          stroke="#0D0D0B"
          strokeWidth="0.6"
          strokeDasharray="300"
          strokeDashoffset="300"
          pathLength="300"
        />
      </svg>

      {/* ── Corner details ───────────────────────────────────────────────────── */}
      <div className="absolute top-6 right-8 font-mono text-[9px] tracking-[0.38em] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.18)' }} aria-hidden>02</div>
      <div className="absolute bottom-14 left-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>
      <div className="absolute bottom-14 right-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="v2-ui relative z-10 flex items-center justify-between px-8 md:px-12 pt-24">
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
          Independent production house
        </span>
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
          Trivandrum, Kerala
        </span>
      </div>

      {/* ── Headline — letters as individual inline-block spans for the fan ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="font-display text-ink leading-[0.88] tracking-[-0.04em]"
          style={{ fontSize: 'clamp(5rem, 15vw, 13rem)', fontWeight: 300 }}
        >
          {/* Each word wrapped so the load animation can target .v2-word-* as a block */}
          <div className="v2-word-t block">
            {'Triangle'.split('').map((char, i) => (
              <span key={i} className="v2-t-letter" style={{ display: 'inline-block' }}>
                {char}
              </span>
            ))}
          </div>
          <div className="v2-word-r block">
            {'Room'.split('').map((char, i) => (
              <span key={i} className="v2-r-letter" style={{ display: 'inline-block', color: 'rgba(13,13,11,0.24)' }}>
                {char}
              </span>
            ))}
          </div>
        </h1>

        <p
          className="v2-sub font-sans font-light text-muted leading-[1.55] mt-10 max-w-[28ch]"
          style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.15rem)' }}
        >
          New company.&ensp;Not new at this.
        </p>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div className="v2-ui relative z-10 px-8 md:px-12 pb-10 flex items-end justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {DISCIPLINES.map((d) => (
            <span key={d} className="font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: 'rgba(118,118,113,0.4)' }}>
              {d}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-px h-12 overflow-hidden" style={{ background: 'rgba(13,13,11,0.1)' }}>
            <div className="absolute top-0 left-0 w-full h-1/2" style={{ background: 'rgba(13,13,11,0.22)', animation: 'v2ScrollLine 2s ease-in-out infinite' }} />
          </div>
          <span className="font-mono text-[8.5px] tracking-[0.3em] uppercase" style={{ color: 'rgba(118,118,113,0.35)' }}>Scroll</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(13,13,11,0.07)' }} />

      <style>{`
        @keyframes v2ScrollLine {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(200%) }
        }
      `}</style>
    </section>
  )
}
