"use client"

import * as React from "react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { AIDescriptionModal } from "./AIDescriptionModal"
import { BiasWarningPanel } from "./BiasWarningPanel"
import type { JobData } from "./StepBasicInfo"

interface StepDescriptionProps {
  data: JobData
  updateData: (updates: Partial<JobData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepDescription({ data, updateData, onNext, onBack }: StepDescriptionProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [showBiasWarning, setShowBiasWarning] = React.useState(false)

  const handleBlur = () => {
    // Simulate detecting a bias issue only if there is some content
    if (data.description.length > 50 && !showBiasWarning && data.description.includes("rockstar")) {
      setShowBiasWarning(true)
    } else if (data.description.length > 100 && !showBiasWarning) {
      // Just randomly show it for demo purposes if it's long enough
      setShowBiasWarning(true)
    }
  }

  const handleAIResult = (html: string) => {
    updateData({ description: html })
    setIsModalOpen(false)
    setShowBiasWarning(false) // Reset warnings on new generated content
  }

  const mockFlags = [
    {
      phrase: "digital native",
      category: "Age Bias",
      suggestion: "Consider replacing with 'tech-savvy' or 'digitally fluent'."
    },
    {
      phrase: "rockstar developer",
      category: "Gender Bias",
      suggestion: "This term historically skews male. Try 'excellent developer' or 'high-performing engineer'."
    }
  ]

  return (
    <div className="flex flex-col animate-fade-slide-up">
      <h4 className="mb-[24px] font-display text-[18px] font-semibold text-neutral-900">
        Job description
      </h4>

      <div className="mb-[12px] flex justify-end">
        <Button 
          className="bg-accent-500 text-white hover:bg-accent-600"
          iconLeft={<Sparkles size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Generate with AI
        </Button>
      </div>

      <div className="flex flex-col" onBlur={handleBlur}>
        <RichTextEditor 
          value={data.description} 
          onChange={(html) => updateData({ description: html })}
        />
      </div>

      {showBiasWarning && (
        <BiasWarningPanel 
          flags={mockFlags}
          onFixAll={() => setShowBiasWarning(false)}
          onIgnore={() => setShowBiasWarning(false)}
        />
      )}

      <div className="mt-[40px] flex items-center justify-between border-t border-neutral-200 pt-[24px]">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button variant="primary" onClick={onNext} iconRight={<ArrowRight size={16} />}>
          Next: Requirements
        </Button>
      </div>

      <AIDescriptionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAccept={handleAIResult}
      />
    </div>
  )
}
