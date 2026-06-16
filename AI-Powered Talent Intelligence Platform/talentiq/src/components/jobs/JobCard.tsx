'use client'

import Link from 'next/link'
import { MapPin, Users, Calendar, Sparkles, MoreHorizontal, ArrowRight, TrendingUp, Link as LinkIcon, CheckCircle2, Play, StopCircle, Share } from 'lucide-react'
import JobStatusBadge from './JobStatusBadge'
import { useState } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'
import { AlertCircle } from 'lucide-react'
import ShareJobModal from './ShareJobModal'
import { useDomainStore } from '@/store/domain.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'
import { useAuthStore } from '@/store/auth.store'
import { Job } from '@/types/domain.types'

const deptColors: Record<string, { bar: string; badge: string; text: string }> = {
  Engineering: { bar: 'from-blue-500 to-indigo-600', badge: 'bg-blue-50 text-blue-700', text: 'text-blue-600' },
  Product: { bar: 'from-purple-500 to-violet-600', badge: 'bg-purple-50 text-purple-700', text: 'text-purple-600' },
  Design: { bar: 'from-pink-500 to-rose-500', badge: 'bg-pink-50 text-pink-700', text: 'text-pink-600' },
  Sales: { bar: 'from-amber-400 to-orange-500', badge: 'bg-amber-50 text-amber-700', text: 'text-amber-600' },
  Data: { bar: 'from-teal-500 to-cyan-600', badge: 'bg-teal-50 text-teal-700', text: 'text-teal-600' },
  Marketing: { bar: 'from-fuchsia-500 to-pink-500', badge: 'bg-fuchsia-50 text-fuchsia-700', text: 'text-fuchsia-600' },
  default: { bar: 'from-neutral-400 to-neutral-500', badge: 'bg-neutral-100 text-neutral-600', text: 'text-neutral-600' },
}

