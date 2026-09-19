'use client'

import { useCallback, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import Preloader from '@/components/Preloader'
import BrandMark from '@/components/BrandMark'
import CustomCursor from '@/components/CustomCursor'
import Nav from '@/components/Nav'
import { useOnDarkSection } from '@/lib/useOnDarkSection'
import Marquee from '@/components/Marquee'
import HeroV1 from '@/components/sections/HeroV1'
import ReelPuzzle from '@/components/sections/ReelPuzzle'
import Statement from '@/components/sections/Statement'
import ClientsV1 from '@/components/sections/ClientsV1'
import DirectorsDeck from '@/components/sections/DirectorsDeck'
import ReelStripV3 from '@/components/sections/ReelStripV3'
import ScatterStatementV1 from '@/components/sections/ScatterStatementV1'
import WorkScrolly from '@/components/sections/WorkScrolly'
import Contact from '@/components/sections/Contact'
import type { SiteConfig } from '@/lib/site-config'
import DisciplineContactSheet from './sections/DisciplineContactSheet'
import DisciplineCut from './sections/DisciplineCut'
import About from '@/components/sections/About'

gsap.registerPlugin(Flip)

interface Props {
  config: SiteConfig
}

export default function HomeClient({ config }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [docked, setDocked] = useState(false)
  const [backdropVisible, setBackdropVisible] = useState(true)
  const brandMarkRef = useRef<HTMLAnchorElement>(null)
  const dark = useOnDarkSection(isLoaded, false)

  // Runs once the intro mark has scrambled its coordinates and drawn in the
  // glyph — captures its current layout, docks it into the nav slot, and lets
  // GSAP Flip animate the jump so the same element appears to fly there.
  const handleFormed = useCallback(() => {
    const el = brandMarkRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!el || reduced) {
      setDocked(true)
      setBackdropVisible(false)
      setIsLoaded(true)
      return
    }

    const state = Flip.getState(el)
    flushSync(() => setDocked(true))
    setBackdropVisible(false)

    Flip.from(state, {
      targets: el,
      duration: 1.1,
      ease: 'power4.inOut',
      scale: true,
      onComplete: () => {
        // Both states are already position:fixed, so nothing needs to stay
        // behind — make sure the docked CSS classes are the sole source of
        // truth for layout once the tween hands back control.
        gsap.set(el, { clearProps: 'all' })
        setIsLoaded(true)
      },
    })
  }, [])

  return (
    <>
      <Preloader visible={backdropVisible} />
      {/* Force the light treatment until fully loaded — the backdrop is still fading
          away underneath during the dock flight, so the real (possibly dark-on-light)
          scroll colour must not apply until that backdrop is actually gone. */}
      <BrandMark ref={brandMarkRef} mode={docked ? 'docked' : 'intro'} dark={isLoaded ? dark : true} onFormed={handleFormed} />
      <CustomCursor />
      <Nav isLoaded={isLoaded} renderMark={false} />

      <main>
        <HeroV1 isLoaded={isLoaded} />
        <Marquee />
        <ReelPuzzle
          posterSrc={config.reel.posterSrc}
          videoSrc={config.reel.videoSrc}
        />
        <Statement />
        <DisciplineContactSheet />
        {/* <DisciplineCut /> */}
        <About
          imageSrc={config.about.imageSrc}
          imageCaption={config.about.imageCaption}
        />
        
        <ClientsV1 logos={config.clients} />
        <DirectorsDeck directors={config.directors} />

        <Marquee />
        <ReelStripV3 images={config.reelStrip} />
        <ScatterStatementV1 />
        <WorkScrolly works={config.works} />
        <Contact meta={config.meta} />
      </main>
    </>
  )
}
