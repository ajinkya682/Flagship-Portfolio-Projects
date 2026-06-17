"use client"

import * as React from "react"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface JobData {
  title: string
  department: string
  location: string
  employmentType: string
  remoteType: string
  salaryMin: string
  salaryMax: string
  currency: string
  description: string
  skills: string[]
  experience: string
  education: string
  niceToHave: string[]
  weights: { skills: number; experience: number; education: number }
  customFields: any[]
}

interface StepBasicInfoProps {
  data: JobData
  updateData: (updates: Partial<JobData>) => void
  onNext: () => void
  onCancel: () => void
}

export function StepBasicInfo({ data, updateData, onNext, onCancel }: StepBasicInfoProps) {
  return (
    <div className="flex flex-col animate-fade-slide-up">
      <h4 className="mb-[24px] font-display text-[18px] font-semibold text-neutral-900">
        Job basics
      </h4>

      <div className="flex flex-col gap-[20px]">
        
        {/* Title */}
        <div className="flex flex-col gap-[6px]">
          <Label htmlFor="title">Job Title</Label>
          <Input 
            id="title" 
            placeholder="e.g. Senior Frontend Engineer" 
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
          />
        </div>

        {/* Dept & Location */}
        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <Label>Department</Label>
            <Select value={data.department} onValueChange={(val) => updateData({ department: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-[6px]">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="e.g. San Francisco, CA" 
              value={data.location}
              onChange={(e) => updateData({ location: e.target.value })}
            />
          </div>
        </div>

        {/* Employment & Remote */}
        <div className="grid grid-cols-2 gap-[16px]">
          <div className="flex flex-col gap-[6px]">
            <Label>Employment Type</Label>
            <Select value={data.employmentType} onValueChange={(val) => updateData({ employmentType: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-[6px]">
            <Label>Remote Type</Label>
            <Select value={data.remoteType} onValueChange={(val) => updateData({ remoteType: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select remote policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="remote">Fully Remote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Salary */}
        <div className="flex flex-col gap-[6px]">
          <Label>Salary Range</Label>
          <div className="grid grid-cols-3 gap-[16px]">
            <Input 
              placeholder="Min (e.g. 120,000)" 
              value={data.salaryMin}
              onChange={(e) => updateData({ salaryMin: e.target.value })}
            />
            <Input 
              placeholder="Max (e.g. 160,000)" 
              value={data.salaryMax}
              onChange={(e) => updateData({ salaryMax: e.target.value })}
            />
            <Select value={data.currency} onValueChange={(val) => updateData({ currency: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

      </div>

      <div className="mt-[40px] flex items-center justify-between border-t border-neutral-200 pt-[24px]">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onNext} iconRight={<ArrowRight size={16} />}>
          Next: Description
        </Button>
      </div>

    </div>
  )
}
