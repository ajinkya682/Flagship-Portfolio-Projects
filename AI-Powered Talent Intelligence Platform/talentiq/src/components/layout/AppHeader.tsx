"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Search, Bell, X, LogOut, Settings, User, Menu } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function AppHeader() {
  const pathname = usePathname()
  const [searchValue, setSearchValue] = React.useState("")

  // Simple breadcrumb logic
  const segments = pathname.split('/').filter(Boolean)
  // For dashboard, title is "Dashboard"
  let title = "Dashboard"
  if (segments.includes("jobs")) title = "Jobs"
  if (segments.includes("pipeline")) title = "Pipeline"
  if (segments.includes("candidates")) title = "Candidates"
  
  return (
    <header className="sticky top-0 z-30 flex h-[60px] w-full items-center justify-between border-b border-neutral-200 bg-white px-[16px] md:px-[32px]">
      
      {/* LEFT: Breadcrumb (Hidden on Mobile) */}
      <div className="hidden md:flex items-center gap-2">
        {/* We can expand this with actual parents if nested */}
        {segments.length > 2 && (
          <>
            <span className="font-body text-[13px] text-neutral-500">Jobs</span>
            <span className="font-body text-[13px] text-neutral-300">/</span>
          </>
        )}
        <h2 className="font-display text-[17px] font-semibold text-neutral-900 capitalize">
          {title}
        </h2>
      </div>

      {/* CENTER: Logo (Mobile Only) */}
      <div className="flex md:hidden items-center justify-center flex-1">
        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-lg bg-neutral-900 text-white font-display font-bold text-[16px]">
          T
        </div>
      </div>

      {/* RIGHT: Cluster */}
      <div className="flex items-center gap-[12px] md:gap-4">
        
        {/* Search (Hidden on mobile) */}
        <div className="hidden md:flex relative w-[280px] items-center">
          <Search size={16} className="absolute left-3 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search candidates, jobs..." 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="h-[36px] w-full rounded-[var(--radius-sm)] border border-neutral-200 bg-white pl-[36px] pr-[36px] font-body text-[14px] text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          {searchValue && (
            <button 
              onClick={() => setSearchValue("")}
              className="absolute right-2 flex h-[20px] w-[20px] items-center justify-center rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Notifications (Hidden on mobile) */}
        <button className="hidden md:flex relative h-[36px] w-[36px] items-center justify-center rounded-[var(--radius-sm)] text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500">
          <Bell size={18} />
          {/* Badge */}
          <span className="absolute top-[8px] right-[8px] h-[8px] w-[8px] rounded-full bg-accent-500 ring-2 ring-white" />
        </button>

        {/* User Dropdown (Hidden on mobile) */}
        <div className="hidden md:block">
          <Popover>
            <PopoverTrigger asChild>
              <button className="ml-2 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full">
                <img src="https://i.pravatar.cc/150?u=a4" alt="Sarah Wilson" className="h-[32px] w-[32px] rounded-full object-cover shadow-sm" />
              </button>
            </PopoverTrigger>
          <PopoverContent align="end" className="w-[220px] p-2">
            <div className="p-3">
              <p className="font-body text-[12px] text-neutral-500 truncate">sarah@globalhire.com</p>
            </div>
            <div className="my-1 h-px bg-neutral-100" />
            <div className="flex flex-col gap-1">
              <button className="flex h-[36px] items-center gap-2 rounded-md px-3 font-body text-[14px] text-neutral-900 hover:bg-neutral-50">
                <User size={16} className="text-neutral-500" /> Profile Settings
              </button>
              <button className="flex h-[36px] items-center gap-2 rounded-md px-3 font-body text-[14px] text-neutral-900 hover:bg-neutral-50">
                <Settings size={16} className="text-neutral-500" /> Account Settings
              </button>
            </div>
            <div className="my-1 h-px bg-neutral-100" />
              <div className="flex flex-col gap-1">
                <button className="flex h-[36px] items-center gap-2 rounded-md px-3 font-body text-[14px] text-[#DC2626] hover:bg-red-50">
                  <LogOut size={16} className="text-[#DC2626]" /> Sign out
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Mobile Hamburger */}
        <button className="flex md:hidden h-[36px] w-[36px] items-center justify-center rounded-[var(--radius-sm)] text-neutral-900">
          <Menu size={24} />
        </button>

      </div>

    </header>
  )
}
