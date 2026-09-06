// Shared works data — imported by all WorksV* variants

const R2 = 'https://pub-3620a4d683ac49fe86da0dbcd1edd71c.r2.dev/works'
const r2 = (folder: string, file: string) =>
  `${R2}/${encodeURIComponent(folder)}/${file}`

export type Work = {
  index: string
  title: string
  client: string
  genre: string
  category: 'Documentary' | 'Reality' | 'Sports' | 'Film' | 'Ad Film' | 'Short Film'
  accent: string
  award?: string
  srcs: string[]
}

const raw: Omit<Work, 'index'>[] = [
  { title: 'The Greatest Rivalry',             client: 'Netflix',                    genre: 'Documentary Series',     category: 'Documentary', accent: '#1a3a20', srcs: [] },
  { title: 'Bigg Boss Malayalam',              client: 'Asianet',                    genre: 'Reality Series',         category: 'Reality',     accent: '#3a1a20', srcs: [] },
  { title: 'Pachamarakaikal',                  client: '',                           genre: 'Film',                   category: 'Film',        award: 'Two Kerala State Awards', accent: '#1a2a3a', srcs: [] },
  { title: 'Tarini',                           client: 'National Geographic',        genre: 'Documentary Film',       category: 'Documentary', award: 'Best Editor Nominee · 24th Asian Television Awards 2019', accent: '#8a7030', srcs: [r2('Tarini','01.jpg')] },
  { title: 'Fabulous Lives of Bollywood Wives',client: 'Netflix',                    genre: 'Reality Series',         category: 'Reality',     accent: '#6a2a30', srcs: [r2('Bollywood wives','01.jpg'), r2('Bollywood wives','02.jpg')] },
  { title: 'India from Above',                 client: 'National Geographic UK',     genre: 'Documentary Series',     category: 'Documentary', accent: '#2a5a30', srcs: [r2('India From Above','01.jpg'), r2('India From Above','02.jpg'), r2('India From Above','04.jpg')] },
  { title: 'Formula 1 After Movie',            client: 'Abu Dhabi Grand Prix',       genre: 'Motorsport Film',        category: 'Documentary', accent: '#8a4010', srcs: [r2('F1 After movie','01.jpg'), r2('F1 After movie','02.jpg'), r2('F1 After movie','03.jpg')] },
  { title: 'Great Overland Adventure',         client: 'Mercedes-Benz / NDTV Prime', genre: 'Travel Series',         category: 'Documentary', accent: '#1a4030', srcs: [r2('overland','01.jpg'), r2('overland','02.jpg'), r2('overland','03.jpg')] },
  { title: 'India vs Pakistan',                client: 'Star Sports',                genre: 'Sports Highlights',      category: 'Sports',      accent: '#2a4a1a', srcs: [r2('India vs Pak','01.jpg'), r2('India vs Pak','02.jpg'), r2('India vs Pak','03.jpg')] },
  { title: 'Doubles Trouble',                  client: 'Olympic Channel',            genre: 'Documentary',            category: 'Documentary', accent: '#1a3a5a', srcs: [r2('Double trouble','01.jpg'), r2('Double trouble','02.jpg'), r2('Double trouble','03.jpg')] },
  { title: 'ICC Cricket World Cup 2015',       client: 'Star Sports',                genre: 'Live Sports Highlights', category: 'Sports',      accent: '#1a2a4a', srcs: [r2('World cup 15','01.jpg'), r2('World cup 15','02.jpg')] },
  { title: 'Kurup',                            client: '',                           genre: 'Film',                   category: 'Film',        accent: '#3a1a2a', srcs: [r2('Kurup','01.jpg'), r2('Kurup','02.jpg')] },
  { title: 'Rendezvous',                       client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#2a2a4a', srcs: [r2('rendezvous','01.jpg'), r2('rendezvous','03.jpg'), r2('rendezvous','05.jpg')] },
  { title: 'Midwicket Tales',                  client: '',                           genre: 'Cricket Documentary',    category: 'Documentary', accent: '#1a3a2a', srcs: [r2('Midwicket tales','01.jpg'), r2('Midwicket tales','02.jpg'), r2('Midwicket tales','03.jpg')] },
  { title: 'Moving in with Malaika',           client: '',                           genre: 'Reality Series',         category: 'Reality',     accent: '#4a2a1a', srcs: [r2('moving in with malaika','01.jpg'), r2('moving in with malaika','03.jpg'), r2('moving in with malaika','05.jpg')] },
  { title: 'Sound Trek',                       client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#3a1a3a', srcs: [r2('Sound trek','01.jpg'), r2('Sound trek','03.jpg'), r2('Sound trek','06.jpg')] },
  { title: 'Umeed',                            client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#2a3a1a', srcs: [r2('Umeed','01.jpg'), r2('Umeed','03.jpg'), r2('Umeed','05.jpg')] },
  { title: 'Nach Baliye 7',                    client: '',                           genre: 'Reality Series',         category: 'Reality',     accent: '#3a1a4a', srcs: [r2('Nach baliye 7','01.jpg'), r2('Nach baliye 7','02.jpg')] },
  { title: 'Red Bull',                         client: 'Red Bull',                   genre: 'Ad Film',                category: 'Ad Film',     accent: '#5a1a1a', srcs: [r2('redbull','01.jpg'), r2('redbull','02.jpg'), r2('redbull','03.jpg')] },
  { title: 'Sharekhan',                        client: 'Sharekhan',                  genre: 'Ad Film',                category: 'Ad Film',     accent: '#1a4a3a', srcs: [r2('Sharekhan ad film','01.jpg'), r2('Sharekhan ad film','02.jpg'), r2('Sharekhan ad film','03.jpg')] },
  { title: 'Aval Allah',                       client: '',                           genre: 'Film',                   category: 'Film',        accent: '#2a1a3a', srcs: [r2('Aval allah','01.jpg'), r2('Aval allah','02.jpg'), r2('Aval allah','04.jpg')] },
  { title: 'Hairdresser Show',                 client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#2a2a3a', srcs: [r2('Hairdresser show','01.jpg'), r2('Hairdresser show','02.jpg'), r2('Hairdresser show','03.jpg')] },
  { title: 'Expedition Borderland',            client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#3a2a1a', srcs: [r2('Expedition borderland','01.jpg'), r2('Expedition borderland','02.jpg')] },
  { title: 'Test Promotions',                  client: '',                           genre: 'Sports',                 category: 'Sports',      accent: '#2a3a2a', srcs: [r2('Test Promotions','01.jpg'), r2('Test Promotions','02.jpg'), r2('Test Promotions','03.jpg')] },
  { title: 'Tiago',                            client: 'Tata Motors',                genre: 'Ad Film',                category: 'Ad Film',     accent: '#1a3a4a', srcs: [r2('Tiago','01.jpg'), r2('Tiago','02.jpg')] },
  { title: "Mother's Day Film",                client: '',                           genre: 'Short Film',             category: 'Short Film',  accent: '#3a2a2a', srcs: [r2('mother_s day film','01.jpg'), r2('mother_s day film','02.jpg')] },
  { title: 'Wedding Films',                    client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#3a3a1a', srcs: [r2('Wedding films','01.jpg'), r2('Wedding films','02.jpg')] },
  { title: 'Blinkit',                         client: 'Blinkit',                    genre: 'Ad Film',                category: 'Ad Film',     accent: '#1a3a10', srcs: [r2('Blinkit','01.jpg')] },
  { title: 'Mega Icons',                      client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#2a3a4a', srcs: [r2('Mega Icons','01.jpg')] },
  { title: 'Unacademy',                       client: 'Unacademy',                  genre: 'Ad Film',                category: 'Ad Film',     accent: '#1a2a4a', srcs: [r2('Unacademy','01.jpg')] },
  { title: 'Uppu Kappuramu',                  client: '',                           genre: 'Film',                   category: 'Film',        accent: '#2a1a2a', srcs: [r2('Uppu Kappuramu','01.jpg')] },
  { title: 'Master of Taste',                 client: '',                           genre: 'Documentary',            category: 'Documentary', accent: '#3a2a3a', srcs: [r2('master of taste','01.jpg'), r2('master of taste','02.jpg')] },
]

export const WORKS: Work[] = raw.map((p, i) => ({
  ...p,
  index: String(i + 1).padStart(2, '0'),
}))

export const CATEGORIES = ['All', 'Documentary', 'Reality', 'Sports', 'Film', 'Ad Film', 'Short Film'] as const
