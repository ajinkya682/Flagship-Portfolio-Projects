import * as React from "react"
import { Sparkles, Plus } from "lucide-react"

export function BentoFeatureCard() {
  return (
    <div className="group relative flex h-full min-h-[360px] flex-col overflow-hidden rounded-[var(--radius-2xl)] bg-primary-500 p-10 text-white transition-transform hover:-translate-y-1">
      {/* Decorative large circle */}
      <div className="absolute -bottom-[60px] -right-[60px] h-[200px] w-[200px] rounded-full bg-white/[0.05] transition-transform duration-500 group-hover:scale-110" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-start h-full">
        {/* Small badge */}
        <div className="inline-flex items-center rounded-full bg-white px-3 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-primary-500">
          AI-Powered
        </div>
        
        <Sparkles size={28} className="mt-5 text-white" strokeWidth={1.5} />
        
        <div className="mt-auto pt-8">
          <h3 className="font-display text-[20px] font-bold leading-tight text-white max-w-[220px]">
            AI-powered platform for groundbreaking hiring.
          </h3>
          <p className="mt-2 font-body text-[14px] text-white/70">
            Learn how our AI matches the right candidates instantly.
          </p>
          
          {/* Learn More Button */}
          <button className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-6 font-display text-[14px] font-bold text-primary-500 transition-colors hover:bg-neutral-100">
            Learn More
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
