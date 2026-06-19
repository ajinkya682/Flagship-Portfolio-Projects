"use client"

import * as React from "react"
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function MarketingNav() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 60)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-[100] flex h-[64px] w-full items-center justify-center transition-all duration-200 ease-out",
          isScrolled
            ? "border-b border-neutral-200 bg-[rgba(255,255,255,0.90)] shadow-sm backdrop-blur-[12px]"
            : "border-b-transparent bg-[rgba(255,255,255,0.92)] shadow-none backdrop-blur-none"
        )}
      >
        <div className="flex w-full max-w-[1200px] items-center justify-between px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer select-none">
            {/* Simulated Logo */}
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary-500 text-white shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <span className="font-display text-[20px] font-bold tracking-tight text-neutral-900">
              TalentIQ
            </span>
          </div>

          {/* Center: Nav links (Desktop only) */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="font-body text-[14px] font-medium text-neutral-900 relative after:absolute after:-bottom-5 after:left-0 after:h-[2px] after:w-full after:bg-primary-500">
              Features
            </a>
            <div className="group relative flex cursor-pointer items-center gap-1 font-body text-[14px] font-medium text-neutral-700 transition-colors duration-150 hover:text-neutral-900">
              Solutions
              <ChevronDown size={12} className="transition-transform duration-200 group-hover:rotate-180" />
              
              {/* Dropdown panel */}
              <div className="absolute left-1/2 top-full mt-4 w-[220px] -translate-x-1/2 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:mt-2">
                {["Enterprise", "Startups", "Agencies"].map((item) => (
                  <div key={item} className="flex h-10 cursor-pointer items-center gap-3 rounded-md px-3 hover:bg-neutral-50 transition-colors">
                    <div className="flex flex-col justify-center">
                      <span className="font-body text-[14px] font-medium text-neutral-900">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <a href="#" className="font-body text-[14px] font-medium text-neutral-700 transition-colors duration-150 hover:text-neutral-900">
              Pricing
            </a>
            <a href="#" className="font-body text-[14px] font-medium text-neutral-700 transition-colors duration-150 hover:text-neutral-900">
              Customers
            </a>
          </nav>

          {/* Right: Auth Buttons (Desktop only) */}
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login">
              <Button variant="ghost" size="compact">
                Log in
              </Button>
            </Link>
            <Button variant="primary" size="compact" iconRight={<ArrowRight size={14} />}>
              Start Free Trial
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="flex h-7 w-7 items-center justify-center rounded text-neutral-700 md:hidden hover:bg-neutral-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[200] transition-opacity duration-250 ease-out md:hidden",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer panel */}
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-[280px] bg-white shadow-xl transition-transform duration-250 ease-out flex flex-col",
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Close button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex-1 overflow-y-auto pt-16 px-6">
            <div className="flex flex-col">
              <a href="#" className="flex h-14 items-center border-b border-neutral-100 font-body text-[16px] font-medium text-neutral-900">Features</a>
              <a href="#" className="flex h-14 items-center border-b border-neutral-100 font-body text-[16px] font-medium text-neutral-900 justify-between">
                Solutions <ChevronDown size={16} className="text-neutral-400" />
              </a>
              <a href="#" className="flex h-14 items-center border-b border-neutral-100 font-body text-[16px] font-medium text-neutral-900">Pricing</a>
              <a href="#" className="flex h-14 items-center border-b border-neutral-100 font-body text-[16px] font-medium text-neutral-900">Customers</a>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-3 mt-auto border-t border-neutral-100 bg-neutral-50">
            <Link href="/login" className="w-full">
              <Button variant="ghost" className="w-full justify-center">Log in</Button>
            </Link>
            <Button variant="primary" className="w-full justify-center">Start Free Trial</Button>
          </div>
        </div>
      </div>
    </>
  )
}
