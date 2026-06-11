import { useEffect, useRef } from 'react'
import { getSocket, disconnectSocket } from '@/lib/socket'
import { Socket } from 'socket.io-client'

let activeSubscribers = 0

export function useSocket(): Socket {
  const socketRef = useRef<Socket | null>(null)

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

  return socketRef.current as Socket
}
