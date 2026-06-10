import * as React from "react"
import { Star } from "lucide-react"
import { AvatarStack } from "@/components/shared/AvatarStack"

export function HeroAvatarCluster() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center">
        <AvatarStack 
          urls={[
            "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            "https://i.pravatar.cc/150?u=a04258a2462d826712d",
          ]} 
          max={3} 
          size={36} 
        />
        <span className="ml-3 font-body text-[13px] font-semibold text-neutral-700">
          +2K recruiters
        </span>
      </div>
      
      <div className="h-4 w-[1px] bg-neutral-300" />
      
      <div className="flex items-center gap-1.5">
        <div className="flex text-[#FBBF24]">
          {[...Array(4)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
          <Star size={14} fill="currentColor" className="opacity-50" />
        </div>
        <span className="font-body text-[12px] text-neutral-500">4.9/5</span>
      </div>
    </div>
  )
}
