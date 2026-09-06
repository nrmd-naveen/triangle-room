'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { num: 18, suffix: '+', label: 'Years in post' },
  { num: 38, suffix: '+', label: 'Years combined\nin the industry' },
  { num: 60, suffix: '+', label: 'Credited productions\namong the three' },
]

export default function StatsWall() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Counter animation
    containerRef.current?.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = parseInt(el.getAttribute('data-count') ?? '0')
      const obj = { val: 0 }
      gsap.to(obj, {
        val: target,
        duration: reduced ? 0 : 2.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reset',
        },
        onUpdate() {
          el.textContent = String(Math.floor(obj.val))
        },
      })
    })

    if (!reduced) {
      // Stagger stat labels in
      gsap.from('.stat-label', {
        opacity: 0,
        y: 10,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      })
    }
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="bg-ink border-t border-edge">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-20">

        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-edge">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className={[
                'py-14 pr-12',
                i < STATS.length - 1 ? 'md:border-r border-edge' : '',
                i > 0 ? 'md:pl-12 md:pr-0' : '',
                i > 0 ? 'border-t md:border-t-0 border-edge' : '',
              ].join(' ')}
            >
              <div
                className="font-display text-fg leading-none"
                style={{ fontSize: 'clamp(52px, 8vw, 84px)', letterSpacing: '-0.01em' }}
              >
                <span data-count={stat.num}>0</span>
                <sup className="text-green align-top" style={{ fontSize: '0.38em', top: '-0.9em', marginLeft: '2px' }}>
                  {stat.suffix}
                </sup>
              </div>
              <div className="stat-label font-mono text-[10.5px] tracking-[0.2em] uppercase text-muted mt-4 leading-[1.7] whitespace-pre-line">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div className="py-8">
          <p className="font-mono text-[11px] tracking-[0.14em] text-muted/60 uppercase">
            Three careers.&nbsp;&nbsp;One company.
          </p>
        </div>
      </div>
    </section>
  )
}
