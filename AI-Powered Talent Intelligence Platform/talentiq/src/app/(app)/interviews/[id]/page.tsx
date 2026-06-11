'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Video } from 'lucide-react'
import ScorecardForm from '@/components/interviews/ScorecardForm'
import ScorecardSummary from '@/components/interviews/ScorecardSummary'

export default function InterviewDetailPage() {
  const params = useParams()
  // Mock data depending on completed or pending
  const isCompleted = false

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50 min-h-screen">
      
      <div className="px-[16px] md:px-[32px] py-[16px] border-b border-[#E5E7EB] bg-white shrink-0 flex items-center gap-[12px]">
        <Link href="/interviews" className="text-neutral-500 hover:text-neutral-900 transition-colors p-[4px] rounded-md hover:bg-neutral-100">
          <ArrowLeft size={18} />
        </Link>
        <span className="font-body text-[14px] text-neutral-500">Back to Schedule</span>
      </div>

      <div className="p-[16px] md:p-[32px] max-w-[800px] mx-auto w-full">
        
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[32px] mb-[24px]">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-[8px]">
              <h1 className="font-display text-[28px] font-bold text-neutral-900">Technical Screen</h1>
              <span className="font-body text-[15px] font-medium text-neutral-600">Candidate: Jennifer Park</span>
            </div>
            <span className={`px-[12px] py-[4px] rounded-full text-[12px] font-bold uppercase tracking-wider ${isCompleted ? 'bg-neutral-100 text-neutral-600' : 'bg-accent-100 text-accent-700'}`}>
              {isCompleted ? 'Completed' : 'Pending Scorecard'}
            </span>
          </div>

          <div className="flex gap-[24px] mt-[24px] pt-[24px] border-t border-neutral-100">
            <div className="flex items-center gap-[8px] text-[14px] text-neutral-600 font-body">
              <Calendar size={16} /> Today at 10:00 AM
            </div>
            <div className="flex items-center gap-[8px] text-[14px] text-neutral-600 font-body">
              <Video size={16} /> Zoom Meeting
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[32px]">
          <h2 className="font-display text-[20px] font-semibold text-neutral-900 mb-[24px]">
            {isCompleted ? 'Scorecard Summary' : 'Complete Scorecard'}
          </h2>

          {isCompleted ? (
            <ScorecardSummary scorecard={{
              id: '1', interviewId: '1', interviewer: { id: '1', name: 'Me' } as any,
              overallRating: 'yes', criteria: [], notes: 'Good interview.', submittedAt: new Date().toISOString()
            }} />
          ) : (
            <div className="flex flex-col gap-[32px]">
              <ScorecardForm />
              <div className="flex justify-end pt-[24px] border-t border-neutral-100">
                <button className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[24px] py-[10px] rounded-md transition-colors shadow-sm">
                  Submit Final Scorecard
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
