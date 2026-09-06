'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SLATE = [
  {
    label: 'Documentary',
    desc: 'Feature and series. Character led, internationally finishable, built on access we already have.',
  },
  {
    label: 'Premium unscripted',
    desc: 'Original formats for Malayalam and pan Indian streaming. Designed to return for a second season.',
  },
  {
    label: 'Fiction',
    desc: 'Features and scripted originals, written in house and rooted in stories from here.',
  },
]

export default function Building() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.from('.building-head', {
      opacity: 0, y: 20,
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.building-head', start: 'top 82%', toggleActions: 'play none none reverse' },
    })

    gsap.from('.building-sub', {
      opacity: 0, y: 16,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.building-sub', start: 'top 82%', toggleActions: 'play none none reverse' },
    })

    gsap.from('.slate-item', {
      opacity: 0, y: 14,
      duration: 0.7, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '.slate-grid', start: 'top 80%', toggleActions: 'play none none reverse' },
    })

    gsap.from('.building-cta', {
      opacity: 0, y: 12,
      duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.building-cta', start: 'top 85%', toggleActions: 'play none none reverse' },
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="text-fg py-24 md:py-32"
      style={{ backgroundColor: '#0D4A31' }}
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-20">

        <div className="building-head font-mono text-[11px] tracking-[0.24em] uppercase text-[#8FBBA1] mb-6">
          What we are building
        </div>

        <h2
          className="building-head font-display text-fg leading-[1.22] max-w-[22ch]"
          style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}
        >
          Documentaries, premium unscripted formats and original fiction, rooted in South India and made for audiences anywhere.
        </h2>

        <p className="building-sub font-sans text-[17px] leading-[1.6] text-[#C7DCCF] mt-7 max-w-[52ch]">
          Our first slate is in active development across all three. We are talking to platforms now.
        </p>

        {/* Slate grid */}
        <div className="slate-grid grid grid-cols-1 md:grid-cols-3 mt-14 border-t border-l border-[#2C6047]">
          {SLATE.map(({ label, desc }) => (
            <div
              key={label}
              className="slate-item border-r border-b border-[#2C6047] p-7 md:p-8"
            >
              <h3 className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-[#8FBBA1] font-medium mb-3">
                {label}
              </h3>
              <p className="font-sans text-[15.5px] leading-[1.55] text-[#DCE8E0]">{desc}</p>
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="building-cta inline-block mt-10 font-mono text-[12.5px] tracking-[0.14em] uppercase text-fg border-b border-[#6FA485] pb-0.5 hover:border-fg transition-colors duration-300"
        >
          Ask to see the slate
        </a>

      </div>
    </section>
  )
}
