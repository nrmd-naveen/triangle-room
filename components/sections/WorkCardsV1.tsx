'use client'

/**
 * WorkCardsV1 — "Film Gate"
 * Cards open like horizontal blades pulling back from center — referencing a
 * camera shutter / film aperture. One card at a time, full viewport, pinned.
 * Clean, editorial, very controlled.
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
    title: 'Fabulous Lives of\nBollywood Wives',
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
    title: 'Formula 1\nAfter Movie',
    client: 'Abu Dhabi Grand Prix',
    genre: 'Motorsport Film',
    src: r2('F1 After movie', '01.jpg'),
  },
  {
    title: 'Great Overland\nAdventure',
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

export default function WorkCardsV1() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      const cards = gsap.utils.toArray<HTMLElement>('.wc1-card')
      const n = projects.length

      if (prefersReduced) {
        gsap.set(cards, { clipPath: 'inset(0 0%)' })
        cards.forEach((c) => {
          gsap.set(c.querySelectorAll('.wc1-title-line'), { yPercent: 0, opacity: 1 })
          gsap.set(c.querySelector('.wc1-meta'), { opacity: 1 })
        })
        return
      }

      // All cards start as closed blades (center split, nothing visible)
      gsap.set(cards, { clipPath: 'inset(0 50%)', opacity: 1 })
      cards.forEach((c) => {
        gsap.set(c.querySelectorAll('.wc1-title-line'), {
          yPercent: 110,
          opacity: 1,
        })
        gsap.set(c.querySelector('.wc1-meta'), { opacity: 0 })
      })

      // Timeline: 1 unit per card, scrubbed against scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${n * window.innerHeight}`,
          scrub: 1.4,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      })

      cards.forEach((card, i) => {
        const t = i // beat start for this card
        const isLast = i === n - 1

        // — Blades open (left and right blade pull back to edges)
        tl.to(
          card,
          { clipPath: 'inset(0 0%)', duration: 0.38, ease: 'power2.inOut' },
          t
        )

        // — Title lines clip up from below, one by one
        tl.to(
          card.querySelectorAll('.wc1-title-line'),
          { yPercent: 0, duration: 0.32, stagger: 0.07, ease: 'power3.out' },
          t + 0.28
        )

        // — Meta fades in
        tl.to(
          card.querySelector('.wc1-meta'),
          { opacity: 1, duration: 0.25, ease: 'none' },
          t + 0.42
        )

        if (!isLast) {
          // — Title fades out before close
          tl.to(
            card.querySelectorAll('.wc1-title-line'),
            { yPercent: -110, duration: 0.18, ease: 'power2.in' },
            t + 0.72
          )
          tl.to(
            card.querySelector('.wc1-meta'),
            { opacity: 0, duration: 0.15 },
            t + 0.70
          )

          // — Blades close back in
          tl.to(
            card,
            { clipPath: 'inset(0 50%)', duration: 0.3, ease: 'power2.inOut' },
            t + 0.78
          )
        }
      })
    },
    { scope: wrapperRef }
  )

  return (
    <section
      ref={wrapperRef}
      id="work"
      style={{ height: `${projects.length * 100 + 100}vh` }}
    >
      <div
        ref={stickyRef}
        className="h-screen w-full flex flex-col items-center justify-center overflow-hidden"
        style={{ background: '#0d0d0d' }}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-16 py-8 z-20">
          <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#f0ede8]/25">
            Selected Work
          </span>
          <span className="font-sans text-[9px] tracking-[0.3em] text-[#f0ede8]/20">
            {projects.length.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Card stack — all positioned absolute within this fixed-size frame */}
        <div
          className="relative w-full"
          style={{ maxWidth: 'min(88vw, 1200px)', aspectRatio: '16 / 9' }}
        >
          {projects.map((p, i) => (
            <div
              key={p.title}
              className="wc1-card absolute inset-0 overflow-hidden"
              style={{ clipPath: 'inset(0 50%)' }}
            >
              {/* Image */}
              <img
                src={p.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.05) 100%)',
                }}
              />

              {/* Index — top left inside card */}
              <div className="absolute top-6 left-6">
                <span className="font-sans text-[9px] tracking-[0.4em] text-[#f0ede8]/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Content — bottom of card */}
              <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-10">
                <div className="wc1-meta mb-4" style={{ opacity: 0 }}>
                  <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-[#f0ede8]/40">
                    {p.genre}
                    {' '}
                    <span className="text-[#f0ede8]/20 mx-2">—</span>
                    {' '}
                    {p.client}
                  </span>
                  {p.award && (
                    <span
                      className="block mt-1.5 font-sans text-[8px] tracking-[0.28em]"
                      style={{ color: 'rgba(202,162,60,0.65)' }}
                    >
                      ★ {p.award}
                    </span>
                  )}
                </div>

                <h3
                  className="font-display font-light text-[#f0ede8] leading-[0.88] tracking-[-0.025em]"
                  style={{ fontSize: 'clamp(1.8rem, 4.5vw, 5rem)' }}
                >
                  {p.title.split('\n').map((line, li) => (
                    <div key={li} className="overflow-hidden">
                      <span
                        className="wc1-title-line block"
                        style={{ transform: 'translateY(110%)' }}
                      >
                        {line}
                      </span>
                    </div>
                  ))}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-8 left-8 right-8 md:left-16 md:right-16 flex gap-1 z-20">
          {projects.map((_, i) => (
            <div
              key={i}
              className="wc1-prog-bar h-px flex-1"
              style={{ background: 'rgba(240,237,232,0.12)' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
