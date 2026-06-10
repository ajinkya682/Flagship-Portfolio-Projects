"use client"

import * as React from "react"
import { MarketingNav } from "@/components/marketing/MarketingNav"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { AppHeader } from "@/components/dashboard/AppHeader"
import { MobileBottomNav } from "@/components/dashboard/MobileBottomNav"
import { Button } from "@/components/ui/button"

export default function NavigationTestPage() {
  const [activeTab, setActiveTab] = React.useState<"home" | "jobs" | "pipeline" | "interviews" | "more">("home")
  const [activePath, setActivePath] = React.useState("/dashboard")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)

  // Force body to have height to test scrolling on Marketing Nav
  React.useEffect(() => {
    document.body.style.minHeight = "200vh"
    return () => {
      document.body.style.minHeight = "auto"
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-neutral-100 font-body pb-[80px]">
      
      {/* 1. MARKETING NAV TEST */}
      <section className="mb-12 border-b border-neutral-300 pb-12 bg-white">
        <div className="bg-neutral-50 px-8 py-4 mb-8">
          <h2 className="font-display text-xl font-bold">1. Marketing Nav</h2>
          <p className="text-neutral-500">Scroll down to see the sticky/frosted glass effect. Resize to mobile to see drawer.</p>
        </div>
        
        {/* Render Marketing Nav */}
        <MarketingNav />
        
        <div className="max-w-5xl mx-auto px-8 py-16 h-[400px]">
          <h3 className="font-display text-4xl font-bold mb-4">Hero Content</h3>
          <p className="text-neutral-600 max-w-2xl text-lg">
            This space simulates the marketing page content. Scroll down slowly and watch the Marketing Nav bar above. At 0px scroll it should be mostly transparent. After 60px it should become frosted glass with a border and shadow.
          </p>
        </div>
      </section>

      {/* 2. APP LAYOUT TEST */}
      <section className="bg-white">
        <div className="bg-neutral-50 px-8 py-4 border-b border-neutral-200">
          <h2 className="font-display text-xl font-bold">2. App Layout (Sidebar + Header + Mobile Tab Bar)</h2>
          <p className="text-neutral-500">Simulates the dashboard app layout. Try toggling the sidebar, clicking menu items, and resizing to mobile to see the bottom tab bar.</p>
        </div>
        
        {/* Simulated App Container */}
        <div className="relative mx-auto my-8 flex h-[700px] max-w-[1200px] overflow-hidden rounded-2xl border border-neutral-300 shadow-xl bg-neutral-50">
          
          {/* Sidebar */}
          <div className="hidden sm:block z-50">
            <AppSidebar 
              activePath={activePath} 
              isCollapsed={isSidebarCollapsed}
              onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            {/* Click handlers mapped for testing */}
            <div className="absolute inset-y-0 left-0 w-full bg-transparent" style={{ pointerEvents: 'none' }}>
               <style dangerouslySetInnerHTML={{ __html: `
                 aside [class*="group relative flex"] { pointer-events: auto; }
               `}} />
               {/* This is just a hack for the test page to make the sidebar items clickable and update state */}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden relative">
            
            {/* App Header */}
            <AppHeader 
              pageTitle="Candidates"
              breadcrumbs={[{ name: "Dashboard" }, { name: "Engineering" }]}
              unreadNotifications={true}
            />

            {/* Content Body */}
            <main className="flex-1 overflow-y-auto p-8">
              <h1 className="font-display text-2xl font-bold mb-6">Main Content Area</h1>
              
              <div className="flex gap-4 mb-8">
                <Button 
                  variant="secondary" 
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="sm:hidden"
                >
                  (Toggle sidebar only works on Desktop)
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm h-48 flex flex-col justify-between">
                    <div className="h-4 w-1/3 bg-neutral-100 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-neutral-100 rounded"></div>
                      <div className="h-2 w-5/6 bg-neutral-100 rounded"></div>
                      <div className="h-2 w-4/6 bg-neutral-100 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </main>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav 
              activeTab={activeTab} 
              onTabChange={setActiveTab} 
            />
          </div>
        </div>
      </section>

    </div>
  )
}
