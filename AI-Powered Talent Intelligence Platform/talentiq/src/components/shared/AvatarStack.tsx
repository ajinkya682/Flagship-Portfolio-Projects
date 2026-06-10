import * as React from "react"
import { cn } from "@/lib/utils"

export interface AvatarStackProps {
  urls: string[]
  max?: number
  size?: number
  className?: string
}

export function AvatarStack({ urls, max = 3, size = 32, className }: AvatarStackProps) {
  const displayUrls = urls.slice(0, max)
  const remaining = Math.max(0, urls.length - max)

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {displayUrls.map((url, i) => (
        <img
          key={i}
          src={url}
          alt={`Avatar ${i + 1}`}
          className="rounded-full border-2 border-white object-cover shadow-sm transition-transform hover:z-10 hover:scale-110"
          style={{ width: size, height: size, zIndex: displayUrls.length - i }}
        />
      ))}
      {remaining > 0 && (
        <div
          className="flex items-center justify-center rounded-full border-2 border-white bg-neutral-100 font-body text-[11px] font-bold text-neutral-600 shadow-sm"
          style={{ width: size, height: size, zIndex: 0 }}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
