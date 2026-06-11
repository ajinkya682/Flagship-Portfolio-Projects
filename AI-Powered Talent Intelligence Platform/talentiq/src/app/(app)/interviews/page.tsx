'use client'

import { useState } from 'react'
import InterviewCalendar from '@/components/interviews/InterviewCalendar'
import InterviewQueue from '@/components/interviews/InterviewQueue'
import ScheduleModal from '@/components/interviews/ScheduleModal'
import ScorecardModal from '@/components/interviews/ScorecardModal'
import { Plus } from 'lucide-react'
import { Interview } from '@/types/domain.types'

const mockInterviews: Interview[] = [
  {
    id: 'int_1',
    applicationId: 'app_1',
    candidate: { name: 'Jennifer Park' } as any,
    job: { title: 'Senior Software Engineer' } as any,
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    duration: 60,
    locationType: 'video',
    meetingLink: 'https://zoom.us/j/1234567890',
    interviewers: [{ id: '1', name: 'Alex Manager' } as any],
    status: 'scheduled',
    scorecards: []
  },
  {
    id: 'int_2',
    applicationId: 'app_2',
    candidate: { name: 'David Chen' } as any,
    job: { title: 'Product Manager' } as any,
    scheduledAt: new Date(Date.now() - 3600000).toISOString(),
    duration: 45,
    locationType: 'video',
    meetingLink: 'https://zoom.us/j/0987654321',
    interviewers: [{ id: '1', name: 'Sarah Recruiter' } as any],
    status: 'completed',
    scorecards: []
  }
]

export default function InterviewsPage() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  
  const [activeScorecardInterview, setActiveScorecardInterview] = useState<Interview | null>(null)

  const handleSelectSlot = (slotInfo: { start: Date }) => {
    setSelectedDate(slotInfo.start)
    setIsScheduleOpen(true)
  }

  const handleSelectEvent = (event: Interview) => {
    if (event.status === 'completed') {
      setActiveScorecardInterview(event)
    }
  }

  return (
    <div className="flex flex-col h-full -mx-[16px] md:-mx-[32px] -mt-[16px] md:-mt-[32px] bg-neutral-50/50">
      
      {/* Header Area */}
      <div className="px-[16px] md:px-[32px] py-[24px] border-b border-[#E5E7EB] bg-white shrink-0 flex justify-between items-center">
        <div>
          <h1 className="font-display text-[28px] font-bold text-neutral-900 tracking-tight">
            Interviews
          </h1>
          <p className="font-body text-[14px] text-neutral-500 mt-[4px]">
            Manage your schedule and submit scorecards.
          </p>
        </div>
        <button 
          onClick={() => { setSelectedDate(undefined); setIsScheduleOpen(true); }}
          className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium px-[16px] py-[8px] rounded-md transition-colors flex items-center gap-[6px] shadow-sm"
        >
          <Plus size={16} /> Schedule
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-[16px] md:p-[32px] flex-grow overflow-auto flex flex-col lg:flex-row gap-[24px]">
        
        <div className="flex-[2] min-w-[600px]">
          <InterviewCalendar 
            events={mockInterviews} 
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        <div className="flex-1 w-full lg:w-[400px] shrink-0">
          <InterviewQueue 
            title="Upcoming & Pending" 
            count={mockInterviews.length} 
            interviews={mockInterviews} 
            onActionClick={setActiveScorecardInterview}
          />
        </div>

      </div>

      <ScheduleModal 
        isOpen={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)} 
        initialDate={selectedDate}
      />

      {activeScorecardInterview && (
        <ScorecardModal 
          isOpen={true} 
          onClose={() => setActiveScorecardInterview(null)}
          candidateName={activeScorecardInterview.candidate.name}
          interviewDate={new Date(activeScorecardInterview.scheduledAt).toLocaleDateString()}
          interviewerName={activeScorecardInterview.interviewers[0]?.name || 'You'}
        />
      )}

    </div>
  )
}
