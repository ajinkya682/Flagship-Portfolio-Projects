import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  backHref?: string
  backLabel?: string
  children?: ReactNode
}

export function PageHeader({ title, subtitle, backHref, backLabel, children }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center pb-[24px] border-b border-[#E5E7EB] mb-[32px]">
      <div>
        {backHref && (
          <Link 
            href={backHref}
            className="flex items-center gap-[6px] mb-[8px] text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="font-body text-[13px] font-medium">{backLabel || 'Back'}</span>
          </Link>
        )}
        
        <h1 className="font-display text-[36px] font-bold text-neutral-900 leading-tight">
          {title}
        </h1>
        
        {subtitle && (
          <p className="font-body text-[15px] text-neutral-600 mt-[4px]">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex gap-[8px] items-center">
          {children}
        </div>
      )}
    </div>
  )
}
