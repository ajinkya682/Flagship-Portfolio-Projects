"use client"

import * as React from "react"
import { ArrowRight, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormFieldBuilder, type CustomField } from "./FormFieldBuilder"
import type { JobData } from "./StepBasicInfo"

interface StepApplicationFormProps {
  data: JobData
  updateData: (updates: Partial<JobData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepApplicationForm({ data, updateData, onNext, onBack }: StepApplicationFormProps) {
  const lockedFields = ["First Name", "Last Name", "Email Address", "Resume / CV"]

  return (
    <div className="flex flex-col animate-fade-slide-up">
      <div className="mb-[24px]">
        <h4 className="font-display text-[18px] font-semibold text-neutral-900">
          Customize your application
        </h4>
        <p className="mt-[4px] font-body text-[14px] text-neutral-500">
          Default fields are required and cannot be removed.
        </p>
      </div>

      <div className="flex flex-col gap-[8px]">
        {lockedFields.map((field) => (
          <div key={field} className="flex items-center justify-between rounded-[var(--radius-md)] border border-neutral-200 bg-neutral-50 p-[12px] opacity-70">
            <div className="flex items-center gap-[12px]">
              <Lock size={16} className="text-neutral-400" />
              <span className="font-body text-[14px] font-medium text-neutral-900">{field}</span>
            </div>
            <div className="flex h-[24px] items-center rounded-full bg-neutral-200 px-[10px] font-body text-[11px] font-semibold text-neutral-700">
              Required
            </div>
          </div>
        ))}
      </div>

      <div className="my-[24px] flex items-center gap-[16px]">
        <div className="h-px flex-1 bg-neutral-200" />
        <span className="font-body text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Custom fields
        </span>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>

      <FormFieldBuilder 
        fields={data.customFields} 
        onChange={(customFields) => updateData({ customFields })}
      />

      <div className="mt-[40px] flex items-center justify-between border-t border-neutral-200 pt-[24px]">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" onClick={onNext} iconRight={<ArrowRight size={16} />}>
          Next: Review
        </Button>
      </div>

    </div>
  )
}
