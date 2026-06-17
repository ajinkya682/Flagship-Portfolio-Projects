"use client"

import * as React from "react"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

export interface KanbanCandidateCardProps {
  name: string
  role: string
  daysInStage: number
  aiScore: number
  sourcePillLabel: string
  recruiterAvatarUrl: string
  isDragging?: boolean
  isSelected?: boolean
  onContextMenuClick?: (e: React.MouseEvent) => void
  className?: string
}

export function KanbanCandidateCard({
  name,
  role,
  daysInStage,
  aiScore,
  sourcePillLabel,
  recruiterAvatarUrl,
  isDragging = false,
  isSelected = false,
  onContextMenuClick,
  className,
}: KanbanCandidateCardProps) {
  // Determine AI Score Band (spec: #10B981 for Strong (>80), #F59E0B for Fair (50-80), #EF4444 for Weak (<50))
  let scoreColor = "#10B981" // accent-500
  let scoreLabel = "Strong Match"
  if (aiScore < 50) {
    scoreColor = "#EF4444" // red
    scoreLabel = "Weak Match"
  } else if (aiScore < 80) {
    scoreColor = "#F59E0B" // amber
    scoreLabel = "Fair Match"
  }

  // Calculate stroke dasharray for the SVG ring
  const radius = 14
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (aiScore / 100) * circumference

  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-md border border-neutral-200 bg-white px-4 py-[14px] shadow-sm transition-all duration-200",
        // States
        "hover:shadow-md hover:cursor-grab",
        isDragging && "scale-[1.02] shadow-xl rotate-[0.8deg] cursor-grabbing z-50",
        isSelected && "bg-primary-50 border-primary-500",
        className
      )}
    >
      {/* Left accent bar */}
      <div
        className="absolute bottom-0 left-0 top-0 w-[3px] rounded-l-[3px]"
        style={{ backgroundColor: scoreColor }}
      />

      {/* Row 1: Name + AI Score Badge */}
      <div className="flex items-start justify-between">
        <span className="font-body text-[15px] font-semibold text-neutral-900 truncate pr-2">
          {name}
        </span>
        
        {/* AI Score Badge */}
        <div 
          className="group relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${scoreColor}14` }} // 8% opacity approx
        >
          {/* SVG Ring */}
          <svg className="absolute inset-0 h-8 w-8 -rotate-90" viewBox="0 0 32 32">
            {/* Background track */}
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="transparent"
              strokeWidth="3"
            />
            {/* Progress ring */}
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke={scoreColor}
              strokeWidth="2.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          {/* Center text */}
          <span
            className="font-body text-[10px] font-bold"
            style={{ color: scoreColor }}
          >
            {aiScore}
          </span>
          
          {/* Tooltip */}
          <div className="absolute -top-10 right-0 z-10 w-max rounded bg-neutral-900 px-3 py-1.5 font-body text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none shadow-lg">
            AI Score: {aiScore}/100 — {scoreLabel}
            <div className="absolute -bottom-1 right-3 border-[4px] border-transparent border-t-neutral-900" />
          </div>
        </div>
      </div>

      {/* Row 2: Role + Source Pill */}
      <div className="flex items-center justify-between -mt-1">
        <span className="font-body text-[13px] text-neutral-500 truncate pr-2">
          {role}
        </span>
        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 font-body text-[10px] font-medium text-neutral-600">
          {sourcePillLabel}
        </span>
      </div>

      {/* Row 3: Days in stage + Avatar + Context Menu */}
      <div className="mt-1 flex items-center justify-between">
        <span className="font-body text-[11px] font-medium text-neutral-400">
          {daysInStage}d in stage
        </span>
        <div className="flex items-center gap-2">
          {/* Recruiter Avatar */}
          <img
            src={recruiterAvatarUrl}
            alt="Recruiter"
            className="h-5 w-5 rounded-full object-cover shadow-xs border border-white"
          />
          {/* Three dot menu trigger */}
          <button
            onClick={onContextMenuClick}
            className="flex h-5 w-5 items-center justify-center rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
            aria-label="Candidate options"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
