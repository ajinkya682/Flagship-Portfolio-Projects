import * as React from "react"
import { MarketingNav } from "@/components/layout/MarketingNav"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-[#F9FAFB]">
      <MarketingNav />
      <main className="flex-1">{children}</main>
      {/* Footer will go here later */}
    </div>
  )
}
