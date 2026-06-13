import { cn } from '@/lib/utils'

export interface JobStatusBadgeProps {
  status: 'draft' | 'active' | 'paused' | 'closed' | 'published'
}

export default function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const colorMap = {
    draft: 'bg-neutral-100 text-neutral-600',
    active: 'bg-accent-100 text-accent-700',
    published: 'bg-accent-100 text-accent-700',
    paused: 'bg-amber-100 text-amber-700',
    closed: 'bg-neutral-200 text-neutral-600',
  }

  return (
    <span className={cn(
      "px-[10px] py-[3px] rounded-full text-[10px] uppercase font-bold tracking-wider shrink-0",
      colorMap[status]
    )}>
      {status}
    </span>
  )
}
