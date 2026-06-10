"use client"

import * as React from "react"
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Plus, Type, List, FileUp, CheckSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface CustomField {
  id: string
  label: string
  type: string
}

interface FormFieldRowProps {
  field: CustomField
  onDelete: (id: string) => void
  onLabelChange: (id: string, newLabel: string) => void
}

function FormFieldRow({ field, onDelete, onLabelChange }: FormFieldRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "text": return <Type size={14} className="mr-1" />
      case "select": return <List size={14} className="mr-1" />
      case "file": return <FileUp size={14} className="mr-1" />
      case "boolean": return <CheckSquare size={14} className="mr-1" />
      default: return <Type size={14} className="mr-1" />
    }
  }

  return (
    <div 
      ref={setNodeRef as any} 
      style={style} 
      className="flex items-center gap-[12px] rounded-[var(--radius-md)] border border-neutral-200 bg-white p-[12px] shadow-sm mb-[8px]"
    >
      <button 
        className="cursor-grab text-neutral-300 hover:text-neutral-500 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1">
        <Input 
          value={field.label}
          onChange={(e) => onLabelChange(field.id, e.target.value)}
          className="h-[32px] border-transparent px-2 font-body text-[14px] font-medium text-neutral-900 hover:border-neutral-200 focus:border-primary-500 shadow-none"
        />
      </div>

      <div className="flex shrink-0 items-center gap-[16px]">
        <div className="flex h-[24px] items-center rounded-full bg-neutral-100 px-[10px] font-body text-[11px] font-medium text-neutral-600 capitalize">
          {getTypeIcon(field.type)}
          {field.type}
        </div>
        
        <button 
          onClick={() => onDelete(field.id)}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-sm text-neutral-400 hover:bg-red-50 hover:text-[#EF4444]"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

interface FormFieldBuilderProps {
  fields: CustomField[]
  onChange: (fields: CustomField[]) => void
}

export function FormFieldBuilder({ fields, onChange }: FormFieldBuilderProps) {
  const [isAddFieldOpen, setIsAddFieldOpen] = React.useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id)
      const newIndex = fields.findIndex((f) => f.id === over?.id)
      onChange(arrayMove(fields, oldIndex, newIndex))
    }
  }

  const handleDelete = (id: string) => {
    onChange(fields.filter(f => f.id !== id))
  }

  const handleLabelChange = (id: string, label: string) => {
    onChange(fields.map(f => f.id === id ? { ...f, label } : f))
  }

  const handleAddField = (type: string) => {
    const newField: CustomField = {
      id: `field_${Date.now()}`,
      label: `New ${type} field`,
      type
    }
    onChange([...fields, newField])
    setIsAddFieldOpen(false)
  }

  const fieldTypes = [
    { id: "text", label: "Short Text", icon: Type },
    { id: "long-text", label: "Long Text", icon: Type },
    { id: "select", label: "Dropdown", icon: List },
    { id: "file", label: "File Upload", icon: FileUp },
    { id: "boolean", label: "Yes/No", icon: CheckSquare },
  ]

  return (
    <div className="flex flex-col">
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={fields}
          strategy={verticalListSortingStrategy}
        >
          {fields.map(field => (
            <FormFieldRow 
              key={field.id} 
              field={field} 
              onDelete={handleDelete}
              onLabelChange={handleLabelChange}
            />
          ))}
        </SortableContext>
      </DndContext>

      {fields.length === 0 && (
        <div className="mb-[16px] rounded-[var(--radius-md)] border border-dashed border-neutral-300 p-[32px] text-center font-body text-[13px] text-neutral-500">
          No custom fields added yet.
        </div>
      )}

      <Button 
        variant="ghost" 
        className="w-max mt-[8px]" 
        iconLeft={<Plus size={16} />}
        onClick={() => setIsAddFieldOpen(true)}
      >
        Add Custom Field
      </Button>

      {/* Add Field Modal */}
      <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="font-display text-[18px] font-semibold text-neutral-900">
              Add Field Type
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-[12px] py-[16px]">
            {fieldTypes.map(type => (
              <button
                key={type.id}
                onClick={() => handleAddField(type.id)}
                className="flex flex-col items-center gap-[8px] rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[16px] transition-all hover:border-primary-500 hover:bg-primary-50 hover:shadow-sm"
              >
                <type.icon size={24} className="text-neutral-600" />
                <span className="font-body text-[13px] font-medium text-neutral-900">{type.label}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
