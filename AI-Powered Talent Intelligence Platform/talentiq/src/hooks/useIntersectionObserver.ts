"use client"

import * as React from "react"

interface UseIntersectionObserverOptions {
  triggerOnce?: boolean
  threshold?: number
  rootMargin?: string
}

export function useIntersectionObserver({
  triggerOnce = true,
  threshold = 0.1,
  rootMargin = "0px",
}: UseIntersectionObserverOptions = {}) {
  const [isIntersecting, setIsIntersecting] = React.useState(false)
  const ref = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [triggerOnce, threshold, rootMargin])

  return { ref, isIntersecting }
}
