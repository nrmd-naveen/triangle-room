'use client'

/**
 * CircleOrbit — Discipline orbit
 * 8 discipline cards orbit a circle. Dark section for cinematic contrast.
 * Cards: warm polaroid style with gradient colour fields.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DISCIPLINES = [
  {
    label: 'Documentary',
    gradient: 'linear-gradient(145deg, #1a0f06 0%, #6b3a10 50%, #a8591a 100%)',
    accent: '#c9a96e',
  },
  {
    label: 'Reality',
    gradient: 'linear-gradient(145deg, #1a0505 0%, #6b1010 50%, #a81a1a 100%)',
    accent: '#d94a4a',
  },
  {
    label: 'Live',
    gradient: 'linear-gradient(145deg, #020c1e 0%, #0d2a4f 50%, #1a4a8b 100%)',
    accent: '#4a90d9',
  },
  {
    label: 'Music',
    gradient: 'linear-gradient(145deg, #0a0514 0%, #2d1050 50%, #5a1fa0 100%)',
    accent: '#9b6ed4',
  },
  {
    label: 'Fiction',
    gradient: 'linear-gradient(145deg, #020e08 0%, #0a3018 50%, #165c2e 100%)',
    accent: '#1A5C3A',
  },
  {
    label: 'Audio Drama',
    gradient: 'linear-gradient(145deg, #080a14 0%, #1a2050 50%, #2e3a8b 100%)',
    accent: '#6a8bd4',
  },
  {
    label: 'Ad-Film',
    gradient: 'linear-gradient(145deg, #120500 0%, #4f1800 50%, #8b2e00 100%)',
    accent: '#d97a3a',
  },
  {
    label: 'Post',
    gradient: 'linear-gradient(145deg, #020a10 0%, #0d2a3d 50%, #1a526b 100%)',
    accent: '#4abcd9',
  },
]

const TILTS = [0, 0, 0, 0, 0, 0, 0, 0]
const R = 380

export default function CircleOrbit() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const ringRef    = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.fromTo(
      ringRef.current,
      { rotate: -45 },
      {
        rotate: 45,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end:   'bottom top',
          scrub: 1.5,
        },
      }
    )
  }, { scope: sectionRef })

  const N = DISCIPLINES.length

  return (
    <section
      id="genres"
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: '170vh', minHeight: 1500, padding: '80px 0', background: '#0D0D0B', isolation: 'isolate' }}
      aria-label="What we make"
    >
      <div className="relative flex items-center justify-center w-full h-full">

        {/* Background text — behind ring */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 0 }}
          aria-hidden
        >
          <Headline color="rgba(245,244,240,1)">Every</Headline>
          <Headline color="rgba(245,244,240,0.06)">Format</Headline>
          <Headline color="rgba(245,244,240,0)">Delivered</Headline>
        </div>

        {/* Ring outline */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width:  R * 2 + 110,
            height: R * 2 + 110,
            border: '1px solid rgba(245,244,240,0.04)',
            zIndex: 5,
          }}
        />

        {/* Rotating ring */}
        <div
          ref={ringRef}
          className="relative shrink-0"
          style={{ width: R * 2, height: R * 2, zIndex: 10 }}
        >
          {DISCIPLINES.map((disc, i) => {
            const angleDeg = -102 + (i / (N - 1)) * 315
            const angleRad = (angleDeg * Math.PI) / 180
            const cx = R + R * Math.sin(angleRad)
            const cy = R - R * Math.cos(angleRad)

            return (
              <div
                key={disc.label}
                className="absolute"
                style={{
                  left:      cx,
                  top:       cy,
                  transform: `translate(-50%, -50%) rotate(${angleDeg + TILTS[i]}deg)`,
                }}
              >
                <DisciplineCard disc={disc} index={i} />
              </div>
            )
          })}
        </div>

        {/* "Delivered" in front of ring */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ zIndex: 20 }}
          aria-hidden
        >
          <Headline color="rgba(245,244,240,0)">Every</Headline>
          <Headline color="rgba(245,244,240,0)">Format</Headline>
          <Headline color="rgba(245,244,240,1)">Delivered</Headline>
        </div>

        {/* Label */}
        <p
          className="absolute font-mono uppercase text-fg/20"
          style={{ bottom: 40, fontSize: 9, zIndex: 25, letterSpacing: '0.4em' }}
          aria-hidden
        >
          What We Make
        </p>

      </div>
    </section>
  )
}

function Headline({ children, color }: { children: string; color: string }) {
  return (
    <p
      className="font-display font-medium whitespace-nowrap text-center leading-[0.85]"
      style={{ fontSize: 'clamp(64px, 10.5vw, 155px)', letterSpacing: '-0.03em', color }}
    >
      {children}
    </p>
  )
}

function DisciplineCard({ disc, index }: { disc: (typeof DISCIPLINES)[0]; index: number }) {
  return (
    <div
      style={{
        width:        206,
        height:       250,
        borderRadius: 3,
        background:   '#f2ede3',
        boxShadow: [
          '0 2px 4px rgba(0,0,0,0.55)',
          '0 8px 24px rgba(0,0,0,0.50)',
          '0 20px 60px rgba(0,0,0,0.35)',
          'inset 0 1px 0 rgba(255,255,255,0.6)',
        ].join(', '),
        padding:        '7px 7px 0 7px',
        display:        'flex',
        flexDirection:  'column',
        overflow:       'hidden',
        position:       'relative',
      }}
    >
      <div style={{ flex: 1, borderRadius: 1, overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: disc.gradient }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.55) 100%)' }} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }} aria-hidden>
          <filter id={`grain-${index}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${index})`} />
        </svg>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: disc.accent, opacity: 0.7 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>
          <span style={{ fontSize: 13, fontWeight: 300, color: 'rgba(240,237,232,0.92)', letterSpacing: '0.01em', lineHeight: 1.2, textAlign: 'center', textShadow: '0 1px 4px rgba(0,0,0,0.6)', position: 'relative', zIndex: 1, fontFamily: 'var(--font-display)' }}>
            {disc.label}
          </span>
        </div>
        <span style={{ position: 'absolute', top: 4, right: 5, fontSize: 7, fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em', lineHeight: 1, zIndex: 1 }}>
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: disc.accent, opacity: 0.6, flexShrink: 0 }} />
        <span style={{ fontSize: 7.5, fontFamily: 'monospace', color: 'rgba(20,15,10,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1 }}>
          {disc.label}
        </span>
      </div>
    </div>
  )
}
