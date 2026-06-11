'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { getScoreColor, getScoreLabel } from '@/lib/score'

export interface ScoreRingProps {
  score: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function ScoreRing({ score, size = 'lg', className }: ScoreRingProps) {
  const sizeMap = {
    sm: { px: 32, radius: 12, stroke: 4, text: 8 },
    md: { px: 72, radius: 29, stroke: 6, text: 13 },
    lg: { px: 80, radius: 32, stroke: 8, text: 16 },
    xl: { px: 100, radius: 40, stroke: 10, text: 20 },
  }

  const { px, radius, stroke, text } = sizeMap[size]
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - score / 100)
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  const [displayOffset, setDisplayOffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayOffset(targetOffset)
    }, 50)
    return () => clearTimeout(timer)
  }, [targetOffset])

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: px, height: px }}>
      <svg 
        viewBox={`0 0 ${px} ${px}`} 
        width={px} 
        height={px}
        className="absolute inset-0"
        role="img"
        aria-label={`AI Score: ${score} out of 100 - ${label}`}
      >
        <circle
          cx={px / 2} 
          cy={px / 2} 
          r={radius}
          fill="none"
          stroke="#F3F4F6"
          strokeWidth={stroke}
        />
        <circle
          cx={px / 2} 
          cy={px / 2} 
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={displayOffset}
          transform={`rotate(-90 ${px / 2} ${px / 2})`}
          className="score-ring-animated"
        />
        <text 
          x={px / 2} 
          y={px / 2 + text / 3}
          textAnchor="middle"
          fontFamily="Inter, sans-serif" 
          fontSize={text} 
          fontWeight="700"
          fill={color}
        >
          {score}
        </text>
      </svg>
    </div>
  )
}
