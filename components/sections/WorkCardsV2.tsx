'use client'

/**
 * WorkCardsV2 — "Depth Pull"
 * Cards sit in a simulated Z-stack. The active card is at full scale / front.
 * Scroll pulls it upward and off as the next card rises from behind.
 * A slow, heavy, projector-reel feel. Title is large and bold outside the card.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'
const r2 = (folder: string, file: string) =>
  `${R2}/${encodeURIComponent(folder)}/${file}`

const projects = [
  {
    title: 'Tarini',
    client: 'National Geographic',
    genre: 'Documentary Film',
    award: 'Best Editor Nominee · ATA 2019',
    src: `${R2}/03.jpg`,
  },
  {
    title: 'Fabulous Lives of Bollywood Wives',
    client: 'Netflix',
    genre: 'Reality Series',
    src: r2('Bollywood wives', '01.jpg'),
  },
  {
    title: 'India from Above',
    client: 'National Geographic UK',
    genre: 'Documentary Series',
    src: r2('India From Above', '01.jpg'),
  },
  {
    title: 'Formula 1 After Movie',
    client: 'Abu Dhabi Grand Prix',
    genre: 'Motorsport Film',
    src: r2('F1 After movie', '01.jpg'),
  },
  {
    title: 'Great Overland Adventure',
    client: 'Mercedes-Benz / NDTV Prime',
    genre: 'Travel Series',
    src: r2('overland', '01.jpg'),
  },
  {
    title: 'India vs Pakistan',
    client: 'Star Sports',
    genre: 'Sports Highlights',
    src: r2('India vs Pak', '01.jpg'),
  },
  {
    title: 'Doubles Trouble',
    client: 'Olympic Channel',
    genre: 'Documentary',
    src: r2('Double trouble', '01.jpg'),
  },
]

// Z-depth simulation levels
const DEPTH = {
  active:  { scale: 1,    y: '0%',   opacity: 1 },
  next:    { scale: 0.88, y: '7%',   opacity: 0.45 },
  waiting: { scale: 0.76, y: '13%',  opacity: 0 },
  exited:  { scale: 1.06, y: '-12%', opacity: 0 },
}

export default function WorkCardsV2() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      const n = projects.length
      const cards = gsap.utils.toArray<HTMLElement>('.wc2-card')
      const titles = gsap.utils.toArray<HTMLElement>('.wc2-title')
      const metas = gsap.utils.toArray<HTMLElement>('.wc2-meta')

      if (prefersReduced) {
        cards.forEach((c, i) => gsap.set(c, i === 0 ? DEPTH.active : DEPTH.waiting))
        titles.forEach((t, i) => gsap.set(t, { opacity: i === 0 ? 1 : 0, yPercent: 0 }))
        metas.forEach((m, i) => gsap.set(m, { opacity: i === 0 ? 1 : 0 }))
        return
      }

      // — Set initial Z-depth states
      cards.forEach((c, i) => {
        if (i === 0) gsap.set(c, DEPTH.active)
        else if (i === 1) gsap.set(c, DEPTH.next)
        else gsap.set(c, DEPTH.waiting)
      })

      // — Title initial states
      titles.forEach((t, i) => {
        gsap.set(t, { opacity: i === 0 ? 1 : 0, yPercent: i === 0 ? 0 : 30 })
      })
      metas.forEach((m, i) => gsap.set(m, { opacity: i === 0 ? 1 : 0 }))

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${(n - 1) * window.innerHeight}`,
          scrub: 1.6,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      })

      // Each beat = transition from card i to card i+1
      for (let i = 0; i < n - 1; i++) {
        const t = i

        // — Outgoing: title disappears first
        tl.to(metas[i], { opacity: 0, duration: 0.2 }, t)
        tl.to(titles[i], { opacity: 0, yPercent: -20, duration: 0.3, ease: 'power2.in' }, t + 0.05)

        // — Outgoing card shoots upward and off
        tl.to(cards[i], { ...DEPTH.exited, duration: 0.55, ease: 'power2.in' }, t + 0.1)

        // — Incoming card pulls to front
        tl.to(cards[i + 1], { ...DEPTH.active, duration: 0.6, ease: 'power3.out' }, t + 0.28)

        // — Incoming title appears
        tl.to(titles[i + 1], { opacity: 1, yPercent: 0, duration: 0.45, ease: 'power3.out' }, t + 0.52)
        tl.to(metas[i + 1], { opacity: 1, duration: 0.3 }, t + 0.68)

        // — Card after next moves from waiting → next
        if (i + 2 < n) {
          tl.to(cards[i + 2], { ...DEPTH.next, duration: 0.5, ease: 'power2.out' }, t + 0.2)
        }
      }
    },
    { scope: wrapperRef }
  )

  return (
    <section
      ref={wrapperRef}
      id="work"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div
        ref={stickyRef}
        className="h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: '#0d0d0d' }}
      >
        {/* Top label */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-16 py-8 z-20">
          <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#f0ede8]/25">
            Selected Work
          </span>
          <span className="font-sans text-[9px] tracking-[0.3em] text-[#f0ede8]/20">
            {projects.length.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Card stack — slightly above center to make room for title below */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: '100%', marginTop: '-6vh' }}
        >
          <div
            className="relative"
            style={{ width: 'min(72vw, 920px)', aspectRatio: '16 / 9' }}
          >
            {projects.map((p, i) => (
              <div
                key={p.title}
                className="wc2-card absolute inset-0 overflow-hidden rounded-sm"
                style={{ transformOrigin: '50% 60%' }}
              >
                <img
                  src={p.src}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
                {/* Subtle dark overlay */}
                <div
                  className="absolute inset-0"
                  style={{ background: 'rgba(13,13,13,0.25)' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Title region — outside the card, beneath it */}
        <div
          className="relative mt-8 md:mt-10 w-full text-center"
          style={{ maxWidth: 'min(72vw, 920px)', margin: '0 auto' }}
        >
          <div className="relative" style={{ height: 'clamp(4rem, 10vw, 9rem)', marginTop: '2rem' }}>
            {projects.map((p, i) => (
              <div
                key={p.title}
                className="absolute inset-0 flex flex-col items-center justify-start"
              >
                <div className="wc2-meta" style={{ opacity: i === 0 ? 1 : 0 }}>
                  <span className="font-sans text-[9px] tracking-[0.38em] uppercase text-[#f0ede8]/30">
                    {p.genre}
                    {p.award && (
                      <span style={{ color: 'rgba(202,162,60,0.55)', marginLeft: '1.5em' }}>
                        ★ {p.award}
                      </span>
                    )}
                  </span>
                </div>
                <h3
                  className="wc2-title font-display font-light text-[#f0ede8] leading-[0.88] tracking-[-0.025em] mt-3 text-center"
                  style={{
                    fontSize: 'clamp(1.6rem, 4vw, 4.5rem)',
                    opacity: i === 0 ? 1 : 0,
                    transform: i === 0 ? 'translateY(0%)' : 'translateY(30%)',
                  }}
                >
                  {p.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Right-side dot indicator */}
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-20">
          {projects.map((_, i) => (
            <div
              key={i}
              className="wc2-dot rounded-full"
              style={{
                width: '3px',
                height: '3px',
                background: i === 0 ? 'rgba(240,237,232,0.7)' : 'rgba(240,237,232,0.15)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
