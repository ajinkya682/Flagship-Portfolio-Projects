import * as React from "react"
import SettingsNav from "@/components/settings/SettingsNav"

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row p-[16px] md:p-[32px] w-full max-w-[1200px] mx-auto animate-fade-in gap-[24px] md:gap-[48px]">
      <SettingsNav />
      <div className="flex-1 w-full max-w-[720px]">
        {children}
      </div>
    </div>
  )
}
