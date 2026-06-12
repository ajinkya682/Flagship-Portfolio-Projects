import React from 'react'
import { FileSearch, Users, CalendarCheck, Award, Sparkles } from 'lucide-react'
import ThreeSparkleMesh from './ThreeSparkleMesh'

const steps = [
  { id: 1, title: 'Applied', icon: FileSearch },
  { id: 2, title: 'Screening', icon: Users },
  { id: 3, title: 'AI Scoring', icon: Sparkles, isAI: true },
  { id: 4, title: 'Interview', icon: CalendarCheck },
  { id: 5, title: 'Hired', icon: Award },
]

export default function AnimatedPipelineFlow() {
  return (
    <div className="relative w-full max-w-5xl mx-auto py-12 md:py-16">
      
      {/* Desktop Arc SVG */}
      <div className="hidden md:block absolute top-1/2 left-0 w-full -translate-y-[60%] h-32 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1000 120" preserveAspectRatio="none">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
          <path
            d="M 50 80 Q 250 80, 500 40 T 950 80"
            fill="none"
            stroke="url(#line-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }}
          />
        </svg>
      </div>

      {/* Mobile Vertical SVG */}
      <div className="md:hidden absolute top-0 left-12 h-full w-4 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 10 1000" preserveAspectRatio="none">
          <path
            d="M 5 20 L 5 980"
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Nodes */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center h-full gap-12 md:gap-0 px-8 md:px-12">
        {steps.map((step) => {
          const Icon = step.icon
          const isAI = step.isAI
          
          return (
            <div 
              key={step.id} 
              className={`flex flex-row md:flex-col items-center gap-6 md:gap-4 pipeline-node ${isAI ? 'md:-translate-y-6' : ''}`}
            >
              <div 
                className={`node-bg relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-2 transition-all duration-500 
                  ${isAI ? 'border-emerald-500/50 bg-[#0A1628]/80 backdrop-blur-md shadow-[0_8px_32px_rgba(16,185,129,0.3)] z-20' : 'border-white/20 bg-white/10 backdrop-blur-sm z-10'}
                `}
              >
                {/* Active Glow Halo */}
                <div 
                  className={`absolute -inset-4 rounded-full border opacity-100 
                    ${isAI ? 'border-emerald-400/40 animate-[spin_4s_linear_infinite]' : 'border-white/10'}
                  `} 
                />

                {isAI ? (
                  // Step 3 Centerpiece
                  <div className="w-full h-full absolute inset-0 rounded-full overflow-hidden flex items-center justify-center">
                    <ThreeSparkleMesh active={true} scrollProgress={1} />
                  </div>
                ) : (
                  <Icon className="w-7 h-7 pipeline-icon text-white drop-shadow-md" />
                )}
              </div>
              <div className="flex flex-col md:items-center text-left md:text-center">
                <span className={`font-body text-[12px] font-bold uppercase tracking-wider ${isAI ? 'text-emerald-400' : 'text-blue-300'}`}>
                  Step {step.id}
                </span>
                <span className="font-display text-[18px] md:text-[20px] font-semibold mt-1 text-white">
                  {step.title}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
