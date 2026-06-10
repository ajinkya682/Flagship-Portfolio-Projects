"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Subscore {
  label: string
  percent: number
}

export interface AIScoreDetailCardProps {
  score: number
  subscores: Subscore[]
  strengths: string[]
  gaps: string[]
  className?: string
}

export function AIScoreDetailCard({
  score,
  subscores,
  strengths,
  gaps,
  className,
}: AIScoreDetailCardProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    // Small delay to trigger animation on mount
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Determine AI Score Band
  let scoreColor = "#10B981" // accent-500
  let scoreLabel = "Strong Match"
  let bandClass = "text-accent-700"
  let fillClass = "bg-accent-500"
  
  if (score < 50) {
    scoreColor = "#EF4444" // red
    scoreLabel = "Weak Match"
    bandClass = "text-[#EF4444]"
    fillClass = "bg-[#EF4444]"
  } else if (score < 80) {
    scoreColor = "#F59E0B" // amber
    scoreLabel = "Fair Match"
    bandClass = "text-[#D97706]"
    fillClass = "bg-[#F59E0B]"
  }

  // Calculate stroke dasharray for the main score ring
  const radius = 32
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-5",
        className
      )}
    >
      {/* Top: Score Ring */}
      <div className="mb-3 flex flex-col items-center">
        <div className="relative flex h-[72px] w-[72px] items-center justify-center">
          <svg className="absolute inset-0 h-[72px] w-[72px] -rotate-90" viewBox="0 0 72 72">
            {/* Background track */}
            <circle
              cx="36"
              cy="36"
              r="32"
              fill="none"
              stroke="#F5F5F5" // neutral-100
              strokeWidth="8"
            />
            {/* Progress ring */}
            <circle
              cx="36"
              cy="36"
              r="32"
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? strokeDashoffset : circumference}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-1000 ease-out"
            />
          </svg>
          <span
            className="font-display text-[16px] font-bold"
            style={{ color: scoreColor }}
          >
            {score}
          </span>
        </div>
        <span className={cn("mt-1 font-body text-[12px] font-semibold", bandClass)}>
          {scoreLabel}
        </span>
      </div>

      {/* Subscores */}
      <div className="mb-5 flex flex-col gap-3">
        {subscores.map((sub, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-body text-[13px] text-neutral-700">
              <span>{sub.label}</span>
              <span className="font-semibold">{sub.percent}%</span>
            </div>
            {/* Bar track */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              {/* Bar fill */}
              <div
                className={cn("h-full rounded-full transition-all duration-[800ms] ease-out", fillClass)}
                style={{ width: mounted ? `${sub.percent}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Why this score section */}
      <div className="mt-auto border-t border-neutral-100 pt-4">
        <h4 className="mb-3 font-body text-[13px] font-semibold text-neutral-700">
          Why this score
        </h4>
        
        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="mb-3 flex items-start gap-2">
            <ThumbsUp size={14} className="mt-0.5 shrink-0 text-accent-500" />
            <div className="flex flex-wrap gap-1.5">
              {strengths.map((s, i) => (
                <span
                  key={i}
                  className="rounded-full bg-accent-100 px-2.5 py-0.5 font-body text-[10px] font-medium text-accent-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gaps */}
        {gaps.length > 0 && (
          <div className="flex items-start gap-2">
            <ThumbsDown size={14} className="mt-0.5 shrink-0 text-[#EF4444]" />
            <div className="flex flex-wrap gap-1.5">
              {gaps.map((g, i) => (
                <span
                  key={i}
                  className="rounded-full bg-amber-100 px-2.5 py-0.5 font-body text-[10px] font-medium text-amber-700"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
