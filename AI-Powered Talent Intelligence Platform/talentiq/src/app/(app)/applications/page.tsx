'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import ApplicationTable from '@/components/applications/ApplicationTable'
import FilterBar, { FiltersState } from '@/components/kanban/FilterBar'
import { Application } from '@/types/domain.types'

// Mock Applications
const mockApplications: Application[] = [
  {
    id: 'app_1',
    jobId: 'job_1',
    job: { title: 'Senior Software Engineer' } as any,
    candidate: { name: 'Jennifer Park', email: 'jennifer@example.com', avatar: undefined } as any,
    stage: 'Screening',
    aiScore: 92,
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    source: 'linkedin',
    recruiterNotes: [],
    tags: ['react', 'urgent'],
    assignedTo: { id: 'u1', name: 'Sarah Recruiter' } as any,
    daysInStage: 2
  },
  {
    id: 'app_2',
    jobId: 'job_2',
    job: { title: 'Product Manager' } as any,
    candidate: { name: 'David Chen', email: 'david@example.com', avatar: undefined } as any,
    stage: 'Interview',
    aiScore: 88,
    appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    source: 'referral',
    recruiterNotes: [],
    tags: [],
    assignedTo: { id: 'u1', name: 'Sarah Recruiter' } as any,
    daysInStage: 1
  },
  {
    id: 'app_3',
    jobId: 'job_1',
    job: { title: 'Senior Software Engineer' } as any,
    candidate: { name: 'Sarah Kim', email: 'sarah.kim@example.com', avatar: undefined } as any,
    stage: 'Offer',
    aiScore: 95,
    appliedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    source: 'indeed',
    recruiterNotes: ['Strong technical skills'],
    tags: ['top-tier'],
    assignedTo: { id: 'u2', name: 'Alex Manager' } as any,
    daysInStage: 3
  }
]

export default function ApplicationsPage() {
  const [filters, setFilters] = useState<FiltersState>({
    source: '',
    scoreRange: [0, 100],
    stages: [],
    search: ''
  })

  // Simulated filter logic
  const filteredApps = mockApplications.filter(app => {
    if (filters.source && app.source !== filters.source) return false
    if (filters.stages.length > 0 && !filters.stages.includes(app.stage)) return false
    const score = typeof app.aiScore === 'number' ? app.aiScore : 0
    if (score < filters.scoreRange[0] || score > filters.scoreRange[1]) return false
    if (filters.search && !app.candidate.name.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50">
      
      {/* Header Area */}
      <div className="px-[16px] md:px-[32px] py-[24px] border-b border-[#E5E7EB] bg-white shrink-0">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">
          Applications
        </h1>
        <p className="font-body text-[14px] text-neutral-500 mt-[4px]">
          Manage and review all candidates across open roles.
        </p>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Table Area */}
      <div className="p-[16px] md:p-[32px] flex-grow overflow-auto">
        <ApplicationTable applications={filteredApps} />
      </div>

    </div>
  )
}
