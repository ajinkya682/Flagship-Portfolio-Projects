import { ReactNode } from 'react'
import MarketingNav from '@/components/layout/MarketingNav'
import Footer from '@/components/layout/Footer'
import SmoothScrollProvider from '@/providers/SmoothScrollProvider'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <SmoothScrollProvider>
      <MarketingNav />
      <main id="main">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  )
}
