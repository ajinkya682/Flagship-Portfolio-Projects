import { cn } from '@/lib/utils'

interface SourceBadgeProps {
  source: string
  className?: string
}

export function SourceBadge({ source, className }: SourceBadgeProps) {
  const getSourceStyles = (src: string) => {
    switch (src.toLowerCase()) {
      case 'linkedin':
        return 'bg-blue-50 text-blue-700'
      case 'indeed':
        return 'bg-purple-50 text-purple-700'
      case 'referral':
        return 'bg-accent-50 text-accent-700'
      case 'company website':
        return 'bg-primary-50 text-primary-700'
      default:
        return 'bg-neutral-100 text-neutral-700'
    }
  }

  return (
    <span className={cn('rounded-full font-body text-[10px] font-medium px-[8px] py-[2px] whitespace-nowrap', getSourceStyles(source), className)}>
      {source}
    </span>
  )
}
