'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// initX / initRot: resting offset so lines look casually placed, not stacked on a grid
// y / x / rotation: final position when scrolled — more dramatic, each line goes its own way
const LINES = [
  { text: 'New company.',                     bgL: -20, bgR: -44, initX:  -14, initRot: -2.2, y: 480, x: -120, rotation: -14, origin: '25% 50%' },
  { text: 'Not new at this.',                 bgL: -16, bgR: -28, initX:   22, initRot:  1.6, y: 580, x:  130, rotation:  18, origin: '72% 50%' },
  { text: 'Three careers. One company.',      bgL: -28, bgR: -56, initX:  -10, initRot: -1.0, y: 680, x:  -90, rotation: -22, origin: '18% 50%' },
  { text: "Very little we haven't shipped.",  bgL: -22, bgR: -40, initX:   18, initRot:  2.4, y: 780, x:  110, rotation:  20, origin: '80% 50%' },
]

export default function ScatterStatementV1() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lines = sectionRef.current?.querySelectorAll<HTMLElement>('.scatter-line')
    if (!lines?.length) return

    // Apply resting chaos — lines sit slightly tilted and offset, not on a perfect grid
    lines.forEach((line, i) => {
      gsap.set(line, {
        transformOrigin: LINES[i].origin,
        x:        LINES[i].initX,
        rotation: LINES[i].initRot,
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1200',
        scrub: 1.8,
        pin: true,
      },
    })

    // Heading fades out as the first line begins to fall
    const heading = sectionRef.current?.querySelector<HTMLElement>('.scatter-heading')
    if (heading) {
      tl.to(heading, { opacity: 0, y: -16, ease: 'power2.in', duration: 0.3 }, 0)
    }

    lines.forEach((line, i) => {
      const { rotation, y, x } = LINES[i]
      const delay = i * 0.14

      // Fall: accelerates hard, each line flies a different direction
      tl.to(line, {
        y,
        x,
        rotation,
        opacity: 0,
        ease: 'power3.in',
        duration: 1,
      }, delay)

      // Bg peels faster than text — slight dissociation as they fly apart
      const bg = line.querySelector<HTMLElement>('.line-bg')
      if (bg) {
        tl.to(bg, {
          x:        rotation > 0 ? -32 : 32,
          scaleX:   0.82,
          ease:     'power3.in',
          duration: 1,
        }, delay)
      }
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-paper flex items-center justify-center overflow-hidden"
    >
      <div className="text-center w-full px-8">

        <h2
          className="scatter-heading font-display mb-14"
          style={{
            fontSize: 'clamp(1rem, 1.6vw, 1.3rem)',
            fontWeight: 300,
            letterSpacing: '0.01em',
            color: 'rgba(13,13,11,0.30)',
          }}
        >
          Where we've been. What we've built.
        </h2>

        <div className="flex flex-col items-center" style={{ gap: '0.72em' }}>
          {LINES.map((line, i) => (
            <div
              key={i}
              className="scatter-line relative will-change-transform"
              style={{ zIndex: LINES.length - i }}
            >
              {/* Green card bg — bleeds asymmetrically, casts a real shadow for physical depth */}
              <span
                className="line-bg absolute inset-y-0 pointer-events-none will-change-transform"
                style={{
                  left:       `${line.bgL}px`,
                  right:      `${line.bgR}px`,
                  background: 'linear-gradient(180deg, #136644 0%, #0D4A31 45%, #093321 100%)',
                  boxShadow:  '0 8px 32px rgba(13,74,49,0.22), 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.12)',
                  borderRadius: '2px',
                  zIndex:     -1,
                }}
              />

              {/* Text — light on green, tight tracking for label feel */}
              <span
                className="line-text relative font-display select-none"
                style={{
                  fontSize:      'clamp(2.4rem, 6vw, 5.2rem)',
                  fontWeight:    700,
                  lineHeight:    1.15,
                  letterSpacing: '-0.03em',
                  display:       'block',
                  padding:       '0.08em 0.5em',
                  color:         '#F3F4F0',
                  textShadow:    '0 1px 3px rgba(0,0,0,0.20)',
                  zIndex:        0,
                  whiteSpace:    'nowrap',
                }}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
