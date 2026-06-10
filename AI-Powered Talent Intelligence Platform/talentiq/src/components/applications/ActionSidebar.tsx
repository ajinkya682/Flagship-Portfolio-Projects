"use client"

import * as React from "react"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ActionSidebar() {
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false)
  const [rejectReason, setRejectReason] = React.useState("")
  const [rejectNote, setRejectNote] = React.useState("")
  const [tagInput, setTagInput] = React.useState("")
  const [tags, setTags] = React.useState(["React", "Fast Learner"])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleRejectSubmit = () => {
    setIsRejectModalOpen(false)
  }

  return (
    <>
      <div className="sticky top-[88px] flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-50 p-[20px] shadow-sm">
        
        {/* MOVE STAGE */}
        <div className="flex flex-col gap-[8px]">
          <span className="font-body text-[12px] font-semibold text-neutral-700">Current stage</span>
          <Select defaultValue="interview">
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="phone">Phone Screen</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
            </SelectContent>
          </Select>
          <Button className="h-[32px] w-full text-[13px]">Move</Button>
        </div>

        {/* PRIMARY ACTIONS */}
        <div className="mt-[20px] flex flex-col gap-[12px]">
          <Button className="w-full">Schedule Interview</Button>
          <Button variant="secondary" className="w-full">Send Message</Button>
          <Button 
            variant="ghost" 
            className="w-full text-[#EF4444] hover:bg-red-50 hover:text-[#DC2626] border border-transparent hover:border-red-100"
            onClick={() => setIsRejectModalOpen(true)}
          >
            Reject Candidate
          </Button>
        </div>

        {/* TAGS */}
        <div className="mt-[20px] border-t border-neutral-200 pt-[20px] flex flex-col gap-[12px]">
          <h5 className="font-display text-[14px] font-semibold text-neutral-900 m-0">Tags</h5>
          
          <Input 
            placeholder="Add tag..." 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            className="bg-white text-[13px] h-[32px]"
          />
          
          <div className="flex flex-wrap gap-[6px]">
            {tags.map(tag => (
              <span key={tag} className="flex h-[24px] items-center gap-[4px] rounded-full bg-neutral-200 pl-[10px] pr-[4px] font-body text-[11px] font-medium text-neutral-700">
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="flex h-[16px] w-[16px] items-center justify-center rounded-full hover:bg-neutral-300"
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* ASSIGNED TO */}
        <div className="mt-[16px] flex flex-col gap-[8px]">
          <h5 className="font-display text-[14px] font-semibold text-neutral-900 m-0">Assigned to</h5>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <img src="https://i.pravatar.cc/150?u=a4" alt="Recruiter" className="h-[28px] w-[28px] rounded-full object-cover" />
              <span className="font-body text-[13px] font-medium text-neutral-900">Sarah Chen</span>
            </div>
            <button className="font-body text-[12px] font-medium text-primary-600 hover:text-primary-700 hover:underline">
              Change
            </button>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="mt-[16px] border-t border-neutral-200 pt-[16px] flex flex-col gap-[12px]">
          <div className="flex flex-col">
            <span className="font-body text-[16px] font-semibold text-neutral-900">4 days</span>
            <span className="font-body text-[12px] text-neutral-500">Days in stage</span>
          </div>
          <div className="flex flex-col">
            <span className="font-body text-[16px] font-semibold text-neutral-900">24</span>
            <span className="font-body text-[12px] text-neutral-500">Total in pipeline</span>
          </div>
          <div className="flex flex-col">
            <span className="font-body text-[16px] font-semibold text-neutral-900">Oct 18, 4:30 PM</span>
            <span className="font-body text-[12px] text-neutral-500">Last activity</span>
          </div>
        </div>

      </div>

      {/* Reject Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-[12px] font-display text-[20px] font-semibold text-neutral-900">
              <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#FEF2F2]">
                <AlertCircle size={20} className="text-[#EF4444]" />
              </div>
              Reject Candidate
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-[16px] flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[6px]">
              <span className="font-body text-[13px] font-medium text-neutral-700">Rejection Reason</span>
              <Select value={rejectReason} onValueChange={setRejectReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skills">Lacking required skills</SelectItem>
                  <SelectItem value="experience">Insufficient experience</SelectItem>
                  <SelectItem value="culture">Culture fit</SelectItem>
                  <SelectItem value="comp">Compensation mismatch</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-[6px]">
              <span className="font-body text-[13px] font-medium text-neutral-700">Internal Note (Optional)</span>
              <Textarea 
                placeholder="Add context for this rejection..." 
                className="min-h-[80px]"
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-[12px] mt-[8px]">
            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="bg-[#EF4444] text-white hover:bg-[#DC2626]" 
              onClick={handleRejectSubmit}
              disabled={!rejectReason}
            >
              Confirm Rejection
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
