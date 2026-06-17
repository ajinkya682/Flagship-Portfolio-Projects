import { cn } from '@/lib/utils'

interface StageBadgeProps {
  stage: string
  className?: string
}

export function StageBadge({ stage, className }: StageBadgeProps) {
  const getStageStyles = (stg: string) => {
    switch (stg.toLowerCase()) {
      case 'screening':
        return 'bg-primary-50 text-primary-700'
      case 'phone screen':
        return 'bg-blue-50 text-blue-700'
      case 'interview':
        return 'bg-amber-50 text-amber-700'
      case 'assessment':
        return 'bg-purple-50 text-purple-700'
      case 'offer':
        return 'bg-accent-50 text-accent-700'
      case 'hired':
        return 'bg-accent-100 text-accent-800'
      case 'rejected':
      default:
        return 'bg-neutral-100 text-neutral-600'
    }
  }

  return (
    <span className={cn('rounded-full font-body text-[10px] font-medium px-[8px] py-[2px] whitespace-nowrap', getStageStyles(stage), className)}>
      {stage}
    </span>
  )
}
