import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans, JetBrains_Mono, Syne } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/SmoothScroll'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-spacegrotesk',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dmsans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne-next',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Triangle Room',
  description:
    'An independent production house from Trivandrum. Documentary, reality, live, music, fiction and ad film. Three partners. Thirty-eight years combined in the industry.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${syne.variable}`}
    >
      <body>
        <div className="grain" aria-hidden="true" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
