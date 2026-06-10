import * as React from "react"
import { Sparkles, Play } from "lucide-react"
import { cn } from "@/lib/utils"

export function BentoFeatureCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-[var(--radius-2xl)] bg-primary-500 p-10 text-white shadow-xl h-full",
        className
      )}
    >
      <div>
        <Sparkles size={48} className="mb-6 text-white" strokeWidth={1.5} />
        <h3 className="mb-4 font-display text-[20px] font-bold leading-snug">
          AI-powered platform for faster, fairer hiring.
        </h3>
        <p className="font-body text-[14px] text-white/70">
          Automate candidate screening, reduce bias, and focus on human connections.
        </p>
      </div>
      <button className="mt-8 flex h-11 w-40 items-center justify-center rounded-full bg-white font-body text-[14px] font-semibold text-primary-500 transition-transform hover:scale-105 active:scale-95">
        Learn More
      </button>
    </div>
  )
}

export function BentoStatCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center rounded-[var(--radius-2xl)] border border-neutral-200 bg-neutral-50 p-8 shadow-sm h-full",
        className
      )}
    >
      <div className="font-display text-[56px] font-extrabold leading-none text-neutral-900 tracking-tight">
        62%
      </div>
      <div className="mt-2 font-body text-[16px] font-semibold text-neutral-600">
        Faster time-to-hire
      </div>
      <p className="mt-3 font-body text-[13px] text-neutral-500 leading-relaxed">
        Research at your fingertips. TalentIQ analyzes hundreds of resumes instantly.
      </p>
    </div>
  )
}

export function BentoSocialCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-2xl)] bg-neutral-900 p-8 shadow-xl h-full",
        className
      )}
    >
      {/* Accent overlay gradient top-right */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-12 blur-3xl"
        style={{
          background: "radial-gradient(circle, var(--color-accent-500) 0%, transparent 70%)",
        }}
      />
      
      {/* Play button */}
      <button className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition-transform hover:scale-110 active:scale-95 pl-1">
        <Play size={20} fill="currentColor" />
      </button>

      <div className="mt-16 sm:mt-8">
        <div className="font-display text-[32px] font-black text-primary-200 leading-none">
          "
        </div>
        <p className="mt-2 max-w-[220px] font-body text-[16px] italic text-white leading-relaxed">
          It's like having a superhuman recruiting assistant working 24/7.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/150?u=sarah"
            alt="Sarah"
            className="h-10 w-10 rounded-full border border-white/20 object-cover"
          />
          <div>
            <div className="font-body text-[14px] font-semibold text-white">
              Sarah Jenkins
            </div>
            <div className="font-body text-[12px] text-white/70">
              VP of People, TechFlow
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 font-body text-[14px] font-medium text-white/80 hover:text-white hover:underline cursor-pointer">
        See reviews from our users →
      </div>
    </div>
  )
}
