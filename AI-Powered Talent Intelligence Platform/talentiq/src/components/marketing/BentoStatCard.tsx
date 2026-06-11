'use client'

import { Play } from 'lucide-react'
import StatCounter from './StatCounter'

interface BentoStatCardProps {
  stat?: string
  label: string
  description: string
}

export default function BentoStatCard({ stat = '50', label, description }: BentoStatCardProps) {
  const numericValue = parseInt(stat.replace(/\D/g, ''), 10) || 50
  
  return (
    <div className="bg-[#F9FAFB] border border-neutral-200 rounded-[24px] p-8 shadow-sm relative h-full flex flex-col justify-end min-h-[340px]">
      <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shadow-md">
        <Play className="w-5 h-5 text-white ml-0.5" />
      </div>

      <div className="mt-auto">
        <div className="text-left">
          <StatCounter 
            value={numericValue} 
            suffix="%" 
            label={label} 
            sublabel={description}
            color="#111827" 
            align="left"
          />
        </div>
      </div>
    </div>
  )
}
