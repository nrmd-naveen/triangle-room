'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'
const r2 = (folder: string, file: string) =>
  `${R2}/${encodeURIComponent(folder)}/${file}`

type Snap = {
  top: string
  left: string
  w: string
  rot: number
  fromX: number
  src: string
}

type Project = {
  index: string
  title: string
  client: string
  genre: string
  award?: string
  accent: string
  year?: string
  snaps: Snap[]
}

// Three right-panel scatter layouts, cycled per project
function makeSnaps(srcs: string[], layout: 0 | 1 | 2): Snap[] {
  const positions = [
    [
      { top: '8%',  left: '2%',  w: '56%', rot: -4, fromX: 90  },
      { top: '6%',  left: '56%', w: '38%', rot:  6, fromX: 120 },
      { top: '60%', left: '16%', w: '62%', rot: -2, fromX: 70  },
    ],
    [
      { top: '6%',  left: '3%',  w: '60%', rot:  3, fromX: 85  },
      { top: '5%',  left: '61%', w: '35%', rot: -7, fromX: 130 },
      { top: '62%', left: '10%', w: '55%', rot:  2, fromX: 75  },
    ],
    [
      { top: '7%',  left: '4%',  w: '52%', rot: -5, fromX: 95  },
      { top: '5%',  left: '54%', w: '42%', rot:  5, fromX: 115 },
      { top: '58%', left: '20%', w: '60%', rot: -3, fromX: 78  },
    ],
  ] as const

  return srcs.slice(0, 3).map((src, i) => ({
    ...positions[layout][i],
    src,
  }))
}

const raw = [
  { title: 'Tarini', client: 'National Geographic', genre: 'Documentary Film', award: 'Best Editor Nominee · 24th Asian Television Awards 2019', accent: '#8a7030', srcs: [`${R2}/03.jpg`] },
  { title: 'Fabulous Lives of Bollywood Wives', client: 'Netflix', genre: 'Reality Series', accent: '#6a2a30', srcs: [r2('Bollywood wives','01.jpg'), r2('Bollywood wives','02.jpg')] },
  { title: 'India from Above', client: 'National Geographic UK', genre: 'Documentary Series', accent: '#2a5a30', srcs: [r2('India From Above','01.jpg'), r2('India From Above','02.jpg'), r2('India From Above','04.jpg')] },
  { title: 'Formula 1 After Movie', client: 'Abu Dhabi Grand Prix', genre: 'Motorsport Film', accent: '#8a4010', srcs: [r2('F1 After movie','01.jpg'), r2('F1 After movie','02.jpg'), r2('F1 After movie','03.jpg')] },
  { title: 'Great Overland Adventure', client: 'Mercedes-Benz / NDTV Prime', genre: 'Travel Series', accent: '#1a4030', srcs: [r2('overland','01.jpg'), r2('overland','02.jpg'), r2('overland','03.jpg')] },
  { title: 'India vs Pakistan', client: 'Star Sports', genre: 'Sports', accent: '#2a4a1a', srcs: [r2('India vs Pak','01.jpg'), r2('India vs Pak','02.jpg'), r2('India vs Pak','03.jpg')] },
  { title: 'Doubles Trouble', client: 'Olympic Channel', genre: 'Documentary', accent: '#1a3a5a', srcs: [r2('Double trouble','01.jpg'), r2('Double trouble','02.jpg'), r2('Double trouble','03.jpg')] },
  { title: 'ICC Cricket World Cup 2015', client: 'Star Sports', genre: 'Live Sports Highlights', accent: '#1a2a4a', srcs: [r2('World cup 15','01.jpg'), r2('World cup 15','02.jpg')] },
  { title: 'Kurup', client: '', genre: 'Film', accent: '#3a1a2a', srcs: [r2('Kurup','01.jpg'), r2('Kurup','02.jpg')] },
  { title: 'Rendezvous', client: '', genre: 'Documentary', accent: '#2a2a4a', srcs: [r2('rendezvous','01.jpg'), r2('rendezvous','03.jpg'), r2('rendezvous','05.jpg')] },
  { title: 'Midwicket Tales', client: '', genre: 'Cricket Documentary', accent: '#1a3a2a', srcs: [r2('Midwicket tales','01.jpg'), r2('Midwicket tales','02.jpg'), r2('Midwicket tales','04.jpg')] },
  { title: 'Moving in with Malaika', client: '', genre: 'Reality Series', accent: '#4a2a1a', srcs: [r2('moving in with malaika','01.jpg'), r2('moving in with malaika','03.jpg'), r2('moving in with malaika','05.jpg')] },
  { title: 'Sound Trek', client: '', genre: 'Documentary', accent: '#3a1a3a', srcs: [r2('Sound trek','01.jpg'), r2('Sound trek','03.jpg'), r2('Sound trek','06.jpg')] },
  { title: 'Umeed', client: '', genre: 'Documentary', accent: '#2a3a1a', srcs: [r2('Umeed','01.jpg'), r2('Umeed','03.jpg'), r2('Umeed','05.jpg')] },
  { title: 'Nach Baliye 7', client: '', genre: 'Reality Series', accent: '#3a1a4a', srcs: [r2('Nach baliye 7','01.jpg'), r2('Nach baliye 7','02.jpg')] },
  { title: 'Red Bull', client: 'Red Bull', genre: 'Ad Film', accent: '#5a1a1a', srcs: [r2('redbull','01.jpg'), r2('redbull','02.jpg'), r2('redbull','03.jpg')] },
  { title: 'Sharekhan', client: 'Sharekhan', genre: 'Ad Film', accent: '#1a4a3a', srcs: [r2('Sharekhan ad film','01.jpg'), r2('Sharekhan ad film','02.jpg'), r2('Sharekhan ad film','03.jpg')] },
  { title: 'Aval Allah', client: '', genre: 'Film', accent: '#2a1a3a', srcs: [r2('Aval allah','01.jpg'), r2('Aval allah','02.jpg'), r2('Aval allah','04.jpg')] },
  { title: 'Hairdresser Show', client: '', genre: 'Documentary', accent: '#2a2a3a', srcs: [r2('Hairdresser show','01.jpg'), r2('Hairdresser show','02.jpg'), r2('Hairdresser show','03.jpg')] },
  { title: 'Expedition Borderland', client: '', genre: 'Documentary', accent: '#3a2a1a', srcs: [r2('Expedition borderland','01.jpg'), r2('Expedition borderland','02.jpg')] },
  { title: 'Test Promotions', client: '', genre: 'Sports', accent: '#2a3a2a', srcs: [r2('Test Promotions','01.jpg'), r2('Test Promotions','02.jpg'), r2('Test Promotions','03.jpg')] },
  { title: 'Tiago', client: 'Tata Motors', genre: 'Ad Film', accent: '#1a3a4a', srcs: [r2('Tiago','01.jpg'), r2('Tiago','02.jpg')] },
  { title: "Mother's Day Film", client: '', genre: 'Short Film', accent: '#3a2a2a', srcs: [r2('mother_s day film','01.jpg'), r2('mother_s day film','02.jpg')] },
  { title: 'Wedding Films', client: '', genre: 'Documentary', accent: '#3a3a1a', srcs: [r2('Wedding films','01.jpg'), r2('Wedding films','02.jpg')] },
]

