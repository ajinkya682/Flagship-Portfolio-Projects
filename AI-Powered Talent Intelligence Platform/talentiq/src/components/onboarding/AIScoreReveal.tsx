'use client'

import { ScoreRing } from '@/components/score/ScoreRing'
import SubscoreBar from '@/components/score/SubscoreBar'
import { CheckCircle, XCircle } from 'lucide-react'

export default function AIScoreReveal() {
  return (
    <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-[24px]">
      <div className="flex gap-[24px] items-center">
        {/* Score Ring */}
        <div className="animate-in zoom-in-50 fade-in duration-500 delay-100 fill-mode-both">
          <ScoreRing score={87} size="xl" />
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col gap-[12px]">
          <div className="animate-in slide-in-from-right-4 fade-in duration-500 delay-300 fill-mode-both">
            <SubscoreBar label="Technical Skills" value={92} />
          </div>
          <div className="animate-in slide-in-from-right-4 fade-in duration-500 delay-400 fill-mode-both">
            <SubscoreBar label="Experience Match" value={85} />
          </div>
          <div className="animate-in slide-in-from-right-4 fade-in duration-500 delay-500 fill-mode-both">
            <SubscoreBar label="Education" value={78} />
          </div>
        </div>
      </div>

      <div className="mt-[24px] pt-[24px] border-t border-neutral-200 grid grid-cols-2 gap-[16px]">
        {/* Strengths */}
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-700 fill-mode-both">
          <h4 className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-[12px]">Key Strengths</h4>
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-start gap-[8px]">
              <CheckCircle size={16} className="text-accent-500 shrink-0 mt-[2px]" />
              <span className="text-[13px] text-neutral-700">Strong React & TS background</span>
            </div>
            <div className="flex items-start gap-[8px]">
              <CheckCircle size={16} className="text-accent-500 shrink-0 mt-[2px]" />
              <span className="text-[13px] text-neutral-700">5+ years senior experience</span>
            </div>
          </div>
        </div>

        {/* Gaps */}
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 delay-800 fill-mode-both">
          <h4 className="text-[12px] font-bold text-neutral-500 uppercase tracking-wider mb-[12px]">Potential Gaps</h4>
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-start gap-[8px]">
              <XCircle size={16} className="text-amber-500 shrink-0 mt-[2px]" />
              <span className="text-[13px] text-neutral-700">No startup experience</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
