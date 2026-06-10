"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function PricingToggle({
  isAnnual,
  onChange,
}: {
  isAnnual: boolean
  onChange: (isAnnual: boolean) => void
}) {
  return (
    <div className="flex w-fit items-center gap-1 rounded-full bg-neutral-100 p-1">
      <button
        onClick={() => onChange(false)}
        className={cn(
          "flex h-8 items-center justify-center rounded-full px-4 font-body text-[13px] font-semibold transition-all duration-200",
          !isAnnual 
            ? "bg-white text-neutral-900 shadow-xs" 
            : "text-neutral-500 hover:text-neutral-700"
        )}
      >
        Monthly
      </button>
      <button
        onClick={() => onChange(true)}
        className={cn(
          "flex h-8 items-center justify-center rounded-full px-4 font-body text-[13px] font-semibold transition-all duration-200",
          isAnnual 
            ? "bg-white text-neutral-900 shadow-xs" 
            : "text-neutral-500 hover:text-neutral-700"
        )}
      >
        Annual
        <span className="ml-1.5 flex h-[18px] items-center justify-center rounded-full bg-accent-500 px-2 text-[10px] text-white">
          Save 20%
        </span>
      </button>
    </div>
  )
}
