"use client"

import * as React from "react"
import { ChevronDown, ChevronRight, AlertCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface Weights {
  skills: number
  experience: number
  education: number
}

interface ScoringRubricProps {
  weights: Weights
  onWeightsChange: (weights: Weights) => void
  onValidityChange: (isValid: boolean) => void
}

export function ScoringRubric({ weights, onWeightsChange, onValidityChange }: ScoringRubricProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const total = weights.skills + weights.experience + weights.education
  const isValid = total === 100

  React.useEffect(() => {
    onValidityChange(isValid)
  }, [isValid, onValidityChange])

  return (
    <div className="flex flex-col mt-[8px]">
      
      {/* Toggle Row */}
      <button 
        className="flex items-center gap-[8px] text-left hover:opacity-80 transition-opacity"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-body text-[14px] font-semibold text-neutral-900">
          Advanced: Customize AI scoring weights
        </span>
        {isExpanded ? (
          <ChevronDown size={16} className="text-neutral-500" />
        ) : (
          <ChevronRight size={16} className="text-neutral-500" />
        )}
      </button>

      {/* Expanded Content */}
      <div 
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isExpanded ? "grid-rows-[1fr] opacity-100 mt-[16px]" : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden flex flex-col gap-[20px] rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-50 p-[20px]">
          
          <div className="flex flex-col gap-[16px]">
            {/* Skills Slider */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex justify-between items-center">
                <Label>Skills Match Weight</Label>
                <span className="font-body text-[13px] font-semibold text-neutral-700">{weights.skills}%</span>
              </div>
              <Slider 
                value={[weights.skills]}
                min={0}
                max={100}
                step={5}
                onValueChange={(vals) => onWeightsChange({ ...weights, skills: vals[0] })}
              />
            </div>

            {/* Experience Slider */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex justify-between items-center">
                <Label>Experience Weight</Label>
                <span className="font-body text-[13px] font-semibold text-neutral-700">{weights.experience}%</span>
              </div>
              <Slider 
                value={[weights.experience]}
                min={0}
                max={100}
                step={5}
                onValueChange={(vals) => onWeightsChange({ ...weights, experience: vals[0] })}
              />
            </div>

            {/* Education Slider */}
            <div className="flex flex-col gap-[8px]">
              <div className="flex justify-between items-center">
                <Label>Education Weight</Label>
                <span className="font-body text-[13px] font-semibold text-neutral-700">{weights.education}%</span>
              </div>
              <Slider 
                value={[weights.education]}
                min={0}
                max={100}
                step={5}
                onValueChange={(vals) => onWeightsChange({ ...weights, education: vals[0] })}
              />
            </div>
          </div>

          {/* Validation Message */}
          <div className="flex items-center gap-[8px] border-t border-neutral-200 pt-[16px]">
            <span className="font-body text-[13px] font-medium text-neutral-700">
              Total Weight: <span className={cn("font-bold", isValid ? "text-primary-600" : "text-[#EF4444]")}>{total}%</span>
            </span>
            
            {!isValid && (
              <div className="ml-auto flex items-center gap-[6px] text-[#EF4444]">
                <AlertCircle size={14} />
                <span className="font-body text-[12px] font-medium">
                  Weights must add up to 100% (currently {total}%)
                </span>
              </div>
            )}
            {isValid && (
              <div className="ml-auto flex items-center gap-[6px] text-accent-600">
                <span className="font-body text-[12px] font-medium">Valid allocation</span>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}
