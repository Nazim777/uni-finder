import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://yoursite.com'),
  title: {
    default: 'Find Your Perfect University | Global University Search',
    template: '%s | University Finder'
  },
  description: 'Discover and compare top universities worldwide. Search by location, tuition fees, rankings, programs, and more. Find your ideal educational institution with advanced filters and side-by-side comparison tools.',
  keywords: [
    'university finder',
    'college search',
    'university comparison',
    'study abroad',
    'university rankings',
    'tuition fees',
    'higher education',
    'international universities',
    'university programs',
    'admission rates'
  ],
  authors: [{ name: 'University Finder' }],
  creator: 'University Finder',
  publisher: 'University Finder',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yoursite.com',
    title: 'Find Your Perfect University',
    description: 'Discover and compare top universities worldwide with advanced search filters.',
    siteName: 'University Finder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Perfect University',
    description: 'Discover and compare top universities worldwide with advanced search filters.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
