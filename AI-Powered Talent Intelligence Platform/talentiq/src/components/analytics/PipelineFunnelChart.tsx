"use client"

import * as React from "react"
import { ArrowDownRight } from "lucide-react"

export function PipelineFunnelChart() {
  const data = [
    { stage: "Applied", count: 1245, conversion: 100, color: "bg-primary-100" },
    { stage: "Screening", count: 850, conversion: 68, color: "bg-primary-300" },
    { stage: "Interview", count: 320, conversion: 37, color: "bg-primary-500" },
    { stage: "Assessment", count: 145, conversion: 45, color: "bg-primary-700" },
    { stage: "Offer", count: 42, conversion: 28, color: "bg-primary-900" },
  ]

  return (
    <div className="flex flex-col gap-[16px] w-full">
      {data.map((item, idx) => (
        <div key={item.stage} className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between font-body">
            <span className="text-[13px] font-medium text-neutral-700">{item.stage}</span>
            <div className="flex items-center gap-[12px]">
              <span className="text-[14px] font-bold text-neutral-900">{item.count}</span>
              {idx > 0 && (
                <span className="flex items-center text-[12px] font-medium text-neutral-500">
                  <ArrowDownRight size={14} className="mr-1 text-neutral-400" />
                  {item.conversion}%
                </span>
              )}
            </div>
          </div>
          <div className="w-full bg-neutral-100 h-[24px] rounded-r-md">
            <div 
              className={`h-full ${item.color} rounded-r-md transition-all duration-1000 ease-out`} 
              style={{ width: `${item.conversion}%` }} 
            />
          </div>
        </div>
      ))}
    </div>
  )
}
