import { Analytics } from '@vercel/analytics/next'
import { DM_Sans, Instrument_Serif, Noto_Sans_Arabic } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', variable: '--font-instrument-serif' })
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-noto-arabic' })

export const metadata: Metadata = {
  title: 'Sham AI — Create without limits',
  description: 'Sham AI is an enterprise creative suite for presentations, websites, documents, career tools, images, vectors, text, code, and audio.',
  generator: 'Sham AI',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${dmSans.variable} ${instrumentSerif.variable} ${notoArabic.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
