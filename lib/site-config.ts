import { promises as fs } from 'fs'
import path from 'path'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Logo {
  src: string
  alt: string
}

export interface Director {
  name: string
  role: string
  years: string
  note: string
  portrait: string
}

export interface WorkConfig {
  title: string
  client: string
  genre: string
  category: 'Documentary' | 'Reality' | 'Sports' | 'Film' | 'Ad Film' | 'Short Film'
  accent: string
  award?: string
  srcs: string[]
}

export interface SectionConfig {
  id: string
  label: string
  enabled: boolean
}

export interface SiteConfig {
  meta: {
    studioName: string
    tagline: string
    email: string
    phone: string
    location: string
    established: string
  }
  reel: {
    posterSrc: string
    videoSrc: string
  }
  reelStrip: {
    rowA: string[]
    rowB: string[]
    rowC: string[]
  }
  directors: Director[]
  works: WorkConfig[]
  about: {
    imageSrc: string
    imageCaption: string
  }
  clients: {
    row1: Logo[]
    row2: Logo[]
    row3: Logo[]
  }
  sections: SectionConfig[]
}

// ─── Defaults (mirrors current hardcoded values) ──────────────────────────────

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'
const r2 = (folder: string, file: string) =>
  `${R2}/${encodeURIComponent(folder)}/${file}`

