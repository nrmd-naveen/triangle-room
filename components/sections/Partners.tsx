'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type VertexKey = 'anu' | 'midhuna' | 'jibin'
type Vertex = VertexKey | null

const PARTNERS = [
  {
    key: 'anu' as const,
    corner: 'Corner 01',
    name: 'Anu Kamala',
    role: 'Director',
    discipline: 'Story and Post',
    bio: [
      'Anu believes stories are rewritten in the edit room. He has spent eighteen years there, cutting documentary series, reality formats, travel shows and live sport for Netflix, National Geographic, Discovery, Olympic Channel, Prime Video and Star Sports.',
      'In unscripted, that has never only meant cutting. Finding the arc inside three hundred hours of rushes, restructuring episodes after the shoot is over, rewriting a series so it holds. On most of his projects that work has been creative producing without the credit.',
      'He was series editor on The Greatest Rivalry for Netflix, chief editor on Doubles Trouble for Olympic Channel, and film editor on Tarini: The Goddess and the Sea for National Geographic. Across eighteen years the work has run regional, national and international, across languages and across formats.',
    ],
    flag: 'Best Editor Nomination / Asian Television Awards 2019',
    links: [
      { label: 'Portfolio', href: 'https://editoranukamala.myportfolio.com/work' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/anu-kamala-4a755496/' },
      { label: 'Email', href: 'mailto:editoranu@gmail.com' },
    ],
  },
  {
    key: 'jibin' as const,
    corner: 'Corner 02',
    name: 'Jibin Babu',
    role: 'Director',
    discipline: 'Development and Writing',
    bio: [
      'Jibin writes the thing before anyone knows it is a thing. Over nine years across television, audio, film and digital content, he has developed and led production on more than twelve television shows, including Music Mojo Season 7 for Kappa TV and Autumn Leaf The Big Stage.',
      'His own work runs to fiction. He has written and directed audio series for Pratilipi FM and co-created short films, mini web series and ad films. He is currently co-writing a feature screenplay.',
    ],
    flag: 'Two Kerala State Awards / Pachamarakaikal',
    links: [
      { label: 'Music Mojo', href: 'https://www.youtube.com/watch?v=eGk5fcfTR0Q' },
      { label: 'Autumn Leaf', href: 'https://www.youtube.com/watch?v=KUFKX5v3UUY' },
    ],
  },
  {
    key: 'midhuna' as const,
    corner: 'Corner 03',
    name: 'Midhuna Pichy',
    role: 'Director',
    discipline: 'Production and Delivery',
    bio: [
      'Midhuna makes ambitious shows actually happen. Eleven years producing television, reality and ad film across Mumbai, Hyderabad, Chennai and Kerala. She has worked three seasons of Bigg Boss Malayalam for Asianet and Endemol Shine India, moving from episode producer on Season 1 to post producer on Season 3 to creative producer on Season 4.',
      'Her specialism is the daily reality pipeline. Twenty four hours of rushes cut down to two, then to one hour of prime time, delivered on schedule every single day. It is a job of making the right call continuously under pressure, and of running a team so those calls get made and the show goes out.',
    ],
    flag: 'M.A. Communication / Hyderabad Central University',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/midhuna-pichy-9944278b' },
      { label: 'Email', href: 'mailto:psmidhuna@gmail.com' },
    ],
  },
]

// Triangle vertex positions (viewBox 0 0 220 200)
const VERTICES: Record<VertexKey, { cx: number; cy: number; labelX: number; labelY: number; anchor: 'start' | 'middle' | 'end' }> = {
  anu:     { cx: 110, cy: 24,  labelX: 110, labelY: 10,  anchor: 'middle' },
  jibin:   { cx: 190, cy: 172, labelX: 196, labelY: 190, anchor: 'end'    },
  midhuna: { cx: 30,  cy: 172, labelX: 24,  labelY: 190, anchor: 'start'  },
}

