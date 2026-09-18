'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// V3 — Three-speed Parallax
// Three rows at different speeds, different image sizes and aspect ratios.
// GSAP scroll-velocity multiplier: strips speed up as you scroll, slow to drift when idle.
// Most dynamic of the three.

const DEFAULT_ROW_A = [16, 32, 48, 64, 80, 96, 112, 128, 144, 160].map(
  s => `https://picsum.photos/seed/${s}/420/240`
)
const DEFAULT_ROW_B = [18, 36, 54, 72, 90, 108, 126, 144, 162, 180].map(
  s => `https://picsum.photos/seed/${s}/240/300`
)
const DEFAULT_ROW_C = [22, 44, 66, 88, 110, 132, 154, 176, 198, 220].map(
  s => `https://picsum.photos/seed/${s}/340/220`
)

export interface ReelStripImages {
  rowA: string[]
  rowB: string[]
  rowC: string[]
}

interface RowConfig {
  images: string[]
  baseSpeed: number   // animation duration in seconds (higher = slower)
  direction: 'left' | 'right'
  imageW: number
  imageH: number
  gap: number
}

export default function ReelStripV3({ images }: { images?: ReelStripImages }) {
  const rowA = images?.rowA.length ? images.rowA : DEFAULT_ROW_A
  const rowB = images?.rowB.length ? images.rowB : DEFAULT_ROW_B
  const rowC = images?.rowC.length ? images.rowC : DEFAULT_ROW_C

  const ROWS: RowConfig[] = [
    { images: rowA, baseSpeed: 22, direction: 'left',  imageW: 420, imageH: 240, gap: 10 },
    { images: rowB, baseSpeed: 38, direction: 'right', imageW: 240, imageH: 300, gap: 12 },
    { images: rowC, baseSpeed: 28, direction: 'left',  imageW: 340, imageH: 220, gap: 10 },
  ]
  const sectionRef = useRef<HTMLElement>(null)
  const trackRefs = useRef<(HTMLDivElement | null)[]>([])

  const reduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // GSAP scroll velocity: scale the CSS animation speed up/down via playbackRate
  useGSAP(() => {
    if (reduced) return

    let currentVelocity = 1

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const velocity = Math.abs(self.getVelocity()) / 1000
        const target = 1 + Math.min(velocity, 8)
        // Lerp currentVelocity toward target
        currentVelocity += (target - currentVelocity) * 0.1

        trackRefs.current.forEach((el) => {
          if (!el) return
          const animations = el.getAnimations()
          animations.forEach((anim) => {
            (anim as CSSAnimation).effect?.updateTiming?.({ playbackRate: undefined })
            anim.playbackRate = currentVelocity
          })
        })
      },
    })

    // Decay back to 1× when not scrolling
    const ticker = gsap.ticker.add(() => {
      if (currentVelocity > 1.02) {
        currentVelocity += (1 - currentVelocity) * 0.04
        trackRefs.current.forEach((el) => {
          if (!el) return
          el.getAnimations().forEach(anim => { anim.playbackRate = currentVelocity })
        })
      }
    })

    return () => {
      gsap.ticker.remove(ticker)
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0D0D0B]"
      style={{ paddingBlock: 'clamp(4rem, 8vw, 7rem)' }}
    >
      <style>{`
        @keyframes v3-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes v3-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
      `}</style>

      {/* Section label + headline */}
      <div className="relative z-10 text-center mb-10 md:mb-16 px-6">
        <p
          className="font-mono text-[#F5F4F0]/25 mb-5"
          style={{ fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase' }}
        >
          Selected Work
        </p>
        <h2
          className="font-display text-[#F5F4F0]"
          style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 3.8rem)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
          }}
        >
          Our Gallery
        </h2>
      </div>

      {/* Three-row strips — different speeds */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ROWS.map((row, ri) => (
          <div key={ri} className="overflow-hidden">
            <div
              ref={el => { trackRefs.current[ri] = el }}
              style={{
                display: 'flex',
                width: 'fit-content',
                gap: row.gap,
                animation: reduced
                  ? 'none'
                  : `${row.direction === 'left' ? 'v3-left' : 'v3-right'} ${row.baseSpeed}s linear infinite`,
              }}
            >
              {[...row.images, ...row.images].map((src, i) => (
                <div
                  key={i}
                  style={{
                    width: row.imageW,
                    height: row.imageH,
                    flexShrink: 0,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid #1C1C1A',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to right, #0D0D0B 0%, transparent 14%, transparent 86%, #0D0D0B 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to bottom, #0D0D0B 0%, transparent 20%, transparent 80%, #0D0D0B 100%)',
        }}
      />
    </section>
  )
}
