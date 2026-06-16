'use client'

import { useState, useRef } from 'react'
import { UploadCloud, CheckCircle, ArrowRight, Image as ImageIcon, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Job } from '@/types/domain.types'
import Link from 'next/link'

export default function ApplicationForm({ job, companySlug, companyName }: { job?: Job, companySlug?: string, companyName?: string }) {
  const { register, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [candidateToken, setCandidateToken] = useState('')

  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [passportPhotoUrl, setPassportPhotoUrl] = useState<string | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  const resumeInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Default config if none provided on older jobs
  const config = job?.applicationFormConfig || {
    requireFullName: true,
    requireMobileNumber: false,
    requireDate: false,
    requireLinkedin: true,
    requireGithub: false,
    requirePortfolio: false,
    requireResume: true,
    requirePassportPhoto: false,
    requireSignature: false,
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'photo') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simple validation
    if (type === 'resume' && file.size > 5 * 1024 * 1024) {
      alert("Resume must be less than 5MB.")
      return
    }
    if (type === 'photo' && file.size > 2 * 1024 * 1024) {
      alert("Passport photo must be less than 2MB.")
      return
    }

    if (type === 'resume') setIsUploadingResume(true)
    else setIsUploadingPhoto(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()
      
      if (type === 'resume') setResumeUrl(data.url)
      else setPassportPhotoUrl(data.url)
    } catch (err) {
      console.error(err)
      alert("Failed to upload file")
    } finally {
      if (type === 'resume') setIsUploadingResume(false)
      else setIsUploadingPhoto(false)
    }
  }

  const onSubmit = async (data: any) => {
    if (config.requireResume && !resumeUrl) {
      alert("Please upload your resume first.")
      return
    }
    if (config.requirePassportPhoto && !passportPhotoUrl) {
      alert("Please upload your passport photo first.")
      return
    }

    setIsSubmitting(true)
    
    try {
      let aiResult = { aiScore: 0, strengths: [], gaps: [], extractedSkills: [] }
      
      if (resumeUrl && job) {
        // Run AI Resume Scoring
        const scoreRes = await fetch('/api/candidates/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeUrl, job })
        })
        if (scoreRes.ok) {
          aiResult = await scoreRes.json()
        } else {
          console.error("AI scoring failed", await scoreRes.text())
        }
      }

      const newToken = Math.random().toString(36).substring(2, 10).toUpperCase()
      
      const candidateName = config.requireFullName && data.fullName 
        ? data.fullName 
        : `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown'

      const candidateData = {
        name: candidateName,
        email: data.email,
        phone: data.phone || '',
        avatar: passportPhotoUrl || '',
        role: job?.title || 'Unknown Role',
        jobId: job?.id || '',
        stage: 'Screening',
        source: 'Career Site',
        aiScore: aiResult.aiScore || 0,
        daysInStage: 0,
        appliedAt: new Date().toISOString(),
        notes: [],
        timeline: [{ event: 'Applied via Career Site', date: 'Just now', type: 'applied' }],
        portalToken: newToken,
        hasPortalAccess: false,
        extractedSkills: aiResult.extractedSkills || [],
        extractedCompanies: [], // Not extracted yet
        extractedEducation: [], // Not extracted yet
        strengths: aiResult.strengths || [],
        gaps: aiResult.gaps || [],
        linkedinUrl: data.linkedin,
        githubUrl: data.github,
        portfolioUrl: data.portfolio,
        resumeUrl: resumeUrl || undefined,
        passportPhotoUrl: passportPhotoUrl || undefined,
        signature: data.signature,
        availableStartDate: data.startDate,
      }

      const postRes = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      })

      if (!postRes.ok) {
        throw new Error('Failed to submit application')
      }
      
      setCandidateToken(newToken)
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      alert("An error occurred while submitting your application.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <CheckCircle className="w-[64px] h-[64px] text-emerald-500 animate-spring-in mb-[16px]" />
        <h2 className="font-display text-[28px] font-bold text-neutral-900">
          Application Submitted!
        </h2>
        <p className="font-body text-[15px] text-neutral-500 mt-[12px] max-w-[400px]">
          Thank you for applying to {companyName || 'our company'}. We've created a Candidate Portal for you to track your application status.
        </p>
        
        <div className="mt-[24px] p-[16px] bg-neutral-50 rounded-xl border border-neutral-200 w-full max-w-[300px]">
          <p className="font-body text-[12px] text-neutral-500 font-semibold uppercase tracking-wider mb-[4px]">Your Portal Access Code</p>
          <p className="font-mono text-[24px] font-bold text-neutral-900 tracking-widest">{candidateToken}</p>
        </div>

        <Link
          href="/portal/login"
          className="mt-[32px] h-[48px] px-[32px] bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors flex items-center gap-[8px]"
        >
          Access Candidate Portal <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 flex flex-col gap-[24px]">
      <h3 className="font-display text-[20px] font-bold text-neutral-900">Personal Information</h3>
      
      {config.requireFullName ? (
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Full Name <span className="text-red-500">*</span></label>
          <input required {...register('fullName')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">First Name <span className="text-red-500">*</span></label>
            <input required {...register('firstName')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Last Name <span className="text-red-500">*</span></label>
            <input required {...register('lastName')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Email Address <span className="text-red-500">*</span></label>
          <input type="email" required {...register('email')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        {config.requireMobileNumber && (
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Mobile Number <span className="text-red-500">*</span></label>
            <input type="tel" required {...register('phone')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
          </div>
        )}
      </div>

      {config.requireDate && (
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Available Start Date <span className="text-red-500">*</span></label>
          <input type="date" required {...register('startDate')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      )}

      {(config.requireLinkedin || config.requireGithub || config.requirePortfolio) && (
        <>
          <h3 className="font-display text-[20px] font-bold text-neutral-900 mt-[8px]">Links & Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {config.requireLinkedin && (
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">LinkedIn Profile URL <span className="text-red-500">*</span></label>
                <input type="url" required {...register('linkedin')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            )}
            {config.requireGithub && (
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">GitHub Profile URL <span className="text-red-500">*</span></label>
                <input type="url" required {...register('github')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            )}
            {config.requirePortfolio && (
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Portfolio URL <span className="text-red-500">*</span></label>
                <input type="url" required {...register('portfolio')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            )}
          </div>
        </>
      )}

      {(config.requireResume || config.requirePassportPhoto) && (
        <>
          <h3 className="font-display text-[20px] font-bold text-neutral-900 mt-[8px]">Documents & Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {config.requireResume && (
              <div 
                onClick={() => resumeInputRef.current?.click()}
                className={`w-full border-2 border-dashed border-neutral-200 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl p-[24px] flex flex-col items-center justify-center cursor-pointer transition-colors ${resumeUrl ? 'bg-blue-50/50 border-blue-500' : ''}`}
              >
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  className="hidden" 
                  ref={resumeInputRef}
                  onChange={(e) => handleFileUpload(e, 'resume')}
                />
                {isUploadingResume ? (
                  <Loader2 className="w-[24px] h-[24px] text-blue-600 mb-[12px] animate-spin" />
                ) : resumeUrl ? (
                  <CheckCircle className="w-[24px] h-[24px] text-emerald-500 mb-[12px]" />
                ) : (
                  <UploadCloud className="w-[24px] h-[24px] text-blue-600 mb-[12px]" />
                )}
                
                <p className="font-body text-[13px] font-semibold text-neutral-900">
                  {isUploadingResume ? 'Uploading...' : resumeUrl ? 'Resume Uploaded' : 'Upload Resume / CV'}
                </p>
                {!resumeUrl && !isUploadingResume && (
                  <p className="font-body text-[11px] text-neutral-500 mt-[4px]">PDF or DOCX (max 5MB)</p>
                )}
              </div>
            )}
            
            {config.requirePassportPhoto && (
              <div 
                onClick={() => photoInputRef.current?.click()}
                className={`w-full border-2 border-dashed border-neutral-200 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl p-[24px] flex flex-col items-center justify-center cursor-pointer transition-colors ${passportPhotoUrl ? 'bg-blue-50/50 border-blue-500' : ''}`}
              >
                <input 
                  type="file" 
                  accept="image/jpeg, image/png" 
                  className="hidden" 
                  ref={photoInputRef}
                  onChange={(e) => handleFileUpload(e, 'photo')}
                />
                {isUploadingPhoto ? (
                  <Loader2 className="w-[24px] h-[24px] text-blue-600 mb-[12px] animate-spin" />
                ) : passportPhotoUrl ? (
                  <CheckCircle className="w-[24px] h-[24px] text-emerald-500 mb-[12px]" />
                ) : (
                  <ImageIcon className="w-[24px] h-[24px] text-blue-600 mb-[12px]" />
                )}
                
                <p className="font-body text-[13px] font-semibold text-neutral-900">
                  {isUploadingPhoto ? 'Uploading...' : passportPhotoUrl ? 'Photo Uploaded' : 'Upload Passport Photo'}
                </p>
                {!passportPhotoUrl && !isUploadingPhoto && (
                  <p className="font-body text-[11px] text-neutral-500 mt-[4px]">JPG or PNG (max 2MB)</p>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {config.requireSignature && (
        <>
          <h3 className="font-display text-[20px] font-bold text-neutral-900 mt-[8px]">Signature</h3>
          <div className="flex flex-col gap-[6px]">
            <label className="font-body text-[13px] font-semibold text-neutral-700">Digital Signature (Type your full legal name) <span className="text-red-500">*</span></label>
            <input required {...register('signature')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-serif italic text-[16px]" placeholder="John Doe" />
          </div>
        </>
      )}

      <div className="mt-[8px] bg-neutral-50 p-[16px] rounded-lg border border-neutral-200">
        <p className="font-body text-[12px] text-neutral-500 leading-relaxed">
          By submitting this application, you agree to {companyName || 'our'} Privacy Policy and consent to the processing of your personal data.
        </p>
      </div>

      <button type="submit" disabled={isSubmitting || isUploadingResume || isUploadingPhoto} className="w-full h-[56px] flex items-center justify-center gap-[8px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[16px] rounded-xl shadow-sm transition-colors mt-[8px] disabled:opacity-70">
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? 'Submitting & Analyzing Resume...' : 'Submit Application'}
      </button>
    </form>
  )
}
