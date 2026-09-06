'use client'

// WorksV5 — Archive: Mosaic Grid
// ─────────────────────────────────────────
// Metaphor: a curated archive. All works visible at once in a mosaic grid —
// the editor's eye sees the whole picture before diving in. Some cards are wide,
// some tall, like a well-composed contact sheet.
// Category filter at top (sticky). Cards assemble on first scroll.
// Hover: overlay fades in with title, the card breathes open slightly.

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS, CATEGORIES, type Work } from './data'

gsap.registerPlugin(ScrollTrigger)

// Assign varied grid spans for mosaic feel. Cycles through a repeating pattern.
const SPAN_PATTERN = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-2',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
]

function WorkCard({ work, span }: { work: Work; span: string }) {
  const [hovered, setHovered] = useState(false)
  const src = work.srcs[0]

  return (
    <div
      className={span}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: src ? '#0e0e0c' : `${work.accent}12`,
        border: '1px solid rgba(255,255,255,0.06)',
        cursor: 'default',
        width: '100%',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — absolute fill so height is driven by grid row, not content */}
      {src && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={work.title}
            loading="lazy"
            decoding="async"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', display: 'block',
              opacity: 0,
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.55s ease',
            }}
            onLoad={e => { (e.currentTarget as HTMLImageElement).style.opacity = '1' }}
          />
        </div>
      )}

      {/* No-image placeholder */}
      {!src && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${work.accent}15, transparent)`,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.42em', textTransform: 'uppercase',
            color: `${work.accent}45`, textAlign: 'center', padding: '0 1rem',
          }}>
            {work.genre}
          </span>
        </div>
      )}

      {/* Permanent bottom label */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '1.8rem 1.2rem 0.9rem',
        background: 'linear-gradient(to top, rgba(9,9,9,0.82) 0%, transparent 100%)',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)', fontSize: 9,
          letterSpacing: '0.32em', textTransform: 'uppercase',
          color: `${work.accent}70`, marginBottom: '0.3rem',
        }}>
          {work.index}
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 'clamp(0.85rem, 1.5vw, 1.3rem)',
          color: '#F5F4F0', lineHeight: 1.1, letterSpacing: '-0.02em',
        }}>
          {work.title}
        </h2>
      </div>

      {/* Hover overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `${work.accent}18`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
      }} />

      {/* Hover details */}
      <div style={{
        position: 'absolute', top: '1rem', right: '1rem',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        textAlign: 'right',
      }}>
        {work.client && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.55)', marginBottom: '0.25rem' }}>
            {work.client}
          </p>
        )}
        {work.award && (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.14em', color: '#c9a96e80' }}>
            ★
          </p>
        )}
      </div>
    </div>
  )
}

export default function WorksV5() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const gridRef       = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')

  useGSAP(() => {
    const grid = gridRef.current
    if (!grid) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const cards = grid.querySelectorAll<HTMLElement>('.mosaic-card')
    gsap.set(cards, { opacity: 0, y: 30 })

    ScrollTrigger.create({
      trigger: grid,
      start: 'top bottom-=60',
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power3.out',
          stagger: { amount: 0.9, from: 'start' },
        })
      },
      once: true,
    })
  }, { scope: containerRef })

  const filtered = activeFilter === 'All'
    ? WORKS
    : WORKS.filter(w => w.category === activeFilter)

  return (
    <div ref={containerRef} style={{ background: '#090909', minHeight: '100vh' }}>

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
          {String(filtered.length).padStart(2, '0')}&ensp;Works
        </span>
      </div>

      {/* Page header */}
      <div style={{ paddingTop: '18vh', paddingBottom: '4rem', paddingLeft: 'clamp(1.5rem, 5vw, 5rem)', paddingRight: 'clamp(1.5rem, 5vw, 5rem)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 'clamp(3rem, 8vw, 9rem)',
          color: '#F5F4F0', lineHeight: 0.86, letterSpacing: '-0.04em',
          marginBottom: '3rem',
        }}>
          Selected<br />Work
        </h1>

        {/* Category filter */}
        <div
          className="sticky z-40"
          style={{
            top: '64px',
            display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(9,9,9,0.9)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.32em', textTransform: 'uppercase',
                padding: '0.5rem 1rem',
                border: '1px solid',
                borderColor: activeFilter === cat ? 'rgba(26,92,58,0.7)' : 'rgba(255,255,255,0.1)',
                background: activeFilter === cat ? 'rgba(26,92,58,0.15)' : 'transparent',
                color: activeFilter === cat ? 'rgba(245,244,240,0.85)' : 'rgba(245,244,240,0.3)',
                cursor: 'default',
                transition: 'all 0.25s ease',
                borderRadius: '2px',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mosaic grid */}
      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridAutoRows: 'clamp(160px, 22vw, 300px)',
          gap: '3px',
          padding: '0 clamp(1.5rem, 5vw, 5rem) clamp(3rem, 6vw, 6rem)',
        }}
        className="max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-4"
      >
        {filtered.map((w, i) => (
          <div
            key={`${w.index}-${activeFilter}`}
            className={`mosaic-card ${SPAN_PATTERN[i % SPAN_PATTERN.length]}`}
            style={{ height: '100%', minHeight: '180px' }}
          >
            <WorkCard work={w} span="h-full" />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(3rem, 6vw, 6rem) clamp(1.5rem, 5vw, 5rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
      }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(245,244,240,0.15)' }}>
          {String(WORKS.length).padStart(2, '0')} Works — Triangle Room
        </p>
        <Link
          href="/"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(1.1rem, 1.8vw, 2rem)', color: 'rgba(245,244,240,0.3)', textDecoration: 'none', transition: 'color 0.45s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.85)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,244,240,0.3)')}
        >
          ← Back to Triangle Room
        </Link>
      </div>
    </div>
  )
}
