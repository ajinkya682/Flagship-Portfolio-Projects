"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function ApplicationStatusTimeline() {
  const stages = [
    { id: "applied", label: "Applied", state: "completed" },
    { id: "screening", label: "Screening", state: "completed" },
    { id: "interview", label: "Interview", state: "current" },
    { id: "offer", label: "Offer", state: "future" },
    { id: "hired", label: "Hired", state: "future" }
  ]

  return (
    <div className="flex w-full items-start justify-between relative mt-[24px]">
      {stages.map((stage, idx) => (
        <div key={stage.id} className="relative flex flex-col items-center flex-1">
          
          {/* Connecting Line (drawn to the next circle) */}
          {idx < stages.length - 1 && (
            <div 
              className={cn(
                "absolute top-[16px] left-[50%] w-full h-[2px]",
                stage.state === "completed" ? "bg-accent-500" : "bg-neutral-200 border-t-2 border-dashed border-neutral-300 bg-transparent h-[0px]"
              )}
            />
          )}

          {/* Node */}
          <div className="relative z-10 flex flex-col items-center gap-[12px] bg-white px-[8px]">
            {stage.state === "completed" && (
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-accent-500 shadow-sm text-white">
                <Check size={16} strokeWidth={3} />
              </div>
            )}
            
            {stage.state === "current" && (
              <div className="relative flex h-[32px] w-[32px] items-center justify-center rounded-full bg-primary-500 shadow-sm text-white">
                <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20" />
                <div className="h-[12px] w-[12px] bg-white rounded-full" />
              </div>
            )}

            {stage.state === "future" && (
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-neutral-100 border-[2px] border-neutral-200">
                <div className="h-[8px] w-[8px] bg-neutral-300 rounded-full" />
              </div>
            )}

            <span className={cn(
              "font-body text-[12px] text-center",
              stage.state === "completed" ? "font-semibold text-accent-700" : 
              stage.state === "current" ? "font-bold text-primary-700" : 
              "font-medium text-neutral-400"
            )}>
              {stage.label}
            </span>
          </div>

        </div>
      ))}
    </div>
  )
}
