'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import api from '@/lib/api'
import StageList, { type Stage } from '@/components/settings/StageList'

export default function PipelineSettingsPage() {
  const { user } = useCurrentUser()
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (user?.company?.pipelineStages) {
      // Sort by order initially
      const sorted = [...user.company.pipelineStages].sort((a, b) => a.order - b.order)
      setStages(sorted)
      setLoading(false)
    } else {
      // Fallback
      setStages([
        { id: 'applied', name: 'Applied', color: '#94A3B8', order: 0, isCore: true },
        { id: 'screening', name: 'Screening', color: '#3B82F6', order: 1, isCore: false },
        { id: 'interview', name: 'Interview', color: '#8B5CF6', order: 2, isCore: false },
        { id: 'assessment', name: 'Assessment', color: '#F59E0B', order: 3, isCore: false },
        { id: 'offer', name: 'Offer', color: '#10B981', order: 4, isCore: false },
        { id: 'hired', name: 'Hired', color: '#059669', order: 5, isCore: true },
        { id: 'rejected', name: 'Rejected', color: '#EF4444', order: 6, isCore: true }
      ])
      setLoading(false)
    }
  }, [user])

  const handleAddStage = () => {
    const newStage: Stage = {
      id: `stage_\${Date.now()}`,
      name: 'New Stage',
      color: '#CBD5E1',
      order: stages.length,
      isCore: false
    }
    setStages([...stages, newStage])
  }

  const handleDeleteStage = (id: string) => {
    setStages(stages.filter(s => s.id !== id))
  }

  const handleUpdateStage = (id: string, field: keyof Stage, value: any) => {
    setStages(stages.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleSave = async () => {
    if (!user?.company?.id) return
    setSaving(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Reassign explicit order just in case
      const finalStages = stages.map((s, i) => ({ ...s, order: i }))
      
      await api.patch(`/companies/\${user.company.id}`, {
        pipelineStages: finalStages
      })
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save pipeline stages')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-[40px] flex justify-center"><LoadingSpinner /></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-[32px]">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">Pipeline Stages</h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">Customize your hiring workflow. Drag to reorder.</p>
        </div>
        <button 
          onClick={handleAddStage}
          className="flex items-center gap-[6px] bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Stage
        </button>
      </div>

      {error && (
        <div className="mb-[24px] p-[12px] bg-red-50 text-red-600 border border-red-100 rounded-[8px] text-[13px] font-body max-w-[800px]">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-[24px] p-[12px] bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-[8px] text-[13px] font-body max-w-[800px]">
          Pipeline stages saved successfully! Note: You may need to refresh the page to see changes in the main board.
        </div>
      )}

      <div className="max-w-[800px]">
        <StageList 
          stages={stages} 
          setStages={setStages}
          onUpdateStage={handleUpdateStage}
          onDeleteStage={handleDeleteStage}
        />
        
        <div className="flex justify-end mt-[32px]">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-[8px] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-body text-[14px] font-medium px-[24px] py-[10px] rounded-[8px] transition-colors shadow-sm"
          >
            {saving && <LoadingSpinner size="sm" />} Save Pipeline
          </button>
        </div>
      </div>
    </div>
  )
}
