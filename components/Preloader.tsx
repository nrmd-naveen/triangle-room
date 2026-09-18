'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const countRef    = useRef<HTMLSpanElement>(null)
  const barRef      = useRef<HTMLDivElement>(null)
  const wordRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const count     = countRef.current
    const bar       = barRef.current
    const word      = wordRef.current
    if (!container || !count || !bar || !word) return

    const obj = { val: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(container, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          delay: 0.3,
          onComplete: () => {
            container.style.display = 'none'
            onComplete()
          },
        })
      },
    })

    tl
      .to(obj, {
        val: 100,
        duration: 2.2,
        ease: 'power2.inOut',
        onUpdate() {
          count.textContent = String(Math.floor(obj.val)).padStart(2, '0')
        },
      })
      .to(bar, { scaleX: 1, duration: 2.2, ease: 'power2.inOut' }, '<')
      .from(word, { opacity: 0, y: 10, duration: 0.6, ease: 'power3.out' }, '<0.2')

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center"
    >
      <div
        ref={wordRef}
        className="absolute top-6 left-6 md:top-8 md:left-8 font-mono text-[11px] tracking-[0.35em] uppercase text-fg/40"
      >
        Triangle Room
      </div>

      <div className="relative overflow-hidden">
        <span
          ref={countRef}
          className="block font-display text-fg leading-none tracking-[-0.04em]"
          style={{ fontSize: 'clamp(6rem, 20vw, 16rem)' }}
        >
          00
        </span>
      </div>

      <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-fg/25 mt-3">
        Loading
      </p>

      <div className="absolute bottom-0 left-0 w-full h-px bg-edge">
        <div
          ref={barRef}
          className="h-full bg-accent origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </div>
  )
}
