'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DISCIPLINES = [
  'Documentary', 'Reality', 'Live', 'Music', 'Fiction', 'Audio Drama', 'Ad-Film', 'Post',
]

interface HeroProps {
  isLoaded: boolean
}

export default function Hero({ isLoaded }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    // Headline subtle parallax on scroll
    gsap.to('.hero-headline', {
      yPercent: -14,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.8,
      },
    })

    // Fade out as next section arrives
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

  useGSAP(() => {
    if (!isLoaded) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      gsap.set(['.hero-line-1', '.hero-line-2', '.hero-sub', '.hero-fade'], { clearProps: 'all' })
      return
    }

    gsap.set(['.hero-line-1', '.hero-line-2'], { yPercent: 110 })
    gsap.set(['.hero-sub', '.hero-fade'], { opacity: 0, y: 18 })

    gsap.timeline({ delay: 0.1 })
      .to(['.hero-line-1', '.hero-line-2'], {
        yPercent: 0,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.09,
      })
      .to('.hero-sub', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.8')
      .to('.hero-fade', { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.06 }, '-=0.65')
  }, { dependencies: [isLoaded], scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ background: '#F5F6F3' }}
    >
      {/* ── Atmospheric mist layer ──────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>

        {/* Large cool-grey mist pool — bottom-left anchor */}
        <div style={{
          position: 'absolute',
          width: '85vw',
          height: '85vw',
          left: '-22vw',
          bottom: '-32vw',
          background: 'radial-gradient(circle, rgba(155,178,200,0.42) 0%, rgba(180,198,214,0.18) 40%, transparent 68%)',
          filter: 'blur(72px)',
          willChange: 'transform',
        }} />

        {/* Smaller warm mist drift — top-right */}
        <div style={{
          position: 'absolute',
          width: '50vw',
          height: '50vw',
          right: '-6vw',
          top: '-4vw',
          background: 'radial-gradient(circle, rgba(205,212,220,0.28) 0%, transparent 65%)',
          filter: 'blur(100px)',
        }} />

        {/* Mid-page atmospheric haze — center */}
        <div style={{
          position: 'absolute',
          width: '60vw',
          height: '40vw',
          left: '20vw',
          top: '28vh',
          background: 'radial-gradient(ellipse, rgba(188,200,212,0.16) 0%, transparent 65%)',
          filter: 'blur(80px)',
        }} />

        {/* Ghost triangle — the founding form, barely visible beneath the mist */}
        <svg
          viewBox="0 0 100 87"
          style={{
            position: 'absolute',
            width: '54vw',
            left: '23vw',
            top: '14vh',
            opacity: 0.06,
            filter: 'blur(1.5px)',
          }}
          aria-hidden
        >
          <polygon
            points="50,2 98,85 2,85"
            fill="none"
            stroke="#0D0D0B"
            strokeWidth="0.7"
          />
        </svg>

        {/* Bottom mist — dissolves hero into the next section */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32vh',
          background: 'linear-gradient(to bottom, transparent 0%, rgba(245,246,243,0.7) 55%, #F5F6F3 100%)',
        }} />
      </div>

      {/* ── Section number + corner × marks ────────────────────────────────── */}
      <div
        className="absolute top-6 right-8 font-mono text-[9px] tracking-[0.38em] pointer-events-none select-none"
        style={{ color: 'rgba(13,13,11,0.18)' }}
        aria-hidden
      >
        01
      </div>
      <div
        className="absolute bottom-[3.5rem] left-8 font-mono text-[11px] pointer-events-none select-none"
        style={{ color: 'rgba(13,13,11,0.16)' }}
        aria-hidden
      >
        ×
      </div>
      <div
        className="absolute bottom-[3.5rem] right-8 font-mono text-[11px] pointer-events-none select-none"
        style={{ color: 'rgba(13,13,11,0.16)' }}
        aria-hidden
      >
        ×
      </div>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-8 md:px-12 pt-24 pb-0">
        <span className="hero-fade font-mono text-[10px] tracking-[0.38em] uppercase text-muted/50">
          Independent production house
        </span>
        <span className="hero-fade font-mono text-[10px] tracking-[0.38em] uppercase text-muted/50">
          Trivandrum, Kerala
        </span>
      </div>

      {/* ── Main headline ───────────────────────────────────────────────────── */}
      <div className="hero-headline relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="text-ink leading-[0.88] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(5rem, 15vw, 13rem)', fontFamily: "var(--font-syne-next, 'Syne', sans-serif)" }}
        >
          <div className="overflow-hidden">
            <span className="hero-line-1 block" style={{ fontWeight: 800 }}>Triangle</span>
          </div>
          <div className="overflow-hidden">
            {/* "Room" fades into the mist — atmospheric opacity contrast */}
            <span
              className="hero-line-2 block"
              style={{ color: 'rgba(13,13,11,0.25)', fontWeight: 400 }}
            >
              Room
            </span>
          </div>
        </h1>

        <p
          className="hero-sub font-sans font-light text-muted leading-[1.55] mt-10 max-w-[28ch]"
          style={{ fontSize: 'clamp(0.9rem, 1.4vw, 1.15rem)', letterSpacing: '0.01em' }}
        >
          New company.&ensp;Not new at this.
        </p>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 px-8 md:px-12 pb-10 flex items-end justify-between">
        <div className="hero-fade flex flex-wrap gap-x-5 gap-y-1.5">
          {DISCIPLINES.map((d) => (
            <span key={d} className="font-mono text-[9.5px] tracking-[0.28em] uppercase text-muted/40">
              {d}
            </span>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="hero-fade flex flex-col items-center gap-2">
          <div className="relative w-px h-12 overflow-hidden bg-border">
            <div
              className="absolute top-0 left-0 w-full h-1/2 bg-ink/20"
              style={{ animation: 'scrollLine 2s ease-in-out infinite' }}
            />
          </div>
          <span className="font-mono text-[8.5px] tracking-[0.3em] uppercase text-muted/35">Scroll</span>
        </div>
      </div>

      {/* ── Bottom hairline ─────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border z-10" />

      <style>{`
        @keyframes scrollLine {
          0%   { transform: translateY(-100%) }
          100% { transform: translateY(200%) }
        }
      `}</style>
    </section>
  )
}

