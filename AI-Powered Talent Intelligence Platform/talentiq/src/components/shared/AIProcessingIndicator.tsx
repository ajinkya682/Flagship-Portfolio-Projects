'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface AIProcessingIndicatorProps {
  message: string
  showProgress?: boolean
}

export function AIProcessingIndicator({ message, showProgress = false }: AIProcessingIndicatorProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!showProgress) return

    // Simulate progress to 85% over 18s
    const startTime = Date.now()
    const duration = 18000
    let animationFrameId: number

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      if (elapsed < duration) {
        const nextProgress = Math.min((elapsed / duration) * 85, 85)
        setProgress(nextProgress)
        animationFrameId = requestAnimationFrame(updateProgress)
      } else {
        setProgress(100)
      }
    }

    animationFrameId = requestAnimationFrame(updateProgress)

    const timer = setTimeout(() => {
      setProgress(100)
    }, duration)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(timer)
    }
  }, [showProgress])

  return (
    <div className="flex flex-col items-center gap-[12px] w-full max-w-sm mx-auto">
      <div className="flex gap-[4px]">
        {[0, 120, 240].map((delay, i) => (
          <div
            key={i}
            className="w-[6px] h-[6px] bg-accent-500 rounded-full animate-dot-pulse"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
      
      <p className="font-body text-[13px] text-neutral-500 italic text-center m-0">
        {message}
      </p>

      {showProgress && (
        <div className="w-full h-[4px] bg-neutral-200 rounded-full overflow-hidden mt-1">
          <div 
            className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
