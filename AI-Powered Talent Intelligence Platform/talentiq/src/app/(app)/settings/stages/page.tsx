import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { StageList } from "@/components/settings/StageList"

export default function PipelineStagesPage() {
  return (
    <div className="flex flex-col w-full animate-fade-in">
      <div className="flex flex-col mb-[32px]">
        <h1 className="font-display text-[24px] font-bold text-neutral-900">Pipeline Stages</h1>
        
        <div className="flex items-center gap-[8px] mt-[12px] p-[12px] rounded-[var(--radius-md)] bg-warning-50 border border-warning-200 w-max">
          <AlertTriangle size={16} className="text-warning-600" />
          <span className="font-body text-[13px] font-medium text-warning-800">
            Changes affect all active pipelines and candidate workflows.
          </span>
        </div>
      </div>
      
      <StageList />

    </div>
  )
}
