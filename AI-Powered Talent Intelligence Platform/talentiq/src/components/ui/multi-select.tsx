import * as React from "react"
import { X, AlertCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface MultiSelectProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  options: { label: string; value: string }[]
  value?: string[]
  onChange?: (value: string[]) => void
  error?: string
  helperText?: string
  label?: string
  maxVisible?: number
}

const MultiSelect = React.forwardRef<HTMLInputElement, MultiSelectProps>(
  (
    {
      className,
      options,
      value = [],
      onChange,
      error,
      helperText,
      label,
      id,
      maxVisible = 3,
      placeholder,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`
    const [isOpen, setIsOpen] = React.useState(false)
    const [inputValue, setInputValue] = React.useState("")
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleRemove = (itemValue: string) => {
      if (disabled) return
      onChange?.(value.filter((v) => v !== itemValue))
    }

    const handleSelect = (itemValue: string) => {
      if (disabled) return
      setInputValue("")
      if (value.includes(itemValue)) {
        onChange?.(value.filter((v) => v !== itemValue))
      } else {
        onChange?.([...value, itemValue])
      }
    }

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    const visiblePills = value.slice(0, maxVisible)
    const overflowCount = value.length - maxVisible

    const filteredOptions = options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(opt.value) // Optionally hide selected options from list
    )

    return (
      <div className="flex w-full flex-col gap-1.5" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="font-body text-[13px] font-medium text-neutral-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <div
            className={cn(
              "flex min-h-10 w-full flex-wrap items-center gap-1.5 rounded-sm border bg-white px-2 py-1.5 shadow-sm transition-all duration-[120ms] cursor-text",
              error
                ? "border-[#EF4444] focus-within:border-[#EF4444] focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                : "border-neutral-200 hover:border-neutral-300 focus-within:border-primary-500 focus-within:shadow-brand",
              disabled && "cursor-not-allowed bg-neutral-50 text-neutral-400 border-neutral-200",
              className
            )}
            onClick={() => {
              if (!disabled) {
                setIsOpen(true)
                inputRef.current?.focus()
              }
            }}
          >
            {visiblePills.map((val) => {
              const option = options.find((o) => o.value === val)
              return (
                <span
                  key={val}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 font-body text-[10px] text-primary-700 leading-none",
                    disabled && "bg-neutral-200 text-neutral-500"
                  )}
                >
                  {option?.label || val}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(val)
                    }}
                    disabled={disabled}
                    className="flex h-3 w-3 items-center justify-center rounded-full hover:bg-primary-200 focus:bg-primary-200 focus:outline-none disabled:pointer-events-none"
                    aria-label={`Remove ${option?.label || val}`}
                  >
                    <X size={10} />
                  </button>
                </span>
              )
            })}
            {overflowCount > 0 && (
              <span className={cn(
                "inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 font-body text-[10px] text-neutral-700 leading-none",
                disabled && "bg-neutral-200 text-neutral-500"
              )}>
                +{overflowCount} more
              </span>
            )}
            <input
              ref={(node) => {
                if (typeof ref === 'function') ref(node)
                else if (ref) ref.current = node
                // @ts-ignore
                inputRef.current = node
              }}
              id={inputId}
              type="text"
              className={cn(
                "flex-1 min-w-[80px] border-none bg-transparent py-0.5 font-body text-[14px] text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-400",
              )}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setIsOpen(true)
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
                  handleRemove(value[value.length - 1])
                }
              }}
              placeholder={value.length === 0 ? placeholder : undefined}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={
                error ? errorId : helperText ? helperId : undefined
              }
              {...props}
            />
            <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0 mx-1" />
          </div>

          {isOpen && !disabled && (
            <div className="absolute top-[calc(100%+4px)] z-[200] max-h-[240px] w-full overflow-y-auto rounded-md border border-neutral-200 bg-white p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
              {filteredOptions.length === 0 ? (
                <div className="py-2 text-center font-body text-[14px] text-neutral-500">
                  No results found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="relative flex h-9 w-full cursor-pointer select-none items-center rounded-[4px] px-3 font-body text-[14px] text-neutral-900 outline-none hover:bg-neutral-50"
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          )}
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
          <span id={helperId} className="font-body text-[12px] text-neutral-500">
            {helperText}
          </span>
        ) : null}
      </div>
    )
  }
)
MultiSelect.displayName = "MultiSelect"

export { MultiSelect }
