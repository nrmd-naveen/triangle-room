'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ReelStripV2 from './ReelStripV2'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_META = {
  email: 'connect@triangleroom.in',
  phone: '+91 98464 97008',
}

export default function Contact({
  meta,
}: {
  meta?: { email: string; phone: string }
}) {
  const email = meta?.email ?? DEFAULT_META.email
  const phone = meta?.phone ?? DEFAULT_META.phone
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.from('.contact-headline', {
      opacity: 0, y: 32,
      duration: 1.1, ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 72%',
        toggleActions: 'play none none reverse',
      },
    })

    gsap.from('.contact-link', {
      opacity: 0, y: 16,
      duration: 0.8, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.contact-links',
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  }, { scope: sectionRef })

  return (
    <footer
      ref={sectionRef}
      id="contact"
      className="bg-ink flex flex-col min-h-screen"
    >
      {/* Top bar — mirrors WorkScrolly section label pattern */}
      <div
        className="flex items-center justify-between px-8 md:px-16 lg:px-20 border-b border-edge shrink-0"
        style={{ height: '54px' }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.22em] text-accent">05</span>
          <span className="w-px h-3 bg-edge" />
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted">CONTACT</span>
        </div>
      </div>

      {/* Main content — vertically centered in remaining space */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20">

        <p className="font-mono text-[9.5px] tracking-[0.42em] uppercase text-fg/25 mb-12">
          Start a conversation
        </p>

        <h2
          className="contact-headline font-display text-fg leading-[1.05] tracking-[-0.03em] max-w-[20ch]"
          style={{ fontSize: 'clamp(2.6rem, 5.5vw, 5rem)', fontWeight: 300 }}
        >
          We started in one room. Now we&apos;d like to fill it with{' '}
          <span className="text-accent" style={{ fontWeight: 400 }}>your work.</span>
        </h2>

        {/* Contact links — naturally below headline with generous gap */}
        <div className="contact-links flex flex-col gap-3 mt-16">
          <a
            href={`mailto:${email}`}
            className="contact-link font-display font-normal text-fg/55 hover:text-fg transition-colors duration-400 leading-none"
            style={{ fontSize: 'clamp(1.3rem, 2.4vw, 2rem)' }}
          >
            {email}
          </a>
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="contact-link font-display font-normal text-fg/30 hover:text-fg/60 transition-colors duration-400 leading-none"
            style={{ fontSize: 'clamp(1.1rem, 1.8vw, 1.5rem)' }}
          >
            {phone}
          </a>
        </div>

      </div>

      {/* Reel strip — anchored to footer bottom */}
      <div className="shrink-0">
        <ReelStripV2 />
      </div>
    </footer>
  )
}
