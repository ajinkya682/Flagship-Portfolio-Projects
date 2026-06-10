"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, Briefcase, Users, GitMerge, 
  Calendar, FileText, MessageSquare, 
  BarChart2, Lightbulb, Settings, 
  ChevronLeft, ChevronDown 
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (v: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()

  const mainNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Candidates", href: "/candidates", icon: Users },
    { name: "Pipeline", href: "/pipeline", icon: GitMerge },
  ]

  const recruitingNav = [
    { name: "Interviews", href: "/interviews", icon: Calendar },
    { name: "Offers", href: "/offers", icon: FileText },
    { name: "Messages", href: "/messages", icon: MessageSquare, badge: 3 },
  ]

  const insightsNav = [
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "AI Insights", href: "/ai-insights", icon: Lightbulb },
  ]

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
    const Icon = item.icon
    
    return (
      <Link 
        href={item.href}
        className={cn(
          "relative flex h-[40px] items-center gap-[10px] rounded-[var(--radius-md)] px-[12px] transition-all duration-100 ease-out group",
          isActive 
            ? "bg-primary-50 text-primary-700" 
            : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
        )}
        title={isCollapsed ? item.name : undefined}
      >
        {/* Active border left */}
        {isActive && (
          <div className="absolute left-0 top-1/2 h-[24px] w-[3px] -translate-y-1/2 rounded-r-md bg-primary-500" />
        )}
        
        <div className="relative flex items-center justify-center min-w-[18px]">
          <Icon size={18} className={isActive ? "text-primary-500" : "text-neutral-500 group-hover:text-neutral-700"} />
          {item.badge && (
            <div className="absolute -top-[6px] -right-[6px] flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-primary-500 px-[4px] text-[9px] font-bold text-white">
              {item.badge}
            </div>
          )}
        </div>

        {!isCollapsed && (
          <span className="font-body text-[13px] font-medium leading-none">
            {item.name}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside 
      className={cn(
        "sticky top-0 z-40 hidden h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-300 md:flex",
        isCollapsed ? "w-[64px]" : "w-[260px]"
      )}
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-[12px] top-[72px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white shadow-md border border-neutral-100 text-neutral-500 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 z-50"
      >
        <ChevronLeft size={12} className={cn("transition-transform duration-300", isCollapsed && "rotate-180")} />
      </button>

      {/* TOP SECTION */}
      <div className={cn("flex items-center p-[20px_16px] gap-3", isCollapsed && "justify-center px-0")}>
        <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-primary-600 text-white">
          <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 6L22 14L14 22L6 14L14 6Z" fill="white"/>
          </svg>
        </div>
        {!isCollapsed && (
          <div className="flex flex-1 items-center justify-between overflow-hidden">
            <div className="flex items-center gap-2 truncate">
              <span className="font-body text-[14px] font-semibold text-neutral-900 truncate">GlobalHire Inc</span>
              <span className="rounded-full bg-accent-100 px-[8px] py-[2px] font-body text-[10px] font-bold text-accent-700">PRO</span>
            </div>
            <ChevronDown size={14} className="text-neutral-400 shrink-0" />
          </div>
        )}
      </div>

      {/* NAVIGATION GROUPS */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 pt-0 flex flex-col gap-1 custom-scrollbar">
        
        {/* Main Group */}
        {!isCollapsed && <div className="p-[20px_12px_6px] font-body text-[10px] font-bold uppercase tracking-wider text-neutral-400">Main</div>}
        {isCollapsed && <div className="h-4" />}
        {mainNav.map(item => <NavItem key={item.href} item={item} />)}

        {/* Recruiting Group */}
        {!isCollapsed && <div className="p-[20px_12px_6px] font-body text-[10px] font-bold uppercase tracking-wider text-neutral-400">Recruiting</div>}
        {isCollapsed && <div className="h-4" />}
        {recruitingNav.map(item => <NavItem key={item.href} item={item} />)}

        {/* Insights Group */}
        {!isCollapsed && <div className="p-[20px_12px_6px] font-body text-[10px] font-bold uppercase tracking-wider text-neutral-400">Insights</div>}
        {isCollapsed && <div className="h-4" />}
        {insightsNav.map(item => <NavItem key={item.href} item={item} />)}

        <div className="flex-1" />

        {/* Settings */}
        <NavItem item={{ name: "Settings", href: "/settings", icon: Settings }} />
      </div>

      {/* BOTTOM SECTION */}
      <div className={cn("border-t border-neutral-200 p-[16px] flex items-center gap-3", isCollapsed && "justify-center px-0")}>
        <img src="https://i.pravatar.cc/150?u=a4" alt="User" className="h-[32px] w-[32px] shrink-0 rounded-full object-cover" />
        {!isCollapsed && (
          <div className="flex flex-1 flex-col truncate">
            <span className="font-body text-[13px] font-medium text-neutral-900 truncate">Sarah Wilson</span>
            <span className="font-body text-[11px] text-neutral-500 truncate">sarah@globalhire.com</span>
          </div>
        )}
        {!isCollapsed && (
          <button className="shrink-0 text-neutral-400 hover:text-neutral-700">
            <Settings size={16} />
          </button>
        )}
      </div>
    </aside>
  )
}
