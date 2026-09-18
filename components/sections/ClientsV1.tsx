'use client'

/**
 * ClientsV1 — "Drift"
 * Three rows of client logos drifting in alternating directions on scroll.
 * Every logo appears exactly once. Fixed bounding box keeps sizes consistent.
 * mix-blend-mode:multiply dissolves white backgrounds into the paper surface.
 *
 * NOTE: natgeo.svg is a broken HTML file — replace with a real file to add it back.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

import type { Logo } from '@/lib/site-config'

const DEFAULT_ROW_1: Logo[] = [
  { src: '/logos/netflix.png',         alt: 'Netflix' },
  { src: '/logos/prime-video.png',     alt: 'Prime Video' },
  { src: '/logos/discovery.png',       alt: 'Discovery Channel' },
  { src: '/logos/jiohotstar.png',      alt: 'JioHotstar' },
  { src: '/logos/star-sports.jpg',     alt: 'Star Sports' },
  { src: '/logos/formula1.avif',       alt: 'Formula 1' },
  { src: '/logos/mercedes.svg',        alt: 'Mercedes-Benz' },
]

const DEFAULT_ROW_2: Logo[] = [
  { src: '/logos/olympic-channel.png', alt: 'Olympic Channel' },
  { src: '/logos/red-bull.svg',        alt: 'Red Bull' },
  { src: '/logos/loreal.png',          alt: "L'Oréal" },
  { src: '/logos/fox-life.jpg',        alt: 'Fox Life' },
  { src: '/logos/epic-channel.jpg',    alt: 'Epic Channel' },
  { src: '/logos/colors-tv.webp',      alt: 'Colors TV' },
]

const DEFAULT_ROW_3: Logo[] = [
  { src: '/logos/ndtv.png',            alt: 'NDTV' },
  { src: '/logos/endemol-shine.png',   alt: 'Endemol Shine India' },
  { src: '/logos/banijay-asia.png',    alt: 'Banijay Asia' },
  { src: '/logos/dharmatic.webp',      alt: 'Dharmatic Entertainment' },
  { src: '/logos/jellysmack.png',      alt: 'Jellysmack' },
  { src: '/logos/prime-focus.jpg',     alt: 'Prime Focus Technologies' },
]

const EDGE_MASK =
  'linear-gradient(to right, transparent 0%, rgba(0,0,0,1) 6%, rgba(0,0,0,1) 94%, transparent 100%)'

const LOGO_STYLE: React.CSSProperties = {
  width:          'clamp(140px, 15vw, 200px)',
  height:         'clamp(56px, 6.5vw, 84px)',
  objectFit:      'contain',
  objectPosition: 'center',
  flexShrink:     0,
  opacity:        0.9,
  mixBlendMode:   'multiply',
}

export default function ClientsV1({
  logos,
}: {
  logos?: { row1: Logo[]; row2: Logo[]; row3: Logo[] }
}) {
  const row1 = logos?.row1.length ? logos.row1 : DEFAULT_ROW_1
  const row2 = logos?.row2.length ? logos.row2 : DEFAULT_ROW_2
  const row3 = logos?.row3.length ? logos.row3 : DEFAULT_ROW_3

  const ROWS: { logos: Logo[]; dir: -1 | 1 }[] = [
    { logos: row1, dir: -1 },
    { logos: row2, dir:  1 },
    { logos: row3, dir: -1 },
  ]

  const sectionRef = useRef<HTMLElement>(null)
  const rowRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      gsap.set(rowRefs.map(r => r.current), { x: 0, opacity: 1 })
      return
    }

    gsap.from('.cv1-label', {
      opacity: 0,
      y: 12,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })

    ROWS.forEach(({ dir }, i) => {
      gsap.fromTo(
        rowRefs[i].current,
        { x: dir === -1 ? '3%' : '-6%' },
        {
          x: dir === -1 ? '-6%' : '3%',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        }
      )
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="py-24 overflow-hidden bg-paper border-t border-line">
      <div className="px-8 md:px-12 mb-14">
        <div className="flex items-baseline justify-between">
          <span className="cv1-label font-mono text-[9.5px] tracking-[0.4em] uppercase text-dim/70">
            Trusted by
          </span>
          <span className="cv1-label font-mono text-[9.5px] tracking-[0.3em] uppercase text-dim/40">
            38+ years combined
          </span>
        </div>
      </div>

      <div
        className="space-y-12"
        style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
      >
        {ROWS.map(({ logos }, i) => (
          <div
            key={i}
            ref={rowRefs[i]}
            className="flex items-center whitespace-nowrap will-change-transform"
            style={{ gap: 'clamp(3.5rem, 7vw, 9.5rem)' }}
          >
            {logos.map((logo, j) => (
              <img
                key={j}
                src={logo.src}
                alt={logo.alt}
                style={LOGO_STYLE}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
