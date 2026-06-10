"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollEntry } from "@/components/shared/ScrollEntry"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isCenteredOnly = pathname === "/forgot-password" || pathname === "/reset-password"

  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row bg-neutral-50">
      
      {/* LEFT BRAND PANEL */}
      {!isCenteredOnly && (
        <div className="relative flex flex-col justify-between bg-primary-900 p-[40px] md:h-screen md:w-1/2 md:sticky md:top-0 h-[200px] shrink-0 overflow-hidden">
        
        {/* Decorative mesh overlay */}
        <div 
          className="absolute -top-[100px] -right-[100px] h-[400px] w-[400px] rounded-full opacity-[0.08] pointer-events-none"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, var(--color-accent-500) 0%, transparent 100%)" }}
        />

        {/* TOP: Logo */}
        <div className="relative z-10 flex items-center gap-1.5">
          <Link href="/" className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-sm w-fit">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="#2563EB"/>
              <path d="M14 6L22 14L14 22L6 14L14 6Z" fill="white"/>
            </svg>
            <span className="font-display text-[18px] font-bold tracking-tight text-white hidden md:block">
              Talent<span className="text-primary-500">IQ</span>
            </span>
          </Link>
        </div>

        {/* CENTER: Quote (hidden on mobile/tablet to fit the 200px top strip) */}
        <div className="relative z-10 hidden flex-col justify-center flex-1 md:flex max-w-[400px]">
          <p className="font-body text-[22px] italic font-light leading-relaxed text-white">
            "We went from 'gut feel' to data-driven hiring in two weeks."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?u=a4" alt="Avatar" className="h-[44px] w-[44px] rounded-full object-cover border border-white/10" />
            <div className="flex flex-col">
              <span className="font-body text-[14px] font-semibold text-white">James Wilson</span>
              <span className="font-body text-[13px] text-white/65">VP Engineering at GlobalHire</span>
            </div>
          </div>
        </div>

        {/* BOTTOM: Stats (hidden on mobile/tablet) */}
        <div className="relative z-10 hidden flex-row gap-8 md:flex">
          <div className="flex flex-col">
            <span className="font-display text-[24px] font-bold text-white">50% faster</span>
            <span className="font-body text-[13px] text-white/55">Time-to-hire</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[24px] font-bold text-white">91%</span>
            <span className="font-body text-[13px] text-white/55">AI accuracy</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[24px] font-bold text-white">500+</span>
            <span className="font-body text-[13px] text-white/55">Teams trust us</span>
          </div>
        </div>
      </div>
      )}

      {/* RIGHT FORM PANEL */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <ScrollEntry animation="fade-up" className="w-full max-w-[400px]">
          <div className="w-full rounded-[var(--radius-xl)] bg-white p-[32px] md:p-[48px] shadow-lg border border-neutral-100">
            {children}
          </div>
        </ScrollEntry>
      </div>

    </div>
  )
}
