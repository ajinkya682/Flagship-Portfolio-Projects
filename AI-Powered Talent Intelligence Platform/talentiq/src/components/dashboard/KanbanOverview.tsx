'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp } from 'lucide-react'

interface Candidate {
  id: string
  name: string
  avatar?: string
  score?: number
  role?: string
}

interface Stage {
  name: string
  count: number
  color: string
  bgColor: string
  textColor: string
  recentCandidates: Candidate[]
}

interface KanbanOverviewProps {
  stages: Stage[]
}

function ScorePill({ score }: { score: number }) {
  const color = score >= 85
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : score >= 70
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-red-50 text-red-600 border-red-200'
  return (
    <span className={`text-[10px] font-bold px-[5px] py-[1px] rounded-full border ${color}`}>
      {score}
    </span>
  )
}

export default function KanbanOverview({ stages }: KanbanOverviewProps) {
  const totalCandidates = stages.reduce((sum, s) => sum + s.count, 0)

  return (
    <div className="bg-white rounded-[16px] border border-neutral-100 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-[20px] pt-[18px] pb-[14px] border-b border-neutral-50">
        <div>
          <h4 className="font-display text-[15px] font-bold text-neutral-900">Pipeline Overview</h4>
          <p className="font-body text-[12px] text-neutral-500 mt-[2px]">
            {totalCandidates} candidates across {stages.length} stages
          </p>
        </div>
        <Link
          href="/pipeline"
          className="flex items-center gap-[4px] text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 hover:bg-primary-100 px-[10px] py-[5px] rounded-[8px]"
        >
          Full Board <ArrowRight size={12} />
        </Link>
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-[10px] p-[16px] overflow-x-auto flex-1 pb-[16px]">
        {stages.map((stage) => {
          const pct = totalCandidates > 0 ? Math.round((stage.count / totalCandidates) * 100) : 0
          return (
            <div
              key={stage.name}
              className="flex flex-col min-w-[140px] flex-1 bg-neutral-50/80 rounded-[12px] border border-neutral-100 overflow-hidden"
            >
              {/* Column header */}
              <div className="px-[12px] pt-[10px] pb-[8px]" style={{ borderTop: `3px solid ${stage.color}` }}>
                <div className="flex items-center justify-between">
                  <span className="font-body text-[11px] font-semibold text-neutral-700">{stage.name}</span>
                  <span
                    className="font-display text-[16px] font-bold"
                    style={{ color: stage.color }}
                  >
                    {stage.count}
                  </span>
                </div>
                {/* progress bar */}
                <div className="mt-[6px] h-[3px] bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: stage.color }}
                  />
                </div>
              </div>

              {/* Candidate cards */}
              <div className="flex flex-col gap-[6px] px-[8px] py-[8px] flex-1">
                {stage.recentCandidates.slice(0, 3).map((c) => (
                  <Link
                    key={c.id}
                    href={`/applications/${c.id}`}
                    className="flex items-center gap-[7px] bg-white rounded-[8px] border border-neutral-100 px-[8px] py-[6px] hover:border-neutral-200 hover:shadow-sm transition-all group"
                  >
                    <div className="w-[22px] h-[22px] rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 shrink-0 flex items-center justify-center">
                      {c.avatar ? (
                        <img src={c.avatar} alt={c.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-[8px] font-bold">{c.name.charAt(0)}</span>
                      )}
                    </div>
                    <span className="font-body text-[10px] font-medium text-neutral-800 truncate flex-1 group-hover:text-primary-600 transition-colors">
                      {c.name.split(' ')[0]}
                    </span>
                    {c.score && <ScorePill score={c.score} />}
                  </Link>
                ))}
                {stage.count > 3 && (
                  <Link
                    href="/pipeline"
                    className="text-[10px] font-medium text-neutral-400 hover:text-primary-600 text-center py-[4px] transition-colors"
                  >
                    +{stage.count - 3} more
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-[6px] px-[16px] py-[12px] bg-gradient-to-r from-primary-50 to-indigo-50 border-t border-neutral-100">
        <TrendingUp size={13} className="text-primary-500" />
        <span className="font-body text-[12px] text-neutral-600 font-medium">
          Pipeline is <span className="text-emerald-600 font-semibold">moving 18% faster</span> than last month
        </span>
      </div>
    </div>
  )
}
