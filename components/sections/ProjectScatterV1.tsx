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
  left: string
  top: string
  rot: number
  w: string
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
    [ // A — left-dominant
      { left: '4%',  top: '10%', rot: -6, w: 'clamp(200px,28vw,440px)' },
      { left: '65%', top: '6%',  rot:  5, w: 'clamp(140px,18vw,280px)' },
      { left: '58%', top: '56%', rot: -3, w: 'clamp(170px,22vw,350px)' },
    ],
    [ // B — right-dominant
      { left: '62%', top: '8%',  rot: -7, w: 'clamp(200px,27vw,420px)' },
      { left: '4%',  top: '54%', rot:  4, w: 'clamp(170px,22vw,350px)' },
      { left: '6%',  top: '8%',  rot:  3, w: 'clamp(130px,16vw,260px)' },
    ],
    [ // C — split
      { left: '3%',  top: '6%',  rot: -5, w: 'clamp(180px,25vw,400px)' },
      { left: '68%', top: '12%', rot:  6, w: 'clamp(160px,21vw,340px)' },
      { left: '28%', top: '60%', rot: -2, w: 'clamp(140px,18vw,280px)' },
    ],
  ] as const

  return srcs.slice(0, 3).map((src, i) => ({ ...positions[layout][i], src }))
}

