import { ReactNode } from 'react'
import Link from 'next/link'
import { Hexagon } from 'lucide-react'

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-body">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-white border-b border-neutral-100 flex items-center justify-between px-[24px] z-50">
        <Link href="/" className="flex items-center gap-2">
          <Hexagon className="w-6 h-6 text-primary-600 fill-primary-600" />
          <span className="font-display text-[18px] font-bold text-neutral-900 tracking-tight">TalentIQ</span>
        </Link>
        
        <Link 
          href="/dashboard" 
          className="text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Exit setup
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-[120px] pb-[64px] px-[24px] overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
