"use client"

import * as React from "react"
import { Sidebar } from "./Sidebar"
import { AppHeader } from "./AppHeader"

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans antialiased text-neutral-900">
      
      {/* Sidebar - fixed on left */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Main layout column */}
      <div className="flex flex-1 flex-col min-w-0">
        
        {/* App Header - sticky top */}
        <AppHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
      </div>
    </div>
  )
}
