'use client'

import { useRef, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'
const r2 = (folder: string, file: string) =>
  `${R2}/${encodeURIComponent(folder)}/${file}`

type Snap = {
  top: string
  right: string
  w: string
  rot: number
  depth: number
  src: string
}

type Project = {
  index: string
  title: string
  client: string
  genre: string
  award?: string
  accent: string
  snaps: Snap[]
}

function makeSnaps(srcs: string[], layout: 0 | 1 | 2): Snap[] {
  const positions = [
    [
      { top: '-30px', right: '32%', w: '180px', rot: -6, depth: 1.4 },
      { top: '20px',  right: '8%',  w: '130px', rot:  7, depth: 0.8 },
      { top: '55px',  right: '22%', w: '160px', rot: -3, depth: 1.1 },
    ],
    [
      { top: '-25px', right: '28%', w: '165px', rot:  5, depth: 1.2 },
      { top: '15px',  right: '6%',  w: '145px', rot: -8, depth: 0.7 },
      { top: '60px',  right: '18%', w: '155px', rot:  3, depth: 1.0 },
    ],
    [
      { top: '-28px', right: '35%', w: '170px', rot: -4, depth: 1.3 },
      { top: '10px',  right: '9%',  w: '135px', rot:  6, depth: 0.9 },
      { top: '52px',  right: '24%', w: '150px', rot: -2, depth: 1.0 },
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

export default function ProjectScatterV3() {
  const containerRef = useRef<HTMLDivElement>(null)
  const photoGroupRefs = useRef<(HTMLDivElement | null)[]>([])
  const photoRefs = useRef<(HTMLDivElement | null)[][]>([])
  const titleRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIndex = useRef<number | null>(null)
  const prefersReduced = useRef(false)

  useGSAP(
    () => {
      prefersReduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced.current) return

      photoGroupRefs.current.forEach((group) => {
        if (group) gsap.set(group, { opacity: 0 })
      })
      photoRefs.current.forEach((group) => {
        group?.forEach((photo) => {
          if (photo) gsap.set(photo, { opacity: 0, scale: 0.72 })
        })
      })
    },
    { scope: containerRef }
  )

  const handleMouseEnter = useCallback((idx: number) => {
    if (prefersReduced.current) return
    activeIndex.current = idx
    const group = photoGroupRefs.current[idx]
    const photos = photoRefs.current[idx]
    const title = titleRefs.current[idx]
    if (!group || !photos) return

    gsap.set(group, { opacity: 1 })
    photos.forEach((photo, i) => {
      if (!photo) return
      gsap.to(photo, { opacity: 1, scale: 1, duration: 0.55, delay: i * 0.07, ease: 'power3.out', overwrite: 'auto' })
    })
    if (title) gsap.to(title, { opacity: 0.55, duration: 0.4, ease: 'power2.out' })
  }, [])

  const handleMouseLeave = useCallback((idx: number) => {
    if (prefersReduced.current) return
    activeIndex.current = null
    const group = photoGroupRefs.current[idx]
    const photos = photoRefs.current[idx]
    const title = titleRefs.current[idx]
    if (!group || !photos) return

    photos.forEach((photo, i) => {
      if (!photo) return
      gsap.to(photo, {
        opacity: 0, scale: 0.72, x: 0, y: 0,
        duration: 0.4, delay: i * 0.04, ease: 'power2.in', overwrite: 'auto',
        onComplete: () => {
          if (i === photos.length - 1 && activeIndex.current !== idx) gsap.set(group, { opacity: 0 })
        },
      })
    })
    if (title) gsap.to(title, { opacity: 1, duration: 0.4, ease: 'power2.out' })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>, idx: number) => {
    if (prefersReduced.current || activeIndex.current !== idx) return
    const photos = photoRefs.current[idx]
    if (!photos) return
    const rect = e.currentTarget.getBoundingClientRect()
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    photos.forEach((photo, i) => {
      if (!photo) return
      const depth = PROJECTS[idx].snaps[i]?.depth ?? 1
      gsap.to(photo, { x: normX * 14 * depth, y: normY * 9 * depth, duration: 0.75, ease: 'power2.out', overwrite: 'auto' })
    })
  }, [])

  return (
    <section ref={containerRef} id="work-v3" className="bg-bg">
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

      {PROJECTS.map((p, idx) => (
        <div
          key={p.index}
          className="relative"
          style={{ minHeight: '160px', borderBottom: '1px solid rgba(255,255,255,0.04)', overflow: 'visible' }}
          onMouseEnter={() => handleMouseEnter(idx)}
          onMouseLeave={() => handleMouseLeave(idx)}
          onMouseMove={(e) => handleMouseMove(e, idx)}
          data-cursor-hover
        >
          <div
            ref={(el) => { titleRefs.current[idx] = el }}
            className="relative z-10 flex items-baseline gap-6 px-8 py-10"
            style={{ pointerEvents: 'none' }}
          >
            <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-muted/30 flex-shrink-0">
              {p.index}
            </span>
            <div className="flex-1 min-w-0">
              <h2
                className="font-display font-semibold text-fg leading-[0.9] tracking-tight"
                style={{ fontSize: 'clamp(1.8rem, 3.8vw, 4.5rem)' }}
              >
                {p.title}
              </h2>
              <div className="flex items-center gap-4 mt-3">
                {p.client && (
                  <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-muted/40">
                    {p.client}
                  </span>
                )}
                <span className="font-sans text-[9px] tracking-[0.2em] uppercase text-muted/25">
                  {p.genre}
                </span>
                {p.award && (
                  <span className="font-sans text-[9px] tracking-[0.12em] uppercase" style={{ color: '#c9a96e60' }}>
                    ★ {p.award}
                  </span>
                )}
              </div>
            </div>
            <span className="font-sans text-[9px] tracking-[0.2em] uppercase flex-shrink-0" style={{ color: `${p.accent}50` }}>
              View
            </span>
          </div>

          <div
            ref={(el) => { photoGroupRefs.current[idx] = el }}
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ overflow: 'visible' }}
          >
            {p.snaps.map((snap, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (!photoRefs.current[idx]) photoRefs.current[idx] = []
                  photoRefs.current[idx][i] = el
                }}
                style={{
                  position: 'absolute',
                  top: snap.top,
                  right: snap.right,
                  width: snap.w,
                  transform: `rotate(${snap.rot}deg)`,
                  boxShadow: '0 20px 55px rgba(0,0,0,0.55), 0 5px 16px rgba(0,0,0,0.4)',
                  zIndex: 20 + i,
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
      ))}
    </section>
  )
}
