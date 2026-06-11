'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { getScoreColor } from '@/lib/score'

interface SubscoreBarProps {
  label: string
  value: number
  className?: string
}

export default function SubscoreBar({ label, value, className }: SubscoreBarProps) {
  const [width, setWidth] = useState(0)
  const color = getScoreColor(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div className={cn("flex flex-col gap-[6px] w-full", className)}>
      <div className="flex justify-between items-center w-full">
        <span className="font-body text-[13px] text-neutral-700">{label}</span>
        <span className="font-body text-[13px] font-semibold text-neutral-700">{value}%</span>
      </div>
      
      <div className="w-full h-[6px] bg-[#F3F4F6] rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-800 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
