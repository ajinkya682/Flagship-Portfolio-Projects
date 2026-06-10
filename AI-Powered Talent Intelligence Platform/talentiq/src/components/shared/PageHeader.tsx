import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center", className)}>
      <div>
        <h1 className="font-display text-[28px] font-bold tracking-tight text-neutral-900">
          {title}
        </h1>
        {description && (
          <p className="mt-1 font-body text-[15px] text-neutral-500">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex w-full shrink-0 items-center gap-3 sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  )
}
