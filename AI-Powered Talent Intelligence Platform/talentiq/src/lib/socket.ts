import { io, Socket } from 'socket.io-client'
import { getToken } from './auth'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (socket && socket.connected) return socket

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:3001', {
    auth: { token: getToken() },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return socket
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export function subscribeToEvent<T>(event: string, callback: (data: T) => void): void {
  const s = getSocket()
  s.on(event, callback)
}

export function unsubscribeFromEvent<T>(event: string, callback: (data: T) => void): void {
  if (!socket) return
  socket.off(event, callback)
}
