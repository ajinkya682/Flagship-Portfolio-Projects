import * as React from "react"
import { cn } from "@/lib/utils"

export function SourceBadge({ source, className }: { source: string; className?: string }) {
  // We can add specific colors per source later, but spec defaults to neutral-100 pill
  return (
    <span className={cn("inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 font-body text-[10px] font-semibold text-neutral-700", className)}>
      {source}
    </span>
  )
}

export function StageBadge({ stage, className }: { stage: string; className?: string }) {
  // Stage specific colors could be mapped here.
  let bg = "bg-primary-50"
  let text = "text-primary-700"
  
  const s = stage.toLowerCase()
  if (s.includes("offer")) {
    bg = "bg-accent-50"
    text = "text-accent-700"
  } else if (s.includes("reject")) {
    bg = "bg-neutral-100"
    text = "text-neutral-500"
  }

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold uppercase tracking-wider", bg, text, className)}>
      {stage}
    </span>
  )
}
