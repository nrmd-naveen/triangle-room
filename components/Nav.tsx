'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const NAV_LINKS = [
  { label: 'Work',    href: '/works'   },
  { label: 'About',   href: '#about'  },
  { label: 'Contact', href: '#contact'},
] as const

interface NavProps {
  isLoaded: boolean
}

export default function Nav({ isLoaded }: NavProps) {
  const [onDark, setOnDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Track scroll depth for bg
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Flip text colour when nav overlaps dark sections.
  // #work is GSAP-pinned so we compare window.scrollY against the pin trigger's
  // start/end scroll positions instead of relying on bounding rects or
  // ScrollTrigger callbacks (both unreliable for pinned elements).
  useEffect(() => {
    if (!isLoaded) return

    const NAV_H = 60

    const update = () => {
      // ── #directors: dark section before work (bounding rect) ────────────
      const directorsEl = document.querySelector<HTMLElement>('#directors')
      const inDirectors = !!directorsEl && (() => {
        const r = directorsEl.getBoundingClientRect()
        return r.top <= NAV_H && r.bottom > NAV_H
      })()

      // ── From #work onwards: no light sections follow, stay dark ──────────
      const workEl = document.querySelector<HTMLElement>('#work')
      let pastWorkStart = false
      if (workEl) {
        const pinST = ScrollTrigger.getAll().find((st) => st.trigger === workEl)
        const workStart = pinST ? pinST.start : workEl.offsetTop
        pastWorkStart = window.scrollY >= workStart - NAV_H
      }

      setOnDark(inDirectors || pastWorkStart)
    }

    window.addEventListener('scroll', update, { passive: true })
    update() // run once on mount so initial state is correct
    return () => window.removeEventListener('scroll', update)
  }, [isLoaded])

  const textColor  = onDark ? 'text-fg/80'   : 'text-ink/80'
  const linkColor  = onDark ? 'text-fg/40 hover:text-fg' : 'text-muted hover:text-ink'
  const bgClass    = scrolled && !onDark
    ? 'bg-bg/90 backdrop-blur-md border-b border-border'
    : 'bg-transparent'

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-12 py-5 transition-colors duration-500 ${bgClass}`}
      initial={{ opacity: 0, y: -16 }}
      animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
      transition={{ duration: 0.9, ease }}
    >
      <span className={`font-mono text-[11px] tracking-[0.32em] uppercase transition-colors duration-500 ${textColor}`}>
        Triangle Room
      </span>

      <nav className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className={`font-mono text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 ${linkColor}`}
          >
            {label}
          </a>
        ))}
      </nav>
    </motion.header>
  )
}
