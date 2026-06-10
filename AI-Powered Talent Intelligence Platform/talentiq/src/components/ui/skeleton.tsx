import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "heading" | "avatar" | "badge" | "card" | "ring"
}

export function Skeleton({
  className,
  variant = "text",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-neutral-100",
        // The shimmer gradient needs a specific background-size and image
        "bg-[length:200%_100%] bg-[linear-gradient(90deg,#F3F4F6_0%,#E5E7EB_40%,#E5E7EB_60%,#F3F4F6_100%)]",
        
        // Variants
        variant === "text" && "h-[14px] w-[80%] rounded-sm",
        variant === "heading" && "h-[22px] w-[70%] rounded-sm",
        variant === "avatar" && "h-10 w-10 rounded-full",
        variant === "badge" && "h-[28px] w-[80px] rounded-full",
        variant === "card" && "h-[200px] w-full rounded-[var(--radius-lg)] p-6",
        variant === "ring" && "h-[72px] w-[72px] rounded-full",
        
        className
      )}
      {...props}
    />
  )
}
