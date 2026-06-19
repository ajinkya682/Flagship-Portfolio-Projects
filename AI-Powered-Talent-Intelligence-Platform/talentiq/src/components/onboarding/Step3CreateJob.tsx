'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Sparkles, CheckCircle2, Copy, ExternalLink, ArrowRight } from 'lucide-react'
import api from '@/lib/api'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

import { useAuth } from '@/hooks/useAuth'

const REQUIREMENTS = [
  { id: 'fullName', label: 'Full Name' },
  { id: 'mobileNumber', label: 'Mobile Number' },
  { id: 'date', label: 'Date' },
  { id: 'linkedin', label: 'Linkedin' },
  { id: 'github', label: 'Github' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'resume', label: 'Resume' },
  { id: 'passportPhoto', label: 'Passport Photo' },
  { id: 'signature', label: 'Signature' },
]

export default function Step3CreateJob({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  const { user } = useAuth()
  const { register, handleSubmit, setValue, watch, control } = useForm<any>({
    defaultValues: {
      title: '',
      department: 'engineering',
      location: '',
      type: 'full-time',
      workModel: 'hybrid',
      salaryMin: '',
      salaryMax: '',
      description: '',
      requirements: REQUIREMENTS.reduce((acc, req) => ({ ...acc, [req.id]: true }), {} as Record<string, boolean>)
    }
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [publishedJobUrl, setPublishedJobUrl] = useState<string | null>(null)

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const response = await api.post('/jobs', {
        title: data.title,
        department: data.department,
        location: data.location || 'Remote',
        type: data.type,
        remote: data.workModel,
        salaryMin: parseInt(data.salaryMin) || undefined,
        salaryMax: parseInt(data.salaryMax) || undefined,
        description: data.description || 'Description not provided',
        applicationFormConfig: data.requirements,
      })
      
      const jobId = response.data?.slug || response.data?.id || 'new-job'
      const companySlug = user?.company?.slug || 'company'
      setPublishedJobUrl(`${window.location.origin}/careers/${companySlug}/${jobId}`)
    } catch (err) {
      console.error('Failed to create job', err)
      setError('Failed to publish job. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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

  if (publishedJobUrl) {
    return (
      <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 mt-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
          Your job is live!
        </h1>
        <p className="font-body text-[15px] text-neutral-500 mt-[8px] max-w-[400px]">
          Candidates can now apply for this role. Share this link on your career page or social media.
        </p>

        <div className="flex items-center w-full max-w-md mt-8 p-1 border border-neutral-200 rounded-lg bg-neutral-50">
          <input 
            type="text" 
            readOnly 
            value={publishedJobUrl} 
            className="flex-1 bg-transparent px-3 py-2 text-[14px] text-neutral-600 outline-none"
          />
          <button 
            onClick={() => navigator.clipboard.writeText(publishedJobUrl)}
            className="p-2 text-neutral-500 hover:text-neutral-900 transition-colors"
            title="Copy link"
          >
            <Copy size={18} />
          </button>
          <a 
            href={publishedJobUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-[#3B58F6] hover:text-blue-700 transition-colors"
            title="Open link"
          >
            <ExternalLink size={18} />
          </a>
        </div>

        <button 
          onClick={onNext}
          className="mt-10 h-[48px] px-8 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors w-full max-w-md"
        >
          Continue to Next Step
          <ArrowRight size={18} />
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 mt-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 leading-tight">
            Create New Job
          </h1>
          <p className="font-body text-[15px] text-neutral-500 mt-[8px]">
            Set up a role to start accepting applications and scoring candidates.
          </p>
        </div>
        <button 
          type="button" 
          onClick={onNext}
          className="text-[14px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Skip for now
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[24px]">
        {/* Core Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Job Title</label>
            <input
              {...register('title')}
              required
              placeholder="e.g. Senior Software Engineer"
              className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Department</label>
            <select {...register('department')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none">
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Location</label>
            <input
              {...register('location')}
              placeholder="e.g. San Francisco, CA"
              className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px] focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Employment Type</label>
            <select {...register('type')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px] focus:ring-2 focus:ring-primary-500 transition-all outline-none">
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Work Model</label>
            <select {...register('workModel')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px] focus:ring-2 focus:ring-primary-500 transition-all outline-none">
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Min Salary (USD)</label>
            <input
              {...register('salaryMin')}
              type="number"
              placeholder="e.g. 100000"
              className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px] focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Max Salary (USD)</label>
            <input
              {...register('salaryMax')}
              type="number"
              placeholder="e.g. 150000"
              className="h-[44px] px-[12px] border border-neutral-200 rounded-lg text-[15px] focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-[6px] relative">
          <div className="flex justify-between items-center mb-1">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Job Description</label>
            <button 
              type="button" 
              onClick={handleGenerateAI}
              disabled={isGenerating}
              className="flex items-center gap-[6px] text-[13px] font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Sparkles size={14} />
              {isGenerating ? 'Generating...' : 'Auto-generate with AI'}
            </button>
          </div>
          <textarea
            {...register('description')}
            rows={5}
            className="p-[16px] border border-neutral-200 rounded-xl text-[15px] resize-none focus:ring-2 focus:ring-primary-500 transition-all outline-none"
            placeholder="Describe the role, responsibilities, and requirements..."
          />
          {error && <p className="text-[13px] text-red-500 mt-1">{error}</p>}
        </div>

        {/* Application Form Requirements */}
        <div className="mt-2 border border-neutral-200 rounded-xl p-6 bg-neutral-50/50">
          <div className="mb-4">
            <h3 className="font-body text-[16px] font-bold text-neutral-900">Application Form Requirements</h3>
            <p className="text-[13px] text-neutral-500 mt-1">Select the fields candidates must fill out when applying for this job.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
            {REQUIREMENTS.map((req) => (
              <label key={req.id} className="flex items-center gap-3 cursor-pointer group">
                <Controller
                  name={`requirements.${req.id}`}
                  control={control}
                  render={({ field }) => (
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 rounded border border-neutral-300 bg-white peer-checked:bg-[#3B58F6] peer-checked:border-[#3B58F6] flex items-center justify-center transition-colors group-hover:border-[#3B58F6]">
                        {field.value && <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />}
                      </div>
                    </div>
                  )}
                />
                <span className="text-[14px] font-medium text-neutral-700 select-none group-hover:text-neutral-900 transition-colors">
                  {req.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-[12px] mt-[16px] pt-6 border-t border-neutral-100">
          <button type="button" onClick={onBack} disabled={isSubmitting} className="h-[44px] px-[24px] border border-transparent text-neutral-600 font-medium rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="h-[44px] px-[32px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg flex items-center justify-center transition-colors shadow-sm disabled:opacity-70">
            {isSubmitting ? <LoadingSpinner size="sm" className="text-white" /> : 'Publish Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
