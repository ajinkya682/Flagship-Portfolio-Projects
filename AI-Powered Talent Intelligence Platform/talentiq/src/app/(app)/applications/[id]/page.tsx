'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ApplicationDetail from '@/components/applications/ApplicationDetail'
import { Application } from '@/types/domain.types'

// Mock Data Single App
const mockApp: Application = {
  id: 'app_1',
  jobId: 'job_1',
  job: { title: 'Senior Software Engineer', department: 'Engineering' } as any,
  candidate: { 
    name: 'Jennifer Park', 
    email: 'jennifer@example.com', 
    phone: '+1 (555) 123-4567',
    linkedinUrl: 'https://linkedin.com/in/jenniferpark',
    resumeUrl: 'https://example.com/resume.pdf',
    extractedSkills: ['React', 'TypeScript', 'Node.js', 'System Design'],
    extractedCompanies: ['Google', 'Stripe'],
    extractedEducation: ['BS Computer Science, Stanford'],
    avatar: undefined 
  } as any,
  stage: 'Screening',
  aiScore: 92,
  appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  source: 'linkedin',
  recruiterNotes: ['Great initial impression'],
  tags: ['react', 'urgent'],
  assignedTo: { id: 'u1', name: 'Sarah Recruiter' } as any,
  daysInStage: 2
}

export default function ApplicationDetailPage() {
  const params = useParams()
  // In real app, fetch application by params?.id
  const application = mockApp

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-screen">
      
      {/* Small Header */}
      <div className="px-[16px] md:px-[32px] py-[16px] border-b border-[#E5E7EB] bg-white shrink-0 flex items-center gap-[12px]">
        <Link 
          href="/applications"
          className="text-neutral-500 hover:text-neutral-900 transition-colors p-[4px] rounded-md hover:bg-neutral-100"
        >
          <ArrowLeft size={18} />
        </Link>
        <span className="font-body text-[14px] text-neutral-500">Back to Applications</span>
      </div>

      <div className="p-[16px] md:p-[32px]">
        <ApplicationDetail application={application} />
      </div>

    </div>
  )
}
