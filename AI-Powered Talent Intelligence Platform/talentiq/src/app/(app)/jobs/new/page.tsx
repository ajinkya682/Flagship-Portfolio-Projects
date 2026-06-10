"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import confetti from "canvas-confetti"

import { JobWizardProgress } from "@/components/jobs/JobWizardProgress"
import { StepBasicInfo, type JobData } from "@/components/jobs/StepBasicInfo"
import { StepDescription } from "@/components/jobs/StepDescription"
import { StepRequirements } from "@/components/jobs/StepRequirements"
import { StepApplicationForm } from "@/components/jobs/StepApplicationForm"
import { StepReview } from "@/components/jobs/StepReview"

export default function JobCreationWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState(1)
  
  const [jobData, setJobData] = React.useState<JobData>({
    title: "",
    department: "",
    location: "",
    employmentType: "",
    remoteType: "",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    description: "",
    skills: [],
    experience: "",
    education: "",
    niceToHave: [],
    weights: { skills: 60, experience: 20, education: 20 },
    customFields: [
      { id: "custom_1", label: "Portfolio URL", type: "text" },
      { id: "custom_2", label: "Will you require sponsorship?", type: "boolean" }
    ]
  })

  const updateData = (updates: Partial<JobData>) => {
    setJobData((prev) => ({ ...prev, ...updates }))
  }

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 5))
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))
  
  const handlePublish = () => {
    // Fire confetti and route back to dashboard
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2563EB', '#10B981', '#3B82F6', '#6EE7B7']
    })
    
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-neutral-100 px-[20px] py-[32px] custom-scrollbar">
      <div className="flex w-full max-w-[800px] flex-col">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-[12px] mb-[8px]">
          <Link href="/jobs" className="flex items-center font-body text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft size={14} className="mr-1" /> Back to Jobs
          </Link>
          <span className="text-neutral-300">/</span>
          <span className="font-body text-[13px] font-medium text-neutral-900">
            Create new job
          </span>
        </div>

        <h1 className="font-display text-[28px] font-bold text-neutral-900">
          Create new job
        </h1>

        {/* Wizard Progress */}
        <JobWizardProgress currentStep={currentStep} />

        {/* Wizard Content Container */}
        <div className="rounded-[var(--radius-xl)] border border-neutral-200 bg-white p-[32px] shadow-sm min-h-[400px]">
          
          {currentStep === 1 && (
            <StepBasicInfo 
              data={jobData} 
              updateData={updateData} 
              onNext={handleNext}
              onCancel={() => router.push("/jobs")}
            />
          )}

          {currentStep === 2 && (
            <StepDescription 
              data={jobData} 
              updateData={updateData} 
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <StepRequirements 
              data={jobData} 
              updateData={updateData} 
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <StepApplicationForm 
              data={jobData} 
              updateData={updateData} 
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <StepReview 
              data={jobData} 
              onEditStep={(step) => setCurrentStep(step)}
              onSaveDraft={() => router.push("/dashboard")}
              onPublish={handlePublish}
            />
          )}

        </div>

      </div>
    </div>
  )
}
