'use client'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ScoreRing } from '@/components/score/ScoreRing'

export default function HeroFloatingBadge() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div
      className="hidden md:flex absolute -left-6 top-[40%] -translate-y-1/2 bg-white shadow-lg rounded-lg px-4 py-3 border border-neutral-200 items-center gap-3 animate-float"
      style={{ animationPlayState: prefersReducedMotion ? 'paused' : 'running' }}
    >
      <ScoreRing score={91} size="sm" />
      <div className="flex flex-col">
        <span className="font-body text-[13px] font-bold text-[#10B981] leading-tight">
          AI Score: 91/100
        </span>
        <span className="font-body text-[11px] text-neutral-500 mt-0.5">
          Strong Match
        </span>
      </div>
    </div>
  )
}
