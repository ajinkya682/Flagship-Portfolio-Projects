import React from 'react'
import AnimatedPipelineFlow from './AnimatedPipelineFlow'
import ThreeParticleBackground from './ThreeParticleBackground'

export default function PipelineExplainerSection() {
  const headingText = "From resume to ranked candidate in 90 seconds."

  return (
    <section className="relative bg-[#0A2540] py-24 overflow-hidden flex flex-col justify-center">
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeParticleBackground />
      </div>

      {/* Content Layer */}
      <div className="max-w-[1200px] mx-auto w-full px-5 md:px-10 lg:px-8 xl:px-12 relative z-10">
        
        {/* Header */}
        <div className="max-w-[800px] mx-auto text-center">
          <span className="overline text-[11px] font-bold text-accent-300 tracking-widest uppercase inline-block relative">
            HOW THE AI WORKS
          </span>
          <h2 className="font-display text-[32px] md:text-[40px] font-bold text-white mt-4 leading-tight tracking-tight">
            {headingText}
          </h2>
          <p className="font-body text-[17px] text-white/70 mt-4 max-w-[520px] mx-auto leading-relaxed">
            TalentIQ automates the busywork. Our AI pipeline ingests resumes, parses unstructured data, and delivers an objective score instantly.
          </p>
        </div>

        {/* Diagram */}
        <div className="mt-16 h-[200px] md:h-[240px]">
          <AnimatedPipelineFlow />
        </div>

        {/* Stat Callouts (Glassmorphism) */}
        <div className="mt-16 flex flex-col md:flex-row justify-center gap-6">
          <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-xl px-8 py-6 flex items-center gap-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-blue-500 opacity-70" />
            <div className="flex items-baseline gap-1">
              <span className="font-display text-[32px] font-bold text-white leading-none">2-8</span>
              <span className="font-display text-[20px] font-bold text-accent-400 leading-none">s</span>
            </div>
            <span className="font-body text-[14px] text-white/70 leading-snug max-w-[100px] border-l border-white/10 pl-4">
              per resume processing
            </span>
          </div>
          
          <div className="relative overflow-hidden bg-white/5 border border-white/10 rounded-xl px-8 py-6 flex items-center gap-4 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 to-emerald-500 opacity-70" />
            <div className="flex items-baseline gap-1">
              <span className="font-display text-[32px] font-bold text-white leading-none">99.2</span>
              <span className="font-display text-[24px] font-bold text-accent-400 leading-none">%</span>
            </div>
            <span className="font-body text-[14px] text-white/70 leading-snug max-w-[100px] border-l border-white/10 pl-4">
              parse accuracy across formats
            </span>
          </div>
        </div>

      </div>
    </section>
  )
}
