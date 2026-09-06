'use client'

// V1 — Dual Angled Strips
// Two rows of portrait images, counter-scrolling at -3° tilt.
// Closest to the reference screenshot. Edge vignette fades images into dark bg.

const ROW_A = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map(
  s => `https://picsum.photos/seed/${s}/280/360`
)
const ROW_B = [15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115, 125].map(
  s => `https://picsum.photos/seed/${s}/280/360`
)

export default function ReelStripV1() {
  const reduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  return (
    <section
      className="relative overflow-hidden bg-[#0D0D0B]"
      style={{ paddingBlock: 'clamp(4rem, 8vw, 7rem)' }}
    >
      <style>{`
        @keyframes v1-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes v1-right {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .v1-track { display: flex; width: fit-content; gap: 10px; }
        .v1-track-a { animation: v1-left  32s linear infinite; }
        .v1-track-b { animation: v1-right 25s linear infinite; }
        .v1-track-a:hover,
        .v1-track-b:hover { animation-play-state: paused; }
      `}</style>

      {/* Section label + headline */}
      <div className="relative z-10 text-center mb-16 px-6">
        <p
          className="font-mono text-[#F5F4F0]/25 mb-5"
          style={{ fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase' }}
        >
          Selected Work
        </p>
        <h2
          className="font-display text-[#F5F4F0]"
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
            lineHeight: 1.1,
          }}
        >
          Craft in motion
        </h2>
      </div>

      {/* The angled strips block */}
      <div
        style={{
          transform: 'rotate(-3deg)',
          transformOrigin: 'center center',
          /* extra width so rotated ends don't clip */
          marginInline: '-8%',
        }}
      >
        {/* Row A — scrolls left */}
        <div className="overflow-hidden" style={{ marginBottom: 10 }}>
          <div className={`v1-track ${reduced ? '' : 'v1-track-a'}`}>
            {[...ROW_A, ...ROW_A].map((src, i) => (
              <div
                key={i}
                style={{
                  width: 230,
                  height: 295,
                  flexShrink: 0,
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid #222220',
                }}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row B — scrolls right */}
        <div className="overflow-hidden">
          <div className={`v1-track ${reduced ? '' : 'v1-track-b'}`}>
            {[...ROW_B, ...ROW_B].map((src, i) => (
              <div
                key={i}
                style={{
                  width: 230,
                  height: 295,
                  flexShrink: 0,
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '1px solid #222220',
                }}
              >
                <img
                  src={src}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left + right vignette — fades images into the dark bg */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to right, #0D0D0B 0%, transparent 18%, transparent 82%, #0D0D0B 100%)',
        }}
      />
      {/* Top + bottom fade */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to bottom, #0D0D0B 0%, transparent 20%, transparent 80%, #0D0D0B 100%)',
        }}
      />
    </section>
  )
}
