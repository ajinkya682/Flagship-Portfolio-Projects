"use client"

import * as React from "react"
import { FileText, ExternalLink } from "lucide-react"

export function ResumeTab() {
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Simulate PDF loading
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex w-full gap-[24px] animate-fade-slide-up">
      
      {/* PDF Viewer Area (80%) */}
      <div className="flex-1 min-h-[600px] flex flex-col rounded-[var(--radius-lg)] border border-neutral-200 bg-neutral-50 overflow-hidden relative">
        {/* Header bar */}
        <div className="flex h-[48px] w-full shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-[16px]">
          <div className="flex items-center gap-[8px]">
            <FileText size={16} className="text-neutral-400" />
            <span className="font-body text-[13px] font-medium text-neutral-900">David_Kim_Resume_2026.pdf</span>
          </div>
          <a href="#" className="flex items-center text-[12px] font-medium text-primary-600 hover:text-primary-700 hover:underline">
            Open original <ExternalLink size={12} className="ml-1" />
          </a>
        </div>

        {/* Content area */}
        <div className="flex-1 p-[32px] overflow-hidden flex justify-center bg-neutral-100">
          {isLoading ? (
            <div className="w-full max-w-[800px] h-full bg-white shadow-sm rounded-sm animate-pulse p-[40px]">
              <div className="h-[24px] w-[30%] bg-neutral-200 rounded mb-[16px]" />
              <div className="h-[12px] w-[50%] bg-neutral-200 rounded mb-[40px]" />
              <div className="h-[16px] w-[40%] bg-neutral-200 rounded mb-[16px]" />
              <div className="h-[12px] w-full bg-neutral-200 rounded mb-[8px]" />
              <div className="h-[12px] w-[90%] bg-neutral-200 rounded mb-[8px]" />
              <div className="h-[12px] w-[95%] bg-neutral-200 rounded mb-[32px]" />
              <div className="h-[16px] w-[40%] bg-neutral-200 rounded mb-[16px]" />
              <div className="h-[12px] w-full bg-neutral-200 rounded mb-[8px]" />
              <div className="h-[12px] w-full bg-neutral-200 rounded mb-[8px]" />
              <div className="h-[12px] w-[85%] bg-neutral-200 rounded mb-[8px]" />
            </div>
          ) : (
            <div className="w-full max-w-[800px] h-full bg-white shadow-sm rounded-sm p-[40px] border border-neutral-200 flex flex-col items-center justify-center text-neutral-400 font-body text-[14px]">
              {/* Fake PDF rendering for mockup */}
              [PDF Rendering Canvas Mockup]
            </div>
          )}
        </div>
      </div>

      {/* Extracted Entities Area (20%) */}
      <div className="w-[240px] shrink-0 flex flex-col gap-[24px]">
        <h5 className="font-display text-[14px] font-semibold text-neutral-900 mb-[4px]">
          Extracted Entities
        </h5>

        <div className="flex flex-col gap-[8px]">
          <span className="font-body text-[11px] font-bold uppercase tracking-wider text-neutral-500">Skills</span>
          <div className="flex flex-wrap gap-[6px]">
            {["React", "TypeScript", "Next.js", "Node.js", "GraphQL", "AWS"].map(tag => (
              <span key={tag} className="rounded-[4px] bg-[#DCFCE7] px-[8px] py-[4px] font-body text-[12px] font-medium text-[#166534]">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <span className="font-body text-[11px] font-bold uppercase tracking-wider text-neutral-500">Companies</span>
          <div className="flex flex-col gap-[6px]">
            {["Google", "Stripe", "Acme Corp"].map(company => (
              <span key={company} className="w-max rounded-[4px] bg-[#DBEAFE] px-[8px] py-[4px] font-body text-[12px] font-medium text-[#1E40AF]">
                {company}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-[8px]">
          <span className="font-body text-[11px] font-bold uppercase tracking-wider text-neutral-500">Education</span>
          <div className="flex flex-col gap-[6px]">
            {["Stanford University", "B.S. Computer Science"].map(edu => (
              <span key={edu} className="w-max rounded-[4px] bg-[#F3E8FF] px-[8px] py-[4px] font-body text-[12px] font-medium text-[#6B21A8]">
                {edu}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
