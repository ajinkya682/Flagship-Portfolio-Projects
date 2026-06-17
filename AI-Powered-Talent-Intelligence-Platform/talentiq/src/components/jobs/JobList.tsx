'use client'

import { Briefcase } from 'lucide-react'
import { Job } from '@/types/domain.types'
import JobCard from './JobCard'
import { SkeletonBlock } from '@/components/shared/SkeletonBlock'
import { EmptyState } from '@/components/shared/EmptyState'

interface JobListProps {
  jobs: Job[]
  isLoading: boolean
}

export default function JobList({ jobs, isLoading }: JobListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-[24px] border border-neutral-100 h-[220px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-[16px]">
                <SkeletonBlock className="w-[60%] h-[24px]" />
                <SkeletonBlock className="w-[60px] h-[20px] rounded-full" />
              </div>
              <div className="flex gap-[12px]">
                <SkeletonBlock className="w-[80px] h-[20px]" />
                <SkeletonBlock className="w-[100px] h-[20px]" />
              </div>
            </div>
            <div className="border-t border-neutral-100 pt-[16px]">
              <div className="flex justify-between mb-[16px]">
                <SkeletonBlock className="w-[120px] h-[16px]" />
                <SkeletonBlock className="w-[40px] h-[16px]" />
              </div>
              <div className="flex justify-between">
                <SkeletonBlock className="w-[80px] h-[16px]" />
                <SkeletonBlock className="w-[40px] h-[16px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!jobs || jobs.length === 0) {
    return (
      <EmptyState 
        icon={Briefcase}
        title="No jobs posted yet"
        description="Create your first job in under 2 minutes."
        ctaLabel="Create First Job"
        ctaAction={() => window.location.href = '/jobs/new'}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[24px]">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  )
}