const PROJECTS: Project[] = raw.map((p, i) => ({
  index: String(i + 1).padStart(2, '0'),
  title: p.title,
  client: p.client,
  genre: p.genre,
  award: 'award' in p ? (p as { award: string }).award : undefined,
  accent: p.accent,
  snaps: makeSnaps(p.srcs, (i % 3) as 0 | 1 | 2),
}))

export default function ProjectScatterV2() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.utils.toArray<HTMLElement>('.v2-row').forEach((row) => {
        const photos = row.querySelectorAll<HTMLElement>('.v2-photo')
        const titleGroup = row.querySelector('.v2-title-group')
        const divider = row.querySelector('.v2-divider')

        if (prefersReduced) {
          gsap.set([photos, titleGroup, divider], { opacity: 1, x: 0, y: 0, scaleX: 1 })
          return
        }

        photos.forEach((photo) => {
          const fromX = parseFloat(photo.dataset.fromx || '80')
          gsap.set(photo, { opacity: 0, x: fromX })
        })
        gsap.set(titleGroup, { opacity: 0, y: 24 })
        gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: 'top 74%',
            toggleActions: 'play none none reverse',
          },
        })

        tl.to(divider, { scaleX: 1, duration: 0.7, ease: 'power3.inOut' })
          .to(titleGroup, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
          .to(photos, {
            opacity: 1,
            x: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: { each: 0.12, from: 'end' },
          }, '-=0.5')
      })
    },
    { scope: containerRef }
  )

  return (
    <section ref={containerRef} id="work-v2" className="bg-bg">
      <div
        className="flex items-baseline justify-between px-8 pt-24 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
      >
        <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-muted">
          Selected Work
        </span>
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-muted/30">
          {String(PROJECTS.length).padStart(2, '0')} Projects
        </span>
      </div>

      {PROJECTS.map((p) => (
        <div
          key={p.index}
          className="v2-row relative"
          style={{ minHeight: '78vh', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 40% 80% at 20% 50%, ${p.accent}08, transparent)` }}
          />

          <div className="flex h-full" style={{ minHeight: '78vh' }}>
            {/* Left: title column */}
            <div className="flex flex-col justify-center px-8 py-12 flex-shrink-0" style={{ width: '38%' }}>
              <div
                className="v2-divider mb-8"
                style={{ height: '1px', background: `${p.accent}40`, width: '100%' }}
              />
              <div className="v2-title-group">
                <p className="font-sans text-[9px] tracking-[0.35em] uppercase text-muted/35 mb-1">
                  {p.index}
                </p>
                <h2
                  className="font-display font-semibold text-fg leading-[0.92] tracking-tight mb-6"
                  style={{ fontSize: 'clamp(1.8rem, 3.2vw, 3.6rem)' }}
                >
                  {p.title}
                </h2>
                <div className="flex flex-col gap-1">
                  {p.client && (
                    <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-muted/50">
                      {p.client}
                    </p>
                  )}
                  <p className="font-sans text-[9px] tracking-[0.25em] uppercase text-muted/35">
                    {p.genre}
                  </p>
                  {p.award && (
                    <p className="font-sans text-[9px] tracking-[0.15em] uppercase mt-2" style={{ color: '#c9a96e80' }}>
                      ★ {p.award}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: photos */}
            <div className="flex-1 relative overflow-hidden" style={{ minHeight: '78vh' }}>
              {p.snaps.map((snap, i) => (
                <div
                  key={i}
                  className="v2-photo absolute pointer-events-none"
                  data-fromx={snap.fromX}
                  style={{
                    top: snap.top,
                    left: snap.left,
                    width: snap.w,
                    transform: `rotate(${snap.rot}deg)`,
                    boxShadow: '0 20px 55px rgba(0,0,0,0.5), 0 4px 14px rgba(0,0,0,0.4)',
                    zIndex: 10 + i,
                  }}
                >
                  <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={snap.src} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
