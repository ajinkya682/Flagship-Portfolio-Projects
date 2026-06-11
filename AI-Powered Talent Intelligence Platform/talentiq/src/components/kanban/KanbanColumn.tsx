"use client"

import * as React from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { MoreHorizontal, Plus } from "lucide-react"
import { KanbanCard, type Candidate } from "./KanbanCard"
import { cn } from "@/lib/utils"
import confetti from "canvas-confetti"

export interface Stage {
  id: string
  name: string
  color: "primary" | "info" | "warning" | "purple" | "accent" | "hired"
}

interface KanbanColumnProps {
  stage: Stage
  candidates: Candidate[]
  onCardClick?: (candidate: Candidate) => void
  selectedCardId?: string | null
}

export function KanbanColumn({ stage, candidates, onCardClick, selectedCardId }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    data: {
      type: "Column",
      stage,
    },
  })

  const stageColors = {
    primary: { border: "border-primary-500", text: "text-primary-700", bg: "bg-primary-50" }, // Screening
    info: { border: "border-[#3B82F6]", text: "text-[#3B82F6]", bg: "bg-blue-50" }, // Phone Screen
    warning: { border: "border-[#F59E0B]", text: "text-[#F59E0B]", bg: "bg-amber-50" }, // Interview
    purple: { border: "border-[#8B5CF6]", text: "text-[#8B5CF6]", bg: "bg-purple-50" }, // Assessment
    accent: { border: "border-accent-500", text: "text-accent-700", bg: "bg-accent-50" }, // Offer
    hired: { border: "border-accent-600", text: "text-accent-800", bg: "bg-accent-100" }, // Hired
  }

  const colorConfig = stageColors[stage.color] || stageColors.primary

  const prevCountRef = React.useRef(candidates.length)
  
  React.useEffect(() => {
    if (stage.color === "hired" && candidates.length > prevCountRef.current) {
      // Fire mini confetti burst for Hired column
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#A7F3D0'],
        disableForReducedMotion: true
      })
    }
    prevCountRef.current = candidates.length
  }, [candidates.length, stage.color])

  return (
    <div 
      className="flex h-full w-[280px] shrink-0 flex-col rounded-md"
      role="region"
      aria-label={`${stage.name} stage with ${candidates.length} candidates`}
    >
      
      {/* Column Header */}
      <div className="relative flex h-[44px] shrink-0 items-center justify-between rounded-[var(--radius-md)] bg-white px-[12px] shadow-sm">
        <div className="flex items-center gap-[8px]">
          {/* Left accent */}
          <div className={`h-[24px] w-[3px] rounded-full border-l-3 ${colorConfig.border} border-l-[3px]`} />
          <h5 className="font-display text-[14px] font-semibold text-neutral-900">{stage.name}</h5>
          
          {/* Count Badge */}
          <div 
            key={candidates.length} // Force re-mount to trigger animation
            className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-neutral-50 px-[6px] font-body text-[11px] font-bold text-neutral-600 animate-spring-in"
          >
            {candidates.length}
          </div>
        </div>

        <button 
          className="flex h-[24px] w-[24px] items-center justify-center rounded-sm text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          aria-label={`Options for ${stage.name}`}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Column Body (Droppable & Sortable) */}
      <div 
        ref={setNodeRef as React.Ref<HTMLDivElement>}
        className={cn(
          "mt-[8px] flex flex-1 flex-col gap-[8px] overflow-y-auto overflow-x-hidden p-[8px] rounded-md custom-scrollbar-thin transition-colors",
          isOver ? "bg-neutral-200/50" : "bg-transparent"
        )}
      >
        <SortableContext 
          items={candidates.map(c => c.id)} 
          strategy={verticalListSortingStrategy}
        >
          {candidates.map(candidate => (
            <KanbanCard 
              key={candidate.id} 
              candidate={candidate} 
              onClick={onCardClick}
              isSelected={selectedCardId === candidate.id}
            />
          ))}
        </SortableContext>
        
        {/* Empty state padding to allow dropping into empty column easily */}
        <div className="min-h-[40px] w-full" />
      </div>

      {/* Column Footer */}
      <div className="shrink-0 pt-[8px] text-center">
        <button 
          className="inline-flex items-center font-body text-[12px] font-medium text-neutral-400 hover:text-neutral-700 transition-colors"
          aria-label={`Add candidate to ${stage.name}`}
        >
          <Plus size={12} className="mr-1" /> Add Candidate
        </button>
      </div>

    </div>
  )
}
