"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface PasswordStrengthMeterProps {
  password?: string
  className?: string
}

type Strength = 0 | 1 | 2 | 3

export function PasswordStrengthMeter({ password = "", className }: PasswordStrengthMeterProps) {
  const getStrength = (pass: string): Strength => {
    if (!pass) return 0
    let score = 0
    if (pass.length >= 8) score += 1
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1
    if (/[^A-Za-z0-9]/.test(pass)) score += 1
    return score as Strength
  }

  const strength = getStrength(password)

  const labels = {
    0: "",
    1: "Weak",
    2: "Fair",
    3: "Strong",
  }

  const labelColors = {
    0: "text-transparent",
    1: "text-[#EF4444]",
    2: "text-[#F59E0B]",
    3: "text-accent-500",
  }

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <div className="flex gap-1 h-1 w-full">
        <div
          className={cn(
            "h-1 flex-1 rounded-full transition-colors duration-200 ease-out",
            strength >= 1 ? (strength === 1 ? "bg-[#EF4444]" : strength === 2 ? "bg-[#F59E0B]" : "bg-accent-500") : "bg-neutral-200"
          )}
        />
        <div
          className={cn(
            "h-1 flex-1 rounded-full transition-colors duration-200 ease-out",
            strength >= 2 ? (strength === 2 ? "bg-[#F59E0B]" : "bg-accent-500") : "bg-neutral-200"
          )}
        />
        <div
          className={cn(
            "h-1 flex-1 rounded-full transition-colors duration-200 ease-out",
            strength >= 3 ? "bg-accent-500" : "bg-neutral-200"
          )}
        />
      </div>
      <span className={cn("font-body text-[12px] font-medium h-[18px]", labelColors[strength])}>
        {labels[strength]}
      </span>
    </div>
  )
}
