'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── Constants ───────────────────────────────────────────────────────────────

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'

/** Card dimensions in px — portrait 9:16 for the "social" feel */
const CARD_W = 196
const CARD_H = 348

/**
 * Fan layout mirrors the Lando Norris callout interaction.
 * x/y are in px. Cards are positioned absolute at left:50% top:0,
 * so x is relative to that anchor. BASE centers the card on the axis.
 */
const BASE = -(CARD_W / 2) // -98px: horizontally centers a card at left:50%

const r = (rem: number) => rem * 16

type FanCard = {
  src: string
  alt: string
  x: number   // px, from left:50%
  y: number   // px, from top
  rot: number // degrees
  scale: number
  z: number
}

const CARDS: FanCard[] = [
  { src: `${R2}/India%20From%20Above/01.jpg`, alt: 'India from Above',         x: BASE + r(-28), y: r(7.3), rot: -21,   scale: 0.776, z: 1  },
  { src: `${R2}/F1%20After%20movie/01.jpg`,   alt: 'Formula 1 After Movie',    x: BASE + r(-19), y: r(4),   rot: -14.5, scale: 0.850, z: 2  },
  { src: `${R2}/overland/01.jpg`,             alt: 'Great Overland Adventure', x: BASE + r(-10), y: r(1.3), rot: -7.6,  scale: 0.935, z: 3  },
  { src: `${R2}/03.jpg`,                      alt: 'Tarini',                   x: BASE + r(0),   y: 0,      rot: -0.75, scale: 1,     z: 10 },
  { src: `${R2}/Bollywood%20wives/01.jpg`,    alt: 'Bollywood Wives',          x: BASE + r(11),  y: r(1.3), rot:  7,    scale: 0.935, z: 3  },
  { src: `${R2}/redbull/01.jpg`,              alt: 'Red Bull',                 x: BASE + r(22),  y: r(4),   rot:  14,   scale: 0.850, z: 2  },
  { src: `${R2}/India%20vs%20Pak/01.jpg`,     alt: 'India vs Pakistan',        x: BASE + r(30),  y: r(7.3), rot:  21,   scale: 0.776, z: 1  },
]

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'Vimeo',     href: '#' },
  { label: 'YouTube',   href: '#' },
  { label: 'LinkedIn',  href: '#' },
]

// ─── Social Link — char-by-char flip on hover ─────────────────────────────

