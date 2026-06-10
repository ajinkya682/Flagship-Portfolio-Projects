import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonBlock({ count = 1, className, gap = 2 }: { count?: number, className?: string, gap?: number }) {
  return (
    <div className={`flex flex-col gap-${gap} ${className || ''}`}>
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} variant="text" />
      ))}
    </div>
  )
}
