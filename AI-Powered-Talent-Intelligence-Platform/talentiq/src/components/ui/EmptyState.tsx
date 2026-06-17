import React from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-[40px] text-center bg-white rounded-[16px] border border-neutral-200/60 shadow-sm", className)}>
      <div className="w-[48px] h-[48px] rounded-full bg-neutral-50 flex items-center justify-center mb-[16px] border border-neutral-100">
        <Icon className="w-[24px] h-[24px] text-neutral-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-[15px] font-semibold text-neutral-900 mb-[4px] tracking-tight">{title}</h3>
      <p className="text-[13px] text-neutral-500 mb-[20px] max-w-[300px] leading-relaxed">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  )
}
