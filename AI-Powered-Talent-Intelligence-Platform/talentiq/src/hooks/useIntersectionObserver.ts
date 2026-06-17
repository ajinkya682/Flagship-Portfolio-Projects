import { useState, useEffect, RefObject } from 'react'

export function useIntersectionObserver(
  ref: RefObject<HTMLElement>,
  options?: IntersectionObserverInit & { triggerOnce?: boolean }
): { isIntersecting: boolean } {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const triggerOnce = options?.triggerOnce ?? false

  useEffect(() => {
    const target = ref.current
    if (!target) return

    const observer = new IntersectionObserver(([entry]) => {
      const isElementIntersecting = entry.isIntersecting
      setIsIntersecting(isElementIntersecting)
      
      if (isElementIntersecting && triggerOnce) {
        observer.unobserve(target)
      }
    }, options)

    observer.observe(target)
    return () => observer.disconnect()
  }, [ref, options, triggerOnce])

  return { isIntersecting }
}
