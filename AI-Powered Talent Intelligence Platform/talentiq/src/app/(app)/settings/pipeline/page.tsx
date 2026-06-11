'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import StageList from '@/components/settings/StageList'

const DEFAULT_STAGES = [
  { id: 'applied', name: 'Applied', isDefault: true, color: '#D1D5DB' },
  { id: 'screening', name: 'Screening', isDefault: false, color: '#FCD34D' },
  { id: 'interview', name: 'Interview', isDefault: false, color: '#60A5FA' },
  { id: 'assessment', name: 'Assessment', isDefault: false, color: '#A78BFA' },
  { id: 'offer', name: 'Offer', isDefault: false, color: '#34D399' },
  { id: 'hired', name: 'Hired', isDefault: true, color: '#10B981' },
  { id: 'rejected', name: 'Rejected', isDefault: true, color: '#EF4444' },
]

export default function PipelineSettingsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-[32px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">Pipeline Stages</h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Customize your hiring workflow. Drag to reorder.</p>
        </div>
        <button 
          className="flex items-center gap-[6px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Stage
        </button>
      </div>

      <div className="max-w-[800px]">
        <StageList initialStages={DEFAULT_STAGES} />
        
        <div className="flex justify-end mt-[32px]">
          <button className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[24px] py-[10px] rounded-md transition-colors shadow-sm">
            Save Pipeline
          </button>
        </div>
      </div>
    </div>
  )
}
