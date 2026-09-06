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
        { clipPath: 'polygon(50% 6%, 5% 93%, 95% 93%)' },
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

      // Triangle stroke: swells outward and dissolves as clip opens
      gsap.to('.v1-stroke-svg', {
        scale: 3.2,
        opacity: 0,
        transformOrigin: '50% 49%',
        ease: 'power1.in',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '52% top',
          scrub: 1.5,
        },
      })

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
      gsap.set(['.v1-line-1', '.v1-line-2', '.v1-sub', '.v1-ui'], { clearProps: 'all' })
      return
    }

    // Draw the triangle stroke: bottom-left → apex → bottom-right → close
    gsap.fromTo(
      '.v1-tri-path',
      { strokeDashoffset: 300 },
      { strokeDashoffset: 0, duration: 2.0, ease: 'power3.out', delay: 0.1 }
    )

    // Text entrance (lines masked by overflow-hidden parents)
    gsap.set(['.v1-line-1', '.v1-line-2'], { yPercent: 110 })
    gsap.set(['.v1-sub', '.v1-ui'], { opacity: 0, y: 18 })

    gsap.timeline({ delay: 0.25 })
      .to(['.v1-line-1', '.v1-line-2'], {
        yPercent: 0,
        duration: 1.35,
        ease: 'power4.out',
        stagger: 0.1,
      })
      .to('.v1-sub', { opacity: 1, y: 0, duration: 0.95, ease: 'power3.out' }, '-=0.8')
      .to('.v1-ui', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.05 }, '-=0.65')
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
        style={{ clipPath: 'polygon(50% 6%, 5% 93%, 95% 93%)' }}
        aria-hidden
      >
        {/* Primary cool-blue mist pool */}
        <div style={{
          position: 'absolute',
          width: '72vw',
          height: '72vw',
          left: '14vw',
          top: '10vh',
          background: 'radial-gradient(circle, rgba(148,172,198,0.54) 0%, rgba(178,196,214,0.26) 38%, transparent 66%)',
          filter: 'blur(60px)',
        }} />
        {/* Warm-grey secondary bloom */}
        <div style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          right: '8vw',
          top: '18vh',
          background: 'radial-gradient(circle, rgba(200,210,220,0.34) 0%, transparent 62%)',
          filter: 'blur(80px)',
        }} />
        {/* Faint inner tint — separates triangle zone from outside */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(185,198,214,0.07)',
        }} />
      </div>

      {/* ── Triangle hairline stroke ─────────────────────────────────────────── */}
      {/* Scales outward and fades as the clip expands on scroll */}
      {/* <svg
        className="v1-stroke-svg absolute pointer-events-none"
        viewBox="0 0 100 88"
        style={{
          width: '82vw',
          left: '9vw',
          top: '8vh',
          height: 'auto',
          opacity: 0.15,
        }}
        aria-hidden
      >
        <path
          className="v1-tri-path"
          d="M 50,2 L 97,86 L 3,86 Z"
          fill="none"
          stroke="#0D0D0B"
          strokeWidth="0.38"
          strokeDasharray="300"
          strokeDashoffset="300"
          pathLength="300"
        />
      </svg> */}

      {/* ── Corner details ───────────────────────────────────────────────────── */}
      <div className="absolute top-6 right-8 font-mono text-[9px] tracking-[0.38em] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.18)' }} aria-hidden>
        01
      </div>
      <div className="absolute bottom-14 left-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>
      <div className="absolute bottom-14 right-8 font-mono text-[11px] pointer-events-none select-none" style={{ color: 'rgba(13,13,11,0.13)' }} aria-hidden>×</div>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="v1-ui relative z-10 flex items-center justify-between px-8 md:px-12 pt-24">
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
          Independent production house
        </span>
        <span className="font-mono text-[10px] tracking-[0.38em] uppercase" style={{ color: 'rgba(118,118,113,0.5)' }}>
          Trivandrum, Kerala
        </span>
      </div>

      {/* ── Main headline ───────────────────────────────────────────────────── */}
      <div className="v1-headline relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="text-ink leading-[0.88] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(5rem, 15vw, 13rem)', fontFamily: "var(--font-syne-next, 'Syne', sans-serif)" }}
        >
          <div className="overflow-hidden">
            <span className="v1-line-1 block" style={{ fontWeight: 700 }}>
              Tr
              {/* Custom "i" glyph — rectangular stem + triangle on top */}
              <svg
                aria-hidden
                viewBox="0 0 28 78"
                style={{
                  display: 'inline-block',
                  height: '0.76em',
                  width: '0.32em',
                  verticalAlign: 'baseline',
                  marginLeft: '0.02em',
                  marginRight: '0.02em',
                }}
              >
                {/* Triangle dot — full width, at top */}
                <polygon points="16,0 30,22 2,22" fill="#0D0D0B" />
                {/* Stem reaching the baseline */}
                <rect x="9" y="28" width="13.5" height="50" fill="#0D0D0B" />
              </svg>
              angle
            </span>
          </div>
          <div className="overflow-hidden">
            <span className="v1-line-2 block" style={{ color: 'rgba(13,13,11,0.24)', fontWeight: 600 }}>
              Room
            </span>
          </div>
        </h1>
        <p
          className="v1-sub font-mono text-muted mt-10"
          style={{ fontSize: 'clamp(0.65rem, 0.9vw, 0.8rem)', letterSpacing: '0.22em', textTransform: 'uppercase' }}
        >
          New company.&ensp;Not new at this.
        </p>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div className="v1-ui relative z-10 px-8 md:px-12 pb-10 flex items-end justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-1.5">
          {DISCIPLINES.map((d) => (
            <span key={d} className="font-mono text-[9.5px] tracking-[0.28em] uppercase" style={{ color: 'rgba(118,118,113,0.4)' }}>
              {d}
            </span>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-px h-12 overflow-hidden" style={{ background: 'rgba(13,13,11,0.1)' }}>
            <div className="absolute top-0 left-0 w-full h-1/2" style={{ background: 'rgba(13,13,11,0.22)', animation: 'v1ScrollLine 2s ease-in-out infinite' }} />
          </div>
          <span className="font-mono text-[8.5px] tracking-[0.3em] uppercase" style={{ color: 'rgba(118,118,113,0.35)' }}>Scroll</span>
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
