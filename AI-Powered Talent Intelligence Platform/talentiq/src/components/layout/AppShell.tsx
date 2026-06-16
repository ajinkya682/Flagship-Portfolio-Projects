'use client'

import { ReactNode, useEffect } from 'react'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'
import Sidebar from './Sidebar'
import AppHeader from './AppHeader'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav'

export default function AppShell({ children }: { children: ReactNode }) {
  const { sidebarCollapsed } = useUIStore()
  const { user, fetchUser } = useAuthStore()
  const { fetchJobs } = useJobsStore()
  const { fetchCandidates } = useCandidatesStore()

  useEffect(() => {
    // If the middleware allowed us here but the user state is missing 
    // (e.g. local storage cleared), hydrate the session from the database via the secure cookie
    if (!user) {
      fetchUser()
    }
    fetchJobs()
    fetchCandidates()
  }, [fetchJobs, fetchCandidates, fetchUser, user])

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

