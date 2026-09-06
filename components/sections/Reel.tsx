'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Reel() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      gsap.set('.reel-frame', { width: '100vw', height: '100vh', borderRadius: 0 })
      gsap.set('.reel-label', { opacity: 0 })
      return
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        invalidateOnRefresh: true,
      },
    })

    tl
      .to('.reel-label', { opacity: 0, scale: 1.06, duration: 0.25 })
      .to('.reel-frame', {
        width: '100vw',
        height: '100vh',
        borderRadius: 0,
        duration: 0.65,
        ease: 'power2.inOut',
      }, '<')
      .to('.reel-inner-text', { opacity: 1, duration: 0.2 })
  }, { scope: wrapRef })

  return (
    <div ref={wrapRef} className="relative bg-bg" style={{ height: '320vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden bg-bg">

        {/* Label above frame */}
        <div className="reel-label absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none gap-2">
          <span className="font-mono text-[10px] tracking-[0.45em] uppercase text-muted/50">
            Showreel
          </span>
          <span
            className="font-display text-muted/20"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', fontWeight: 300, letterSpacing: '-0.03em' }}
          >
            2025
          </span>
        </div>

        {/* The expanding frame */}
        <div
          className="reel-frame relative overflow-hidden will-change-[width,height,border-radius]"
          style={{
            width: '56vw',
            height: '66vh',
            borderRadius: '2px',
            background: 'linear-gradient(160deg, #0d0d0b 0%, #080807 50%, #0b0b09 100%)',
            border: '1px solid #1E1E1C',
          }}
        >
          {/* Scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.006) 3px, rgba(255,255,255,0.006) 4px)',
            }}
          />

          {/* Film metadata */}
          <div className="absolute top-5 left-5 font-mono text-[8.5px] tracking-[0.3em] uppercase text-fg/20">
            TC 00:00:00:00
          </div>
          <div className="absolute top-5 right-5 font-mono text-[8.5px] tracking-[0.3em] uppercase text-fg/20">
            REEL_2025.MOV
          </div>

          {/* Full-screen message */}
          <div className="reel-inner-text absolute inset-0 flex flex-col items-center justify-end pb-16 opacity-0">
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-fg/40">
              Reel available on request — connect@triangleroom.in
            </p>
          </div>

          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
