'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ArrowRight, Menu, Building2, TrendingUp, Briefcase, Users } from 'lucide-react'
import * as Popover from '@radix-ui/react-popover'
import MobileDrawer from './MobileDrawer'
import { cn } from '@/lib/utils'

export default function MarketingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:p-4 focus:bg-white focus:text-primary-600 focus:font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-br-md">
        Skip to main content
      </a>
      <nav
        className={cn(
          'sticky top-0 z-[100] h-16 transition-all duration-200 ease-out',
          scrolled
            ? 'bg-white/90 backdrop-blur-[12px] shadow-xs border-b border-neutral-100'
            : 'bg-white/92 shadow-none border-transparent'
        )}
      >
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 lg:px-20 flex justify-between items-center h-full">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-display text-[20px] font-extrabold text-neutral-900 tracking-tight">
              Talent<span className="text-primary-500">IQ</span>
            </span>
          </Link>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/features"
              className="font-body text-[14px] font-medium text-neutral-700 hover:text-neutral-900 transition duration-120 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:scale-x-0 hover:after:scale-x-100 after:bg-primary-500 after:transition-transform after:origin-left"
            >
              Features
            </Link>

            <Popover.Root>
              <Popover.Trigger 
                className="group font-body text-[14px] font-medium text-neutral-700 hover:text-neutral-900 transition duration-120 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
                aria-haspopup="menu"
              >
                Solutions
                <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content
                  className="min-w-[220px] bg-white rounded-lg shadow-lg p-2 border border-neutral-100 z-[100] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
                  sideOffset={8}
                >
                  <Link href="/solutions#startups" role="menuitem" className="flex items-center gap-3 p-2 h-10 rounded-md hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                    <Building2 className="w-[18px] h-[18px] text-primary-500" />
                    <div>
                      <div className="text-[13px] font-semibold text-neutral-900 leading-none mb-1">Startups</div>
                    </div>
                  </Link>
                  <Link href="/solutions#scaling" role="menuitem" className="flex items-center gap-3 p-2 h-10 rounded-md hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                    <TrendingUp className="w-[18px] h-[18px] text-accent-500" />
                    <div>
                      <div className="text-[13px] font-semibold text-neutral-900 leading-none mb-1">Scaling Teams</div>
                    </div>
                  </Link>
                  <Link href="/solutions#enterprise" role="menuitem" className="flex items-center gap-3 p-2 h-10 rounded-md hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                    <Briefcase className="w-[18px] h-[18px] text-purple-500" />
                    <div>
                      <div className="text-[13px] font-semibold text-neutral-900 leading-none mb-1">Enterprise</div>
                    </div>
                  </Link>
                  <Link href="/solutions#agencies" role="menuitem" className="flex items-center gap-3 p-2 h-10 rounded-md hover:bg-neutral-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                    <Users className="w-[18px] h-[18px] text-amber-500" />
                    <div>
                      <div className="text-[13px] font-semibold text-neutral-900 leading-none mb-1">Agencies</div>
                    </div>
                  </Link>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Link
              href="/pricing"
              className="font-body text-[14px] font-medium text-neutral-700 hover:text-neutral-900 transition duration-120 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:scale-x-0 hover:after:scale-x-100 after:bg-primary-500 after:transition-transform after:origin-left"
            >
              Pricing
            </Link>
            <Link
              href="/customers"
              className="font-body text-[14px] font-medium text-neutral-700 hover:text-neutral-900 transition duration-120 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:scale-x-0 hover:after:scale-x-100 after:bg-primary-500 after:transition-transform after:origin-left"
            >
              Customers
            </Link>
          </div>

          {/* Right: Buttons / Mobile Toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/login"
                className="h-8 px-4 inline-flex items-center justify-center font-body text-[13px] font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="h-8 px-4 inline-flex items-center justify-center gap-1.5 font-body text-[13px] font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md shadow-xs transition-colors"
              >
                Start Free Trial
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <button
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />
    </>
  )
}
