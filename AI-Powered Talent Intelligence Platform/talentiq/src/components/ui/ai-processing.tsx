"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type AIMessageType = 
  | "Analyzing resume skills... usually 5 seconds"
  | "Scoring against job requirements..."
  | "Generating your description... about 20 seconds"
  | "Checking for bias patterns..."
  | "Generating interview questions..."

export interface AIProcessingIndicatorProps {
  message?: AIMessageType | string
  className?: string
}

export function AIProcessingIndicator({ 
  message = "Analyzing resume skills... usually 5 seconds", 
  className 
}: AIProcessingIndicatorProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      {/* 3 Dot Pulse */}
      <div className="flex items-center gap-1">
        <div className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-dot-pulse" />
        <div className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-dot-pulse [animation-delay:120ms]" />
        <div className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-dot-pulse [animation-delay:240ms]" />
      </div>
      
      {/* Message */}
      <span className="font-body text-[13px] italic text-neutral-500">
        {message}
      </span>
    </div>
  )
}
