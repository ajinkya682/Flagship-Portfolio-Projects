"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScoreRingProps {
  score: number
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showLabel?: boolean
  label?: string
}

export function ScoreRing({ score, size = "md", className, showLabel = true, label }: ScoreRingProps) {
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#10B981]"
    if (score >= 60) return "text-[#F59E0B]"
    return "text-[#EF4444]"
  }

  const getScoreHex = (score: number) => {
    if (score >= 80) return "#10B981"
    if (score >= 60) return "#F59E0B"
    return "#EF4444"
  }

  const sizeMap = {
    sm: { width: 32, strokeWidth: 4, fontSize: 10, centerOffset: 2 },
    md: { width: 72, strokeWidth: 8, fontSize: 16, centerOffset: 5 },
    lg: { width: 80, strokeWidth: 8, fontSize: 18, centerOffset: 6 },
    xl: { width: 100, strokeWidth: 10, fontSize: 24, centerOffset: 8 },
  }

  const dims = sizeMap[size]
  const center = dims.width / 2
  const radius = center - dims.strokeWidth / 2
  const circumference = 2 * Math.PI * radius
  
  // Start at full circumference (empty) and transition to computed offset
  const computedOffset = circumference * (1 - score / 100)
  const strokeDashoffset = mounted ? computedOffset : circumference

  const hexColor = getScoreHex(score)

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <svg 
        viewBox={`0 0 ${dims.width} ${dims.width}`} 
        width={dims.width} 
        height={dims.width}
        className="overflow-visible"
      >
        {/* Track ring */}
        <circle
          cx={center} 
          cy={center} 
          r={radius}
          fill="none"
          stroke="var(--color-neutral-100, #F3F4F6)"
          strokeWidth={dims.strokeWidth}
        />
        {/* Fill Background (8% opacity) */}
        <circle
          cx={center} 
          cy={center} 
          r={radius - dims.strokeWidth/2}
          fill={hexColor}
          fillOpacity={0.08}
        />
        {/* Score ring */}
        <circle
          cx={center} 
          cy={center} 
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={dims.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
          className={getScoreColor(score)}
          style={{ transition: "stroke-dashoffset 800ms cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Center text */}
        <text 
          x={center} 
          y={center + dims.centerOffset}
          textAnchor="middle"
          fontFamily="Inter, sans-serif" 
          fontSize={dims.fontSize} 
          fontWeight="700"
          fill="currentColor"
          className={getScoreColor(score)}
        >
          {score}
        </text>
      </svg>
      {showLabel && label && (
        <div className="mt-[12px] font-body text-[12px] font-semibold text-neutral-700">
          {label}
        </div>
      )}
    </div>
  )
}
