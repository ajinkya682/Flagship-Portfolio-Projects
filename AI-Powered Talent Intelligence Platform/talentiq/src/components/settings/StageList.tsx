"use client"

import * as React from "react"
import { GripVertical, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Stage {
  id: string
  name: string
  type: string
  isDefault: boolean
}

function SortableStageRow({ stage, onUpdate, onDelete }: { stage: Stage, onUpdate: (id: string, name: string) => void, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-[12px] p-[12px] bg-white border-b border-neutral-200 last:border-0 ${isDragging ? "shadow-md z-10 relative opacity-80" : ""}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab hover:text-neutral-900 text-neutral-400 p-[4px]">
        <GripVertical size={16} />
      </div>
      
      <Input 
        value={stage.name} 
        onChange={(e) => onUpdate(stage.id, e.target.value)}
        className="max-w-[300px] h-[36px]"
      />
      
      <span className="inline-flex items-center rounded-full bg-neutral-100 px-[10px] py-[2px] text-[11px] font-bold uppercase tracking-wider text-neutral-700 ml-[12px]">
        {stage.type}
      </span>

      <div className="ml-auto">
        {stage.isDefault ? (
          <Button variant="ghost" className="text-neutral-400 cursor-not-allowed" title="Default stage cannot be removed" disabled>
            <Trash2 size={16} />
          </Button>
        ) : (
          <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDelete(stage.id)}>
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </div>
  )
}

export function StageList() {
  const [stages, setStages] = React.useState<Stage[]>([
    { id: "applied", name: "Applied", type: "System", isDefault: true },
    { id: "screening", name: "Screening", type: "Custom", isDefault: false },
    { id: "phone", name: "Phone Screen", type: "Custom", isDefault: false },
    { id: "interview", name: "Interview", type: "Custom", isDefault: false },
    { id: "offer", name: "Offer", type: "System", isDefault: true },
    { id: "hired", name: "Hired", type: "System", isDefault: true },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setStages((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleUpdate = (id: string, name: string) => {
    setStages(stages.map(s => s.id === id ? { ...s, name } : s))
  }

  const handleDelete = (id: string) => {
    setStages(stages.filter(s => s.id !== id))
  }

  const handleAdd = () => {
    const newId = `custom-${Date.now()}`
    setStages([...stages, { id: newId, name: "New Stage", type: "Custom", isDefault: false }])
  }

  return (
    <div className="flex flex-col w-full max-w-[600px]">
      <div className="rounded-[var(--radius-lg)] border border-neutral-200 overflow-hidden">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={stages.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {stages.map((stage) => (
              <SortableStageRow 
                key={stage.id} 
                stage={stage} 
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <Button variant="ghost" onClick={handleAdd} iconLeft={<Plus size={16} />} className="w-max mt-[16px]">
        Add Stage
      </Button>

      <div className="flex pt-[24px] mt-[16px] border-t border-neutral-200">
        <Button>Save Changes</Button>
      </div>
    </div>
  )
}
