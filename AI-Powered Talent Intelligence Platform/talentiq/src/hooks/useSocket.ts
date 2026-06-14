// ─── useSocket — Demo Mock ─────────────────────────────────────────
// Returns a no-op mock socket object. No real connections are made.

import { useEffect, useRef } from 'react'
import { getSocket, disconnectSocket } from '@/lib/socket'

let activeSubscribers = 0

export function useSocket(): ReturnType<typeof getSocket> {
  const socketRef = useRef<ReturnType<typeof getSocket> | null>(null)

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = getSocket()
      activeSubscribers++
    }

    return () => {
      activeSubscribers--
      if (activeSubscribers === 0) {
        disconnectSocket()
      }
    }
  }, [])

  return socketRef.current ?? getSocket()
}
