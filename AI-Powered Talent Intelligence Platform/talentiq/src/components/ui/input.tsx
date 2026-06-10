import * as React from "react"
import { Search, X, Eye, EyeOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  helperText?: string
  label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, helperText, label, id, ...props }, ref) => {
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    
    // Check if it's filled to apply filled styling (optional based on uncontrolled vs controlled, 
    // but typically filled means has value). We'll use a data attribute or class.
    const isFilled = props.value !== undefined && props.value !== ""

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-[13px] font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-sm border bg-white px-[14px] py-2 font-body text-[14px] text-neutral-900 shadow-sm transition-all duration-[120ms] placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200",
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
Input.displayName = "Input"

export interface SearchInputProps extends InputProps {
  onClear?: () => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, onChange, ...props }, ref) => {
    const hasValue = Boolean(value)

    const handleClear = () => {
      if (onClear) onClear()
      // Create a synthetic event to trigger onChange if needed, or rely on controlled parent
    }

    return (
      <div className="relative w-full">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          size={16}
        />
        <Input
          type="search"
          className={cn(
            "pl-10",
            // Need pr-8 if we want to show the clear button
            hasValue && "pr-8",
            className
          )}
          value={value}
          onChange={onChange}
          ref={ref}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-sm text-neutral-400 transition-opacity hover:bg-neutral-100 hover:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative w-full">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
          // Note: top-[34px] assumes the input is in a container with a label above it. 
          // If no label is provided, this needs to be adjusted. Let's make it more robust.
          // The best way is to put the button inside the input's wrapper.
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

// Better approach for PasswordInput to align icon correctly regardless of label
const PasswordInputBetter = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, helperText, label, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const isFilled = props.value !== undefined && props.value !== ""

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-[13px] font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={cn(
              "flex h-10 w-full rounded-sm border bg-white px-[14px] pr-10 py-2 font-body text-[14px] text-neutral-900 shadow-sm transition-all duration-[120ms] placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200",
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-sm"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
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
PasswordInputBetter.displayName = "PasswordInput"

export { Input, SearchInput, PasswordInputBetter as PasswordInput }
