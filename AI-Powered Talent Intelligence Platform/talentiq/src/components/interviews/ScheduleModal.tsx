"use client"

import * as React from "react"
import { Search, Calendar, Clock, Video, Phone, Building2, Sparkles, ChevronDown } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIProcessingIndicator } from "@/components/ui/ai-processing"
import { cn } from "@/lib/utils"

interface ScheduleModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScheduleModal({ isOpen, onClose }: ScheduleModalProps) {
  const [locationType, setLocationType] = React.useState("video")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [questionsGenerated, setQuestionsGenerated] = React.useState(false)
  const [emailPreviewOpen, setEmailPreviewOpen] = React.useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setQuestionsGenerated(true)
    }, 3000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[720px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="font-display text-[20px] font-semibold text-neutral-900">
            Schedule an interview
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-[24px] py-[16px]">
          
          {/* Candidate Search */}
          <div className="flex flex-col gap-[8px]">
            <Label>Candidate & Role</Label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input placeholder="Search applications..." className="pl-9" defaultValue="David Kim - Senior React Engineer" />
            </div>
          </div>

          {/* Date / Time / Duration */}
          <div className="grid grid-cols-3 gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <Label>Date</Label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <Input type="date" className="pl-9" defaultValue="2026-10-20" />
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <Label>Time</Label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <Input type="time" className="pl-9" defaultValue="14:00" />
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <Label>Duration</Label>
              <Select defaultValue="60">
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Type */}
          <div className="flex flex-col gap-[8px]">
            <Label>Location Type</Label>
            <div className="grid grid-cols-3 gap-[12px]">
              {[
                { id: "video", label: "Video Call", icon: Video },
                { id: "phone", label: "Phone Screen", icon: Phone },
                { id: "onsite", label: "Onsite", icon: Building2 },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setLocationType(type.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-[8px] rounded-[var(--radius-md)] border h-[80px] transition-all",
                    locationType === type.id 
                      ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm ring-1 ring-primary-500" 
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <type.icon size={20} />
                  <span className="font-body text-[13px] font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {locationType === "video" && (
            <div className="flex flex-col gap-[8px]">
              <Label>Meeting Link</Label>
              <Input defaultValue="https://zoom.us/j/1234567890" />
            </div>
          )}

          {/* Interviewers */}
          <div className="flex flex-col gap-[8px]">
            <Label>Interviewers</Label>
            <Input placeholder="Search team members..." defaultValue="Sarah Chen (Engineering Manager)" />
          </div>

          {/* Interview Kit & AI */}
          <div className="flex flex-col gap-[8px] border-t border-neutral-200 pt-[24px]">
            <Label>Interview Kit</Label>
            <div className="flex gap-[12px]">
              <Select defaultValue="technical">
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Screen (Default)</SelectItem>
                  <SelectItem value="system">System Design</SelectItem>
                  <SelectItem value="culture">Culture Fit</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className="bg-accent-500 text-white hover:bg-accent-600"
                iconLeft={<Sparkles size={16} />}
                onClick={handleGenerate}
                disabled={isGenerating || questionsGenerated}
              >
                Generate Custom Kit
              </Button>
            </div>

            {isGenerating && (
              <div className="mt-[16px] py-[32px] rounded-[var(--radius-lg)] border border-accent-100 bg-accent-50">
                <AIProcessingIndicator message="Generating tailored interview questions based on resume..." />
              </div>
            )}

            {questionsGenerated && (
              <div className="mt-[16px] rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[16px] max-h-[200px] overflow-y-auto custom-scrollbar">
                <h5 className="font-display text-[14px] font-semibold text-neutral-900 mb-[12px]">AI Generated Questions</h5>
                <div className="flex flex-col gap-[12px]">
                  <div className="flex flex-col gap-[4px]">
                    <span className="font-body text-[13px] font-bold text-neutral-700">1. Architecture Experience</span>
                    <span className="font-body text-[13px] text-neutral-600">"I noticed you led the migration from REST to GraphQL at Stripe. Can you walk me through the hardest technical challenge you faced there?"</span>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <span className="font-body text-[13px] font-bold text-neutral-700">2. Performance Optimization</span>
                    <span className="font-body text-[13px] text-neutral-600">"How do you approach identifying and resolving memory leaks in long-running React SPA applications?"</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Email Preview */}
          <div className="flex flex-col border-t border-neutral-200 pt-[24px]">
            <button 
              className="flex items-center gap-[8px] font-body text-[14px] font-medium text-neutral-900 hover:text-primary-600"
              onClick={() => setEmailPreviewOpen(!emailPreviewOpen)}
            >
              <ChevronDown size={16} className={cn("transition-transform", emailPreviewOpen && "rotate-180")} />
              Preview invite email
            </button>
            
            {emailPreviewOpen && (
              <div className="mt-[16px] rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-50 p-[16px]">
                <div className="font-body text-[13px] text-neutral-600 mb-[8px]">
                  <span className="font-semibold text-neutral-900">Subject:</span> Interview with TalentIQ - Senior React Engineer
                </div>
                <div className="h-px w-full bg-neutral-200 my-[12px]" />
                <div className="font-body text-[13px] text-neutral-700 whitespace-pre-wrap leading-relaxed">
                  Hi David,<br/><br/>
                  We're excited to move forward with your application. Sarah Chen would like to schedule a 60-minute video interview with you.<br/><br/>
                  Date: Oct 20, 2026<br/>
                  Time: 2:00 PM PST<br/>
                  Link: https://zoom.us/j/1234567890<br/><br/>
                  Looking forward to speaking with you!
                </div>
              </div>
            )}
          </div>

          <Button className="mt-[16px] w-full h-[44px]" onClick={onClose}>
            Schedule Interview
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
