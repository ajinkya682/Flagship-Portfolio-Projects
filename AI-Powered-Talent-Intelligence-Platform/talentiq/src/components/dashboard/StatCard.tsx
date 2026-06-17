'use client'

import { useEffect, useRef, useState, ElementType } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatCardProps {
  icon: ElementType
  iconBg: string
  iconColor: string
  gradientFrom: string
  gradientTo: string
  value: string | number
  label: string
  delta?: string
  deltaPositive?: boolean
  period?: string
  sparklineData?: number[]
  prefix?: string
  suffix?: string
}

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 28
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} className="opacity-70">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {(() => {
        const lastX = width
        const lastV = data[data.length - 1]
        const lastY = height - ((lastV - min) / range) * height
        return <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
      })()}
    </svg>
  )
}

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [target, duration])

  return count
}

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  gradientFrom,
  gradientTo,
  value,
  label,
  delta,
  deltaPositive,
  period,
  sparklineData,
  prefix = '',
  suffix = '',
}: StatCardProps) {
  const numericValue = typeof value === 'number' ? value : parseInt(String(value), 10) || 0
  const animated = useCountUp(numericValue)

  return (
    <div
      className="relative bg-white rounded-[16px] border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 overflow-hidden flex flex-col"
      style={{ minHeight: 130 }}
    >
      {/* Subtle gradient accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${gradientFrom}, ${gradientTo})` }}
      />

      <div className="flex items-start justify-between px-[20px] pt-[20px] pb-[12px] gap-[8px]">
        {/* Icon */}
        <div
          className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center shrink-0 shadow-sm"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>

        {/* Value + label */}
        <div className="text-right flex-1">
          <div className="font-display text-[30px] font-bold text-neutral-900 leading-none tracking-tight">
            {prefix}{typeof value === 'number' ? animated : value}{suffix}
          </div>
          <div className="font-body text-[12px] font-medium text-neutral-500 mt-[4px] leading-tight">{label}</div>
        </div>
      </div>

      {/* Delta + sparkline row */}
      <div className="flex items-end justify-between px-[20px] pb-[16px] mt-auto">
        {delta && (
          <div className="flex items-center gap-[4px]">
            <div className={`flex items-center gap-[2px] px-[6px] py-[2px] rounded-full text-[11px] font-semibold ${deltaPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {deltaPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {delta}
            </div>
            {period && <span className="font-body text-[11px] text-neutral-400">{period}</span>}
          </div>
        )}
        {sparklineData && sparklineData.length > 1 && (
          <div className="ml-auto">
            <MiniSparkline data={sparklineData} color={iconColor} />
          </div>
        )}
      </div>
    </div>
  )
}
