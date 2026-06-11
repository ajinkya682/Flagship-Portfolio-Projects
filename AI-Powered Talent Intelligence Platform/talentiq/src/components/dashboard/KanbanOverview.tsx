'use client'

import Link from 'next/link'
import { ScoreRing } from '@/components/score/ScoreRing'

interface KanbanOverviewProps {
  stages: {
    name: string
    count: number
    color: string
    recentCandidates: {
      id: string
      name: string
      avatar?: string
      score?: number
    }[]
  }[]
}

export default function KanbanOverview({ stages }: KanbanOverviewProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-[20px] flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h4 className="font-body text-[15px] font-semibold text-neutral-900">
          Pipeline Overview
        </h4>
        <Link 
          href="/pipeline"
          className="font-body text-[13px] text-primary-500 font-medium hover:text-primary-600 transition-colors"
        >
          View Full Pipeline
        </Link>
      </div>

      <div className="flex gap-[8px] overflow-x-auto mt-[16px] pb-[8px]">
        {stages.map((stage) => (
          <div 
            key={stage.name}
            className="flex items-center h-[28px] rounded-full bg-primary-50 text-primary-700 font-body text-[12px] font-medium px-[12px] shrink-0"
          >
            {stage.name}
            <div className="flex items-center justify-center w-[18px] h-[18px] rounded-full bg-primary-500 text-white text-[9px] font-bold ml-[6px]">
              {stage.count}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-[8px] overflow-x-auto mt-[16px] pb-[8px]">
        {stages.flatMap(stage => stage.recentCandidates).slice(0, 10).map((candidate, idx) => (
          <div 
            key={`${candidate.id}-${idx}`}
            className="flex items-center h-[48px] gap-[8px] px-[12px] bg-neutral-50 rounded-md shrink-0 border border-neutral-100 hover:border-neutral-200 transition-colors cursor-pointer"
          >
            <div className="w-[24px] h-[24px] rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0">
              {candidate.avatar ? (
                <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-neutral-500 font-medium text-[10px]">{candidate.name.charAt(0)}</span>
              )}
            </div>
            
            <span className="font-body text-[13px] font-medium text-neutral-900 max-w-[100px] truncate">
              {candidate.name}
            </span>

            {candidate.score && (
              <ScoreRing score={candidate.score} size="sm" className="ml-[4px]" />
            )}
          </div>
        ))}
      </div>

      <Link 
        href="/pipeline"
        className="mt-auto pt-[16px]"
      >
        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-body text-[13px] font-medium py-[8px] rounded-md transition-colors">
          View Full Kanban Board
        </button>
      </Link>
    </div>
  )
}
