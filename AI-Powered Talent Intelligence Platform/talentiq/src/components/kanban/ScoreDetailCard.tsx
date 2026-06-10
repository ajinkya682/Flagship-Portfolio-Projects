"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { ScoreRing } from "@/components/ui/score-ring"
import { cn } from "@/lib/utils"

interface Subscore {
  label: string
  percent: number
}

interface ScoreDetailCardProps {
  score: number
  matchLabel: string
  subscores: Subscore[]
  strengths: string[]
  gaps: string[]
}

export function ScoreDetailCard({ score, matchLabel, subscores, strengths, gaps }: ScoreDetailCardProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const getScoreColorHex = (score: number) => {
    if (score >= 80) return "#10B981"
    if (score >= 60) return "#F59E0B"
    return "#EF4444"
  }

  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "bg-[#10B981]"
    if (score >= 60) return "bg-[#F59E0B]"
    return "bg-[#EF4444]"
  }

  const getMatchLabelColor = (score: number) => {
    if (score >= 80) return "text-[#059669]" // accent-700
    if (score >= 60) return "text-[#D97706]" // warning-700
    return "text-[#DC2626]" // error-700
  }

  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[20px] shadow-sm">
      
      {/* Top Section: Score Ring */}
      <div className="flex flex-col items-center mb-[24px]">
        <ScoreRing score={score} size="md" showLabel={false} />
        <span className={cn("mt-[12px] font-body text-[12px] font-semibold", getMatchLabelColor(score))}>
          {matchLabel}
        </span>
      </div>

      {/* Subscores */}
      <div className="flex flex-col gap-[12px]">
        {subscores.map((sub, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex items-center justify-between mb-[4px]">
              <span className="font-body text-[13px] text-neutral-700">{sub.label}</span>
              <span className="font-body text-[13px] font-semibold text-neutral-700">{sub.percent}%</span>
            </div>
            <div className="h-[6px] w-full rounded-full bg-neutral-100 overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-800 ease-out", getScoreColorClass(sub.percent))}
                style={{ width: mounted ? `${sub.percent}%` : "0%" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="my-[20px] h-px w-full bg-neutral-100" />

      {/* Why this score */}
      <div className="flex flex-col">
        <h5 className="font-body text-[13px] font-semibold text-neutral-700 mb-[12px]">Why this score</h5>
        
        {/* Strengths */}
        <div className="flex flex-col gap-[8px] mb-[16px]">
          {strengths.map((strength, idx) => (
            <div key={idx} className="flex items-start gap-[8px]">
              <ThumbsUp size={14} className="text-accent-500 mt-[2px] shrink-0" />
              <span className="font-body text-[13px] text-neutral-700 leading-snug">{strength}</span>
            </div>
          ))}
          <div className="flex flex-wrap gap-[6px] mt-[4px]">
            {["React", "Node.js", "System Design"].map(tag => (
              <span key={tag} className="rounded-full bg-accent-100 px-[8px] py-[2px] font-body text-[10px] font-medium text-accent-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Gaps */}
        <div className="flex flex-col gap-[8px]">
          {gaps.map((gap, idx) => (
            <div key={idx} className="flex items-start gap-[8px]">
              <ThumbsDown size={14} className="text-[#EF4444] mt-[2px] shrink-0" />
              <span className="font-body text-[13px] text-neutral-700 leading-snug">{gap}</span>
            </div>
          ))}
          <div className="flex flex-wrap gap-[6px] mt-[4px]">
            {["GraphQL", "Team Leadership"].map(tag => (
              <span key={tag} className="rounded-full bg-[#FEF3C7] px-[8px] py-[2px] font-body text-[10px] font-medium text-[#B45309]">
                {tag}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
