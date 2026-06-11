import { Application, Interview } from '@/types/domain.types'
import { Calendar, Video, Phone, Building2 } from 'lucide-react'
import { EmptyState } from '@/components/shared/EmptyState'
import { formatDate } from '@/lib/utils'

interface InterviewsTabProps {
  application: Application
}

// Mock interviews for demonstration
const mockInterviews: Interview[] = [
  {
    id: 'int_1',
    applicationId: 'app_1',
    candidate: {} as any,
    job: {} as any,
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    duration: 60,
    locationType: 'video',
    meetingLink: 'https://zoom.us/j/123456789',
    interviewers: [
      { id: 'u1', name: 'Alex Manager', avatar: undefined } as any,
    ],
    status: 'scheduled',
    scorecards: []
  },
  {
    id: 'int_2',
    applicationId: 'app_1',
    candidate: {} as any,
    job: {} as any,
    scheduledAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    duration: 30,
    locationType: 'phone',
    meetingLink: undefined,
    interviewers: [
      { id: 'u2', name: 'Sarah Recruiter', avatar: undefined } as any,
    ],
    status: 'completed',
    scorecards: []
  }
]

export default function InterviewsTab({ application }: InterviewsTabProps) {
  const interviews = mockInterviews // Use real ones if available

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
                  {new Date(interview.scheduledAt).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="font-display text-[24px] font-bold text-neutral-900 leading-none mt-[2px]">
                  {new Date(interview.scheduledAt).getDate()}
                </span>
              </div>

              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center gap-[12px]">
                  <h4 className="font-body text-[15px] font-semibold text-neutral-900">
                    {new Date(interview.scheduledAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} ({interview.duration}m)
                  </h4>
                  <span className={`px-[8px] py-[2px] rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    isUpcoming ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-600'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                
                <div className="flex items-center gap-[16px]">
                  <div className="flex items-center gap-[6px] text-[13px] text-neutral-500 font-body">
                    {interview.locationType === 'video' && <Video size={14} />}
                    {interview.locationType === 'phone' && <Phone size={14} />}
                    {interview.locationType === 'onsite' && <Building2 size={14} />}
                    <span className="capitalize">{interview.locationType}</span>
                  </div>
                  
                  <div className="flex items-center gap-[6px] text-[13px] text-neutral-500 font-body">
                    <div className="flex -space-x-2">
                      {interview.interviewers.map(i => (
                        <div key={i.id} className="w-[20px] h-[20px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-bold border border-white z-10">
                          {i.name.charAt(0)}
                        </div>
                      ))}
                    </div>
                    <span>
                      {interview.interviewers.map(i => i.name.split(' ')[0]).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {isUpcoming ? (
                <button 
                  disabled={!interview.meetingLink}
                  className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-body text-[13px] font-medium px-[16px] py-[8px] rounded-md transition-colors"
                >
                  Join Meeting
                </button>
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
