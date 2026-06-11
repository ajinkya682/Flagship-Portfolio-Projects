'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'

interface RejectModalProps {
  isOpen: boolean
  onClose: () => void
  candidateName: string
}

export default function RejectModal({ isOpen, onClose, candidateName }: RejectModalProps) {
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [sendEmail, setSendEmail] = useState(true)

  const REASONS = [
    'Not qualified for this role',
    'Overqualified',
    'Culture fit',
    'Position filled',
    'Salary expectations too high',
    'No response from candidate',
    'Other'
  ]

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-xl w-[90vw] max-w-[500px] z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">
          
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100">
            <Dialog.Title className="text-[18px] font-semibold text-neutral-900">
              Reject Candidate
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-[24px] flex flex-col gap-[20px]">
            <p className="text-[14px] text-neutral-600 leading-snug">
              You are about to reject <span className="font-semibold text-neutral-900">{candidateName}</span>. This action cannot be undone.
            </p>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Rejection Reason *</label>
              <select 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-white"
              >
                <option value="" disabled>Select a reason</option>
                {REASONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Internal Notes</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes for your team..."
                className="w-full min-h-[80px] rounded-md border border-neutral-200 p-[12px] text-[14px] focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-y"
              />
            </div>

            <label className="flex items-center gap-[8px] cursor-pointer group mt-[4px]">
              <div className="relative flex items-center justify-center w-[16px] h-[16px]">
                <input 
                  type="checkbox" 
                  checked={sendEmail}
                  onChange={(e) => setSendEmail(e.target.checked)}
                  className="peer appearance-none w-[16px] h-[16px] border border-neutral-300 rounded-[3px] checked:bg-primary-500 checked:border-primary-500 transition-colors cursor-pointer"
                />
                <svg className="absolute w-[10px] h-[10px] text-white pointer-events-none opacity-0 peer-checked:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-[14px] text-neutral-700 select-none">Send automated rejection email</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-neutral-100 bg-neutral-50">
            <Dialog.Close asChild>
              <button className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button 
              disabled={!reason}
              onClick={onClose}
              className="px-[20px] py-[8px] text-[14px] font-medium text-white bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors shadow-sm"
            >
              Reject Candidate
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
