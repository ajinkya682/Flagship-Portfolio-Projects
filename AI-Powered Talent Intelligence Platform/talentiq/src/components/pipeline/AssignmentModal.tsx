'use client'

import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, ClipboardList, CheckCircle2, Calendar, Link as LinkIcon, AlignLeft } from 'lucide-react'

interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  initialCandidateId?: string
  initialJobId?: string
  initialApplicationId?: string
  candidateName?: string
  onSuccess?: (candidateId: string) => void
}

export default function AssignmentModal({
  isOpen,
  onClose,
  initialCandidateId,
  initialJobId,
  initialApplicationId,
  candidateName,
  onSuccess,
}: AssignmentModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [referenceLink, setReferenceLink] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !deadline) {
      setError('Please fill in title, description, and deadline.')
      return
    }
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: initialCandidateId,
          jobId: initialJobId,
          applicationId: initialApplicationId,
          title: title.trim(),
          description: description.trim(),
          deadline,
          referenceLink: referenceLink.trim() || undefined,
        }),
      })

      if (res.ok) {
        setIsSuccess(true)
        if (onSuccess && initialCandidateId) {
          onSuccess(initialCandidateId)
        }
        setTimeout(() => {
          handleClose()
        }, 1800)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create assignment.')
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setTitle('')
      setDescription('')
      setDeadline('')
      setReferenceLink('')
      setIsSuccess(false)
      setIsSubmitting(false)
      setError('')
    }, 300)
  }

  // Default deadline to 7 days from now
  const defaultDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[520px] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body">

          {/* Header */}
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100 shrink-0 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-[12px]">
              <div className="w-[36px] h-[36px] bg-amber-500 rounded-[10px] flex items-center justify-center shadow-sm">
                <ClipboardList size={18} className="text-white" />
              </div>
              <div>
                <Dialog.Title className="text-[17px] font-bold text-neutral-900">
                  Send Assignment
                </Dialog.Title>
                {candidateName && (
                  <p className="text-[12px] text-neutral-500 mt-[1px]">to {candidateName}</p>
                )}
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md disabled:opacity-50" disabled={isSubmitting || isSuccess}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-[24px] flex flex-col gap-[16px] relative overflow-y-auto max-h-[60vh]">
            {isSuccess && (
              <div className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center animate-in fade-in">
                <div className="w-[64px] h-[64px] bg-amber-50 rounded-full flex items-center justify-center mb-[16px]">
                  <CheckCircle2 size={36} className="text-amber-500" />
                </div>
                <p className="font-display font-bold text-[18px] text-neutral-900">Assignment Sent!</p>
                <p className="font-body text-[14px] text-neutral-500 text-center mt-[6px] max-w-[280px]">
                  {candidateName || 'The candidate'} will see this assignment in their portal.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-[8px] px-[14px] py-[10px] text-[13px] text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Title */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">
                Assignment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Build a REST API with authentication"
                className="w-full h-[40px] rounded-[8px] border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700 flex items-center gap-[6px]">
                <AlignLeft size={12} className="text-neutral-400" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the assignment requirements, evaluation criteria, and deliverables..."
                rows={4}
                className="w-full rounded-[8px] border border-neutral-200 px-[12px] py-[10px] text-[14px] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors resize-none"
                disabled={isSubmitting || isSuccess}
              />
            </div>

            {/* Deadline */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700 flex items-center gap-[6px]">
                <Calendar size={12} className="text-neutral-400" />
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={deadline || defaultDeadline}
                onChange={e => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full h-[40px] rounded-[8px] border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>

            {/* Reference Link (optional) */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700 flex items-center gap-[6px]">
                <LinkIcon size={12} className="text-neutral-400" />
                Reference Link <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={referenceLink}
                onChange={e => setReferenceLink(e.target.value)}
                placeholder="https://docs.example.com/assignment"
                className="w-full h-[40px] rounded-[8px] border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-neutral-100 bg-neutral-50 shrink-0">
            <Dialog.Close asChild>
              <button
                className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors disabled:opacity-50 rounded-[8px] hover:bg-neutral-100"
                disabled={isSubmitting || isSuccess}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess || !title.trim() || !description.trim() || !deadline}
              className="px-[24px] py-[9px] text-[14px] font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-[8px] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-[8px] min-w-[140px] justify-center"
            >
              {isSubmitting ? (
                <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><ClipboardList size={15} /> Send Assignment</>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
