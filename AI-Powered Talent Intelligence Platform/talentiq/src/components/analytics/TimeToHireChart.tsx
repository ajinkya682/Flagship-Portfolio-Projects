'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TimeToHireChartProps {
  data: { week: string; current: number; previous: number }[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white shadow-md border border-neutral-100 rounded-md p-[12px] font-body min-w-[150px]">
        <p className="text-[13px] font-bold text-neutral-900 mb-[8px] border-b border-neutral-100 pb-[8px]">{label}</p>
        <div className="flex flex-col gap-[6px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-primary-500" />
              <span className="text-[12px] text-neutral-600">Current</span>
            </div>
            <span className="text-[13px] font-semibold text-neutral-900">{payload[0].value}d</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full bg-neutral-300" />
              <span className="text-[12px] text-neutral-600">Previous</span>
            </div>
            <span className="text-[13px] font-semibold text-neutral-900">{payload[1].value}d</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function TimeToHireChart({ data }: TimeToHireChartProps) {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="week" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'Inter, sans-serif' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'Inter, sans-serif' }}
            tickFormatter={(value) => `${value}d`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ r: 4, fill: '#3B82F6', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="previous" 
            stroke="#D1D5DB" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 4, fill: '#D1D5DB', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#D1D5DB', stroke: '#fff', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
