"use client"

import * as React from "react"

interface ChartCardProps {
  title: string
  period?: string
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, period, children, className = "" }: ChartCardProps) {
  return (
    <div className={`flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[24px] shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-[24px]">
        <h4 className="font-display text-[16px] font-semibold text-neutral-900">
          {title}
        </h4>
        {period && (
          <span className="font-body text-[13px] text-neutral-500 text-right">
            {period}
          </span>
        )}
      </div>
      <div className="flex-1 w-full relative">
        {children}
      </div>
    </div>
  )
}
