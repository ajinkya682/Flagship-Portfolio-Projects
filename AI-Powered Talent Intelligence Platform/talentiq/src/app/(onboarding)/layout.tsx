"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Extract step number from pathname e.g., /onboarding/step/3
  const stepMatch = pathname.match(/\/step\/(\d+)/)
  const currentStep = stepMatch ? parseInt(stepMatch[1], 10) : 1
  const progressPercent = (currentStep / 5) * 100

  const labels = ["Company", "Team", "First Job", "AI Demo", "Done"]

  return (
    <div className="flex min-h-screen flex-col bg-white">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-[60px] items-center justify-between bg-white px-6">
        <div className="flex items-center gap-1.5">
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" rx="6" fill="#2563EB"/>
            <path d="M14 6L22 14L14 22L6 14L14 6Z" fill="white"/>
          </svg>
          <span className="font-display text-[16px] font-bold tracking-tight text-neutral-900 hidden md:block">
            Talent<span className="text-primary-500">IQ</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="font-body text-[13px] font-medium text-neutral-500">
            Step {currentStep} of 5
          </span>
          <Link href="/" className="font-body text-[13px] font-medium text-neutral-400 hover:text-neutral-600 transition-colors">
            Exit setup
          </Link>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="fixed top-[60px] left-0 right-0 z-50 h-[3px] bg-neutral-100">
        <div 
          className="h-full bg-primary-500 transition-all duration-400 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* STEP LABELS (Desktop only) */}
      <div className="fixed top-[63px] left-0 right-0 z-40 hidden justify-center bg-white/80 py-4 backdrop-blur-sm md:flex">
        <div className="flex w-full max-w-[640px] justify-between px-4">
          {labels.map((label, idx) => {
            const stepNum = idx + 1
            let textColor = "text-neutral-400"
            let fontWeight = "font-medium"
            
            if (stepNum === currentStep) {
              textColor = "text-primary-500"
              fontWeight = "font-semibold"
            } else if (stepNum < currentStep) {
              textColor = "text-accent-500"
              fontWeight = "font-semibold"
            }

            return (
              <span key={idx} className={`font-body text-[12px] ${textColor} ${fontWeight} transition-colors duration-300`}>
                {label}
              </span>
            )
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="mt-[120px] flex flex-1 justify-center pb-20">
        <div className="w-full max-w-[640px] px-6">
          {children}
        </div>
      </main>

    </div>
  )
}
