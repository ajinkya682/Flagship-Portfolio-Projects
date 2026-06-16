'use client'

import { ReactNode } from 'react'
import { useUIStore } from '@/store/ui.store'
import Sidebar from './Sidebar'
import AppHeader from './AppHeader'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav'

export default function AppShell({ children }: { children: ReactNode }) {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 font-body">
      <Sidebar />
      <div 
        className={`flex flex-col flex-grow overflow-hidden transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[64px]' : 'lg:pl-[260px]'}`}
      >
        <AppHeader />
        <main 
          id="main" 
          className="flex-grow overflow-y-auto p-[16px] md:p-[32px] pb-[80px] md:pb-[32px]"
        >
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  )
}

