"use client"

import * as React from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface AppSidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
  activePath?: string
}

export function AppSidebar({ isCollapsed = false, onToggle, activePath = "/dashboard" }: AppSidebarProps) {
  const [collapsed, setCollapsed] = React.useState(isCollapsed)
  
  // Controlled or uncontrolled
  const isActuallyCollapsed = onToggle ? isCollapsed : collapsed
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setCollapsed(!collapsed)
    }
  }

  const mainNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Jobs", icon: Briefcase, path: "/jobs", badge: 3 },
    { name: "Candidates", icon: Users, path: "/candidates" },
    { name: "Pipeline", icon: GitMerge, path: "/pipeline" },
  ]

  const recruitingNav = [
    { name: "Interviews", icon: Calendar, path: "/interviews" },
    { name: "Offers", icon: FileText, path: "/offers" },
    { name: "Messages", icon: MessageSquare, path: "/messages", badge: 5 },
  ]

  const insightsNav = [
    { name: "Analytics", icon: BarChart2, path: "/analytics" },
    { name: "AI Insights", icon: Lightbulb, path: "/insights" },
  ]

  return (
    <aside
      className={cn(
        "relative flex h-screen shrink-0 flex-col border-r border-neutral-200 bg-white transition-[width] duration-300 ease-in-out sticky top-0",
        isActuallyCollapsed ? "w-[64px]" : "w-[260px]"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute -right-[12px] top-[72px] z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md border border-neutral-100 text-neutral-500 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-transform"
        aria-label={isActuallyCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft size={12} className={cn("transition-transform duration-300", isActuallyCollapsed && "rotate-180")} />
      </button>

      {/* TOP SECTION */}
      <div className={cn("flex items-center gap-3 p-[20px_16px]", isActuallyCollapsed && "justify-center px-0")}>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white shadow-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        
        {!isActuallyCollapsed && (
          <div className="flex flex-1 items-center justify-between overflow-hidden">
            <div className="flex items-center gap-2 truncate">
              <span className="font-display text-[14px] font-semibold text-neutral-900 truncate">
                TalentIQ
              </span>
              <span className="shrink-0 rounded-full bg-accent-100 px-2 py-0.5 font-body text-[10px] font-semibold text-accent-700">
                PRO
              </span>
            </div>
            <ChevronDown size={14} className="shrink-0 text-neutral-400" />
          </div>
        )}
      </div>

      {/* NAVIGATION GROUPS */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-4 scrollbar-hide">
        <NavGroup items={mainNav} collapsed={isActuallyCollapsed} activePath={activePath} />
        <NavGroup label="Recruiting" items={recruitingNav} collapsed={isActuallyCollapsed} activePath={activePath} />
        <NavGroup label="Insights" items={insightsNav} collapsed={isActuallyCollapsed} activePath={activePath} />
      </div>

      {/* SETTINGS GROUP */}
      <div className="pb-2">
        <NavGroup items={[{ name: "Settings", icon: Settings, path: "/settings" }]} collapsed={isActuallyCollapsed} activePath={activePath} />
      </div>

      {/* BOTTOM SECTION */}
      <div className={cn("mt-auto flex items-center border-t border-neutral-100 p-4", isActuallyCollapsed && "justify-center p-4")}>
        <img
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          alt="User avatar"
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        {!isActuallyCollapsed && (
          <div className="ml-3 flex flex-col overflow-hidden mr-auto">
            <span className="truncate font-body text-[13px] font-medium text-neutral-900">
              Alex Morgan
            </span>
            <span className="truncate font-body text-[11px] text-neutral-500">
              alex@talentiq.com
            </span>
          </div>
        )}
      </div>
    </aside>
  )
}

function NavGroup({ 
  label, 
  items, 
  collapsed, 
  activePath 
}: { 
  label?: string, 
  items: any[], 
  collapsed: boolean,
  activePath: string 
}) {
  return (
    <div className="mb-2 flex flex-col px-3">
      {label && !collapsed && (
        <span className="px-3 pb-1.5 pt-4 font-body text-[10px] font-bold uppercase tracking-wider text-neutral-400">
          {label}
        </span>
      )}
      {label && collapsed && (
        <div className="mx-auto mt-4 h-px w-6 bg-neutral-100" />
      )}
      
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = activePath === item.path
          return (
            <div
              key={item.name}
              className={cn(
                "group relative flex h-10 cursor-pointer items-center rounded-md transition-colors duration-100 ease-out",
                collapsed ? "justify-center px-0 w-10 mx-auto" : "px-3 gap-3",
                isActive 
                  ? "bg-primary-50 text-primary-700" 
                  : "bg-transparent text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              {isActive && !collapsed && (
                <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-r-full bg-primary-500" />
              )}
              {isActive && collapsed && (
                <div className="absolute left-[-12px] top-1 bottom-1 w-[2px] rounded-r-full bg-primary-500" />
              )}
              
              <div className="relative flex items-center justify-center">
                <item.icon 
                  size={18} 
                  className={cn(
                    "transition-colors duration-100",
                    isActive ? "text-primary-500" : "text-neutral-500 group-hover:text-neutral-700"
                  )} 
                />
                {item.badge && (
                  <div className={cn(
                    "absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 font-body text-[9px] font-bold text-white",
                    collapsed && "right-[-4px] top-[-4px]"
                  )}>
                    {item.badge}
                  </div>
                )}
              </div>
              
              {!collapsed && (
                <span className="font-body text-[13px] font-medium truncate">
                  {item.name}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div className="absolute left-14 z-50 rounded-md bg-neutral-900 px-2 py-1.5 font-body text-[12px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none whitespace-nowrap shadow-md">
                  {item.name}
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-[4px] border-transparent border-r-neutral-900" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
