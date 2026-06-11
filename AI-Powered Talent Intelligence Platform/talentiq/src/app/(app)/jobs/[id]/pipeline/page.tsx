'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import JobStatusBadge from '@/components/jobs/JobStatusBadge'
import FilterBar, { FiltersState } from '@/components/kanban/FilterBar'
import KanbanBoard from '@/components/kanban/KanbanBoard'
import { useState } from 'react'

// Mock Applications Data
const mockApplications: any[] = [
  {
    id: 'a1',
    candidate: { name: 'Jennifer Park', email: 'jennifer@example.com' },
    job: { title: 'Senior Software Engineer' },
    currentStage: 'Screening',
    source: 'linkedin',
    aiScore: { score: 92, details: { technical: 95, experience: 90, education: 85, communication: 88 }, reasons: [], strengths: [], gaps: [] },
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    candidate: { name: 'David Chen', email: 'david@example.com' },
    job: { title: 'Senior Software Engineer' },
    currentStage: 'Screening',
    source: 'career-page',
    aiScore: { score: 88, details: { technical: 85, experience: 90, education: 80, communication: 90 }, reasons: [], strengths: [], gaps: [] },
    appliedAt: new Date().toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'a3',
    candidate: { name: 'Sarah Kim', email: 'sarah@example.com' },
    job: { title: 'Senior Software Engineer' },
    currentStage: 'Screening',
    source: 'referral',
    aiScore: { score: 65, details: { technical: 60, experience: 70, education: 60, communication: 70 }, reasons: [], strengths: [], gaps: [] },
    appliedAt: new Date().toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'a4',
    candidate: { name: 'Marcus Rodriguez', email: 'marcus@example.com' },
    job: { title: 'Senior Software Engineer' },
    currentStage: 'Interview',
    source: 'linkedin',
    aiScore: { score: 95, details: { technical: 98, experience: 95, education: 90, communication: 92 }, reasons: [], strengths: [], gaps: [] },
    appliedAt: new Date().toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'a5',
    candidate: { name: 'Alex Torres', email: 'alex@example.com' },
    job: { title: 'Senior Software Engineer' },
    currentStage: 'Interview',
    source: 'indeed',
    aiScore: { score: 82, details: { technical: 80, experience: 85, education: 80, communication: 85 }, reasons: [], strengths: [], gaps: [] },
    appliedAt: new Date().toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 'a6',
    candidate: { name: 'Michael Wong', email: 'michael@example.com' },
    job: { title: 'Senior Software Engineer' },
    currentStage: 'Offer',
    source: 'referral',
    aiScore: { score: 96, details: { technical: 98, experience: 95, education: 95, communication: 90 }, reasons: [], strengths: [], gaps: [] },
    appliedAt: new Date().toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  }
]

export default function JobPipelinePage() {
  const params = useParams()
  const jobId = params?.id as string

  const [filters, setFilters] = useState<FiltersState>({
    source: '',
    scoreRange: [0, 100],
    stages: [],
    search: ''
  })

  return (
    <div className="flex flex-col h-[calc(100vh-60px-32px)] -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-white">
      
      {/* Header Area */}
      <div className="px-[16px] md:px-[32px] py-[24px] border-b border-[#E5E7EB] shrink-0">
        <Link 
          href="/jobs"
          className="flex items-center gap-[6px] text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-[12px] w-fit"
        >
          <ArrowLeft size={14} /> Back to Jobs
        </Link>
        <div className="flex items-center gap-[16px]">
          <h1 className="font-display text-[24px] font-bold text-neutral-900 tracking-tight">
            Senior Software Engineer
          </h1>
          <JobStatusBadge status="active" />
        </div>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Kanban Board Area */}
      <KanbanBoard applications={mockApplications} jobId={jobId} />
      
    </div>
  )
}
