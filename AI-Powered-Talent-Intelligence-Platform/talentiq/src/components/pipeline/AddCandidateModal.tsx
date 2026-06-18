'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle2 } from 'lucide-react'
import { useDomainStore } from '@/store/domain.store'
import { useJobsStore } from '@/store/jobs.store'
import { useCandidatesStore } from '@/store/candidates.store'

interface AddCandidateModalProps {
  isOpen: boolean
  onClose: () => void
  initialJobId?: string
  initialStage?: string
}

export default function AddCandidateModal({ isOpen, onClose, initialJobId, initialStage }: AddCandidateModalProps) {
  const { jobs } = useJobsStore()
  const { addCandidate } = useCandidatesStore()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [jobId, setJobId] = useState('')
  const [stage, setStage] = useState('Applied')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initialJobId) setJobId(initialJobId)
      if (initialStage) setStage(initialStage)
    }
  }, [isOpen, initialJobId, initialStage])

  const handleSubmit = () => {
    if (!name || !email || !jobId) return
    setIsSubmitting(true)
    
    setTimeout(() => {
      const selectedJob = jobs.find(j => j.id === jobId)
      
      addCandidate({
        id: `c_${Math.random().toString(36).substring(2, 10)}`,
        name: name,
        email: email,
        phone: '',
        role: selectedJob?.title || 'Unknown Role',
        jobId: jobId,
        stage: stage,
        source: 'Manually Added',
        aiScore: Math.floor(Math.random() * 40) + 60, // random score 60-100
        daysInStage: 0,
        appliedAt: new Date().toISOString(),
        notes: [],
        timeline: [{ event: 'Manually Added', date: 'Just now', type: 'applied' }],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        hasPortalAccess: false
      })
      
      setIsSubmitting(false)
      setIsSuccess(true)
      
      setTimeout(() => {
        handleClose()
      }, 1500)
    }, 800)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setName('')
      setEmail('')
      setJobId('')
      setStage('Applied')
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
              Add Candidate
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
                <p className="font-display font-bold text-[18px] text-neutral-900">Candidate Added!</p>
                <p className="font-body text-[14px] text-neutral-500 text-center mt-[4px]">
                  {name} is now in the pipeline.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe" 
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Email Address <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com" 
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>
            
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Select Job <span className="text-red-500">*</span></label>
              <select 
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                disabled={isSubmitting || isSuccess}
              >
                <option value="">Select a job...</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">Initial Stage</label>
              <select 
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full h-[40px] rounded-md border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors"
                disabled={isSubmitting || isSuccess}
              >
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Assessment">Assessment</option>
                <option value="Offer">Offer</option>
              </select>
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
              disabled={isSubmitting || isSuccess || !name || !email || !jobId}
              className="px-[24px] py-[8px] text-[14px] font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? (
                <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Add Candidate'
              )}
            </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
