'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface SourceQualityChartProps {
  data: { source: string; quality: number }[]
}

const getBarColor = (quality: number) => {
  if (quality >= 30) return '#6366F1' // accent-500
  if (quality >= 15) return '#F59E0B' // amber-500
  return '#EF4444' // red-500
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white shadow-md border border-neutral-100 rounded-md p-[12px] font-body">
        <p className="text-[13px] font-bold text-neutral-900 mb-[4px]">{data.source}</p>
        <p className="text-[13px] text-neutral-600">Conv. Rate: <span className="font-semibold" style={{ color: getBarColor(data.quality) }}>{data.quality}%</span></p>
      </div>
    )
  }
  return null
}

export default function SourceQualityChart({ data }: SourceQualityChartProps) {
  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="source" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'Inter, sans-serif' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280', fontFamily: 'Inter, sans-serif' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip cursor={{ fill: '#F9FAFB' }} content={<CustomTooltip />} />
          <Bar dataKey="quality" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.quality)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
