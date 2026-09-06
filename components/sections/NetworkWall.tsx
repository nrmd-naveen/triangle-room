'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const GROUPS = [
  {
    id: 'platforms',
    label: 'Platforms and networks',
    names: [
      'Netflix', 'National Geographic', 'Discovery', 'Prime Video', 'JioHotstar',
      'JioCinema', 'Olympic Channel', 'Star Sports', 'Sony', 'Asianet', 'MTV',
      'Fox Life', 'Colors', 'NDTV Prime', 'Epic', 'Kappa TV', 'Amrita TV',
      'Surya TV', 'Pratilipi FM', 'YouTube',
    ],
  },
  {
    id: 'houses',
    label: 'Production houses',
    names: [
      'Endemol Shine India', 'Banijay', 'Greymatter Entertainment',
      'Dharmatic Entertainment', 'Big Synergy Media Ltd', 'Studio Next, Sony Pictures',
      'Prime Focus Technologies', 'Creator Engine', 'Reliance Entertainment',
      'Silly Monks Entertainment', 'Wonderwall Media', 'Purple Monkey',
      'Slightly Tilted', 'Momomoto Studios',
    ],
  },
  {
    id: 'brands',
    label: 'Brands',
    names: [
      'Mercedes-Benz', 'Red Bull', 'Formula 1', "L'Oréal", 'Hewlett Packard',
      'Platinum', 'Unacademy', 'Exide', 'Sharekhan', 'Blinkit', 'Jellysmack',
      'Glassworks London', 'Metropolis Lab',
    ],
  },
]

export default function NetworkWall() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    GROUPS.forEach(({ id }) => {
      const group = containerRef.current?.querySelector(`[data-group="${id}"]`)
      if (!group) return

      gsap.from(group.querySelectorAll('.net-name'), {
        opacity: 0,
        y: 6,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.035,
        scrollTrigger: {
          trigger: group,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.from(group.querySelector('.net-group-label'), {
        opacity: 0,
        y: 8,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="bg-ink py-16 md:py-20">
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-20">

        <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-muted/50 mb-12">
          Our work has been made for
        </div>

        <div className="space-y-12">
          {GROUPS.map(({ id, label, names }) => (
            <div key={id} data-group={id} className="pb-12 border-b border-edge last:border-0 last:pb-0">
              <div className="net-group-label font-mono text-[10px] tracking-[0.22em] uppercase text-green mb-5 pb-4 border-b border-edge/60">
                {label}
              </div>
              <div className="flex flex-wrap gap-x-7 gap-y-3 items-baseline">
                {names.map((name) => (
                  <span
                    key={name}
                    className="net-name font-display text-fg/70 hover:text-fg transition-colors duration-200"
                    style={{ fontSize: 'clamp(15px, 1.8vw, 20px)' }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
