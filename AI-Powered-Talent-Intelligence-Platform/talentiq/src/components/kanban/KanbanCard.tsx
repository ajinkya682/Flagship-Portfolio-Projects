'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Application } from '@/types/domain.types'
import { Sparkles, Clock, ArrowLeft, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface KanbanCardProps {
  application: Application
  onOpenPanel: (app: Application) => void
  onMoveStage?: (app: Application, stageName: string) => void
}

const STAGE_CONFIG = [
  { id: 'Applied', name: 'Applied', color: '#94A3B8' },
  { id: 'Screening', name: 'Screening', color: '#3B82F6' },
  { id: 'Interview', name: 'Interview', color: '#8B5CF6' },
  { id: 'Assessment', name: 'Assessment', color: '#F59E0B' },
  { id: 'Offer', name: 'Offer', color: '#10B981' },
  { id: 'Hired', name: 'Hired', color: '#059669' },
]

function ScoreChip({ score }: { score: number }) {
  const cls = score >= 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : score >= 70 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-600 border-red-200'
  return (
    <div className={`flex items-center gap-[3px] px-[6px] py-[1px] rounded-full border text-[10px] font-bold ${cls}`}>
      <Sparkles size={8} />
      {score}
    </div>
  )
}

export default function KanbanCard({ application, onOpenPanel, onMoveStage }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id })

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  } : undefined

  return (
    <div
      id={`kanban-card-${application.id}`}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpenPanel(application)}
      className={`bg-white rounded-[10px] border p-[14px] shadow-sm hover:shadow-md transition-all group cursor-grab active:cursor-grabbing ${isDragging ? 'border-primary-400 shadow-lg' : 'border-neutral-200 hover:-translate-y-[2px]'}`}
    >
      <div className="flex justify-between items-start mb-[12px]">
        <div className="flex items-center gap-[10px]">
          <img src={application.candidate.avatar} alt={application.candidate.name} className="w-[32px] h-[32px] rounded-[8px] object-cover bg-neutral-100 pointer-events-none" />
          <div>
            <Link 
              href={`/applications/${application.id}`}
              className="font-body text-[13px] font-semibold text-neutral-900 hover:text-primary-600 transition-colors leading-tight block"
              onPointerDown={(e) => e.stopPropagation()} // Prevent drag when clicking link
              onClick={(e) => e.stopPropagation()} // Prevent open panel when clicking link
            >
              {application.candidate.name}
            </Link>
            <p className="font-body text-[11px] text-neutral-500 mt-[2px] truncate max-w-[140px]">{application.job?.title || 'Unknown Role'}</p>
          </div>
        </div>
        <div onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-neutral-300 hover:text-neutral-600 transition-colors outline-none focus:ring-2 focus:ring-blue-100 rounded-sm">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px] bg-white rounded-[12px] shadow-xl border border-neutral-100 p-[4px] font-body z-50">
              {onMoveStage && STAGE_CONFIG.findIndex(s => s.id === application.stage) < STAGE_CONFIG.length - 1 && application.stage !== 'Rejected' && (
                <DropdownMenuItem 
                  onClick={() => onMoveStage(application, STAGE_CONFIG[STAGE_CONFIG.findIndex(s => s.id === application.stage) + 1].id)}
                  className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer outline-none"
                >
                  <CheckCircle2 size={14} className="text-blue-500" /> Move Forward
                </DropdownMenuItem>
              )}
              {onMoveStage && STAGE_CONFIG.findIndex(s => s.id === application.stage) > 0 && application.stage !== 'Rejected' && (
                <DropdownMenuItem 
                  onClick={() => onMoveStage(application, STAGE_CONFIG[STAGE_CONFIG.findIndex(s => s.id === application.stage) - 1].id)}
                  className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] text-[13px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 cursor-pointer outline-none"
                >
                  <ArrowLeft size={14} className="text-neutral-400" /> Move Backward
                </DropdownMenuItem>
              )}
              {onMoveStage && application.stage !== 'Rejected' && (
                <>
                  <DropdownMenuSeparator className="bg-neutral-100 h-[1px] my-[4px]" />
                  <DropdownMenuItem 
                    onClick={() => onMoveStage(application, 'Rejected')}
                    className="flex items-center gap-[8px] px-[8px] py-[6px] rounded-[6px] text-[13px] text-red-600 hover:bg-red-50 cursor-pointer outline-none"
                  >
                    <XCircle size={14} /> Reject
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center justify-between mt-[14px] pt-[12px] border-t border-neutral-50">
        <div className="flex items-center gap-[10px]">
          <ScoreChip score={application.aiScore || 0} />
          <span className="font-body text-[10px] font-medium text-neutral-400 bg-neutral-50 px-[6px] py-[2px] rounded-[4px] border border-neutral-100">
            {application.source || 'Career Site'}
          </span>
        </div>
        <div className={`flex items-center gap-[4px] font-body text-[10px] font-medium ${(application.daysInStage || 0) >= 5 && application.stage !== 'Hired' ? 'text-red-500' : 'text-neutral-400'}`}>
          <Clock size={11} /> {application.daysInStage || 0}d
        </div>
      </div>
    </div>
  )
}
