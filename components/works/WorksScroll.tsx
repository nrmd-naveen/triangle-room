'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ---------------------------------------------------------------------------
// R2 assets
// ---------------------------------------------------------------------------

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'
const r2 = (folder: string, file: string) =>
  `${R2}/${encodeURIComponent(folder)}/${file}`

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Work = {
  index: string
  title: string
  client: string
  genre: string
  accent: string
  award?: string
  srcs: string[]
}

const raw = [
  { title: 'The Greatest Rivalry',             client: 'Netflix',                     genre: 'Documentary Series',     accent: '#1a3a20', srcs: [] },
  { title: 'Bigg Boss Malayalam',              client: 'Asianet',                     genre: 'Reality Series',         accent: '#3a1a20', srcs: [] },
  { title: 'Pachamarakaikal',                  client: '',                            genre: 'Film',                   award: 'Two Kerala State Awards', accent: '#1a2a3a', srcs: [] },
  { title: 'Tarini',                          client: 'National Geographic',         genre: 'Documentary Film',       award: 'Best Editor Nominee · 24th Asian Television Awards 2019', accent: '#8a7030', srcs: [`${R2}/03.jpg`] },
  { title: 'Fabulous Lives of Bollywood Wives', client: 'Netflix',                   genre: 'Reality Series',         accent: '#6a2a30', srcs: [r2('Bollywood wives','01.jpg'),    r2('Bollywood wives','02.jpg')] },
  { title: 'India from Above',                client: 'National Geographic UK',      genre: 'Documentary Series',     accent: '#2a5a30', srcs: [r2('India From Above','01.jpg'),  r2('India From Above','02.jpg'),  r2('India From Above','04.jpg')] },
  { title: 'Formula 1 After Movie',           client: 'Abu Dhabi Grand Prix',        genre: 'Motorsport Film',        accent: '#8a4010', srcs: [r2('F1 After movie','01.jpg'),    r2('F1 After movie','02.jpg'),    r2('F1 After movie','03.jpg')] },
  { title: 'Great Overland Adventure',        client: 'Mercedes-Benz / NDTV Prime',  genre: 'Travel Series',          accent: '#1a4030', srcs: [r2('overland','01.jpg'),          r2('overland','02.jpg'),          r2('overland','03.jpg')] },
  { title: 'India vs Pakistan',               client: 'Star Sports',                 genre: 'Sports',                 accent: '#2a4a1a', srcs: [r2('India vs Pak','01.jpg'),      r2('India vs Pak','02.jpg'),      r2('India vs Pak','03.jpg')] },
  { title: 'Doubles Trouble',                 client: 'Olympic Channel',             genre: 'Documentary',            accent: '#1a3a5a', srcs: [r2('Double trouble','01.jpg'),    r2('Double trouble','02.jpg'),    r2('Double trouble','03.jpg')] },
  { title: 'ICC Cricket World Cup 2015',      client: 'Star Sports',                 genre: 'Live Sports Highlights', accent: '#1a2a4a', srcs: [r2('World cup 15','01.jpg'),      r2('World cup 15','02.jpg')] },
  { title: 'Kurup',                           client: '',                            genre: 'Film',                   accent: '#3a1a2a', srcs: [r2('Kurup','01.jpg'),             r2('Kurup','02.jpg')] },
  { title: 'Rendezvous',                      client: '',                            genre: 'Documentary',            accent: '#2a2a4a', srcs: [r2('rendezvous','01.jpg'),        r2('rendezvous','03.jpg'),        r2('rendezvous','05.jpg')] },
  { title: 'Midwicket Tales',                 client: '',                            genre: 'Cricket Documentary',    accent: '#1a3a2a', srcs: [r2('Midwicket tales','01.jpg'),   r2('Midwicket tales','02.jpg'),   r2('Midwicket tales','04.jpg')] },
  { title: 'Moving in with Malaika',          client: '',                            genre: 'Reality Series',         accent: '#4a2a1a', srcs: [r2('moving in with malaika','01.jpg'), r2('moving in with malaika','03.jpg'), r2('moving in with malaika','05.jpg')] },
  { title: 'Sound Trek',                      client: '',                            genre: 'Documentary',            accent: '#3a1a3a', srcs: [r2('Sound trek','01.jpg'),        r2('Sound trek','03.jpg'),        r2('Sound trek','06.jpg')] },
  { title: 'Umeed',                           client: '',                            genre: 'Documentary',            accent: '#2a3a1a', srcs: [r2('Umeed','01.jpg'),             r2('Umeed','03.jpg'),             r2('Umeed','05.jpg')] },
  { title: 'Nach Baliye 7',                   client: '',                            genre: 'Reality Series',         accent: '#3a1a4a', srcs: [r2('Nach baliye 7','01.jpg'),     r2('Nach baliye 7','02.jpg')] },
  { title: 'Red Bull',                        client: 'Red Bull',                    genre: 'Ad Film',                accent: '#5a1a1a', srcs: [r2('redbull','01.jpg'),           r2('redbull','02.jpg'),           r2('redbull','03.jpg')] },
  { title: 'Sharekhan',                       client: 'Sharekhan',                   genre: 'Ad Film',                accent: '#1a4a3a', srcs: [r2('Sharekhan ad film','01.jpg'), r2('Sharekhan ad film','02.jpg'), r2('Sharekhan ad film','03.jpg')] },
  { title: 'Aval Allah',                      client: '',                            genre: 'Film',                   accent: '#2a1a3a', srcs: [r2('Aval allah','01.jpg'),        r2('Aval allah','02.jpg'),        r2('Aval allah','04.jpg')] },
  { title: 'Hairdresser Show',                client: '',                            genre: 'Documentary',            accent: '#2a2a3a', srcs: [r2('Hairdresser show','01.jpg'),  r2('Hairdresser show','02.jpg'),  r2('Hairdresser show','03.jpg')] },
  { title: 'Expedition Borderland',           client: '',                            genre: 'Documentary',            accent: '#3a2a1a', srcs: [r2('Expedition borderland','01.jpg'), r2('Expedition borderland','02.jpg')] },
  { title: 'Test Promotions',                 client: '',                            genre: 'Sports',                 accent: '#2a3a2a', srcs: [r2('Test Promotions','01.jpg'),   r2('Test Promotions','02.jpg'),   r2('Test Promotions','03.jpg')] },
  { title: 'Tiago',                           client: 'Tata Motors',                 genre: 'Ad Film',                accent: '#1a3a4a', srcs: [r2('Tiago','01.jpg'),             r2('Tiago','02.jpg')] },
  { title: "Mother's Day Film",               client: '',                            genre: 'Short Film',             accent: '#3a2a2a', srcs: [r2('mother_s day film','01.jpg'), r2('mother_s day film','02.jpg')] },
  { title: 'Wedding Films',                   client: '',                            genre: 'Documentary',            accent: '#3a3a1a', srcs: [r2('Wedding films','01.jpg'),     r2('Wedding films','02.jpg')] },
]

