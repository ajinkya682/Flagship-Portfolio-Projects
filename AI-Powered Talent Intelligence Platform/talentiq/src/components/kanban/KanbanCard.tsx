'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Application } from '@/types/domain.types'
import { getScoreColor } from '@/lib/score'
import { ScoreRing } from '@/components/score/ScoreRing'
import { SourceBadge } from '@/components/shared/SourceBadge'

interface KanbanCardProps {
  application: Application
  onOpenPanel: (app: Application) => void
}

export default function KanbanCard({ application, onOpenPanel }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    scale: isDragging ? '1.02' : undefined,
    rotate: isDragging ? '0.8deg' : undefined,
    cursor: isDragging ? 'grabbing' : 'grab',
    boxShadow: isDragging ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : undefined,
  }

  const score = typeof application.aiScore === 'number' ? application.aiScore : 0
  const scoreColor = score > 0 ? getScoreColor(score) : '#E5E7EB'
  const daysInStage = application.daysInStage ?? 0

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpenPanel(application)}
      className="bg-white rounded-md border border-[#E5E7EB] shadow-sm p-[14px] px-[16px] relative transition-colors hover:border-neutral-300"
    >
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[3px]"
        style={{ backgroundColor: scoreColor }}
      />
      
      <div className="flex justify-between items-center mb-[4px]">
        <h5 className="font-body text-[15px] font-semibold text-neutral-900 truncate pr-[8px]">
          {application.candidate.name}
        </h5>
        {score > 0 && <ScoreRing score={score} size="sm" className="shrink-0" />}
      </div>

      <div className="flex justify-between items-center mb-[12px]">
        <span className="font-body text-[13px] text-neutral-500 truncate pr-[8px]">
          {application.job?.title || 'Unknown Role'}
        </span>
        <SourceBadge source={application.source as any} />
      </div>

      <div className="flex justify-between items-center">
        <span className="font-body text-[11px] text-neutral-400">
          {daysInStage} {daysInStage === 1 ? 'day' : 'days'} in stage
        </span>
        <div className="w-[20px] h-[20px] rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center border border-white">
          <span className="text-[9px] font-bold text-neutral-500">
            {application.assignedTo?.name?.charAt(0) || 'R'}
          </span>
        </div>
      </div>
    </div>
  )
}
