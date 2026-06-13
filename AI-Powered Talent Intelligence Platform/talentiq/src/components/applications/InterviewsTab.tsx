import { Application } from '@/types/domain.types'
import { Calendar, Video, Phone, Building2 } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { useDomainStore } from '@/store/domain.store'
import Link from 'next/link'

interface InterviewsTabProps {
  application: Application
}

export default function InterviewsTab({ application }: InterviewsTabProps) {
  const { interviews: allInterviews } = useDomainStore()
  const interviews = allInterviews.filter(i => i.candidateId === application.candidate.id)

  if (!interviews || interviews.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No interviews scheduled"
        description="Schedule the first interview with this candidate to get started."
        ctaLabel="Schedule Interview"
        ctaAction={() => {}}
      />
    )
  }

  return (
    <div className="p-[24px] flex flex-col gap-[16px]">
      <div className="flex justify-between items-center mb-[8px]">
        <h3 className="font-display text-[18px] font-semibold text-neutral-900">Interviews</h3>
        <button className="bg-primary-50 text-primary-700 hover:bg-primary-100 font-body text-[13px] font-medium px-[16px] py-[8px] rounded-md transition-colors">
          Schedule Interview
        </button>
      </div>

      {interviews.map(interview => {
        const isUpcoming = interview.status === 'scheduled'
        
        return (
          <div key={interview.id} className="bg-white border border-[#E5E7EB] rounded-lg p-[20px] flex items-center justify-between">
            <div className="flex gap-[20px] items-center">
              
              <div className="flex flex-col items-center justify-center w-[64px] h-[64px] bg-neutral-50 rounded-md border border-neutral-100 shrink-0">
                <span className="font-display text-[12px] font-bold text-neutral-500 uppercase tracking-wider">
                  {interview.date}
                </span>
                <span className="font-display text-[20px] font-bold text-neutral-900 leading-none mt-[2px]">
                  <Calendar size={20} className="text-neutral-400" />
                </span>
              </div>

              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-[12px]">
                  <h4 className="font-body text-[15px] font-semibold text-neutral-900">
                    {interview.time} ({interview.duration})
                  </h4>
                  <span className={`px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isUpcoming ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-[16px]">
                  <div className="flex items-center gap-[6px] text-[13px] text-neutral-500 font-body">
                    {interview.type === 'Video' && <Video size={14} />}
                    {interview.type === 'Phone' && <Phone size={14} />}
                    {interview.type === 'Onsite' && <Building2 size={14} />}
                    <span className="capitalize">{interview.type}</span>
                  </div>
                  
                  <div className="flex items-center gap-[6px] text-[13px] text-neutral-500 font-body">
                    <div className="flex -space-x-2">
                      <div className="w-[20px] h-[20px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold border border-white z-10">
                        {interview.interviewer.charAt(0)}
                      </div>
                    </div>
                    <span>
                      {interview.interviewer}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {isUpcoming ? (
                <Link 
                  href={`/meet/${interview.id}`}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[13px] font-medium px-[16px] py-[8px] rounded-md transition-colors"
                >
                  Start Meeting
                </Link>
              ) : (
                <button className="border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-body text-[13px] font-medium px-[16px] py-[8px] rounded-md transition-colors">
                  View Scorecard
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
