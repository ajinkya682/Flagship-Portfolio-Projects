import { CloudUpload, FileText, Sparkles, TrendingUp, Bell, ChevronRight } from 'lucide-react'
import { ScrollEntry } from '@/components/shared/ScrollEntry'

export default function PipelineStepDiagram() {
  const steps = [
    { num: 1, icon: CloudUpload, title: 'Resume Uploaded', desc: 'PDF received instantly.' },
    { num: 2, icon: FileText, title: 'Text Extracted', desc: 'Structure parsed.' },
    { num: 3, icon: Sparkles, title: 'AI Scored', desc: 'Rated against requirements.', highlight: true },
    { num: 4, icon: TrendingUp, title: 'Pipeline Updated', desc: 'Stage assigned automatically.' },
    { num: 5, icon: Bell, title: 'Team Notified', desc: 'Recruiter pinged immediately.' },
  ]

  return (
    <div className="flex flex-col md:flex-row justify-center items-start relative md:gap-0 gap-6 w-full max-w-[900px] mx-auto">
      {steps.map((step, i) => (
        <ScrollEntry key={step.num} delay={i * 80} className="w-full md:w-[160px] flex md:flex-col items-center relative z-10">
          {/* Step Number */}
          <div className="hidden md:block overline text-[10px] uppercase text-white/40 mb-2 font-semibold tracking-wider">
            Step {step.num}
          </div>
          
          {/* Mobile Step Num (inline) */}
          <div className="md:hidden w-6 h-6 rounded-full bg-white/10 text-white/60 text-[10px] font-bold flex items-center justify-center mr-4">
            {step.num}
          </div>

          {/* Circle */}
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
            step.highlight 
              ? 'bg-accent-500/20 border border-accent-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
              : 'bg-white/5 border border-white/10'
          }`}>
            <step.icon className={`w-6 h-6 ${step.highlight ? 'text-accent-400' : 'text-white/70'}`} />
          </div>

          {/* Text Container */}
          <div className="ml-4 md:ml-0 md:mt-2 text-left md:text-center flex flex-col md:items-center">
            <h4 className="text-[14px] font-semibold text-white leading-tight">{step.title}</h4>
            <p className="text-[12px] text-white/55 mt-1 leading-snug">{step.desc}</p>
          </div>

          {/* Connector Line (Desktop) */}
          {i < steps.length - 1 && (
            <div className="hidden md:block absolute top-[44px] left-[50%] w-full h-[1px] border-t border-dashed border-white/20 animate-pulse-opacity pointer-events-none z-[-1]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A2540]">
                <ChevronRight className="w-2.5 h-2.5 text-white/25" />
              </div>
            </div>
          )}
        </ScrollEntry>
      ))}
    </div>
  )
}
