'use client'

/**
 * WorkCarousel — cinematic project showcase
 *
 * Two image slots (A / B) always in the DOM; GSAP owns all motion.
 * On every transition:
 *   1. Stage shakes briefly (direction-aware gate-shake)
 *   2. Active slot slides/fades out
 *   3. Incoming slot slides/springs in from the opposite edge
 * React state only updates the info overlay (title, client, etc.)
 * after the incoming slide is fully settled.
 *
 * Timeline bar: scaleX-animated per-project segment, GSAP-driven,
 * restarts cleanly on manual nav and section enter/leave.
 */

import { useRef, useState, useEffect, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { WORKS } from '@/components/works/data'

gsap.registerPlugin(ScrollTrigger)

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROJECTS = WORKS.filter(w => w.srcs.length > 0)
const AUTO_MS  = 5500 // ms per slide before auto-advance

// ─── Component ───────────────────────────────────────────────────────────────

export default function WorkCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef   = useRef<HTMLDivElement>(null)
  const infoRef    = useRef<HTMLDivElement>(null)

  // Two perpetually-mounted image slots — GSAP swaps which is "on top"
  const wrapA = useRef<HTMLDivElement>(null)
  const imgA  = useRef<HTMLImageElement>(null)
  const wrapB = useRef<HTMLDivElement>(null)
  const imgB  = useRef<HTMLImageElement>(null)

  // Mutable refs that event-handler closures can read safely without going stale
  const topSlot   = useRef<'A' | 'B'>('A')  // which slot is currently visible
  const idxRef    = useRef(0)                // current project index
  const animRef   = useRef(false)            // transition in progress?
  const progTween = useRef<gsap.core.Tween | null>(null)
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  // React state — only for the info overlay and counter
  const [displayIdx, setDisplayIdx] = useState(0)
  const proj = PROJECTS[displayIdx]

  // ── Slot init ───────────────────────────────────────────────────────────────
  useGSAP(() => {
    if (!imgA.current || !imgB.current) return
    imgA.current.src = PROJECTS[0].srcs[0]
    imgB.current.src = PROJECTS[1 % PROJECTS.length].srcs[0]
    gsap.set(wrapA.current, { zIndex: 2, opacity: 1, x: 0, scale: 1 })
    gsap.set(wrapB.current, { zIndex: 1, opacity: 0, x: 0, scale: 1 })
  }, { scope: sectionRef })

  // ── Progress helpers ────────────────────────────────────────────────────────
  const killProgress = useCallback(() => {
    progTween.current?.kill()
    progTween.current = null
  }, [])

  const startProgress = useCallback((idx: number) => {
    killProgress()
    const fills = sectionRef.current?.querySelectorAll<HTMLElement>('[data-pfill]')
    if (!fills) return
    fills.forEach(el => {
      const i = Number(el.dataset.pfill)
      gsap.set(el, { scaleX: i < idx ? 1 : 0, transformOrigin: 'left center' })
    })
    const activeFill = sectionRef.current?.querySelector<HTMLElement>(`[data-pfill="${idx}"]`)
    if (activeFill) {
      progTween.current = gsap.to(activeFill, {
        scaleX: 1,
        duration: AUTO_MS / 1000,
        ease: 'none',
        transformOrigin: 'left center',
      })
    }
  }, [killProgress])

  // ── Core transition ─────────────────────────────────────────────────────────
  const go = useCallback((nextIdx: number, dir: 1 | -1) => {
    if (animRef.current) return
    animRef.current = true
    killProgress()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const stageW  = stageRef.current?.offsetWidth ?? 1200

    // Identify which slot comes in vs goes out
    const isATop   = topSlot.current === 'A'
    const outWrap  = isATop ? wrapA.current : wrapB.current
    const inWrap   = isATop ? wrapB.current : wrapA.current
    const inImg    = isATop ? imgB.current  : imgA.current

    // Load new image into the background slot before the transition starts
    if (inImg) inImg.src = PROJECTS[nextIdx].srcs[0]

    // Position incoming slot off-screen in the direction of travel
    gsap.set(inWrap, { x: dir * stageW, opacity: 1, scale: 1, zIndex: 2 })
    gsap.set(outWrap, { zIndex: 1 })

    const slideDur = reduced ? 0.25 : 0.55
    const tl = gsap.timeline({
      onComplete() {
        // Swap slot ownership
        topSlot.current = isATop ? 'B' : 'A'
        idxRef.current  = nextIdx
        animRef.current = false
        // Update React state — info fades in after this re-render
        setDisplayIdx(nextIdx)
        // Brief pause so React flushes the new content, then fade info in
        requestAnimationFrame(() => {
          gsap.fromTo(
            infoRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
          )
        })
        startProgress(nextIdx)
      },
    })

    // 1. Fade info overlay out immediately
    tl.to(infoRef.current, { opacity: 0, y: -6, duration: 0.18, ease: 'power2.in' }, 0)

    if (!reduced) {
      // 2. Gate-shake — the stage jolts in the direction of travel
      tl.to(stageRef.current, {
        keyframes: [
          { x: dir * -7, duration: 0.05, ease: 'none' },
          { x: dir *  9, duration: 0.05, ease: 'none' },
          { x: dir * -5, duration: 0.04, ease: 'none' },
          { x:        0, duration: 0.04, ease: 'none' },
        ],
      }, 0.12) // starts slightly after info fade begins
    }

    // 3. Outgoing slot: compress + slide away
    tl.to(outWrap, {
      x: dir * -(stageW * 0.28),
      scale: 0.97,
      opacity: 0,
      duration: slideDur,
      ease: 'power2.in',
    }, reduced ? 0 : 0.15)

    // 4. Incoming slot: spring in from opposite edge
    tl.to(inWrap, {
      x: 0,
      scale: 1,
      opacity: 1,
      duration: slideDur + 0.1,
      ease: reduced ? 'power2.out' : 'back.out(1.5)',
    }, reduced ? 0 : `<-${(slideDur * 0.65).toFixed(2)}`)

  }, [killProgress, startProgress])

  // ── Auto-advance ────────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    const next = (idxRef.current + 1) % PROJECTS.length
    go(next, 1)
  }, [go])

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(goNext, AUTO_MS)
  }, [goNext])

  // Start/stop when section enters/leaves the viewport
  useGSAP(() => {
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 65%',
      onEnter:     () => { startProgress(idxRef.current); resetTimer() },
      onLeave:     () => { killProgress(); if (timerRef.current) clearInterval(timerRef.current) },
      onEnterBack: () => { startProgress(idxRef.current); resetTimer() },
      onLeaveBack: () => { killProgress(); if (timerRef.current) clearInterval(timerRef.current) },
    })
    return () => st.kill()
  }, { scope: sectionRef })

  // Clean up on unmount
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    progTween.current?.kill()
  }, [])

  // ── Manual nav ──────────────────────────────────────────────────────────────
  function handleNext() {
    const next = (idxRef.current + 1) % PROJECTS.length
    go(next, 1)
    resetTimer()
  }
  function handlePrev() {
    const prev = (idxRef.current - 1 + PROJECTS.length) % PROJECTS.length
    go(prev, -1)
    resetTimer()
  }
  function handleSegment(i: number) {
    if (i === idxRef.current) return
    go(i, i > idxRef.current ? 1 : -1)
    resetTimer()
  }

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <section
      ref={sectionRef}
      id="work-carousel"
      className="bg-ink overflow-hidden"
    >

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-8 md:px-12 pt-10 pb-3">
        <span className="font-mono text-[9.5px] tracking-[0.42em] uppercase text-fg/30">
          Selected Work
        </span>
        <span className="font-mono text-[9.5px] tracking-[0.28em] tabular-nums text-fg/25">
          {String(displayIdx + 1).padStart(2, '0')} / {String(PROJECTS.length).padStart(2, '0')}
        </span>
      </div>

      {/* ── Stage ── */}
      <div
        ref={stageRef}
        className="relative overflow-hidden"
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* Slot A */}
        <div ref={wrapA} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgA}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Slot B */}
        <div ref={wrapB} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgB}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Gradient — always above both slots */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 5,
            background: 'linear-gradient(to top, rgba(20,23,20,0.92) 0%, rgba(20,23,20,0.30) 35%, rgba(20,23,20,0.06) 60%, transparent 100%)',
          }}
        />

        {/* ── Project info overlay ── */}
        <div
          ref={infoRef}
          className="absolute bottom-0 left-0 right-0 px-8 md:px-12 pb-8 md:pb-10"
          style={{ zIndex: 10 }}
        >
          {/* Category row */}
          <p className="font-mono text-[8.5px] tracking-[0.32em] uppercase text-fg/40 mb-3 leading-none">
            {proj.category}
            {proj.genre !== proj.category ? ` · ${proj.genre}` : ''}
            {proj.client ? ` · ${proj.client}` : ''}
          </p>

          {/* Title */}
          <h2
            className="font-display text-fg leading-[1.05] tracking-[-0.03em] max-w-[24ch]"
            style={{ fontSize: 'clamp(1.5rem, 3.2vw, 3.2rem)', fontWeight: 300 }}
          >
            {proj.title}
          </h2>

          {/* Award badge */}
          {proj.award && (
            <div className="mt-4 inline-flex items-center border border-accent/50 px-2.5 py-[5px]">
              <span className="font-mono text-[7.5px] tracking-[0.22em] uppercase text-accent leading-none">
                {proj.award}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-4 px-8 md:px-12 py-5">

        {/* Prev */}
        <button
          onClick={handlePrev}
          aria-label="Previous project"
          className="flex-none w-8 h-8 rounded-full border border-edge flex items-center justify-center text-fg/40 hover:text-fg hover:border-fg/35 transition-colors duration-200"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 1.5 3 5.5l4.5 4" />
          </svg>
        </button>

        {/* Timeline segments — one per project */}
        <div className="flex-1 flex items-center gap-[3px]" role="tablist" aria-label="Project timeline">
          {PROJECTS.map((p, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === displayIdx}
              aria-label={p.title}
              onClick={() => handleSegment(i)}
              className="relative flex-1 group"
              style={{ height: 12 }}              /* large hit area */
            >
              {/* Track */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-edge group-hover:bg-fg/20 transition-colors duration-150" />
              {/* Fill */}
              <div
                data-pfill={i}
                className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-fg/65 origin-left"
                style={{ transform: 'scaleX(0)' }}
              />
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={handleNext}
          aria-label="Next project"
          className="flex-none w-8 h-8 rounded-full border border-edge flex items-center justify-center text-fg/40 hover:text-fg hover:border-fg/35 transition-colors duration-200"
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3.5 1.5 8 5.5 3.5 10" />
          </svg>
        </button>

      </div>
    </section>
  )
}
