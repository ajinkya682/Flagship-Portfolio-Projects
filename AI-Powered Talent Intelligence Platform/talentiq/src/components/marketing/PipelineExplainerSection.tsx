import * as React from "react"
import { PipelineStepDiagram } from "./PipelineStepDiagram"
import { ScrollEntry } from "@/components/shared/ScrollEntry"

export function PipelineExplainerSection() {
  return (
    <ScrollEntry animation="fade-up">
      <section className="relative overflow-hidden bg-primary-900 py-[96px]">
        {/* Decorative Mesh Overlay (dark mode variant) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="absolute inset-0 opacity-[0.06]"
            style={{
              background: "radial-gradient(ellipse 40% 50% at 85% 15%, var(--color-accent-500, #10B981), transparent)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1200px] px-5 md:px-10 lg:px-[80px] z-10">
          {/* Header */}
          <div className="mx-auto max-w-[800px] text-center">
            <span className="font-body text-[12px] font-bold uppercase tracking-wider text-accent-300">
              HOW THE AI WORKS
            </span>
            <h2 className="mt-4 font-display text-[32px] md:text-[40px] font-bold leading-tight text-white tracking-tight">
              From resume to ranked candidate in 90 seconds.
            </h2>
            <p className="mt-4 mx-auto max-w-[520px] font-body text-[18px] text-white/70 leading-relaxed">
              The moment a candidate applies, our AI pipeline parses, scores,
              and explains — automatically.
            </p>
          </div>

          {/* Diagram */}
          <div className="mt-[56px]">
            <PipelineStepDiagram />
          </div>

          {/* Two stat callouts */}
          <div className="mt-[40px] flex flex-col md:flex-row items-center justify-center gap-6">
            <div className="flex items-center rounded-lg bg-white/[0.07] border border-white/10 px-7 py-5">
              <span className="font-display text-[26px] font-bold text-white">2–8s</span>
              <span className="ml-3 font-body text-[14px] text-white/65">per resume</span>
            </div>
            <div className="flex items-center rounded-lg bg-white/[0.07] border border-white/10 px-7 py-5">
              <span className="font-display text-[26px] font-bold text-white">99.2%</span>
              <span className="ml-3 font-body text-[14px] text-white/65">parse accuracy</span>
            </div>
          </div>
        </div>
      </section>
    </ScrollEntry>
  )
}
