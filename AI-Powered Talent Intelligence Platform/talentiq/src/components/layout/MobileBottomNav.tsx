'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Briefcase, GitMerge, Calendar, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MobileBottomNav() {
  const pathname = usePathname()

  const tabs = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Jobs', href: '/jobs', icon: Briefcase },
    { name: 'Pipeline', href: '/pipeline', icon: GitMerge },
    { name: 'Interviews', href: '/interviews', icon: Calendar },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] h-[64px] bg-white border-t border-[#E5E7EB] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden flex justify-between px-[8px]">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href)
        const Icon = tab.icon
        
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex-1 flex flex-col items-center justify-center gap-[2px] p-[10px]"
          >
            <Icon 
              size={20} 
              className={cn(isActive ? "text-primary-500" : "text-neutral-400")} 
            />
            <span className={cn(
              "text-[10px] font-semibold",
              isActive ? "text-primary-600" : "text-neutral-500"
            )}>
              {tab.name}
            </span>
          </Link>
        )
      })}
      
      <button className="flex-1 flex flex-col items-center justify-center gap-[2px] p-[10px] text-neutral-400">
        <Menu size={20} />
        <span className="text-[10px] font-semibold text-neutral-500">More</span>
      </button>
    </div>
  )
}
