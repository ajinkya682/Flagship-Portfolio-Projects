"use client"

import * as React from "react"
import { ScrollEntry } from "@/components/shared/ScrollEntry"
import { useCountUp } from "@/hooks/useCountUp"
import { cn } from "@/lib/utils"

function StatCounter({ 
  endValue, 
  suffix = "", 
  prefix = "",
  label, 
  subLabel, 
  colorClass 
}: { 
  endValue: number, 
  suffix?: string, 
  prefix?: string,
  label: string, 
  subLabel: string, 
  colorClass: string 
}) {
  const { count, ref } = useCountUp(endValue, 1200)

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="flex flex-col items-center justify-center p-6 text-center">
      <div className={cn("font-display text-[52px] font-[800] leading-tight tracking-tight", colorClass)}>
        {prefix}{count}{suffix}
      </div>
      <div className="mt-2 font-body text-[17px] font-medium text-neutral-700">
        {label}
      </div>
      <div className="mt-1 font-body text-[12px] text-neutral-500">
        {subLabel}
      </div>
    </div>
  )
}

export function StatsStrip() {
  return (
    <ScrollEntry animation="fade-up">
      <section className="w-full bg-white py-20">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10 lg:px-[80px]">
          <div className="grid grid-cols-1 divide-y divide-neutral-100 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
            <StatCounter 
              endValue={50} 
              suffix="%" 
              label="Faster time-to-hire" 
              subLabel="Average across customers"
              colorClass="text-primary-500"
            />
            <StatCounter 
              endValue={70} 
              suffix="%" 
              label="Less time screening" 
              subLabel="With AI pre-scoring"
              colorClass="text-primary-500"
            />
            <StatCounter 
              endValue={91} 
              suffix="%" 
              label="AI score accuracy" 
              subLabel="Versus actual hire decisions"
              colorClass="text-accent-500"
            />
            <StatCounter 
              endValue={24} 
              prefix="$"
              suffix="K" 
              label="Saved per mis-hire" 
              subLabel="Fully loaded cost reduction"
              colorClass="text-accent-500"
            />
          </div>
        </div>
      </section>
    </ScrollEntry>
  )
}
