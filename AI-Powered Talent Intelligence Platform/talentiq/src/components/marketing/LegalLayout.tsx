"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export interface LegalLayoutProps {
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
  const pathname = usePathname()

  const links = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "GDPR Compliance", href: "/gdpr" },
    { label: "Security", href: "/security" },
    { label: "Cookie Policy", href: "/cookies" },
  ]

  return (
    <div className="min-h-screen bg-white font-body pt-32 pb-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Sidebar */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="sticky top-32">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-6">Legal & Trust</h3>
              <nav className="flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-600"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                      )}
                    >
                      {link.label}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-[720px]">
            <header className="mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight mb-4">{title}</h1>
              <p className="text-sm text-neutral-500">Last updated: {lastUpdated}</p>
            </header>
            
            <div className="max-w-none [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:mt-12 [&>h2]:mb-4 [&>p]:text-neutral-600 [&>p]:leading-relaxed [&>p]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-neutral-600 [&>ul>li]:mb-2 [&>a]:text-primary-600 [&>a]:underline hover:[&>a]:text-primary-700">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  )
}
