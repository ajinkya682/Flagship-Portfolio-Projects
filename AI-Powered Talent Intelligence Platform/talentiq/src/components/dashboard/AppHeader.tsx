"use client"

import * as React from "react"
import { Bell, Search, LogOut, User, Settings, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface AppHeaderProps {
  pageTitle: string
  breadcrumbs?: { name: string; path?: string }[]
  unreadNotifications?: boolean
}

export function AppHeader({ pageTitle, breadcrumbs = [], unreadNotifications = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex h-[60px] w-full items-center justify-between border-b border-neutral-200 bg-white px-8">
      {/* LEFT — Breadcrumbs & Title */}
      <div className="flex items-center gap-2">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <span className="font-body text-[13px] text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors">
              {crumb.name}
            </span>
            <span className="font-body text-[13px] text-neutral-300">/</span>
          </React.Fragment>
        ))}
        <h1 className="font-display text-[17px] font-semibold text-neutral-900">
          {pageTitle}
        </h1>
      </div>

      {/* RIGHT — Actions & Profile */}
      <div className="flex items-center gap-2">
        {/* Search Input (Compact) */}
        <div className="relative mr-2 hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search candidates, jobs..."
            className="h-9 w-[280px] rounded-sm border border-neutral-200 bg-neutral-50 pl-9 pr-3 font-body text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all duration-150"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500" aria-label="Notifications">
          <Bell size={18} className="animate-bell-shake" />
          {unreadNotifications && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ring-offset-1 transition-transform active:scale-95" aria-label="User profile">
              <img
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                alt="User avatar"
                className="h-8 w-8 rounded-full object-cover"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[220px] p-2" sideOffset={8}>
            <div className="px-2 py-2 mb-1">
              <p className="font-body text-[12px] text-neutral-500 truncate">alex@talentiq.com</p>
            </div>
            <div className="h-px w-full bg-neutral-100 mb-1" />
            
            <div className="flex flex-col gap-0.5">
              <button className="flex h-9 w-full items-center gap-2 rounded-md px-2 font-body text-[14px] text-neutral-900 hover:bg-neutral-50 transition-colors">
                <User size={16} className="text-neutral-500" />
                Profile Settings
              </button>
              <button className="flex h-9 w-full items-center gap-2 rounded-md px-2 font-body text-[14px] text-neutral-900 hover:bg-neutral-50 transition-colors">
                <Settings size={16} className="text-neutral-500" />
                Account Settings
              </button>
              <button className="flex h-9 w-full items-center gap-2 rounded-md px-2 font-body text-[14px] text-neutral-900 hover:bg-neutral-50 transition-colors">
                <CreditCard size={16} className="text-neutral-500" />
                Billing
              </button>
            </div>
            
            <div className="my-1 h-px w-full bg-neutral-100" />
            
            <button className="flex h-9 w-full items-center gap-2 rounded-md px-2 font-body text-[14px] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
              <LogOut size={16} />
              Sign out
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
