'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, Briefcase, MapPin, Building2, AlignLeft, DollarSign } from 'lucide-react'
import { useDomainStore, Job } from '@/store/domain.store'
import { v4 as uuidv4 } from 'uuid'

export default function NewJobPage() {
  const router = useRouter()
  const { addJob } = useDomainStore()

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    type: 'Full-time',
    remote: 'Hybrid',
    salaryMin: '',
    salaryMax: '',
    description: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate slight delay
    setTimeout(() => {
      const newJob: Job = {
        id: `job_${uuidv4().substring(0, 8)}`,
        title: formData.title,
        department: formData.department,
        location: formData.location,
        type: formData.type,
        remote: formData.remote,
        status: 'published',
        salaryMin: parseInt(formData.salaryMin) || 0,
        salaryMax: parseInt(formData.salaryMax) || 0,
        description: formData.description,
        postedAt: new Date().toISOString()
      }
      addJob(newJob)
      router.push('/jobs')
    }, 600)
  }

  const generateWithAi = () => {
    if (!formData.title) {
      alert("Please enter a job title first.")
      return
    }
    setFormData(prev => ({
      ...prev,
      description: `We are looking for a ${prev.title} to join our growing team. You will be responsible for taking ownership of key projects and collaborating with cross-functional teams to deliver high-quality results.\n\nRequirements:\n- 3+ years of relevant experience\n- Strong problem-solving skills\n- Excellent communication and teamwork abilities\n\nWhat We Offer:\n- Competitive salary\n- Remote flexibility\n- Health, dental, and vision insurance`
    }))
  }

  return (
    <div className="flex flex-col max-w-[800px] mx-auto w-full gap-[24px]">
      <div className="flex items-center gap-[12px]">
        <Link href="/jobs" className="w-[36px] h-[36px] rounded-[10px] bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="font-display text-[24px] font-bold text-neutral-900">Post a New Job</h1>
          <p className="font-body text-[13px] text-neutral-500">Create a new job listing to start accepting applications.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] bg-white border border-neutral-200 rounded-[16px] shadow-sm p-[32px]">
        
        <div className="flex flex-col gap-[8px]">
          <label className="font-body text-[13px] font-bold text-neutral-800 flex items-center gap-[6px]">
            <Briefcase size={14} className="text-neutral-400" /> Job Title
          </label>
          <input
            required
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Senior Software Engineer"
            className="h-[44px] px-[14px] border border-neutral-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-bold text-neutral-800 flex items-center gap-[6px]">
              <Building2 size={14} className="text-neutral-400" /> Department
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="h-[44px] px-[14px] border border-neutral-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            >
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-bold text-neutral-800 flex items-center gap-[6px]">
              <MapPin size={14} className="text-neutral-400" /> Location
            </label>
            <input
              required
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA"
              className="h-[44px] px-[14px] border border-neutral-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-bold text-neutral-800">Employment Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="h-[44px] px-[14px] border border-neutral-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-bold text-neutral-800">Work Model</label>
            <select
              name="remote"
              value={formData.remote}
              onChange={handleChange}
              className="h-[44px] px-[14px] border border-neutral-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            >
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-bold text-neutral-800 flex items-center gap-[6px]">
              <DollarSign size={14} className="text-neutral-400" /> Min Salary (USD)
            </label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="e.g. 100000"
              className="h-[44px] px-[14px] border border-neutral-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex flex-col gap-[8px]">
            <label className="font-body text-[13px] font-bold text-neutral-800 flex items-center gap-[6px]">
              <DollarSign size={14} className="text-neutral-400" /> Max Salary (USD)
            </label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="e.g. 150000"
              className="h-[44px] px-[14px] border border-neutral-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center justify-between">
            <label className="font-body text-[13px] font-bold text-neutral-800 flex items-center gap-[6px]">
              <AlignLeft size={14} className="text-neutral-400" /> Job Description
            </label>
            <button
              type="button"
              onClick={generateWithAi}
              className="flex items-center gap-[6px] text-[12px] font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-[10px] py-[4px] rounded-[6px] transition-colors"
            >
              <Sparkles size={12} /> Auto-generate with AI
            </button>
          </div>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and requirements..."
            className="min-h-[200px] p-[14px] border border-neutral-200 rounded-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y"
          />
        </div>

        <div className="flex items-center justify-end gap-[12px] pt-[16px] border-t border-neutral-100">
          <Link href="/jobs" className="h-[44px] px-[20px] bg-white border border-neutral-200 text-neutral-700 font-body text-[14px] font-semibold rounded-[10px] hover:bg-neutral-50 transition-colors flex items-center justify-center">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-[44px] px-[24px] bg-blue-600 hover:bg-blue-700 text-white font-body text-[14px] font-semibold rounded-[10px] transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Job'}
          </button>
        </div>

      </form>
    </div>
  )
}
