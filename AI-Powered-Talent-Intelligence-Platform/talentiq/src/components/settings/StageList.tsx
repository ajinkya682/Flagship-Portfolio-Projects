'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import StageRow from './StageRow'

interface Stage {
  id: string
  name: string
  isDefault: boolean
  color: string
}

interface StageListProps {
  initialStages: Stage[]
}

export default function StageList({ initialStages }: StageListProps) {
  const [stages, setStages] = useState<Stage[]>(initialStages)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setStages((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)
        
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={stages.map(s => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-[12px]">
          {stages.map((stage) => (
            <StageRow 
              key={stage.id} 
              id={stage.id}
              name={stage.name}
              isDefault={stage.isDefault}
              color={stage.color}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
