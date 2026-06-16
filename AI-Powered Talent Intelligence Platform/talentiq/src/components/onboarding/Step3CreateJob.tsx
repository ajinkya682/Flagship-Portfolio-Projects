'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Sparkles } from 'lucide-react'
import api from '@/lib/api'

export default function Step3CreateJob({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { register, handleSubmit, setValue, watch } = useForm()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateAI = async () => {
    const title = watch('title')
    const department = watch('department')
    const type = watch('type')

    if (!title || !department || !type) {
      setError('Please fill in the Job Title, Department, and Employment Type first.')
      return
    }

    setError(null)
    setIsGenerating(true)
    
    try {
      const response = await api.post('/jobs/generate-description', {
        title,
        department,
        type
      })
      
      setValue('description', response.data.description)
    } catch (err) {
      console.error('Failed to generate description', err)
      setError('Failed to generate description. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 mt-6">
      <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
        Create your first job
      </h1>
      <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
        Let&apos;s set up a role so you can see the AI scoring in action.
      </p>

      <form onSubmit={handleSubmit(onNext)} className="mt-[32px] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Job Title</label>
          <input
            {...register('title')}
            required
            placeholder="e.g. Senior Frontend Engineer"
            className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Department</label>
            <select {...register('department')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]">
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Employment Type</label>
            <select {...register('type')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px]">
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-[6px] relative">
          <div className="flex justify-between items-center">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Job Description</label>
            <button 
              type="button" 
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="flex items-center gap-[6px] text-[12px] font-medium text-accent-600 bg-accent-50 px-2 py-1 rounded-md"
            >
              <Sparkles size={14} />
              {isGenerating ? 'Generating...' : 'Generate with AI'}
            </button>
          </div>
          <textarea
            {...register('description')}
            rows={5}
            className="p-[12px] border border-neutral-200 rounded-lg text-[15px] resize-none"
            placeholder="Describe the role..."
          />
          {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
        </div>

        <div className="flex items-center gap-[16px] mt-[8px]">
          <button type="button" onClick={onBack} className="h-[48px] px-[24px] border border-neutral-200 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
            Back
          </button>
          <button type="submit" className="flex-1 h-[48px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg">
            Create Job
          </button>
        </div>
      </form>
    </div>
  )
}
