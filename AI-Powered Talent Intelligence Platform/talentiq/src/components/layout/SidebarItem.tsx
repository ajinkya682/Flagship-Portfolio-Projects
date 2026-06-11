'use client'

import { ElementType } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip' // Assuming a standard tooltip component exists

interface SidebarItemProps {
  icon: ElementType
  label: string
  href: string
  badge?: number
  isCollapsed: boolean
  isActive: boolean
}

export default function SidebarItem({
  icon: Icon,
  label,
  href,
  badge,
  isCollapsed,
  isActive
}: SidebarItemProps) {
  
  const content = (
    <Link
      href={href}
      className={cn(
        "relative w-full h-[40px] px-[12px] rounded-md flex items-center gap-[10px] cursor-pointer transition-all duration-100 ease-out",
        isActive 
          ? "text-primary-700 bg-primary-50" 
          : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50",
        isCollapsed && "justify-center"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-[4px] bottom-[4px] w-[3px] bg-primary-500 rounded-r-md" />
      )}
      
      <div className="relative flex items-center justify-center shrink-0">
        <Icon size={18} className={isActive ? "text-primary-500" : "text-neutral-500"} />
        {badge !== undefined && badge > 0 && isCollapsed && (
          <div className="absolute -top-[4px] -right-[4px] w-[12px] h-[12px] rounded-full bg-primary-500 flex items-center justify-center text-white text-[8px] font-bold border-2 border-white">
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </div>

      {!isCollapsed && (
        <>
          <span className="font-body text-[14px] font-medium truncate flex-1">{label}</span>
          {badge !== undefined && badge > 0 && (
            <div className="px-[6px] py-[2px] rounded-full bg-primary-100 text-primary-700 text-[11px] font-semibold flex items-center justify-center">
              {badge}
            </div>
          )}
        </>
      )}
    </Link>
  )

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-body text-[12px] font-medium z-50 ml-[8px]">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
}
