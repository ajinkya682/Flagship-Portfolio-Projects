'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '@/lib/utils'

interface ScoreRangeSliderProps {
  min?: number
  max?: number
  value: number[]
  onValueChange: (value: number[]) => void
}

export default function ScoreRangeSlider({
  min = 0,
  max = 100,
  value,
  onValueChange
}: ScoreRangeSliderProps) {
  return (
    <SliderPrimitive.Root
      className="relative flex w-full touch-none select-none items-center group cursor-pointer"
      min={min}
      max={max}
      step={1}
      value={value}
      onValueChange={onValueChange}
    >
      <SliderPrimitive.Track className="relative h-[6px] w-full grow overflow-hidden rounded-full bg-neutral-200">
        <SliderPrimitive.Range className="absolute h-full bg-primary-500" />
      </SliderPrimitive.Track>
      
      <SliderPrimitive.Thumb className="block h-[18px] w-[18px] rounded-full border-2 border-primary-500 bg-white shadow-md transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 relative group-hover:scale-110">
        <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-bold px-[6px] py-[2px] rounded text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {value[0]}
        </div>
      </SliderPrimitive.Thumb>

      <SliderPrimitive.Thumb className="block h-[18px] w-[18px] rounded-full border-2 border-primary-500 bg-white shadow-md transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 relative group-hover:scale-110">
        <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-bold px-[6px] py-[2px] rounded text-center opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {value[1]}
        </div>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  )
}
