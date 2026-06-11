import * as React from "react"
import { AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  helperText?: string
  label?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, label, id, ...props }, ref) => {
    const textareaId = id || React.useId()
    const errorId = `${textareaId}-error`
    const helperId = `${textareaId}-helper`
    const isFilled = props.value !== undefined && props.value !== ""

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-body text-[13px] font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            className={cn(
              "flex min-h-[96px] w-full rounded-sm border bg-white px-[14px] py-3 font-body text-[14px] leading-[24px] text-neutral-900 shadow-sm transition-all duration-150 placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200 resize-y",
              error
                ? "border-[#EF4444] focus-visible:border-[#EF4444] focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                : "border-neutral-200 hover:border-neutral-300 focus-visible:border-primary-500 focus-visible:shadow-brand",
              !error && isFilled && "border-neutral-300",
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : helperText ? helperId : undefined
            }
            {...props}
          />
        </div>
        {error ? (
          <span
            id={errorId}
            className="flex items-center gap-1 font-body text-[12px] text-[#EF4444]"
            aria-live="polite"
          >
            <AlertCircle size={12} />
            {error}
          </span>
        ) : helperText ? (
          <span
            id={helperId}
            className="font-body text-[12px] text-neutral-500"
          >
            {helperText}
          </span>
        ) : null}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
