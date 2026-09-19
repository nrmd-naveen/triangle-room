'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import MobileMenuPanel from './MobileMenuPanel'
import BrandMark from './BrandMark'
import { useOnDarkSection } from '@/lib/useOnDarkSection'

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
  /** Skip rendering the brand mark here — for the home page, where it's animated in from the preloader and docks into this slot itself. */
  renderMark?: boolean
}

export default function Nav({ isLoaded, forceDark = false, renderMark = true }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const dark = useOnDarkSection(isLoaded, forceDark)

  // Track scroll depth for bg
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 transition-colors duration-500 ${bgClass}`}
        initial={{ opacity: 0, y: -16 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.9, ease }}
      >
        {/* Reserves the brand mark's footprint so the links/hamburger stay put — the
            mark itself is fixed-positioned (see BrandMark) so it can dock into this
            exact spot from the preloader animation without being clipped by the header. */}
        <span aria-hidden className="block h-9 sm:h-10 lg:h-14 w-[70px] sm:w-[80px] lg:w-[110px] shrink-0" />
        {renderMark && <BrandMark mode="docked" dark={dark} onClick={() => setMenuOpen(false)} />}

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
