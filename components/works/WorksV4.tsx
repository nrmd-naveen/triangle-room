'use client'

// WorksV4 — EDL: The Editor's Archive
// ─────────────────────────────────────────
// Metaphor: an Edit Decision List — the literal document editors use to log every
// cut in a project. All 27 works presented as rows in a monospace EDL table.
// The insider moment: hover a row and production stills float up near your cursor,
// like pulling a clip out of the timeline into a preview monitor.
// Rows stagger in on scroll. The entire page reads as a professional document.

import Link from 'next/link'
import { useRef, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS } from './data'

gsap.registerPlugin(ScrollTrigger)

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

export default function WorksV4() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const rowRefs       = useRef<(HTMLTableRowElement | null)[]>([])
  const previewRef    = useRef<HTMLDivElement>(null)
  const activeWi      = useRef<number>(-1)
  const mouseXY       = useRef({ x: 0, y: 0 })
  const rafRef        = useRef<number | null>(null)

  // Smooth mouse follower using rAF
  const trackMouse = useCallback((e: MouseEvent) => {
    mouseXY.current = { x: e.clientX, y: e.clientY }
  }, [])

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Stagger rows in on scroll
    if (!reduced) {
      rowRefs.current.forEach((row, i) => {
        if (!row) return
        gsap.set(row, { opacity: 0, x: -12 })
        ScrollTrigger.create({
          trigger: row,
          start: 'top bottom-=40',
          onEnter: () => {
            gsap.to(row, {
              opacity: 1, x: 0,
              duration: 0.5, ease: 'power2.out',
              delay: (i % 8) * 0.03, // subtle cascade per visible batch
            })
          },
          once: true,
        })
      })
    }

    // Floating preview logic
    const preview = previewRef.current
    if (!preview || reduced) return

    window.addEventListener('mousemove', trackMouse)

    const tick = () => {
      if (activeWi.current >= 0 && preview) {
        const tx = mouseXY.current.x + 24
        const ty = mouseXY.current.y - 100
        gsap.to(preview, {
          x: tx, y: ty,
          duration: 0.55, ease: 'power2.out',
          overwrite: 'auto',
        })
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', trackMouse)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, { scope: containerRef })

  const showPreview = (wi: number) => {
    const preview = previewRef.current
    if (!preview) return
    activeWi.current = wi
    const work = WORKS[wi]

    // Update images
    const imgs = preview.querySelectorAll<HTMLDivElement>('.edl-preview-slot')
    imgs.forEach((slot, i) => {
      const src = work.srcs[i]
      const img = slot.querySelector('img')
      if (img && src) {
        if (img.getAttribute('src') !== src) {
          img.style.opacity = '0'
          img.setAttribute('src', src)
          img.setAttribute('alt', `${work.title} ${i + 1}`)
          img.onload = () => { img.style.opacity = '1' }
        }
        slot.style.display = 'block'
      } else {
        slot.style.display = 'none'
      }
    })

    // Show if there are images
    if (work.srcs.length > 0) {
      gsap.set(preview, { opacity: 0, scale: 0.92, display: 'block' })
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(1.2)' })
    }
  }

  const hidePreview = () => {
    const preview = previewRef.current
    if (!preview) return
    activeWi.current = -1
    gsap.to(preview, { opacity: 0, scale: 0.94, duration: 0.22, ease: 'power2.in', onComplete: () => { preview.style.display = 'none' } })
  }

  return (
    <div ref={containerRef} style={{ background: '#090909', minHeight: '100vh' }}>

      {/* Floating preview */}
      <div
        ref={previewRef}
        style={{
          position: 'fixed', top: 0, left: 0,
          width: 'clamp(280px, 28vw, 420px)',
          zIndex: 100, pointerEvents: 'none', display: 'none',
          transform: 'translate(0,0)',
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="edl-preview-slot"
              style={{
                width: i === 0 ? '100%' : i === 1 ? '72%' : '54%',
                position: i === 0 ? 'relative' : 'absolute',
                top: i === 1 ? 'calc(100% - 30%)' : i === 2 ? 'calc(100% - 10%)' : undefined,
                right: i === 1 ? '-8%' : i === 2 ? '10%' : undefined,
                transform: i === 0 ? 'rotate(-2deg)' : i === 1 ? 'rotate(4deg)' : 'rotate(-1deg)',
                boxShadow: '0 20px 55px rgba(0,0,0,0.75)',
                border: '1px solid rgba(255,255,255,0.08)',
                zIndex: 3 - i,
                display: 'none',
              }}
            >
              <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', background: '#1a1a18' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src=""
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0, transition: 'opacity 0.5s ease' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(9,9,9,0.95) 60%, transparent)' }}
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
          EDL / Post History
        </span>
      </div>

      {/* Page header */}
      <div style={{ paddingTop: '18vh', paddingBottom: '5rem', paddingLeft: 'clamp(1.5rem, 8vw, 9rem)', paddingRight: 'clamp(1.5rem, 8vw, 9rem)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.2)', marginBottom: '1.2rem' }}>
          TITLE: TRIANGLE ROOM — POST HISTORY&emsp;REEL: 001&emsp;TOTAL EVENTS: {String(WORKS.length).padStart(3, '0')}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 'clamp(3rem, 7vw, 8rem)',
          color: '#F5F4F0', lineHeight: 0.86, letterSpacing: '-0.04em',
        }}>
          Selected<br />Work
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.18)', marginTop: '2rem' }}>
          Hover a project to preview frames
        </p>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%', borderCollapse: 'collapse',
          minWidth: '600px',
        }}>
          {/* Column header */}
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['#', 'TITLE', 'CLIENT', 'FORMAT', 'NOTES'].map((col, ci) => (
                <th
                  key={col}
                  style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    letterSpacing: '0.38em', textTransform: 'uppercase',
                    color: 'rgba(245,244,240,0.22)', fontWeight: 400,
                    padding: '1rem clamp(0.8rem, 2vw, 2rem) 1rem',
                    textAlign: 'left',
                    paddingLeft: ci === 0 ? 'clamp(1.5rem, 8vw, 9rem)' : undefined,
                    paddingRight: ci === 4 ? 'clamp(1.5rem, 8vw, 9rem)' : undefined,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {WORKS.map((w, i) => (
              <tr
                key={w.index}
                ref={el => { rowRefs.current[i] = el }}
                onMouseEnter={() => showPreview(i)}
                onMouseLeave={hidePreview}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  cursor: 'default',
                  transition: 'background 0.2s ease',
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLTableRowElement).style.background = `${w.accent}0a`
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'
                }}
              >
                {/* # */}
                <td style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  letterSpacing: '0.38em', color: `${w.accent}70`,
                  padding: 'clamp(1rem, 2vh, 1.5rem) clamp(0.8rem, 2vw, 2rem)',
                  paddingLeft: 'clamp(1.5rem, 8vw, 9rem)',
                  whiteSpace: 'nowrap', verticalAlign: 'middle',
                }}>
                  {w.index}
                </td>

                {/* Title */}
                <td style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600,
                  fontSize: 'clamp(1rem, 1.8vw, 1.6rem)',
                  color: '#F5F4F0', letterSpacing: '-0.02em', lineHeight: 1.1,
                  padding: 'clamp(1rem, 2vh, 1.5rem) clamp(0.8rem, 2vw, 2rem)',
                  verticalAlign: 'middle',
                }}>
                  {w.title}
                  {w.srcs.length > 0 && (
                    <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: 'rgba(26,92,58,0.6)', marginLeft: '0.7rem', verticalAlign: 'middle' }} />
                  )}
                </td>

                {/* Client */}
                <td style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(245,244,240,0.35)',
                  padding: 'clamp(1rem, 2vh, 1.5rem) clamp(0.8rem, 2vw, 2rem)',
                  whiteSpace: 'nowrap', verticalAlign: 'middle',
                }}>
                  {w.client || '—'}
                </td>

                {/* Format/Genre */}
                <td style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  letterSpacing: '0.22em', textTransform: 'uppercase',
                  color: 'rgba(245,244,240,0.2)',
                  padding: 'clamp(1rem, 2vh, 1.5rem) clamp(0.8rem, 2vw, 2rem)',
                  whiteSpace: 'nowrap', verticalAlign: 'middle',
                }}>
                  {w.genre}
                </td>

                {/* Notes/Award */}
                <td style={{
                  fontFamily: 'var(--font-mono)', fontSize: 9,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: w.award ? '#c9a96e60' : 'rgba(245,244,240,0.1)',
                  padding: 'clamp(1rem, 2vh, 1.5rem) clamp(0.8rem, 2vw, 2rem)',
                  paddingRight: 'clamp(1.5rem, 8vw, 9rem)',
                  verticalAlign: 'middle',
                }}>
                  {w.award ? `★ ${w.award}` : `${w.srcs.length} frame${w.srcs.length !== 1 ? 's' : ''}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 8vw, 9rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.32em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.15)' }}>
          End of list — {String(WORKS.length).padStart(3, '0')} events
        </p>
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.1rem, 1.8vw, 1.8rem)', color: 'rgba(245,244,240,0.3)', textDecoration: 'none', transition: 'color 0.45s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.85)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.3)')}
        >
          ← Back to Triangle Room
        </Link>
      </div>
    </div>
  )
}
