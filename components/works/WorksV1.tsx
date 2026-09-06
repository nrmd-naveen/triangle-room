'use client'

// WorksV1 — The Cut: Horizontal Film Strip
// ─────────────────────────────────────────
// Metaphor: scrubbing a timeline. Scroll vertically → reel travels horizontally.
// Each frame occupies ~75vw. A hairline "playhead" at viewport centre marks the
// current position — the literal act of finding the cut point.
// Mobile: vertical list fallback (horizontal pin is desktop-only).

import Link from 'next/link'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS, type Work } from './data'

gsap.registerPlugin(ScrollTrigger)

const FRAME_VW = 72 // width of each project frame in vw

const PHOTO_SLOTS = [
  { top: '12%', left: '6%',  width: '54%', rot: -3.5 },
  { top: '30%', left: '44%', width: '42%', rot:  4.5 },
  { top: '58%', left: '8%',  width: '36%', rot: -2   },
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

function Frame({ work, total }: { work: Work; total: number }) {
  const srcs = work.srcs.slice(0, 3)
  return (
    <div
      style={{
        width: `${FRAME_VW}vw`,
        height: '100vh',
        flexShrink: 0,
        position: 'relative',
        background: '#0a0a09',
        borderRight: `1px solid ${work.accent}18`,
      }}
    >
      {/* Accent radial */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse 70% 70% at 55% 50%, ${work.accent}0d, transparent)`,
      }} />

      {/* Ghost index */}
      <div style={{
        position: 'absolute', right: '-2%', bottom: '-8%',
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: 'clamp(9rem, 22vw, 22rem)',
        color: `${work.accent}05`, lineHeight: 1,
        letterSpacing: '-0.05em', pointerEvents: 'none', userSelect: 'none',
      }} aria-hidden="true">
        {work.index}
      </div>

      {/* Left: text info */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '42%',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingLeft: 'clamp(2.5rem, 5vw, 6rem)', paddingRight: '1rem',
        zIndex: 20,
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.45em', textTransform: 'uppercase',
          color: `${work.accent}80`, marginBottom: '2rem',
        }}>
          {work.index}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 'clamp(1.9rem, 4.2vw, 5rem)',
          color: '#F5F4F0', lineHeight: 0.88, letterSpacing: '-0.03em',
          marginBottom: '2.2rem',
        }}>
          {work.title}
        </h2>
        {work.client && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(245,244,240,0.38)', marginBottom: '0.55rem',
          }}>
            {work.client}
          </p>
        )}
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(245,244,240,0.18)',
        }}>
          {work.genre}
        </p>
        {work.award && (
          <p style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#c9a96e55', marginTop: '1.8rem',
          }}>
            ★&ensp;{work.award}
          </p>
        )}
      </div>

      {/* Right: images */}
      <div style={{
        position: 'absolute', left: '42%', right: 0, top: 0, bottom: 0,
        overflow: 'hidden',
      }}>
        {srcs.length > 0 ? srcs.map((src, i) => {
          const s = PHOTO_SLOTS[i]
          if (!s) return null
          return (
            <div key={i} style={{
              position: 'absolute', top: s.top, left: s.left, width: s.width,
              transform: `rotate(${s.rot}deg)`,
              boxShadow: '0 28px 70px rgba(0,0,0,0.72)',
              border: '1px solid rgba(255,255,255,0.06)',
              zIndex: 10 + i,
            }}>
              <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden' }}>
                <FadeImg src={src} alt={`${work.title} frame ${i + 1}`} />
              </div>
            </div>
          )
        }) : (
          <div style={{
            position: 'absolute', inset: '18% 12%',
            background: `${work.accent}08`, border: `1px solid ${work.accent}14`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 9,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              color: `${work.accent}35`,
            }}>
              {work.genre}
            </span>
          </div>
        )}
      </div>

      {/* Timecode */}
      <div style={{
        position: 'absolute', bottom: '5.5%', left: 'clamp(2.5rem, 5vw, 6rem)',
        fontFamily: 'var(--font-mono)', fontSize: 9,
        letterSpacing: '0.32em', textTransform: 'uppercase',
        color: 'rgba(245,244,240,0.07)', pointerEvents: 'none', zIndex: 30,
      }}>
        TC {work.index}:00:00:00
      </div>
    </div>
  )
}

export default function WorksV1() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinRef       = useRef<HTMLDivElement>(null)
  const trackRef     = useRef<HTMLDivElement>(null)
  const progressRef  = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const pin   = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return

    const reduced  = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    if (reduced) return

    const getScrollLen = () => track.scrollWidth - window.innerWidth

    gsap.to(track, {
      x: () => -getScrollLen(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${getScrollLen()}`,
        scrub: 0.9,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    if (progressRef.current) {
      gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' })
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${getScrollLen()}`,
          scrub: true,
        },
      })
    }
  }, { scope: containerRef })

  return (
    <div ref={containerRef} style={{ background: '#090909' }}>

      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
        style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }}
      >
        <div ref={progressRef} className="absolute inset-0" style={{ background: 'rgba(26,92,58,0.7)' }} />
      </div>

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
        <span
          className="font-mono text-[10px] tracking-[0.35em] uppercase hidden md:block"
          style={{ color: 'rgba(245,244,240,0.15)' }}
        >
          Scroll&ensp;→&ensp;{String(WORKS.length).padStart(2, '0')} Works
        </span>
      </div>

      {/* Playhead line (desktop) */}
      <div
        className="hidden md:block fixed z-40 pointer-events-none"
        style={{ left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(26,92,58,0.15)' }}
      />

      {/* ── Mobile: vertical fallback ──────────────────────────────────── */}
      <div className="md:hidden" style={{ paddingTop: '5rem' }}>
        {WORKS.map(w => (
          <div
            key={w.index}
            style={{
              padding: '2.5rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              position: 'relative',
            }}
          >
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0,
              background: `${w.accent}08`, width: '3px',
            }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: `${w.accent}70`, marginBottom: '0.9rem' }}>
              {w.index}
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.7rem, 7vw, 2.8rem)', color: '#F5F4F0', lineHeight: 0.9, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
              {w.title}
            </h2>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.3)' }}>
              {w.client ? `${w.client} · ` : ''}{w.genre}
            </p>
            {w.award && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c9a96e50', marginTop: '0.8rem' }}>
                ★&ensp;{w.award}
              </p>
            )}
            {w.srcs[0] && (
              <div style={{ marginTop: '1.2rem', aspectRatio: '16/9', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                <FadeImg src={w.srcs[0]} alt={w.title} />
              </div>
            )}
          </div>
        ))}
        <div style={{ padding: '4rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.5rem', color: 'rgba(245,244,240,0.4)', textDecoration: 'none' }}>
            ← Back
          </Link>
        </div>
      </div>

      {/* ── Desktop: pinned horizontal strip ──────────────────────────── */}
      <div ref={pinRef} className="hidden md:block" style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <div ref={trackRef} style={{ display: 'flex', height: '100vh', willChange: 'transform' }}>
          {WORKS.map(w => (
            <Frame key={w.index} work={w} total={WORKS.length} />
          ))}

          {/* End slate */}
          <div style={{
            width: '50vw', height: '100vh', flexShrink: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            borderLeft: '1px solid rgba(245,244,240,0.05)',
          }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.18)', marginBottom: '2.5rem' }}>
              End of Reel — {String(WORKS.length).padStart(2, '0')} Works
            </p>
            <Link
              href="/"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.3rem, 2vw, 2.2rem)', color: 'rgba(245,244,240,0.35)', textDecoration: 'none', transition: 'color 0.45s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.9)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.35)')}
            >
              ← Back to Triangle Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
