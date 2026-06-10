"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { ScoreRing } from "@/components/score/ScoreRing"
import { PillButton } from "@/components/ui/button"

function SubscoreBar({ label, percent, delayMs }: { label: string, percent: number, delayMs: number }) {
  const [width, setWidth] = React.useState(0)
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percent)
    }, delayMs)
    return () => clearTimeout(timer)
  }, [percent, delayMs])

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between font-body text-[12px]">
        <span className="text-neutral-700">{label}</span>
        <span className="font-semibold">{percent}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div 
          className="h-full bg-accent-500 transition-all duration-800 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export function AIScoreDemo() {
  return (
    <div className="w-full max-w-[480px] rounded-xl bg-white p-6 shadow-lg border border-neutral-100 animate-fade-slide-up [animation-delay:200ms] opacity-0">
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex flex-col">
          <span className="font-body text-[15px] font-semibold text-neutral-900">Alex Chen</span>
          <span className="font-body text-[13px] text-neutral-500">Senior Software Engineer</span>
        </div>

        {/* Score Ring & Match Label */}
        <div className="my-4 flex items-center gap-4">
          <ScoreRing score={91} size="lg" />
          <div className="flex flex-col justify-center">
            <span className="font-body text-[13px] font-bold text-accent-700">Strong match for this role</span>
          </div>
        </div>

        {/* Subscores */}
        <div className="mt-4 flex flex-col">
          <SubscoreBar label="Skills Match" percent={95} delayMs={500} />
          <SubscoreBar label="Experience" percent={88} delayMs={700} />
          <SubscoreBar label="Education" percent={72} delayMs={900} />
          <SubscoreBar label="Keywords" percent={90} delayMs={1100} />
        </div>

        {/* Why this score section */}
        <div className="mt-6 flex flex-col">
          <span className="font-body text-[12px] font-semibold uppercase tracking-wider text-neutral-700">Why this score</span>
          <ul className="mt-3 flex flex-col gap-2">
            <li className="flex items-start gap-2">
              <ThumbsUp size={14} className="mt-0.5 shrink-0 text-accent-500" />
              <span className="font-body text-[12px] text-neutral-700">5+ years React matches senior req.</span>
            </li>
            <li className="flex items-start gap-2">
              <ThumbsUp size={14} className="mt-0.5 shrink-0 text-accent-500" />
              <span className="font-body text-[12px] text-neutral-700">Open source contributions show initiative</span>
            </li>
            <li className="flex items-start gap-2">
              <ThumbsUp size={14} className="mt-0.5 shrink-0 text-accent-500" />
              <span className="font-body text-[12px] text-neutral-700">AWS certified relevant to infra work</span>
            </li>
            <li className="flex items-start gap-2">
              <ThumbsDown size={14} className="mt-0.5 shrink-0 text-red-500" />
              <span className="font-body text-[12px] text-neutral-700">No TypeScript listed explicitly</span>
            </li>
            <li className="flex items-start gap-2">
              <ThumbsDown size={14} className="mt-0.5 shrink-0 text-red-500" />
              <span className="font-body text-[12px] text-neutral-700">Leadership experience not demonstrated</span>
            </li>
          </ul>
        </div>

        {/* Pills row */}
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <PillButton label="React" variant="accent" />
            <PillButton label="Node.js" variant="accent" />
            <PillButton label="AWS" variant="accent" />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center h-7 rounded-full bg-amber-100 px-3 font-body text-[12px] font-medium text-amber-700">
              TypeScript
            </div>
            <div className="inline-flex items-center h-7 rounded-full bg-amber-100 px-3 font-body text-[12px] font-medium text-amber-700">
              Leadership
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
