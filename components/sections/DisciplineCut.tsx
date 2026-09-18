'use client'

/**
 * DisciplineCut — The Edit Room
 *
 * Each discipline fills the entire screen as a single word — then cuts.
 * Hard edits triggered by scroll-position thresholds. Film sprocket strips
 * frame the viewport. Timecode in corner.
 *
 * Real R2 stills sit as full-bleed atmospheric backgrounds at low opacity —
 * they swap on the same cut as the label, so you're always looking at an
 * actual frame from a project in that genre.
 *
 * Scroll behaviour: section pins for N × 280px. ScrollTrigger.onUpdate
 * fires on every scroll tick; we derive the active discipline from progress
 * and cut to it with a brief white-flash overlay — mimicking a flash frame.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'

const DISCIPLINES = [
  {
    label:   'Documentary',
    accent:  '#c9a96e',
    code:    'DOC',
    project: 'Tarini · Natl. Geographic',
    img:     `${R2}/Tarini/01.jpg`,
  },
  {
    label:   'Reality',
    accent:  '#d94a4a',
    code:    'RLT',
    project: 'Fabulous Lives · Netflix',
    img:     `${R2}/Bollywood%20wives/01.jpg`,
  },
  {
    label:   'Live Sports',
    accent:  '#4a90d9',
    code:    'LIV',
    project: 'India vs Pakistan · Star Sports',
    img:     `${R2}/India%20vs%20Pak/01.jpg`,
  },
  {
    label:   'Music',
    accent:  '#9b6ed4',
    code:    'MUS',
    project: 'Sound Trek',
    img:     `${R2}/Sound%20trek/01.jpg`,
  },
  {
    label:   'Fiction',
    accent:  '#157A50',
    code:    'FIC',
    project: 'Kurup',
    img:     `${R2}/Kurup/01.jpg`,
  },
  {
    label:   'Ad-Film',
    accent:  '#d97a3a',
    code:    'ADV',
    project: 'Red Bull',
    img:     `${R2}/redbull/01.jpg`,
  },
  {
    label:   'Post',
    accent:  '#4abcd9',
    code:    'PST',
    project: 'F1 After Movie · Abu Dhabi GP',
    img:     `${R2}/F1%20After%20movie/01.jpg`,
  },
  {
    label:   'Audio Drama',
    accent:  '#6a8bd4',
    code:    'AUD',
    project: 'Midwicket Tales',
    img:     `${R2}/Midwicket%20tales/01.jpg`,
  },
]

const N           = DISCIPLINES.length
const PIN_DISTANCE = N * 280

function toTC(frameIndex: number) {
  const f = frameIndex % 24
  const s = Math.floor(frameIndex / 24) % 60
  const m = Math.floor(frameIndex / 24 / 60) % 60
  return `01:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`
}

export default function DisciplineCut() {
  const sectionRef  = useRef<HTMLElement>(null)
  const flashRef    = useRef<HTMLDivElement>(null)
  const labelRefs   = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs     = useRef<(HTMLDivElement | null)[]>([])
  const accentRef   = useRef<HTMLDivElement>(null)
  const tcRef       = useRef<HTMLSpanElement>(null)
  const codeRef     = useRef<HTMLSpanElement>(null)
  const projectRef  = useRef<HTMLSpanElement>(null)
  const idxRef      = useRef(-1)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Reduced-motion: show all in a list
    if (prefersReduced) {
      labelRefs.current.forEach(el => {
        if (el) gsap.set(el, { opacity: 1, position: 'relative', display: 'block' })
      })
      imgRefs.current.forEach(el => { if (el) gsap.set(el, { opacity: 0.14 }) })
      return
    }

    // Init: only first discipline visible
    gsap.set(labelRefs.current, { opacity: 0, y: 0 })
    gsap.set(labelRefs.current[0], { opacity: 1 })
    gsap.set(imgRefs.current, { opacity: 0 })
    gsap.set(imgRefs.current[0], { opacity: 0.16 })
    idxRef.current = 0

    if (accentRef.current)  accentRef.current.style.background  = DISCIPLINES[0].accent
    if (projectRef.current) projectRef.current.textContent       = DISCIPLINES[0].project

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start:   'top top',
      end:     `+=${PIN_DISTANCE}`,
      pin:     true,
      onUpdate: self => {
        const newIdx = Math.min(N - 1, Math.floor(self.progress * N))
        if (newIdx === idxRef.current) return

        const prev = idxRef.current
        idxRef.current = newIdx

        // Flash frame
        gsap.killTweensOf(flashRef.current)
        gsap.fromTo(
          flashRef.current,
          { opacity: 0.65 },
          { opacity: 0, duration: 0.26, ease: 'power2.out' }
        )

        // Swap label
        if (prev >= 0 && prev < N) gsap.set(labelRefs.current[prev], { opacity: 0 })
        gsap.fromTo(
          labelRefs.current[newIdx],
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.24, ease: 'power3.out' }
        )

        // Swap background image
        if (prev >= 0 && prev < N) gsap.to(imgRefs.current[prev], { opacity: 0, duration: 0.2 })
        gsap.to(imgRefs.current[newIdx], { opacity: 0.16, duration: 0.3 })

        // Accent + metadata
        if (accentRef.current)  accentRef.current.style.background  = DISCIPLINES[newIdx].accent
        if (tcRef.current)      tcRef.current.textContent             = toTC(newIdx * 72)
        if (codeRef.current)    codeRef.current.textContent           = DISCIPLINES[newIdx].code
        if (projectRef.current) projectRef.current.textContent        = DISCIPLINES[newIdx].project
      },
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="disciplines"
      aria-label="What we make"
      className="relative overflow-hidden"
      style={{ height: '100svh', background: '#0D0D0B' }}
    >
      {/* Full-bleed background images — one per discipline, low opacity, swap on cut */}
      {DISCIPLINES.map((disc, i) => (
        <div
          key={`bg-${disc.label}`}
          ref={el => { imgRefs.current[i] = el }}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:    `url(${disc.img})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            opacity:            i === 0 ? 0.16 : 0,
            zIndex:             1,
          }}
        />
      ))}

      {/* Dark vignette over image */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(13,13,11,0.35) 0%, rgba(13,13,11,0.80) 100%)',
          zIndex: 2,
        }}
      />

      {/* Flash-frame overlay */}
      <div
        ref={flashRef}
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: '#F5F4F0', zIndex: 50, opacity: 0 }}
      />

      {/* Film sprockets */}
      <Sprocket position="top" />
      <Sprocket position="bottom" />

      {/* Top-left label */}
      <div
        aria-hidden
        className="absolute font-mono uppercase pointer-events-none select-none"
        style={{ top: 36, left: 44, fontSize: 9, letterSpacing: '0.42em', color: 'rgba(245,244,240,0.22)', zIndex: 20 }}
      >
        What We Make
      </div>

      {/* Top-right: timecode */}
      <div
        aria-hidden
        className="absolute font-mono pointer-events-none select-none"
        style={{ top: 36, right: 44, fontSize: 10, letterSpacing: '0.1em', color: 'rgba(245,244,240,0.18)', zIndex: 20 }}
      >
        <span ref={tcRef}>{toTC(0)}</span>
      </div>

      {/* Discipline labels */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 10 }}
        aria-live="polite"
      >
        {DISCIPLINES.map((disc, i) => (
          <div
            key={disc.label}
            ref={el => { labelRefs.current[i] = el }}
            className="absolute font-display text-center select-none will-change-transform"
            style={{
              fontSize:      'clamp(52px, 11.5vw, 158px)',
              fontWeight:    300,
              letterSpacing: '-0.04em',
              lineHeight:    1,
              color:         '#F5F4F0',
              opacity:       i === 0 ? 1 : 0,
            }}
          >
            {disc.label}
          </div>
        ))}
      </div>

      {/* Accent line */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ bottom: '22%', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}
      >
        <div ref={accentRef} style={{ width: 28, height: 1.5, background: DISCIPLINES[0].accent }} />
      </div>

      {/* Project name — sub-label beneath accent */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{ bottom: 'calc(22% - 22px)', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}
      >
        <span
          ref={projectRef}
          className="font-mono"
          style={{ fontSize: 9, letterSpacing: '0.22em', color: 'rgba(245,244,240,0.3)', textTransform: 'uppercase' }}
        >
          {DISCIPLINES[0].project}
        </span>
      </div>

      {/* Bottom-left: format code */}
      <div
        aria-hidden
        className="absolute font-mono pointer-events-none select-none"
        style={{ bottom: 36, left: 44, fontSize: 9, letterSpacing: '0.32em', color: 'rgba(245,244,240,0.2)', zIndex: 20 }}
      >
        <span ref={codeRef}>{DISCIPLINES[0].code}</span>
      </div>

      {/* Bottom-right: total */}
      <div
        aria-hidden
        className="absolute font-mono pointer-events-none select-none"
        style={{ bottom: 36, right: 44, fontSize: 9, letterSpacing: '0.28em', color: 'rgba(245,244,240,0.14)', zIndex: 20 }}
      >
        {String(N).padStart(2, '0')} Formats
      </div>
    </section>
  )
}

function Sprocket({ position }: { position: 'top' | 'bottom' }) {
  const holes = Array.from({ length: 30 })
  return (
    <div
      aria-hidden
      className="absolute left-0 right-0 flex items-center overflow-hidden pointer-events-none select-none"
      style={{
        [position]: 0,
        height:      26,
        background:  '#090908',
        borderTop:    position === 'bottom' ? '1px solid rgba(245,244,240,0.04)' : undefined,
        borderBottom: position === 'top'    ? '1px solid rgba(245,244,240,0.04)' : undefined,
        zIndex:      15,
        padding:     '0 2px',
      }}
    >
      {holes.map((_, i) => (
        <div
          key={i}
          style={{
            flexShrink:   0,
            width:        13,
            height:       9,
            borderRadius: 2,
            background:   '#181816',
            border:       '1px solid rgba(245,244,240,0.05)',
            margin:       '0 5px',
          }}
        />
      ))}
    </div>
  )
}
