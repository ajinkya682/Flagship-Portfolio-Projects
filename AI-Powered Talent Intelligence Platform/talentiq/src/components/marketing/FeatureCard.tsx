import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  colorVariant?: "primary" | "accent"
  className?: string
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  colorVariant = "primary",
  className,
}: FeatureCardProps) {
  const isPrimary = colorVariant === "primary"

  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] bg-[var(--gradient-card-feature)] p-8",
        "border border-[rgba(37,99,235,0.10)]",
        "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-lg",
          isPrimary
            ? "bg-gradient-to-br from-primary-50 to-primary-100/50 text-primary-500"
            : "bg-gradient-to-br from-accent-50 to-accent-100/50 text-accent-500"
        )}
      >
        <Icon size={24} />
      </div>
      <h3 className="mt-4 font-display text-[18px] font-semibold text-neutral-900">
        {title}
      </h3>
      <p className="mt-2 font-body text-[15px] leading-relaxed text-neutral-600">
        {description}
      </p>
    </div>
  )
}
