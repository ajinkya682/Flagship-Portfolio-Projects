'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface SourceVolumeDonutProps {
  data: { name: string; value: number }[]
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#6B7280']

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white shadow-md border border-neutral-100 rounded-md p-[10px] font-body flex items-center gap-[8px]">
        <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: data.fill }} />
        <span className="text-[13px] font-medium text-neutral-900">{data.name}: {data.value}%</span>
      </div>
    )
  }
  return null
}

export default function SourceVolumeDonut({ data }: SourceVolumeDonutProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="h-[200px] w-full flex items-center">
      <div className="flex-1 h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
          <span className="font-display text-[24px] font-bold text-neutral-900 leading-none">{total}</span>
          <span className="font-body text-[11px] text-neutral-500 uppercase tracking-wider mt-[4px]">Total</span>
        </div>
      </div>
      
      <div className="w-[120px] flex flex-col justify-center gap-[12px] shrink-0">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-[6px]">
              <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="font-body text-[12px] text-neutral-600 truncate max-w-[70px]">{item.name}</span>
            </div>
            <span className="font-body text-[12px] font-semibold text-neutral-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
