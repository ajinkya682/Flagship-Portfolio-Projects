'use client'

import { useRef } from 'react'
import { useCountUp } from '@/hooks/useCountUp'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { cn } from '@/lib/utils'

interface StatCounterProps {
  value: number
  prefix?: string
  suffix?: string
  label: string
  sublabel?: string
  color?: string
  align?: 'left' | 'center'
}

export default function StatCounter({
  value,
  prefix = '',
  suffix = '',
  label,
  sublabel,
  color = '#2563EB',
  align = 'center',
}: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { isIntersecting } = useIntersectionObserver(ref, { triggerOnce: true })
  const count = useCountUp(value, 1200, isIntersecting)

  return (
    <div 
      ref={ref} 
      className={cn("flex flex-col", align === 'center' ? 'text-center' : 'text-left')}
    >
      <div 
        className="font-display text-[52px] font-extrabold leading-none tracking-tight"
        style={{ color }}
      >
        {prefix}{count}{suffix}
      </div>
      <div className="font-body text-[17px] font-medium text-neutral-700 mt-2 leading-tight">
        {label}
      </div>
      {sublabel && (
        <div className="font-body text-[12px] text-neutral-500 mt-1 leading-tight">
          {sublabel}
        </div>
      )}
    </div>
  )
}
