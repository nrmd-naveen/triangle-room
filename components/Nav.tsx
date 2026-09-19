'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import MobileMenuPanel from './MobileMenuPanel'

gsap.registerPlugin(ScrollTrigger)

const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

const NAV_LINKS = [
  { label: 'Work',    href: '/works'   },
  { label: 'About',   href: '#about'  },
  { label: 'Contact', href: '#contact'},
] as const

interface NavProps {
  isLoaded: boolean
  /** Skip the scroll-based dark/light detection and always use the dark (light-on-ink) treatment — for pages that are dark top to bottom. */
  forceDark?: boolean
}

export default function Nav({ isLoaded, forceDark = false }: NavProps) {
  const [onDark, setOnDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

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
    if (!isLoaded || forceDark) return

    const update = () => {
      // Actual rendered height, since the bar is ~68px on mobile/tablet
      // and 90px from the lg breakpoint up.
      const navH = headerRef.current?.offsetHeight ?? 90

      // ── #directors: dark section before work (bounding rect) ────────────
      const directorsEl = document.querySelector<HTMLElement>('#directors')
      const inDirectors = !!directorsEl && (() => {
        const r = directorsEl.getBoundingClientRect()
        return r.top <= navH && r.bottom > navH
      })()

      // ── From #work onwards: no light sections follow, stay dark ──────────
      const workEl = document.querySelector<HTMLElement>('#work')
      let pastWorkStart = false
      if (workEl) {
        const pinST = ScrollTrigger.getAll().find((st) => st.trigger === workEl)
        const workStart = pinST ? pinST.start : workEl.offsetTop
        pastWorkStart = window.scrollY >= workStart - navH
      }

      setOnDark(inDirectors || pastWorkStart)
    }

    window.addEventListener('scroll', update, { passive: true })
    update() // run once on mount so initial state is correct
    return () => window.removeEventListener('scroll', update)
  }, [isLoaded, forceDark])

  const dark = forceDark || onDark

  // The mobile overlay always sits on a dark panel, so force the light
  // logo/hamburger treatment while it's open regardless of scroll position.
  const showLight  = dark || menuOpen
  const linkColor  = dark ? 'text-fg/40 hover:text-fg' : 'text-muted hover:text-ink'
  const lineColor  = menuOpen ? 'bg-fg' : showLight ? 'bg-fg/80' : 'bg-ink/80'
  const bgClass    = scrolled && !dark
    ? 'bg-bg/90 backdrop-blur-md border-b border-border'
    : 'bg-transparent'

  return (
    <>
      <motion.header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 lg:py-0 transition-colors duration-500 ${bgClass}`}
        initial={{ opacity: 0, y: -16 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.9, ease }}
      >
        <a
          href="/"
          className="relative block h-9 sm:h-11 lg:h-[90px] aspect-[5.17] shrink-0"
          aria-label="Triangle Room — home"
          onClick={() => setMenuOpen(false)}
        >
          <img
            src="/brand/wordmark-black.svg"
            alt=""
            className="absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500"
            style={{ opacity: showLight ? 0 : 0.8 }}
          />
          <img
            src="/brand/wordmark-white.svg"
            alt="Triangle Room"
            className="absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-500"
            style={{ opacity: showLight ? 0.8 : 0 }}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-16">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className={`font-display font-medium text-[14px] tracking-[0.12em] uppercase transition-colors duration-300 ${linkColor}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="relative z-[60] flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`block h-px w-5 transition-all duration-300 ${lineColor}`}
            style={{ transform: menuOpen ? 'translateY(3px) rotate(45deg)' : 'none' }}
          />
          <span
            className={`block h-px w-5 transition-all duration-300 ${lineColor}`}
            style={{ transform: menuOpen ? 'translateY(-3px) rotate(-45deg)' : 'none' }}
          />
        </button>
      </motion.header>

      <MobileMenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} links={NAV_LINKS} />
    </>
  )
}
