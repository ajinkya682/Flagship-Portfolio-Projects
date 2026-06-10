"use client"

import * as React from "react"
import { ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScoringRubric } from "./ScoringRubric"
import type { JobData } from "./StepBasicInfo"

interface StepRequirementsProps {
  data: JobData
  updateData: (updates: Partial<JobData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepRequirements({ data, updateData, onNext, onBack }: StepRequirementsProps) {
  const [isRubricValid, setIsRubricValid] = React.useState(true)
  const [skillInput, setSkillInput] = React.useState("")
  const [niceInput, setNiceInput] = React.useState("")

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault()
      if (!data.skills.includes(skillInput.trim())) {
        updateData({ skills: [...data.skills, skillInput.trim()] })
      }
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    updateData({ skills: data.skills.filter(s => s !== skill) })
  }

  const handleAddNice = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && niceInput.trim()) {
      e.preventDefault()
      if (!data.niceToHave.includes(niceInput.trim())) {
        updateData({ niceToHave: [...data.niceToHave, niceInput.trim()] })
      }
      setNiceInput("")
    }
  }

  const handleRemoveNice = (skill: string) => {
    updateData({ niceToHave: data.niceToHave.filter(s => s !== skill) })
  }

  return (
    <div className="flex flex-col animate-fade-slide-up">
      <h4 className="mb-[24px] font-display text-[18px] font-semibold text-neutral-900">
        What you're looking for
      </h4>

      <div className="flex flex-col gap-[24px]">
        
        {/* Required Skills */}
        <div className="flex flex-col gap-[8px]">
          <Label>Must-have Skills</Label>
          <div className="flex flex-col gap-[8px]">
            <Input 
              placeholder="Type a skill and press Enter..." 
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleAddSkill}
            />
            {data.skills.length > 0 && (
              <div className="flex flex-wrap gap-[8px]">
                {data.skills.map(skill => (
                  <div key={skill} className="flex h-[28px] items-center gap-[4px] rounded-full bg-primary-50 pl-[12px] pr-[4px] font-body text-[13px] font-medium text-primary-700">
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      className="flex h-[20px] w-[20px] items-center justify-center rounded-full hover:bg-primary-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[16px]">
          {/* Experience */}
          <div className="flex flex-col gap-[8px]">
            <Label>Years of Experience</Label>
            <Select value={data.experience} onValueChange={(val) => updateData({ experience: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 years</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-8">5-8 years</SelectItem>
                <SelectItem value="8+">8+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Education */}
          <div className="flex flex-col gap-[8px]">
            <Label>Education Requirement</Label>
            <Select value={data.education} onValueChange={(val) => updateData({ education: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select education" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No requirement</SelectItem>
                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                <SelectItem value="masters">Master's Degree</SelectItem>
                <SelectItem value="phd">PhD</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nice-to-have Skills */}
        <div className="flex flex-col gap-[8px]">
          <Label>Nice-to-have Skills</Label>
          <div className="flex flex-col gap-[8px]">
            <Input 
              placeholder="Type a skill and press Enter..." 
              value={niceInput}
              onChange={(e) => setNiceInput(e.target.value)}
              onKeyDown={handleAddNice}
            />
            {data.niceToHave.length > 0 && (
              <div className="flex flex-wrap gap-[8px]">
                {data.niceToHave.map(skill => (
                  <div key={skill} className="flex h-[28px] items-center gap-[4px] rounded-full bg-neutral-100 pl-[12px] pr-[4px] font-body text-[13px] font-medium text-neutral-700">
                    {skill}
                    <button 
                      onClick={() => handleRemoveNice(skill)}
                      className="flex h-[20px] w-[20px] items-center justify-center rounded-full hover:bg-neutral-200"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scoring Rubric */}
        <div className="mt-[8px] pt-[24px] border-t border-neutral-200">
          <ScoringRubric 
            weights={data.weights}
            onWeightsChange={(weights) => updateData({ weights })}
            onValidityChange={setIsRubricValid}
          />
        </div>

      </div>

      <div className="mt-[40px] flex items-center justify-between border-t border-neutral-200 pt-[24px]">
        <Button variant="ghost" onClick={onBack}>
          Back
        </Button>
        <Button 
          variant="primary" 
          onClick={onNext} 
          iconRight={<ArrowRight size={16} />}
          disabled={!isRubricValid}
        >
          Next: Application Form
        </Button>
      </div>
    </div>
  )
}
