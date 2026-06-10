"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BiasFlag {
  phrase: string
  category: string
  suggestion: string
}

interface BiasWarningPanelProps {
  flags: BiasFlag[]
  onFixAll: () => void
  onIgnore: () => void
}

export function BiasWarningPanel({ flags, onFixAll, onIgnore }: BiasWarningPanelProps) {
  if (flags.length === 0) return null

  return (
    <div className="mt-[16px] animate-fade-slide-down overflow-hidden rounded-[var(--radius-lg)] border border-[#F59E0B] bg-[#FFFBEB] p-[16px]">
      
      {/* Header */}
      <div className="flex items-center">
        <AlertTriangle size={18} className="text-[#F59E0B]" />
        <h5 className="ml-[8px] font-body text-[14px] font-semibold text-neutral-900">
          Bias check flagged {flags.length} issues
        </h5>
      </div>

      {/* Flags List */}
      <div className="mt-[12px] flex flex-col gap-[12px]">
        {flags.map((flag, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex items-center gap-[8px]">
              <span className="font-body text-[13px] font-semibold text-neutral-900">
                "{flag.phrase}"
              </span>
              <span className="rounded-full bg-warning-100 px-[8px] py-[2px] font-body text-[10px] font-medium text-warning-700">
                {flag.category}
              </span>
            </div>
            <span className="mt-[4px] font-body text-[13px] text-neutral-600">
              {flag.suggestion}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-[16px] flex items-center gap-[8px]">
        <Button className="h-[32px] px-3 text-[13px]" onClick={onFixAll}>
          Fix All
        </Button>
        <Button variant="ghost" className="h-[32px] px-3 text-[13px] text-neutral-600" onClick={onIgnore}>
          Ignore and continue
        </Button>
      </div>

    </div>
  )
}
