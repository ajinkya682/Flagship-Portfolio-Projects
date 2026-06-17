import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  overline?: string
  heading: string
  body?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({
  overline,
  heading,
  body,
  centered = true,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(
      centered ? 'text-center max-w-[700px] mx-auto' : 'text-left',
      className
    )}>
      {overline && (
        <div className="font-body text-[11px] uppercase font-semibold tracking-[1.5px] text-accent-600 mb-[12px]">
          {overline}
        </div>
      )}
      
      <h2 className="text-h2 text-neutral-900">
        {heading}
      </h2>
      
      {body && (
        <p className="font-body text-[17px] text-neutral-600 mt-[16px] leading-relaxed">
          {body}
        </p>
      )}
    </div>
  )
}
