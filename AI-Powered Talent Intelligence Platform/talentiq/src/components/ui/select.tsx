"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> {
  error?: string
  helperText?: string
  label?: string
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, error, helperText, label, id, ...props }, ref) => {
  const triggerId = id || React.useId()
  const errorId = `${triggerId}-error`
  const helperId = `${triggerId}-helper`

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={triggerId}
          className="font-body text-[13px] font-medium text-neutral-700"
        >
          {label}
        </label>
      )}
      <SelectPrimitive.Trigger
        ref={ref}
        id={triggerId}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-sm border bg-white px-[14px] py-2 font-body text-[14px] text-neutral-900 shadow-sm transition-all duration-150 placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 disabled:border-neutral-200",
          error
            ? "border-[#EF4444] focus-visible:border-[#EF4444] focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
            : "border-neutral-200 hover:border-neutral-300 focus-visible:border-primary-500 focus-visible:shadow-brand data-[state=open]:border-primary-500 data-[state=open]:shadow-brand",
          // The SelectValue doesn't easily expose 'isFilled' state without looking at context, 
          // we'll rely on the user to style it or we assume selection means filled for the form.
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-4 w-4 text-neutral-400 transition-transform duration-150 ease-out data-[state=open]:rotate-180" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
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
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-[200] max-h-[240px] overflow-y-auto rounded-md border border-neutral-200 bg-white p-1 text-neutral-900 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-0",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-3 pr-2 font-body text-[12px] font-medium text-neutral-500", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex h-9 w-full cursor-pointer select-none items-center rounded-[4px] py-0 pl-3 pr-9 font-body text-[14px] text-neutral-900 outline-none hover:bg-neutral-50 focus:bg-neutral-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-700",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-[14px] w-[14px]" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("my-1 h-px bg-neutral-100", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}
