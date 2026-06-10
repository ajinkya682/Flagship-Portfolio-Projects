"use client"

import * as React from "react"
import { CloudUpload, FileText, Sparkles, TrendingUp, Bell, ChevronRight } from "lucide-react"

export function PipelineStepDiagram() {
  const steps = [
    { icon: CloudUpload, title: "Resume Uploaded", desc: "PDF received instantly", isAI: false },
    { icon: FileText, title: "Text Extracted", desc: "Structure parsed", isAI: false },
    { icon: Sparkles, title: "AI Scored", desc: "Rated against requirements", isAI: true },
    { icon: TrendingUp, title: "Pipeline Updated", desc: "Stage assigned auto", isAI: false },
    { icon: Bell, title: "Team Notified", desc: "Recruiter pinged", isAI: false },
  ]

  return (
    <div className="flex flex-col md:flex-row items-center justify-center relative w-full max-w-[900px] mx-auto">
      {/* Mobile: Vertical Line / Desktop: Horizontal Dashed Line */}
      <div className="absolute left-[36px] top-0 bottom-0 w-[1px] md:hidden border-l border-dashed border-white/20" />
      <div className="hidden md:block absolute top-[44px] left-[80px] right-[80px] h-[1px] border-t border-dashed border-white/20" />

      <div className="flex flex-col md:flex-row w-full justify-between gap-8 md:gap-0 z-10">
        {steps.map((step, i) => (
          <div 
            key={i} 
            className="flex flex-row md:flex-col items-center md:w-[160px] animate-fade-slide-up opacity-0"
            style={{ animationDelay: `${i * 80 + 200}ms` }}
          >
            {/* Circle */}
            <div className="relative flex shrink-0 h-[56px] w-[56px] items-center justify-center rounded-full bg-white/[0.08] border border-white/10 backdrop-blur-sm">
              <step.icon size={24} className={step.isAI ? "text-accent-400" : "text-white/70"} />
              
              {/* Connector Chevron (Desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-[80px] top-1/2 -translate-y-1/2 animate-pulse-subtle">
                  <ChevronRight size={16} className="text-accent-500" />
                </div>
              )}
            </div>

            {/* Text */}
            <div className="ml-4 md:ml-0 md:mt-4 flex flex-col md:items-center text-left md:text-center">
              <span className="font-body text-[10px] font-bold uppercase tracking-widest text-white/40">
                Step {i + 1}
              </span>
              <span className="mt-1 font-body text-[14px] font-semibold text-white">
                {step.title}
              </span>
              <span className="mt-0.5 font-body text-[12px] text-white/55">
                {step.desc}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
