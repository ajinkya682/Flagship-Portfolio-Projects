import * as React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function HeroInlineCTA({ className, label = "Start Free Trial" }: { className?: string, label?: string }) {
  return (
    <button 
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary-500 font-display text-[16px] font-bold text-white transition-all hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "h-[48px] px-6",
        "shadow-[0_8px_32px_rgba(37,99,235,0.20)]",
        className
      )}
    >
      <span className="mr-2">{label}</span>
      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
    </button>
  )
}
