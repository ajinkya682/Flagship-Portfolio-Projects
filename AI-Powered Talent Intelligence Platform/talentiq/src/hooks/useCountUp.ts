"use client"

import * as React from "react"
import { useIntersectionObserver } from "./useIntersectionObserver"

export function useCountUp(
  end: number,
  durationMs: number = 1200,
  start: number = 0
) {
  const [count, setCount] = React.useState(start)
  const { ref, isIntersecting } = useIntersectionObserver({ triggerOnce: true })
  
  React.useEffect(() => {
    if (!isIntersecting) return
    
    let current = start
    const increment = (end - start) / (durationMs / 16)
    
    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)
    
    return () => clearInterval(timer)
  }, [end, durationMs, start, isIntersecting])

  return { count, ref }
}
