import Link from 'next/link'
import { AlertTriangle, Info, CheckCircle } from 'lucide-react'

export interface InsightCardProps {
  type: 'warning' | 'info' | 'success'
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export default function InsightCard({ type, title, description, actionLabel, actionHref }: InsightCardProps) {
  const iconMap = {
    warning: <AlertTriangle size={20} className="text-[#F59E0B]" />,
    info: <Info size={20} className="text-primary-500" />,
    success: <CheckCircle size={20} className="text-accent-500" />
  }

  return (
    <div className="bg-white rounded-lg p-[16px] shadow-xs flex gap-[12px] border border-neutral-100/50">
      <div className="shrink-0 mt-[2px]">
        {iconMap[type]}
      </div>
      <div className="flex flex-col">
        <h5 className="font-body text-[14px] font-semibold text-neutral-900">{title}</h5>
        <p className="font-body text-[13px] text-neutral-600 mt-[4px] leading-snug">{description}</p>
        
        {actionLabel && actionHref && (
          <Link 
            href={actionHref}
            className="font-body text-[13px] text-primary-500 font-medium hover:text-primary-600 transition-colors mt-[8px] w-fit"
          >
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  )
}
