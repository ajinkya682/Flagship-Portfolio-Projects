"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, Users, Calendar, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Jobs", href: "/jobs/123/pipeline", icon: Briefcase },
    { name: "Apps", href: "/applications/123", icon: Users },
    { name: "Interviews", href: "/interviews", icon: Calendar },
    { name: "More", href: "/settings", icon: Menu },
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-white border-t border-neutral-200 flex items-center justify-around px-[8px] z-50 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname?.startsWith(item.href) || (item.name === "Home" && pathname === "/dashboard")
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-[64px] h-full gap-[4px] transition-colors",
              isActive ? "text-primary-600" : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            <item.icon size={20} className={isActive ? "fill-primary-50 stroke-primary-600" : ""} />
            <span className="font-body text-[10px] font-medium">{item.name}</span>
          </Link>
        )
      })}
    </div>
  )
}
