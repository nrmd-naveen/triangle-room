'use client'

/**
 * WorksFeatured — scroll-from-below, one project at a time.
 *
 * Each card has 30 vh of empty padding top and bottom. That padding is what
 * makes the content feel like it "sticks" at centre — the card is ~126 vh tall
 * so the content spends a long scroll window centred in the viewport before the
 * fade-out range is reached.
 *
 * Per card:
 *   - The card content (all of it) fades in as the card enters the viewport,
 *     sits fully visible while centred, then fades out as it scrolls away.
 *     scrub: 1.8  on both fades → weighted, cinematic opacity trail.
 *   - Inner image (112 % tall, scale 1.025) shifts yPercent −8 → +8 while
 *     the image container travels through the viewport. scrub: true → 1:1,
 *     physical parallax feel.
 */

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS, type Work } from '@/components/works/data'

gsap.registerPlugin(ScrollTrigger)

const FEATURED: Work[] = WORKS.filter(w => w.srcs.length >= 1)

// ─── Card ──────────────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Work; index: number }) {
  const cardRef     = useRef<HTMLDivElement>(null)   // fades in / out
  const imgWrapRef  = useRef<HTMLDivElement>(null)   // parallax trigger
  const imgInnerRef = useRef<HTMLDivElement>(null)   // parallax target

  const secondary = project.srcs.slice(1, 3)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !cardRef.current || !imgWrapRef.current || !imgInnerRef.current) return

    // ── Parallax ─────────────────────────────────────────────────────────────
    gsap.fromTo(imgInnerRef.current,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: imgWrapRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,   // 1:1 — physical, no lag
        },
      },
    )

    // ── Fade in ───────────────────────────────────────────────────────────────
    // Wide range (100 % → 15 %): card spends a lot of scroll arriving.
    gsap.fromTo(cardRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 100%',
          end: 'top 15%',
          scrub: 1.8,
        },
      },
    )

    // No fade-out — card scrolls away at full opacity.
  })

  return (
    <div
      className="border-b border-edge last:border-0 px-8 md:px-16 lg:px-20"
      style={{ paddingTop: '30vh', paddingBottom: '30vh' }}
    >
      <div ref={cardRef} className="flex gap-5">

        {/* ── LEFT ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          <div
            ref={imgWrapRef}
            className="relative w-full overflow-hidden"
            style={{ height: 'clamp(300px, 52vh, 620px)' }}
          >
            <div
              ref={imgInnerRef}
              className="absolute inset-x-0 will-change-transform"
              style={{
                top: '-8%',
                height: '116%',
                transform: 'scale(1.025)',
                transformOrigin: 'center center',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.srcs[0]}
                alt={project.title}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" style={{ zIndex: 2 }} />
            <div className="absolute top-3.5 left-4 font-mono text-[8px] tracking-[0.22em] text-fg/38 select-none" style={{ zIndex: 3 }}>
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="absolute top-3.5 right-4 font-mono text-[8px] tracking-[0.22em] text-fg/35 uppercase select-none" style={{ zIndex: 3 }}>
              {project.genre}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-end justify-between gap-4">
            <div>
              {project.award && (
                <div className="mb-2.5 inline-flex items-center border border-accent/40 px-2.5 py-[5px]">
                  <span className="font-mono text-[8px] tracking-[0.1em] uppercase text-accent leading-none">
                    {project.award}
                  </span>
                </div>
              )}
              <h2
                className="font-display text-fg font-light leading-[1.06] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(20px, 2.6vw, 44px)' }}
              >
                {project.title}
              </h2>
              <p className="mt-1.5 font-mono text-[9px] tracking-[0.2em] text-muted uppercase">
                {project.category}
                {project.client ? ` · ${project.client}` : ''}
              </p>
            </div>
            <div
              className="flex-shrink-0 font-display text-fg/[0.05] font-light select-none leading-none"
              style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
              aria-hidden
            >
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        </div>

        {/* ── RIGHT: secondary thumbnails ── */}
        {secondary.length > 0 && (
          <div className="w-[28%] flex-shrink-0 hidden md:flex flex-col gap-3 justify-start">
            {secondary.map((src, j) => (
              <div
                key={src}
                className="relative overflow-hidden"
                style={{ aspectRatio: '16 / 9' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${project.title} — frame ${j + 2}`}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-ink/28" />
                <div className="absolute top-2 left-2.5 font-mono text-[7px] tracking-[0.25em] text-fg/35 select-none">
                  × FRAME 0{j + 2}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function WorksFeatured() {
  return (
    <div className="bg-ink">
      <div className="px-8 md:px-16 lg:px-20 pt-32 pb-16 border-b border-edge">
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-[9px] tracking-[0.28em] text-accent uppercase">Selected Work</span>
        </div>
        <h1
          className="font-display text-fg font-light leading-[1.04] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(36px, 5.5vw, 80px)' }}
        >
          What we have made
        </h1>
        <p className="mt-5 font-mono text-[9px] tracking-[0.1em] text-muted leading-[2] max-w-[56ch]">
          Triangle Room is a new company. The work below was made by our founders
          before it existed, at the production houses credited.
        </p>
      </div>

      {FEATURED.map((project, i) => (
        <ProjectCard key={project.index} project={project} index={i} />
      ))}
    </div>
  )
}
