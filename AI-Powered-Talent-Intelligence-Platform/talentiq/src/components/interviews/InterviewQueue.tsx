'use client'

import { Interview } from '@/types/domain.types'

interface InterviewQueueProps {
  title: string
  count: number
  interviews: Interview[]
  onActionClick: (interview: Interview) => void
}

export default function InterviewQueue({ title, count, interviews, onActionClick }: InterviewQueueProps) {
  return (
    <div className="flex flex-col gap-[16px] font-body bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[20px]">
      
      <div className="flex items-center justify-between border-b border-neutral-100 pb-[16px]">
        <h4 className="text-[16px] font-semibold text-neutral-900">{title}</h4>
        <span className="bg-neutral-100 text-neutral-600 px-[10px] py-[2px] rounded-full text-[12px] font-bold">
          {count}
        </span>
      </div>

      <div className="flex flex-col gap-[12px] overflow-y-auto max-h-[600px] thin-scrollbar">
        {interviews.length === 0 ? (
          <div className="text-center py-[24px] text-neutral-400 text-[13px] italic">No interviews found.</div>
        ) : (
          interviews.map(interview => {
            const isCompleted = interview.status === 'completed'
            
            return (
              <div key={interview.id} className="flex items-center gap-[12px] h-[56px] hover:bg-neutral-50 p-[8px] rounded-md transition-colors group cursor-pointer border border-transparent hover:border-neutral-200">
                <div className="w-[32px] h-[32px] rounded-full bg-neutral-200 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-100">
                  {interview.candidate?.avatar ? (
                    <img src={interview.candidate.avatar} alt="Candidate" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[12px] font-bold text-neutral-500">
                      {interview.candidate?.name?.charAt(0) || 'C'}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[14px] font-semibold text-neutral-900 truncate">
                    {interview.candidate?.name || 'Unknown Candidate'}
                  </span>
                  <span className="text-[12px] text-neutral-500 truncate">
                    {interview.job?.title || 'Role'}
                  </span>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[12px] text-neutral-900 font-medium">
                    {new Date(interview.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                  <div className="flex -space-x-1 mt-[2px]">
                    {interview.interviewers.slice(0, 3).map(i => (
                      <div key={i.id} className="w-[16px] h-[16px] rounded-full bg-primary-100 border border-white flex items-center justify-center text-[8px] font-bold text-primary-700">
                        {i.name.charAt(0)}
                      </div>
                    ))}
                  </div>
                </div>

                {isCompleted && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onActionClick(interview); }}
                    className="ml-[8px] opacity-0 group-hover:opacity-100 bg-accent-50 text-accent-700 hover:bg-accent-100 px-[12px] py-[6px] rounded-md text-[11px] font-bold uppercase tracking-wider transition-all"
                  >
                    Scorecard
                  </button>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
