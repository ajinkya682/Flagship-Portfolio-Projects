"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function HeroMeshBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none z-0", className)}>
      {/* Layer 1: primary-400 at 15% opacity */}
      <div 
        className="absolute inset-0 opacity-[0.15] animate-mesh-float motion-reduce:animate-none"
        style={{
          background: "radial-gradient(ellipse 30% 60% at 15% 40%, var(--color-primary-400, #3B82F6), transparent)",
        }}
      />
      {/* Layer 2: accent-500 at 12% opacity */}
      <div 
        className="absolute inset-0 opacity-[0.12] animate-mesh-float motion-reduce:animate-none"
        style={{
          background: "radial-gradient(ellipse 40% 50% at 85% 15%, var(--color-accent-500, #10B981), transparent)",
          animationDelay: "-6s"
        }}
      />
      {/* Layer 3: primary-300 at 8% opacity */}
      <div 
        className="absolute inset-0 opacity-[0.08] animate-mesh-float motion-reduce:animate-none"
        style={{
          background: "radial-gradient(ellipse 35% 40% at 55% 85%, var(--color-primary-300, #60A5FA), transparent)",
          animationDelay: "-12s"
        }}
      />
    </div>
  )
}
