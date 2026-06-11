"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string
  helperText?: string
  showTooltip?: boolean
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, helperText, showTooltip = true, ...props }, ref) => {
  const initialValue = Array.isArray(props.value) ? props.value : Array.isArray(props.defaultValue) ? props.defaultValue : [0];
  const [localValues, setLocalValues] = React.useState(initialValue);

  const handleValueChange = (newValues: number[]) => {
    setLocalValues(newValues);
    if (props.onValueChange) {
      props.onValueChange(newValues);
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {label && (
        <div className="flex justify-between items-center">
          <label className="font-body text-[13px] font-medium text-neutral-700">
            {label}
          </label>
        </div>
      )}
      <SliderPrimitive.Root
        ref={ref}
        className={cn(
          "relative flex w-full touch-none select-none items-center py-2", // Add py-2 for larger hit area
          className
        )}
        onValueChange={handleValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1 w-full grow overflow-hidden rounded-full bg-neutral-200">
          <SliderPrimitive.Range className="absolute h-full bg-primary-500" />
        </SliderPrimitive.Track>
        
        {localValues.map((value, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="group relative block h-[18px] w-[18px] rounded-full border-2 border-primary-500 bg-white shadow-md transition-all duration-150 ease-out hover:scale-120 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50"
          >
            {showTooltip && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-neutral-900 px-2 py-1 text-center font-body text-[10px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus:opacity-100 pointer-events-none">
                {value}
                {/* little triangle pointing down */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-[3px] border-transparent border-t-neutral-900" />
              </div>
            )}
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Root>
      {helperText && (
        <span className="font-body text-[12px] text-neutral-500">
          {helperText}
        </span>
      )}
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
