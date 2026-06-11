'use client'

import { useState, useEffect } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { MoreHorizontal, Plus } from 'lucide-react'
import { Application } from '@/types/domain.types'
import KanbanCard from './KanbanCard'

interface KanbanColumnProps {
  stage: {
    name: string
    color: string
  }
  applications: Application[]
  onOpenPanel: (app: Application) => void
  isOver?: boolean
}

export default function KanbanColumn({ stage, applications, onOpenPanel, isOver = false }: KanbanColumnProps) {
  const [isBouncing, setIsBouncing] = useState(false)
  const count = applications.length

  useEffect(() => {
    setIsBouncing(true)
    const timer = setTimeout(() => setIsBouncing(false), 300)
    return () => clearTimeout(timer)
  }, [count])

  const { setNodeRef } = useDroppable({
    id: stage.name,
  })

  return (
    <div 
      className="w-[280px] shrink-0 flex flex-col h-full rounded-md overflow-hidden"
      aria-label={`${stage.name} - ${count} candidates`}
    >
      
      {/* Header */}
      <div className="h-[44px] bg-white rounded-md flex items-center px-[12px] gap-[8px] mb-[8px] border border-[#E5E7EB] shadow-sm relative shrink-0">
        <div 
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-md"
          style={{ backgroundColor: stage.color }}
        />
        <h5 className="font-body text-[15px] font-semibold text-neutral-900 ml-[4px]">
          {stage.name}
        </h5>
        <div className={`bg-neutral-100 text-neutral-700 text-[10px] font-bold px-[8px] py-[2px] rounded-full ml-auto ${isBouncing ? 'animate-spring-in' : ''}`}>
          {count}
        </div>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer" aria-label="Column options">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Body */}
      <div 
        ref={setNodeRef}
        className={`flex-grow overflow-y-auto p-[8px] flex flex-col gap-[8px] rounded-md transition-colors duration-100 min-h-[150px] thin-scrollbar ${
          isOver ? 'bg-accent-50 border border-accent-200' : 'bg-neutral-100'
        }`}
      >
        <SortableContext items={applications.map(app => app.id)} strategy={verticalListSortingStrategy}>
          {applications.map(app => (
            <KanbanCard 
              key={app.id} 
              application={app} 
              onOpenPanel={onOpenPanel} 
            />
          ))}
        </SortableContext>

        {applications.length === 0 && (
          <div className="h-[80px] border-2 border-dashed border-neutral-200 rounded-md flex items-center justify-center">
            <button className="flex items-center gap-[4px] text-neutral-400 hover:text-neutral-500 font-body text-[12px] font-medium transition-colors">
              <Plus size={14} /> Add Candidate
            </button>
          </div>
        )}

        <div className="mt-auto pt-[8px] pb-[4px]">
          <button className="w-full flex items-center justify-center gap-[4px] text-neutral-400 hover:text-neutral-600 font-body text-[12px] font-medium transition-colors py-[8px] hover:bg-neutral-200/50 rounded-md">
            <Plus size={14} /> Add Candidate
          </button>
        </div>
      </div>

    </div>
  )
}
