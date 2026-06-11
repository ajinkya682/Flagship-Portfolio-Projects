'use client'

import { useState } from 'react'
import { UploadCloud, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

export default function ApplicationForm() {
  const { register, handleSubmit } = useForm()
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = (data: any) => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
    }, 1500)
  }

  if (submitted) {
    return (
      <div className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <CheckCircle className="w-[64px] h-[64px] text-accent-500 animate-spring-in" />
        <h2 className="font-display text-[28px] font-bold text-neutral-900 mt-[24px]">
          Application Submitted!
        </h2>
        <p className="font-body text-[15px] text-neutral-500 mt-[12px]">
          Thank you for applying. Your application ID is <strong className="text-neutral-900">#APP-9824</strong>.
        </p>
        <button
          onClick={() => window.location.href = '/status'}
          className="mt-[32px] h-[44px] px-[24px] bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors"
        >
          Track Status
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-[32px] md:p-[48px] rounded-[24px] shadow-sm border border-neutral-100 flex flex-col gap-[24px]">
      <h3 className="font-display text-[20px] font-bold text-neutral-900">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">First Name <span className="text-red-500">*</span></label>
          <input required {...register('firstName')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="font-body text-[13px] font-semibold text-neutral-700">Last Name <span className="text-red-500">*</span></label>
          <input required {...register('lastName')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
        </div>
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="font-body text-[13px] font-semibold text-neutral-700">Email Address <span className="text-red-500">*</span></label>
        <input type="email" required {...register('email')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
      </div>

      <div className="flex flex-col gap-[6px]">
        <label className="font-body text-[13px] font-semibold text-neutral-700">LinkedIn Profile URL</label>
        <input type="url" {...register('linkedin')} className="h-[44px] px-[12px] border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
      </div>

      <h3 className="font-display text-[20px] font-bold text-neutral-900 mt-[8px]">Resume / CV</h3>
      <div className="w-full border-2 border-dashed border-neutral-200 hover:border-primary-500 hover:bg-primary-50/50 rounded-xl p-[32px] flex flex-col items-center justify-center cursor-pointer transition-colors">
        <UploadCloud className="w-[32px] h-[32px] text-primary-600 mb-[12px]" />
        <p className="font-body text-[14px] font-semibold text-neutral-900">Click to upload or drag and drop</p>
        <p className="font-body text-[12px] text-neutral-500 mt-[4px]">PDF or DOCX (max 5MB)</p>
      </div>

      <div className="mt-[8px] bg-neutral-50 p-[16px] rounded-lg border border-neutral-200">
        <p className="font-body text-[12px] text-neutral-500 leading-relaxed">
          By submitting this application, you agree to Acme Corp&apos;s Privacy Policy and consent to the processing of your personal data. Your data will be processed securely using TalentIQ.
        </p>
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full h-[56px] bg-primary-500 hover:bg-primary-600 text-white font-semibold text-[16px] rounded-xl shadow-sm transition-colors mt-[8px] disabled:opacity-70">
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}
