'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import JobStatusBadge from '@/components/jobs/JobStatusBadge'
import FilterBar, { type FiltersState } from '@/components/kanban/FilterBar'
import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'
import AddCandidateModal from '@/components/pipeline/AddCandidateModal'

const KanbanBoard = dynamic(() => import('@/components/kanban/KanbanBoard'), { ssr: false })

export default function JobPipelinePage() {
  const params = useParams()
  const jobId = params?.id as string

  const { jobs } = useJobsStore()
  const { candidates, moveCandidateStage } = useCandidatesStore()

  const job = jobs.find(j => j.id === jobId)

  const [filters, setFilters] = useState<FiltersState>({
    source: '',
    scoreRange: [0, 100],
    stages: [],
    search: ''
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addModalStage, setAddModalStage] = useState('Applied')

  const handleAddCandidate = (stageName: string) => {
    setAddModalStage(stageName)
    setIsAddModalOpen(true)
  }

  // Map store candidates to the Application format expected by KanbanBoard
  const jobApplications = useMemo(() => {
    if (!job) return []
    return candidates
      .filter(c => c.jobId === jobId)
      // Apply filters
      .filter(c => {
        if (filters.source && c.source !== filters.source) return false
        if (c.aiScore < filters.scoreRange[0] || c.aiScore > filters.scoreRange[1]) return false
        if (filters.search && !c.name.toLowerCase().includes(filters.search.toLowerCase())) return false
        return true
      })
      .map(c => ({
        id: c.id,
        jobId: c.jobId,
        job: job,
        candidate: c,
        stage: c.stage,
        aiScore: c.aiScore,
        appliedAt: c.appliedAt,
        source: c.source,
        recruiterNotes: [],
        tags: c.tags || [],
        assignedTo: undefined,
        daysInStage: c.daysInStage,
        timeline: c.timeline
      }))
  }, [candidates, jobId, filters, job])

  if (!job) {
    return (
      <div className="flex flex-col h-[calc(100vh-60px-32px)] items-center justify-center bg-white">
        <p className="text-neutral-500">Job not found.</p>
        <Link href="/jobs" className="mt-4 text-primary-600 hover:underline">Return to Jobs</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px-32px)] -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-white">
      
      {/* Header Area */}
      <div className="px-[16px] md:px-[32px] py-[24px] border-b border-[#E5E7EB] shrink-0">
        <Link 
          href={`/jobs/${jobId}`}
          className="flex items-center gap-[6px] text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-[12px] w-fit"
        >
          <ArrowLeft size={14} /> Back to Job Details
        </Link>
        <div className="flex items-center gap-[16px]">
          <h1 className="font-display text-[24px] font-bold text-neutral-900 tracking-tight">
            {job.title}
          </h1>
          <JobStatusBadge status={job.status as any} />
        </div>
      </div>

      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Kanban Board Area */}
      <KanbanBoard 
        applications={jobApplications as any} 
        jobId={jobId} 
        onStageChange={(appId, newStage) => moveCandidateStage(appId, newStage)}
        onAddCandidate={handleAddCandidate}
        filteredStages={filters.stages}
      />

      <AddCandidateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialJobId={jobId}
        initialStage={addModalStage}
      />
      
    </div>
  )
}
