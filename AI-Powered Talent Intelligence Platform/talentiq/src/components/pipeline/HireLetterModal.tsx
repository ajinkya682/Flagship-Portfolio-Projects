'use client'

import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, FileText, CheckCircle2, Sparkles, Calendar, DollarSign, Building2, Loader2 } from 'lucide-react'

interface HireLetterModalProps {
  isOpen: boolean
  onClose: () => void
  initialCandidateId?: string
  candidateName?: string
  roleName?: string
  salary?: number
  onSuccess?: (candidateId: string) => void
}

export default function HireLetterModal({
  isOpen,
  onClose,
  initialCandidateId,
  candidateName,
  roleName,
  salary: initialSalary,
  onSuccess,
}: HireLetterModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [companyDetails, setCompanyDetails] = useState('')
  const [role, setRole] = useState(roleName || '')
  const [salary, setSalary] = useState(initialSalary?.toString() || '')
  const [startDate, setStartDate] = useState('')
  const [letterContent, setLetterContent] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      setRole(roleName || '')
      setSalary(initialSalary?.toString() || '')
    }
  }, [isOpen, roleName, initialSalary])

  const handleGenerateAI = async () => {
    if (!role.trim()) {
      setError('Please enter the role name before generating AI suggestions.')
      return
    }
    setError('')
    setIsGeneratingAI(true)
    try {
      const res = await fetch('/api/ai/hire-letter-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateName,
          role: role.trim(),
          salary: salary || 'TBD',
          companyName: companyName || 'the company',
          startDate,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setLetterContent(data.content)
      } else {
        setError('Failed to generate AI suggestion. Please write the letter manually.')
      }
    } catch (err) {
      setError('AI generation failed. Please write the letter manually.')
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handleSubmit = async () => {
    if (!letterContent.trim() || !startDate || !salary) {
      setError('Please fill in salary, start date, and letter content.')
      return
    }
    setError('')
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/hire-letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: initialCandidateId,
          companyName: companyName.trim(),
          companyDetails: companyDetails.trim(),
          role: role.trim(),
          salary: parseFloat(salary),
          startDate,
          letterContent: letterContent.trim(),
          aiGenerated: false,
        }),
      })

      if (res.ok) {
        setIsSuccess(true)
        if (onSuccess && initialCandidateId) {
          onSuccess(initialCandidateId)
        }
        setTimeout(() => handleClose(), 2000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to send hire letter.')
        setIsSubmitting(false)
      }
    } catch (err) {
      setError('Something went wrong.')
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setCompanyName('')
      setCompanyDetails('')
      setRole(roleName || '')
      setSalary(initialSalary?.toString() || '')
      setStartDate('')
      setLetterContent('')
      setIsSuccess(false)
      setIsSubmitting(false)
      setError('')
    }, 300)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-2xl w-[90vw] max-w-[640px] flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in-95 font-body max-h-[90vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-neutral-100 shrink-0 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center gap-[12px]">
              <div className="w-[36px] h-[36px] bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[10px] flex items-center justify-center shadow-sm">
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <Dialog.Title className="text-[17px] font-bold text-neutral-900">
                  Send Hire Letter
                </Dialog.Title>
                {candidateName && (
                  <p className="text-[12px] text-neutral-500 mt-[1px]">to {candidateName}</p>
                )}
              </div>
            </div>
            <Dialog.Close asChild>
              <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-[4px] rounded-md" disabled={isSubmitting || isSuccess}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="p-[24px] flex flex-col gap-[16px] overflow-y-auto relative">
            {isSuccess && (
              <div className="absolute inset-0 bg-white/97 z-10 flex flex-col items-center justify-center animate-in fade-in">
                <div className="w-[72px] h-[72px] bg-indigo-50 rounded-full flex items-center justify-center mb-[16px]">
                  <CheckCircle2 size={40} className="text-indigo-600" />
                </div>
                <p className="font-display font-bold text-[20px] text-neutral-900">Hire Letter Sent!</p>
                <p className="font-body text-[14px] text-neutral-500 text-center mt-[6px] max-w-[300px]">
                  {candidateName} can now view and sign their hire letter in the candidate portal.
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-[8px] px-[14px] py-[10px] text-[13px] text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Top row */}
            <div className="grid grid-cols-2 gap-[14px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700 flex items-center gap-[6px]">
                  <Building2 size={12} className="text-neutral-400" /> Company Name
                </label>
                <input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Acme Inc."
                  className="h-[40px] rounded-[8px] border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors"
                  disabled={isSubmitting || isSuccess}
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700">
                  Role / Position <span className="text-red-500">*</span>
                </label>
                <input
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="Senior Software Engineer"
                  className="h-[40px] rounded-[8px] border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors"
                  disabled={isSubmitting || isSuccess}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[14px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700 flex items-center gap-[6px]">
                  <DollarSign size={12} className="text-neutral-400" /> Salary (USD/yr) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  placeholder="120000"
                  className="h-[40px] rounded-[8px] border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors"
                  disabled={isSubmitting || isSuccess}
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[13px] font-semibold text-neutral-700 flex items-center gap-[6px]">
                  <Calendar size={12} className="text-neutral-400" /> Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-[40px] rounded-[8px] border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors"
                  disabled={isSubmitting || isSuccess}
                />
              </div>
            </div>

            {/* Company Details */}
            <div className="flex flex-col gap-[6px]">
              <label className="text-[13px] font-semibold text-neutral-700">
                Company Details <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                value={companyDetails}
                onChange={e => setCompanyDetails(e.target.value)}
                placeholder="e.g. 50-person Series B startup building the future of finance"
                className="h-[40px] rounded-[8px] border border-neutral-200 px-[12px] text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors"
                disabled={isSubmitting || isSuccess}
              />
            </div>

            {/* Letter Content */}
            <div className="flex flex-col gap-[6px]">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-neutral-700">
                  Hire Letter Content <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI || isSubmitting || isSuccess}
                  className="flex items-center gap-[6px] text-[12px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-[12px] py-[5px] rounded-[8px] transition-colors disabled:opacity-50"
                >
                  {isGeneratingAI ? (
                    <><Loader2 size={12} className="animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles size={12} /> AI Suggestions</>
                  )}
                </button>
              </div>
              <textarea
                value={letterContent}
                onChange={e => setLetterContent(e.target.value)}
                placeholder="Dear [Candidate Name],&#10;&#10;We are delighted to offer you the position of..."
                rows={8}
                className="w-full rounded-[8px] border border-neutral-200 px-[12px] py-[10px] text-[14px] focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-colors resize-none font-serif leading-relaxed"
                disabled={isSubmitting || isSuccess}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-neutral-100 bg-neutral-50 shrink-0">
            <Dialog.Close asChild>
              <button
                className="px-[16px] py-[8px] text-[14px] font-medium text-neutral-600 hover:text-neutral-900 transition-colors rounded-[8px] hover:bg-neutral-100 disabled:opacity-50"
                disabled={isSubmitting || isSuccess}
              >
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSuccess || !letterContent.trim() || !startDate || !salary}
              className="px-[24px] py-[9px] text-[14px] font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-[8px] transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-[8px] min-w-[180px] justify-center"
            >
              {isSubmitting ? (
                <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><FileText size={15} /> Send for Approval</>
              )}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
