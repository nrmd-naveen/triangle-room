'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATEMENT =
  'Three careers across documentary, reality, live and fiction. Now one company. There is very little in this industry one of us has not already shipped.'

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const words = sectionRef.current?.querySelectorAll('.stmt-word')
    if (!words) return

    if (prefersReduced) {
      gsap.set(words, { color: '#0D0D0B', opacity: 1 })
      return
    }

    // Start near-invisible, scrub to ink
    gsap.set(words, { color: '#DDD9D2' })

    gsap.to(words, {
      color: '#0D0D0B',
      stagger: 0.04,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 58%',
        end: 'center 42%',
        scrub: 1.2,
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center px-6 md:px-12 py-24 md:py-32"
      style={{ background: '#F3F4F0' }}
    >
      {/* Corner details */}
      <div className="absolute top-6 right-8 font-mono text-[9px] tracking-[0.38em] pointer-events-none select-none"
           style={{ color: 'rgba(13,13,11,0.14)' }} aria-hidden>
        03
      </div>
      <div className="absolute bottom-14 left-8 font-mono text-[11px] pointer-events-none select-none"
           style={{ color: 'rgba(13,13,11,0.12)' }} aria-hidden>×</div>
      <div className="absolute bottom-14 right-8 font-mono text-[11px] pointer-events-none select-none"
           style={{ color: 'rgba(13,13,11,0.12)' }} aria-hidden>×</div>

      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'rgba(13,13,11,0.07)' }} />

      <div style={{ maxWidth: '72rem' }}>

        {/* Label */}
        <p className="font-mono text-[9.5px] tracking-[0.4em] uppercase mb-10"
           style={{ color: 'rgba(13,13,11,0.35)' }}>
          Our approach
        </p>

        {/* Statement */}
        <p
          className="font-display leading-[1.28] tracking-[-0.025em]"
          style={{ fontSize: 'clamp(1.7rem, 4.2vw, 4.2rem)', fontWeight: 300 }}
        >
          {STATEMENT.split(' ').map((word, i) => (
            <span key={i} className="stmt-word inline-block mr-[0.28em]">
              {word}
            </span>
          ))}
        </p>

      </div>
    </section>
  )
}
