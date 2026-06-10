import * as React from "react"
import { cn } from "@/lib/utils"

export function GradientText({ 
  children, 
  className,
  variant = "primary" 
}: { 
  children: React.ReactNode
  className?: string
  variant?: "primary" | "accent"
}) {
  return (
    <span 
      className={cn(
        "bg-clip-text text-transparent",
        variant === "primary" && "bg-gradient-to-r from-primary-600 to-primary-400",
        variant === "accent" && "bg-gradient-to-r from-accent-600 to-accent-400",
        className
      )}
    >
      {children}
    </span>
  )
}
