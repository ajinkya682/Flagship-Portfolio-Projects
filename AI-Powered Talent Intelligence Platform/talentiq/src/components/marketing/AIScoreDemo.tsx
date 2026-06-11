'use client'

import { ScoreRing } from '@/components/score/ScoreRing'
import SubscoreBar from '@/components/score/SubscoreBar'
import { ScrollEntry } from '@/components/shared/ScrollEntry'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

export default function AIScoreDemo() {
  return (
    <ScrollEntry>
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-[480px] border border-neutral-100 mx-auto lg:mx-0">
        
        {/* Header Row */}
        <div className="flex items-center gap-3 border-b border-neutral-100 pb-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center font-display font-bold text-neutral-600 text-[16px]">
            AC
          </div>
          <div>
            <div className="font-semibold text-[15px] text-neutral-900 leading-tight">Alex Chen</div>
            <div className="text-[13px] text-neutral-500 mt-0.5">Senior Software Engineer</div>
          </div>
        </div>

        {/* Score Ring */}
        <div className="flex flex-col items-center my-4">
          <ScoreRing score={91} size="lg" />
          <div className="text-[13px] font-semibold text-[#059669] text-center mt-3">
            Strong match for this role
          </div>
        </div>

        {/* Subscores */}
        <div className="mt-6 flex flex-col gap-1">
          <SubscoreBar label="Skills Match" value={95} />
          <SubscoreBar label="Experience" value={88} />
          <SubscoreBar label="Education" value={72} />
          <SubscoreBar label="Keywords" value={90} />
        </div>

        {/* Why this score */}
        <div className="mt-6 pt-5 border-t border-neutral-100">
          <h4 className="text-[12px] font-semibold text-neutral-700 uppercase tracking-wide mb-3">Why this score</h4>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex items-start gap-2">
              <ThumbsUp className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
              <span className="text-[12px] text-neutral-700 leading-snug">5+ years React matches senior requirement</span>
            </div>
            <div className="flex items-start gap-2">
              <ThumbsUp className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
              <span className="text-[12px] text-neutral-700 leading-snug">Open source contributions show initiative</span>
            </div>
            <div className="flex items-start gap-2">
              <ThumbsUp className="w-3.5 h-3.5 text-[#10B981] mt-0.5 shrink-0" />
              <span className="text-[12px] text-neutral-700 leading-snug">AWS certified relevant to infrastructure work</span>
            </div>
            
            <div className="flex items-start gap-2 mt-1">
              <ThumbsDown className="w-3.5 h-3.5 text-[#EF4444] mt-0.5 shrink-0" />
              <span className="text-[12px] text-neutral-700 leading-snug">No TypeScript listed explicitly</span>
            </div>
            <div className="flex items-start gap-2">
              <ThumbsDown className="w-3.5 h-3.5 text-[#EF4444] mt-0.5 shrink-0" />
              <span className="text-[12px] text-neutral-700 leading-snug">Leadership experience not demonstrated</span>
            </div>
          </div>
        </div>

        {/* Extracted Skills Pills */}
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <div className="flex flex-wrap gap-2">
            <span className="bg-accent-100 text-accent-700 rounded-full px-2.5 py-1 text-[10px] font-medium">React</span>
            <span className="bg-accent-100 text-accent-700 rounded-full px-2.5 py-1 text-[10px] font-medium">Node.js</span>
            <span className="bg-accent-100 text-accent-700 rounded-full px-2.5 py-1 text-[10px] font-medium">AWS</span>
            <span className="bg-amber-100 text-amber-700 rounded-full px-2.5 py-1 text-[10px] font-medium">TypeScript</span>
            <span className="bg-amber-100 text-amber-700 rounded-full px-2.5 py-1 text-[10px] font-medium">Leadership</span>
          </div>
        </div>

      </div>
    </ScrollEntry>
  )
}
