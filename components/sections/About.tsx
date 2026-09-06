'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FOUNDERS = [
  {
    name: 'Anu Kamala',
    role: 'Story and Post',
    bio: 'Eighteen years as a post-production editor. Netflix, National Geographic, Discovery, Olympic Channel, Prime Video, Star Sports. Series editor on The Greatest Rivalry. Film editor on Tarini — Best Editor nomination, Asian Television Awards 2019.',
  },
  {
    name: 'Midhuna Pichy',
    role: 'Production and Delivery',
    bio: 'Eleven years producing television, reality and ad film across Mumbai, Hyderabad, Chennai and Kerala. Three seasons of Bigg Boss Malayalam as episode, post and creative producer. Seven other international formats.',
  },
  {
    name: 'Jibin Babu',
    role: 'Development and Writing',
    bio: 'Nine years in development and direction across television, audio, film and digital. Music Mojo Season 7 for Kappa TV. Writer-director of Pachamarakaikal — two Kerala State Awards.',
  },
]

const STATS = [
  { num: '18', sup: '+', label: 'Years\nin post' },
  { num: '38', sup: '+', label: 'Years\ncombined' },
  { num: '60', sup: '+', label: 'Credited\nproductions' },
]

export default function About({
  imageSrc     = '',
  imageCaption = 'Mar Ivanios · Trivandrum',
}: {
  imageSrc?:     string
  imageCaption?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from('.about-top', {
      opacity: 0, y: 28,
      duration: 1, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 72%',
        toggleActions: 'play none none reverse',
      },
    })

    gsap.from('.about-col', {
      opacity: 0, y: 24,
      duration: 1, ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.about-origin',
        start: 'top 78%',
        toggleActions: 'play none none reverse',
      },
    })

    gsap.from('.about-stat', {
      opacity: 0, y: 20,
      duration: 0.8, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.about-stats',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })

    sectionRef.current?.querySelectorAll('.founder-row').forEach((row) => {
      gsap.from(row, {
        opacity: 0, y: 16,
        duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start: 'top 84%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-surface border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-8 md:px-12 py-28 md:py-36">

        {/* Header */}
        <div className="mb-20">
          <p className="about-top font-mono text-[9.5px] tracking-[0.42em] uppercase text-muted/50 mb-7">
            Who we are
          </p>
          <h2
            className="about-top font-display text-ink leading-[1.0] tracking-tight max-w-[16ch]"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5.5rem)', fontWeight: 300 }}
          >
            New company.<br />
            <span className="text-accent" style={{ fontWeight: 400 }}>Not new at this.</span>
          </h2>
        </div>

        {/* Origin story — text left, atmospheric image right */}
        <div className="about-origin grid grid-cols-1 md:grid-cols-[1fr_340px] gap-10 md:gap-14 pb-20 mb-20 border-b border-border items-start">
          <div>
            <p className="about-col font-sans font-normal text-ink/75 leading-[1.78]" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.18rem)' }}>
              There was a small, triangular room in Trivandrum. Anu lived and worked in it while he was
              learning to edit, all the way through college at Mar Ivanios. Midhuna and Jibin were his classmates.
              The three of them would assemble in that room to make things, and talk about what they wanted
              to make one day.
            </p>
            <p className="about-col font-sans font-normal text-muted leading-[1.78] mt-6" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.18rem)' }}>
              Then everyone left for work and spent fifteen years learning the business from inside other
              people&apos;s shows — three careers across broadcast, streaming, audio and ad film.
              Now back in the same room. Triangle Room is named after the space where it actually started.
            </p>
          </div>

          {/* Atmospheric image panel */}
          <div className="about-col hidden md:block relative overflow-hidden rounded-sm" style={{ minHeight: 340 }}>
            {imageSrc ? (
              /* Real photo */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="The triangular room"
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'cover', filter: 'brightness(0.88) contrast(1.04)' }}
              />
            ) : (
              /* Placeholder gradient until real photo is configured */
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(148deg, #1c1d1a 0%, #262823 30%, #1e201c 55%, #161714 90%, #111210 100%)',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 70% 55% at 38% 58%, rgba(58,72,52,0.55) 0%, transparent 68%)',
                  }}
                />
              </>
            )}
            {/* Film grain overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.22 }} aria-hidden>
              <filter id="about-panel-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#about-panel-grain)" />
            </svg>
            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(14,15,13,0.6) 100%)',
              }}
            />
            {/* Frame crop marks */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t border-l" style={{ borderColor: 'rgba(245,244,240,0.15)' }} />
            <div className="absolute top-4 right-4 w-5 h-5 border-t border-r" style={{ borderColor: 'rgba(245,244,240,0.15)' }} />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l" style={{ borderColor: 'rgba(245,244,240,0.15)' }} />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r" style={{ borderColor: 'rgba(245,244,240,0.15)' }} />
            {/* Caption */}
            <div
              className="absolute bottom-5 left-5 font-mono text-[8px] tracking-[0.28em] uppercase"
              style={{ color: 'rgba(245,244,240,0.22)' }}
            >
              {imageCaption}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats grid grid-cols-3 gap-0 pb-20 mb-20 border-b border-border">
          {STATS.map(({ num, sup, label }) => (
            <div key={label} className="about-stat pr-6 md:pr-10">
              <div
                className="font-display text-ink leading-none tracking-[-0.03em] mb-3"
                style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 300 }}
              >
                {num}
                <sup className="text-accent align-top" style={{ fontSize: '0.38em', top: '-0.8em', marginLeft: '2px', fontWeight: 400 }}>
                  {sup}
                </sup>
              </div>
              <div className="font-mono text-[9.5px] tracking-[0.28em] uppercase text-muted whitespace-pre-line leading-[1.8]">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Three founders */}
        {/* <div>
          <p className="font-mono text-[9.5px] tracking-[0.42em] uppercase text-muted/40 mb-8">
            The three directors
          </p>
          <div className="border-t border-border">
            {FOUNDERS.map(({ name, role, bio }) => (
              <div
                key={name}
                className="founder-row grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4 md:gap-12 py-8 border-b border-border"
              >
                <div>
                  <div
                    className="font-display text-ink mb-1.5"
                    style={{ fontSize: 'clamp(1.1rem, 1.6vw, 1.3rem)', fontWeight: 400 }}
                  >
                    {name}
                  </div>
                  <div className="font-mono text-[9.5px] tracking-[0.22em] uppercase text-accent">
                    {role}
                  </div>
                </div>
                <p className="font-sans text-[14.5px] text-muted leading-[1.78] max-w-[58ch]">
                  {bio}
                </p>
              </div>
            ))}
          </div>
        </div> */}

      </div>
    </section>
  )
}
