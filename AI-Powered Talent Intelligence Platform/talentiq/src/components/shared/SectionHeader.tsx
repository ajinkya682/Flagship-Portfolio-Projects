import * as React from "react"
import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  title: string
  overline?: string
  description?: string
  className?: string
}

export function SectionHeader({ title, overline, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-6 flex flex-col items-start text-left", className)}>
      {overline && (
        <span className="mb-2 font-body text-[12px] font-bold uppercase tracking-wider text-primary-600">
          {overline}
        </span>
      )}
      <h2 className="font-display text-[24px] font-bold tracking-tight text-neutral-900">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl font-body text-[15px] text-neutral-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}
