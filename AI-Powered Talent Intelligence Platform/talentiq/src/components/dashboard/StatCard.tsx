'use client'

import { ElementType } from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import SparklineChart from './SparklineChart'

interface StatCardProps {
  icon: ElementType
  iconBg: string
  iconColor: string
  value: string | number
  label: string
  delta?: string
  deltaPositive?: boolean
  period?: string
  sparklineData?: number[]
}

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  delta,
  deltaPositive,
  period,
  sparklineData
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-150 flex flex-col pt-[24px] overflow-hidden">
      
      <div className="px-[24px]">
        <div className="flex justify-between items-start">
          <div 
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <Icon size={20} style={{ color: iconColor }} />
          </div>
          
          <div className="flex flex-col items-end">
            <span className="font-display text-[28px] font-bold text-neutral-900 leading-none tracking-tight">
              {value}
            </span>
            <span className="font-body text-[13px] font-medium text-neutral-500 mt-[2px]">
              {label}
            </span>
          </div>
        </div>

        {delta && (
          <div className="mt-[12px] flex items-center gap-[4px] justify-end">
            {deltaPositive ? (
              <ArrowUpRight size={12} className="text-[#10B981]" />
            ) : (
              <ArrowDownRight size={12} className="text-[#EF4444]" />
            )}
            <span className={`font-body text-[12px] font-semibold ${deltaPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {delta}
            </span>
            {period && (
              <span className="font-body text-[12px] text-neutral-400">
                {period}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-grow min-h-[24px]"></div>

      {sparklineData && sparklineData.length > 0 && (
        <SparklineChart data={sparklineData} color={iconColor} />
      )}
      {(!sparklineData || sparklineData.length === 0) && (
        <div className="h-[24px]"></div>
      )}
    </div>
  )
}
