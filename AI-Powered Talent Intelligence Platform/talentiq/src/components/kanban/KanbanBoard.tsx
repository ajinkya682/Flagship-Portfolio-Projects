'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { Application } from '@/types/domain.types'
import KanbanColumn from './KanbanColumn'
import KanbanDragOverlay from './KanbanDragOverlay'
import ApplicationSidePanel from './ApplicationSidePanel'

interface KanbanBoardProps {
  applications: Application[]
  jobId: string
}

const STAGES = [
  { name: 'Screening', color: '#3B82F6' },
  { name: 'Phone Screen', color: '#0EA5E9' },
  { name: 'Interview', color: '#8B5CF6' },
  { name: 'Assessment', color: '#EC4899' },
  { name: 'Offer', color: '#10B981' },
  { name: 'Hired', color: '#059669' },
]

export default function KanbanBoard({ applications: initialApplications, jobId }: KanbanBoardProps) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const [activeColumn, setActiveColumn] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    if (over && STAGES.some(s => s.name === over.id)) {
      setActiveColumn(over.id as string)
    } else {
      setActiveColumn(null)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveColumn(null)

    if (!over) return

    const activeAppId = active.id as string
    let destinationStageName = over.id as string
    
    const overIsCard = !STAGES.some(s => s.name === over.id)
    if (overIsCard) {
      const overApp = applications.find(app => app.id === over.id)
      if (overApp) {
        destinationStageName = overApp.stage
      }
    }

    if (!STAGES.some(s => s.name === destinationStageName)) return

    const activeApp = applications.find(app => app.id === activeAppId)
    if (!activeApp || activeApp.stage === destinationStageName) return

    // Optimistic update
    setApplications(prev => prev.map(app => {
      if (app.id === activeAppId) {
        return { ...app, stage: destinationStageName }
      }
      return app
    }))
  }

  const handleOpenPanel = (app: Application) => {
    setSelectedApplication(app)
  }

  return (
    <div className="flex flex-col h-full overflow-hidden w-full flex-grow">
      <div className="flex-grow overflow-x-auto overflow-y-hidden p-[24px] flex gap-[16px] items-start bg-neutral-50 min-h-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {STAGES.map(stage => {
            const columnApps = applications.filter(app => app.stage === stage.name)
            return (
              <KanbanColumn 
                key={stage.name}
                stage={stage}
                applications={columnApps}
                onOpenPanel={handleOpenPanel}
                isOver={activeColumn === stage.name}
              />
            )
          })}

          <KanbanDragOverlay 
            activeId={activeId} 
            applications={applications} 
          />
        </DndContext>
      </div>

      <ApplicationSidePanel 
        application={selectedApplication} 
        onClose={() => setSelectedApplication(null)} 
      />
    </div>
  )
}
