'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { UploadCloud, CheckCircle, ArrowRight, Image as ImageIcon, Loader2, LogIn, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Job } from '@/types/domain.types'
import Link from 'next/link'
import { useCandidateAuth } from '@/hooks/useCandidateAuth'

export default function ApplicationForm({ job, companySlug, companyName }: { job?: Job, companySlug?: string, companyName?: string }) {
  const { register, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [candidateToken, setCandidateToken] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [passportPhotoUrl, setPassportPhotoUrl] = useState<string | null>(null)
  const [isUploadingResume, setIsUploadingResume] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)

  const resumeInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const { candidate, isLoading, isLoggedIn, logout } = useCandidateAuth()
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

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

  const missingFields = useMemo(() => {
    if (!candidate) return config;
    return {
      requireFullName: config.requireFullName && !candidate.name,
      requireMobileNumber: config.requireMobileNumber && !candidate.phone,
      requireDate: config.requireDate, // Date is usually per application
      requireLinkedin: config.requireLinkedin && !candidate.linkedinUrl,
      requireGithub: config.requireGithub && !candidate.githubUrl,
      requirePortfolio: config.requirePortfolio && !candidate.portfolioUrl,
      requireResume: config.requireResume && !candidate.resumeUrl,
      requirePassportPhoto: config.requirePassportPhoto && !candidate.avatar,
      requireSignature: config.requireSignature, // Signature is usually per application
    }
  }, [candidate, config]);

  const hasMissingFields = useMemo(() => {
    return Object.values(missingFields).some((isRequired) => isRequired);
  }, [missingFields]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'resume' | 'photo') => {
    const file = e.target.files?.[0]
    if (!file) return

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
    if (missingFields.requireResume && !resumeUrl) {
      alert("Please upload your resume first.")
      return
    }
    if (missingFields.requirePassportPhoto && !passportPhotoUrl) {
      alert("Please upload your passport photo first.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg('')
    
    try {
      let aiResult = {
        aiScore: 0,
        skillsMatch: 0,
        experienceMatch: 0,
        educationMatch: 0,
        keywordsMatch: 0,
        strengths: [] as string[],
        gaps: [] as string[],
        reasons: [] as Array<{ text: string; positive: boolean }>,
        extractedSkills: [] as string[],
        extractedCompanies: [] as string[],
        extractedEducation: [] as string[],
      }
      
      const finalResumeUrl = resumeUrl || candidate?.resumeUrl;

      if (finalResumeUrl && job) {
        // Run AI Resume Scanning & Scoring
        const scoreRes = await fetch('/api/candidates/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeUrl: finalResumeUrl, job })
        })
        if (scoreRes.ok) {
          const scored = await scoreRes.json()
          aiResult = { ...aiResult, ...scored }
        } else {
          console.error("AI scoring failed", await scoreRes.text())
        }
      }

      const candidateName = config.requireFullName && data.fullName 
        ? data.fullName 
        : `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Unknown'

      const candidateData = {
        name: candidate ? candidate.name : candidateName,
        email: candidate ? candidate.email : data.email,
        phone: data.phone || candidate?.phone || '',
        avatar: passportPhotoUrl || candidate?.avatar || '',
        role: job?.title || 'Unknown Role',
        jobId: job?.id || '',
        stage: 'Screening',
        source: 'Career Site',
        aiScore: aiResult.aiScore || 0,
        skillsMatch: aiResult.skillsMatch || 0,
        experienceMatch: aiResult.experienceMatch || 0,
        educationMatch: aiResult.educationMatch || 0,
        keywordsMatch: aiResult.keywordsMatch || 0,
        daysInStage: 0,
        appliedAt: new Date().toISOString(),
        notes: [],
        timeline: [{ event: 'Applied via Career Site', date: 'Just now', type: 'applied' }],
        extractedSkills: aiResult.extractedSkills || [],
        extractedCompanies: aiResult.extractedCompanies || [],
        extractedEducation: aiResult.extractedEducation || [],
        strengths: aiResult.strengths || [],
        gaps: aiResult.gaps || [],
        reasons: aiResult.reasons || [],
        linkedinUrl: data.linkedin || candidate?.linkedinUrl,
        githubUrl: data.github || candidate?.githubUrl,
        portfolioUrl: data.portfolio || candidate?.portfolioUrl,
        resumeUrl: finalResumeUrl,
        passportPhotoUrl: passportPhotoUrl || candidate?.avatar,
        signature: data.signature,
        availableStartDate: data.startDate,
      }

      const postRes = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(candidateData)
      })

      const resData = await postRes.json()

      if (!postRes.ok) {
        if (resData.requireLogin) {
          setErrorMsg(resData.error);
        } else {
          setErrorMsg(resData.error || 'Failed to submit application');
        }
        return;
      }
      
      if (resData.portalToken) {
        setCandidateToken(resData.portalToken)
      }
      setSubmitted(true)
    } catch (err: any) {
      console.error(err)
      setErrorMsg("An error occurred while submitting your application.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-[32px] h-[32px] text-blue-600 animate-spin" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <CheckCircle className="w-[64px] h-[64px] text-emerald-500 animate-spring-in mb-[16px]" />
        <h2 className="font-display text-[28px] font-bold text-neutral-900">
          Application Submitted!
        </h2>
        <p className="font-body text-[15px] text-neutral-500 mt-[12px] max-w-[400px]">
          Thank you for applying to {companyName || 'our company'}. We've sent an update to your Candidate Portal.
        </p>
        
        {candidateToken && (
          <div className="mt-[24px] p-[16px] bg-neutral-50 rounded-xl border border-neutral-200 w-full max-w-[300px]">
            <p className="font-body text-[12px] text-neutral-500 font-semibold uppercase tracking-wider mb-[4px]">Your Portal Access Code</p>
            <p className="font-mono text-[24px] font-bold text-neutral-900 tracking-widest">{candidateToken}</p>
            <p className="font-body text-[11px] text-neutral-400 mt-[8px]">Save this code to log in later.</p>
          </div>
        )}

        <Link
          href="/candidate/dashboard"
          className="mt-[32px] h-[48px] px-[32px] bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-xl transition-colors flex items-center gap-[8px]"
        >
          View Candidate Dashboard <ArrowRight size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[24px]">
      {!isLoggedIn && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-[16px] flex flex-col sm:flex-row items-center justify-between gap-[12px]">
          <div className="flex items-center gap-[12px]">
            <div className="w-[40px] h-[40px] rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <LogIn size={20} />
            </div>
            <div>
              <p className="font-body font-semibold text-neutral-900 text-[14px]">Applied here before?</p>
              <p className="font-body text-neutral-600 text-[13px]">Log in to auto-fill your details and 1-Click Apply.</p>
            </div>
          </div>
          <Link
            href={`/candidate/login?redirect=${encodeURIComponent(currentPath)}`}
            className="w-full sm:w-auto px-[20px] h-[36px] bg-white border border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 font-semibold text-[13px] rounded-lg transition-colors flex items-center justify-center"
          >
            Log In to Apply
          </Link>
        </div>
      )}

      {isLoggedIn && candidate && (
        <div className="bg-white border border-neutral-200 rounded-xl p-[24px] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-[16px]">
            {candidate.avatar ? (
              <img src={candidate.avatar} alt={candidate.name} className="w-[56px] h-[56px] rounded-full object-cover border border-neutral-100" />
            ) : (
              <div className="w-[56px] h-[56px] rounded-full bg-blue-600 flex items-center justify-center text-white font-display font-bold text-[20px]">
                {candidate.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-body font-semibold text-neutral-900 text-[18px]">Welcome back, {candidate.name}!</p>
              <p className="font-body text-neutral-500 text-[14px]">{candidate.email}</p>
            </div>
          </div>
          <button onClick={logout} className="text-neutral-400 hover:text-neutral-700 font-body text-[13px] transition-colors underline">
            Not you?
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-[16px] flex items-start gap-[12px]">
          <AlertCircle className="w-[20px] h-[20px] text-red-600 shrink-0 mt-[2px]" />
          <div>
            <p className="font-body font-semibold text-red-900 text-[14px]">Submission Failed</p>
            <p className="font-body text-red-700 text-[13px]">{errorMsg}</p>
            {errorMsg.includes('log in first') && (
              <Link href={`/candidate/login?redirect=${encodeURIComponent(currentPath)}`} className="text-red-700 underline text-[13px] font-semibold mt-[4px] block">
                Go to Login Page
              </Link>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 flex flex-col gap-[24px]">
        {isLoggedIn && candidate && !hasMissingFields && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-[24px] text-center flex flex-col items-center">
             <CheckCircle className="w-[32px] h-[32px] text-emerald-500 mb-[12px]" />
             <h3 className="font-display text-[18px] font-bold text-neutral-900">1-Click Apply Ready</h3>
             <p className="font-body text-neutral-600 text-[14px] mt-[4px] max-w-[400px]">
               We have all the information we need. Click the button below to submit your application using your saved profile.
             </p>
          </div>
        )}

        {(!isLoggedIn || hasMissingFields) && (
          <>
            {isLoggedIn && hasMissingFields && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-[16px]">
                <p className="font-body font-semibold text-amber-900 text-[14px]">Additional Details Required</p>
                <p className="font-body text-amber-800 text-[13px]">This position requires a few details you haven't provided yet.</p>
              </div>
            )}

            {(missingFields.requireFullName || missingFields.requireMobileNumber) && (
              <h3 className="font-display text-[20px] font-bold text-neutral-900">Personal Information</h3>
            )}
            
            {missingFields.requireFullName && (
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Full Name <span className="text-red-500">*</span></label>
                <input required {...register('fullName')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            )}

            {!isLoggedIn && (
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Email Address <span className="text-red-500">*</span></label>
                <input type="email" required {...register('email')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            )}

            {missingFields.requireMobileNumber && (
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Mobile Number <span className="text-red-500">*</span></label>
                <input type="tel" required {...register('phone')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            )}

            {missingFields.requireDate && (
              <div className="flex flex-col gap-[6px]">
                <label className="font-body text-[13px] font-semibold text-neutral-700">Available Start Date <span className="text-red-500">*</span></label>
                <input type="date" required {...register('startDate')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
            )}

            {(missingFields.requireLinkedin || missingFields.requireGithub || missingFields.requirePortfolio) && (
              <>
                <h3 className="font-display text-[20px] font-bold text-neutral-900 mt-[8px]">Links & Profiles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  {missingFields.requireLinkedin && (
                    <div className="flex flex-col gap-[6px]">
                      <label className="font-body text-[13px] font-semibold text-neutral-700">LinkedIn Profile URL <span className="text-red-500">*</span></label>
                      <input type="url" required {...register('linkedin')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                  )}
                  {missingFields.requireGithub && (
                    <div className="flex flex-col gap-[6px]">
                      <label className="font-body text-[13px] font-semibold text-neutral-700">GitHub Profile URL <span className="text-red-500">*</span></label>
                      <input type="url" required {...register('github')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                  )}
                  {missingFields.requirePortfolio && (
                    <div className="flex flex-col gap-[6px]">
                      <label className="font-body text-[13px] font-semibold text-neutral-700">Portfolio URL <span className="text-red-500">*</span></label>
                      <input type="url" required {...register('portfolio')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
                    </div>
                  )}
                </div>
              </>
            )}

            {(missingFields.requireResume || missingFields.requirePassportPhoto) && (
              <>
                <h3 className="font-display text-[20px] font-bold text-neutral-900 mt-[8px]">Documents & Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  {missingFields.requireResume && (
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
                  
                  {missingFields.requirePassportPhoto && (
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

            {missingFields.requireSignature && (
              <>
                <h3 className="font-display text-[20px] font-bold text-neutral-900 mt-[8px]">Signature</h3>
                <div className="flex flex-col gap-[6px]">
                  <label className="font-body text-[13px] font-semibold text-neutral-700">Digital Signature (Type your full legal name) <span className="text-red-500">*</span></label>
                  <input required {...register('signature')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-serif italic text-[16px]" placeholder="John Doe" />
                </div>
              </>
            )}
          </>
        )}

        <div className="mt-[8px] bg-neutral-50 p-[16px] rounded-lg border border-neutral-200">
          <p className="font-body text-[12px] text-neutral-500 leading-relaxed">
            By submitting this application, you agree to {companyName || 'our'} Privacy Policy and consent to the processing of your personal data.
          </p>
        </div>

        <button type="submit" disabled={isSubmitting || isUploadingResume || isUploadingPhoto} className="w-full h-[56px] flex items-center justify-center gap-[8px] bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[16px] rounded-xl shadow-sm transition-colors mt-[8px] disabled:opacity-70">
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          {isSubmitting ? 'Submitting & Analyzing Resume...' : (isLoggedIn && !hasMissingFields ? '1-Click Apply Now' : 'Submit Application')}
        </button>
      </form>
    </div>
  )
}
