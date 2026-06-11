import { ReactNode, ElementType } from 'react'

interface EmptyStateProps {
  icon: ElementType
  title: string
  description: string
  ctaLabel?: string
  ctaAction?: () => void
  secondaryCtaLabel?: string
  secondaryCtaAction?: () => void
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaAction,
  secondaryCtaLabel,
  secondaryCtaAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-[64px] px-[24px] text-center w-full">
      <Icon size={40} color="#D1D5DB" className="text-neutral-300" />
      
      <h3 className="font-body text-[15px] font-semibold text-neutral-700 mt-[16px]">
        {title}
      </h3>
      
      <p className="font-body text-[13px] text-neutral-500 mt-[8px] max-w-[320px]">
        {description}
      </p>
      
      {ctaLabel && ctaAction && (
        <button
          onClick={ctaAction}
          className="mt-[20px] h-[36px] px-[16px] bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium rounded-md shadow-sm transition-colors"
        >
          {ctaLabel}
        </button>
      )}

      {secondaryCtaLabel && secondaryCtaAction && (
        <button
          onClick={secondaryCtaAction}
          className="mt-[8px] h-[36px] px-[16px] bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-700 font-body text-[14px] font-medium rounded-md transition-colors"
        >
          {secondaryCtaLabel}
        </button>
      )}
    </div>
  )
}
