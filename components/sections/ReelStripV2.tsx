'use client'

// V2 — Film Perforations
// A literal 35mm filmstrip: sprocket holes punched along the edges,
// frame numbers on each still, single continuous horizontal scroll.
// The most specific to the editing-house identity.

const FRAMES = [
  { seed: 11, label: 'Documentary' },
  { seed: 22, label: 'Sports' },
  { seed: 33, label: 'Reality' },
  { seed: 44, label: 'Travel' },
  { seed: 55, label: 'Ad-film' },
  { seed: 66, label: 'Documentary' },
  { seed: 77, label: 'Sports' },
  { seed: 88, label: 'Reality' },
  { seed: 99, label: 'Travel' },
  { seed: 110, label: 'Ad-film' },
  { seed: 121, label: 'Documentary' },
  { seed: 132, label: 'Sports' },
]

const FRAME_W = 320
const FRAME_H = 210
const STRIP_H = 36 // height of the sprocket strip row

function SprocketStrip({ count }: { count: number }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: STRIP_H,
        backgroundColor: '#151513',
        paddingInline: 14,
        gap: 0,
        flexShrink: 0,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 14,
            borderRadius: 2,
            backgroundColor: '#0D0D0B',
            border: '1px solid #2A2A28',
            flexShrink: 0,
            marginRight: 22,
          }}
        />
      ))}
    </div>
  )
}

export default function ReelStripV2() {
  const reduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false

  // Each frame is FRAME_W + 2px border. Total track width ≈ count × (FRAME_W + gap)
  // Sprockets: roughly 1 hole per 40px of track width
  const sprocksPerRepeat = Math.ceil((FRAMES.length * (FRAME_W + 12)) / 40)

  return (
    <section
      className="relative overflow-hidden bg-[#0D0D0B]"
      style={{ paddingTop: 'clamp(2rem, 4vw, 3.5rem)', paddingBottom: 'clamp(1rem, 2vw, 1.5rem)' }}
    >
      <style>{`
        @keyframes v2-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .v2-reel {
          animation: v2-scroll 45s linear infinite;
        }
        .v2-reel:hover { animation-play-state: paused; }
      `}</style>

      {/* Section label + headline */}
      {/* <div className="relative z-10 text-center mb-8 px-6">
        <p
          className="font-mono text-[#F5F4F0]/25 mb-6"
          style={{ fontSize: 10, letterSpacing: '0.42em', textTransform: 'uppercase' }}
        >
          Reel
        </p> */}
        {/* <h2
          className="font-display text-[#F5F4F0]"
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)',
            fontWeight: 300,
            letterSpacing: '-0.025em',
          }}
        >
          Frame by frame
        </h2> */}
      {/* </div> */}

      {/* Film strip */}
      <div className="relative">
        <div
          className={reduced ? undefined : 'v2-reel'}
          style={{ display: 'flex', width: 'fit-content' }}
        >
          {/* Duplicate for infinite loop */}
          {[0, 1].map(pass => (
            <div key={pass} style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
              {/* Top sprocket strip */}
              <SprocketStrip count={sprocksPerRepeat} />

              {/* Image frames row */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#111110',
                  borderTop: '1px solid #1E1E1C',
                  borderBottom: '1px solid #1E1E1C',
                }}
              >
                {FRAMES.map((frame, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      width: FRAME_W,
                      height: FRAME_H,
                      flexShrink: 0,
                      borderRight: i < FRAMES.length - 1 ? '1px solid #1E1E1C' : undefined,
                    }}
                  >
                    <img
                      src={`https://picsum.photos/seed/${frame.seed}/${FRAME_W}/${FRAME_H}`}
                      alt=""
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Frame number */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '6px 8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)',
                      }}
                    >
                      <span
                        className="font-mono"
                        style={{ fontSize: 9, letterSpacing: '0.2em', color: 'rgba(245,244,240,0.4)' }}
                      >
                        {String(i + 1).padStart(3, '0')}
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(245,244,240,0.3)', textTransform: 'uppercase' }}
                      >
                        {frame.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom sprocket strip */}
              <SprocketStrip count={sprocksPerRepeat} />
            </div>
          ))}
        </div>
      </div>

      {/* Studio identity bar */}
      <div className="relative z-10 flex justify-between px-8 mt-4">
        <span
          className="font-mono text-[#F5F4F0]/20"
          style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' }}
        >
          Triangle Room
        </span>
        <span
          className="font-mono text-[#F5F4F0]/20"
          style={{ fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase' }}
        >
          Trivandrum / Kerala
        </span>
      </div>

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(to right, #0D0D0B 0%, transparent 12%, transparent 88%, #0D0D0B 100%)',
        }}
      />
    </section>
  )
}
