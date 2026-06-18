'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'

interface StageRowProps {
  id: string
  name: string
  isCore: boolean
  color: string
  onUpdate: (field: string, value: string) => void
  onDelete: () => void
}

export default function StageRow({ id, name, isCore, color, onUpdate, onDelete }: StageRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`flex items-center gap-[16px] bg-white border \${isDragging ? 'border-primary-500 shadow-md' : 'border-[#E5E7EB] shadow-sm'} rounded-lg p-[16px] group`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab hover:text-neutral-900 text-neutral-400 p-[4px]"
      >
        <GripVertical size={20} />
      </div>

      <div className="flex-1 flex items-center gap-[16px]">
        <input 
          type="text" 
          value={name}
          onChange={(e) => onUpdate('name', e.target.value)}
          disabled={isCore}
          className="flex-1 h-[36px] rounded-md bg-transparent border border-transparent hover:border-neutral-200 focus:border-primary-500 px-[12px] font-body text-[14px] font-semibold text-neutral-900 focus:outline-none focus:ring-1 focus:ring-primary-500 disabled:opacity-80 transition-colors"
        />
        
        <span className={`px-[8px] py-[2px] rounded-full text-[11px] font-bold uppercase tracking-wider \${
          isCore ? 'bg-neutral-100 text-neutral-600' : 'bg-primary-50 text-primary-700'
        }`}>
          {isCore ? 'Core' : 'Custom'}
        </span>
      </div>

      <div className="flex items-center gap-[16px]">
        <div className="flex items-center gap-[8px] relative">
          <input 
            type="color"
            value={color}
            onChange={(e) => onUpdate('color', e.target.value)}
            className="w-[28px] h-[28px] rounded-full p-0 border-0 cursor-pointer overflow-hidden bg-transparent"
          />
        </div>

        <button 
          onClick={onDelete}
          disabled={isCore}
          className="text-neutral-400 hover:text-[#DC2626] disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors p-[8px] rounded-md"
          title={isCore ? "Core stages cannot be deleted" : "Delete stage"}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
