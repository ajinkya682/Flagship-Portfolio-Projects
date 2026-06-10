"use client"

import * as React from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface BiasFlag {
  phrase: string
  category: string
  suggestion: string
}

export interface BiasWarningPanelProps {
  flags: BiasFlag[]
  severity?: "low" | "medium" | "high"
  onFixAll?: () => void
  onIgnore?: () => void
  className?: string
}

export function BiasWarningPanel({
  flags,
  severity = "medium",
  onFixAll,
  onIgnore,
  className,
}: BiasWarningPanelProps) {
  if (!flags || flags.length === 0) return null

  // Severity color mapping
  const severityStyles = {
    low: {
      container: "border-[#10B981] bg-[#F0FDF4]",
      icon: "text-[#10B981]",
    },
    medium: {
      container: "border-[#F59E0B] bg-[#FFFBEB]",
      icon: "text-[#F59E0B]",
    },
    high: {
      container: "border-[#EF4444] bg-[#FEF2F2]",
      icon: "text-[#EF4444]",
    },
  }

  const styles = severityStyles[severity]

  return (
    <div
      className={cn(
        "mt-4 rounded-[var(--radius-lg)] border p-4",
        styles.container,
        className
      )}
    >
      {/* Header row */}
      <div className="flex items-center">
        <AlertTriangle size={18} className={styles.icon} />
        <h4 className="ml-2 font-body text-[14px] font-semibold text-neutral-900">
          Bias check flagged {flags.length} issue{flags.length !== 1 ? "s" : ""}
        </h4>
      </div>

      {/* Flag items */}
      <div className="mt-2 flex flex-col gap-3">
        {flags.map((flag, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-body text-[13px] font-semibold text-neutral-900">
                "{flag.phrase}"
              </span>
              <span className="rounded-full bg-warning-100 px-2.5 py-0.5 font-body text-[10px] font-medium text-warning-700">
                {flag.category}
              </span>
            </div>
            <p className="mt-1 font-body text-[13px] text-neutral-600">
              {flag.suggestion}
            </p>
          </div>
        ))}
      </div>

      {/* Action row */}
      <div className="mt-4 flex items-center gap-2">
        <Button variant="primary" size="compact" onClick={onFixAll}>
          Fix All
        </Button>
        <Button variant="ghost" size="compact" onClick={onIgnore}>
          Ignore and continue
        </Button>
      </div>
    </div>
  )
}
