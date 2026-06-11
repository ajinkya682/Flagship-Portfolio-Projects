"use client"

import * as React from "react"
import { Sidebar } from "./Sidebar"
import { AppHeader } from "./AppHeader"
import { MobileBottomNav } from "./MobileBottomNav"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900 overflow-hidden">
      
      {/* Sidebar - fixed on left */}
      <div className="hidden md:block">
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
      </div>

      {/* Main layout column */}
      <div className="flex flex-1 flex-col min-w-0 pb-[64px] md:pb-0">
        
        {/* App Header - sticky top */}
        <AppHeader />

        {/* Page Content */}
        <main id="main-content" className="flex-1 overflow-auto custom-scrollbar px-[16px] md:px-0">
          {children}
        </main>
        
      </div>

      <MobileBottomNav />
    </div>
  )
}
