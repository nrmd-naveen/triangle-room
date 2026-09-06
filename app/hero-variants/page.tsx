'use client'

import { useState, useEffect, useCallback } from 'react'
import HeroV1 from '@/components/sections/HeroV1'
import HeroV2 from '@/components/sections/HeroV2'
import HeroV3 from '@/components/sections/HeroV3'
import HeroV4 from '@/components/sections/HeroV4'
import Hero from '@/components/sections/Hero'

const VARIANTS = [
  { id: 1, label: 'The Gate',      desc: 'Triangle clip expands on scroll' },
  { id: 2, label: 'Depth Bow',     desc: 'Letters fan open at individual speeds' },
  { id: 3, label: 'The Edit Cut',  desc: 'Words assemble from opposite sides' },
  { id: 4, label: 'Fog of Creation', desc: 'Mist parts to reveal the name' },
  { id: 5, label: 'Current',       desc: 'Existing hero (baseline)' },
] as const

type VariantId = (typeof VARIANTS)[number]['id']

function VariantHero({ id }: { id: VariantId }) {
  // Force a clean mount by giving each variant a unique key
  // isLoaded=true so entrance animation fires immediately (no preloader gate)
  switch (id) {
    case 1: return <HeroV1 isLoaded={true} />
    case 2: return <HeroV2 isLoaded={true} />
    case 3: return <HeroV3 isLoaded={true} />
    case 4: return <HeroV4 isLoaded={true} />
    case 5: return <Hero   isLoaded={true} />
  }
}

export default function HeroVariantsPage() {
  const [active, setActive] = useState<VariantId>(1)

  const handleSelect = useCallback((id: VariantId) => {
    // Scroll to top before switching so ScrollTrigger origins are clean
    window.scrollTo({ top: 0, behavior: 'instant' })
    setActive(id)
  }, [])

  // Keyboard shortcut: 1-5 to switch variants
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = parseInt(e.key)
      if (n >= 1 && n <= 5) handleSelect(n as VariantId)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSelect])

  const current = VARIANTS[active - 1]

  return (
    <div style={{ background: '#F5F6F3' }}>
      {/* ── Variant selector strip (fixed, above hero) ─────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 200,
          display: 'flex',
          alignItems: 'stretch',
          height: '40px',
          background: 'rgba(245,246,243,0.88)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(13,13,11,0.08)',
        }}
      >
        {/* Left label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '1.25rem',
          paddingRight: '1.5rem',
          borderRight: '1px solid rgba(13,13,11,0.07)',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '8.5px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(13,13,11,0.35)',
          }}>
            Hero Variants
          </span>
        </div>

        {/* Variant buttons */}
        <div style={{ display: 'flex', alignItems: 'stretch', flex: 1 }}>
          {VARIANTS.map((v) => {
            const isActive = v.id === active
            return (
              <button
                key={v.id}
                onClick={() => handleSelect(v.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0 1.1rem',
                  background: isActive ? 'rgba(13,13,11,0.05)' : 'transparent',
                  cursor: 'pointer',
                  borderTop: 'none',
                  borderBottom: 'none',
                  borderLeft: 'none',
                  borderRight: '1px solid rgba(13,13,11,0.07)',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
              >
                {/* Active indicator: bottom hairline */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#0D0D0B',
                  }} />
                )}
                <span style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '8px',
                  letterSpacing: '0.22em',
                  color: isActive ? 'rgba(13,13,11,0.6)' : 'rgba(13,13,11,0.3)',
                }}>
                  0{v.id}
                </span>
                <span style={{
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: '9px',
                  letterSpacing: '0.04em',
                  color: isActive ? 'rgba(13,13,11,0.75)' : 'rgba(13,13,11,0.35)',
                  whiteSpace: 'nowrap',
                }}>
                  {v.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Right: current description + keyboard hint */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '1.25rem',
          paddingRight: '1.5rem',
          borderLeft: '1px solid rgba(13,13,11,0.07)',
          gap: '1rem',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '8.5px',
            letterSpacing: '0.06em',
            color: 'rgba(13,13,11,0.38)',
            fontStyle: 'italic',
          }}>
            {current.desc}
          </span>
          <span style={{
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: '8px',
            letterSpacing: '0.18em',
            color: 'rgba(13,13,11,0.22)',
            textTransform: 'uppercase',
          }}>
            1–5 to switch
          </span>
        </div>
      </div>

      {/* ── Hero — remounts cleanly on variant change via key ────────────────── */}
      {/* 40px top padding to clear the fixed strip; hero itself fills viewport */}
      <div key={active} style={{ paddingTop: '40px' }}>
        <VariantHero id={active} />
      </div>
    </div>
  )
}
