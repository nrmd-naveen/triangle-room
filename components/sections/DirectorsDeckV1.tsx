'use client'

/**
 * DirectorsDeckV1 — "Burst Pop"
 *
 * Three founder cards in a horizontal row. On hover the portrait physically
 * escapes the card frame upward (overflow: visible on wrapper, card visual is
 * a sibling so it clips only its own bg). Other cards dim + scale back.
 * Below the cards, a minimal stats strip anchors the numbers.
 *
 * Inspired by: game card pop-out hover treatment — adapted for editorial feel.
 */

import { useState } from 'react'
import type { Director } from '@/lib/site-config'

// ─── Default content ────────────────────────────────────────────────────────

const DEFAULT_DIRECTORS: Director[] = [
  {
    name:     'Anu Kamala',
    role:     'Story & Post',
    years:    '18+',
    note:     'Series editor, The Greatest Rivalry. Film editor, Tarini. Best Editor — Asian Television Awards 2019.',
    portrait: 'https://randomuser.me/api/portraits/men/41.jpg',
  },
  {
    name:     'Midhuna Pichy',
    role:     'Production & Delivery',
    years:    '11+',
    note:     'Three seasons of Bigg Boss Malayalam. Episode, post and creative producer across seven international formats.',
    portrait: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    name:     'Jibin Babu',
    role:     'Development & Writing',
    years:    '9+',
    note:     'Writer-director. Pachamarakaikal — two Kerala State Awards. Music Mojo Season 7, Kappa TV.',
    portrait: 'https://randomuser.me/api/portraits/men/47.jpg',
  },
]

const STATS = [
  { num: '18+', label: 'Years in post' },
  { num: '38+', label: 'Years combined' },
  { num: '60+', label: 'Credited productions' },
]

// Card geometry
const CARD_H     = 480   // visible card height (px)
const PORTRAIT_H = 292   // portrait image height (default: fills top of card)
const POP_AMT    = 58    // how far portrait escapes on hover (px)

// ─── Component ───────────────────────────────────────────────────────────────

