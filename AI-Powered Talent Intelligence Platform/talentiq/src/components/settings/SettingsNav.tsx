"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, Users, GitMerge, Mail, Puzzle, CreditCard, Shield, Code2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function SettingsNav() {
  const pathname = usePathname()

  const navItems = [
    { name: "General", href: "/settings", icon: Building2 },
    { name: "Team Members", href: "/settings/team", icon: Users },
    { name: "Pipeline Stages", href: "/settings/stages", icon: GitMerge },
    { name: "Email Templates", href: "/settings/email", icon: Mail },
    { name: "Integrations", href: "/settings/integrations", icon: Puzzle },
    { name: "Billing", href: "/settings/billing", icon: CreditCard },
    { name: "Security", href: "/settings/security", icon: Shield },
    { name: "API Access", href: "/settings/api", icon: Code2 },
  ]

  return (
    <div className="flex flex-col w-full md:w-[200px] flex-shrink-0">
      <h5 className="font-display text-[13px] font-semibold text-neutral-500 uppercase tracking-wider mb-[12px] px-[12px] hidden md:block">
        Settings
      </h5>
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-[2px] custom-scrollbar-thin pb-2 md:pb-0">
        {navItems.map((item) => {
          // Exact match for /settings, otherwise startsWith for subpages
          const isActive = item.href === "/settings" 
            ? pathname === "/settings" 
            : pathname?.startsWith(item.href)

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-[10px] h-[36px] px-[12px] rounded-[var(--radius-md)] font-body text-[14px] font-medium transition-colors border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap",
                isActive
                  ? "border-primary-500 bg-primary-50 text-primary-700"
                  : "border-transparent text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              <item.icon size={16} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
