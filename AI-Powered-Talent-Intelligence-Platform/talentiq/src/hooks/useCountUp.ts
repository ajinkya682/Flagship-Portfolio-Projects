import { useState, useEffect } from 'react'
import { useMediaQuery } from './useMediaQuery'

export function useCountUp(target: number, duration: number = 1200, start: boolean = true) {
  const [count, setCount] = useState(0)
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    if (!start) return
    
    if (prefersReducedMotion) {
      setCount(target)
      return
    }

    let startTime: number
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      if (progress < duration) {
        const nextValue = Math.min(Math.floor((progress / duration) * target), target)
        setCount(nextValue)
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(target)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => cancelAnimationFrame(animationFrameId)
  }, [target, duration, start, prefersReducedMotion])

  return count
}
