'use client'

import * as Popover from '@radix-ui/react-popover'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function DateRangePicker() {
  const [isOpen, setIsOpen] = useState(false)
  const [dateRange, setDateRange] = useState('Last 30 Days')

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button className="flex items-center gap-[8px] bg-white border border-neutral-200 hover:bg-neutral-50 px-[16px] py-[8px] rounded-md font-body text-[13px] font-medium text-neutral-700 transition-colors shadow-sm">
          <CalendarIcon size={16} className="text-neutral-500" />
          {dateRange}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          align="end" 
          sideOffset={8}
          className="bg-white rounded-lg shadow-xl border border-neutral-100 p-[16px] z-50 flex gap-[24px] animate-in fade-in slide-in-from-top-2 font-body"
        >
          {/* Quick links */}
          <div className="flex flex-col gap-[4px] border-r border-neutral-100 pr-[16px] min-w-[140px]">
            {['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Custom Range'].map((label) => (
              <button 
                key={label}
                onClick={() => {
                  setDateRange(label)
                  setIsOpen(false)
                }}
                className={`text-left px-[12px] py-[8px] rounded-md text-[13px] transition-colors ${
                  dateRange === label 
                    ? 'bg-accent-50 text-accent-700 font-medium' 
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          
          {/* Calendar Mock */}
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center justify-between">
              <button className="text-neutral-400 hover:text-neutral-700 p-[4px]">
                <ChevronLeft size={16} />
              </button>
              <span className="text-[14px] font-semibold text-neutral-900">October 2023</span>
              <button className="text-neutral-400 hover:text-neutral-700 p-[4px]">
                <ChevronRight size={16} />
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-[4px] text-center mb-[8px]">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="w-[32px] text-[12px] font-semibold text-neutral-400">{day}</div>
              ))}
              
              {/* Mock Days */}
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1
                const isSelected = day >= 1 && day <= 30
                const isStart = day === 1
                const isEnd = day === 30
                
                return (
                  <button 
                    key={i} 
                    className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] transition-colors
                      ${isStart || isEnd ? 'bg-accent-500 text-white font-semibold' : ''}
                      ${isSelected && !isStart && !isEnd ? 'bg-accent-50 text-accent-900' : ''}
                      ${!isSelected ? 'hover:bg-neutral-100 text-neutral-700' : ''}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
            
            <div className="flex justify-end pt-[16px] border-t border-neutral-100">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-primary-500 hover:bg-primary-600 text-white px-[16px] py-[6px] rounded-md text-[13px] font-medium transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