export default function Partners() {
  const containerRef = useRef<HTMLElement>(null)
  const [activeVertex, setActiveVertex] = useState<Vertex>(null)

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // Section header
    gsap.from('.partners-header', {
      opacity: 0, y: 16,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.partners-header', start: 'top 82%', toggleActions: 'play none none reverse' },
    })

    // Each partner card
    PARTNERS.forEach(({ key }) => {
      const card = containerRef.current?.querySelector(`[data-partner="${key}"]`)
      if (!card) return

      ScrollTrigger.create({
        trigger: card,
        start: 'top 52%',
        end: 'bottom 52%',
        onEnter:     () => setActiveVertex(key),
        onLeave:     () => setActiveVertex(null),
        onEnterBack: () => setActiveVertex(key),
        onLeaveBack: () => setActiveVertex(null),
      })

      gsap.from(card, {
        opacity: 0, y: 18,
        duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })
    })
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      id="partners"
      className="bg-paper text-ink border-t border-line"
    >
      <div className="max-w-[1400px] mx-auto px-8 md:px-16 lg:px-20 py-24 md:py-32">

        {/* Section header with sticky triangle */}
        <div className="partners-header grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 items-start mb-16">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-[12px] text-green tracking-[0.1em]">04</span>
            <h2 className="font-display text-ink" style={{ fontSize: 'clamp(24px, 3.2vw, 34px)' }}>
              The Partners
            </h2>
          </div>

          {/* Interactive triangle — vertex lights up as you scroll through partners */}
          <div className="lg:sticky lg:top-28 flex flex-col items-center gap-3">
            <svg
              viewBox="0 0 220 200"
              className="w-full max-w-[200px] overflow-visible"
              role="img"
              aria-label="Triangle showing the three partners"
            >
              <path
                d="M110 24 L190 172 H30 Z"
                fill="none"
                stroke="#D3D6CE"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
              <path
                d="M30 172 A 44 44 0 0 1 -3 130"
                fill="none"
                stroke="#157A50"
                strokeWidth="1.5"
                strokeDasharray="3 6"
                strokeLinecap="round"
              />

              {(Object.entries(VERTICES) as [VertexKey, (typeof VERTICES)[VertexKey]][]).map(([key, v]) => {
                const lit = activeVertex === key
                return (
                  <g key={key as string}>
                    <circle
                      cx={v.cx} cy={v.cy} r={6}
                      fill={lit ? '#0D4A31' : '#F3F4F0'}
                      stroke={lit ? '#0D4A31' : '#141714'}
                      strokeWidth="1.5"
                      style={{ transition: 'fill 0.25s ease, stroke 0.25s ease' }}
                    />
                    <text
                      x={v.labelX} y={v.labelY}
                      textAnchor={v.anchor as 'middle' | 'start' | 'end'}
                      fill={lit ? '#0D4A31' : '#6E736C'}
                      style={{
                        fontFamily: 'var(--font-jetbrains, monospace)',
                        fontSize: '9px',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        transition: 'fill 0.25s ease',
                      }}
                    >
                      {key as string}
                    </text>
                  </g>
                )
              })}
            </svg>
            <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-dim text-center">
              One shape. Three corners.
            </span>
          </div>
        </div>

        {/* Partner rows */}
        <div className="border-t border-ink">
          {PARTNERS.map(({ key, corner, name, role, discipline, bio, flag, links }) => (
            <div
              key={key}
              data-partner={key}
              className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-12 py-12 border-b border-line"
            >
              {/* Left: identity */}
              <div>
                <div className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-green mb-3">{corner}</div>
                <div className="font-display text-ink text-[26px] leading-[1.15]">{name}</div>
                <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-dim mt-2 leading-[1.7]">
                  {role}<br /><span className="text-green">{discipline}</span>
                </div>
              </div>

              {/* Right: bio */}
              <div>
                {bio.map((para, i) => (
                  <p key={i} className="font-sans text-ink/80 leading-[1.65] mb-4 max-w-[62ch] last:mb-0">
                    {i === 0
                      ? <><strong className="font-display font-normal text-[18px] text-[#0D4A31] block mb-2">{para.split('.')[0]}.</strong>{para.slice(para.indexOf('.') + 1).trim()}</>
                      : para
                    }
                  </p>
                ))}

                {flag && (
                  <div className="inline-block mt-4 font-mono text-[10.5px] tracking-[0.08em] text-fg bg-[#0D4A31] px-3 py-1.5 uppercase">
                    {flag}
                  </div>
                )}

                <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5">
                  {links.map(({ label, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-mono text-[11.5px] tracking-[0.06em] text-ink border-b border-green pb-0.5 hover:text-green transition-colors duration-200"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
