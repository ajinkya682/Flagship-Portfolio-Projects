import React from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-neutral-200/60 rounded-[8px]", className)} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white p-[20px] rounded-[16px] border border-neutral-100 shadow-sm flex flex-col gap-[16px] w-full">
      <div className="flex items-center gap-[12px]">
        <Skeleton className="w-[40px] h-[40px] rounded-[10px]" />
        <div className="flex flex-col gap-[8px] flex-1">
          <Skeleton className="h-[14px] w-[60%]" />
          <Skeleton className="h-[12px] w-[40%]" />
        </div>
      </div>
      <div className="flex flex-col gap-[8px]">
        <Skeleton className="h-[12px] w-full" />
        <Skeleton className="h-[12px] w-[90%]" />
        <Skeleton className="h-[12px] w-[40%]" />
      </div>
      <div className="mt-auto pt-[16px] border-t border-neutral-50 flex gap-[8px]">
        <Skeleton className="h-[28px] w-[80px]" />
        <Skeleton className="h-[28px] w-[60px]" />
      </div>
    </div>
  )
}
