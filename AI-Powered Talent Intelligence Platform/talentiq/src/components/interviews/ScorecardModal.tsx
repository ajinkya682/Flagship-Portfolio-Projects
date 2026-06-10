"use client"

import * as React from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface ScorecardModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ScorecardModal({ isOpen, onClose }: ScorecardModalProps) {
  const [overall, setOverall] = React.useState("")

  const criteria = [
    { id: 1, name: "Technical Depth" },
    { id: 2, name: "System Architecture" },
    { id: 3, name: "Communication" },
    { id: 4, name: "Culture Fit" }
  ]

  const ratings = ["Strong Yes", "Yes", "No", "Strong No"]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="font-display text-[20px] font-semibold text-neutral-900">
            Interview scorecard
          </DialogTitle>
          <div className="flex items-center gap-[8px] mt-[4px]">
            <span className="font-body text-[13px] text-neutral-600">Candidate: <span className="font-semibold text-neutral-900">David Kim</span></span>
            <span className="text-neutral-300">•</span>
            <span className="font-body text-[13px] text-neutral-600">Interviewer: <span className="font-semibold text-neutral-900">Sarah Chen</span></span>
            <span className="text-neutral-300">•</span>
            <span className="font-body text-[13px] text-neutral-600">Oct 18, 2026</span>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-[16px] py-[16px]">
          {/* Criteria Rows */}
          {criteria.map((crit) => (
            <div key={crit.id} className="flex flex-col gap-[12px] rounded-[var(--radius-sm)] border border-neutral-200 bg-neutral-50 p-[16px]">
              <div className="flex items-center justify-between">
                <span className="font-body text-[14px] font-semibold text-neutral-900">{crit.name}</span>
                <div className="flex gap-[4px] cursor-pointer">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} className="fill-neutral-200 text-neutral-200 hover:fill-[#F59E0B] hover:text-[#F59E0B] transition-colors" />
                  ))}
                </div>
              </div>
              <Textarea placeholder="Add a comment on this rating..." className="min-h-[48px] bg-white text-[13px]" />
            </div>
          ))}

          {/* Overall Rating */}
          <div className="mt-[8px] flex flex-col gap-[12px]">
            <span className="font-body text-[14px] font-semibold text-neutral-900">Overall Recommendation</span>
            <div className="grid grid-cols-4 gap-[8px]">
              {ratings.map(rating => (
                <button
                  key={rating}
                  onClick={() => setOverall(rating)}
                  className={cn(
                    "flex h-[40px] items-center justify-center rounded-[var(--radius-md)] border font-body text-[13px] font-semibold transition-all",
                    overall === rating
                      ? "border-primary-500 bg-primary-500 text-white"
                      : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-[8px] flex flex-col gap-[12px]">
            <span className="font-body text-[14px] font-semibold text-neutral-900">Additional Notes</span>
            <Textarea placeholder="Any other general thoughts?" className="min-h-[96px] bg-white text-[13px]" />
          </div>

          <Button className="mt-[24px] w-full h-[44px]" onClick={onClose} disabled={!overall}>
            Submit Scorecard
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  )
}
