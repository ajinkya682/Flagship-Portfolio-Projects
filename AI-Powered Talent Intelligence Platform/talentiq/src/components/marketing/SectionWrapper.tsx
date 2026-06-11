'use client'

import { ReactNode } from 'react'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'

interface SectionWrapperProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function SectionWrapper({ children, delay = 0, className }: SectionWrapperProps) {
  const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.15, triggerOnce: true })
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(
        'transition-all duration-400 ease-out',
        isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
