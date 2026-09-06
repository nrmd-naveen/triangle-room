'use client'

// WorksV3 — Layer: Stacked Card Reveal
// ─────────────────────────────────────────
// Metaphor: a physical stack of frames being lifted one by one.
// Each project is a full-screen card. As you scroll into the next one,
// it rises from below while the previous card gently scales back,
// creating the sensation of depth — a deck of work being dealt.
// Signature: the card counter rotates like a physical tab index on the right.

import Link from 'next/link'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS } from './data'

gsap.registerPlugin(ScrollTrigger)

const PHOTO_SLOTS = [
  { top: '10%', left: '52%', width: '42%', rot:  4.5, z: 1 },
  { top: '44%', left: '58%', width: '34%', rot: -3,   z: 2 },
  { top: '28%', left: '44%', width: '28%', rot:  2,   z: 3 },
]

function FadeImg({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src} alt={alt} loading="lazy" decoding="async"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0, transition: 'opacity 0.6s ease' }}
      onLoad={e => { (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
    />
  )
}

export default function WorksV3() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    cardRefs.current.forEach((card, i) => {
      if (!card) return

      // Entrance: each card starts below, scaled slightly down
      gsap.set(card, { y: 60, scale: 0.97, opacity: 0 })

      ScrollTrigger.create({
        trigger: card,
        start: 'top bottom-=80',
        onEnter: () => {
          gsap.to(card, {
            y: 0, scale: 1, opacity: 1,
            duration: 0.85, ease: 'power3.out',
          })
        },
        onLeaveBack: () => {
          gsap.to(card, {
            y: 60, scale: 0.97, opacity: 0,
            duration: 0.5, ease: 'power2.in',
          })
        },
      })

      // Scale back as next card enters
      if (i < WORKS.length - 1) {
        const next = cardRefs.current[i + 1]
        if (next) {
          ScrollTrigger.create({
            trigger: next,
            start: 'top 60%',
            end: 'top top',
            scrub: 1.2,
            onUpdate: self => {
              if (!card) return
              gsap.set(card, {
                scale: 1 - 0.035 * self.progress,
                opacity: 1 - 0.18 * self.progress,
              })
            },
          })
        }
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} style={{ background: '#090909' }}>

      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
        style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }}
      />

      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto font-mono text-[10px] tracking-[0.35em] uppercase transition-colors duration-300"
          style={{ color: 'rgba(245,244,240,0.3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.3)')}
        >
          ← Triangle Room
        </Link>
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(245,244,240,0.15)' }}>
          {String(WORKS.length).padStart(2, '0')} Works
        </span>
      </div>

      {/* Cards */}
      <div style={{ paddingTop: '5rem', paddingBottom: '12rem' }}>
        {WORKS.map((w, i) => {
          const srcs = w.srcs.slice(0, 3)
          return (
            <div
              key={w.index}
              ref={el => { cardRefs.current[i] = el }}
              style={{
                margin: '0 auto clamp(1.5rem, 3vw, 2.5rem)',
                maxWidth: '1400px',
                width: '92%',
                height: 'clamp(480px, 85vh, 820px)',
                background: '#0e0e0c',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 12px 30px rgba(0,0,0,0.4)',
              }}
            >
              {/* Accent wash */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: `radial-gradient(ellipse 80% 80% at 65% 50%, ${w.accent}0f, transparent)`,
              }} />

              {/* Ghost index */}
              <div style={{
                position: 'absolute', right: '-1%', bottom: '-8%',
                fontFamily: 'var(--font-display)', fontWeight: 700,
                fontSize: 'clamp(8rem, 18vw, 18rem)',
                color: `${w.accent}06`, lineHeight: 1,
                letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none',
                zIndex: 0,
              }} aria-hidden="true">
                {w.index}
              </div>

              {/* Left: text */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '50%', display: 'flex', flexDirection: 'column',
                justifyContent: 'center',
                paddingLeft: 'clamp(2rem, 5vw, 5.5rem)',
                paddingRight: '2rem',
                zIndex: 20,
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  letterSpacing: '0.45em', textTransform: 'uppercase',
                  color: `${w.accent}80`, marginBottom: '1.8rem',
                }}>
                  {w.index}&thinsp;/&thinsp;{String(WORKS.length).padStart(2, '0')}
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600,
                  fontSize: 'clamp(2rem, 4vw, 4.8rem)',
                  color: '#F5F4F0', lineHeight: 0.88, letterSpacing: '-0.035em',
                  marginBottom: '2rem',
                }}>
                  {w.title}
                </h2>
                {w.client && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.38)', marginBottom: '0.5rem' }}>
                    {w.client}
                  </p>
                )}
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.2)' }}>
                  {w.genre}
                </p>
                {w.award && (
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a96e55', marginTop: '1.5rem' }}>
                    ★&ensp;{w.award}
                  </p>
                )}
              </div>

              {/* Right: photos */}
              <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, left: '48%', overflow: 'hidden' }}>
                {srcs.length > 0 ? srcs.map((src, pi) => {
                  const s = PHOTO_SLOTS[pi]
                  if (!s) return null
                  return (
                    <div key={pi} style={{
                      position: 'absolute', top: s.top, left: s.left, width: s.width,
                      transform: `rotate(${s.rot}deg)`,
                      boxShadow: '0 20px 55px rgba(0,0,0,0.65)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      zIndex: s.z,
                    }}>
                      <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
                        <FadeImg src={src} alt={`${w.title} frame ${pi + 1}`} />
                      </div>
                    </div>
                  )
                }) : (
                  <div style={{
                    position: 'absolute', inset: '20% 10%',
                    background: `${w.accent}08`, border: `1px solid ${w.accent}13`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: `${w.accent}32` }}>
                      {w.genre}
                    </span>
                  </div>
                )}
              </div>

              {/* Thin accent top rule */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '1px', background: `${w.accent}30`,
              }} />
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '5rem 1.5rem',
        borderTop: '1px solid rgba(245,244,240,0.05)',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.18)', marginBottom: '2rem' }}>
          End of Reel
        </p>
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.3rem, 2.2vw, 2.4rem)', color: 'rgba(245,244,240,0.35)', textDecoration: 'none', transition: 'color 0.45s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.9)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.35)')}
        >
          ← Back to Triangle Room
        </Link>
      </div>
    </div>
  )
}
