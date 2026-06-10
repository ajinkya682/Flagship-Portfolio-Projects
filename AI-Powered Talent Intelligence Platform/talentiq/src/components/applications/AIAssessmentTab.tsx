"use client"

import * as React from "react"
import { ThumbsUp, ThumbsDown, Sparkles } from "lucide-react"
import { ScoreRing } from "@/components/ui/score-ring"
import { Button } from "@/components/ui/button"
import { AIProcessingIndicator } from "@/components/ui/ai-processing"
import { cn } from "@/lib/utils"

export function AIAssessmentTab() {
  const [isRescoring, setIsRescoring] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [isOverrideOpen, setIsOverrideOpen] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleRescore = () => {
    setIsRescoring(true)
    setTimeout(() => {
      setIsRescoring(false)
    }, 4000)
  }

  const subscores = [
    { label: "Technical Skills", score: 92, color: "bg-[#10B981]" },
    { label: "Experience Match", score: 85, color: "bg-[#10B981]" },
    { label: "Culture Fit", score: 88, color: "bg-[#10B981]" },
    { label: "Communication", score: 95, color: "bg-[#10B981]" },
  ]

  const explanations = [
    { text: "Extensive experience with modern React stack", positive: true },
    { text: "Strong system design background from previous role", positive: true },
    { text: "Excellent track record of mentoring junior engineers", positive: true },
    { text: "Demonstrated success scaling high-traffic applications", positive: true },
    { text: "Clear and concise communication in technical writing", positive: true },
    { text: "Less experience with GraphQL than requested", positive: false },
    { text: "No direct management experience (IC only)", positive: false },
    { text: "Portfolio projects are mostly internal tools", positive: false },
  ]

  return (
    <div className="grid grid-cols-2 gap-[48px] animate-fade-slide-up">
      
      {/* Left Column */}
      <div className="flex flex-col">
        <div className="flex items-start gap-[24px] mb-[32px]">
          <ScoreRing score={88} size="lg" showLabel={false} />
          <div className="flex flex-col justify-center h-[80px]">
            <h4 className="font-display text-[22px] font-bold text-neutral-900">
              Strong match for Senior Engineer
            </h4>
            <p className="mt-[4px] font-body text-[14px] text-neutral-500">
              Based on resume analysis against job requirements.
            </p>
          </div>
        </div>

        {/* Subscores */}
        <div className="flex flex-col gap-[16px] mb-[32px]">
          {subscores.map((sub, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="flex items-center justify-between mb-[6px]">
                <span className="font-body text-[14px] font-medium text-neutral-700">{sub.label}</span>
                <span className="font-body text-[14px] font-bold text-neutral-900">{sub.score}%</span>
              </div>
              <div className="h-[8px] w-full rounded-full bg-neutral-100 overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-800 ease-out", sub.color)}
                  style={{ width: mounted ? `${sub.score}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-neutral-200 mb-[32px]" />

        {/* Why this score */}
        <h5 className="font-display text-[16px] font-semibold text-neutral-900 mb-[16px]">
          Why this score
        </h5>
        <div className="flex flex-col gap-[16px]">
          {explanations.map((item, idx) => (
            <div key={idx} className="flex items-start gap-[12px]">
              {item.positive ? (
                <div className="mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-accent-100">
                  <ThumbsUp size={12} className="text-accent-600" />
                </div>
              ) : (
                <div className="mt-[2px] flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#FEF2F2]">
                  <ThumbsDown size={12} className="text-[#EF4444]" />
                </div>
              )}
              <span className="font-body text-[14px] text-neutral-700 leading-snug">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col">
        
        {/* Pills */}
        <div className="flex flex-col gap-[8px] mb-[24px]">
          <span className="font-body text-[12px] font-medium uppercase tracking-wider text-neutral-400">Key Strengths</span>
          <div className="flex flex-wrap gap-[8px]">
            {["React", "Node.js", "System Design", "Mentorship"].map(tag => (
              <span key={tag} className="rounded-full bg-accent-100 px-[12px] py-[4px] font-body text-[13px] font-medium text-accent-700 border border-accent-200">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[8px] mb-[40px]">
          <span className="font-body text-[12px] font-medium uppercase tracking-wider text-neutral-400">Potential Gaps</span>
          <div className="flex flex-wrap gap-[8px]">
            {["GraphQL", "Team Leadership"].map(tag => (
              <span key={tag} className="rounded-full bg-[#FEF3C7] px-[12px] py-[4px] font-body text-[13px] font-medium text-[#B45309] border border-[#FDE68A]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Score Comparison */}
        <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[24px] shadow-sm mb-[24px]">
          <h5 className="font-display text-[15px] font-semibold text-neutral-900 mb-[4px]">
            Candidate Comparison
          </h5>
          <span className="font-body text-[13px] text-neutral-500 mb-[24px]">
            vs 23 other candidates in this role
          </span>
          
          <div className="relative h-[24px] w-full bg-neutral-100 rounded-sm">
            {/* Distribution bars placeholder */}
            <div className="absolute left-[10%] h-full w-[20%] bg-neutral-200" />
            <div className="absolute left-[30%] h-full w-[35%] bg-neutral-300" />
            <div className="absolute left-[65%] h-full w-[15%] bg-neutral-200" />
            
            {/* This Candidate marker */}
            <div 
              className="absolute h-[32px] w-[4px] bg-primary-500 -top-[4px] transition-all duration-1000 ease-out z-10"
              style={{ left: mounted ? "88%" : "0%" }}
            >
              <div className="absolute -top-[24px] left-1/2 -translate-x-1/2 rounded bg-primary-500 px-2 py-0.5 text-[10px] font-bold text-white">
                88
              </div>
            </div>
          </div>
          <div className="mt-[8px] flex justify-between font-body text-[11px] text-neutral-400">
            <span>Lowest (45)</span>
            <span>Average (72)</span>
            <span>Highest (95)</span>
          </div>
        </div>

        {/* Rescore */}
        <div className="flex flex-col items-center gap-[12px] p-[24px] rounded-[var(--radius-lg)] bg-accent-50 border border-accent-100">
          {isRescoring ? (
            <AIProcessingIndicator message="Scoring against job requirements..." />
          ) : (
            <>
              <Button 
                className="w-full bg-accent-500 text-white hover:bg-accent-600 shadow-sm"
                iconLeft={<Sparkles size={16} />}
                onClick={handleRescore}
              >
                Rescore with AI
              </Button>
              <span className="font-body text-[12px] text-accent-700 text-center">
                This will re-analyze against the latest job requirements.
              </span>
            </>
          )}
        </div>

        {/* Manual Override */}
        <div className="mt-[16px] flex flex-col rounded-[var(--radius-lg)] bg-neutral-50 p-[16px] border border-neutral-200">
          {!isOverrideOpen ? (
            <Button variant="ghost" className="w-full text-neutral-600" onClick={() => setIsOverrideOpen(true)}>
              Add manual score adjustment
            </Button>
          ) : (
            <div className="flex flex-col gap-[12px] animate-fade-in">
              <div className="flex gap-[12px]">
                <div className="flex flex-col gap-[6px] w-[80px]">
                  <span className="font-body text-[12px] font-medium text-neutral-700">Score</span>
                  <input type="number" min={0} max={100} defaultValue={88} className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 font-body text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500" />
                </div>
                <div className="flex flex-col gap-[6px] flex-1">
                  <span className="font-body text-[12px] font-medium text-neutral-700">Reason for override</span>
                  <input type="text" placeholder="e.g. Excellent technical interview" className="flex h-9 w-full rounded-md border border-neutral-200 bg-white px-3 py-1 font-body text-[13px] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500" />
                </div>
              </div>
              <div className="flex gap-[8px] justify-end mt-[4px]">
                <Button variant="ghost" className="h-[28px] px-3 text-[12px]" onClick={() => setIsOverrideOpen(false)}>Cancel</Button>
                <Button variant="primary" className="h-[28px] px-3 text-[12px]">Save Override</Button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
