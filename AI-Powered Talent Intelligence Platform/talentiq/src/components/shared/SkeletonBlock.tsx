import { cn } from '@/lib/utils'

interface SkeletonBlockProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
}

export function SkeletonBlock({
  width = '100%',
  height = '100%',
  borderRadius = '6px',
  className,
}: SkeletonBlockProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  )
}
