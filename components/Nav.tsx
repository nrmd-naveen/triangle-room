'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (!isLoaded) return
    const NAV_H = 60
    const update = () => {
      const directorsEl = document.querySelector<HTMLElement>('#directors')
      const inDirectors = !!directorsEl && (() => {
        const r = directorsEl.getBoundingClientRect()
        return r.top <= NAV_H && r.bottom > NAV_H
      })()
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
    update()
    return () => window.removeEventListener('scroll', update)
  }, [isLoaded])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const textColor  = menuOpen ? 'text-fg/80' : (onDark ? 'text-fg/80' : 'text-ink/80')
  const linkColor  = onDark ? 'text-fg/40 hover:text-fg' : 'text-muted hover:text-ink'
  const bgClass    = menuOpen
    ? 'bg-ink'
    : scrolled && !onDark
      ? 'bg-bg/90 backdrop-blur-md border-b border-border'
      : 'bg-transparent'

  const barColor = menuOpen || onDark ? 'bg-fg/70' : 'bg-ink/70'

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-colors duration-500 ${bgClass}`}
        initial={{ opacity: 0, y: -16 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.9, ease }}
      >
        <span className={`font-mono text-[11px] tracking-[0.32em] uppercase transition-colors duration-500 ${textColor}`}>
          Triangle Room
        </span>

        {/* Desktop nav */}
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-end gap-[5px] w-8 h-8 -mr-1"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span
            className={`block h-px transition-all duration-300 origin-center ${barColor}`}
            style={{
              width: 20,
              transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
            }}
          />
          <span
            className={`block w-3 h-px transition-all duration-300 ${barColor}`}
            style={{ opacity: menuOpen ? 0 : 1, transform: menuOpen ? 'scaleX(0)' : 'none' }}
          />
          <span
            className={`block h-px transition-all duration-300 origin-center ${barColor}`}
            style={{
              width: menuOpen ? 20 : 14,
              transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
            }}
          />
        </button>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-ink md:hidden flex flex-col justify-center px-8"
          >
            {/* Label */}
            <p className="font-mono text-[9px] tracking-[0.5em] uppercase mb-14"
               style={{ color: 'rgba(245,244,240,0.18)' }}>
              Navigate
            </p>

            {/* Links */}
            <nav className="flex flex-col gap-8">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 + 0.08, duration: 0.38, ease: 'easeOut' }}
                  className="font-display text-fg/75 hover:text-fg transition-colors duration-300 leading-none"
                  style={{ fontSize: 'clamp(2.6rem, 11vw, 3.8rem)', fontWeight: 300, letterSpacing: '-0.025em' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </motion.a>
              ))}
            </nav>

            {/* Footer contact */}
            <div className="absolute bottom-10 left-8 right-8">
              <div className="h-px bg-edge mb-6" />
              <a
                href="mailto:connect@triangleroom.in"
                className="block font-mono text-[9px] tracking-[0.2em] mb-1.5 transition-colors duration-300"
                style={{ color: 'rgba(245,244,240,0.30)' }}
                onClick={() => setMenuOpen(false)}
              >
                connect@triangleroom.in
              </a>
              <p className="font-mono text-[9px] tracking-[0.28em] uppercase" style={{ color: 'rgba(245,244,240,0.16)' }}>
                Trivandrum · Kerala
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
