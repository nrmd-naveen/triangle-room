'use client'

// WorksV2 — Dossier: Sticky Split
// ─────────────────────────────────────────
// Metaphor: an editor's archive dossier — left column is the index, right is the
// evidence. Scroll the list; the image panel responds by fading in that project's
// frames, scattered like stills pinned to a board.
// The active row pulses a thin green left-border, images crossfade on the right.

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS } from './data'

gsap.registerPlugin(ScrollTrigger)

const SLOTS = [
  { top: '9%',  left: '7%',  width: '60%', rot: -3.5, z: 1 },
  { top: '35%', left: '38%', width: '48%', rot:  4.5, z: 2 },
  { top: '63%', left: '5%',  width: '40%', rot: -2,   z: 3 },
]

function FadeImg({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src} alt={alt} loading="lazy" decoding="async"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0, transition: 'opacity 0.55s ease' }}
      onLoad={e => { (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
    />
  )
}

export default function WorksV2() {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs     = useRef<(HTMLDivElement | null)[]>([])
  const groupRefs    = useRef<(HTMLDivElement | null)[]>([])
  const activeRef    = useRef<number>(-1)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const showGroup = (i: number) => {
      if (activeRef.current === i) return
      const prev = activeRef.current
      activeRef.current = i

      if (prev >= 0) {
        const prevGroup = groupRefs.current[prev]
        if (prevGroup) {
          if (reduced) {
            gsap.set(prevGroup, { opacity: 0 })
          } else {
            gsap.to(prevGroup, { opacity: 0, duration: 0.3, ease: 'power2.in' })
          }
        }
      }

      const nextGroup = groupRefs.current[i]
      if (nextGroup) {
        const cards = nextGroup.querySelectorAll<HTMLElement>('.dossier-card')
        if (reduced) {
          gsap.set(nextGroup, { opacity: 1 })
          gsap.set(cards, { opacity: 1, y: 0 })
        } else {
          gsap.set(nextGroup, { opacity: 1 })
          gsap.fromTo(cards,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.1, delay: 0.05 },
          )
        }
      }
    }

    // Initially hide all groups
    groupRefs.current.forEach((g, i) => {
      if (g) gsap.set(g, { opacity: i === 0 ? 1 : 0 })
    })
    // Show first group's cards
    const firstGroup = groupRefs.current[0]
    if (firstGroup) {
      const cards = firstGroup.querySelectorAll<HTMLElement>('.dossier-card')
      gsap.set(cards, { opacity: 1, y: 0 })
    }
    activeRef.current = 0

    WORKS.forEach((_, i) => {
      const el = itemRefs.current[i]
      if (!el) return
      ScrollTrigger.create({
        trigger: el,
        start: 'top center',
        onEnter:     () => showGroup(i),
        onEnterBack: () => showGroup(i),
      })
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} style={{ background: '#090909' }}>

      {/* Nav */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(9,9,9,0.95) 55%, transparent)' }}
      >
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

      <div style={{ display: 'flex', alignItems: 'flex-start', minHeight: '100vh' }}>

        {/* ── Left: scrollable list ─────────────────────────────────────── */}
        <div
          className="w-full md:w-[45%]"
          style={{ paddingTop: '18vh', paddingBottom: '35vh' }}
        >
          {/* Section header */}
          <div style={{
            paddingLeft: 'clamp(1.5rem, 7vw, 8rem)',
            paddingBottom: '3.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '0',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.18)', marginBottom: '1rem' }}>
              Post History
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 'clamp(2.6rem, 5.5vw, 5.5rem)',
              color: '#F5F4F0', lineHeight: 0.88, letterSpacing: '-0.04em',
            }}>
              Selected<br />Work
            </h1>
          </div>

          {/* Work list */}
          {WORKS.map((w, i) => (
            <div
              key={w.index}
              ref={el => { itemRefs.current[i] = el }}
              style={{
                padding: 'clamp(1rem, 2.2vh, 1.5rem) clamp(1.5rem, 7vw, 8rem)',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                borderLeft: '2px solid transparent',
                transition: 'border-color 0.35s ease',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderLeftColor = `${w.accent}80`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderLeftColor = 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '0.45rem' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  letterSpacing: '0.38em', color: 'rgba(245,244,240,0.2)',
                  flexShrink: 0, paddingTop: '0.1rem',
                }}>
                  {w.index}
                </span>
                <h2 style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600,
                  fontSize: 'clamp(1rem, 2vw, 1.75rem)',
                  color: '#F5F4F0', lineHeight: 1.05, letterSpacing: '-0.02em',
                }}>
                  {w.title}
                </h2>
              </div>
              <div style={{ paddingLeft: 'calc(9px + 0.38em * 9 + 1rem)', display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {w.client && (
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.32)' }}>
                    {w.client}
                  </span>
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.15)' }}>
                  {w.genre}
                </span>
                {w.award && (
                  <span style={{ color: '#c9a96e55', fontSize: 10 }}>★</span>
                )}
              </div>
            </div>
          ))}

          {/* Footer */}
          <div style={{ padding: 'clamp(3rem, 6vw, 7rem) clamp(1.5rem, 7vw, 8rem) 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Link
              href="/"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.2rem, 2vw, 2rem)', color: 'rgba(245,244,240,0.3)', textDecoration: 'none', transition: 'color 0.45s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.85)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.3)')}
            >
              ← Back to Triangle Room
            </Link>
          </div>
        </div>

        {/* ── Right: sticky image panel (desktop only) ──────────────────── */}
        <div
          className="hidden md:block"
          style={{ width: '55%', position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}
        >
          {/* Divider */}
          <div style={{ position: 'absolute', left: 0, top: '10%', bottom: '10%', width: '1px', background: 'rgba(255,255,255,0.04)' }} />

          {WORKS.map((w, i) => (
            <div
              key={w.index}
              ref={el => { groupRefs.current[i] = el }}
              style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse 75% 75% at 52% 50%, ${w.accent}0e, #090909)`,
                pointerEvents: 'none',
              }}
            >
              {w.srcs.slice(0, 3).map((src, pi) => {
                const s = SLOTS[pi]
                if (!s) return null
                return (
                  <div
                    key={pi}
                    className="dossier-card"
                    style={{
                      position: 'absolute', top: s.top, left: s.left, width: s.width,
                      transform: `rotate(${s.rot}deg)`,
                      boxShadow: '0 28px 72px rgba(0,0,0,0.7)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      zIndex: s.z,
                    }}
                  >
                    <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
                      <FadeImg src={src} alt={`${w.title} frame ${pi + 1}`} />
                    </div>
                  </div>
                )
              })}

              {w.srcs.length === 0 && (
                <div
                  className="dossier-card"
                  style={{
                    position: 'absolute', inset: '18% 12%',
                    background: `${w.accent}09`, border: `1px solid ${w.accent}14`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: `${w.accent}35` }}>
                    {w.genre}
                  </span>
                </div>
              )}

              {/* Award tag */}
              {w.award && (
                <div style={{
                  position: 'absolute', bottom: '8%', left: '8%',
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: '#c9a96e50',
                }}>
                  ★&ensp;{w.award}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
