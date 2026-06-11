'use client'

import { useEffect } from 'react'
import { fireMiniConfetti } from '@/lib/confetti'

interface ConfettiTriggerProps {
  trigger: boolean
  origin?: { x: number; y: number }
}

export function ConfettiTrigger({ trigger, origin = { x: 0.5, y: 0.3 } }: ConfettiTriggerProps) {
  useEffect(() => {
    if (trigger) {
      fireMiniConfetti(origin)
    }
  }, [trigger, origin])

  return null
}
