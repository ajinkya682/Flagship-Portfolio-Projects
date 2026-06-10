import * as React from "react"
import { PortalHeader } from "@/components/portal/PortalHeader"

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <PortalHeader />
      <div className="flex-1 w-full bg-white">
        {children}
      </div>
    </div>
  )
}
