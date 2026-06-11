import { ReactNode } from 'react'
import MarketingNav from '@/components/layout/MarketingNav'
import Footer from '@/components/layout/Footer'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MarketingNav />
      <main id="main">{children}</main>
      <Footer />
    </>
  )
}
