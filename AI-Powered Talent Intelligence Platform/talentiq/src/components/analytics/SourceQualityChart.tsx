"use client"

import * as React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const data = [
  { source: "Referral", rate: 18, color: "#10B981" }, // Green
  { source: "Outbound", rate: 12, color: "#10B981" }, // Green
  { source: "Website", rate: 8, color: "#F59E0B" }, // Amber
  { source: "LinkedIn", rate: 5, color: "#EF4444" }, // Red
  { source: "Agency", rate: 3, color: "#EF4444" }, // Red
]

export function SourceQualityChart() {
  return (
    <div className="h-[260px] w-full mt-[16px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
          <XAxis 
            dataKey="source" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#737373', fontSize: 12, fontFamily: 'var(--font-body)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#737373', fontSize: 12, fontFamily: 'var(--font-body)' }} 
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            cursor={{ fill: '#F5F5F5' }}
            contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-body)' }}
            itemStyle={{ fontSize: '13px', fontWeight: 600, color: '#171717' }}
            labelStyle={{ fontSize: '12px', color: '#737373', marginBottom: '4px' }}
            formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
          />
          <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
