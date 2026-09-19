'use client'

import { useEffect, useState } from 'react'
import ScrollTrigger from 'gsap/ScrollTrigger'

/**
 * Tracks whether the viewport is currently over a dark section, so the fixed
 * nav/brand mark can flip between light-on-dark and dark-on-light treatments.
 * Shared between Nav and BrandMark so both react to the same scroll state.
 */
export function useOnDarkSection(isLoaded: boolean, forceDark = false): boolean {
  const [onDark, setOnDark] = useState(false)

  useEffect(() => {
    if (!isLoaded || forceDark) return

    const update = () => {
      // Actual rendered nav height: ~60px on mobile/tablet, 96px from lg up.
      const navH = window.matchMedia('(min-width: 1024px)').matches ? 96 : 60

      const directorsEl = document.querySelector<HTMLElement>('#directors')
      const inDirectors = !!directorsEl && (() => {
        const r = directorsEl.getBoundingClientRect()
        return r.top <= navH && r.bottom > navH
      })()

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
    update()
    return () => window.removeEventListener('scroll', update)
  }, [isLoaded, forceDark])

  return forceDark || onDark
}
