import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from 'next/font/google'
import { QueryProvider } from '@/lib/QueryProvider'
import './globals.css'
import type { ReactNode } from 'react'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  title: 'TalentIQ — AI-Powered Talent Intelligence',
  description:
    'Stop losing great candidates to outdated filters. TalentIQ scores every applicant with explainable AI.',
  openGraph: {
    title: 'TalentIQ — AI-Powered Talent Intelligence',
    description:
      'Stop losing great candidates to outdated filters. TalentIQ scores every applicant with explainable AI.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    images: ['/images/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-md focus:shadow-brand"
        >
          Skip to main content
        </a>
        <QueryProvider>
          <main id="main">{children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}
