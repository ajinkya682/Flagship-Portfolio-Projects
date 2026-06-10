import * as React from "react"
import { CheckCircle, ArrowRight } from "lucide-react"
import { AIScoreDemo } from "./AIScoreDemo"
import { ScrollEntry } from "@/components/shared/ScrollEntry"
import { Button } from "@/components/ui/button"

export function AIExplainerSection() {
  return (
    <ScrollEntry animation="fade-up">
      <section className="relative overflow-hidden bg-[#ECFDF5] py-[96px]">
        {/* Subtle radial accent overlay */}
        <div 
          className="absolute -top-[200px] -right-[200px] h-[600px] w-[600px] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(50% 50% at 50% 50%, var(--color-accent-500) 0%, transparent 100%)" }}
        />

        <div className="relative mx-auto max-w-[1200px] px-5 md:px-10 lg:px-[80px]">
          <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
            
            {/* LEFT COLUMN */}
            <div className="flex w-full flex-col lg:w-1/2">
              <span className="font-body text-[12px] font-bold uppercase tracking-wider text-accent-600">
                EXPLAINABLE AI
              </span>
              <h2 className="mt-4 font-display text-[32px] md:text-[40px] font-bold leading-tight text-neutral-900 tracking-tight">
                A score that shows its work.
              </h2>
              <p className="mt-4 max-w-[460px] font-body text-[17px] text-neutral-700 leading-[28px]">
                Every candidate gets plain-English reasons behind their score.
                Hiring managers trust the data because they understand it.
              </p>

              <div className="mt-7 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-accent-500" strokeWidth={2.5} />
                  <span className="font-body text-[15px] font-medium text-neutral-800">
                    Scores against your actual job requirements, not generic keywords
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-accent-500" strokeWidth={2.5} />
                  <span className="font-body text-[15px] font-medium text-neutral-800">
                    Flags skill gaps and surface-level strengths separately
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle size={16} className="mt-0.5 shrink-0 text-accent-500" strokeWidth={2.5} />
                  <span className="font-body text-[15px] font-medium text-neutral-800">
                    Bias-aware scoring identifies inconsistencies automatically
                  </span>
                </div>
              </div>

              <div className="mt-8 flex">
                <Button variant="primary" size="large" iconRight={<ArrowRight size={16} />}>
                  See how scoring works
                </Button>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex w-full items-center justify-center lg:w-1/2">
              <AIScoreDemo />
            </div>

          </div>
        </div>
      </section>
    </ScrollEntry>
  )
}
