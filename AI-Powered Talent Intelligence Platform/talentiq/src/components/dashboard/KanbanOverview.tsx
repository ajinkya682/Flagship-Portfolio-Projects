import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function KanbanOverview() {
  const stages = [
    { name: "Sourced", count: 12, isActive: false },
    { name: "Screening", count: 8, isActive: true },
    { name: "Interview", count: 4, isActive: false },
    { name: "Offer", count: 2, isActive: false },
    { name: "Hired", count: 1, isActive: false },
  ]

  const miniCandidates = [
    { name: "Maria Torres", score: 92, avatar: "https://i.pravatar.cc/150?u=a1" },
    { name: "David Kim", score: 88, avatar: "https://i.pravatar.cc/150?u=a2" },
    { name: "Sarah Lee", score: 85, avatar: "https://i.pravatar.cc/150?u=a3" },
  ]

  return (
    <div className="flex flex-col h-full rounded-[var(--radius-xl)] border border-neutral-200 bg-white p-[24px] shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <h4 className="font-display text-[16px] font-semibold text-neutral-900">
          Pipeline Overview
        </h4>
        <Link href="/pipeline" className="font-body text-[13px] font-medium text-primary-500 hover:underline">
          View Full Pipeline
        </Link>
      </div>

      {/* Stage Pills */}
      <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar">
        {stages.map(stage => (
          <div 
            key={stage.name}
            className={cn(
              "flex h-[28px] shrink-0 items-center rounded-full px-[12px] gap-[6px]",
              stage.isActive ? "bg-accent-50" : "bg-primary-50"
            )}
          >
            <span className={cn(
              "font-body text-[12px] font-medium",
              stage.isActive ? "text-accent-700" : "text-primary-700"
            )}>
              {stage.name}
            </span>
            <div className={cn(
              "flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-[4px] font-body text-[10px] font-bold",
              stage.isActive ? "bg-accent-200 text-accent-800" : "bg-primary-200 text-primary-800"
            )}>
              {stage.count}
            </div>
          </div>
        ))}
      </div>

      {/* Mini Candidate Strip */}
      <div className="mt-[16px] flex flex-col gap-2">
        <span className="font-body text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">
          Recent Activity
        </span>
        <div className="flex overflow-x-auto pb-2 gap-3 custom-scrollbar items-center">
          {miniCandidates.map((c, i) => (
            <div key={i} className="flex h-[48px] shrink-0 items-center gap-3 rounded-[var(--radius-md)] border border-neutral-200 bg-white px-[12px] shadow-sm hover:-translate-y-[1px] hover:shadow-md transition-all cursor-pointer">
              <img src={c.avatar} alt={c.name} className="h-[24px] w-[24px] rounded-full object-cover" />
              <span className="font-body text-[14px] font-medium text-neutral-900">{c.name}</span>
              <div className="flex h-[24px] items-center justify-center rounded-full bg-[#F0FDF4] border border-[#10B981] px-[8px]">
                <span className="font-body text-[11px] font-bold text-[#10B981]">{c.score}</span>
              </div>
            </div>
          ))}
          <Link href="/candidates" className="shrink-0 flex items-center font-body text-[13px] font-medium text-neutral-500 hover:text-neutral-900 ml-2">
            View All <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>

      <div className="mt-auto pt-[20px]">
        <Button variant="secondary" className="w-full">
          View Full Kanban Board
        </Button>
      </div>

    </div>
  )
}
