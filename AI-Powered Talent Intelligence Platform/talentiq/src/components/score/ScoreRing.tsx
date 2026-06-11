"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScoreRingProps {
  score: number
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  sm: 32,
  md: 72,
  lg: 80,
  xl: 100,
}

export function ScoreRing({ score, size = "lg", className }: ScoreRingProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    // Small delay to trigger animation on mount
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const pxSize = sizeMap[size]
  const isSm = size === "sm"
  
  // Color logic
  let scoreColor = "#10B981" // high
  if (score < 50) { // Spec says <60 is low, but previous parts used <50 for low and 50-80 for medium. The spec here says: "score >= 80: high, score >= 60: medium, score < 60: low".
    scoreColor = "#EF4444" // low
  } else if (score < 80) {
    scoreColor = "#F59E0B" // medium
  }

  // Base SVG viewBox is 80x80. Center is 40,40. Radius 32. 
  // Circumference: 2 * pi * 32 = ~201.06
  const circumference = 2 * Math.PI * 32
  const targetOffset = circumference * (1 - score / 100)

  return (
    <div 
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: pxSize, height: pxSize }}
    >
      <svg 
        viewBox="0 0 80 80" 
        width={pxSize} 
        height={pxSize}
        className="absolute inset-0"
        role="img"
        aria-label={`AI Score: ${score}`}
      >
        {/* Track ring */}
        <circle
          cx="40" 
          cy="40" 
          r="32"
          fill="none"
          stroke="#F5F5F5" // var(--color-neutral-100)
          strokeWidth="8"
        />
        {/* Score ring */}
        <circle
          cx="40" 
          cy="40" 
          r="32"
          fill="none"
          stroke={scoreColor}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={mounted ? targetOffset : circumference}
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dashoffset 600ms cubic-bezier(0.4,0,0.2,1)" }}
        />
        {/* Center label */}
        <text 
          x="40" 
          y={isSm ? "45" : "46"}
          textAnchor="middle"
          fontFamily="Inter, sans-serif" 
          fontSize={isSm ? "24" : "18"} 
          fontWeight="700"
          fill={scoreColor}
        >
          {score}
        </text>
      </svg>
    </div>
  )
}