const AVATAR_URLS = [
  'https://randomuser.me/api/portraits/women/65.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://randomuser.me/api/portraits/women/44.jpg',
  'https://randomuser.me/api/portraits/men/46.jpg',
]

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const { user } = useAuthStore()
  const { settings } = useDomainStore()
  const { candidates } = useCandidatesStore()
  const { updateJob } = useJobsStore()
  const [copied, setCopied] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [statusToConfirm, setStatusToConfirm] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const jobCandidates = candidates.filter(c => c.jobId === job.id)
  
  const actualCompanySlug = user?.company?.slug || settings.companySlug
  
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsShareModalOpen(true)
  }

  const handleStatusChange = (status: string) => {
    if (status === 'closed' || status === 'draft' || status === 'paused') {
      setStatusToConfirm(status)
    } else {
      executeStatusUpdate(status)
    }
  }

  const executeStatusUpdate = async (status: string) => {
    setIsUpdating(true)
    try {
      const res = await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      if (res.ok) {
        updateJob(job.id, { status: status as any })
      }
    } catch (e) {
      console.error('Failed to update job status', e)
    } finally {
      setIsUpdating(false)
      setStatusToConfirm(null)
    }
  }
  
  const daysOpen = Math.floor((new Date().getTime() - new Date(job.publishedAt || new Date()).getTime()) / (1000 * 3600 * 24))
  const dept = deptColors[job.department] ?? deptColors.default
  
  const scoredCandidates = jobCandidates.filter(c => c.aiScore > 0)
  const avgScore = scoredCandidates.length > 0 ? Math.round(scoredCandidates.reduce((acc, c) => acc + c.aiScore, 0) / scoredCandidates.length) : '-'
  const applicantCount = jobCandidates.length

  return (
    <div className="relative bg-white rounded-[16px] border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-[3px] transition-all duration-200 overflow-hidden flex flex-col group">
      {/* Gradient top bar */}
      <div className={`h-[4px] w-full bg-gradient-to-r ${dept.bar}`} />

      <div className="flex flex-col flex-1 p-[20px]">
        {/* Title row */}
        <div className="flex items-start justify-between gap-[12px] mb-[12px]">
          <div>
            <h4 className="font-display text-[16px] font-bold text-neutral-900 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
              {job.title}
            </h4>
            <div className="flex items-center gap-[6px] mt-[6px]">
              <span className={`text-[11px] font-semibold px-[7px] py-[2px] rounded-full ${dept.badge}`}>
                {job.department}
              </span>
              <span className="text-[11px] text-neutral-400">{job.employmentType}</span>
            </div>
          </div>
          <div className="flex items-center gap-[6px] shrink-0">
            {job.status === 'active' && (
              <button 
                onClick={handleCopyLink}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-[4px] px-[8px] py-[3px] bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-600 rounded-[6px] text-[11px] font-medium"
                title="Copy public link"
              >
                {copied ? <CheckCircle2 size={12} className="text-emerald-500" /> : <LinkIcon size={12} />}
                {copied ? 'Copied' : 'Share'}
              </button>
            )}
            <JobStatusBadge status={job.status} />
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-neutral-700 p-[2px] rounded focus:outline-none focus:ring-2 focus:ring-blue-100">
                  <MoreHorizontal size={15} />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" sideOffset={5} className="z-50 min-w-[160px] bg-white rounded-lg shadow-lg border border-neutral-100 p-1 font-body animate-in fade-in slide-in-from-top-2">
                  <DropdownMenu.Item 
                    className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-neutral-600 rounded-md hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer focus:bg-neutral-50 focus:outline-none"
                    onClick={handleCopyLink}
                  >
                    <Share size={14} className="text-blue-500" /> Share Link
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="h-[1px] bg-neutral-100 my-1" />
                  
                  {job.status !== 'published' && (
                    <DropdownMenu.Item 
                      className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-emerald-600 rounded-md hover:bg-emerald-50 cursor-pointer focus:bg-emerald-50 focus:outline-none"
                      onClick={() => handleStatusChange('published')}
                    >
                      <Play size={14} /> Publish Job
                    </DropdownMenu.Item>
                  )}
                  {job.status === 'published' && (
                    <DropdownMenu.Item 
                      className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-amber-600 rounded-md hover:bg-amber-50 cursor-pointer focus:bg-amber-50 focus:outline-none"
                      onClick={() => handleStatusChange('closed')}
                    >
                      <StopCircle size={14} /> Close Job
                    </DropdownMenu.Item>
                  )}
                  {job.status !== 'draft' && (
                    <DropdownMenu.Item 
                      className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-neutral-600 rounded-md hover:bg-neutral-50 hover:text-neutral-900 cursor-pointer focus:bg-neutral-50 focus:outline-none"
                      onClick={() => handleStatusChange('draft')}
                    >
                      <Sparkles size={14} className="text-neutral-400" /> Move to Draft
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-[4px] text-neutral-500 mb-[14px]">
          <MapPin size={12} className="text-neutral-400 shrink-0" />
          <span className="font-body text-[12px] truncate">{job.location}</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-[16px] py-[12px] border-t border-b border-neutral-50 mb-[14px]">
          {/* Applicants with avatar stack */}
          <div className="flex items-center gap-[8px]">
            <div className="flex -space-x-[6px]">
              {AVATAR_URLS.slice(0, 3).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-[22px] h-[22px] rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <div>
              <p className="font-body text-[13px] font-bold text-neutral-900">{applicantCount}</p>
              <p className="font-body text-[10px] text-neutral-400">applicants</p>
            </div>
          </div>

          <div className="h-[28px] w-[1px] bg-neutral-100" />

          {/* Days open */}
          <div className="flex items-center gap-[6px]">
            <Calendar size={13} className="text-neutral-400" />
            <div>
              <p className="font-body text-[13px] font-bold text-neutral-900">{daysOpen}d</p>
              <p className="font-body text-[10px] text-neutral-400">open</p>
            </div>
          </div>

          <div className="h-[28px] w-[1px] bg-neutral-100" />

          {/* AI Score */}
          <div className="flex items-center gap-[6px]">
            <Sparkles size={13} className="text-accent-500" />
            <div>
              <p className="font-body text-[13px] font-bold text-accent-700">{avgScore}</p>
              <p className="font-body text-[10px] text-neutral-400">avg score</p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between mt-auto">
          <Link
            href={`/jobs/${job.id}/pipeline`}
            className="flex items-center gap-[4px] text-[12px] font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-[10px] py-[5px] rounded-[7px] transition-colors"
          >
            Pipeline <ArrowRight size={11} />
          </Link>

          <div className="flex items-center gap-[8px]">
            <Link
              href={`/jobs/${job.id}`}
              className="text-[12px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>

      {isShareModalOpen && (
        <ShareJobModal
          job={job}
          companySlug={actualCompanySlug}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Confirmation Modal */}
      <Dialog.Root open={!!statusToConfirm} onOpenChange={(open) => !open && setStatusToConfirm(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-xl w-[90vw] max-w-[400px] flex flex-col z-50 overflow-hidden p-[24px]">
            <div className="flex items-start gap-[16px] mb-[20px]">
              <div className="w-[40px] h-[40px] rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-amber-600" />
              </div>
              <div>
                <Dialog.Title className="font-display text-[18px] font-bold text-neutral-900 mb-[4px]">
                  Confirm Status Change
                </Dialog.Title>
                <Dialog.Description className="font-body text-[14px] text-neutral-600">
                  {statusToConfirm === 'closed' && "Are you sure you want to close this job? The public listing will show as closed and no new applications will be accepted."}
                  {(statusToConfirm === 'draft' || statusToConfirm === 'paused') && "Are you sure you want to pause this job? The public listing will show as temporarily stopped."}
                </Dialog.Description>
              </div>
            </div>
            
            <div className="flex items-center justify-end gap-[12px] pt-[16px] border-t border-neutral-100">
              <Dialog.Close asChild>
                <button 
                  className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:bg-neutral-50 rounded-md transition-colors disabled:opacity-50"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button 
                onClick={() => executeStatusUpdate(statusToConfirm as string)}
                disabled={isUpdating}
                className="px-[16px] py-[8px] text-[14px] font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-md transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[100px]"
              >
                {isUpdating ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}
