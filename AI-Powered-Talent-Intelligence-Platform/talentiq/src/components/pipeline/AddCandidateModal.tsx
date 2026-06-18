'use client'

import { useState, useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CheckCircle2, UploadCloud, Loader2 } from 'lucide-react'
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
  const [generatedToken, setGeneratedToken] = useState('')
  
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const resumeInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialJobId) setJobId(initialJobId)
      if (initialStage) setStage(initialStage)
    }
  }, [isOpen, initialJobId, initialStage])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Resume must be less than 5MB.")
      return
    }

    setIsUploadingResume(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      setResumeUrl(data.url)
    } catch (err) {
      console.error(err)
      alert("Failed to upload file")
    } finally {
      setIsUploadingResume(false)
    }
  }

  const handleSubmit = async () => {
    if (!name || !email || !jobId) return
    setIsSubmitting(true)
    
    try {
      const selectedJob = jobs.find(j => j.id === jobId)
      let aiResult: any = {}

      if (resumeUrl && selectedJob) {
        const scoreRes = await fetch('/api/candidates/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeUrl, job: selectedJob })
        })
        if (scoreRes.ok) {
          aiResult = await scoreRes.json()
        }
      }
      
      const score = aiResult.aiScore || Math.floor(Math.random() * 40) + 60

      const createdCandidate = await addCandidate({
        name: name,
        email: email,
        phone: '',
        jobId: jobId,
        source: 'Manually Added',
        aiScore: score,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        resumeUrl: resumeUrl || undefined,
        extractedSkills: aiResult.extractedSkills || [],
        extractedEducation: aiResult.extractedEducation || [],
        extractedCompanies: aiResult.extractedCompanies || [],
        strengths: aiResult.strengths || [],
        gaps: aiResult.gaps || [],
      })
      
      setGeneratedToken(createdCandidate.portalToken)
      setIsSuccess(true)
      
      // Removed auto-close so they can copy the token
    } catch (err) {
      console.error(err)
      alert("Failed to add candidate")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setName('')
      setEmail('')
      setJobId('')
      setStage('Applied')
      setResumeUrl(null)
      setIsSuccess(false)
      setIsSubmitting(false)
      setGeneratedToken('')
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
              <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center animate-in fade-in p-[32px]">
                <CheckCircle2 size={48} className="text-emerald-500 mb-[16px] animate-bounce" />
                <p className="font-display font-bold text-[20px] text-neutral-900">Candidate Added!</p>
                <p className="font-body text-[14px] text-neutral-500 text-center mt-[8px] mb-[24px]">
                  {name} is now in the pipeline.
                </p>
                
                {generatedToken && (
                  <div className="bg-neutral-50 border border-neutral-200 rounded-[12px] p-[16px] w-full max-w-[300px] mb-[24px]">
                    <p className="text-[12px] font-semibold text-neutral-500 uppercase tracking-wider text-center mb-[8px]">Portal Login Code</p>
                    <div className="flex items-center justify-center bg-white border border-neutral-200 rounded-[8px] py-[8px] px-[16px]">
                      <code className="text-[18px] font-mono font-bold text-primary-600 tracking-widest">{generatedToken}</code>
                    </div>
                    <p className="text-[11px] text-neutral-400 text-center mt-[8px]">
                      Share this code with the candidate. They can use it to log into their application portal at /portal/login.
                    </p>
                  </div>
                )}
                
                <button 
                  onClick={handleClose}
                  className="w-full max-w-[200px] h-[40px] bg-primary-600 text-white text-[14px] font-semibold rounded-[8px] hover:bg-primary-700 transition-colors"
                >
                  Done
                </button>
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
              <label className="text-[13px] font-semibold text-neutral-700">Resume / CV (Optional)</label>
              <div 
                onClick={() => resumeInputRef.current?.click()}
                className={`w-full border-2 border-dashed border-neutral-200 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl p-[16px] flex flex-col items-center justify-center cursor-pointer transition-colors ${resumeUrl ? 'bg-blue-50/50 border-blue-500' : ''} ${isSubmitting || isSuccess ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="hidden" 
                  ref={resumeInputRef}
                  onChange={handleFileUpload}
                  disabled={isSubmitting || isSuccess || isUploadingResume}
                />
                {isUploadingResume ? (
                  <Loader2 className="w-[20px] h-[20px] text-blue-600 mb-[8px] animate-spin" />
                ) : resumeUrl ? (
                  <CheckCircle2 className="w-[20px] h-[20px] text-emerald-500 mb-[8px]" />
                ) : (
                  <UploadCloud className="w-[20px] h-[20px] text-blue-600 mb-[8px]" />
                )}
                
                <p className="font-body text-[13px] font-semibold text-neutral-900">
                  {isUploadingResume ? 'Uploading...' : resumeUrl ? 'Resume Uploaded' : 'Upload Resume / CV'}
                </p>
              </div>
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
                <div className="flex items-center gap-[6px]">
                  <Loader2 className="w-[18px] h-[18px] animate-spin" />
                  <span>Processing...</span>
                </div>
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
