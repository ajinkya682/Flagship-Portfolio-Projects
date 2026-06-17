'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X, Calendar } from 'lucide-react'
import { useState } from 'react'
import ScorecardForm from './ScorecardForm'

interface ScorecardModalProps {
  isOpen: boolean
  onClose: () => void
  candidateName: string
  interviewDate: string
  interviewerName: string
}

export default function ScorecardModal({ isOpen, onClose, candidateName, interviewDate, interviewerName }: ScorecardModalProps) {
  const [overallRating, setOverallRating] = useState<string>('')
  const [notes, setNotes] = useState('')

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-xl w-[90vw] max-w-[720px] max-h-[90vh] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">
          
          <div className="flex items-start justify-between px-[24px] py-[20px] border-b border-neutral-100 bg-neutral-50 shrink-0">
            <div className="flex flex-col gap-[4px]">
              <Dialog.Title className="text-[18px] font-semibold text-neutral-900">
                Submit Scorecard for {candidateName}
              </Dialog.Title>
              <div className="flex items-center gap-[12px] text-[13px] text-neutral-500">
                <span className="flex items-center gap-[4px]"><Calendar size={14} /> {interviewDate}</span>
                <span>•</span>
                <span>Interviewer: {interviewerName}</span>
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-[24px] overflow-y-auto flex flex-col gap-[32px]">
            <ScorecardForm />

            <div className="flex flex-col gap-[12px] pt-[24px] border-t border-neutral-200">
              <label className="text-[14px] font-semibold text-neutral-900">Overall Recommendation</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
                <button 
                  onClick={() => setOverallRating('strong-yes')}
                  className={`py-[12px] rounded-md border text-[13px] font-bold uppercase tracking-wider transition-colors ${
                    overallRating === 'strong-yes' ? 'bg-accent-500 text-white border-accent-500' : 'bg-white border-neutral-200 text-neutral-600 hover:border-accent-500 hover:text-accent-600'
                  }`}
                >
                  Strong Yes
                </button>
                <button 
                  onClick={() => setOverallRating('yes')}
                  className={`py-[12px] rounded-md border text-[13px] font-bold uppercase tracking-wider transition-colors ${
                    overallRating === 'yes' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-500 hover:text-primary-600'
                  }`}
                >
                  Yes
                </button>
                <button 
                  onClick={() => setOverallRating('no')}
                  className={`py-[12px] rounded-md border text-[13px] font-bold uppercase tracking-wider transition-colors ${
                    overallRating === 'no' ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-neutral-200 text-neutral-600 hover:border-amber-500 hover:text-amber-600'
                  }`}
                >
                  No
                </button>
                <button 
                  onClick={() => setOverallRating('strong-no')}
                  className={`py-[12px] rounded-md border text-[13px] font-bold uppercase tracking-wider transition-colors ${
                    overallRating === 'strong-no' ? 'bg-[#DC2626] text-white border-[#DC2626]' : 'bg-white border-neutral-200 text-neutral-600 hover:border-[#DC2626] hover:text-[#DC2626]'
                  }`}
                >
                  Strong No
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[12px]">
              <label className="text-[14px] font-semibold text-neutral-900">Overall Notes</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Final thoughts, cultural fit, overall impression..."
                className="w-full min-h-[96px] rounded-md border border-neutral-200 p-[12px] text-[14px] focus:outline-none focus:border-primary-500 resize-y bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-neutral-100 bg-white shrink-0">
            <Dialog.Close asChild>
              <button className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button 
              disabled={!overallRating}
              onClick={onClose}
              className="px-[24px] py-[8px] text-[14px] font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors shadow-sm"
            >
              Submit Scorecard
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
