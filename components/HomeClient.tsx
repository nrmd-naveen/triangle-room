'use client'

import { useState } from 'react'
import Preloader from '@/components/Preloader'
import CustomCursor from '@/components/CustomCursor'
import Nav from '@/components/Nav'
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

interface Props {
  config: SiteConfig
}

export default function HomeClient({ config }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <CustomCursor />
      <Nav isLoaded={isLoaded} />

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