const WORKS: Work[] = raw.map((p, i) => ({ ...p, index: String(i + 1).padStart(2, '0') }))

// ---------------------------------------------------------------------------
// Desktop photo scatter — title is centered, photos around it.
// Three layout variants cycle per project (same feel as V1 on homepage).
// ---------------------------------------------------------------------------

type DSlot = {
  left?: string; right?: string; top?: string; bottom?: string
  w: string; rot: number; fromX: number; fromY: number
}

const DESKTOP_LAYOUTS: DSlot[][] = [
  [ // A — left-cluster + right top + right bottom
    { left: '4%',  top: '10%', w: 'clamp(220px,32vw,500px)', rot: -6, fromX: -1500, fromY: -100 },
    { left: '65%', top: '6%',  w: 'clamp(155px,22vw,340px)', rot:  5, fromX:  1500, fromY:  -80 },
    { left: '58%', top: '56%', w: 'clamp(180px,27vw,420px)', rot: -3, fromX:   700, fromY: 1200 },
  ],
  [ // B — right-dominant + two left
    { left: '62%', top: '8%',  w: 'clamp(220px,31vw,490px)', rot: -7, fromX:  1500, fromY:  -80 },
    { left: '4%',  top: '54%', w: 'clamp(180px,27vw,420px)', rot:  4, fromX: -1400, fromY:  800 },
    { left: '6%',  top: '8%',  w: 'clamp(140px,20vw,310px)', rot:  3, fromX: -1500, fromY:  -80 },
  ],
  [ // C — diagonal spread
    { left: '3%',  top: '6%',  w: 'clamp(195px,29vw,455px)', rot: -5, fromX: -1500, fromY: -100 },
    { left: '68%', top: '12%', w: 'clamp(175px,25vw,390px)', rot:  6, fromX:  1500, fromY:  -60 },
    { left: '28%', top: '60%', w: 'clamp(180px,27vw,420px)', rot: -2, fromX:     0, fromY: 1300 },
  ],
]

