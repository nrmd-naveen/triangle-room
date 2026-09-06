'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface WorkItem {
  title: string
  url?: string
  desc?: string
  who: string
  platform: string
  flag?: string
}

interface WorkCategory {
  id: string
  label: string
  items: WorkItem[]
}

const WORK: WorkCategory[] = [
  {
    id: 'documentary',
    label: 'Documentary',
    items: [
      {
        title: 'The Greatest Rivalry: India vs Pakistan',
        url: 'https://editoranukamala.myportfolio.com/the-greatest-rivalry',
        desc: 'Three part series tracing the cricket rivalry between the two countries, told by Gavaskar, Sehwag, Ganguly, Shoaib Akhtar and Javed Miandad. Netflix, 2025.',
        who: 'Anu Kamala, Series Editor',
        platform: 'NETFLIX / GREYMATTER',
      },
      {
        title: 'Tarini: The Goddess and the Sea',
        url: 'https://editoranukamala.myportfolio.com/tarini-for-national-geographic-channel',
        desc: "The 254 day voyage of six Indian Navy officers who became the first all woman crew to circumnavigate the globe. Made with the Indian Navy, premiered on International Women's Day.",
        who: 'Anu Kamala, Film Editor',
        platform: 'NAT GEO / PFT',
        flag: 'Best Editor Nomination / Asian Television Awards 2019',
      },
      {
        title: 'India From Above',
        url: 'https://editoranukamala.myportfolio.com/india-from-above-natgeo-uk',
        desc: 'Aerial documentary series on the landscape, engineering and history of India, made for the international Nat Geo network.',
        who: 'Anu Kamala, Series Editor',
        platform: 'NAT GEO UK / PFT',
      },
      {
        title: 'Mega Icons',
        url: 'https://editoranukamala.myportfolio.com/mega-icons-for-national-geographic-channel',
        desc: 'Documentary series profiling the Indians who shaped modern India.',
        who: 'Anu Kamala, Series Editor',
        platform: 'NAT GEO / PFT',
      },
      {
        title: 'The Greatest 2 Minutes in Sports',
        url: 'https://editoranukamala.myportfolio.com/the-greatest-two-minutes-in-sports',
        desc: 'American sports documentary on the Kentucky Derby, made for the US market.',
        who: 'Anu Kamala, Series Editor',
        platform: 'CREATOR ENGINE',
      },
      {
        title: 'Doubles Trouble',
        url: 'https://editoranukamala.myportfolio.com/doubles-trouble',
        desc: 'Sports docu reality following Rohan Bopanna as he searches for the doubles partner who will take him to the Olympics.',
        who: 'Anu Kamala, Chief Editor',
        platform: 'OLYMPIC CHANNEL',
      },
    ],
  },
  {
    id: 'unscripted',
    label: 'Unscripted and reality',
    items: [
      {
        title: 'Bigg Boss Malayalam, Seasons 1, 3 and 4',
        desc: 'Three seasons, moving up from episode producer to post producer to creative producer.',
        who: 'Midhuna Pichy, Episode to Creative Producer',
        platform: 'ASIANET / ENDEMOL SHINE',
      },
      {
        title: 'Kaun Banega Crorepati',
        desc: 'The Indian edition of the quiz format, and its Malayalam version Ningalkkum Aakaam Kodeeshwaran.',
        who: 'Midhuna Pichy, Senior Creative Executive',
        platform: 'SONY / BIG SYNERGY MEDIA LTD',
      },
      {
        title: 'Ace of Space',
        desc: 'Season one of the MTV reality format.',
        who: 'Midhuna Pichy, Episode Producer',
        platform: 'MTV / ENDEMOL SHINE',
      },
      {
        title: 'Dus Ka Dum',
        who: 'Midhuna Pichy, Senior Creative Executive',
        platform: 'SONY / BIG SYNERGY MEDIA LTD',
      },
      {
        title: "People's Choice",
        who: 'Midhuna Pichy, Senior Creative Executive',
        platform: 'ASIANET / BIG SYNERGY MEDIA LTD',
      },
      {
        title: 'Sell Me The Answer, Seasons 1 and 2',
        who: 'Midhuna Pichy, Senior Associate Producer',
        platform: 'ASIANET / BIG SYNERGY MEDIA LTD',
      },
      {
        title: 'Wrestling My Family',
        url: 'https://editoranukamala.myportfolio.com/docu-reality-for-olympic-channel',
        desc: 'Docu reality series following a wrestling family.',
        who: 'Anu Kamala, Lead Editor',
        platform: 'OLYMPIC CHANNEL',
      },
      {
        title: 'Fabulous Lives of Bollywood Wives',
        url: 'https://editoranukamala.myportfolio.com/ongoing-project-flbw-season-2',
        desc: 'Lifestyle reality series for Netflix, made by Dharmatic.',
        who: 'Anu Kamala, Senior Editor',
        platform: 'NETFLIX / DHARMATIC',
      },
      {
        title: 'Moving In With Malaika',
        desc: 'Celebrity docu reality built around Malaika Arora, her family and her circle. Sixteen episodes for JioHotstar, made by Banijay Asia.',
        who: 'Anu Kamala, Senior Editor',
        platform: 'JIOHOTSTAR / BANIJAY ASIA',
      },
      {
        title: 'Bigg Boss, Hindi and Kannada',
        who: 'Anu Kamala, Senior Editor',
        platform: 'COLORS / ENDEMOL SHINE',
      },
      {
        title: 'Malayalee House',
        desc: 'The Malayalam lockdown reality format, an early forerunner of Bigg Boss Malayalam.',
        who: 'Anu Kamala, Senior Video Editor',
        platform: 'VEDARTHA / SURYA TV',
      },
    ],
  },
  {
    id: 'travel',
    label: 'Travel, food and live',
    items: [
      {
        title: 'Expedition Borderlands with Ash and Lev',
        url: 'https://editoranukamala.myportfolio.com/travel-documentary-series-for-discovery-channel',
        desc: 'Travel documentary series across border regions.',
        who: 'Anu Kamala, Senior Editor',
        platform: 'DISCOVERY',
      },
      {
        title: 'Masters of Taste with Gary Mehigan',
        url: 'https://editoranukamala.myportfolio.com/masters-of-taste-episodes',
        desc: 'Food and travel series following the MasterChef Australia judge through India.',
        who: 'Anu Kamala, Senior Editor',
        platform: 'FOX LIFE / ENDEMOL SHINE',
      },
      {
        title: 'Great Overland Adventure 2',
        desc: 'Long form travel series made for Mercedes-Benz.',
        who: 'Anu Kamala, Senior Editor',
        platform: 'MERCEDES-BENZ / NDTV PRIME',
      },
      {
        title: 'ICC Cricket World Cup 2015',
        url: 'https://editoranukamala.myportfolio.com/icc-cricket-world-cup-2015-starsports',
        desc: 'Live tournament highlights, cut to broadcast deadline.',
        who: 'Anu Kamala, Highlights Editor',
        platform: 'STAR SPORTS',
      },
    ],
  },
  {
    id: 'music',
    label: 'Music and fiction',
    items: [
      {
        title: 'Music Mojo, Season 7',
        url: 'https://www.youtube.com/watch?v=eGk5fcfTR0Q',
        desc: 'Live music series pairing artists across genres. One of the longest running music formats in Malayalam television.',
        who: 'Jibin Babu, Producer',
        platform: 'KAPPA TV',
      },
      {
        title: 'Autumn Leaf, The Big Stage',
        url: 'https://www.youtube.com/watch?v=KUFKX5v3UUY',
        who: 'Jibin Babu, Producer',
        platform: 'AMRITA TV',
      },
      {
        title: 'Agam music videos',
        desc: 'Music videos for the band Agam, made for the Grammy Awards.',
        who: 'Jibin Babu, Associate Director',
        platform: 'MUSIC VIDEO',
      },
      {
        title: 'Pachamarakaikal',
        desc: 'Debut directorial short film.',
        who: 'Jibin Babu, Writer and Director',
        platform: 'SHORT FILM',
        flag: 'Two Kerala State Awards',
      },
      {
        title: 'Audio drama series',
        desc: 'Written and directed scripted audio series for the platform.',
        who: 'Jibin Babu, Writer and Director',
        platform: 'PRATILIPI FM',
      },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    items: [
      {
        title: 'Indiegaga',
        desc: 'Independent music festival, across its Bangalore, Ernakulam and Trivandrum editions.',
        who: 'Jibin Babu, Artist Manager',
        platform: 'LIVE EVENT',
      },
    ],
  },
  {
    id: 'brand',
    label: 'Brand and short form',
    items: [
      {
        title: 'Ad films for HP, Platinum and Exide',
        who: 'Midhuna Pichy, Associate Producer',
        platform: 'MOMOMOTO STUDIOS',
      },
      {
        title: 'Unacademy, Sharekhan, Blinkit, Metropolis Lab',
        who: 'Anu Kamala, Editor',
        platform: 'AD FILM',
      },
      {
        title: 'Formula 1 After Movie, Abu Dhabi Grand Prix 2016',
        who: 'Anu Kamala, Editor',
        platform: 'FORMULA 1',
      },
      {
        title: 'Jellysmack France, Glassworks London',
        who: 'Anu Kamala, Editor',
        platform: 'SOCIAL AND BRANDED',
      },
    ],
  },
]

export default function Work() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    gsap.from('.work-header', {
      opacity: 0, y: 16,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.work-header', start: 'top 82%', toggleActions: 'play none none reverse' },
    })

    WORK.forEach(({ id }) => {
      const group = containerRef.current?.querySelector(`[data-category="${id}"]`)
      if (!group) return
      gsap.from(group.querySelectorAll('.edl-row'), {
        opacity: 0,
        y: 8,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: {
          trigger: group,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="work"
      className="bg-paper text-ink border-t border-line"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-20 py-24 md:py-32">

        {/* Section header */}
        <div className="work-header flex items-baseline gap-4 mb-4">
          <span className="font-mono text-[12px] text-green tracking-[0.1em]">03</span>
          <h2 className="font-display text-ink" style={{ fontSize: 'clamp(24px, 3.2vw, 34px)' }}>
            What we have made
          </h2>
        </div>

        <p className="work-header font-mono text-[11.5px] tracking-[0.06em] text-dim leading-[1.7] mb-16 max-w-[70ch]">
          Triangle Room is a new company. The work below was made by our partners before it existed,
          at the production houses and networks credited. We are showing it because it is the honest
          measure of what we can do.
        </p>

        {/* EDL */}
        {WORK.map(({ id, label, items }) => (
          <div key={id} data-category={id}>
            <div className="font-mono text-[10.5px] tracking-[0.24em] uppercase text-green mt-10 mb-3 first:mt-0">
              {label}
            </div>
            <div className="hidden md:grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_160px] gap-5 pb-3 border-b border-ink font-mono text-[10px] tracking-[0.2em] uppercase text-dim">
              <span>Title</span><span>Partner and role</span><span className="text-right">Made at</span>
            </div>
            {items.map((item, i) => (
              <div
                key={i}
                className="edl-row grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_160px] gap-1.5 md:gap-5 py-5 border-b border-line hover:bg-paper-deep transition-colors duration-200 md:items-baseline"
              >
                <div>
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-ink text-[18px] leading-[1.25] hover:text-green transition-colors duration-200 group inline"
                    >
                      {item.title}
                      <span className="text-green text-[0.65em] ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
                    </a>
                  ) : (
                    <span className="font-display text-ink text-[18px] leading-[1.25]">{item.title}</span>
                  )}
                  {item.desc && (
                    <p className="mt-1.5 font-sans text-[13.5px] text-dim leading-[1.5] max-w-[52ch]">{item.desc}</p>
                  )}
                  {item.flag && (
                    <div className="inline-block mt-2 font-mono text-[10px] tracking-[0.08em] text-fg bg-[#0D4A31] px-2.5 py-1 uppercase">
                      {item.flag}
                    </div>
                  )}
                </div>
                <span className="font-sans text-[13.5px] text-dim">{item.who}</span>
                <span className="font-mono text-[11px] tracking-[0.06em] text-ink md:text-right">{item.platform}</span>
              </div>
            ))}
          </div>
        ))}

      </div>
    </section>
  )
}
