import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function ActivityFeed() {
  const activities = [
    { text: "Maria Torres applied to Senior Engineer", time: "2 min ago", type: "manual" },
    { text: "AI scored David Kim 91/100", time: "4 min ago", type: "ai" },
    { text: "Interview scheduled for Sarah Lee", time: "1 hour ago", type: "manual" },
    { text: "Offer sent to James Wilson", time: "3 hours ago", type: "manual" },
    { text: "AI flagged bias in job description", time: "5 hours ago", type: "ai" },
  ]

  return (
    <div className="flex flex-col h-full rounded-[var(--radius-xl)] border border-neutral-200 bg-white p-[24px] shadow-sm">
      
      {/* Header */}
      <h4 className="mb-[16px] font-display text-[16px] font-semibold text-neutral-900">
        Recent Activity
      </h4>

      {/* Timeline List */}
      <div className="flex flex-col relative flex-1">
        {activities.map((activity, idx) => (
          <div 
            key={idx}
            className="relative flex h-[48px] items-center gap-[12px] rounded-[var(--radius-md)] px-[8px] transition-colors hover:bg-neutral-50 group"
          >
            {/* Timeline connector (except last item) */}
            {idx !== activities.length - 1 && (
              <div className="absolute left-[11px] top-[24px] h-[48px] w-px border-l border-dashed border-neutral-200" />
            )}
            
            {/* Dot */}
            <div className="relative flex h-[16px] w-[6px] justify-center items-center">
              <div className={cn(
                "h-[6px] w-[6px] rounded-full shrink-0 z-10 ring-4 ring-white group-hover:ring-neutral-50",
                activity.type === "ai" ? "bg-accent-500" : "bg-primary-500"
              )} />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center">
              <span className="font-body text-[13px] text-neutral-900 leading-tight">
                {activity.text}
              </span>
              <span className="font-body text-[11px] text-neutral-400 mt-[2px]">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-[16px]">
        <Link href="/activity" className="font-body text-[12px] font-medium text-primary-500 hover:underline">
          View all activity
        </Link>
      </div>

    </div>
  )
}
