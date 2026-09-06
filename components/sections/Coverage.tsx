'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const DISCIPLINES = [
  { name: 'Documentary',        sub: 'Series and feature' },
  { name: 'Reality and format', sub: 'Studio and location' },
  { name: 'Live production',    sub: 'Sport and events' },
  { name: 'Music',              sub: 'Series and video' },
  { name: 'Fiction',            sub: 'Short and feature' },
  { name: 'Audio drama',        sub: 'Scripted series' },
  { name: 'Ad film',            sub: 'Brand and agency' },
  { name: 'Post production',    sub: 'Story and finish' },
]

export default function Coverage() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.from('.coverage-header', {
      opacity: 0, y: 16,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.coverage-header', start: 'top 82%', toggleActions: 'play none none reverse' },
    })

    gsap.from('.discipline-tile', {
      opacity: 0,
      y: 12,
      duration: 0.6,
      ease: 'power3.out',
      stagger: { each: 0.07, from: 'start' },
      scrollTrigger: {
        trigger: '.coverage-grid',
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      },
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="bg-paper-deep text-ink border-t border-line">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-20 py-24 md:py-32">

        <div className="coverage-header mb-5 flex items-baseline gap-4">
          <span className="font-mono text-[12px] text-green tracking-[0.1em]">02</span>
          <h2 className="font-display text-ink" style={{ fontSize: 'clamp(24px, 3.2vw, 34px)' }}>
            What we cover
          </h2>
        </div>

        <p className="coverage-header font-mono text-[11.5px] tracking-[0.06em] text-dim leading-[1.7] mb-14 max-w-[68ch]">
          Three people, three disciplines, one company. There is very little in this industry one of us has not already shipped.
        </p>

        {/* Grid — 4 cols desktop, 2 cols tablet, 1 col mobile */}
        <div className="coverage-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border-t border-l border-line">
          {DISCIPLINES.map(({ name, sub }) => (
            <div
              key={name}
              className="discipline-tile border-r border-b border-line p-6 md:p-7 hover:bg-[#0D4A31] hover:text-fg group transition-colors duration-300"
            >
              <h3 className="font-display text-ink group-hover:text-fg text-[18px] leading-[1.2] mb-2 transition-colors duration-300">
                {name}
              </h3>
              <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-dim group-hover:text-fg/60 transition-colors duration-300">
                {sub}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
