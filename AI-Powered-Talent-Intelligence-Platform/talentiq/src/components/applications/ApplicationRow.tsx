import { Application } from '@/types/domain.types'
import { StageBadge } from '@/components/shared/StageBadge'
import { SourceBadge } from '@/components/shared/SourceBadge'
import { formatDate } from '@/lib/utils'
import { getScoreColor } from '@/lib/score'
import { Eye, ArrowRight, Calendar } from 'lucide-react'
import Link from 'next/link'

interface ApplicationRowProps {
  application: Application
  isSelected: boolean
  onSelect: (id: string, selected: boolean) => void
}

export default function ApplicationRow({ application, isSelected, onSelect }: ApplicationRowProps) {
  const { candidate, job, stage, aiScore, appliedAt, source } = application
  const scoreValue = typeof aiScore === 'number' ? aiScore : 0
  const scoreColor = scoreValue > 0 ? getScoreColor(scoreValue) : '#E5E7EB'

  return (
    <tr role="row" className="group border-b border-neutral-100 hover:bg-neutral-50 transition-colors h-[64px]">
      
      <td role="cell" className="px-[16px] py-[12px] w-[48px]">
        <label className="flex items-center justify-center cursor-pointer">
          <input 
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(application.id, e.target.checked)}
            className="w-[16px] h-[16px] rounded-[4px] border-neutral-300 text-primary-500 focus:ring-primary-500 cursor-pointer"
          />
        </label>
      </td>

      <td role="cell" className="px-[16px] py-[12px] min-w-[240px]">
        <div className="flex items-center gap-[12px]">
          <div className="w-[36px] h-[36px] rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0 border border-neutral-100">
            {candidate.avatar ? (
              <img src={candidate.avatar} alt={candidate.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-body text-[14px] font-bold text-neutral-500">
                {candidate.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col truncate">
            <Link href={`/applications/${application.id}`} className="font-body text-[14px] font-semibold text-neutral-900 hover:text-primary-600 transition-colors truncate">
              {candidate.name}
            </Link>
            <span className="font-body text-[13px] text-neutral-500 truncate">{candidate.email}</span>
          </div>
        </div>
      </td>

      <td role="cell" className="px-[16px] py-[12px]">
        <span className="font-body text-[14px] text-neutral-700 truncate block max-w-[200px]">
          {job?.title || 'Unknown Role'}
        </span>
      </td>

      <td role="cell" className="px-[16px] py-[12px]">
        {scoreValue > 0 ? (
          <div className="flex items-center gap-[8px]">
            <div className="w-[8px] h-[8px] rounded-full" style={{ backgroundColor: scoreColor }} />
            <span className="font-body text-[14px] font-medium text-neutral-900">{scoreValue}</span>
          </div>
        ) : (
          <span className="font-body text-[13px] text-neutral-400 italic">Unscored</span>
        )}
      </td>

      <td role="cell" className="px-[16px] py-[12px]">
        <StageBadge stage={stage as any} />
      </td>

      <td role="cell" className="px-[16px] py-[12px] text-neutral-500 font-body text-[13px] whitespace-nowrap">
        {formatDate(appliedAt)}
      </td>

      <td role="cell" className="px-[16px] py-[12px]">
        <SourceBadge source={source as any} />
      </td>

      <td role="cell" className="px-[16px] py-[12px] w-[120px]">
        <div className="flex items-center gap-[8px] opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          <Link href={`/applications/${application.id}`} aria-label="View Application" className="text-neutral-400 hover:text-primary-600 bg-white hover:bg-primary-50 p-[6px] rounded-md border border-transparent hover:border-primary-100 transition-colors">
            <Eye size={16} />
          </Link>
          <button aria-label="Schedule interview" className="text-neutral-400 hover:text-primary-600 bg-white hover:bg-primary-50 p-[6px] rounded-md border border-transparent hover:border-primary-100 transition-colors">
            <Calendar size={16} />
          </button>
          <button aria-label="Move candidate" className="text-neutral-400 hover:text-primary-600 bg-white hover:bg-primary-50 p-[6px] rounded-md border border-transparent hover:border-primary-100 transition-colors">
            <ArrowRight size={16} />
          </button>
        </div>
      </td>
      
    </tr>
  )
}
