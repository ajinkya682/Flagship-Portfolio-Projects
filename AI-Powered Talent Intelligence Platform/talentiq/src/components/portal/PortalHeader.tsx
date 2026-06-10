"use client"

import * as React from "react"
import { Sparkles } from "lucide-react"

export function PortalHeader() {
  return (
    <div className="flex h-[60px] w-full items-center justify-between border-b border-neutral-200 bg-white px-[24px]">
      <div className="flex items-center gap-[12px]">
        {/* Placeholder Company Logo */}
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-lg bg-neutral-900 text-white font-display font-bold text-[18px]">
          A
        </div>
        <h4 className="font-display text-[16px] font-semibold text-neutral-900">
          Acme Corp
        </h4>
      </div>
      <div className="flex items-center gap-[6px] font-body text-[11px] font-medium text-neutral-400">
        Powered by <span className="flex items-center gap-[4px] font-bold text-neutral-900"><Sparkles size={10} className="text-primary-500" /> TalentIQ</span>
      </div>
    </div>
  )
}
