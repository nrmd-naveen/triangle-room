'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import StatsCardsV1 from './StatsCardsV1'

gsap.registerPlugin(ScrollTrigger)

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

    gsap.from('.about-headline', {
      opacity: 0, y: 32,
      duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.about-meta', {
      opacity: 0, y: 18,
      duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 65%', toggleActions: 'play none none reverse' },
    })
    gsap.from('.about-body', {
      opacity: 0, y: 22,
      duration: 1, ease: 'power3.out', stagger: 0.14,
      scrollTrigger: { trigger: '.about-story', start: 'top 76%', toggleActions: 'play none none reverse' },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="about"
      className="border-t border-border"
      style={{ background: '#F4F6F9' }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-0">

        {/* ── Header grid ─────────────────────────────────────────────────────
          Left: label + big headline
          Right: editorial metadata block
        */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-end mb-12 md:mb-16">

          <div>
            <p className="about-meta font-mono text-[9.5px] tracking-[0.44em] uppercase mb-6"
               style={{ color: 'rgba(20,23,20,0.32)' }}>
              Who we are
            </p>
            <h2
              className="about-headline font-display leading-[0.96] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(3.2rem, 7vw, 6.4rem)', fontWeight: 300, color: '#141714' }}
            >
              New company.<br />
              <em
                style={{
                  fontStyle: 'normal',
                  fontWeight: 400,
                  color: 'transparent',
                  WebkitTextStroke: '1px #141714',
                  letterSpacing: '-0.02em',
                }}
              >
                Not new at this.
              </em>
            </h2>
          </div>

          {/* Right meta block — editorial details */}
          <div
            className="about-meta hidden md:flex flex-col items-end gap-3 pb-1"
            style={{ minWidth: 200 }}
          >
            <div style={{ width: 1, height: 48, background: 'rgba(20,23,20,0.12)', marginBottom: 4 }} />
            <p className="font-mono text-[8.5px] tracking-[0.32em] uppercase text-right"
               style={{ color: 'rgba(20,23,20,0.35)', lineHeight: 2 }}>
              Est. 2025<br />Trivandrum, India<br />Three founders
            </p>
            <div
              style={{
                marginTop: 6,
                width: 32, height: 32,
                position: 'relative',
                opacity: 0.18,
              }}
              aria-hidden
            >
              {/* Tiny triangle mark */}
              <svg viewBox="0 0 32 32" fill="none" style={{ width: '100%', height: '100%' }}>
                <polygon points="16,2 30,28 2,28" stroke="#141714" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
          </div>
        </div>

        {/* Thin divider with section number */}
        <div className="flex items-center gap-4 mb-14 md:mb-16">
          <div style={{ flex: 1, height: 1, background: 'rgba(20,23,20,0.09)' }} />
          <p className="font-mono text-[8px] tracking-[0.36em]"
             style={{ color: 'rgba(20,23,20,0.20)' }}>02</p>
        </div>

        {/* ── Origin story ─────────────────────────────────────────────────────
          Text left (55%) · Image panel right (full height of text area)
        */}
        <div
          className="about-story grid grid-cols-1 md:grid-cols-[55fr_42fr] gap-10 md:gap-16 mb-16 md:mb-20"
        >
          {/* Text column */}
          <div className="flex flex-col justify-between gap-6">
            <p
              className="about-body font-sans font-normal leading-[1.80]"
              style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', color: 'rgba(20,23,20,0.72)' }}
            >
              There was a small, triangular room in Trivandrum. Anu lived and worked in it while he was
              learning to edit, all the way through college at Mar Ivanios. Midhuna and Jibin were his classmates.
              The three of them would assemble in that room to make things, and talk about what they wanted
              to make one day.
            </p>
            <p
              className="about-body font-sans font-normal leading-[1.80]"
              style={{ fontSize: 'clamp(1rem, 1.3vw, 1.12rem)', color: 'rgba(20,23,20,0.44)' }}
            >
              Then everyone left for work and spent fifteen years learning the business from inside other
              people&apos;s shows — three careers across broadcast, streaming, audio and ad film.
              Now back in the same room. Triangle Room is named after the space where it actually started.
            </p>
          </div>

          {/* Atmospheric image panel — taller, more prominent */}
          <div
            className="about-body relative overflow-hidden rounded-sm"
            style={{ minHeight: 280 }}
          >
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt="The triangular room"
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'cover', filter: 'brightness(0.85) contrast(1.06)' }}
              />
            ) : (
              <>
                {/* Base: dark ink to deep navy */}
                <div className="absolute inset-0" style={{
                  background: 'linear-gradient(148deg, #0C0E14 0%, #111520 35%, #0E1218 65%, #0A0C10 100%)',
                }} />
                {/* Cool-blue mist — matches hero triangle */}
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse 80% 60% at 40% 35%, rgba(94,130,174,0.28) 0%, rgba(148,172,198,0.10) 50%, transparent 72%)',
                }} />
                {/* Subtle secondary bloom */}
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse 50% 40% at 75% 65%, rgba(185,198,214,0.12) 0%, transparent 60%)',
                }} />
              </>
            )}

            {/* Film grain */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.18 }} aria-hidden>
              <filter id="about-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.64" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0" />
              </filter>
              <rect width="100%" height="100%" filter="url(#about-grain)" />
            </svg>

            {/* Vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 88% 88% at 50% 50%, transparent 28%, rgba(8,10,14,0.55) 100%)',
            }} />

            {/* Crop marks */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l" style={{ borderColor: 'rgba(148,172,198,0.20)' }} />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r" style={{ borderColor: 'rgba(148,172,198,0.20)' }} />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l" style={{ borderColor: 'rgba(148,172,198,0.20)' }} />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r" style={{ borderColor: 'rgba(148,172,198,0.20)' }} />

            {/* Caption */}
            <div className="absolute bottom-4 left-5 font-mono text-[7.5px] tracking-[0.28em] uppercase"
                 style={{ color: 'rgba(148,172,198,0.35)' }}>
              {imageCaption}
            </div>
          </div>
        </div>

        {/* ── Stats cards ─────────────────────────────────────────────────────── */}
        <div className="pb-16 md:pb-24">
          <StatsCardsV1 />
        </div>

      </div>
    </section>
  )
}
