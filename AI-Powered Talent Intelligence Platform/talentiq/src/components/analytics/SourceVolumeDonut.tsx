"use client"

import * as React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "LinkedIn", value: 1245, percent: 45, color: "#0A66C2" },
  { name: "Website", value: 830, percent: 30, color: "#2563EB" },
  { name: "Referral", value: 415, percent: 15, color: "#10B981" },
  { name: "Outbound", value: 166, percent: 6, color: "#8B5CF6" },
  { name: "Agency", value: 110, percent: 4, color: "#F59E0B" },
]

export function SourceVolumeDonut() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="flex items-center h-[260px] w-full mt-[16px]">
      
      {/* Donut Chart */}
      <div className="relative h-[220px] w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-body)' }}
              itemStyle={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-display text-[24px] font-bold text-neutral-900">
            {total.toLocaleString()}
          </span>
          <span className="font-body text-[12px] text-neutral-500">
            Total Volume
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-[12px] ml-auto">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between w-[160px]">
            <div className="flex items-center gap-[8px]">
              <div className="h-[10px] w-[10px] rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-body text-[13px] text-neutral-700">{item.name}</span>
            </div>
            <span className="font-body text-[13px] font-bold text-neutral-900">
              {item.percent}%
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}
