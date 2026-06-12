import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function PageContainer({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('max-w-[1200px] mx-auto px-5 md:px-10 lg:px-8 xl:px-12', className)}>
      {children}
    </div>
  )
}
