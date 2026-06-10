import * as React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TestimonialCardProps {
  quote: string
  authorName: string
  authorTitle: string
  authorCompany: string
  authorAvatarUrl: string
  metricCallout: string
  className?: string
}

export function TestimonialCard({
  quote,
  authorName,
  authorTitle,
  authorCompany,
  authorAvatarUrl,
  metricCallout,
  className,
}: TestimonialCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-[var(--radius-xl)] bg-white p-8 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md border border-neutral-100",
        className
      )}
    >
      {/* Decorative quote mark */}
      <div className="absolute top-4 right-8 font-display text-[80px] font-black leading-none text-primary-50 select-none">
        "
      </div>

      {/* Stars */}
      <div className="relative z-10 flex items-center gap-0.5 text-[#FBBF24]">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="currentColor" />
        ))}
      </div>

      {/* Quote */}
      <p className="relative z-10 mt-5 max-w-[340px] font-body text-[17px] italic leading-relaxed text-neutral-900">
        "{quote}"
      </p>

      {/* Author Info */}
      <div className="mt-6 flex items-center gap-3">
        <img
          src={authorAvatarUrl}
          alt={authorName}
          className="h-11 w-11 rounded-full object-cover shadow-xs border border-neutral-100"
        />
        <div className="flex flex-col">
          <span className="font-body text-[14px] font-semibold text-neutral-900">
            {authorName}
          </span>
          <span className="font-body text-[12px] text-neutral-500">
            {authorTitle}, {authorCompany}
          </span>
        </div>
      </div>

      {/* Metric Callout */}
      <div className="mt-6 inline-flex rounded-full bg-accent-50 px-3 py-1 font-body text-[13px] font-bold text-accent-600">
        {metricCallout}
      </div>
    </div>
  )
}
