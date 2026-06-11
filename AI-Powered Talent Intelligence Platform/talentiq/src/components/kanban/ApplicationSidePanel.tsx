'use client'

import { useState } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { Application } from '@/types/domain.types'
import { StageBadge } from '@/components/shared/StageBadge'
import { SourceBadge } from '@/components/shared/SourceBadge'
import { formatDate } from '@/lib/utils'
import { getScoreColor, getScoreLabel } from '@/lib/score'
import { ScoreRing } from '@/components/score/ScoreRing'

interface ApplicationSidePanelProps {
  application: Application | null
  onClose: () => void
}

export default function ApplicationSidePanel({ application, onClose }: ApplicationSidePanelProps) {
  const [activeTab, setActiveTab] = useState('Overview')

  const tabs = ['Overview', 'AI Score', 'Notes', 'Resume', 'Interviews']

  const score = typeof application?.aiScore === 'number' ? application.aiScore : 0

  return (
    <>
      {application && (
        <div 
          className="fixed inset-0 bg-neutral-900/20 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div 
        className={`fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-white shadow-xl z-50 flex flex-col transition-transform duration-200 ease-out ${
          application ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {application && (
          <>
            {/* Header */}
            <div className="p-[20px] md:px-[24px] border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
              <h3 className="font-display text-[22px] font-semibold text-neutral-900 truncate pr-[16px]">
                {application.candidate.name}
              </h3>
              <div className="flex items-center gap-[12px] shrink-0">
                <a href="#" className="font-body text-[13px] text-primary-500 font-medium hover:text-primary-600 transition-colors items-center gap-[4px] hidden md:flex">
                  Open Full Profile <ExternalLink size={14} className="ml-[2px]" />
                </a>
                <button 
                  onClick={onClose}
                  className="w-[32px] h-[32px] flex items-center justify-center rounded-md hover:bg-neutral-100 text-neutral-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#E5E7EB] shrink-0 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-body text-[14px] font-medium px-[16px] py-[12px] border-b-2 whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? 'border-primary-500 text-primary-700' 
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-[20px] md:p-[24px]">
              {activeTab === 'Overview' && (
                <div className="flex flex-col gap-[20px]">
                  <div className="grid grid-cols-2 gap-[16px]">
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-body text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Stage</span>
                      <StageBadge stage={application.stage as any} />
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-body text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Source</span>
                      <SourceBadge source={application.source as any} />
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-body text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Applied</span>
                      <span className="font-body text-[14px] text-neutral-900">{formatDate(application.appliedAt)}</span>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="font-body text-[12px] font-semibold text-neutral-400 uppercase tracking-wider">Days in Stage</span>
                      <span className="font-body text-[14px] text-neutral-900">{application.daysInStage ?? 0} days</span>
                    </div>
                  </div>
                  
                  <div className="h-[1px] w-full bg-neutral-100" />
                  
                  <div className="flex flex-col gap-[8px]">
                    <h4 className="font-body text-[14px] font-semibold text-neutral-900">Contact Info</h4>
                    <span className="font-body text-[13px] text-neutral-600">{application.candidate.email}</span>
                    {application.candidate.phone && (
                      <span className="font-body text-[13px] text-neutral-600">{application.candidate.phone}</span>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'AI Score' && (
                <div className="flex flex-col items-center gap-[24px]">
                  {score > 0 ? (
                    <>
                      <div className="flex flex-col items-center gap-[8px] mt-[8px]">
                        <ScoreRing score={score} size="xl" />
                        <span 
                          className="font-body text-[13px] font-semibold mt-[4px]"
                          style={{ color: getScoreColor(score) }}
                        >
                          {getScoreLabel(score)}
                        </span>
                      </div>
                      <p className="font-body text-[13px] text-neutral-500 text-center max-w-[300px]">
                        This candidate was automatically scored based on their resume and the job requirements.
                      </p>
                    </>
                  ) : (
                    <div className="text-[13px] text-neutral-500 font-body italic mt-[32px]">
                      No AI Score available yet for this candidate.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Notes' && (
                <div className="flex flex-col gap-[16px]">
                  <textarea 
                    placeholder="Add a note about this candidate..."
                    className="w-full min-h-[100px] border border-neutral-200 rounded-md p-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 resize-y"
                  />
                  <button className="bg-neutral-100 text-neutral-700 font-body text-[13px] font-medium py-[6px] px-[12px] rounded-md hover:bg-neutral-200 transition-colors w-fit self-end">
                    Post Note
                  </button>
                  {application.recruiterNotes && application.recruiterNotes.length > 0 ? (
                    <div className="flex flex-col gap-[8px] mt-[8px]">
                      {application.recruiterNotes.map((note, i) => (
                        <div key={i} className="bg-neutral-50 rounded-md p-[12px] font-body text-[13px] text-neutral-700">
                          {note}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[13px] text-neutral-400 font-body italic mt-[16px]">No notes yet.</div>
                  )}
                </div>
              )}

              {activeTab === 'Resume' && (
                <div className="w-full min-h-[400px] border border-neutral-200 rounded-md bg-neutral-50 flex items-center justify-center p-[24px]">
                  {application.candidate.resumeUrl ? (
                    <a href={application.candidate.resumeUrl} target="_blank" rel="noreferrer" className="text-primary-500 font-body text-[14px] font-medium hover:underline">
                      Open Resume PDF
                    </a>
                  ) : (
                    <span className="text-neutral-400 font-body text-[13px]">No resume uploaded</span>
                  )}
                </div>
              )}

              {activeTab === 'Interviews' && (
                <div className="flex flex-col items-center justify-center h-[200px] gap-[12px]">
                  <span className="text-neutral-400 font-body text-[13px]">No upcoming interviews scheduled</span>
                  <button className="text-primary-500 font-body text-[13px] font-medium hover:text-primary-600 hover:underline transition-colors">
                    Schedule an Interview
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-[16px] md:px-[24px] border-t border-[#E5E7EB] shrink-0 bg-neutral-50">
              <div className="flex gap-[8px] mb-[8px]">
                <select className="flex-grow h-[36px] rounded-md border border-neutral-200 px-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 bg-white">
                  <option value="Screening">Screening</option>
                  <option value="Phone Screen">Phone Screen</option>
                  <option value="Interview">Interview</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Offer">Offer</option>
                  <option value="Hired">Hired</option>
                </select>
                <button className="bg-primary-500 hover:bg-primary-600 text-white font-body text-[13px] font-medium px-[16px] rounded-md transition-colors h-[36px] shrink-0">
                  Move Stage
                </button>
              </div>
              <button className="w-full bg-white border border-[#E5E7EB] hover:bg-neutral-50 text-neutral-900 font-body text-[13px] font-medium py-[8px] rounded-md transition-colors mb-[4px]">
                Schedule Interview
              </button>
              <button className="w-full bg-transparent hover:bg-red-50 text-[#DC2626] font-body text-[13px] font-medium py-[8px] rounded-md transition-colors">
                Reject Candidate
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
