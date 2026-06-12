import React from 'react'
import AnimatedPipelineFlow from './AnimatedPipelineFlow'

export default function PipelineExplainerSection() {
  const headingText = "From resume to ranked candidate in 90 seconds."

  return (
    <section className="relative bg-[#FAFAFC] py-24 md:py-32 overflow-hidden flex flex-col justify-center">
      
      {/* Light 3D/Gradient Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/40 blur-3xl opacity-60" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-emerald-50/60 to-teal-50/60 blur-3xl opacity-60" />
      </div>

      {/* Content Layer */}
      <div className="max-w-[1200px] mx-auto w-full px-5 md:px-10 lg:px-8 xl:px-12 relative z-10">
        
        {/* Header - Center Aligned */}
        <div className="max-w-[800px] mx-auto text-center mb-16 md:mb-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] font-bold text-emerald-700 tracking-wider uppercase">
              HOW THE AI WORKS
            </span>
          </div>
          <h2 className="font-display text-[36px] md:text-[48px] font-bold text-slate-900 leading-[1.15] tracking-tight">
            From resume to ranked candidate in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">90 seconds.</span>
          </h2>
          <p className="font-body text-[18px] md:text-[20px] text-slate-600 mt-6 max-w-[640px] mx-auto leading-relaxed">
            TalentIQ automates the busywork. Our AI pipeline ingests resumes, parses unstructured data, and delivers an objective score instantly.
          </p>
        </div>

        {/* Diagram Area */}
        <div className="relative mb-20 md:mb-24">
          <AnimatedPipelineFlow />
        </div>

        {/* Stat Callouts */}
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-8">
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl px-8 py-7 flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex-1 max-w-[400px]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-blue-500" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[44px] font-bold text-slate-900 leading-none tracking-tight">2-8</span>
                <span className="font-display text-[24px] font-bold text-slate-400 leading-none">s</span>
              </div>
              <span className="font-body text-[15px] font-medium text-slate-500 mt-2">
                per resume processing
              </span>
            </div>
          </div>
          
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl px-8 py-7 flex items-center gap-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex-1 max-w-[400px]">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-emerald-400" />
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-[44px] font-bold text-slate-900 leading-none tracking-tight">99.2</span>
                <span className="font-display text-[24px] font-bold text-slate-400 leading-none">%</span>
              </div>
              <span className="font-body text-[15px] font-medium text-slate-500 mt-2">
                parse accuracy across formats
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