export default function DirectorsDeckV1({ directors: directorsProp }: { directors?: Director[] }) {
  const DIRECTORS  = directorsProp ?? DEFAULT_DIRECTORS
  const [hovered, setHovered] = useState<number | null>(null)

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  return (
    <section
      style={{
        background: '#141714',
        padding: '100px clamp(2rem, 7vw, 7rem) 80px',
        position: 'relative',
      }}
    >
      {/* Corner marker */}
      <div
        aria-hidden
        style={{
          position: 'absolute', top: 24, right: 32,
          fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
          letterSpacing: '0.38em', color: 'rgba(243,244,240,0.10)',
          pointerEvents: 'none', userSelect: 'none',
        }}
      >02</div>

      {/* ── Section header ─────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 80,
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
              letterSpacing: '0.42em', textTransform: 'uppercase',
              color: 'rgba(243,244,240,0.25)', marginBottom: 18,
            }}
          >
            The three directors
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)', fontWeight: 300,
              fontSize: 'clamp(2.8rem, 5vw, 5.5rem)',
              letterSpacing: '-0.03em', lineHeight: 1.0,
              color: 'rgba(243,244,240,0.90)',
            }}
          >
            Three makers,<br />one room.
          </h2>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-sans)', fontSize: '0.82rem',
            color: 'rgba(243,244,240,0.35)', maxWidth: '22ch',
            lineHeight: 1.75, textAlign: 'right',
          }}
        >
          Combined 38 years across broadcast,<br />streaming and ad film.
        </p>
      </div>

      {/* ── Cards ──────────────────────────────────────────────────────────── */}
      {/*
        paddingTop creates the space for the portrait to pop into.
        Each card wrapper is overflow: visible so the portrait img (a sibling
        to the clipped .card-visual div) can escape upward freely.
      */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          paddingTop: POP_AMT + 10,   // headroom for overflow pop
          alignItems: 'flex-start',
        }}
      >
        {DIRECTORS.map((d, i) => {
          const isHovered    = hovered === i
          const isAnyHovered = hovered !== null
          const animate      = !prefersReduced

          return (
            <div
              key={d.name}
              style={{
                flex: 1,
                position: 'relative',
                height: CARD_H,
                overflow: 'visible',   // portrait can escape this wrapper
                cursor: 'pointer',
                zIndex: isHovered ? 10 : 1,
                opacity: animate && isAnyHovered && !isHovered ? 0.42 : 1,
                transform: animate && isAnyHovered && !isHovered
                  ? 'scale(0.962) translateY(6px)'
                  : 'scale(1) translateY(0)',
                transition: animate ? 'opacity 0.42s ease, transform 0.42s ease' : 'none',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/*
                Portrait image — z-index 5, NOT inside .card-visual so it
                isn't clipped. On hover it translateY upward, escaping the
                card wrapper top into the paddingTop headroom.
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.portrait}
                alt={d.name}
                loading="lazy"
                decoding="async"
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  width: '100%',
                  height: PORTRAIT_H,
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  zIndex: 5,
                  transform: animate && isHovered
                    ? `translateY(-${POP_AMT}px) scale(1.055)`
                    : 'translateY(0) scale(1)',
                  transition: animate
                    ? 'transform 0.62s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : 'none',
                  transformOrigin: 'bottom center',
                  willChange: 'transform',
                }}
              />

              {/* Gradient bridge — rides with the portrait */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: PORTRAIT_H - 76,
                  left: 0, right: 0,
                  height: 84,
                  background: 'linear-gradient(to bottom, transparent, #1C1F1B)',
                  zIndex: 6,
                  pointerEvents: 'none',
                  transform: animate && isHovered
                    ? `translateY(-${POP_AMT}px)`
                    : 'translateY(0)',
                  transition: animate
                    ? 'transform 0.62s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    : 'none',
                }}
              />

              {/* Card visual — clips its own background; portrait is a sibling */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: '#1C1F1B',
                  borderRadius: 4,
                  overflow: 'hidden',
                  zIndex: 1,
                  boxShadow: isHovered
                    ? '0 56px 100px rgba(0,0,0,0.72), 0 0 0 1px rgba(21,122,80,0.30)'
                    : '0 20px 60px rgba(0,0,0,0.48)',
                  transition: animate ? 'box-shadow 0.45s ease' : 'none',
                }}
              >
                {/* Green top hairline — appears on hover */}
                <div
                  aria-hidden
                  style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 1.5,
                    background: '#157A50',
                    opacity: isHovered ? 0.8 : 0,
                    transition: animate ? 'opacity 0.35s ease' : 'none',
                    zIndex: 2,
                  }}
                />

                {/* Info band */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    padding: '0 22px 28px',
                  }}
                >
                  {/* Accent line */}
                  <div
                    style={{
                      width: isHovered ? 38 : 20,
                      height: 1.5,
                      background: '#157A50',
                      opacity: 0.75,
                      marginBottom: 14,
                      transition: animate ? 'width 0.38s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    }}
                  />

                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 400,
                      fontSize: '1.02rem',
                      letterSpacing: '-0.015em',
                      color: '#F3F4F0',
                      marginBottom: 6,
                    }}
                  >
                    {d.name}
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.30em',
                      textTransform: 'uppercase',
                      color: '#157A50',
                      marginBottom: 14,
                    }}
                  >
                    {d.role}
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.72rem',
                      lineHeight: 1.65,
                      color: 'rgba(243,244,240,0.38)',
                      transform: animate && isHovered ? 'translateY(0)' : 'translateY(4px)',
                      opacity: isHovered ? 1 : 0.85,
                      transition: animate ? 'transform 0.38s ease, opacity 0.38s ease' : 'none',
                    }}
                  >
                    {d.note}
                  </p>

                  {/* Years — slides up on hover */}
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: 'rgba(243,244,240,0.22)',
                      marginTop: 14,
                      opacity: isHovered ? 1 : 0,
                      transform: animate && isHovered ? 'translateY(0)' : 'translateY(8px)',
                      transition: animate
                        ? 'opacity 0.32s ease 0.08s, transform 0.32s ease 0.08s'
                        : 'none',
                    }}
                  >
                    {d.years} yrs experience
                  </p>
                </div>
              </div>

              {/* Index label — floats above card on hover */}
              <p
                aria-hidden
                style={{
                  position: 'absolute',
                  top: -22,
                  left: 0,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.48rem',
                  letterSpacing: '0.32em',
                  color: 'rgba(243,244,240,0.22)',
                  zIndex: 8,
                  opacity: isHovered ? 1 : 0,
                  transform: animate && isHovered ? 'translateY(0)' : 'translateY(6px)',
                  transition: animate ? 'opacity 0.3s ease, transform 0.3s ease' : 'none',
                }}
              >
                0{i + 1}
              </p>
            </div>
          )
        })}
      </div>

      {/* ── Stats strip ────────────────────────────────────────────────────── */}
      <div
        style={{
          marginTop: 64,
          paddingTop: 28,
          borderTop: '1px solid rgba(243,244,240,0.06)',
          display: 'flex',
          gap: 'clamp(2rem, 6vw, 5rem)',
        }}
      >
        {STATS.map((s) => (
          <div key={s.num}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                letterSpacing: '-0.04em',
                color: 'rgba(243,244,240,0.88)',
                lineHeight: 1,
              }}
            >
              {s.num}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                color: 'rgba(243,244,240,0.25)',
                marginTop: 10,
              }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Mobile fallback: simple stacked list ───────────────────────────── */}
      <style>{`
        @media (max-width: 767px) {
          .ddv1-cards { display: none !important; }
          .ddv1-mobile { display: flex !important; }
        }
      `}</style>
    </section>
  )
}