export const DEFAULT_CONFIG: SiteConfig = {
  meta: {
    studioName:  'Triangle Room',
    tagline:     'New company. Not new at this.',
    email:       'connect@triangleroom.in',
    phone:       '+91 98464 97008',
    location:    'Trivandrum, Kerala',
    established: '2025',
  },

  reel: {
    posterSrc: '/images/reel-poster.webp',
    videoSrc:  '',
  },

  reelStrip: {
    rowA: [16,32,48,64,80,96,112,128,144,160].map(s => `https://picsum.photos/seed/${s}/420/240`),
    rowB: [18,36,54,72,90,108,126,144,162,180].map(s => `https://picsum.photos/seed/${s}/240/300`),
    rowC: [22,44,66,88,110,132,154,176,198,220].map(s => `https://picsum.photos/seed/${s}/340/220`),
  },

  directors: [
    {
      name:     'Anu Kamala',
      role:     'Story & Post',
      years:    '18+',
      note:     'Series editor, The Greatest Rivalry. Film editor, Tarini. Best Editor — Asian Television Awards 2019.',
      portrait: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
    {
      name:     'Midhuna Pichy',
      role:     'Production & Delivery',
      years:    '11+',
      note:     'Three seasons of Bigg Boss Malayalam. Episode, post and creative producer across seven international formats.',
      portrait: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    {
      name:     'Jibin Babu',
      role:     'Development & Writing',
      years:    '9+',
      note:     'Writer-director. Pachamarakaikal — two Kerala State Awards. Music Mojo Season 7, Kappa TV.',
      portrait: 'https://randomuser.me/api/portraits/men/47.jpg',
    },
  ],

  works: [
    { title: 'The Greatest Rivalry',              client: 'Netflix',                    genre: 'Documentary Series',     category: 'Documentary', accent: '#1a3a20', srcs: [] },
    { title: 'Bigg Boss Malayalam',               client: 'Asianet',                    genre: 'Reality Series',         category: 'Reality',     accent: '#3a1a20', srcs: [] },
    { title: 'Pachamarakaikal',                   client: '',                           genre: 'Film',                   category: 'Film',        accent: '#1a2a3a', award: 'Two Kerala State Awards', srcs: [] },
    { title: 'Tarini',                            client: 'National Geographic',        genre: 'Documentary Film',       category: 'Documentary', accent: '#8a7030', award: 'Best Editor Nominee · 24th Asian Television Awards 2019', srcs: [`${R2}/03.jpg`] },
    { title: 'Fabulous Lives of Bollywood Wives', client: 'Netflix',                    genre: 'Reality Series',         category: 'Reality',     accent: '#6a2a30', srcs: [r2('Bollywood wives','01.jpg'), r2('Bollywood wives','02.jpg')] },
    { title: 'India from Above',                  client: 'National Geographic UK',     genre: 'Documentary Series',     category: 'Documentary', accent: '#2a5a30', srcs: [r2('India From Above','01.jpg'), r2('India From Above','02.jpg'), r2('India From Above','04.jpg')] },
    { title: 'Formula 1 After Movie',             client: 'Abu Dhabi Grand Prix',       genre: 'Motorsport Film',        category: 'Documentary', accent: '#8a4010', srcs: [r2('F1 After movie','01.jpg'), r2('F1 After movie','02.jpg'), r2('F1 After movie','03.jpg')] },
    { title: 'Great Overland Adventure',          client: 'Mercedes-Benz / NDTV Prime', genre: 'Travel Series',          category: 'Documentary', accent: '#1a4030', srcs: [r2('overland','01.jpg'), r2('overland','02.jpg'), r2('overland','03.jpg')] },
    { title: 'India vs Pakistan',                 client: 'Star Sports',                genre: 'Sports Highlights',      category: 'Sports',      accent: '#2a4a1a', srcs: [r2('India vs Pak','01.jpg'), r2('India vs Pak','02.jpg'), r2('India vs Pak','03.jpg')] },
    { title: 'Doubles Trouble',                   client: 'Olympic Channel',            genre: 'Documentary',            category: 'Documentary', accent: '#1a3a5a', srcs: [r2('Double trouble','01.jpg'), r2('Double trouble','02.jpg'), r2('Double trouble','03.jpg')] },
    { title: 'ICC Cricket World Cup 2015',        client: 'Star Sports',                genre: 'Live Sports Highlights', category: 'Sports',      accent: '#1a2a4a', srcs: [r2('World cup 15','01.jpg'), r2('World cup 15','02.jpg')] },
    { title: 'Kurup',                             client: '',                           genre: 'Film',                   category: 'Film',        accent: '#3a1a2a', srcs: [r2('Kurup','01.jpg'), r2('Kurup','02.jpg')] },
    { title: 'Rendezvous',                        client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#2a2a4a', srcs: [r2('rendezvous','01.jpg'), r2('rendezvous','03.jpg'), r2('rendezvous','05.jpg')] },
    { title: 'Midwicket Tales',                   client: '',                           genre: 'Cricket Documentary',    category: 'Documentary', accent: '#1a3a2a', srcs: [r2('Midwicket tales','01.jpg'), r2('Midwicket tales','02.jpg'), r2('Midwicket tales','04.jpg')] },
    { title: 'Moving in with Malaika',            client: '',                           genre: 'Reality Series',         category: 'Reality',     accent: '#4a2a1a', srcs: [r2('moving in with malaika','01.jpg'), r2('moving in with malaika','03.jpg'), r2('moving in with malaika','05.jpg')] },
    { title: 'Sound Trek',                        client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#3a1a3a', srcs: [r2('Sound trek','01.jpg'), r2('Sound trek','03.jpg'), r2('Sound trek','06.jpg')] },
    { title: 'Umeed',                             client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#2a3a1a', srcs: [r2('Umeed','01.jpg'), r2('Umeed','03.jpg'), r2('Umeed','05.jpg')] },
    { title: 'Nach Baliye 7',                     client: '',                           genre: 'Reality Series',         category: 'Reality',     accent: '#3a1a4a', srcs: [r2('Nach baliye 7','01.jpg'), r2('Nach baliye 7','02.jpg')] },
    { title: 'Red Bull',                          client: 'Red Bull',                   genre: 'Ad Film',                category: 'Ad Film',     accent: '#5a1a1a', srcs: [r2('redbull','01.jpg'), r2('redbull','02.jpg'), r2('redbull','03.jpg')] },
    { title: 'Sharekhan',                         client: 'Sharekhan',                  genre: 'Ad Film',                category: 'Ad Film',     accent: '#1a4a3a', srcs: [r2('Sharekhan ad film','01.jpg'), r2('Sharekhan ad film','02.jpg'), r2('Sharekhan ad film','03.jpg')] },
    { title: 'Aval Allah',                        client: '',                           genre: 'Film',                   category: 'Film',        accent: '#2a1a3a', srcs: [r2('Aval allah','01.jpg'), r2('Aval allah','02.jpg'), r2('Aval allah','04.jpg')] },
    { title: 'Hairdresser Show',                  client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#2a2a3a', srcs: [r2('Hairdresser show','01.jpg'), r2('Hairdresser show','02.jpg'), r2('Hairdresser show','03.jpg')] },
    { title: 'Expedition Borderland',             client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#3a2a1a', srcs: [r2('Expedition borderland','01.jpg'), r2('Expedition borderland','02.jpg')] },
    { title: 'Test Promotions',                   client: '',                           genre: 'Sports',                 category: 'Sports',      accent: '#2a3a2a', srcs: [r2('Test Promotions','01.jpg'), r2('Test Promotions','02.jpg'), r2('Test Promotions','03.jpg')] },
    { title: 'Tiago',                             client: 'Tata Motors',                genre: 'Ad Film',                category: 'Ad Film',     accent: '#1a3a4a', srcs: [r2('Tiago','01.jpg'), r2('Tiago','02.jpg')] },
    { title: "Mother's Day Film",                 client: '',                           genre: 'Short Film',             category: 'Short Film',  accent: '#3a2a2a', srcs: [r2("mother_s day film",'01.jpg'), r2("mother_s day film",'02.jpg')] },
    { title: 'Wedding Films',                     client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#3a3a1a', srcs: [r2('Wedding films','01.jpg'), r2('Wedding films','02.jpg')] },
  ],

  about: {
    imageSrc:     '',
    imageCaption: 'Mar Ivanios · Trivandrum',
  },

  clients: {
    row1: [
      { src: '/logos/netflix.png',         alt: 'Netflix' },
      { src: '/logos/prime-video.png',     alt: 'Prime Video' },
      { src: '/logos/discovery.png',       alt: 'Discovery Channel' },
      { src: '/logos/jiohotstar.png',      alt: 'JioHotstar' },
      { src: '/logos/star-sports.jpg',     alt: 'Star Sports' },
      { src: '/logos/formula1.avif',       alt: 'Formula 1' },
      { src: '/logos/mercedes.svg',        alt: 'Mercedes-Benz' },
    ],
    row2: [
      { src: '/logos/olympic-channel.png', alt: 'Olympic Channel' },
      { src: '/logos/red-bull.svg',        alt: 'Red Bull' },
      { src: '/logos/loreal.png',          alt: "L'Oréal" },
      { src: '/logos/fox-life.jpg',        alt: 'Fox Life' },
      { src: '/logos/epic-channel.jpg',    alt: 'Epic Channel' },
      { src: '/logos/colors-tv.webp',      alt: 'Colors TV' },
    ],
    row3: [
      { src: '/logos/ndtv.png',            alt: 'NDTV' },
      { src: '/logos/endemol-shine.png',   alt: 'Endemol Shine India' },
      { src: '/logos/banijay-asia.png',    alt: 'Banijay Asia' },
      { src: '/logos/dharmatic.webp',      alt: 'Dharmatic Entertainment' },
      { src: '/logos/jellysmack.png',      alt: 'Jellysmack' },
      { src: '/logos/prime-focus.jpg',     alt: 'Prime Focus Technologies' },
    ],
  },

  sections: [
    { id: 'hero',      label: 'Hero',              enabled: true },
    { id: 'marquee1',  label: 'Marquee (top)',      enabled: true },
    { id: 'reel',      label: 'Reel Puzzle',        enabled: true },
    { id: 'statement', label: 'Statement',          enabled: true },
    { id: 'clients',   label: 'Client Logos',       enabled: true },
    { id: 'about',     label: 'About',              enabled: true },
    { id: 'directors', label: 'Directors',          enabled: true },
    { id: 'marquee2',  label: 'Marquee (mid)',       enabled: true },
    { id: 'gallery',   label: 'Gallery Strip',      enabled: true },
    { id: 'scatter',   label: 'Scatter Statement',  enabled: true },
    { id: 'work',      label: 'Work',               enabled: true },
    { id: 'contact',   label: 'Contact / Footer',   enabled: true },
  ],
}

// ─── Persistence ──────────────────────────────────────────────────────────────

const CONFIG_PATH = path.join(process.cwd(), 'config', 'site.json')

export async function readConfig(): Promise<SiteConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf8')
    // Shallow-merge top-level keys so any new default keys survive
    return { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as Partial<SiteConfig>) }
  } catch {
    return DEFAULT_CONFIG
  }
}

export async function writeConfig(config: SiteConfig): Promise<void> {
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true })
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8')
}
