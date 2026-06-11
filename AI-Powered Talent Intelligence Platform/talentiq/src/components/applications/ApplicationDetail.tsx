'use client'

import { useState } from 'react'
import { Application } from '@/types/domain.types'
import ApplicationHeader from './ApplicationHeader'
import ApplicationTabs, { ApplicationTab } from './ApplicationTabs'
import AIAssessmentTab from './AIAssessmentTab'
import ResumeTab from './ResumeTab'
import InterviewsTab from './InterviewsTab'
import ScorecardsTab from './ScorecardsTab'
import NotesTab from './NotesTab'
import ActivityTab from './ActivityTab'
import ActionSidebar from './ActionSidebar'

interface ApplicationDetailProps {
  application: Application
}

export default function ApplicationDetail({ application }: ApplicationDetailProps) {
  const [activeTab, setActiveTab] = useState<ApplicationTab>('Overview')

  return (
    <div className="flex flex-col lg:flex-row gap-[24px] max-w-[1400px] mx-auto w-full items-start">
      
      {/* Main Content Column */}
      <div className="flex-1 flex flex-col w-full min-w-0 bg-white rounded-xl shadow-sm border border-[#E5E7EB]">
        
        <ApplicationHeader application={application} />
        <ApplicationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="min-h-[500px]">
          {activeTab === 'Overview' && (
            <div className="p-[24px] font-body text-[14px] text-neutral-600">
              Overview content rendering candidate timeline and summary details...
            </div>
          )}
          {activeTab === 'Resume' && <ResumeTab application={application} />}
          {activeTab === 'AI Assessment' && <AIAssessmentTab application={application} />}
          {activeTab === 'Interviews' && <InterviewsTab application={application} />}
          {activeTab === 'Scorecards' && <ScorecardsTab application={application} />}
          {activeTab === 'Notes' && <NotesTab application={application} />}
          {activeTab === 'Activity' && <ActivityTab application={application} />}
          {activeTab === 'Emails' && (
            <div className="p-[24px] font-body text-[14px] text-neutral-600">
              Email history component rendering here...
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Sidebar */}
      <ActionSidebar application={application} />

    </div>
  )
}
