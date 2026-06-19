import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import MarketingNav from '@/components/layout/MarketingNav'
import Footer from '@/components/layout/Footer'
import SmoothScrollProvider from '@/providers/SmoothScrollProvider'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies()
  const isLoggedIn = !!cookieStore.get('accessToken')?.value
  return (
    <SmoothScrollProvider>
      <MarketingNav isLoggedIn={isLoggedIn} />
      <main id="main">{children}</main>
      <Footer />
    </SmoothScrollProvider>
  )
}
