'use client'

import { DragOverlay } from '@dnd-kit/core'
import KanbanCard from './KanbanCard'
import { Application } from '@/types/domain.types'

interface KanbanDragOverlayProps {
  activeId: string | null
  applications: Application[]
}

export default function KanbanDragOverlay({ activeId, applications }: KanbanDragOverlayProps) {
  if (!activeId) return null

  const activeApplication = applications.find(app => app.id === activeId)

  if (!activeApplication) return null

  return (
    <DragOverlay dropAnimation={null}>
      <div style={{ transform: 'scale(1.02) rotate(0.8deg)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', cursor: 'grabbing', opacity: 0.9 }}>
        <KanbanCard application={activeApplication} onOpenPanel={() => {}} />
      </div>
    </DragOverlay>
  )
}
