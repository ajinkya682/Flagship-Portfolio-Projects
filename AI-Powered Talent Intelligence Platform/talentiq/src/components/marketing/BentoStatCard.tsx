"use client"

import * as React from "react"
import { Play } from "lucide-react"

export function BentoStatCard() {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    // Simple count up animation on mount
    let start = 0
    const end = 60
    const duration = 1200
    const increment = end / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative flex h-full min-h-[240px] flex-col rounded-[var(--radius-2xl)] border border-neutral-200 bg-neutral-50 p-8 transition-transform hover:-translate-y-1">
      {/* Play Button */}
      <button className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-md transition-transform hover:scale-105">
        <Play size={20} fill="currentColor" className="ml-1" />
      </button>

      <div className="mt-auto">
        <div className="font-display text-[64px] font-[800] leading-none text-neutral-900 tracking-tight">
          {count}%
        </div>
        <div className="mt-2 font-body text-[17px] font-medium text-neutral-700">
          Faster time-to-hire
        </div>
        <p className="mt-2 font-body text-[13px] text-neutral-500">
          Hiring at your fingertips
        </p>
      </div>
    </div>
  )
}
