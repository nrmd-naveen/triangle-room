'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import TRMark from './TRMark'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const markWrapRef  = useRef<HTMLDivElement>(null)
  const wordRef      = useRef<HTMLDivElement>(null)
  const labelRef      = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const markWrap  = markWrapRef.current
    const word      = wordRef.current
    const label     = labelRef.current
    if (!container || !markWrap || !word || !label) return

    const path = markWrap.querySelector<SVGPathElement>('.tr-mark-path')
    if (!path) return

    const finish = () => {
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
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(path, { attr: { fill: '#1A5C3A', 'fill-opacity': 1, stroke: 'none' } })
      const t = setTimeout(finish, 500)
      return () => clearTimeout(t)
    }

    gsap.set(path, {
      attr: {
        fill: '#1A5C3A',
        'fill-opacity': 0,
        stroke: '#F5F4F0',
        'stroke-width': 3,
        'stroke-opacity': 0.9,
      },
    })

    const tl = gsap.timeline({ onComplete: finish })

    tl
      .from(markWrap, { opacity: 0, scale: 0.92, duration: 0.7, ease: 'power3.out' })
      .from(word, { opacity: 0, y: 10, duration: 0.6, ease: 'power3.out' }, '<0.1')
      .to(path, {
        attr: { 'fill-opacity': 1 },
        duration: 2.4,
        ease: 'power2.inOut',
      }, '<0.3')
      .to(path, {
        attr: { 'stroke-opacity': 0, 'stroke-width': 0 },
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.5')
      .to(label, { opacity: 0, duration: 0.4 }, '<')
      .to({}, { duration: 0.4 }) // brief hold on the fully filled mark

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-ink flex flex-col items-center justify-center"
    >
      <div ref={wordRef} className="absolute top-8 left-8">
        <img
          src="/brand/wordmark-white.svg"
          alt="Triangle Room"
          className="h-[14px] w-auto opacity-40"
        />
      </div>

      <div ref={markWrapRef} className="w-[min(56vw,420px)]">
        <TRMark className="w-full h-auto" />
      </div>

      <p
        ref={labelRef}
        className="font-mono text-[10px] tracking-[0.4em] uppercase text-fg/25 mt-8"
      >
        Loading
      </p>
    </div>
  )
}
