import React from 'react'
import { FileSearch, Users, Sparkles, CalendarCheck, Award } from 'lucide-react'

const steps = [
  { id: 1, title: 'Applied', count: 42, icon: FileSearch, color: 'text-slate-400', bg: 'bg-slate-100' },
  { id: 2, title: 'Screening', count: 18, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 3, title: 'AI Scoring', count: 18, icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50', isAI: true },
  { id: 4, title: 'Interview', count: 7, icon: CalendarCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 5, title: 'Hired', count: 2, icon: Award, color: 'text-amber-500', bg: 'bg-amber-50' },
]

// Mock candidates to show in the columns
const mockCandidates = [
  { id: 1, name: 'Tiana Korsgaard', role: 'Product Designer', company: 'Dribbble', score: 95, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Marcus Philips', role: 'Product Designer', company: 'Indeed', score: 88, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Jordyn Press', role: 'Product Designer', company: 'Company Site', score: 82, avatar: 'https://i.pravatar.cc/150?u=3' },
]

export default function AnimatedPipelineFlow() {
  return (
    <div className="relative w-full max-w-6xl mx-auto">
      
      {/* Board Container */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)]">
        
        {/* Header/Toolbar Fake */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-slate-900 text-xl tracking-tight">Senior Product Designer</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 font-body">
                <span className="flex items-center gap-1.5 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active</span>
                <span>•</span>
                <span>New York, NY</span>
                <span>•</span>
                <span>Full-time</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            <div className="h-10 px-4 rounded-xl border border-slate-200 flex items-center text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer">View Details</div>
            <div className="h-10 px-5 rounded-xl bg-blue-600 text-white flex items-center text-sm font-semibold shadow-sm hover:bg-blue-700 transition-colors cursor-pointer">+ Add Candidate</div>
          </div>
        </div>

        {/* Pipeline Columns */}
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 hide-scrollbar">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isAI = step.isAI;
            
            return (
              <div key={step.id} className="flex-shrink-0 w-[260px] md:w-[280px] flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.bg}`}>
                      <Icon className={`w-4 h-4 ${step.color}`} />
                    </div>
                    <span className="font-display font-semibold text-slate-800 text-[15px]">{step.title}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{step.count}</span>
                </div>

                {/* Column Body - Cards */}
                <div className={`flex-1 rounded-2xl p-3 min-h-[420px] flex flex-col gap-3 transition-colors ${isAI ? 'bg-gradient-to-b from-emerald-50/80 to-blue-50/30 border border-emerald-100/80 relative' : 'bg-slate-50 border border-slate-100'}`}>
                  
                  {isAI && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <div className="bg-white rounded-full p-2 shadow-[0_4px_12px_rgba(16,185,129,0.2)] border border-emerald-100 animate-bounce">
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  )}

                  {/* Cards for AI Scoring step */}
                  {step.id === 3 ? (
                    mockCandidates.map((candidate, i) => (
                      <div key={candidate.id} className={`bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group relative ${i === 0 ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-100'}`}>
                        {i === 0 && (
                          <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-emerald-500 to-emerald-400 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Top Match
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 rounded-full border border-slate-100 object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-semibold text-slate-900 text-sm truncate">{candidate.name}</h4>
                            <p className="text-[11px] text-slate-500 font-body truncate mt-0.5">{candidate.role}</p>
                            <p className="text-[11px] text-slate-400 font-body truncate">{candidate.company}</p>
                          </div>
                        </div>
                        <div className={`mt-4 pt-3 border-t flex items-center justify-between ${i === 0 ? 'border-emerald-50' : 'border-slate-50'}`}>
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <span className="text-slate-500">AI Score:</span>
                            <span className={candidate.score >= 90 ? 'text-emerald-600' : 'text-blue-600'}>{candidate.score}/100</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-white/50 text-slate-400">
                      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2">
                        <Icon className="w-5 h-5 text-slate-300" />
                      </div>
                      <span className="text-xs font-medium text-slate-400">No candidates</span>
                    </div>
                  )}
                  
                  <button className="mt-auto w-full py-2.5 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-100/50 rounded-lg transition-colors">
                    + Add Candidate
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Decorative Glows */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}
