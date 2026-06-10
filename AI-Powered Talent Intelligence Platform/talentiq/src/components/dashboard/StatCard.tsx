"use client"

import * as React from "react"
import { ArrowUpRight, ArrowDownRight, Briefcase, UserPlus, Sparkles, FileText, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCountUp } from "@/hooks/useCountUp"

export interface StatCardProps {
  title: string
  value: number
  valuePrefix?: string
  valueSuffix?: string
  delta: number
  deltaPeriod: string
  iconType: "briefcase" | "userPlus" | "sparkles" | "fileText"
  colorTheme?: "primary" | "accent" | "warning"
  sparklineData?: number[]
  subText?: string
}

export function StatCard({
  title,
  value,
  valuePrefix = "",
  valueSuffix = "",
  delta,
  deltaPeriod,
  iconType,
  colorTheme = "primary",
  sparklineData,
  subText
}: StatCardProps) {
  // Use the useCountUp hook for animated numbers
  const { count: animatedValue, ref } = useCountUp(value, 1200)

  const isPositive = delta >= 0

  // Theme mapping
  const themes = {
    primary: {
      bg: "bg-primary-50",
      icon: "text-primary-500",
      sparklineStroke: "#93C5FD", // primary-300
      sparklineFill: "rgba(59, 130, 246, 0.08)",
    },
    accent: {
      bg: "bg-accent-50",
      icon: "text-accent-500",
      sparklineStroke: "#6EE7B7", // accent-300
      sparklineFill: "rgba(16, 185, 129, 0.08)",
    },
    warning: {
      bg: "bg-[#FFFBEB]", // warning-50
      icon: "text-[#F59E0B]", // warning-500
      sparklineStroke: "#FCD34D", // warning-300
      sparklineFill: "rgba(245, 158, 11, 0.08)",
    }
  }

  const theme = themes[colorTheme]

  // Icon mapping
  const renderIcon = () => {
    switch (iconType) {
      case "briefcase": return <Briefcase size={20} className={theme.icon} />
      case "userPlus": return <UserPlus size={20} className={theme.icon} />
      case "sparkles": return <Sparkles size={20} className={theme.icon} />
      case "fileText": return <FileText size={20} className={theme.icon} />
      default: return <Briefcase size={20} className={theme.icon} />
    }
  }

  // Simple SVG sparkline generator
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length === 0) return null
    
    const max = Math.max(...sparklineData)
    const min = Math.min(...sparklineData)
    const range = max - min || 1
    const width = 100 // relative width
    const height = 56
    
    const points = sparklineData.map((val, i) => {
      const x = (i / (sparklineData.length - 1)) * width
      const y = height - ((val - min) / range) * (height - 10) - 5 // 5px padding
      return `${x},${y}`
    }).join(" ")

    return (
      <div className="absolute bottom-0 left-0 right-0 h-[56px] w-full overflow-hidden rounded-b-[var(--radius-xl)]">
        <svg viewBox={`0 0 100 56`} preserveAspectRatio="none" className="h-full w-full">
          <polyline
            points={points}
            fill="none"
            stroke={theme.sparklineStroke}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <polygon
            points={`0,56 ${points} 100,56`}
            fill={theme.sparklineFill}
          />
        </svg>
      </div>
    )
  }

  return (
    <div ref={ref} className="relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-neutral-200 bg-white p-[24px] shadow-sm transition-all duration-150 ease-out hover:-translate-y-[2px] hover:shadow-md cursor-pointer group">
      
      {/* Row 1 */}
      <div className="flex items-start justify-between z-10">
        <div className={cn("flex h-[40px] w-[40px] items-center justify-center rounded-full", theme.bg)}>
          {renderIcon()}
        </div>
        <div className="flex flex-col items-end">
          <span className="font-display text-[28px] font-bold leading-none text-neutral-900">
            {valuePrefix}{animatedValue}{valueSuffix}
          </span>
          <span className="mt-[2px] font-body text-[13px] font-medium text-neutral-500">
            {title}
          </span>
        </div>
      </div>

      {/* Row 2 */}
      <div className="mt-[12px] flex flex-col gap-1 z-10">
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <ArrowUpRight size={12} className="text-[#10B981]" />
          ) : (
            <ArrowDownRight size={12} className="text-[#EF4444]" />
          )}
          <span className={cn("font-body text-[12px] font-semibold", isPositive ? "text-[#10B981]" : "text-[#EF4444]")}>
            {isPositive ? "+" : ""}{delta}%
          </span>
          <span className="font-body text-[12px] text-neutral-400">
            {deltaPeriod}
          </span>
        </div>
        
        {subText && (
          <span className={cn("font-body text-[12px]", colorTheme === "warning" ? "text-[#F59E0B] font-medium" : "text-neutral-500")}>
            {subText}
          </span>
        )}
      </div>

      {/* Row 3 - Sparkline */}
      {renderSparkline()}

      {/* Bottom padding adjustment if sparkline exists */}
      {sparklineData && <div className="h-[24px]" />}
    </div>
  )
}
