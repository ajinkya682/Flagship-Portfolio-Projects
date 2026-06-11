'use client'

import { usePathname } from 'next/navigation'
import { useUIStore } from '@/store/ui.store'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { cn } from '@/lib/utils'
import SidebarItem from './SidebarItem'
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
  Settings
} from 'lucide-react'

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const pathname = usePathname()
  const { user } = useCurrentUser()

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-screen z-40 bg-white border-r border-[#E5E7EB] transition-all duration-300 ease-in-out hidden md:flex flex-col justify-between",
        sidebarCollapsed ? "w-[64px]" : "w-[260px]"
      )}
    >
      <button 
        onClick={toggleSidebar}
        className="absolute -right-[12px] top-[72px] w-[24px] h-[24px] rounded-full bg-white shadow-md border border-[#E5E7EB] flex items-center justify-center cursor-pointer z-50 hover:bg-neutral-50 transition-colors"
      >
        <ChevronLeft 
          size={12} 
          className={cn("text-neutral-400 transition-transform duration-300", sidebarCollapsed && "rotate-180")} 
        />
      </button>

      {/* TOP SECTION */}
      <div className="flex flex-col">
        <div className="p-[20px] px-[16px] flex items-center justify-between cursor-pointer hover:bg-neutral-50 transition-colors">
          <div className="flex items-center gap-[12px] overflow-hidden">
            <div className="w-[28px] h-[28px] shrink-0 rounded-full bg-primary-50 flex items-center justify-center">
              <span className="text-primary-600 font-display font-bold text-[12px]">AC</span>
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col">
                <div className="flex items-center gap-[6px]">
                  <span className="text-[14px] font-semibold text-neutral-900 truncate">Acme Corp</span>
                  <ChevronDown size={14} className="text-neutral-400 shrink-0" />
                </div>
                <div className="w-fit bg-accent-100 text-accent-700 text-[10px] font-semibold px-[6px] py-[2px] rounded-full mt-[2px]">
                  Growth
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NAVIGATION GROUPS */}
        <div className="px-[12px] flex flex-col gap-[24px] mt-[8px]">
          {/* Main group */}
          <div className="flex flex-col gap-[4px]">
            {!sidebarCollapsed && <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-[12px] mb-[4px]">Main</span>}
            <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" isCollapsed={sidebarCollapsed} isActive={pathname === '/dashboard'} />
            <SidebarItem icon={Briefcase} label="Jobs" href="/jobs" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/jobs')} />
            <SidebarItem icon={Users} label="Candidates" href="/candidates" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/candidates')} badge={12} />
            <SidebarItem icon={GitMerge} label="Pipeline" href="/pipeline" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/pipeline')} />
          </div>

          {/* Recruiting group */}
          <div className="flex flex-col gap-[4px]">
            {!sidebarCollapsed && <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-[12px] mb-[4px]">Recruiting</span>}
            <SidebarItem icon={Calendar} label="Interviews" href="/interviews" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/interviews')} />
            <SidebarItem icon={FileText} label="Offers" href="/offers" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/offers')} />
            <SidebarItem icon={MessageSquare} label="Messages" href="/messages" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/messages')} />
          </div>

          {/* Insights group */}
          <div className="flex flex-col gap-[4px]">
            {!sidebarCollapsed && <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-[12px] mb-[4px]">Insights</span>}
            <SidebarItem icon={BarChart2} label="Analytics" href="/analytics" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/analytics')} />
            <SidebarItem icon={Lightbulb} label="AI Insights" href="/insights" isCollapsed={sidebarCollapsed} isActive={pathname.startsWith('/insights')} badge={3} />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="p-[16px] border-t border-[#E5E7EB] mt-auto">
        <div className="flex items-center justify-between w-full relative">
          <div className="flex items-center gap-[12px] overflow-hidden cursor-pointer">
            <div className="w-[32px] h-[32px] shrink-0 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-neutral-500 font-medium text-[12px]">{user?.name?.charAt(0) || 'U'}</span>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-medium text-neutral-900 truncate">{user?.name || 'User'}</span>
                <span className="text-[11px] text-neutral-500 truncate">{user?.email || 'user@example.com'}</span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px]">
              <Settings size={16} />
            </button>
          )}
        </div>
      </div>

    </div>
  )
}
