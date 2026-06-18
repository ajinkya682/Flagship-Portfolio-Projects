'use client'

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

export interface Stage {
  id: string
  name: string
  isCore: boolean
  color: string
  order: number
}

interface StageListProps {
  stages: Stage[]
  setStages: (stages: Stage[]) => void
  onUpdateStage: (id: string, field: keyof Stage, value: any) => void
  onDeleteStage: (id: string) => void
}

export default function StageList({ stages, setStages, onUpdateStage, onDeleteStage }: StageListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = stages.findIndex(item => item.id === active.id)
      const newIndex = stages.findIndex(item => item.id === over?.id)
      
      const newStages = arrayMove(stages, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }))
      setStages(newStages)
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
              isCore={stage.isCore}
              color={stage.color}
              onUpdate={(field, value) => onUpdateStage(stage.id, field as keyof Stage, value)}
              onDelete={() => onDeleteStage(stage.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
