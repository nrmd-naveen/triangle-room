'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import TRMark from './TRMark'

// Studio coordinates as they appear in the minimal lockup (Logo_short_white).
export const STUDIO_COORDINATES = { lat: '08°29\'56"', lon: '76°57\'10"' }

interface BrandMarkProps {
  /** 'intro' plays the roll-over + glyph reveal, big and centered. 'docked' renders the finished mark, small, top-left. */
  mode: 'intro' | 'docked'
  /** Light-on-dark vs dark-on-light treatment when docked (ignored in 'intro', which always sits on the dark preloader). */
  dark?: boolean
  /** Fires once the coordinates have locked and the glyph has fully drawn in — cue to dock the mark. */
  onFormed?: () => void
  onClick?: () => void
}

/** Rolls a single character through random digits before settling on its final value. */
function animateChar(el: HTMLSpanElement, final: string, startDelay: number, onSettle: () => void) {
  const tl = gsap.timeline({ delay: startDelay })
  tl.set(el, { opacity: 1 })

  if (/[0-9]/.test(final)) {
    const flips = 15 + Math.floor(Math.random() * 5)
    for (let i = 0; i < flips; i++) {
      // Growing gaps between flips read as the reel decelerating into its final digit.
      const gap = 0.05 + (i / flips) * 0.16
      tl.call(
        () => { el.textContent = String(Math.floor(Math.random() * 10)) },
        undefined,
        i === 0 ? 0 : `+=${gap}`
      )
    }
    tl.call(() => { el.textContent = final; onSettle() }, undefined, '+=0.18')
  } else {
    tl.call(() => { el.textContent = final; onSettle() }, undefined, '+=0.05')
  }

  return tl
}

const BrandMark = forwardRef<HTMLAnchorElement, BrandMarkProps>(function BrandMark(
  { mode, dark = true, onFormed, onClick },
  forwardedRef
) {
  const rootRef = useRef<HTMLAnchorElement>(null)
  const markWrapRef = useRef<HTMLDivElement>(null)
  const latRefs = useRef<(HTMLSpanElement | null)[]>([])
  const lonRefs = useRef<(HTMLSpanElement | null)[]>([])
  const latHemiRef = useRef<HTMLSpanElement>(null)
  const lonHemiRef = useRef<HTMLSpanElement>(null)

  useImperativeHandle(forwardedRef, () => rootRef.current as HTMLAnchorElement)

  useGSAP(() => {
    if (mode !== 'intro') return

    const root = rootRef.current
    const path = markWrapRef.current?.querySelector<SVGPathElement>('.tr-mark-path')
    if (!root || !path) return

    const latEls = latRefs.current.filter((el): el is HTMLSpanElement => !!el)
    const lonEls = lonRefs.current.filter((el): el is HTMLSpanElement => !!el)
    const hemiEls = [latHemiRef.current, lonHemiRef.current].filter((el): el is HTMLSpanElement => !!el)

    gsap.set(path, { attr: { stroke: 'currentColor', 'stroke-width': 3, 'fill-opacity': 0, 'stroke-opacity': 0 } })

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([...latEls, ...lonEls, ...hemiEls], { opacity: 1 })
      gsap.set(path, { attr: { 'fill-opacity': 1, 'stroke-opacity': 0 } })
      const t = setTimeout(() => onFormed?.(), 400)
      return () => clearTimeout(t)
    }

    gsap.set(root, { opacity: 0, y: 10 })
    gsap.set([...latEls, ...lonEls], { opacity: 0 })
    gsap.set(hemiEls, { opacity: 0 })

    gsap.to(root, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    gsap.to(hemiEls, { opacity: 1, duration: 0.5, delay: 0.35, ease: 'power2.out' })

    let settled = 0
    const total = latEls.length + lonEls.length
    const onSettle = () => {
      settled += 1
      if (settled !== total) return

      // Coordinates locked — the glyph draws in: outline flashes on, then fills solid.
      gsap.timeline()
        .to(path, { attr: { 'stroke-opacity': 0.85 }, duration: 0.25, ease: 'power2.out' })
        .to(path, { attr: { 'fill-opacity': 1 }, duration: 1.1, ease: 'power2.inOut' }, '+=0.05')
        .to(path, { attr: { 'stroke-opacity': 0, 'stroke-width': 0 }, duration: 0.5, ease: 'power2.out' }, '-=0.5')
        .call(() => onFormed?.(), undefined, '+=0.35')
    }

    const maxLen = Math.max(STUDIO_COORDINATES.lat.length, STUDIO_COORDINATES.lon.length)
    for (let i = 0; i < maxLen; i++) {
      const stagger = 0.7 + i * 0.18
      if (latEls[i]) animateChar(latEls[i], STUDIO_COORDINATES.lat[i], stagger, onSettle)
      if (lonEls[i]) animateChar(lonEls[i], STUDIO_COORDINATES.lon[i], stagger + 0.05, onSettle)
    }
  }, [mode])

  const colorClass = mode === 'docked' ? (dark ? 'text-fg' : 'text-ink') : 'text-fg'
  const positionClass =
    mode === 'intro'
      ? 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none'
      : 'fixed left-5 sm:left-8 lg:left-10 top-3 sm:top-4 lg:top-5'
  const glyphSize =
    mode === 'intro'
      ? 'h-[22vw] max-h-[190px] sm:h-[16vw] sm:max-h-[160px]'
      : 'h-9 sm:h-10 lg:h-14'
  const textSize = mode === 'intro' ? 'text-[clamp(13px,2.4vw,24px)]' : 'text-[6px] sm:text-[6.5px] lg:text-[8px]'

  return (
    <a
      ref={rootRef}
      href="/"
      aria-label="Triangle Room — Home"
      onClick={onClick}
      className={`z-[110] inline-flex items-end gap-x-2 sm:gap-x-3 ${positionClass} ${colorClass} transition-colors duration-500`}
    >
      <div ref={markWrapRef} className={`${glyphSize} [&_path]:fill-current`}>
        <TRMark className="h-full w-auto" />
      </div>

      <div className={`flex flex-col items-start font-mono leading-none ${textSize}`}>
        <div className="flex items-baseline gap-1">
          {STUDIO_COORDINATES.lat.split('').map((c, i) => (
            <span key={i} ref={(el) => { latRefs.current[i] = el }} className="inline-block">{c}</span>
          ))}
          <span ref={latHemiRef} className="font-bold">N</span>
        </div>
        <div className="flex items-baseline gap-1">
          {STUDIO_COORDINATES.lon.split('').map((c, i) => (
            <span key={i} ref={(el) => { lonRefs.current[i] = el }} className="inline-block">{c}</span>
          ))}
          <span ref={lonHemiRef} className="font-bold">E</span>
        </div>
      </div>
    </a>
  )
})

export default BrandMark
