'use client'

/**
 * StatsCardsV1 — "Number Burst"
 *
 * Light blue-tinted cards on the paper section bg.
 * On hover the large stat number physically escapes the card frame upward.
 *
 * Why light cards:
 *   The section bg is light (#F3F4F0). Dark cards create jarring contrast and
 *   the popped number (needing contrast against the page bg) is invisible if
 *   it's light-colored. Dark ink numbers on light cards are always readable
 *   whether inside the card or floating above it.
 *
 * Blue palette (from hero triangle mist):
 *   Card bg:     cool blue-white gradient (#EDF1F7 → #E6EBF3)
 *   Border:      rgba(94,130,174, …) — same family as hero mist
 *   Glow:        radial overlay on card top, same blue family
 *   Labels:      blue-grey text
 *   Accent line: green (#157A50)
 */

import { useState } from 'react'

const STATS = [
  {
    num:     '18',
    sup:     '+',
    label:   'Years in post',
    context: 'Anu Kamala — series and film editor across Netflix, National Geographic, Discovery Channel, and Olympic Channel.',
  },
  {
    num:     '38',
    sup:     '+',
    label:   'Years combined',
    context: 'Three careers in broadcast, streaming, audio and ad film — assembled in one room for the first time.',
  },
  {
    num:     '60',
    sup:     '+',
    label:   'Credited productions',
    context: 'Documentary, reality, sports, travel and ad film for major streaming and broadcast platforms worldwide.',
  },
]

const POP_AMT = 52     // px the number escapes above the card
const NUM_H   = 148    // approx rendered height of the number text
const CARD_H  = 260    // card body height

// Card bg colors
const CARD_BG       = 'linear-gradient(155deg, #EDF1F7 0%, #E6EBF3 50%, #EBF0F6 100%)'
const CARD_BG_HOVER = 'linear-gradient(155deg, #E0E8F4 0%, #D8E3EF 50%, #E0E8F4 100%)'

export default function StatsCardsV1() {
  const [hovered, setHovered] = useState<number | null>(null)

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  const animate = !prefersReduced

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        // Headroom above cards for the number pop — cards sit below this padding
        paddingTop: POP_AMT + 16,
        alignItems: 'flex-start',
      }}
    >
      {STATS.map((s, i) => {
        const isHovered    = hovered === i
        const isAnyHovered = hovered !== null

        return (
          <div
            key={s.label}
            style={{
              flex: 1,
              position: 'relative',
              height: CARD_H,
              overflow: 'visible',   // number can escape upward
              cursor: 'default',
              zIndex: isHovered ? 10 : 1,
              // Dim siblings by reducing opacity (light cards → they fade slightly)
              opacity: animate && isAnyHovered && !isHovered ? 0.48 : 1,
              transform: animate && isAnyHovered && !isHovered
                ? 'translateY(6px) scale(0.975)'
                : 'translateY(0) scale(1)',
              transition: animate ? 'opacity 0.40s ease, transform 0.40s ease' : 'none',
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >

            {/* ── Large number — z-index 5, sibling to card-visual ─────────
                Positioned at top of card wrapper. Since wrapper is overflow:
                visible, translateY(-POP_AMT) lifts it into the paddingTop space
                above the card, where it reads clearly against the light section bg.
            */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: NUM_H,
                display: 'flex',
                alignItems: 'flex-end',
                paddingLeft: 22,
                paddingBottom: 6,
                zIndex: 5,
                transform: animate && isHovered
                  ? `translateY(-${POP_AMT}px) scale(1.06)`
                  : 'translateY(0) scale(1)',
                transition: animate
                  ? 'transform 0.64s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'none',
                transformOrigin: 'bottom left',
                willChange: 'transform',
                pointerEvents: 'none',
              }}
            >
              {/* Number — dark ink, always visible on both light card and light bg */}
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 300,
                  fontSize: 'clamp(5.2rem, 9vw, 7.8rem)',
                  letterSpacing: '-0.045em',
                  lineHeight: 1,
                  color: '#141714',
                }}
              >
                {s.num}
              </span>
              <sup
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 400,
                  fontSize: '0.30em',
                  color: '#157A50',
                  alignSelf: 'flex-start',
                  marginTop: '0.52em',
                  marginLeft: '0.06em',
                  lineHeight: 1,
                }}
              >
                {s.sup}
              </sup>
            </div>

            {/* Gradient bridge — rides with number, blends into card bg color */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: NUM_H - 64, left: 0, right: 0, height: 72,
                // Fade from transparent → section bg color (where number lands above card)
                background: 'linear-gradient(to bottom, transparent, #EAEEf4)',
                zIndex: 6,
                pointerEvents: 'none',
                transform: animate && isHovered
                  ? `translateY(-${POP_AMT}px)`
                  : 'translateY(0)',
                transition: animate
                  ? 'transform 0.64s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  : 'none',
              }}
            />

            {/* ── Card visual — light blue-tinted, clips own bg ────────────── */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 4,
                overflow: 'hidden',
                zIndex: 1,
                background: isHovered ? CARD_BG_HOVER : CARD_BG,
                border: isHovered
                  ? '1px solid rgba(94,130,174,0.45)'
                  : '1px solid rgba(94,130,174,0.18)',
                boxShadow: isHovered
                  ? '0 24px 60px rgba(80,110,160,0.18), 0 2px 12px rgba(80,110,160,0.10)'
                  : '0 4px 16px rgba(80,110,160,0.08)',
                transition: animate
                  ? 'background 0.40s ease, border-color 0.40s ease, box-shadow 0.40s ease'
                  : 'none',
              }}
            >
              {/* Blue atmospheric glow — top of card */}
              <div
                aria-hidden
                style={{
                  position: 'absolute', inset: 0,
                  background: isHovered
                    ? 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(94,130,174,0.18) 0%, transparent 70%)'
                    : 'radial-gradient(ellipse 100% 55% at 50% 0%, rgba(94,130,174,0.08) 0%, transparent 70%)',
                  transition: animate ? 'background 0.45s ease' : 'none',
                  pointerEvents: 'none',
                }}
              />

              {/* Bottom info */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  padding: '0 22px 22px',
                }}
              >
                {/* Accent line */}
                <div
                  style={{
                    width: isHovered ? 38 : 18, height: 1.5,
                    background: '#157A50', opacity: 0.80, marginBottom: 12,
                    transition: animate ? 'width 0.38s ease' : 'none',
                  }}
                />

                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem', letterSpacing: '0.30em',
                    textTransform: 'uppercase',
                    color: isHovered
                      ? 'rgba(20,23,20,0.62)'
                      : 'rgba(20,23,20,0.38)',
                    transition: animate ? 'color 0.35s ease' : 'none',
                    marginBottom: 0,
                  }}
                >
                  {s.label}
                </p>

                {/* Context — slides in on hover */}
                <div
                  style={{
                    maxHeight: animate && isHovered ? 90 : 0,
                    overflow: 'hidden',
                    transition: animate
                      ? 'max-height 0.48s cubic-bezier(0.4, 0, 0.2, 1)'
                      : 'none',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.72rem', lineHeight: 1.65,
                      color: 'rgba(20,23,20,0.45)',
                      marginTop: 10,
                    }}
                  >
                    {s.context}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
