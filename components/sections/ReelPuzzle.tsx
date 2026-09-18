'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const COLS = 7
const ROWS = 4
const TOTAL = COLS * ROWS

interface ReelPuzzleProps {
  posterSrc?: string
  videoSrc?:  string
}

// Placeholder gradient per tile so structure is visible before real image loads.
// Generates a cinematic dark-green sweep across the grid.
function tilePlaceholder(col: number, row: number): string {
  const hue   = 145 + (col / (COLS - 1)) * 20
  const light = 8  + (row  / (ROWS - 1)) * 12 + (col / (COLS - 1)) * 8
  return `hsl(${hue}, 40%, ${light}%)`
}

export default function ReelPuzzle({
  posterSrc = '/images/reel-poster.webp',
  videoSrc  = '',
}: ReelPuzzleProps) {
  const POSTER_SRC = posterSrc
  const VIDEO_SRC  = videoSrc

  const wrapRef           = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef          = useRef<HTMLVideoElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tiles = gsap.utils.toArray<HTMLElement>('.rp-tile', wrapRef.current)

    if (prefersReduced) {
      gsap.set(tiles, { clearProps: 'all' })
      gsap.set(videoContainerRef.current, { opacity: 1 })
      return
    }

    // Each tile starts scattered — random position, deep in Z, blurred, invisible.
    // Values generated client-side inside useGSAP so no SSR mismatch.
    tiles.forEach((tile) => {
      gsap.set(tile, {
        xPercent: gsap.utils.random(-500, 500),
        yPercent: gsap.utils.random(-400, 400),
        z:        gsap.utils.random(-2000, -300),
        scale:    0.2,
        opacity:  0,
        filter:   'blur(40px)',
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:             wrapRef.current,
        start:               'top top',
        end:                 'bottom bottom',
        scrub:               1.5,
        invalidateOnRefresh: true,
      },
    })

    // Phase 1 — tiles converge to their grid positions
    tl.to(tiles, {
      xPercent: 0,
      yPercent: 0,
      z:        0,
      scale:    1,
      opacity:  1,
      filter:   'blur(0px)',
      duration: 0.7,
      stagger:  { each: 0.018, from: 'random' },
      ease:     'power2.out',
    })
    // Phase 2 — video cross-fades over the assembled image
    .to(videoContainerRef.current, {
      opacity:  1,
      duration: 0.3,
      ease:     'none',
      onStart:  () => videoRef.current?.play().catch(() => {}),
    })
  }, { scope: wrapRef })

  return (
    // overflowX clip prevents a horizontal scrollbar from scattered tiles
    // without breaking sticky positioning (unlike overflow:hidden)
    <div
      ref={wrapRef}
      className="relative bg-ink reel-puzzle-scroll"
      style={{ overflowX: 'clip' }}
    >
      <div className="sticky top-0 flex items-center justify-center" style={{ height: '100svh' }}>

        {/* Corner meta-labels */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none select-none">
          <span className="font-mono text-[10px] tracking-[0.45em] uppercase text-fg/30">
            Showreel
          </span>
        </div>
        <div className="absolute top-8 right-8 z-20 pointer-events-none select-none">
          <span className="font-mono text-[10px] tracking-[0.45em] uppercase text-fg/30">
            2025
          </span>
        </div>

        {/* ── Puzzle + video container ─────────────────────────────── */}
        <div className="relative flex h-auto w-full items-start justify-center px-[3vw] md:px-[4.10vw]">
          {/*
            perspective is set here so all child tiles share the same
            vanishing point. transformStyle: preserve-3d passes it through
            to the nested grid + individual tiles.
          */}
          <div
            className="relative w-full max-w-[94vw] md:max-w-[69.4vw]"
            style={{
              aspectRatio:    '1.784 / 1',
              perspective:    '1200px',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Video overlay — opacity 0 until tiles fully assemble */}
            <div
              ref={videoContainerRef}
              className="absolute inset-0 z-10 overflow-hidden"
              style={{ opacity: 0 }}
            >
              {VIDEO_SRC ? (
                <video
                  ref={videoRef}
                  loop
                  muted
                  playsInline
                  poster={POSTER_SRC}
                  className="h-full w-full object-cover"
                  src={VIDEO_SRC}
                />
              ) : (
                // Poster-only until video asset is ready
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:    `url(${POSTER_SRC})`,
                    backgroundSize:     'cover',
                    backgroundPosition: 'center',
                    backgroundColor:    '#0d1a0f', // dark-green fallback
                  }}
                />
              )}
            </div>

            {/* 7 × 4 tile grid ---------------------------------------- */}
            <div
              className="relative z-0 grid h-full w-full"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                gridTemplateRows:    `repeat(${ROWS}, 1fr)`,
                transformStyle:      'preserve-3d',
              }}
            >
              {Array.from({ length: TOTAL }, (_, i) => {
                const col = i % COLS
                const row = Math.floor(i / COLS)

                // background-position maps this div to its exact slice of the image.
                // With background-size: 700% 400%, each tile shows 1/7 × 1/4 of the image.
                const bgX = (col / (COLS - 1)) * 100   // 0 → 100 %
                const bgY = (row / (ROWS - 1)) * 100   // 0 → 100 %

                return (
                  <div
                    key={i}
                    className="rp-tile"
                    style={{
                      // Real image (swap path when asset is ready)
                      backgroundImage:    `url(${POSTER_SRC})`,
                      backgroundSize:     `${COLS * 100}% ${ROWS * 100}%`,
                      backgroundPosition: `${bgX}% ${bgY}%`,
                      backgroundRepeat:   'no-repeat',
                      // Placeholder color shown when image hasn't loaded yet
                      backgroundColor:    tilePlaceholder(col, row),
                      // Slightly oversized to avoid sub-pixel seam gaps between tiles
                      width:              '101%',
                      height:             '101%',
                      backfaceVisibility: 'hidden',
                    }}
                  />
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
