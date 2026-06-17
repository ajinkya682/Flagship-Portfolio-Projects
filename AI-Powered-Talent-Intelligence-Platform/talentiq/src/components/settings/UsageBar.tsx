"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface UsageBarProps {
  label: string
  current: number
  limit: number
}

export function UsageBar({ label, current, limit }: UsageBarProps) {
  const percentage = Math.min((current / limit) * 100, 100)
  
  let fillClass = "bg-primary-500"
  if (percentage >= 100) fillClass = "bg-red-500"
  else if (percentage >= 80) fillClass = "bg-warning-500"

  const nearLimit = percentage >= 80

  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center justify-between font-body text-[13px]">
        <span className="font-semibold text-neutral-900">{label}</span>
        <div className="flex items-center gap-[12px]">
          <span className="text-neutral-500">{current.toLocaleString()} / {limit.toLocaleString()}</span>
          {nearLimit && (
            <a href="#" className="font-medium text-primary-600 hover:underline">Upgrade for more</a>
          )}
        </div>
      </div>
      <div className="h-[8px] w-full rounded-full bg-neutral-100 overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", fillClass)} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
