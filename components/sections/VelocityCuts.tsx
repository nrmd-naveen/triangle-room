'use client'

/**
 * VelocityCuts
 *
 * Pinned full-viewport section. Scroll velocity controls edit pace:
 *   — stopped     → holds on current frame (HOLD)
 *   — slow scroll → smooth cross-dissolve between stills
 *   — fast scroll → rapid hard cuts with single-frame white flash artifact
 *
 * The visitor feels editing rather than observes it.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Frame {
  src: string
  title: string
  genre: string
  client: string
}

// Stock stills — swap for real project frames when available.
// Using picsum seeds tuned for landscape/cinematic aspect ratio.
const FRAMES: Frame[] = [
  {
    src: 'https://picsum.photos/seed/vcut01/1920/1080',
    title: 'Tarini',
    genre: 'Documentary Film',
    client: 'National Geographic',
  },
  {
    src: 'https://picsum.photos/seed/vcut07/1920/1080',
    title: 'India from Above',
    genre: 'Documentary Series',
    client: 'Nat Geo UK',
  },
  {
    src: 'https://picsum.photos/seed/vcut13/1920/1080',
    title: 'Formula 1 After Movie',
    genre: 'Motorsport Film',
    client: 'Abu Dhabi Grand Prix',
  },
  {
    src: 'https://picsum.photos/seed/vcut19/1920/1080',
    title: 'The Greatest Rivalry',
    genre: 'Documentary Series',
    client: 'Netflix',
  },
  {
    src: 'https://picsum.photos/seed/vcut23/1920/1080',
    title: 'Great Overland Adventure',
    genre: 'Travel Series',
    client: 'Mercedes-Benz',
  },
  {
    src: 'https://picsum.photos/seed/vcut31/1920/1080',
    title: 'Doubles Trouble',
    genre: 'Documentary',
    client: 'Olympic Channel',
  },
]

// Velocity thresholds in px/sec (ScrollTrigger.getVelocity() units)
const VEL_MIN = 80    // below: hold frame
const VEL_CUT = 1200  // above: hard cut mode

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function VelocityCuts() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageARef  = useRef<HTMLDivElement>(null)
  const imageBRef  = useRef<HTMLDivElement>(null)
  const flashRef   = useRef<HTMLDivElement>(null)
  const hintRef    = useRef<HTMLDivElement>(null)
  const velBarRef  = useRef<HTMLDivElement>(null)

  // Label refs — updated via direct DOM manipulation to avoid re-renders
  const titleRef   = useRef<HTMLSpanElement>(null)
  const genreRef   = useRef<HTMLSpanElement>(null)
  const clientRef  = useRef<HTMLSpanElement>(null)
  const modeRef    = useRef<HTMLSpanElement>(null)
  const tcRef      = useRef<HTMLSpanElement>(null)

  // Mutable animation state — never triggers React re-renders
  const st = useRef({
    index:     0,
    active:    'a' as 'a' | 'b',
    lastCut:   0,
    frame:     0,      // 24fps real-time counter
    lastTick:  0,
    hintGone:  false,
  })

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Preload all images so cuts feel instant
    FRAMES.forEach(f => { const img = new Image(); img.src = f.src })

    // Show first frame on layer A
    if (imageARef.current) {
      imageARef.current.style.backgroundImage = `url(${FRAMES[0].src})`
    }

    if (reduced) return

    // ── Pin — user scrolls 250vh through the section, section stays fixed ──
    ScrollTrigger.create({
      trigger: sectionRef.current,
      pin: true,
      pinSpacing: true,
      start: 'top top',
      end: '+=250%',
    })

    // ── Main animation tick ────────────────────────────────────────────────
    const fps24 = 1000 / 24

    const tick = gsap.ticker.add(() => {
      const now = performance.now()
      const s   = st.current

      // Real-time timecode — ticks at 24fps independently of scroll
      if (now - s.lastTick >= fps24) {
        s.frame    = (s.frame + 1) % (24 * 3600) // cap at 1 hr
        s.lastTick = now

        if (tcRef.current) {
          const f  = s.frame % 24
          const ts = Math.floor(s.frame / 24)
          tcRef.current.textContent =
            `${pad(Math.floor(ts / 3600))}:${pad(Math.floor(ts / 60) % 60)}:${pad(ts % 60)}:${pad(f)}`
        }
      }

      // Read scroll velocity
      const vel = Math.abs((ScrollTrigger as any).getVelocity())

      // Update velocity bar (subtle editorial meter at section bottom)
      if (velBarRef.current) {
        velBarRef.current.style.width = `${Math.min(vel / 2500, 1) * 100}%`
      }

      if (vel < VEL_MIN) {
        if (modeRef.current) modeRef.current.textContent = 'HOLD'
        return
      }

      // Dismiss scroll hint on first movement
      if (!s.hintGone && hintRef.current) {
        gsap.to(hintRef.current, { opacity: 0, duration: 0.5, ease: 'power1.in' })
        s.hintGone = true
      }

      const isHardCut = vel > VEL_CUT
      if (modeRef.current) {
        modeRef.current.textContent = isHardCut ? 'CUT' : 'DISSOLVE'
      }

      // Interval between cuts shrinks as velocity rises
      // Hard cut:  vel 1200 → ~83ms → capped at 120ms  |  vel 5000 → 120ms
      // Dissolve:  vel  80  → 2250ms  |  vel 500 → 360ms → capped at 350ms
      const interval = isHardCut
        ? Math.max(120, 100000 / vel)
        : Math.max(350, 180000 / vel)

      if (now - s.lastCut > interval) {
        cut(isHardCut)
        s.lastCut = now
      }
    })

    // ── Cut function — operates directly on DOM refs ───────────────────────
    function cut(hardCut: boolean) {
      const s        = st.current
      const nextIdx  = (s.index + 1) % FRAMES.length
      const frame    = FRAMES[nextIdx]
      s.index        = nextIdx

      const curLayer  = s.active === 'a' ? imageARef : imageBRef
      const nextLayer = s.active === 'a' ? imageBRef : imageARef

      if (!curLayer.current || !nextLayer.current) return

      // Load next frame into the incoming layer before bringing it forward
      nextLayer.current.style.backgroundImage = `url(${frame.src})`
      nextLayer.current.style.zIndex = '20'
      curLayer.current.style.zIndex  = '10'

      if (hardCut) {
        // Instant swap — no tween
        gsap.set(nextLayer.current, { opacity: 1 })
        gsap.set(curLayer.current,  { opacity: 0 })

        // Single-frame telecine flash artifact
        if (flashRef.current) {
          gsap.fromTo(
            flashRef.current,
            { opacity: 0.6 },
            { opacity: 0, duration: 0.08, ease: 'power1.in' },
          )
        }
      } else {
        // Dissolve — both layers visible mid-transition
        gsap.to(curLayer.current,  { opacity: 0, duration: 0.8, ease: 'power2.inOut' })
        gsap.to(nextLayer.current, { opacity: 1, duration: 0.8, ease: 'power2.inOut' })
      }

      s.active = s.active === 'a' ? 'b' : 'a'

      // Update project metadata with micro-fade
      fadeLabel(titleRef.current,  frame.title)
      fadeLabel(genreRef.current,  frame.genre)
      fadeLabel(clientRef.current, frame.client)
    }

    return () => {
      gsap.ticker.remove(tick)
    }
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-ink"
      style={{ height: '100vh' }}
    >
      {/* ── Image layers (A / B crossfade) ─────────────────────────────── */}
      <div
        ref={imageARef}
        className="absolute inset-0 bg-center bg-cover"
        style={{ zIndex: 10 }}
      />
      <div
        ref={imageBRef}
        className="absolute inset-0 bg-center bg-cover"
        style={{ zIndex: 5, opacity: 0 }}
      />

      {/* Hard-cut flash — sits above images, below UI chrome */}
      <div
        ref={flashRef}
        className="absolute inset-0 bg-white pointer-events-none"
        style={{ zIndex: 50, opacity: 0 }}
      />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          background:
            'radial-gradient(ellipse 110% 100% at 50% 50%, transparent 20%, rgba(13,13,11,0.65) 100%)',
        }}
      />
      {/* Bottom gradient for metadata legibility */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          zIndex: 31,
          height: '45%',
          background: 'linear-gradient(to top, rgba(13,13,11,0.92) 0%, transparent 100%)',
        }}
      />

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 top-0 z-40 flex items-center justify-between"
        style={{ height: 54, paddingInline: 'clamp(2rem, 5vw, 5rem)' }}
      >
        {/* Section label */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.22em] text-accent/70">06</span>
          <span className="w-px h-3 bg-edge" />
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted">VELOCITY REEL</span>
        </div>

        {/* Mode + timecode */}
        <div className="flex items-center gap-5">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted tabular-nums">
            MODE{' '}
            <span ref={modeRef} className="text-fg/80 ml-1">HOLD</span>
          </span>
          <span className="font-mono text-[9px] tracking-[0.18em] text-muted/40 tabular-nums hidden sm:block">
            <span ref={tcRef}>00:00:00:00</span>
            <span className="ml-1.5 text-muted/25">24fps</span>
          </span>
        </div>
      </div>

      {/* Corner marks */}
      <span
        className="absolute top-16 font-mono text-[10px] text-edge/35 z-40 pointer-events-none select-none"
        style={{ left: 'clamp(2rem, 5vw, 5rem)' }}
        aria-hidden
      >×</span>
      <span
        className="absolute top-16 font-mono text-[10px] text-edge/35 z-40 pointer-events-none select-none"
        style={{ right: 'clamp(2rem, 5vw, 5rem)' }}
        aria-hidden
      >×</span>

      {/* ── Bottom metadata ─────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 inset-x-0 z-40 flex items-end justify-between"
        style={{
          paddingInline: 'clamp(2rem, 5vw, 5rem)',
          paddingBottom: 'clamp(2.5rem, 4vw, 3.5rem)',
        }}
      >
        {/* Project info */}
        <div>
          <p className="font-mono text-[9px] tracking-[0.28em] text-fg/30 uppercase mb-2.5">
            <span ref={clientRef}>{FRAMES[0].client}</span>
          </p>
          <h2
            className="font-display text-fg font-light leading-[1.06] tracking-[-0.025em] mb-2"
            style={{ fontSize: 'clamp(1.8rem, 3vw, 3.4rem)' }}
          >
            <span ref={titleRef}>{FRAMES[0].title}</span>
          </h2>
          <p className="font-mono text-[9px] tracking-[0.22em] text-muted uppercase">
            <span ref={genreRef}>{FRAMES[0].genre}</span>
          </p>
        </div>

        {/* Scroll hint — fades on first movement */}
        <div ref={hintRef} className="text-right pointer-events-none pb-1 hidden sm:block">
          <p className="font-mono text-[9px] tracking-[0.38em] text-fg/18 uppercase">
            scroll to cut
          </p>
          <div className="mt-2 flex justify-end">
            <span className="block h-px bg-fg/10" style={{ width: 40 }} />
          </div>
        </div>
      </div>

      {/* ── Velocity meter — 1px bar, fills with scroll speed ──────────── */}
      <div
        className="absolute bottom-0 inset-x-0 z-50 pointer-events-none"
        style={{ height: 1, background: 'rgba(255,255,255,0.06)' }}
      >
        <div
          ref={velBarRef}
          style={{
            height: '100%',
            width: '0%',
            background: 'rgba(21,122,80,0.7)', // accent
            transition: 'width 80ms linear',
          }}
        />
      </div>
    </section>
  )
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fadeLabel(el: HTMLElement | null, text: string) {
  if (!el) return
  gsap.to(el, {
    opacity: 0,
    duration: 0.1,
    onComplete: () => {
      el.textContent = text
      gsap.to(el, { opacity: 1, duration: 0.22 })
    },
  })
}
