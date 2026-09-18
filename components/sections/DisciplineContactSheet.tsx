'use client'

/**
 * DisciplineContactSheet — Developing in Front of You
 *
 * Eight discipline panels in a grid. Each cell has a real R2 still from a
 * project in that genre as its background. Initially covered by a dark panel.
 * As the section scrolls in, the covers peel away in a staggered wave — like
 * a contact sheet slowly developing under a darkroom safelight.
 *
 * Desktop: 4 × 2  |  Mobile: 2 × 4
 * No pin needed. Single scroll-driven stagger via GSAP + ScrollTrigger.
 */

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'

const DISCIPLINES = [
  {
    label:   'Documentary',
    number:  '01',
    project: 'India from Above',
    client:  'Natl. Geographic UK',
    accent:  '#c9a96e',
    img:     `${R2}/India%20From%20Above/01.jpg`,
  },
  {
    label:   'Reality',
    number:  '02',
    project: 'Fabulous Lives of Bollywood Wives',
    client:  'Netflix',
    accent:  '#d94a4a',
    img:     `${R2}/Bollywood%20wives/01.jpg`,
  },
  {
    label:   'Ad-Film',
    number:  '03',
    project: 'Red Bull',
    client:  'Red Bull',
    accent:  '#d97a3a',
    img:     `${R2}/redbull/01.jpg`,
  },
  {
    label:   'Music',
    number:  '04',
    project: 'Sound Trek',
    client:  '',
    accent:  '#9b6ed4',
    img:     `${R2}/Sound%20trek/01.jpg`,
  },
  {
    label:   'Fiction',
    number:  '05',
    project: 'Kurup',
    client:  '',
    accent:  '#157A50',
    img:     `${R2}/Kurup/01.jpg`,
  },
  {
    label:   'Live Sports',
    number:  '06',
    project: 'India vs Pakistan',
    client:  'Star Sports',
    accent:  '#4a90d9',
    img:     `${R2}/India%20vs%20Pak/01.jpg`,
  },
  {
    label:   'Post',
    number:  '07',
    project: 'F1 After Movie',
    client:  'Abu Dhabi Grand Prix',
    accent:  '#4abcd9',
    img:     `${R2}/F1%20After%20movie/01.jpg`,
  },
  {
    label:   'Audio Drama',
    number:  '08',
    project: 'Midwicket Tales',
    client:  '',
    accent:  '#6a8bd4',
    img:     `${R2}/Midwicket%20tales/01.jpg`,
  },
]

export default function DisciplineContactSheet() {
  const sectionRef = useRef<HTMLElement>(null)
  const coverRefs  = useRef<(HTMLDivElement | null)[]>([])
  const [hovered, setHovered] = useState<number | null>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      gsap.set(coverRefs.current, { yPercent: -101 })
      return
    }

    gsap.set(coverRefs.current, { yPercent: 0 })

    gsap.to(coverRefs.current, {
      yPercent: -101,
      ease:     'power2.inOut',
      stagger: {
        each: 0.1,
        from: 'start',
      },
      scrollTrigger: {
        trigger: sectionRef.current,
        start:   'top 75%',
        end:     'top 10%',
        scrub:   1.6,
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="disciplines"
      aria-label="What we make"
      className="relative py-28 md:py-36"
      style={{ background: '#0D0D0B' }}
    >
      {/* Top hairline */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'rgba(245,244,240,0.06)' }}
      />

      {/* Section label */}
      <div className="px-8 md:px-14 mb-14">
        <p
          className="font-mono uppercase"
          style={{ fontSize: 9, letterSpacing: '0.44em', color: 'rgba(245,244,240,0.22)' }}
        >
          What We Make
        </p>
      </div>

      {/* 4×2 grid (2×4 on mobile). 1px gaps act as hairlines between cells */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ gap: '1px', background: 'rgba(245,244,240,0.06)' }}
      >
        {DISCIPLINES.map((disc, i) => {
          const isHovered = hovered === i
          return (
            <div
              key={disc.label}
              className="relative overflow-hidden"
              style={{ background: '#0D0D0B', aspectRatio: '3 / 4', cursor: 'default' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Accent top border — slides in on hover */}
              <div
                aria-hidden
                style={{
                  position:   'absolute',
                  top:        0,
                  left:       0,
                  right:      0,
                  height:     2,
                  background: disc.accent,
                  zIndex:     4,
                  opacity:    isHovered ? 1 : 0,
                  transform:  isHovered ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'opacity 0.45s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}
              />

              {/* Real project still — zooms on hover */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:    `url(${disc.img})`,
                  backgroundSize:     'cover',
                  backgroundPosition: 'center',
                  opacity:    isHovered ? 0.78 : 0.55,
                  transform:  isHovered ? 'scale(1.06)' : 'scale(1)',
                  transition: 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
                }}
              />

              {/* Gradient overlay — lifts on hover to reveal more image */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: isHovered
                    ? 'linear-gradient(to top, rgba(13,13,11,0.88) 0%, rgba(13,13,11,0.28) 50%, rgba(13,13,11,0.05) 100%)'
                    : 'linear-gradient(to top, rgba(13,13,11,0.92) 0%, rgba(13,13,11,0.45) 50%, rgba(13,13,11,0.1) 100%)',
                  transition: 'background 0.6s ease',
                }}
              />

              {/* Content */}
              <div
                className="absolute inset-0 flex flex-col justify-between p-5 md:p-7"
                style={{
                  transform:  isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                }}
              >
                {/* Frame number */}
                <span
                  className="font-mono"
                  style={{
                    fontSize:    9,
                    letterSpacing: '0.26em',
                    color:       `rgba(245,244,240,${isHovered ? 0.7 : 0.35})`,
                    transition:  'color 0.4s ease',
                  }}
                >
                  {disc.number}
                </span>

                {/* Discipline + project */}
                <div>
                  <div
                    aria-hidden
                    style={{
                      width:      isHovered ? 36 : 18,
                      height:     1,
                      background: disc.accent,
                      marginBottom: 12,
                      opacity:    isHovered ? 1 : 0.8,
                      transition: 'width 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease',
                    }}
                  />
                  <p
                    className="font-display"
                    style={{
                      fontSize:      'clamp(0.95rem, 1.55vw, 1.3rem)',
                      fontWeight:    300,
                      letterSpacing: '-0.02em',
                      color:         '#F5F4F0',
                      lineHeight:    1.2,
                      marginBottom:  6,
                    }}
                  >
                    {disc.label}
                  </p>
                  <p
                    className="font-mono uppercase"
                    style={{
                      fontSize:      8,
                      letterSpacing: '0.18em',
                      color:         `rgba(245,244,240,${isHovered ? 0.62 : 0.38})`,
                      lineHeight:    1.4,
                      transition:    'color 0.4s ease',
                    }}
                  >
                    {disc.project}
                    {disc.client && (
                      <>
                        <br />
                        <span style={{ opacity: 0.6 }}>{disc.client}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Dark cover — peels upward on scroll */}
              <div
                ref={el => { coverRefs.current[i] = el }}
                aria-hidden
                className="absolute inset-0"
                style={{ background: '#0a0a09', zIndex: 5, transformOrigin: 'top center' }}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
