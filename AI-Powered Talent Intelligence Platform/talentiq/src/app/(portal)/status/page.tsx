"use client"

import * as React from "react"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApplicationStatusTimeline } from "@/components/portal/ApplicationStatusTimeline"

export default function StatusPage() {
  return (
    <div className="w-full max-w-[700px] mx-auto py-[40px] px-[24px] animate-fade-in">
      
      <div className="flex flex-col mb-[32px]">
        <h1 className="font-display text-[24px] font-bold text-neutral-900 mb-[4px]">
          Hello, Alex
        </h1>
        <p className="font-body text-[15px] text-neutral-600">
          Applied for Senior Software Engineer at Acme Corp
        </p>
      </div>

      <div className="mb-[40px]">
        <ApplicationStatusTimeline />
      </div>

      {/* Current Stage Card */}
      <div className="flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-white p-[24px] shadow-sm">
        <h4 className="font-display text-[18px] font-semibold text-neutral-900">
          Interview Stage
        </h4>
        <p className="font-body text-[14px] text-neutral-600 mt-[8px] leading-relaxed">
          Your application is currently in the interview phase. Please check your email for a scheduling link from our team to set up your next video interview. Let us know if you need any accommodations!
        </p>
        <span className="font-body text-[12px] text-neutral-400 mt-[16px]">
          Last updated: 2 days ago
        </span>
      </div>

      <Button variant="ghost" className="w-full mt-[24px] h-[44px] text-neutral-600 font-medium">
        <Mail size={16} className="mr-2" /> Questions? Contact the hiring team
      </Button>

    </div>
  )
}
