'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle2 } from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'

interface CreateOfferModalProps {
  isOpen: boolean
  onClose: () => void
  initialCandidateId?: string
  onSuccess?: (candidateId: string) => void
}

export default function CreateOfferModal({ isOpen, onClose, initialCandidateId, onSuccess }: CreateOfferModalProps) {
  const { jobs } = useJobsStore()
  const { candidates } = useCandidatesStore()
  
  const [candidateId, setCandidateId] = useState(initialCandidateId || '')
  const [amount, setAmount] = useState('')
  const [equity, setEquity] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Sync initial candidate ID when modal opens
  useEffect(() => {
    if (isOpen && initialCandidateId) {
      setCandidateId(initialCandidateId)
    }
  }, [isOpen, initialCandidateId])

  // Filter candidates that are in Offer or near Offer stage
  const eligibleCandidates = candidates.filter(c => ['Interview', 'Assessment', 'Offer'].includes(c.stage))

  const handleSubmit = () => {
    if (!candidateId || !amount) return
    setIsSubmitting(true)
    
    setTimeout(async () => {
      const candidate = candidates.find(c => c.id === candidateId)
      
      try {
        const res = await fetch('/api/offers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            candidateId,
            jobId: candidate?.jobId || jobs[0]?.id || '',
            amount,
            equity
          }),
        });

        if (res.ok) {
          setIsSubmitting(false)
          setIsSuccess(true)
          
          if (onSuccess) {
            onSuccess(candidateId);
          }

          setTimeout(() => {
            handleClose()
            // Optionally reload page to show new offer, or handle state
            if (!onSuccess) {
              window.location.reload()
            }
          }, 1500)
        } else {
          console.error("Failed to create offer");
          setIsSubmitting(false);
        }
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    }, 800)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setCandidateId(initialCandidateId || '')
      setAmount('')
      setEquity('')
      setIsSuccess(false)
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-xl shadow-xl w-[90vw] max-w-[450px] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">
          
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100 shrink-0">
            <Dialog.Title className="text-[18px] font-semibold text-neutral-900">
              Create New Offer
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md disabled:opacity-50" disabled={isSubmitting || isSuccess}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-[24px] flex flex-col gap-[16px] relative">
            {isSuccess && (
              <div className="absolute inset-0 bg-white/90 z-10 flex flex-col items-center justify-center animate-in fade-in">
                <CheckCircle2 size={48} className="text-emerald-500 mb-[12px] animate-bounce" />
                <p className="font-display font-bold text-[18px] text-neutral-900">Offer Created!</p>
                <p className="font-body text-[14px] text-neutral-500 text-center mt-[4px]">
                  The offer has been sent to the candidate.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Select Candidate <span className="text-red-500">*</span></label>
              <select 
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                disabled={isSubmitting || isSuccess || !!initialCandidateId}
              >
                <option value="">Select a candidate...</option>
                {eligibleCandidates.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.role}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Annual Base Salary (USD) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="150000" 
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>
            
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Equity (%)</label>
              <input 
                type="number" 
                step="0.01"
                value={equity}
                onChange={(e) => setEquity(e.target.value)}
                placeholder="0.5" 
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-neutral-100 bg-neutral-50 shrink-0">
            <Dialog.Close asChild>
              <button 
                className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors w-full sm:w-auto disabled:opacity-50"
                disabled={isSubmitting || isSuccess}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess || !candidateId || !amount}
              className="px-[24px] py-[8px] text-[14px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Send Offer'
              )}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
