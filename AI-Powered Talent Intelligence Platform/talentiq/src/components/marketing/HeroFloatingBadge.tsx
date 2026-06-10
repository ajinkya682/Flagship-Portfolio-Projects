"use client"

import * as React from "react"
import { ScoreRing } from "@/components/score/ScoreRing"

export function HeroFloatingBadge() {
  return (
    <div className="absolute left-[-24px] top-[40%] flex -translate-y-1/2 items-center gap-3 rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-3 shadow-lg animate-float motion-reduce:animate-none z-10">
      <ScoreRing score={91} size="sm" />
      <div className="flex flex-col">
        <span className="font-body text-[13px] font-bold text-accent-500">
          AI Score: 91/100
        </span>
        <span className="font-body text-[11px] text-neutral-500">
          Strong Match
        </span>
      </div>
    </div>
  )
}
