import * as React from "react"
import { MarketingNav } from "@/components/layout/MarketingNav"
import { Footer } from "@/components/layout/Footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#F9FAFB]">
      <MarketingNav />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
