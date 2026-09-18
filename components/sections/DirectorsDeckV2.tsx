'use client'

/**
 * DirectorsDeckV2 — "Stage Expand"
 *
 * All three cards are visible. Hovering a card expands it (flex-grow
 * transition), revealing the full portrait + a side info panel that slides in.
 * The non-hovered cards compress to show just enough to stay legible.
 * More editorial / information-rich than V1 — feels like opening a dossier.
 */

import { useState } from 'react'
import type { Director } from '@/lib/site-config'

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

const CARD_H = 520

// ─── Component ───────────────────────────────────────────────────────────────

export default function DirectorsDeckV2({ directors: directorsProp }: { directors?: Director[] }) {
  const DIRECTORS  = directorsProp ?? DEFAULT_DIRECTORS
  const [hovered, setHovered] = useState<number | null>(null)

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  const animate = !prefersReduced

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
          marginBottom: 56,
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

      {/* ── Cards — accordion flex row ──────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          height: CARD_H,
          alignItems: 'stretch',
        }}
      >
        {DIRECTORS.map((d, i) => {
          const isHovered = hovered === i
          const flexVal   = hovered === null ? 1 : isHovered ? 2.4 : 0.72

          return (
            <div
              key={d.name}
              style={{
                flex: flexVal,
                minWidth: 0,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                background: '#1C1F1B',
                cursor: 'pointer',
                transition: animate ? 'flex 0.56s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                boxShadow: isHovered
                  ? '0 48px 100px rgba(0,0,0,0.72), 0 0 0 1px rgba(21,122,80,0.28)'
                  : '0 16px 48px rgba(0,0,0,0.44)',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Portrait — fills card, subtle scale on hover */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={d.portrait}
                alt={d.name}
                loading="lazy"
                decoding="async"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  transform: animate && isHovered ? 'scale(1.055)' : 'scale(1.02)',
                  transition: animate ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  willChange: 'transform',
                }}
              />

              {/* Dark gradient — stronger on non-hovered cards */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: isHovered
                    ? 'linear-gradient(to top, rgba(20,23,20,0.92) 36%, rgba(20,23,20,0.10) 70%)'
                    : 'linear-gradient(to top, rgba(20,23,20,0.88) 40%, rgba(20,23,20,0.55) 100%)',
                  transition: animate ? 'background 0.5s ease' : 'none',
                  pointerEvents: 'none',
                }}
              />

              {/* Green top hairline */}
              <div
                aria-hidden
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: 1.5, background: '#157A50',
                  opacity: isHovered ? 0.85 : 0,
                  transition: animate ? 'opacity 0.35s ease' : 'none',
                  zIndex: 2,
                }}
              />

              {/* Bottom info */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  padding: '0 24px 28px',
                  zIndex: 3,
                }}
              >
                {/* Role pill — always visible */}
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    letterSpacing: '0.30em',
                    textTransform: 'uppercase',
                    color: '#157A50',
                    marginBottom: 10,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {d.role}
                </p>

                {/* Name — always visible */}
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 400,
                    fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                    letterSpacing: '-0.015em',
                    color: '#F3F4F0',
                    marginBottom: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {d.name}
                </p>

                {/* Bio — only visible when expanded */}
                <div
                  style={{
                    maxHeight: animate && isHovered ? 120 : 0,
                    overflow: 'hidden',
                    transition: animate ? 'max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.72rem',
                      lineHeight: 1.65,
                      color: 'rgba(243,244,240,0.42)',
                      marginTop: 14,
                    }}
                  >
                    {d.note}
                  </p>
                </div>

                {/* Years + CTA — only visible when expanded */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: isHovered ? 16 : 0,
                    opacity: isHovered ? 1 : 0,
                    transform: animate && isHovered ? 'translateY(0)' : 'translateY(8px)',
                    transition: animate
                      ? 'opacity 0.38s ease 0.12s, transform 0.38s ease 0.12s, margin-top 0.38s ease'
                      : 'none',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.52rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase',
                      color: 'rgba(243,244,240,0.28)',
                    }}
                  >
                    {d.years} yrs
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#157A50',
                    }}
                  >
                    Profile ↗
                  </p>
                </div>
              </div>

              {/* Index — top-left, rotated */}
              <p
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 18, left: 20,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.48rem',
                  letterSpacing: '0.32em',
                  color: 'rgba(243,244,240,0.25)',
                  zIndex: 4,
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
    </section>
  )
}
