'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface PipelineFunnelChartProps {
  data: { stage: string; value: number; conversion: number }[]
}

const COLORS = [
  '#DBEAFE', // primary-100
  '#BFDBFE', // primary-200
  '#93C5FD', // primary-300
  '#60A5FA', // primary-400
  '#3B82F6', // primary-500
  '#2563EB', // primary-600
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white shadow-md border border-neutral-100 rounded-md p-[12px] font-body">
        <p className="text-[13px] font-bold text-neutral-900 mb-[4px]">{data.stage}</p>
        <p className="text-[13px] text-neutral-600">Count: <span className="font-semibold text-neutral-900">{data.value}</span></p>
        <p className="text-[13px] text-neutral-600">Conversion: <span className="font-semibold text-neutral-900">{data.conversion}%</span></p>
      </div>
    )
  }
  return null
}

export default function PipelineFunnelChart({ data }: PipelineFunnelChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 50, left: 0, bottom: 0 }}
        >
          <XAxis type="number" hide />
          <YAxis 
            dataKey="stage" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fontSize: 13, fill: '#4B5563', fontFamily: 'Inter, sans-serif' }}
            width={120}
          />
          <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
