import { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  period?: string
  children: ReactNode
}

export default function ChartCard({ title, period, children }: ChartCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[24px] flex flex-col w-full h-full">
      <div className="flex justify-between items-center mb-[24px]">
        <h4 className="font-display text-[16px] font-semibold text-neutral-900">{title}</h4>
        {period && (
          <span className="font-body text-[13px] text-neutral-500">{period}</span>
        )}
      </div>
      <div className="flex-1 w-full relative">
        {children}
      </div>
    </div>
  )
}
