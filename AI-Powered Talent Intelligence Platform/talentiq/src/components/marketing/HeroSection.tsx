import * as React from "react"
import { Sparkles, CreditCard, Shield, Zap } from "lucide-react"
import { HeroMeshBackground } from "./HeroMeshBackground"
import { HeroInlineCTA } from "./HeroInlineCTA"
import { HeroAvatarCluster } from "./HeroAvatarCluster"
import { HeroProductMockup } from "./HeroProductMockup"
import { GradientText } from "@/components/shared/GradientText"

export function HeroSection() {
  return (
    <section className="relative min-h-[680px] w-full bg-[#F9FAFB] overflow-hidden pt-[48px] md:pt-[64px] lg:pt-[96px] pb-[80px]">
      <HeroMeshBackground />
      
      <div className="relative mx-auto max-w-[1200px] px-5 md:px-10 lg:px-[80px]">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-8">
          
          {/* LEFT COLUMN (55%) */}
          <div className="flex w-full flex-col lg:w-[55%]">
            
            {/* AI Badge Pill */}
            <div className="animate-fade-slide-up [animation-delay:0ms] opacity-0 flex h-7 w-fit items-center gap-1.5 rounded-full border border-accent-200 bg-accent-100 px-3 shadow-accent-lg shadow-accent-500/30">
              <Sparkles size={12} className="text-accent-600" />
              <span className="font-body text-[12px] font-semibold text-accent-700">
                AI-Powered Talent Intelligence
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="mt-4 flex flex-col font-display text-[40px] leading-[48px] md:text-[48px] md:leading-[56px] lg:text-[56px] lg:leading-[64px] font-[800] tracking-[-2px] text-neutral-950">
              <span className="animate-fade-slide-up [animation-delay:80ms] opacity-0 block">
                Hire the Best.
              </span>
              <span className="animate-fade-slide-up [animation-delay:140ms] opacity-0 flex flex-wrap items-center gap-3">
                <span>Before Your <GradientText variant="primary">Competition</GradientText></span>
                <span className="hidden lg:inline-flex items-center">
                  <HeroInlineCTA />
                </span>
              </span>
            </h1>

            {/* Mobile CTA (Drops below headline) */}
            <div className="mt-6 flex lg:hidden animate-fade-slide-up [animation-delay:180ms] opacity-0">
              <HeroInlineCTA className="w-full sm:w-auto" />
            </div>

            {/* Subheading */}
            <p className="animate-fade-slide-up [animation-delay:220ms] opacity-0 mt-5 max-w-[520px] font-body text-[18px] md:text-[20px] font-normal text-neutral-600 leading-relaxed">
              Stop losing great candidates to outdated filters. TalentIQ scores every applicant with explainable AI — so your team makes faster, fairer decisions.
            </p>

            {/* Avatar Cluster */}
            <div className="animate-fade-slide-up [animation-delay:280ms] opacity-0 mt-6 md:mt-8">
              <HeroAvatarCluster />
            </div>

            {/* Trust Signals */}
            <div className="animate-fade-slide-up [animation-delay:340ms] opacity-0 mt-8 flex flex-wrap gap-4 md:gap-6">
              <div className="flex items-center gap-1.5">
                <CreditCard size={14} className="text-neutral-400" />
                <span className="font-body text-[12px] text-neutral-500">No credit card</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield size={14} className="text-neutral-400" />
                <span className="font-body text-[12px] text-neutral-500">SOC 2 Type II</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={14} className="text-neutral-400" />
                <span className="font-body text-[12px] text-neutral-500">Setup in 30 min</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (45%) */}
          <div className="animate-fade-slide-up [animation-delay:100ms] opacity-0 mt-8 lg:mt-0 flex w-full lg:w-[45%] items-center justify-center">
            <HeroProductMockup className="scale-100 md:scale-95 lg:scale-100" />
          </div>

        </div>
      </div>
    </section>
  )
}
