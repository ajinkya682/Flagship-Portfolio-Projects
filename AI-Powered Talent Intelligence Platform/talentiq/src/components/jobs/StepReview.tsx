"use client"

import * as React from "react"
import { Copy, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { JobData } from "./StepBasicInfo"

interface StepReviewProps {
  data: JobData
  onEditStep: (step: number) => void
  onPublish: () => void
  onSaveDraft: () => void
}

export function StepReview({ data, onEditStep, onPublish, onSaveDraft }: StepReviewProps) {
  const [isWarningModalOpen, setIsWarningModalOpen] = React.useState(false)

  const handlePublishClick = () => {
    // Simulate detecting an un-fixed bias issue
    if (data.description.includes("rockstar")) {
      setIsWarningModalOpen(true)
    } else {
      onPublish()
    }
  }

  return (
    <div className="flex flex-col animate-fade-slide-up">
      <div className="mb-[24px]">
        <h4 className="font-display text-[18px] font-semibold text-neutral-900">
          Review and publish
        </h4>
        <p className="mt-[4px] font-body text-[14px] text-neutral-500">
          Everything looks good? Publish when you're ready.
        </p>
      </div>

      <div className="flex flex-col gap-[16px]">
        
        {/* Basic Info Card */}
        <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[20px] shadow-sm">
          <div className="flex items-center justify-between mb-[16px]">
            <h5 className="font-display text-[15px] font-semibold text-neutral-900">Basic Info</h5>
            <button onClick={() => onEditStep(1)} className="font-body text-[13px] font-medium text-primary-600 hover:text-primary-700 hover:underline">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-y-[12px]">
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Title</span>
              <span className="font-body text-[14px] text-neutral-900">{data.title || "Not specified"}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Location</span>
              <span className="font-body text-[14px] text-neutral-900">{data.location || "Not specified"} ({data.remoteType})</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Department</span>
              <span className="font-body text-[14px] text-neutral-900 capitalize">{data.department || "Not specified"}</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Salary</span>
              <span className="font-body text-[14px] text-neutral-900">
                {data.salaryMin} - {data.salaryMax} {data.currency}
              </span>
            </div>
          </div>
        </div>

        {/* Requirements Card */}
        <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[20px] shadow-sm">
          <div className="flex items-center justify-between mb-[16px]">
            <h5 className="font-display text-[15px] font-semibold text-neutral-900">Requirements</h5>
            <button onClick={() => onEditStep(3)} className="font-body text-[13px] font-medium text-primary-600 hover:text-primary-700 hover:underline">Edit</button>
          </div>
          <div className="grid grid-cols-2 gap-y-[12px]">
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Experience</span>
              <span className="font-body text-[14px] text-neutral-900">{data.experience} years</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Education</span>
              <span className="font-body text-[14px] text-neutral-900 capitalize">{data.education}</span>
            </div>
            <div className="flex flex-col gap-[4px] col-span-2">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Skills</span>
              <div className="flex flex-wrap gap-[6px]">
                {data.skills.map(s => (
                  <span key={s} className="rounded-full bg-primary-50 px-[8px] py-[2px] font-body text-[11px] font-medium text-primary-700">{s}</span>
                ))}
                {data.skills.length === 0 && <span className="font-body text-[14px] text-neutral-500">None</span>}
              </div>
            </div>
          </div>
        </div>

        {/* AI Scoring Rubric Card */}
        <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[20px] shadow-sm">
          <div className="flex items-center justify-between mb-[16px]">
            <h5 className="font-display text-[15px] font-semibold text-neutral-900">AI Scoring Rubric</h5>
            <button onClick={() => onEditStep(3)} className="font-body text-[13px] font-medium text-primary-600 hover:text-primary-700 hover:underline">Edit</button>
          </div>
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Skills Weight</span>
              <span className="font-body text-[16px] font-semibold text-neutral-900">{data.weights.skills}%</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Experience</span>
              <span className="font-body text-[16px] font-semibold text-neutral-900">{data.weights.experience}%</span>
            </div>
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Education</span>
              <span className="font-body text-[16px] font-semibold text-neutral-900">{data.weights.education}%</span>
            </div>
          </div>
        </div>

        {/* Public URL Card */}
        <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-50 p-[20px]">
          <h5 className="font-display text-[14px] font-semibold text-neutral-900 mb-[8px]">Job URL</h5>
          <div className="flex gap-[8px]">
            <Input readOnly value="https://jobs.talentiq.com/senior-frontend-eng" className="bg-white text-neutral-600" />
            <Button variant="secondary" className="w-[40px] px-0 shrink-0">
              <Copy size={16} />
            </Button>
          </div>
        </div>

      </div>

      <div className="mt-[40px] flex items-center justify-between border-t border-neutral-200 pt-[24px]">
        <Button variant="ghost" onClick={onSaveDraft}>
          Save as Draft
        </Button>
        <Button variant="primary" className="h-[44px] px-8 text-[15px]" onClick={handlePublishClick}>
          Publish Job
        </Button>
      </div>

      {/* Bias Warning Modal */}
      <Dialog open={isWarningModalOpen} onOpenChange={setIsWarningModalOpen}>
        <DialogContent className="sm:max-w-[460px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-[12px] font-display text-[20px] font-semibold text-neutral-900">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-warning-100">
                <AlertTriangle size={20} className="text-warning-600" />
              </div>
              Publish with flagged content?
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-[16px] flex flex-col gap-[12px]">
            <p className="font-body text-[14px] text-neutral-600">
              Our AI detected potential bias in your job description that might deter qualified candidates from applying.
            </p>
            
            <div className="mt-[8px] rounded-[var(--radius-md)] bg-[#FFFBEB] p-[12px] border border-[#F59E0B]">
              <span className="font-body text-[13px] font-semibold text-neutral-900">
                "rockstar developer"
              </span>
              <p className="mt-[4px] font-body text-[13px] text-neutral-600">
                This term historically skews male. Try 'excellent developer' or 'high-performing engineer'.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-[12px] mt-[16px]">
            <Button variant="ghost" className="text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626]" onClick={onPublish}>
              Publish Anyway
            </Button>
            <Button variant="primary" onClick={() => { setIsWarningModalOpen(false); onEditStep(2) }}>
              Fix Issues First
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
