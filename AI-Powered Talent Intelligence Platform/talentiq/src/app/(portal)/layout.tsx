import { ReactNode } from 'react'
import PortalHeader from '@/components/portal/PortalHeader'

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col font-body">
      <PortalHeader />
      <main id="main" className="flex-grow pt-[60px]">
        {children}
      </main>
    </div>
  )
}
