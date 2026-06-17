"use client"

import * as React from "react"
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface ToastProps {
  id: string
  type: ToastType
  title: string
  description?: string
  onDismiss: (id: string) => void
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-accent-500",
    borderClass: "border-l-[#10B981]",
    autoDismiss: 4000,
    role: "status",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-[#EF4444]",
    borderClass: "border-l-[#EF4444]",
    autoDismiss: 0, // Manual dismiss only
    role: "alert",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-[#F59E0B]",
    borderClass: "border-l-[#F59E0B]",
    autoDismiss: 6000,
    role: "alert",
  },
  info: {
    icon: Info,
    iconClass: "text-[#3B82F6]",
    borderClass: "border-l-[#3B82F6]",
    autoDismiss: 5000,
    role: "status",
  },
} as const

export function Toast({ id, type, title, description, onDismiss }: ToastProps) {
  const config = toastConfig[type]
  const Icon = config.icon

  React.useEffect(() => {
    if (config.autoDismiss > 0) {
      const timer = setTimeout(() => {
        onDismiss(id)
      }, config.autoDismiss)
      return () => clearTimeout(timer)
    }
  }, [config.autoDismiss, id, onDismiss])

  return (
    <div
      role={config.role}
      className={cn(
        "pointer-events-auto flex w-full max-w-[360px] items-start justify-between rounded-[var(--radius-lg)] bg-white p-4 shadow-lg border-l-4",
        config.borderClass,
        // Spec animations for enter/exit handled by Toaster container transition groups usually, 
        // but we can add basic animate-in here.
        "animate-in slide-in-from-right-4 fade-in duration-200 ease-out"
      )}
    >
      <div className="flex gap-2">
        <Icon size={18} className={cn("mt-0.5 shrink-0", config.iconClass)} />
        <div className="flex flex-col gap-0.5">
          <span className="font-body text-[13px] font-semibold text-neutral-900">
            {title}
          </span>
          {description && (
            <span className="font-body text-[13px] text-neutral-600">
              {description}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="shrink-0 rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        aria-label="Dismiss toast"
      >
        <X size={16} />
      </button>
    </div>
  )
}
