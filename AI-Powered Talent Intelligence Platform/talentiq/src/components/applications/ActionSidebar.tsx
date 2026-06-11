'use client'

import { useState } from 'react'
import { Calendar, MessageSquare, XCircle, Plus } from 'lucide-react'
import { Application } from '@/types/domain.types'
import RejectModal from './RejectModal'

interface ActionSidebarProps {
  application: Application
}

export default function ActionSidebar({ application }: ActionSidebarProps) {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [stage, setStage] = useState(application.stage || 'Screening')

  return (
    <div className="w-full lg:w-[320px] shrink-0 sticky top-[88px] flex flex-col gap-[20px]">
      
      {/* Primary Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[20px] flex flex-col gap-[16px]">
        
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Current Stage</label>
          <div className="flex gap-[8px]">
            <select 
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="flex-grow h-[36px] rounded-md border border-neutral-200 px-[12px] font-body text-[13px] focus:outline-none focus:border-primary-500 bg-white"
            >
              <option value="Screening">Screening</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Interview">Interview</option>
              <option value="Assessment">Assessment</option>
              <option value="Offer">Offer</option>
              <option value="Hired">Hired</option>
            </select>
            <button className="bg-primary-50 hover:bg-primary-100 text-primary-700 font-body text-[13px] font-medium px-[16px] rounded-md transition-colors h-[36px]">
              Move
            </button>
          </div>
        </div>

        <div className="h-[1px] bg-neutral-100 w-full" />

        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-body text-[14px] font-medium py-[10px] rounded-md transition-colors shadow-sm flex items-center justify-center gap-[8px]">
          <Calendar size={16} />
          Schedule Interview
        </button>

        <button className="w-full bg-white border border-[#E5E7EB] hover:bg-neutral-50 text-neutral-700 font-body text-[14px] font-medium py-[10px] rounded-md transition-colors flex items-center justify-center gap-[8px]">
          <MessageSquare size={16} />
          Send Message
        </button>

        <button 
          onClick={() => setIsRejectModalOpen(true)}
          className="w-full bg-transparent hover:bg-red-50 text-[#DC2626] font-body text-[14px] font-medium py-[10px] rounded-md transition-colors flex items-center justify-center gap-[8px]"
        >
          <XCircle size={16} />
          Reject Candidate
        </button>

      </div>

      {/* Metadata */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-[20px] flex flex-col gap-[20px]">
        
        <div className="flex flex-col gap-[10px]">
          <label className="font-body text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Tags</label>
          <div className="flex flex-wrap gap-[6px]">
            {application.tags && application.tags.length > 0 ? (
              application.tags.map(tag => (
                <span key={tag} className="bg-neutral-100 text-neutral-700 px-[10px] py-[4px] rounded-full text-[12px] font-medium flex items-center gap-[4px]">
                  {tag}
                  <button className="hover:text-neutral-900 transition-colors">×</button>
                </span>
              ))
            ) : (
              <span className="text-[13px] text-neutral-400 italic">No tags added</span>
            )}
            <button className="border border-dashed border-neutral-300 text-neutral-500 hover:text-neutral-700 hover:border-neutral-400 px-[10px] py-[4px] rounded-full text-[12px] font-medium flex items-center gap-[4px] transition-colors">
              <Plus size={12} /> Add Tag
            </button>
          </div>
        </div>

        <div className="h-[1px] bg-neutral-100 w-full" />

        <div className="flex flex-col gap-[10px]">
          <div className="flex justify-between items-center">
            <label className="font-body text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Assigned To</label>
            <button className="text-[12px] font-medium text-primary-500 hover:text-primary-600 transition-colors">Change</button>
          </div>
          <div className="flex items-center gap-[10px]">
            <div className="w-[32px] h-[32px] rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[12px]">
              {application.assignedTo?.name?.charAt(0) || 'R'}
            </div>
            <span className="font-body text-[13px] font-medium text-neutral-900">{application.assignedTo?.name || 'Unassigned'}</span>
          </div>
        </div>

        <div className="h-[1px] bg-neutral-100 w-full" />

        <div className="flex flex-col gap-[12px]">
          <label className="font-body text-[12px] font-semibold text-neutral-500 uppercase tracking-wider">Quick Stats</label>
          <div className="flex justify-between items-center">
            <span className="font-body text-[13px] text-neutral-600">Total days active</span>
            <span className="font-body text-[13px] font-medium text-neutral-900">14</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-[13px] text-neutral-600">Interviews completed</span>
            <span className="font-body text-[13px] font-medium text-neutral-900">1</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body text-[13px] text-neutral-600">Emails sent</span>
            <span className="font-body text-[13px] font-medium text-neutral-900">3</span>
          </div>
        </div>

      </div>

      <RejectModal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)} 
        candidateName={application.candidate.name} 
      />

    </div>
  )
}
