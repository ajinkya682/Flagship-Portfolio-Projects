"use client"

import * as React from "react"
import { Home, Briefcase, GitMerge, Calendar, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MobileBottomNavProps {
  activeTab?: "home" | "jobs" | "pipeline" | "interviews" | "more"
  onTabChange?: (tab: "home" | "jobs" | "pipeline" | "interviews" | "more") => void
}

export function MobileBottomNav({ activeTab = "home", onTabChange }: MobileBottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "jobs", label: "Jobs", icon: Briefcase },
    { id: "pipeline", label: "Pipeline", icon: GitMerge },
    { id: "interviews", label: "Interviews", icon: Calendar },
    { id: "more", label: "More", icon: MoreHorizontal },
  ] as const

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] flex h-[64px] w-full items-center justify-around border-t border-neutral-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] pb-safe sm:hidden">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className="flex flex-col items-center justify-center p-[10px] w-full transition-colors active:bg-neutral-50"
            aria-label={tab.label}
            aria-current={isActive ? "page" : undefined}
          >
            <tab.icon
              size={20}
              className={cn(
                "mb-1 transition-colors duration-200",
                isActive ? "text-primary-500" : "text-neutral-400"
              )}
            />
            <span
              className={cn(
                "font-body text-[10px] font-semibold transition-colors duration-200",
                isActive ? "text-primary-600" : "text-neutral-400"
              )}
            >
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
