"use client"

import * as React from "react"
import { ChevronDown, ArrowRight, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function MarketingNav() {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[101] focus:bg-white focus:p-4">
        Skip to main content
      </a>
      
      <header
        className={cn(
          "sticky top-0 z-[100] h-[64px] w-full transition-all duration-200",
          scrolled 
            ? "bg-white/90 backdrop-blur-[12px] border-b border-neutral-200 shadow-xs" 
            : "bg-white border-b-transparent shadow-none"
        )}
      >
        <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-5 md:px-10 lg:px-[80px]">
          
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="#2563EB"/>
              <path d="M14 6L22 14L14 22L6 14L14 6Z" fill="white"/>
            </svg>
            <span className="font-display text-[20px] font-bold tracking-tight">
              <span className="text-neutral-900">Talent</span>
              <span className="text-primary-500">IQ</span>
            </span>
          </Link>

          {/* CENTER: Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="font-body text-[14px] font-medium text-neutral-700 transition-colors duration-120 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm">
              Features
            </Link>
            <button className="flex items-center gap-1 font-body text-[14px] font-medium text-neutral-700 transition-colors duration-120 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm" aria-haspopup="true" aria-expanded="false">
              Solutions
              <ChevronDown size={12} className="text-neutral-500" />
            </button>
            <Link href="/pricing" className="font-body text-[14px] font-medium text-neutral-700 transition-colors duration-120 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm">
              Pricing
            </Link>
            <Link href="/customers" className="font-body text-[14px] font-medium text-neutral-700 transition-colors duration-120 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm">
              Customers
            </Link>
          </nav>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/login" tabIndex={-1}>
              <Button variant="ghost" size="compact">
                Log in
              </Button>
            </Link>
            <Link href="/register" tabIndex={-1}>
              <Button variant="primary" size="compact" iconRight={<ArrowRight size={14} />}>
                Start Free Trial
              </Button>
            </Link>
          </div>

          {/* MOBILE: Hamburger */}
          <div className="md:hidden">
            <Button variant="ghost" size="compact" className="h-10 w-10 p-0 text-neutral-700">
              <Menu size={20} />
            </Button>
          </div>

        </div>
      </header>
    </>
  )
}
