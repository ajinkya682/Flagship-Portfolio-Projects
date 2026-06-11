'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Users, Briefcase, Clock, Sparkles, Settings, BarChart2, GitMerge } from 'lucide-react'
import JobStatusBadge from '@/components/jobs/JobStatusBadge'

// Mock job data
const MOCK_JOB = {
  id: 'job_001',
  title: 'Senior Software Engineer',
  department: 'Engineering',
  location: 'San Francisco, CA / Remote',
  employmentType: 'Full-time',
  status: 'active' as const,
  createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  description: 'We are looking for a Senior Software Engineer to join our engineering team and help build the future of talent intelligence. You will work on complex distributed systems, mentor junior engineers, and drive technical decisions.',
  requirements: ['5+ years of software engineering experience', 'Proficiency in TypeScript and Node.js', 'Experience with React and modern frontend tools', 'Strong understanding of system design'],
  applicantCount: 47,
  avgScore: 82,
}

const TABS = [
  { id: 'overview', label: 'Overview', icon: Briefcase },
  { id: 'pipeline', label: 'Pipeline', icon: GitMerge },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params?.id as string
  const [activeTab, setActiveTab] = useState('overview')

  const daysOpen = Math.floor((new Date().getTime() - new Date(MOCK_JOB.createdAt).getTime()) / (1000 * 3600 * 24))

  return (
    <div className="flex flex-col max-w-[1200px] mx-auto w-full">
      
      {/* Back link */}
      <Link 
        href="/jobs"
        className="flex items-center gap-[6px] text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-[20px] w-fit"
      >
        <ArrowLeft size={14} /> Back to Jobs
      </Link>

      {/* Job Header */}
      <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-[24px] mb-[24px]">
        <div className="flex items-start justify-between gap-[16px] mb-[16px]">
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">
            {MOCK_JOB.title}
          </h1>
          <JobStatusBadge status={MOCK_JOB.status} />
        </div>

        <div className="flex flex-wrap gap-[16px] mb-[20px]">
          <div className="flex items-center gap-[6px] text-neutral-600 font-body text-[14px]">
            <Briefcase size={14} className="text-neutral-400" />
            {MOCK_JOB.department}
          </div>
          <div className="flex items-center gap-[6px] text-neutral-600 font-body text-[14px]">
            <MapPin size={14} className="text-neutral-400" />
            {MOCK_JOB.location}
          </div>
          <div className="flex items-center gap-[6px] text-neutral-600 font-body text-[14px]">
            <Clock size={14} className="text-neutral-400" />
            {MOCK_JOB.employmentType}
          </div>
        </div>

        <div className="flex gap-[24px] pt-[16px] border-t border-neutral-100">
          <div className="text-center">
            <div className="flex items-center gap-[6px] justify-center">
              <Users size={16} className="text-primary-500" />
              <span className="font-body text-[22px] font-bold text-neutral-900">{MOCK_JOB.applicantCount}</span>
            </div>
            <span className="font-body text-[12px] text-neutral-500">Applicants</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-[6px] justify-center">
              <Clock size={16} className="text-neutral-400" />
              <span className="font-body text-[22px] font-bold text-neutral-900">{daysOpen}</span>
            </div>
            <span className="font-body text-[12px] text-neutral-500">Days Open</span>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-[6px] justify-center">
              <Sparkles size={16} className="text-accent-500" />
              <span className="font-body text-[22px] font-bold text-neutral-900">{MOCK_JOB.avgScore}</span>
            </div>
            <span className="font-body text-[12px] text-neutral-500">Avg AI Score</span>
          </div>
          
          <div className="ml-auto flex gap-[8px]">
            <Link 
              href={`/jobs/${jobId}/pipeline`}
              className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors shadow-sm"
            >
              View Pipeline
            </Link>
            <button className="bg-white border border-[#E5E7EB] hover:bg-neutral-50 text-neutral-700 font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors">
              Edit Job
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] mb-[24px] bg-white rounded-t-lg px-[24px]">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-[6px] font-body text-[14px] font-medium px-[16px] py-[14px] border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-200'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px]">
          <div className="lg:col-span-2 bg-white rounded-xl border border-neutral-100 shadow-sm p-[24px] flex flex-col gap-[24px]">
            <div>
              <h2 className="font-display text-[17px] font-semibold text-neutral-900 mb-[12px]">Job Description</h2>
              <p className="font-body text-[14px] text-neutral-700 leading-relaxed">
                {MOCK_JOB.description}
              </p>
            </div>

            <div>
              <h2 className="font-display text-[17px] font-semibold text-neutral-900 mb-[12px]">Requirements</h2>
              <ul className="flex flex-col gap-[8px]">
                {MOCK_JOB.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-[8px] font-body text-[14px] text-neutral-700">
                    <span className="w-[6px] h-[6px] rounded-full bg-primary-400 mt-[6px] shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-[16px]">
            <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-[20px]">
              <h3 className="font-body text-[14px] font-semibold text-neutral-900 mb-[12px]">Quick Stats</h3>
              <div className="flex flex-col gap-[12px]">
                <div className="flex justify-between items-center">
                  <span className="font-body text-[13px] text-neutral-500">In Screening</span>
                  <span className="font-body text-[13px] font-semibold text-neutral-900">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-[13px] text-neutral-500">In Interview</span>
                  <span className="font-body text-[13px] font-semibold text-neutral-900">7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-[13px] text-neutral-500">Offers Sent</span>
                  <span className="font-body text-[13px] font-semibold text-neutral-900">2</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-body text-[13px] text-neutral-500">Hired</span>
                  <span className="font-body text-[13px] font-semibold text-neutral-900">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-[24px] flex flex-col items-center gap-[16px]">
          <p className="font-body text-[14px] text-neutral-500">View the full pipeline board for this job.</p>
          <Link 
            href={`/jobs/${jobId}/pipeline`}
            className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[20px] py-[10px] rounded-md transition-colors"
          >
            Open Pipeline Board
          </Link>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-[24px]">
          <p className="font-body text-[14px] text-neutral-500 text-center py-[48px]">
            Analytics dashboard coming soon for this role.
          </p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-[24px]">
          <h3 className="font-body text-[16px] font-semibold text-neutral-900 mb-[16px]">Job Settings</h3>
          <div className="flex flex-col gap-[16px] max-w-[480px]">
            <div className="flex flex-col gap-[6px]">
              <label className="font-body text-[13px] font-medium text-neutral-700">Status</label>
              <select className="h-[40px] rounded-md border border-neutral-200 px-[12px] font-body text-[14px] focus:outline-none focus:border-primary-500 bg-white">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors w-fit">
              Save Changes
            </button>
            <div className="h-[1px] bg-neutral-100 mt-[8px]" />
            <button className="text-[#DC2626] font-body text-[13px] font-medium hover:bg-red-50 px-[12px] py-[8px] rounded-md transition-colors w-fit">
              Close This Job
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
