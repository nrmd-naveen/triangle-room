'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const onMove = (e: MouseEvent) => {
      gsap.to(dot,  { x: e.clientX, y: e.clientY, duration: 0.08, ease: 'power3.out' })
      gsap.to(ring, { x: e.clientX, y: e.clientY, duration: 0.45, ease: 'power3.out' })
    }

    const onEnterLink = () => {
      gsap.to(ring, { scale: 2.2, opacity: 0.5, duration: 0.3, ease: 'power3.out' })
      gsap.to(dot,  { scale: 0,                  duration: 0.2 })
    }

    const onLeaveLink = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' })
      gsap.to(dot,  { scale: 1,             duration: 0.2 })
    }

    const links = document.querySelectorAll<HTMLElement>('a, button, [data-cursor-hover]')
    links.forEach((el) => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })
    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousemove', onMove)
      links.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterLink)
        el.removeEventListener('mouseleave', onLeaveLink)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-[5px] h-[5px] bg-accent rounded-full pointer-events-none z-[9999] will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-7 h-7 border border-ink/30 rounded-full pointer-events-none z-[9998] will-change-transform"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  )
}
