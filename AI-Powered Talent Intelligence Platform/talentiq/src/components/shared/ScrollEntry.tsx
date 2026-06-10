"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface ScrollEntryProps {
  children: React.ReactNode
  className?: string
  animation?: "fade-up" | "fade-in" | "spring-in"
  delay?: number
}

export function ScrollEntry({ children, className, animation = "fade-up", delay = 0 }: ScrollEntryProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(currentRef)
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    )

    observer.observe(currentRef)
    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={cn(
        "opacity-0",
        isVisible && animation === "fade-up" && "animate-fade-slide-up",
        isVisible && animation === "fade-in" && "animate-in fade-in duration-500",
        isVisible && animation === "spring-in" && "animate-spring-in",
        className
      )}
    >
      {children}
    </div>
  )
}
