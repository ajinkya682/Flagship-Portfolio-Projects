"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface JobWizardProgressProps {
  currentStep: number // 1 to 5
}

export function JobWizardProgress({ currentStep }: JobWizardProgressProps) {
  const steps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Description" },
    { num: 3, label: "Requirements" },
    { num: 4, label: "Application Form" },
    { num: 5, label: "Review" },
  ]

  return (
    <div className="mt-[24px] mb-[32px] w-full">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute left-0 top-[14px] w-full h-[2px] bg-neutral-200" />
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.num
          const isActive = currentStep === step.num
          const isFuture = currentStep < step.num

          return (
            <div key={step.num} className="relative flex flex-col items-center group">
              {/* Connector line overlay for completed sections */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "absolute left-[50%] top-[14px] h-[2px] w-full transition-colors duration-300",
                    isCompleted ? "bg-accent-500" : "bg-transparent"
                  )}
                  style={{ width: "calc(100% + 40px)" }} // Approx distance to next node depending on container width
                />
              )}

              <div 
                className={cn(
                  "relative z-10 flex h-[28px] w-[28px] items-center justify-center rounded-full border-2 transition-all duration-300",
                  isCompleted ? "border-accent-500 bg-accent-500 text-white" :
                  isActive ? "border-primary-500 bg-white text-primary-500" :
                  "border-neutral-300 bg-white text-neutral-400"
                )}
              >
                {isCompleted ? (
                  <Check size={14} className="stroke-[3]" />
                ) : (
                  <span className="font-display text-[12px] font-bold">{step.num}</span>
                )}
              </div>
              <span 
                className={cn(
                  "absolute top-[36px] w-[120px] text-center font-body text-[12px] whitespace-nowrap transition-colors duration-300",
                  isCompleted ? "font-medium text-accent-700" :
                  isActive ? "font-bold text-primary-600" :
                  "font-medium text-neutral-400"
                )}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
