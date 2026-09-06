'use client'

/**
 * WorkCardFan
 *
 * 5 cards in a Lando-style fanned spread. The deck deals through all projects:
 * on every advance the whole fan gate-shakes, the leftmost card exits off-screen,
 * the remaining four shift one position toward the front, and the recycled slot
 * springs in from the right as the new back-right card. Center card is always
 * the "current" project — its info shows below. Hover any card to lift it.
 *
 * Two-slot trick: card DOM elements never unmount. GSAP controls all transforms;
 * React only re-renders the info overlay.
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS } from '@/components/works/data'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = WORKS.filter(w => w.srcs.length > 0)
const AUTO_MS  = 5500

// ─── Card geometry ────────────────────────────────────────────────────────────

const W = 190   // card width px
const H = 285   // card height px — 2:3 portrait
const B = -(W / 2) // x offset so GSAP x=0 centres the card at left:50%

// 5 fan positions. All values are GSAP CSSPlugin property names.
const FAN = [
  { x: B - 310, y: 90,  rotation: -21,  scale: 0.77, zIndex: 1 }, // far-left
  { x: B - 165, y: 35,  rotation: -11,  scale: 0.88, zIndex: 2 }, // left
  { x: B,       y: 0,   rotation:  0,   scale: 1,    zIndex: 5 }, // center  ← current
  { x: B + 165, y: 35,  rotation:  11,  scale: 0.88, zIndex: 2 }, // right
  { x: B + 310, y: 90,  rotation:  21,  scale: 0.77, zIndex: 1 }, // far-right
]

// Off-screen staging positions for the recycled card
const OFF_L = { x: B - 560, y: 130, rotation: -32, scale: 0.55, zIndex: 0, opacity: 0 }
const OFF_R = { x: B + 560, y: 130, rotation:  32, scale: 0.55, zIndex: 0, opacity: 0 }

// ─── Component ───────────────────────────────────────────────────────────────

export default function WorkCardFan() {
  const sectionRef = useRef<HTMLElement>(null)
  const fanRef     = useRef<HTMLDivElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)

  // 5 perpetually-mounted DOM slots
  const cardEls = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])
  const imgEls  = useRef<(HTMLImageElement | null)[]>([null, null, null, null, null])

  // slotAtPos[visualPos 0-4] = domSlot index (0-4)
  // Rotated on every transition — the only mutable bookkeeping we need
  const slotAtPos = useRef([0, 1, 2, 3, 4])

  const centerRef = useRef(2)                      // current center project index (starts so slots show proj 0-4)
  const animRef   = useRef(false)
  const progRef   = useRef<gsap.core.Tween | null>(null)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const [displayIdx, setDisplayIdx] = useState(2)  // drives React info render
  const proj = PROJECTS[displayIdx]

  // ── Initialise slot positions + images ──────────────────────────────────────
  useGSAP(() => {
    for (let slot = 0; slot < 5; slot++) {
      const projIdx = slot // slots 0-4 → projects 0-4
      if (imgEls.current[slot]) imgEls.current[slot]!.src = PROJECTS[projIdx % PROJECTS.length].srcs[0]
      const visPos = slotAtPos.current.indexOf(slot)
      gsap.set(cardEls.current[slot], { ...FAN[visPos], transformOrigin: '50% 50%' })
    }
  }, { scope: sectionRef })

  // ── Progress bar ────────────────────────────────────────────────────────────
  const killProgress = useCallback(() => { progRef.current?.kill(); progRef.current = null }, [])

  const startProgress = useCallback((idx: number) => {
    killProgress()
    sectionRef.current?.querySelectorAll<HTMLElement>('[data-pfill]').forEach(el => {
      gsap.set(el, {
        scaleX: Number(el.dataset.pfill) < idx ? 1 : 0,
        transformOrigin: 'left center',
      })
    })
    const active = sectionRef.current?.querySelector<HTMLElement>(`[data-pfill="${idx}"]`)
    if (active) {
      progRef.current = gsap.to(active, {
        scaleX: 1, duration: AUTO_MS / 1000, ease: 'none',
        transformOrigin: 'left center',
      })
    }
  }, [killProgress])

  // ── Core transition ─────────────────────────────────────────────────────────
  const go = useCallback((dir: 1 | -1) => {
    if (animRef.current) return
    animRef.current = true
    killProgress()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dur     = reduced ? 0.2 : 0.46
    const newCenter = (centerRef.current + dir + PROJECTS.length) % PROJECTS.length

    // Which visual position exits vs enters?
    const exitVisPos  = dir === 1 ? 0 : 4
    const enterVisPos = dir === 1 ? 4 : 0
    const exitDomSlot = slotAtPos.current[exitVisPos]

    // Assign the recycled slot a new project image before it becomes visible
    const newProjIdx = dir === 1
      ? (newCenter + 2) % PROJECTS.length   // will sit at far-right (pos 4)
      : (newCenter - 2 + PROJECTS.length) % PROJECTS.length // will sit at far-left (pos 0)
    if (imgEls.current[exitDomSlot]) {
      imgEls.current[exitDomSlot]!.src = PROJECTS[newProjIdx].srcs[0]
    }

    // The 4 remaining dom slots and their destination fan positions
    const remainSlots = dir === 1
      ? [slotAtPos.current[1], slotAtPos.current[2], slotAtPos.current[3], slotAtPos.current[4]]
      : [slotAtPos.current[0], slotAtPos.current[1], slotAtPos.current[2], slotAtPos.current[3]]
    const remainDest = dir === 1
      ? [FAN[0], FAN[1], FAN[2], FAN[3]]
      : [FAN[1], FAN[2], FAN[3], FAN[4]]

    const exitEl  = cardEls.current[exitDomSlot]
    const exitOff = dir === 1 ? OFF_L : OFF_R
    const entOff  = dir === 1 ? OFF_R : OFF_L

    const tl = gsap.timeline({
      onComplete() {
        // Rotate slotAtPos
        if (dir === 1) {
          slotAtPos.current = [
            slotAtPos.current[1], slotAtPos.current[2],
            slotAtPos.current[3], slotAtPos.current[4], slotAtPos.current[0],
          ]
        } else {
          slotAtPos.current = [
            slotAtPos.current[4], slotAtPos.current[0],
            slotAtPos.current[1], slotAtPos.current[2], slotAtPos.current[3],
          ]
        }
        centerRef.current = newCenter
        animRef.current   = false
        setDisplayIdx(newCenter)
        requestAnimationFrame(() => {
          gsap.fromTo(infoRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
          )
        })
        startProgress(newCenter)
      },
    })

    // 1. Info fades out immediately
    tl.to(infoRef.current, { opacity: 0, y: -7, duration: 0.16, ease: 'power2.in' }, 0)

    if (!reduced) {
      // 2. Gate-shake the entire fan container (direction-aware)
      tl.to(fanRef.current, {
        keyframes: [
          { x: dir * -7, duration: 0.05, ease: 'none' },
          { x: dir *  9, duration: 0.05, ease: 'none' },
          { x: dir * -5, duration: 0.04, ease: 'none' },
          { x:        0, duration: 0.04, ease: 'none' },
        ],
      }, 0.06)
    }

    const t2 = reduced ? 0 : 0.18  // when slides start moving

    // 3. Exit card slides off-screen
    tl.to(exitEl, { ...exitOff, opacity: 0, duration: dur, ease: 'power2.in' }, t2)

    // 4. Remaining 4 cards shift to their new positions
    remainSlots.forEach((domSlot, i) => {
      tl.to(cardEls.current[domSlot], {
        ...remainDest[i],
        duration: dur + 0.08,
        ease: 'power2.inOut',
      }, t2)
    })

    // 5. Recycled card teleports to the opposite off-screen edge, then springs in
    tl.set(exitEl, { ...entOff }, t2 + dur)          // instant warp after exit
    tl.to(exitEl, {
      ...FAN[enterVisPos],
      opacity: 1,
      duration: dur + 0.12,
      ease: reduced ? 'power2.out' : 'back.out(1.5)',
    }, t2 + dur)                                      // starts right after the warp set

  }, [killProgress, startProgress])

  // ── Auto-advance ────────────────────────────────────────────────────────────
  const goNext    = useCallback(() => go(1), [go])
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(goNext, AUTO_MS)
  }, [goNext])

  useGSAP(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 65%',
      onEnter:     () => { startProgress(centerRef.current); resetTimer() },
      onLeave:     () => { killProgress(); if (timerRef.current) clearInterval(timerRef.current) },
      onEnterBack: () => { startProgress(centerRef.current); resetTimer() },
      onLeaveBack: () => { killProgress(); if (timerRef.current) clearInterval(timerRef.current) },
    })
    return () => st.kill()
  }, { scope: sectionRef })

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    progRef.current?.kill()
  }, [])

  // ── Hover on individual cards ───────────────────────────────────────────────
  function onCardEnter(domSlot: number) {
    if (animRef.current) return
    const el     = cardEls.current[domSlot]
    const visPos = slotAtPos.current.indexOf(domSlot)
    if (!el || visPos === -1) return
    const pos = FAN[visPos]
    gsap.to(el, {
      y:        pos.y - 32,
      rotation: pos.rotation * 0.12,
      scale:    Math.min(pos.scale * 1.09, 1.06),
      zIndex:   9,
      duration: 0.35,
      ease:     'power3.out',
    })
  }

  function onCardLeave(domSlot: number) {
    if (animRef.current) return
    const el     = cardEls.current[domSlot]
    const visPos = slotAtPos.current.indexOf(domSlot)
    if (!el || visPos === -1) return
    gsap.to(el, { ...FAN[visPos], duration: 0.5, ease: 'power3.out' })
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id="work-fan"
      className="bg-bg overflow-hidden pt-24 pb-16"
    >
      <div className="max-w-6xl mx-auto px-8 md:px-12">

        {/* Label + counter */}
        <div className="flex items-center justify-between mb-12">
          <span className="font-mono text-[9.5px] tracking-[0.42em] uppercase text-muted">
            Selected Work
          </span>
          <span className="font-mono text-[9.5px] tracking-[0.28em] tabular-nums text-muted">
            {String(displayIdx + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
          </span>
        </div>

        {/* ── Fan ── */}
        <div
          ref={fanRef}
          className="relative mx-auto"
          style={{
            height: H + 90 + 28, // tallest drop + buffer
            overflow: 'visible',
          }}
        >
          {([0, 1, 2, 3, 4] as const).map(domSlot => (
            <div
              key={domSlot}
              ref={el => { cardEls.current[domSlot] = el }}
              className="absolute top-0 left-1/2 overflow-hidden rounded-[5px] shadow-2xl"
              style={{ width: W, height: H, cursor: 'none' }}
              onMouseEnter={() => onCardEnter(domSlot)}
              onMouseLeave={() => onCardLeave(domSlot)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={el => { imgEls.current[domSlot] = el }}
                alt=""
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
              {/* Uniform depth tint so non-center cards read as "behind" */}
              <div className="absolute inset-0 bg-ink/[0.10] pointer-events-none" />
            </div>
          ))}
        </div>

        {/* ── Info + controls ── */}
        <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">

          {/* Project info */}
          <div ref={infoRef} className="min-w-0">
            <p className="font-mono text-[9px] tracking-[0.32em] uppercase text-muted mb-3 leading-none">
              {proj.category}
              {proj.genre && proj.genre !== proj.category ? ` · ${proj.genre}` : ''}
              {proj.client ? ` · ${proj.client}` : ''}
            </p>
            <h2
              className="font-display text-ink leading-[1.05] tracking-[-0.03em] mb-3"
              style={{ fontSize: 'clamp(1.6rem, 3.2vw, 3rem)', fontWeight: 300 }}
            >
              {proj.title}
            </h2>
            {proj.award && (
              <div className="inline-flex items-center border border-accent/45 px-2.5 py-1">
                <span className="font-mono text-[7.5px] tracking-[0.22em] uppercase text-accent leading-none">
                  {proj.award}
                </span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col items-start md:items-end gap-3 flex-none">

            {/* Arrow buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => { go(-1); resetTimer() }}
                aria-label="Previous project"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-ink hover:border-ink/25 transition-colors duration-200"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.5 1.5 3 5.5l4.5 4" />
                </svg>
              </button>
              <button
                onClick={() => { go(1); resetTimer() }}
                aria-label="Next project"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-ink hover:border-ink/25 transition-colors duration-200"
              >
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3.5 1.5 8 5.5 3.5 10" />
                </svg>
              </button>
            </div>

            {/* Timeline — one segment per project */}
            <div className="flex gap-[3px] w-52">
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i === centerRef.current || animRef.current) return
                    go(i > centerRef.current ? 1 : -1)
                    resetTimer()
                  }}
                  aria-label={`Project ${i + 1}`}
                  className="relative flex-1 group"
                  style={{ height: 14 }}
                >
                  {/* Track */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-border group-hover:bg-muted/40 transition-colors duration-150" />
                  {/* Fill */}
                  <div
                    data-pfill={i}
                    className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-accent origin-left"
                    style={{ transform: 'scaleX(0)' }}
                  />
                </button>
              ))}
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
