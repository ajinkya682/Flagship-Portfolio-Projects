"use client"

import * as React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { week: "W1", current: 42, previous: 45 },
  { week: "W2", current: 38, previous: 44 },
  { week: "W3", current: 39, previous: 42 },
  { week: "W4", current: 35, previous: 40 },
  { week: "W5", current: 34, previous: 41 },
  { week: "W6", current: 32, previous: 38 },
  { week: "W7", current: 28, previous: 36 },
  { week: "W8", current: 29, previous: 35 },
  { week: "W9", current: 27, previous: 34 },
  { week: "W10", current: 25, previous: 32 },
  { week: "W11", current: 24, previous: 30 },
  { week: "W12", current: 22, previous: 28 },
]

export function TimeToHireChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
          <XAxis 
            dataKey="week" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#737373', fontSize: 12, fontFamily: 'var(--font-body)' }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#737373', fontSize: 12, fontFamily: 'var(--font-body)' }} 
          />
          <Tooltip
            contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontFamily: 'var(--font-body)' }}
            itemStyle={{ fontSize: '13px', fontWeight: 500 }}
            labelStyle={{ fontSize: '12px', color: '#737373', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            name="Previous Quarter"
            dataKey="previous" 
            stroke="#D4D4D4" 
            strokeWidth={1.5} 
            strokeDasharray="4 4"
            dot={false}
            activeDot={{ r: 4, fill: '#D4D4D4' }}
          />
          <Line 
            type="monotone" 
            name="Current Quarter"
            dataKey="current" 
            stroke="#2563EB" 
            strokeWidth={2} 
            dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#2563EB', strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