function SocialLink({ label, href }: { label: string; href: string }) {
  const linkRef = useRef<HTMLAnchorElement>(null)

  function handleEnter() {
    const chars = linkRef.current?.querySelectorAll<HTMLElement>('.ch')
    if (!chars || !chars.length) return
    gsap.killTweensOf(chars)
    const tl = gsap.timeline()
    tl.to(chars,  { y: '-105%', stagger: 0.025, duration: 0.22, ease: 'power2.in'  })
    tl.set(chars,  { y: '105%' })
    tl.to(chars,  { y:     '0', stagger: 0.025, duration: 0.22, ease: 'power2.out' })
  }

  function handleLeave() {
    // Reset silently so the next hover is always clean
    const chars = linkRef.current?.querySelectorAll<HTMLElement>('.ch')
    if (!chars || !chars.length) return
    gsap.killTweensOf(chars)
    gsap.set(chars, { y: 0 })
  }

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center overflow-visible"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Char row — each char clipped to its own line box */}
      <span
        className="overflow-hidden flex"
        style={{ lineHeight: 1.1 }}
      >
        {label.split('').map((ch, i) => (
          <span
            key={i}
            className="ch inline-block font-display text-ink/60 group-hover:text-ink transition-colors duration-300"
            style={{
              fontSize: 'clamp(1.1rem, 1.6vw, 1.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            {ch}
          </span>
        ))}
      </span>
      {/* Underline: CSS transition driven by group-hover */}
      <span className="block h-px bg-accent w-0 group-hover:w-full transition-[width] duration-500 ease-out" />
    </a>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SocialsCallout() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Always set the initial fan layout so cards appear correctly even without animation
    CARDS.forEach((card, i) => {
      const el = cardRefs.current[i]
      if (!el) return
      gsap.set(el, {
        x: card.x,
        y: card.y,
        rotation: card.rot,
        scale: card.scale,
        zIndex: card.z,
        transformOrigin: '50% 50%',
      })
    })

    if (reduced) return

    // ── Headline: oval clip-path line reveal ──────────────────────────────────
    gsap.fromTo(
      '.sc-line',
      { clipPath: 'ellipse(100% 0% at 50% 0%)' },
      {
        clipPath: 'ellipse(100% 120% at 50% 0%)',
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.20,
        scrollTrigger: {
          trigger: '.sc-headline',
          start: 'top 75%',
        },
      }
    )

    // ── Fan cards: stagger entrance from center outward ───────────────────────
    // Order: center card first, then alternating outward
    const enterOrder = [3, 2, 4, 1, 5, 0, 6]
    enterOrder.forEach((cardIdx, seqIdx) => {
      const el = cardRefs.current[cardIdx]
      if (!el) return
      gsap.from(el, {
        opacity: 0,
        y: '+=60',
        duration: 1.0,
        ease: 'power3.out',
        delay: seqIdx * 0.06,
        scrollTrigger: {
          trigger: '.sc-fan',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
    })

    // ── Intro + social links stagger ──────────────────────────────────────────
    gsap.from('.sc-intro', {
      opacity: 0,
      y: 14,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.sc-below', start: 'top 82%' },
    })

    gsap.from('.sc-slink', {
      opacity: 0,
      y: 10,
      stagger: 0.08,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.sc-below', start: 'top 84%' },
    })
  }, { scope: sectionRef })

  // ── Card hover handlers ───────────────────────────────────────────────────

  function onCardEnter(i: number) {
    const el   = cardRefs.current[i]
    const card = CARDS[i]
    if (!el) return
    gsap.to(el, {
      y:        card.y - 52,
      rotation: card.rot * 0.12,            // nearly upright
      scale:    Math.min(card.scale * 1.1, 1.06),
      zIndex:   20,
      duration: 0.38,
      ease:     'power3.out',
    })
  }

  function onCardLeave(i: number) {
    const el   = cardRefs.current[i]
    const card = CARDS[i]
    if (!el) return
    gsap.to(el, {
      y:        card.y,
      rotation: card.rot,
      scale:    card.scale,
      zIndex:   card.z,
      duration: 0.55,
      ease:     'power3.out',
    })
  }

  const fanH = CARD_H + r(7.3) + 24 // px: tallest visible extent of fan

  return (
    <section
      ref={sectionRef}
      id="socials"
      className="bg-bg overflow-hidden py-28 md:py-36"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-12">

        {/* ── Headline ─────────────────────────────────────────────────────── */}
        <header className="sc-headline flex flex-col items-center text-center mb-12 md:mb-16">
          <p className="font-mono text-[9.5px] tracking-[0.42em] uppercase text-muted mb-6">
            On Socials
          </p>

          {/* Two-line display — each line gets its own oval clip reveal */}
          <h2 aria-label="Find us on socials" className="leading-[1]">
            {[
              { text: 'Find us',   weight: 300, opacity: 'text-ink/50' },
              { text: 'on socials', weight: 300, opacity: 'text-ink'   },
            ].map(({ text, weight, opacity }, i) => (
              <div
                key={i}
                className={`sc-line block overflow-clip ${opacity} font-display tracking-[-0.03em]`}
                style={{
                  fontSize: 'clamp(3.2rem, 7vw, 6.5rem)',
                  fontWeight: weight,
                  clipPath: 'ellipse(100% 120% at 50% 0%)',
                }}
              >
                {text}
              </div>
            ))}
          </h2>
        </header>

        {/* ── Fan ──────────────────────────────────────────────────────────── */}
        {/* overflow:visible so cards bleed out; section clips at its boundary */}
        <div
          className="sc-fan relative mx-auto"
          style={{ height: fanH, overflow: 'visible' }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              className="absolute top-0 left-1/2 overflow-hidden rounded-[6px] shadow-2xl select-none"
              style={{
                width:  CARD_W,
                height: CARD_H,
                cursor: 'none', // our custom cursor handles this
              }}
              onMouseEnter={() => onCardEnter(i)}
              onMouseLeave={() => onCardLeave(i)}
            >
              <img
                src={card.src}
                alt={card.alt}
                width={CARD_W}
                height={CARD_H}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
              />
              {/* Uniform tint so cards read as a coherent deck */}
              <div className="absolute inset-0 bg-ink/[0.08] pointer-events-none" />
            </div>
          ))}

          {/* Mobile: only show the center card + neighbours */}
          {/* (full fan only renders correctly on wide viewports) */}
        </div>

        {/* ── Intro + social links ──────────────────────────────────────────── */}
        <div className="sc-below mt-14 flex flex-col items-center gap-8 text-center">
          <p className="sc-intro font-sans text-muted text-xs tracking-[0.22em] uppercase">
            Follow Triangle Room
          </p>

          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
            {SOCIALS.map(({ label, href }) => (
              <div key={label} className="sc-slink">
                <SocialLink label={label} href={href} />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
