'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface PreloaderProps {
  /** false once the brand mark has formed and is docking — fades the backdrop away. */
  visible: boolean
}

export default function Preloader({ visible }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (visible) return
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.to(container, {
      opacity: 0,
      duration: reduced ? 0.4 : 1,
      ease: 'power2.inOut',
      onComplete: () => { container.style.display = 'none' },
    })
  }, [visible])

  return <div ref={containerRef} className="fixed inset-0 z-[100] bg-ink pointer-events-none" />
}
