'use client'

/**
 * DirectorsDeckV3 — "Cinema Lift"
 *
 * Three equal-width cards in a row. On hover the targeted card lifts
 * vertically (translateY up + shadow expansion), portrait zooms subtly
 * inside the frame (overflow: hidden — no escape, keeps it contained),
 * and film-aesthetic details emerge: crop-mark corners, green outline glow,
 * a "lower-third" info strip slides up from the bottom edge.
 *
 * Most restrained of the three variants — premium, on-brand for a
 * post-production house, reminiscent of Criterion/MUBI card treatments.
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

const CARD_H = 500
const LIFT_Y = 28  // how many px the card rises

// ─── Crop mark helper ─────────────────────────────────────────────────────────

function CropMarks({ visible, animate }: { visible: boolean; animate: boolean }) {
  const base: React.CSSProperties = {
    position: 'absolute',
    width: 10, height: 10,
    pointerEvents: 'none',
    transition: animate ? 'opacity 0.3s ease' : 'none',
    opacity: visible ? 0.7 : 0,
    zIndex: 10,
  }
  const line: React.CSSProperties = { position: 'absolute', background: '#157A50' }

  const Corner = ({ top, right, bottom, left, rX, rY }: {
    top?: number; right?: number; bottom?: number; left?: number; rX: boolean; rY: boolean
  }) => (
    <div style={{ ...base, top, right, bottom, left }}>
      <div style={{ ...line, top: 0, left: rX ? 'auto' : 0, right: rX ? 0 : 'auto', width: 10, height: 1 }} />
      <div style={{ ...line, top: rY ? 'auto' : 0, bottom: rY ? 0 : 'auto', left: rX ? 'auto' : 0, right: rX ? 0 : 'auto', width: 1, height: 10 }} />
    </div>
  )

  return (
    <>
      <Corner top={10}    left={10}    rX={false} rY={false} />
      <Corner top={10}    right={10}   rX={true}  rY={false} />
      <Corner bottom={10} left={10}    rX={false} rY={true}  />
      <Corner bottom={10} right={10}   rX={true}  rY={true}  />
    </>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function DirectorsDeckV3({ directors: directorsProp }: { directors?: Director[] }) {
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

      {/* ── Cards ────────────────────────────────────────────────────────────
          Extra paddingTop so the lifted card doesn't clip at the top.
      */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          paddingTop: LIFT_Y + 8,
          alignItems: 'flex-end',
        }}
      >
        {DIRECTORS.map((d, i) => {
          const isHovered    = hovered === i
          const isAnyHovered = hovered !== null

          return (
            <div
              key={d.name}
              style={{
                flex: 1,
                minWidth: 0,
                position: 'relative',
                height: CARD_H,
                overflow: 'hidden',
                borderRadius: 4,
                cursor: 'pointer',
                background: '#1C1F1B',

                /* Lift up + dim siblings */
                transform: animate
                  ? isHovered
                    ? `translateY(-${LIFT_Y}px)`
                    : isAnyHovered
                      ? 'translateY(4px) scale(0.97)'
                      : 'translateY(0) scale(1)'
                  : 'none',
                opacity: isAnyHovered && !isHovered ? 0.50 : 1,

                boxShadow: isHovered
                  ? `0 ${LIFT_Y + 40}px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(21,122,80,0.35)`
                  : '0 16px 50px rgba(0,0,0,0.44)',

                transition: animate
                  ? 'transform 0.48s cubic-bezier(0.34, 1.2, 0.64, 1), opacity 0.40s ease, box-shadow 0.45s ease'
                  : 'none',

                zIndex: isHovered ? 10 : 1,
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Portrait — zooms slightly inside the clipped card */}
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
                  transform: animate && isHovered ? 'scale(1.06)' : 'scale(1.01)',
                  transition: animate ? 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  willChange: 'transform',
                }}
              />

              {/* Dark scrim — lightens on hover to reveal portrait */}
              <div
                aria-hidden
                style={{
                  position: 'absolute', inset: 0,
                  background: isHovered
                    ? 'linear-gradient(to top, rgba(20,23,20,0.92) 30%, rgba(20,23,20,0.04) 65%)'
                    : 'linear-gradient(to top, rgba(20,23,20,0.90) 38%, rgba(20,23,20,0.45) 100%)',
                  transition: animate ? 'background 0.5s ease' : 'none',
                  pointerEvents: 'none',
                }}
              />

              {/* Film crop marks — appear on hover */}
              <CropMarks visible={isHovered} animate={animate} />

              {/* Index top-left */}
              <p
                aria-hidden
                style={{
                  position: 'absolute',
                  top: 18, left: 20,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.48rem',
                  letterSpacing: '0.32em',
                  color: 'rgba(243,244,240,0.28)',
                  zIndex: 5,
                }}
              >
                0{i + 1}
              </p>

              {/* Experience badge — top-right */}
              <div
                style={{
                  position: 'absolute',
                  top: 14, right: 14,
                  padding: '5px 9px',
                  borderRadius: 2,
                  background: 'rgba(20,23,20,0.68)',
                  backdropFilter: 'blur(8px)',
                  zIndex: 5,
                  opacity: isHovered ? 1 : 0.6,
                  transition: animate ? 'opacity 0.3s ease' : 'none',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5rem',
                    letterSpacing: '0.20em',
                    color: 'rgba(243,244,240,0.45)',
                  }}
                >
                  {d.years}
                </span>
              </div>

              {/* ── Lower-third info strip ──────────────────────────────────
                  Baseline info (name + role) always visible.
                  Bio + CTA slide up on hover via max-height.
              */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  zIndex: 6,
                  padding: '0 22px 0',
                }}
              >
                {/* Green accent line — animates width on hover */}
                <div
                  style={{
                    width: isHovered ? 44 : 18,
                    height: 1.5,
                    background: '#157A50',
                    opacity: 0.80,
                    marginBottom: 12,
                    transition: animate ? 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  }}
                />

                {/* Name */}
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 400,
                    fontSize: 'clamp(0.95rem, 2vw, 1.08rem)',
                    letterSpacing: '-0.012em',
                    color: '#F3F4F0',
                    marginBottom: 6,
                  }}
                >
                  {d.name}
                </p>

                {/* Role */}
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    letterSpacing: '0.30em',
                    textTransform: 'uppercase',
                    color: '#157A50',
                    marginBottom: 0,
                  }}
                >
                  {d.role}
                </p>

                {/* Collapsible detail */}
                <div
                  style={{
                    maxHeight: animate && isHovered ? 120 : 0,
                    overflow: 'hidden',
                    transition: animate ? 'max-height 0.48s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '0.72rem',
                      lineHeight: 1.65,
                      color: 'rgba(243,244,240,0.40)',
                      marginTop: 14,
                    }}
                  >
                    {d.note}
                  </p>
                </div>

                {/* View profile CTA */}
                <div
                  style={{
                    marginTop: isHovered ? 18 : 0,
                    marginBottom: isHovered ? 26 : 22,
                    opacity: isHovered ? 1 : 0,
                    transform: animate && isHovered ? 'translateY(0)' : 'translateY(10px)',
                    transition: animate
                      ? 'opacity 0.36s ease 0.14s, transform 0.36s ease 0.14s, margin 0.4s ease'
                      : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div style={{ flex: 1, height: 1, background: 'rgba(21,122,80,0.25)' }} />
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.55rem',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#157A50',
                    }}
                  >
                    View profile ↗
                  </p>
                </div>

                {/* Bottom spacing when collapsed */}
                {!isHovered && (
                  <div style={{ height: 22 }} />
                )}
              </div>
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
