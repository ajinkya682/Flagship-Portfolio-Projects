'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Briefcase, GitMerge, Calendar, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Candidates', href: '/applications', icon: Users },
  { name: 'Pipeline', href: '/pipeline', icon: GitMerge },
  { name: 'Interviews', href: '/interviews', icon: Calendar },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
      {/* Glassmorphism bar */}
      <div className="bg-white/90 backdrop-blur-xl border-t border-neutral-100 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] flex justify-around px-[4px] pb-safe">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/dashboard' && pathname.startsWith(tab.href))
          const Icon = tab.icon

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-[3px] pt-[8px] pb-[10px] transition-all duration-200 relative group'
              )}
            >
              {/* Active glow pill */}
              {isActive && (
                <span className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[32px] h-[3px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              )}

              <div className={cn(
                'w-[34px] h-[28px] flex items-center justify-center rounded-[8px] transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-br from-blue-500/15 to-indigo-500/10 text-blue-600'
                  : 'text-neutral-400 group-active:scale-90'
              )}>
                <Icon
                  size={19}
                  className={cn(
                    'transition-all duration-200',
                    isActive ? 'text-blue-600' : 'text-neutral-400'
                  )}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span className={cn(
                'text-[9px] font-semibold tracking-wide transition-colors duration-200',
                isActive ? 'text-blue-600' : 'text-neutral-400'
              )}>
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
