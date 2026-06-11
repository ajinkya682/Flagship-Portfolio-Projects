'use client'

import { ResponsiveContainer, AreaChart, Area } from 'recharts'

interface SparklineChartProps {
  data: number[]
  color: string
}

export default function SparklineChart({ data, color }: SparklineChartProps) {
  if (!data || data.length === 0) return null

  const chartData = data.map((val, i) => ({ value: val, index: i }))

  return (
    <div className="w-full h-[56px] rounded-b-[var(--radius-xl)] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            fill={color} 
            fillOpacity={0.08} 
            activeDot={false}
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
