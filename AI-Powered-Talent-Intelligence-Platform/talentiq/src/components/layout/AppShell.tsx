'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/store/ui.store'
import { useAuthStore } from '@/store/auth.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'
import Sidebar from './Sidebar'
import AppHeader from './AppHeader'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav'

export default function AppShell({ children }: { children: ReactNode }) {
  const { sidebarCollapsed } = useUIStore()
  const { user, fetchUser, isLoading } = useAuthStore()
  const { fetchJobs } = useJobsStore()
  const { fetchCandidates } = useCandidatesStore()
  const router = useRouter()
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false)

  useEffect(() => {
    if (!user) {
      fetchUser().finally(() => setHasAttemptedAuth(true))
    } else {
      setHasAttemptedAuth(true)
    }
  }, [fetchUser, user])

  useEffect(() => {
    if (hasAttemptedAuth && !user && !isLoading) {
      router.push('/login')
    } else if (hasAttemptedAuth && user) {
      fetchJobs()
      fetchCandidates()
    }
  }, [hasAttemptedAuth, user, isLoading, router, fetchJobs, fetchCandidates])

  if (!user || isLoading || !hasAttemptedAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-body text-sm">Loading your workspace...</p>
        </div>
      </div>
    )
  }

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

