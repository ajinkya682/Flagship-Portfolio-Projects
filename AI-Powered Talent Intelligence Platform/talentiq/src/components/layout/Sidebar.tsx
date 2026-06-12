'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUIStore } from '@/store/ui.store'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { cn } from '@/lib/utils'
import {
  ChevronLeft,
  ChevronDown,
  LayoutDashboard,
  Briefcase,
  Users,
  GitMerge,
  Calendar,
  FileText,
  MessageSquare,
  BarChart2,
  Lightbulb,
  Settings,
  Hexagon,
  Bell,
  Plus,
  Zap,
} from 'lucide-react'

interface NavItemProps {
  icon: React.ElementType
  label: string
  href: string
  isCollapsed: boolean
  isActive: boolean
  badge?: number
  isNew?: boolean
}

function NavItem({ icon: Icon, label, href, isCollapsed, isActive, badge, isNew }: NavItemProps) {
  return (
    <Link
      href={href}
      title={isCollapsed ? label : undefined}
      className={cn(
        'relative flex items-center gap-[10px] px-[10px] py-[8px] rounded-[10px] transition-all duration-200 group overflow-hidden',
        isActive
          ? 'bg-blue-50/80 text-blue-700 font-semibold'
          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/50 font-medium'
      )}
    >
      {/* Active Left Accent */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[20px] bg-blue-600 rounded-r-full" />
      )}
      
      {/* Icon */}
      <div className={cn(
        'shrink-0 w-[32px] h-[32px] flex items-center justify-center rounded-[8px] transition-all duration-200',
        isActive ? 'bg-white text-blue-600 shadow-sm border border-blue-100/50' : 'text-neutral-400 group-hover:text-neutral-600'
      )}>
        <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
      </div>

      {/* Label */}
      {!isCollapsed && (
        <span className="font-body text-[13px] truncate flex-1 transition-all duration-200">
          {label}
        </span>
      )}

      {/* Badges */}
      {!isCollapsed && badge !== undefined && (
        <span className={cn(
          'shrink-0 min-w-[20px] h-[20px] rounded-full text-[11px] font-bold flex items-center justify-center px-[6px] transition-all',
          isActive ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200'
        )}>
          {badge}
        </span>
      )}
      {!isCollapsed && isNew && (
        <span className="shrink-0 text-[10px] font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-[6px] py-[2px] rounded-full uppercase tracking-wide shadow-sm">
          New
        </span>
      )}

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="bg-neutral-800 text-white text-[12px] font-medium px-[10px] py-[6px] rounded-[6px] whitespace-nowrap shadow-xl">
            {label}
          </div>
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-800" />
        </div>
      )}
    </Link>
  )
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const pathname = usePathname()
  const { user } = useCurrentUser()

  return (
    <div
      className={cn(
        'fixed left-0 top-0 h-screen z-40 bg-[#FAFAFA] border-r border-neutral-200/80 transition-all duration-300 ease-in-out hidden md:flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]',
        sidebarCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-[12px] top-[72px] w-[24px] h-[24px] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-neutral-200 flex items-center justify-center cursor-pointer z-50 hover:bg-neutral-50 hover:scale-105 transition-all"
      >
        <ChevronLeft
          size={12}
          className={cn('text-neutral-500 transition-transform duration-300', sidebarCollapsed && 'rotate-180')}
        />
      </button>

      {/* TOP: Logo + Brand */}
      <div className={cn(
        'relative z-10 flex items-center gap-[12px] px-[16px] border-b border-neutral-200/60 bg-white/50 backdrop-blur-sm',
        sidebarCollapsed ? 'justify-center h-[64px]' : 'h-[64px]'
      )}>
        <div className="w-[34px] h-[34px] shrink-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[10px] flex items-center justify-center shadow-md shadow-blue-500/20 border border-blue-500/20">
          <Hexagon size={18} className="text-white fill-white/20" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <span className="font-display text-[19px] font-bold text-neutral-900 tracking-tight">
            TalentIQ
          </span>
        )}
      </div>

      {/* Workspace Switcher */}
      {!sidebarCollapsed && (
        <div className="relative z-10 px-[16px] mt-[16px] mb-[8px]">
          <button className="w-full flex items-center gap-[12px] px-[12px] py-[10px] rounded-[12px] bg-white border border-neutral-200/80 shadow-sm hover:border-neutral-300 hover:shadow-md transition-all group">
            <div className="w-[32px] h-[32px] shrink-0 rounded-[8px] bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center shadow-inner">
              <span className="text-white font-bold text-[12px]">AC</span>
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-[13px] font-semibold text-neutral-900 truncate">Acme Corp</p>
              <div className="flex items-center gap-[4px] mt-[2px]">
                <Zap size={10} className="text-amber-500 fill-amber-500/20" />
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Growth Plan</span>
              </div>
            </div>
            <ChevronDown size={14} className="text-neutral-400 group-hover:text-neutral-600 shrink-0 transition-colors" />
          </button>
        </div>
      )}
      {sidebarCollapsed && (
        <div className="relative z-10 flex justify-center mt-[16px] mb-[8px]">
          <div className="w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center shadow-sm cursor-pointer border border-neutral-700">
            <span className="text-white font-bold text-[13px]">AC</span>
          </div>
        </div>
      )}

      {/* Quick Create Button */}
      {!sidebarCollapsed && (
        <div className="relative z-10 px-[16px] mb-[12px]">
          <Link href="/jobs/new" className="w-full flex items-center justify-center gap-[6px] h-[38px] rounded-[10px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all text-white shadow-md shadow-blue-500/20 font-body text-[13px] font-semibold hover:-translate-y-[1px]">
            <Plus size={15} strokeWidth={2.5} />
            Post a Job
          </Link>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="relative z-10 flex-1 overflow-y-auto px-[12px] flex flex-col gap-[4px] pb-[20px] scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
        
        {/* Main group */}
        {!sidebarCollapsed && (
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[1.2px] px-[12px] pt-[12px] pb-[6px]">Main</p>
        )}
        <NavItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" isCollapsed={sidebarCollapsed} isActive={pathname === '/dashboard'} />
        <NavItem icon={Briefcase} label="Jobs" href="/jobs" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/jobs')} />
        <NavItem icon={Users} label="Candidates" href="/applications" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/applications')} badge={12} />
        <NavItem icon={GitMerge} label="Pipeline" href="/pipeline" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/pipeline')} />

        {/* Recruiting group */}
        {!sidebarCollapsed && (
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[1.2px] px-[12px] pt-[20px] pb-[6px]">Recruiting</p>
        )}
        {sidebarCollapsed && <div className="h-[1px] bg-neutral-200/60 mx-[12px] my-[12px]" />}
        <NavItem icon={Calendar} label="Interviews" href="/interviews" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/interviews')} badge={3} />
        <NavItem icon={FileText} label="Offers" href="/offers" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/offers')} />
        <NavItem icon={MessageSquare} label="Messages" href="/messages" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/messages')} />

        {/* Insights group */}
        {!sidebarCollapsed && (
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-[1.2px] px-[12px] pt-[20px] pb-[6px]">Insights</p>
        )}
        {sidebarCollapsed && <div className="h-[1px] bg-neutral-200/60 mx-[12px] my-[12px]" />}
        <NavItem icon={BarChart2} label="Analytics" href="/analytics" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/analytics')} />
        <NavItem icon={Lightbulb} label="AI Insights" href="/insights" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/insights')} badge={5} isNew />
      </div>

      {/* BOTTOM: User Profile + Settings */}
      <div className="relative z-10 border-t border-neutral-200/80 p-[16px] bg-white/50 backdrop-blur-sm">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-[12px]">
            <div className="relative shrink-0">
              <div className="w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border border-neutral-200 shadow-sm">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-700 font-bold text-[14px]">{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <span className="absolute -bottom-[2px] -right-[2px] w-[10px] h-[10px] rounded-full bg-emerald-500 border-[2px] border-white shadow-sm" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[13px] font-bold text-neutral-900 truncate">{user?.name || 'Sarah Recruiter'}</p>
              <p className="text-[11px] font-medium text-neutral-500 truncate">{user?.email || 'sarah@acme.com'}</p>
            </div>
            <Link href="/settings" className="p-[8px] rounded-[8px] text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-all">
              <Settings size={16} />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-[12px]">
            <div className="relative">
              <div className="w-[36px] h-[36px] rounded-[10px] bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border border-neutral-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-700 font-bold text-[14px]">{user?.name?.charAt(0) || 'U'}</span>
                )}
              </div>
              <span className="absolute -bottom-[2px] -right-[2px] w-[10px] h-[10px] rounded-full bg-emerald-500 border-[2px] border-white shadow-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
