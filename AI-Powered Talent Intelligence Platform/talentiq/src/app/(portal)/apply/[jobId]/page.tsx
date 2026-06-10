"use client"

import * as React from "react"
import { CheckCircle2, UploadCloud, Link as LinkIcon, Building2, MapPin, DollarSign, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ApplyPage() {
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] p-[24px] animate-in zoom-in-95 duration-500">
        <CheckCircle2 size={48} className="text-accent-500 mb-[24px]" />
        <h3 className="font-display text-[24px] font-bold text-neutral-900 mb-[8px]">
          Application submitted
        </h3>
        <p className="font-body text-[15px] text-neutral-600 mb-[32px] text-center max-w-[400px]">
          Thank you for applying! We've received your application and will keep you updated at your email address.
        </p>
        <div className="bg-neutral-50 border border-neutral-200 rounded-[var(--radius-md)] px-[16px] py-[12px]">
          <span className="font-mono text-[13px] font-medium text-neutral-500">
            Application ID: TIQ-2026-00847
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[680px] mx-auto py-[40px] px-[24px] animate-fade-in">
      
      {/* Job Summary Card */}
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-50 p-[24px] mb-[32px]">
        <h3 className="font-display text-[20px] font-bold text-neutral-900 mb-[16px]">
          Senior React Engineer
        </h3>
        
        <div className="flex flex-wrap gap-[12px] mb-[20px]">
          <span className="flex items-center gap-[4px] font-body text-[13px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-[4px] px-[8px] py-[4px]">
            <Building2 size={14} className="text-neutral-500" /> Engineering
          </span>
          <span className="flex items-center gap-[4px] font-body text-[13px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-[4px] px-[8px] py-[4px]">
            <MapPin size={14} className="text-neutral-500" /> San Francisco, CA
          </span>
          <span className="flex items-center gap-[4px] font-body text-[13px] font-medium text-primary-700 bg-primary-50 border border-primary-200 rounded-[4px] px-[8px] py-[4px]">
            <CheckCircle2 size={14} /> Remote OK
          </span>
          <span className="flex items-center gap-[4px] font-body text-[13px] font-medium text-neutral-700 bg-white border border-neutral-200 rounded-[4px] px-[8px] py-[4px]">
            <DollarSign size={14} className="text-neutral-500" /> $150k - $180k
          </span>
        </div>

        <div className="flex items-center gap-[6px] font-body text-[12px] text-neutral-500">
          <Clock size={12} /> Posted 3 days ago
        </div>
      </div>

      <h4 className="font-display text-[18px] font-semibold text-neutral-900 mb-[20px]">
        Submit your application
      </h4>

      <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
        
        {/* Upload Zone */}
        <div className="flex flex-col items-center justify-center h-[160px] rounded-[var(--radius-lg)] border-2 border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer mb-[8px]">
          <UploadCloud size={28} className="text-neutral-400 mb-[12px]" />
          <span className="font-body text-[14px] font-semibold text-neutral-900">Upload your Resume/CV</span>
          <span className="font-body text-[13px] text-neutral-500 mt-[4px]">PDF, DOCX up to 10MB</span>
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <Label>First Name <span className="text-[#EF4444]">*</span></Label>
            <Input required />
          </div>
          <div className="flex flex-col gap-[6px]">
            <Label>Last Name <span className="text-[#EF4444]">*</span></Label>
            <Input required />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <Label>Email Address <span className="text-[#EF4444]">*</span></Label>
          <Input type="email" required />
        </div>

        <div className="flex flex-col gap-[6px]">
          <Label>Phone Number</Label>
          <Input type="tel" />
        </div>

        <div className="flex flex-col gap-[6px]">
          <Label>LinkedIn Profile</Label>
          <div className="relative">
            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input className="pl-9" placeholder="https://linkedin.com/in/..." />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <Label>Portfolio / Personal Website</Label>
          <div className="relative">
            <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input className="pl-9" placeholder="https://" />
          </div>
        </div>

        <div className="flex flex-col gap-[6px]">
          <Label>Why do you want to join Acme Corp?</Label>
          <Textarea className="min-h-[120px]" />
        </div>

        <div className="mt-[16px] mb-[24px]">
          <p className="font-body text-[12px] text-neutral-500 leading-relaxed">
            By submitting this application, you agree that your data will be processed in accordance with our <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>

        <Button type="submit" className="h-[52px] text-[15px] w-full">
          Submit Application
        </Button>

      </form>

    </div>
  )
}
