import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }
>(({ className, hoverable, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-6 shadow-sm",
      hoverable && "cursor-pointer transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-[2px] hover:shadow-md",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const GlassCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-[var(--radius-xl)] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.08)] p-6 text-white shadow-glass backdrop-blur-md",
      className
    )}
    {...props}
  />
))
GlassCard.displayName = "GlassCard"

export { Card, GlassCard }