// ---------------------------------------------------------------------------
// Mobile photo slots — within the bottom 56% of the section
// ---------------------------------------------------------------------------

type MSlot = {
  top?: string; bottom?: string; left?: string; right?: string
  w: string; rot: number; z: number
}

const MOBILE_SLOTS: MSlot[] = [
  { top: '4%',   left: '5%', right: '5%', w: 'auto', rot: -2, z: 3 },
  { bottom: '3%', right: '2%',            w: '54%',  rot:  6, z: 2 },
  { bottom: '13%', left: '2%',            w: '46%',  rot: -5, z: 1 },
]

// ---------------------------------------------------------------------------
// Image with smooth fade-in on load
// ---------------------------------------------------------------------------

function FadeImg({ src, alt }: { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        opacity: 0,
        transition: 'opacity 0.55s ease',
        willChange: 'opacity',
      }}
      onLoad={(e) => {
        ;(e.currentTarget as HTMLImageElement).style.opacity = '1'
      }}
    />
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WorksScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef  = useRef<HTMLDivElement>(null)
  const sectionRefs  = useRef<(HTMLDivElement | null)[]>([])
  const infoRefs     = useRef<(HTMLDivElement | null)[]>([])
  const dPhotoRefs   = useRef<(HTMLDivElement | null)[][]>([])
  const mPhotoRefs   = useRef<(HTMLDivElement | null)[][]>([])

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Progress bar
      if (progressRef.current) {
        gsap.set(progressRef.current, { scaleX: 0, transformOrigin: 'left center' })
        if (!prefersReduced) {
          gsap.to(progressRef.current, {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
            },
          })
        }
      }

      if (prefersReduced) {
        sectionRefs.current.forEach((_, wi) => {
          const info = infoRefs.current[wi]
          if (info) gsap.set(info, { opacity: 1, y: 0 })
          ;[...(dPhotoRefs.current[wi] ?? []), ...(mPhotoRefs.current[wi] ?? [])].forEach(
            (p) => p && gsap.set(p, { opacity: 1, x: 0, y: 0 }),
          )
        })
        return
      }

      // ── Initial hidden states ─────────────────────────────────────────────
      WORKS.forEach((_, wi) => {
        const info    = infoRefs.current[wi]
        const dSlots  = DESKTOP_LAYOUTS[wi % 3]
        const dPhotos = dPhotoRefs.current[wi] ?? []
        const mPhotos = mPhotoRefs.current[wi] ?? []

        if (info) gsap.set(info, { opacity: 0, y: 20 })

        dPhotos.forEach((p, i) => {
          if (!p) return
          const s = dSlots[i]
          gsap.set(p, { opacity: 0, x: s?.fromX ?? 0, y: s?.fromY ?? 0 })
        })
        mPhotos.forEach((p) => {
          if (!p) return
          gsap.set(p, { opacity: 0, y: 45 })
        })
      })

      // ── Per-section animation timelines ──────────────────────────────────
      WORKS.forEach((_, wi) => {
        const section = sectionRefs.current[wi]
        if (!section) return

        const info    = infoRefs.current[wi]
        const dPhotos = dPhotoRefs.current[wi] ?? []
        const mPhotos = mPhotoRefs.current[wi] ?? []

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })

        if (info) tl.to(info, { opacity: 1, y: 0, duration: 0.6 }, 0)

        dPhotos.forEach((p, i) => {
          if (!p) return
          tl.to(p, { opacity: 1, x: 0, y: 0, duration: 0.95 }, 0.1 + i * 0.14)
        })
        mPhotos.forEach((p, i) => {
          if (!p) return
          tl.to(p, { opacity: 1, y: 0, duration: 0.65 }, 0.1 + i * 0.1)
        })

        ScrollTrigger.create({
          trigger: section,
          start: 'top bottom',
          onEnter:     () => tl.play(),
          onLeaveBack: () => tl.reverse(),
        })
      })

    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} style={{ background: '#0D0D0B' }}>

      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
        style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }}
      >
        <div ref={progressRef} className="absolute inset-0" style={{ background: 'rgba(26,92,58,0.8)' }} />
      </div>

      {/* Fixed nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-8 md:py-6 pointer-events-none">
        <Link
          href="/"
          className="pointer-events-auto font-mono text-[10px] tracking-[0.35em] uppercase transition-colors duration-300"
          style={{ color: 'rgba(245,244,240,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,244,240,0.85)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,244,240,0.4)')}
        >
          ← Triangle Room
        </Link>
        <span className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(245,244,240,0.2)' }}>
          {String(WORKS.length).padStart(2, '0')} Works
        </span>
      </div>

      {/* Sections */}
      {WORKS.map((work, wi) => {
        const srcs      = work.srcs.slice(0, 3)
        const dSlots    = DESKTOP_LAYOUTS[wi % 3]
        const photoCount = srcs.length

        return (
          <div
            key={work.index}
            ref={(el) => { sectionRefs.current[wi] = el }}
            className="relative overflow-hidden"
            style={{ height: '100vh', background: '#090909' }}
          >
            {/* Accent glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${work.accent}0b, transparent)`,
              }}
            />

            {/* Ghost index — bottom right */}
            <div
              className="absolute pointer-events-none select-none font-display font-semibold leading-none"
              style={{
                fontSize: 'clamp(8rem, 22vw, 20rem)',
                color: `${work.accent}05`,
                right: '-3%',
                bottom: '-10%',
                letterSpacing: '-0.04em',
              }}
              aria-hidden="true"
            >
              {work.index}
            </div>

            {/* ── Mobile layout: info top + photos bottom ──────────────── */}
            <div className="md:hidden h-full flex flex-col">
              {/* Info — top ~44% */}
              <div
                ref={(el) => { infoRefs.current[wi] = el }}
                className="flex-shrink-0 flex flex-col items-center justify-center text-center px-6 pt-20 pb-4"
                style={{ height: '44%' }}
              >
                <p className="font-sans text-[9px] tracking-[0.45em] uppercase mb-3" style={{ color: `${work.accent}70` }}>
                  {work.index}&thinsp;/&thinsp;{String(WORKS.length).padStart(2, '0')}
                </p>
                <h2
                  className="font-display font-semibold text-fg leading-[0.9] tracking-tight mb-4"
                  style={{ fontSize: 'clamp(1.7rem, 6vw, 2.8rem)' }}
                >
                  {work.title}
                </h2>
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                  {work.client && (
                    <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-muted/55">{work.client}</p>
                  )}
                  <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-muted/35">{work.genre}</p>
                </div>
                {work.award && (
                  <p className="font-sans text-[9px] tracking-[0.13em] uppercase mt-3" style={{ color: '#c9a96e65' }}>
                    ★&ensp;{work.award}
                  </p>
                )}
              </div>

              {/* Photos — bottom 56% */}
              <div className="flex-1 relative overflow-hidden">
                {srcs.map((src, i) => {
                  const s = MOBILE_SLOTS[i]
                  if (!s) return null
                  const posStyle: React.CSSProperties =
                    i === 0
                      ? { top: s.top, left: s.left, right: s.right }
                      : {
                          bottom: s.bottom,
                          ...(s.left != null ? { left: s.left } : { right: s.right }),
                          width: s.w,
                        }
                  return (
                    <div
                      key={i}
                      ref={(el) => {
                        if (!mPhotoRefs.current[wi]) mPhotoRefs.current[wi] = []
                        mPhotoRefs.current[wi][i] = el
                      }}
                      className="absolute"
                      style={{
                        ...posStyle,
                        transform: `rotate(${s.rot}deg)`,
                        zIndex: s.z,
                        boxShadow: '0 20px 55px rgba(0,0,0,0.6), 0 6px 18px rgba(0,0,0,0.45)',
                      }}
                    >
                      <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <FadeImg src={src} alt={`${work.title} — frame ${i + 1}`} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Desktop layout: centered title + scattered photos ─────── */}

            {/* Centered info block */}
            <div
              ref={(el) => {
                // Share the same ref as mobile on desktop when md+ (mobile ref is unused on desktop)
                // We need a separate mechanism — use a wrapper that sets infoRefs for desktop
                if (window?.innerWidth >= 768) infoRefs.current[wi] = el
              }}
              className="
                hidden md:flex
                absolute inset-0 flex-col items-center justify-center
                z-30 pointer-events-none select-none
                px-[22vw]
              "
            >
              <p className="font-sans text-[9px] tracking-[0.45em] uppercase mb-4 text-center" style={{ color: `${work.accent}70` }}>
                {work.index}&thinsp;/&thinsp;{String(WORKS.length).padStart(2, '0')}
              </p>
              <h2
                className="font-display font-semibold text-fg leading-[0.9] tracking-tight text-center mb-5"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 6rem)' }}
              >
                {work.title}
              </h2>
              <div className="flex items-center gap-4 justify-center">
                {work.client && (
                  <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-muted/55">{work.client}</p>
                )}
                <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-muted/35">{work.genre}</p>
              </div>
              {work.award && (
                <p className="font-sans text-[9px] tracking-[0.13em] uppercase mt-4 text-center" style={{ color: '#c9a96e65' }}>
                  ★&ensp;{work.award}
                </p>
              )}
            </div>

            {/* Desktop scattered photos */}
            {srcs.map((src, i) => {
              const s = dSlots[i]
              if (!s) return null
              const posStyle: React.CSSProperties = {}
              if (s.left   != null) posStyle.left   = s.left
              if (s.right  != null) posStyle.right  = s.right
              if (s.top    != null) posStyle.top    = s.top
              if (s.bottom != null) posStyle.bottom = s.bottom

              return (
                <div
                  key={i}
                  ref={(el) => {
                    if (!dPhotoRefs.current[wi]) dPhotoRefs.current[wi] = []
                    dPhotoRefs.current[wi][i] = el
                  }}
                  className="absolute hidden md:block"
                  style={{
                    ...posStyle,
                    width: s.w,
                    transform: `rotate(${s.rot}deg)`,
                    zIndex: 10 + i,
                    boxShadow: '0 28px 70px rgba(0,0,0,0.65), 0 8px 22px rgba(0,0,0,0.5)',
                  }}
                >
                  <div style={{ width: '100%', aspectRatio: '16/9', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <FadeImg src={src} alt={`${work.title} — frame ${i + 1}`} />
                  </div>
                </div>
              )
            })}

            {/* Bottom labels (desktop only) */}
            <div className="absolute z-30 pointer-events-none hidden md:flex w-full px-8 justify-between" style={{ bottom: '6%' }}>
              <span className="font-sans text-[9px] tracking-[0.35em] uppercase" style={{ color: `${work.accent}45` }}>
                {String(wi + 1).padStart(2, '0')}&ensp;of&ensp;{String(WORKS.length).padStart(2, '0')}
              </span>
              <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-muted/20">
                {photoCount}&ensp;frame{photoCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )
      })}

      {/* Closing */}
      <div
        className="flex flex-col items-center justify-center py-40 gap-6"
        style={{ background: '#0D0D0B', borderTop: '1px solid rgba(245,244,240,0.06)' }}
      >
        <p className="font-mono text-[9px] tracking-[0.45em] uppercase" style={{ color: 'rgba(245,244,240,0.2)' }}>
          End of reel
        </p>
        <Link
          href="/"
          className="font-display transition-colors duration-500"
          style={{ fontSize: 'clamp(1.4rem, 2.2vw, 2.4rem)', color: 'rgba(245,244,240,0.45)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(245,244,240,0.9)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,244,240,0.45)')}
        >
          ← Back to Triangle Room
        </Link>
      </div>
    </div>
  )
}
