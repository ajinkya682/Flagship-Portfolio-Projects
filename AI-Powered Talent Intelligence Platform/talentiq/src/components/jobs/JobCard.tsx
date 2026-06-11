'use client'

import Link from 'next/link'
import { MapPin, Users, Calendar, Sparkles, MoreHorizontal } from 'lucide-react'
import { Job } from '@/types/domain.types'
import JobStatusBadge from './JobStatusBadge'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const daysOpen = Math.floor((new Date().getTime() - new Date(job.createdAt).getTime()) / (1000 * 3600 * 24))

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-150 p-[24px] border border-neutral-100 flex flex-col justify-between h-full group">
      
      <div>
        <div className="flex justify-between items-start gap-[16px]">
          <h4 className="font-display text-[18px] font-semibold text-neutral-900 leading-snug line-clamp-2">
            {job.title}
          </h4>
          <JobStatusBadge status={job.status} />
        </div>

        <div className="flex flex-wrap gap-[12px] mt-[12px] items-center">
          <span className="bg-neutral-100 text-neutral-600 px-[8px] py-[2px] rounded-md font-body text-[12px] font-medium">
            {job.department}
          </span>
          <div className="flex items-center gap-[4px] text-neutral-500 font-body text-[13px]">
            <MapPin size={12} />
            <span>{job.location}</span>
          </div>
          <span className="text-neutral-500 font-body text-[13px] relative before:content-['•'] before:absolute before:-left-[8px] before:text-neutral-300 ml-[4px]">
            {job.employmentType}
          </span>
        </div>
      </div>

      <div className="mt-[16px] pt-[16px] border-t border-neutral-100">
        <div className="flex items-center gap-[16px] mb-[16px]">
          <div className="flex items-center gap-[6px]">
            <Users size={14} className="text-neutral-400" />
            <span className="font-body text-[14px] font-semibold text-neutral-900">
              12
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <Calendar size={14} className="text-neutral-400" />
            <span className="font-body text-[14px] text-neutral-500">
              {daysOpen} {daysOpen === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div className="flex items-center gap-[6px] ml-auto">
            <Sparkles size={14} className="text-accent-500" />
            <span className="font-body text-[14px] font-semibold text-accent-600">
              82
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link 
            href={`/jobs/${job.id}/pipeline`}
            className="font-body text-[13px] font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            View Pipeline
          </Link>
          
          <div className="flex items-center gap-[8px]">
            <Link 
              href={`/jobs/${job.id}`}
              className="font-body text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              Edit
            </Link>
            <button className="text-neutral-400 hover:text-neutral-600 p-[4px] rounded-md transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}
