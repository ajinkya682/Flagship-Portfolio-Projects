"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"
import { ScoreRing } from "@/components/ui/score-ring"

export interface Candidate {
  id: string
  name: string
  role: string
  score: number
  source: string
  daysInStage: string
  avatar: string
  recruiterAvatar: string
}

interface KanbanCardProps {
  candidate: Candidate
  onClick?: (candidate: Candidate) => void
  isSelected?: boolean
}

export function KanbanCard({ candidate, onClick, isSelected }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: candidate.id,
    data: {
      type: "Candidate",
      candidate,
    },
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  }

  const getScoreColorHex = (score: number) => {
    if (score >= 80) return "#10B981"
    if (score >= 60) return "#F59E0B"
    return "#EF4444"
  }

  const sourceColors: Record<string, string> = {
    "LinkedIn": "bg-[#0A66C2]/10 text-[#0A66C2]",
    "Website": "bg-primary-100 text-primary-700",
    "Referral": "bg-accent-100 text-accent-700",
    "Indeed": "bg-neutral-100 text-neutral-700"
  }

  return (
    <div
      ref={setNodeRef as React.Ref<HTMLDivElement>}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(candidate)}
      className={cn(
        "relative flex w-full flex-col overflow-hidden rounded-[var(--radius-md)] border bg-white p-[14px_16px] shadow-sm transition-shadow",
        isDragging 
          ? "cursor-grabbing opacity-50 shadow-xl" // Note: the actual drag overlay handles the rotation and full opacity, the original item in the list fades out
          : "cursor-grab hover:shadow-md",
        isSelected ? "border-primary-500 bg-primary-50" : "border-neutral-200"
      )}
    >
      {/* Left accent bar */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[3px]"
        style={{ backgroundColor: getScoreColorHex(candidate.score) }}
      />

      {/* Row 1 */}
      <div className="flex items-start justify-between">
        <span className="font-body text-[15px] font-semibold text-neutral-900 leading-tight">
          {candidate.name}
        </span>
        {/* ScoreBadge with Tooltip placeholder */}
        <div title={`AI Score: ${candidate.score}/100`} className="shrink-0 ml-2">
          <ScoreRing score={candidate.score} size="sm" showLabel={false} />
        </div>
      </div>

      {/* Row 2 */}
      <div className="mt-[4px] flex items-center justify-between">
        <span className="font-body text-[13px] text-neutral-500 truncate mr-2">
          {candidate.role}
        </span>
        <div className={cn(
          "flex h-[20px] items-center rounded-full px-[8px] font-body text-[10px] font-medium shrink-0",
          sourceColors[candidate.source] || "bg-neutral-100 text-neutral-700"
        )}>
          {candidate.source}
        </div>
      </div>

      {/* Row 3 */}
      <div className="mt-[12px] flex items-center justify-between">
        <span className="font-body text-[11px] text-neutral-400">
          {candidate.daysInStage} in stage
        </span>
        <img 
          src={candidate.recruiterAvatar} 
          alt="Recruiter" 
          className="h-[20px] w-[20px] rounded-full object-cover shadow-xs" 
        />
      </div>

    </div>
  )
}
