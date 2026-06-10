import * as React from "react"
import { Quote } from "lucide-react"

export function BentoSocialCard() {
  return (
    <div className="relative flex h-full min-h-[240px] flex-col overflow-hidden rounded-[var(--radius-2xl)] bg-neutral-900 p-8 transition-transform hover:-translate-y-1">
      {/* Radial Accent */}
      <div 
        className="absolute -right-[75px] -top-[75px] h-[150px] w-[150px] rounded-full opacity-[0.15]"
        style={{ background: "var(--color-accent-500, #10B981)" }}
      />
      
      <Quote size={24} className="mb-4 text-neutral-600" />
      
      <div className="relative z-10 mt-auto">
        <p className="font-body text-[16px] italic text-white max-w-[200px] leading-relaxed">
          "Our time-to-hire dropped by 60% in the first month."
        </p>
        
        <div className="mt-4 flex flex-col">
          <span className="font-body text-[14px] font-semibold text-white">Sarah Jenkins</span>
          <span className="font-body text-[12px] text-white/70">VP of Talent, TechFlow</span>
        </div>
        
        <a href="#" className="mt-6 inline-block font-body text-[14px] text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
          See reviews from our users
        </a>
      </div>
    </div>
  )
}