const raw = [
  {
    title: 'Tarini',
    client: 'National Geographic',
    genre: 'Documentary Film',
    award: 'Best Editor Nominee · 24th Asian Television Awards 2019',
    accent: '#8a7030',
    srcs: [`${R2}/03.jpg`],
  },
  {
    title: 'Fabulous Lives of Bollywood Wives',
    client: 'Netflix',
    genre: 'Reality Series',
    accent: '#6a2a30',
    srcs: [r2('Bollywood wives', '01.jpg'), r2('Bollywood wives', '02.jpg')],
  },
  {
    title: 'India from Above',
    client: 'National Geographic UK',
    genre: 'Documentary Series',
    accent: '#2a5a30',
    srcs: [r2('India From Above', '01.jpg'), r2('India From Above', '02.jpg'), r2('India From Above', '04.jpg')],
  },
  {
    title: 'Formula 1 After Movie',
    client: 'Abu Dhabi Grand Prix',
    genre: 'Motorsport Film',
    accent: '#8a4010',
    srcs: [r2('F1 After movie', '01.jpg'), r2('F1 After movie', '02.jpg'), r2('F1 After movie', '03.jpg')],
  },
  {
    title: 'Great Overland Adventure',
    client: 'Mercedes-Benz / NDTV Prime',
    genre: 'Travel Series',
    accent: '#1a4030',
    srcs: [r2('overland', '01.jpg'), r2('overland', '02.jpg'), r2('overland', '03.jpg')],
  },
  {
    title: 'India vs Pakistan',
    client: 'Star Sports',
    genre: 'Sports',
    accent: '#2a4a1a',
    srcs: [r2('India vs Pak', '01.jpg'), r2('India vs Pak', '02.jpg'), r2('India vs Pak', '03.jpg')],
  },
  {
    title: 'Doubles Trouble',
    client: 'Olympic Channel',
    genre: 'Documentary',
    accent: '#1a3a5a',
    srcs: [r2('Double trouble', '01.jpg'), r2('Double trouble', '02.jpg'), r2('Double trouble', '03.jpg')],
  },
  {
    title: 'ICC Cricket World Cup 2015',
    client: 'Star Sports',
    genre: 'Live Sports Highlights',
    accent: '#1a2a4a',
    srcs: [r2('World cup 15', '01.jpg'), r2('World cup 15', '02.jpg')],
  },
  {
    title: 'Kurup',
    client: '',
    genre: 'Film',
    accent: '#3a1a2a',
    srcs: [r2('Kurup', '01.jpg'), r2('Kurup', '02.jpg')],
  },
  {
    title: 'Rendezvous',
    client: '',
    genre: 'Documentary',
    accent: '#2a2a4a',
    srcs: [r2('rendezvous', '01.jpg'), r2('rendezvous', '03.jpg'), r2('rendezvous', '05.jpg')],
  },
  {
    title: 'Midwicket Tales',
    client: '',
    genre: 'Cricket Documentary',
    accent: '#1a3a2a',
    srcs: [r2('Midwicket tales', '01.jpg'), r2('Midwicket tales', '02.jpg'), r2('Midwicket tales', '04.jpg')],
  },
  {
    title: 'Moving in with Malaika',
    client: '',
    genre: 'Reality Series',
    accent: '#4a2a1a',
    srcs: [r2('moving in with malaika', '01.jpg'), r2('moving in with malaika', '03.jpg'), r2('moving in with malaika', '05.jpg')],
  },
  {
    title: 'Sound Trek',
    client: '',
    genre: 'Documentary',
    accent: '#3a1a3a',
    srcs: [r2('Sound trek', '01.jpg'), r2('Sound trek', '03.jpg'), r2('Sound trek', '06.jpg')],
  },
  {
    title: 'Umeed',
    client: '',
    genre: 'Documentary',
    accent: '#2a3a1a',
    srcs: [r2('Umeed', '01.jpg'), r2('Umeed', '03.jpg'), r2('Umeed', '05.jpg')],
  },
  {
    title: 'Nach Baliye 7',
    client: '',
    genre: 'Reality Series',
    accent: '#3a1a4a',
    srcs: [r2('Nach baliye 7', '01.jpg'), r2('Nach baliye 7', '02.jpg')],
  },
  {
    title: 'Red Bull',
    client: 'Red Bull',
    genre: 'Ad Film',
    accent: '#5a1a1a',
    srcs: [r2('redbull', '01.jpg'), r2('redbull', '02.jpg'), r2('redbull', '03.jpg')],
  },
  {
    title: 'Sharekhan',
    client: 'Sharekhan',
    genre: 'Ad Film',
    accent: '#1a4a3a',
    srcs: [r2('Sharekhan ad film', '01.jpg'), r2('Sharekhan ad film', '02.jpg'), r2('Sharekhan ad film', '03.jpg')],
  },
  {
    title: 'Aval Allah',
    client: '',
    genre: 'Film',
    accent: '#2a1a3a',
    srcs: [r2('Aval allah', '01.jpg'), r2('Aval allah', '02.jpg'), r2('Aval allah', '04.jpg')],
  },
  {
    title: 'Hairdresser Show',
    client: '',
    genre: 'Documentary',
    accent: '#2a2a3a',
    srcs: [r2('Hairdresser show', '01.jpg'), r2('Hairdresser show', '02.jpg'), r2('Hairdresser show', '03.jpg')],
  },
  {
    title: 'Expedition Borderland',
    client: '',
    genre: 'Documentary',
    accent: '#3a2a1a',
    srcs: [r2('Expedition borderland', '01.jpg'), r2('Expedition borderland', '02.jpg')],
  },
  {
    title: 'Test Promotions',
    client: '',
    genre: 'Sports',
    accent: '#2a3a2a',
    srcs: [r2('Test Promotions', '01.jpg'), r2('Test Promotions', '02.jpg'), r2('Test Promotions', '03.jpg')],
  },
  {
    title: 'Tiago',
    client: 'Tata Motors',
    genre: 'Ad Film',
    accent: '#1a3a4a',
    srcs: [r2('Tiago', '01.jpg'), r2('Tiago', '02.jpg')],
  },
  {
    title: "Mother's Day Film",
    client: '',
    genre: 'Short Film',
    accent: '#3a2a2a',
    srcs: [r2('mother_s day film', '01.jpg'), r2('mother_s day film', '02.jpg')],
  },
  {
    title: 'Wedding Films',
    client: '',
    genre: 'Documentary',
    accent: '#3a3a1a',
    srcs: [r2('Wedding films', '01.jpg'), r2('Wedding films', '02.jpg')],
  },
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

function PhotoCard({ snap, index }: { snap: Snap; index: number }) {
  return (
    <div
      className="v1-photo absolute pointer-events-none"
      style={{
        left: snap.left,
        top: snap.top,
        width: snap.w,
        transform: `rotate(${snap.rot}deg)`,
        boxShadow: '0 24px 60px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.45)',
        zIndex: 10 + index,
      }}
    >
      <div
        style={{
          width: '100%',
          aspectRatio: '16/9',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={snap.src}
          alt=""
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    </div>
  )
}

export default function ProjectScatterV1() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      gsap.utils.toArray<HTMLElement>('.v1-section').forEach((section) => {
        const photos = section.querySelectorAll('.v1-photo')
        const title  = section.querySelector('.v1-title')
        const meta   = section.querySelector('.v1-meta')
        const label  = section.querySelector('.v1-label')
        const award  = section.querySelector('.v1-award')

        if (prefersReduced) {
          gsap.set([photos, title, meta, label, award], { opacity: 1, y: 0, scale: 1 })
          return
        }

        gsap.set(photos, { opacity: 0, scale: 0.88, y: 30, transformOrigin: 'center center' })
        gsap.set([title, meta, label, award], { opacity: 0, y: 18 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            end: 'bottom top',
            toggleActions: 'play none none reverse',
          },
        })

        tl.to(label, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
          .to(title,  { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, '-=0.2')
          .to(award,  { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.3')
          .to(meta,   { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.25')
          .to(photos, {
            opacity: 1,
            scale: 1,
            y: 0,
            stagger: { each: 0.1, from: 'random' },
            duration: 1.0,
            ease: 'power3.out',
          }, '-=0.5')
      })
    },
    { scope: containerRef }
  )

  return (
    <section ref={containerRef} id="work-v1" className="bg-bg">
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
          className="v1-section relative overflow-hidden"
          style={{
            minHeight: '100vh',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 65% 55% at 50% 50%, ${p.accent}0d, transparent)`,
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none select-none px-8">
            <p className="v1-label font-sans text-[9px] tracking-[0.4em] uppercase text-muted/40 mb-5">
              {[p.genre, p.client].filter(Boolean).join(' — ')}
            </p>
            <h2
              className="v1-title font-display font-semibold text-fg text-center leading-[0.9] tracking-tight"
              style={{ fontSize: 'clamp(2.4rem, 6vw, 6.5rem)', maxWidth: '58vw' }}
            >
              {p.title}
            </h2>
            {p.award && (
              <p className="v1-award font-sans text-[9px] tracking-[0.2em] uppercase text-muted/50 mt-5">
                ★ {p.award}
              </p>
            )}
            <p className="v1-meta font-sans text-[9px] tracking-[0.35em] uppercase text-muted/25 mt-4">
              {p.index} / {String(PROJECTS.length).padStart(2, '0')}
            </p>
          </div>

          {p.snaps.map((snap, i) => (
            <PhotoCard key={i} snap={snap} index={i} />
          ))}
        </div>
      ))}
    </section>
  )
}
