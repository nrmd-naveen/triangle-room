'use client'

/**
 * WorkCardsV3 — "Knife Cut"
 * A diagonal wipe sweeps continuously from right to left across the full viewport.
 * Each card appears mid-sweep and disappears as the next sweep begins.
 * The diagonal edge is the literal cut — referencing the editorial action.
 *
 * Card is large, near full-screen. Title lives outside, top-left, revealed
 * by a separate mask. The genre tag floats in at bottom-right.
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

// Diagonal wipe states — 4-point polygon, all with same vertex count
// The wipe moves left-to-right for entry, continuing left for exit.
// The ~18% horizontal offset between top and bottom creates the diagonal angle.
const CLIP = {
  // Collapsed off-screen right
  hiddenRight: 'polygon(115% 0%, 115% 0%, 97% 100%, 97% 100%)',
  // Full card visible
  visible:     'polygon(-18% 0%, 115% 0%, 97% 100%, -18% 100%)',
  // Collapsed off-screen left
  hiddenLeft:  'polygon(-133% 0%, -18% 0%, -36% 100%, -133% 100%)',
}

export default function WorkCardsV3() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      const n = projects.length
      const cards = gsap.utils.toArray<HTMLElement>('.wc3-card')

      if (prefersReduced) {
        gsap.set(cards, { clipPath: CLIP.visible })
        cards.forEach((c) => {
          gsap.set(c.querySelectorAll('.wc3-title-wrap, .wc3-tag'), { opacity: 1, xPercent: 0 })
        })
        return
      }

      // All cards start collapsed to the right (not yet arrived)
      gsap.set(cards, { clipPath: CLIP.hiddenRight })
      cards.forEach((c) => {
        gsap.set(c.querySelector('.wc3-title-wrap'), { opacity: 0, x: 40 })
        gsap.set(c.querySelector('.wc3-tag'), { opacity: 0, x: -20 })
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: 'top top',
          end: `+=${n * window.innerHeight}`,
          scrub: 1.3,
          pin: stickyRef.current,
          anticipatePin: 1,
        },
      })

      cards.forEach((card, i) => {
        const t = i
        const isLast = i === n - 1

        // — Diagonal wipe reveals the card (right → visible)
        tl.to(
          card,
          { clipPath: CLIP.visible, duration: 0.36, ease: 'power2.inOut' },
          t
        )

        // — Title slides in from right
        tl.to(
          card.querySelector('.wc3-title-wrap'),
          { opacity: 1, x: 0, duration: 0.3, ease: 'power3.out' },
          t + 0.3
        )

        // — Genre tag slides in from right
        tl.to(
          card.querySelector('.wc3-tag'),
          { opacity: 1, x: 0, duration: 0.25, ease: 'power2.out' },
          t + 0.44
        )

        if (!isLast) {
          // — Title and tag fade out
          tl.to(
            card.querySelector('.wc3-title-wrap'),
            { opacity: 0, x: -30, duration: 0.2, ease: 'power2.in' },
            t + 0.70
          )
          tl.to(
            card.querySelector('.wc3-tag'),
            { opacity: 0, x: 20, duration: 0.15 },
            t + 0.72
          )

          // — Diagonal wipe continues left (cut exits)
          tl.to(
            card,
            { clipPath: CLIP.hiddenLeft, duration: 0.34, ease: 'power2.inOut' },
            t + 0.76
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
        className="h-screen w-full flex items-center justify-center overflow-hidden"
        style={{ background: '#0d0d0d' }}
      >
        {/* Top-left label */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 md:px-16 py-8 z-20">
          <span className="font-sans text-[9px] tracking-[0.4em] uppercase text-[#f0ede8]/25">
            Selected Work
          </span>
          <span className="font-sans text-[9px] tracking-[0.3em] text-[#f0ede8]/20">
            {projects.length.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Full-bleed card area — cards span most of the viewport */}
        <div
          className="relative w-full overflow-visible"
          style={{ height: '78vh', maxHeight: '820px' }}
        >
          {projects.map((p, i) => (
            <div
              key={p.title}
              className="wc3-card absolute inset-0 overflow-hidden"
              style={{ clipPath: CLIP.hiddenRight }}
            >
              {/* Image */}
              <img
                src={p.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />

              {/* Dark vignette */}
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(to right, rgba(13,13,13,0.65) 0%, rgba(13,13,13,0) 40%),
                    linear-gradient(to top, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0) 45%)
                  `,
                }}
              />

              {/* Title — top-left inside card */}
              <div
                className="wc3-title-wrap absolute top-10 left-10 md:top-14 md:left-14"
                style={{ opacity: 0, transform: 'translateX(40px)' }}
              >
                <p className="font-sans text-[9px] tracking-[0.38em] uppercase text-[#f0ede8]/35 mb-3">
                  {p.client}
                </p>
                <h3
                  className="font-display font-light text-[#f0ede8] leading-[0.88] tracking-[-0.025em]"
                  style={{ fontSize: 'clamp(2rem, 5.5vw, 6rem)' }}
                >
                  {p.title}
                </h3>
                {p.award && (
                  <p
                    className="mt-4 font-sans text-[8px] tracking-[0.28em] uppercase"
                    style={{ color: 'rgba(202,162,60,0.65)' }}
                  >
                    ★ {p.award}
                  </p>
                )}
              </div>

              {/* Genre tag — bottom right */}
              <div
                className="wc3-tag absolute bottom-10 right-10 md:bottom-12 md:right-14"
                style={{ opacity: 0, transform: 'translateX(-20px)' }}
              >
                <span className="font-sans text-[9px] tracking-[0.38em] uppercase text-[#f0ede8]/35">
                  {p.genre}
                </span>
              </div>

              {/* Card index — bottom left */}
              <div className="absolute bottom-10 left-10 md:bottom-12 md:left-14">
                <span className="font-sans text-[9px] tracking-[0.35em] text-[#f0ede8]/20">
                  {String(i + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
