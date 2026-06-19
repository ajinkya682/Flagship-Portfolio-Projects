'use client'

import { useState } from 'react'
import { UploadCloud, FileText, Sparkles, LineChart, Target, Zap, ArrowRight, BrainCircuit } from 'lucide-react'
import { AIProcessingIndicator } from '@/components/shared/AIProcessingIndicator'
import AIScoreReveal from './AIScoreReveal'

const FEATURES = [
  {
    icon: <BrainCircuit className="w-5 h-5 text-purple-600" />,
    bg: 'bg-purple-100',
    title: 'AI Resume Scoring',
    description: 'Instantly extract data from resumes and score them out of 100 based on your exact job requirements.'
  },
  {
    icon: <Target className="w-5 h-5 text-blue-600" />,
    bg: 'bg-blue-100',
    title: 'Deep Candidate Insights',
    description: 'Get a detailed breakdown of candidate matches, highlighting experience gaps and missing skills.'
  },
  {
    icon: <LineChart className="w-5 h-5 text-emerald-600" />,
    bg: 'bg-emerald-100',
    title: 'Automated Pipeline',
    description: 'Candidates are automatically sorted into categories like "Strong Match", eliminating manual screening.'
  },
  {
    icon: <Zap className="w-5 h-5 text-amber-600" />,
    bg: 'bg-amber-100',
    title: 'Smart Outreach',
    description: 'Generate personalized email templates and interview questions instantly for top candidates.'
  }
]

export default function Step4AIScoring({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const [uploadState, setUploadState] = useState<'idle' | 'processing' | 'done'>('idle')

  const handleUpload = () => {
    setUploadState('processing')
    setTimeout(() => {
      setUploadState('done')
    }, 2500)
  }

  if (uploadState === 'processing') {
    return (
      <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-lg shadow-neutral-200/50 border border-neutral-100 mt-6 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 pointer-events-none" />
        <AIProcessingIndicator message="Parsing unstructured data and calculating match score..." showProgress={true} />
      </div>
    )
  }

  if (uploadState === 'done') {
    return (
      <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-lg shadow-neutral-200/50 border border-neutral-100 mt-6 min-h-[500px] animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[200px] bg-gradient-to-b from-emerald-50/80 to-transparent pointer-events-none" />
        
        <h1 className="font-display text-[28px] font-bold text-neutral-900 text-center mb-[32px] relative z-10">
          Resume Scored Successfully!
        </h1>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <AIScoreReveal />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] mt-[48px] pt-8 border-t border-neutral-100 relative z-10">
          <button onClick={() => setUploadState('idle')} className="w-full sm:w-auto h-[48px] px-[24px] border border-neutral-200 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-all hover:border-neutral-300">
            Try another resume
          </button>
          <button onClick={onNext} className="w-full sm:w-auto h-[48px] px-[32px] bg-neutral-900 hover:bg-black text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-md shadow-neutral-900/20">
            Finish Setup
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-lg shadow-neutral-200/50 border border-neutral-100 mt-6 min-h-[500px] flex flex-col xl:flex-row gap-12 lg:gap-16 relative overflow-hidden">
      
      {/* Background abstract gradients */}
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-100/50 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] bg-blue-100/50 blur-[100px] rounded-full pointer-events-none" />

      {/* Left Column: Platform Explanation */}
      <div className="flex-1 flex flex-col relative z-10">
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-[12px] font-bold tracking-wide uppercase mb-4 shadow-sm">
            <Sparkles size={14} className="text-purple-600" />
            Powered by TalentIQ Engine
          </div>
          <h1 className="font-display text-[32px] md:text-[38px] font-extrabold text-neutral-900 leading-tight tracking-tight">
            How TalentIQ Works
          </h1>
          <p className="font-body text-[16px] text-neutral-500 mt-[16px] leading-relaxed max-w-[480px]">
            We completely automate your recruitment workflow. Try it out right now by uploading a resume to see our intelligence engine in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4 flex-1">
          {FEATURES.map((feature, i) => (
            <div 
              key={i} 
              className="flex gap-4 p-4 rounded-2xl hover:bg-neutral-50/80 transition-colors border border-transparent hover:border-neutral-100 animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
              style={{ animationDelay: `${(i + 1) * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center shrink-0 shadow-inner`}>
                {feature.icon}
              </div>
              <div className="flex flex-col pt-1">
                <h3 className="font-bold text-neutral-900 text-[16px] tracking-tight">{feature.title}</h3>
                <p className="text-[14px] text-neutral-500 leading-relaxed mt-1.5">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Upload Box */}
      <div className="w-full xl:w-[420px] flex flex-col relative z-10 animate-in fade-in slide-in-from-right-8 duration-700 delay-300 fill-mode-both">
        <div className="bg-white/60 backdrop-blur-xl border border-neutral-200/80 shadow-xl shadow-neutral-200/40 rounded-[24px] p-8 flex flex-col items-center text-center flex-1 justify-center relative group">
          
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <UploadCloud className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="font-display text-[22px] font-bold text-neutral-900 mb-2">
              See the AI in action
            </h2>
            <p className="font-body text-[14px] text-neutral-500 mb-8 max-w-[280px]">
              Upload a sample resume to see how we score candidates against the job you just created.
            </p>

            <div 
              onClick={handleUpload}
              className="w-full border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/30 hover:bg-blue-50/80 rounded-[16px] p-[32px] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group/dropzone"
            >
              <p className="font-body text-[16px] font-bold text-blue-900 group-hover/dropzone:text-blue-700 transition-colors">
                Drag & drop a resume PDF
              </p>
              <p className="font-body text-[13px] text-neutral-500 mt-[6px]">
                or click to browse from your computer
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 w-full">
              <div className="h-px bg-neutral-200 flex-1" />
              <span className="text-[12px] font-semibold text-neutral-400 uppercase tracking-widest">OR</span>
              <div className="h-px bg-neutral-200 flex-1" />
            </div>

            <button onClick={handleUpload} className="mt-6 w-full h-[44px] flex items-center justify-center gap-[8px] text-[14px] font-bold text-neutral-700 hover:text-neutral-900 bg-white border border-neutral-200 hover:border-neutral-300 rounded-xl transition-all hover:shadow-sm">
              <FileText size={16} className="text-neutral-500" /> 
              Use a sample resume instead
            </button>
          </div>
        </div>

        <div className="flex items-center gap-[16px] mt-6 w-full px-2">
          <button onClick={onBack} className="h-[44px] px-6 text-[14px] text-neutral-500 font-semibold rounded-xl hover:bg-neutral-100 transition-colors">
            Back
          </button>
          <div className="flex-1" />
          <button onClick={onNext} className="h-[44px] px-6 text-[14px] text-neutral-500 font-semibold rounded-xl hover:bg-neutral-100 hover:text-neutral-900 transition-colors flex items-center gap-2">
            Skip for now
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

    </div>
  )
}

