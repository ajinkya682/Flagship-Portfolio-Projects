'use client'

import { Search, Plus } from 'lucide-react'
import Link from 'next/link'
import { useJobs } from '@/hooks/useJobs'
import JobList from '@/components/jobs/JobList'

export default function JobsPage() {
  const { data: jobsResponse, isLoading } = useJobs()
  const jobs = Array.isArray(jobsResponse) ? jobsResponse : (jobsResponse as any)?.data ?? []

  return (
    <div className="flex flex-col max-w-[1200px] mx-auto w-full h-full">
      <div className="flex justify-between items-center mb-[24px]">
        <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">
          Jobs
        </h1>
        <Link 
          href="/jobs/new"
          className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors flex items-center gap-[6px] shadow-sm"
        >
          <Plus size={16} />
          Create Job
        </Link>
      </div>

      <div className="flex items-center gap-[12px] mb-[24px] bg-white p-[16px] rounded-lg border border-[#E5E7EB]">
        <div className="relative flex-grow max-w-[400px]">
          <Search size={16} className="absolute left-[12px] top-[10px] text-neutral-400" />
          <input
            type="text"
            placeholder="Search jobs..."
            className="w-full h-[36px] pl-[36px] pr-[12px] bg-neutral-50 hover:bg-neutral-100 border border-transparent focus:border-primary-300 focus:bg-white rounded-md text-[14px] text-neutral-900 placeholder:text-neutral-500 focus:outline-none transition-colors"
          />
        </div>
        
        <select className="h-[36px] w-[140px] rounded-md border border-neutral-200 px-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
        
        <select className="h-[36px] w-[160px] rounded-md border border-neutral-200 px-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white">
          <option value="">All Departments</option>
          <option value="engineering">Engineering</option>
          <option value="product">Product</option>
          <option value="design">Design</option>
          <option value="sales">Sales</option>
        </select>
      </div>

      <JobList jobs={jobs} isLoading={isLoading} />
    </div>
  )
}
