import PusherClient from 'pusher-js'

let pusher: PusherClient | null = null
let channel: any = null

export function getSocket(): any {
  if (pusher) return pusher

  // For MVP, we connect to a public channel
  // In production, use private channels with auth endpoint
  pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || 'local', {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
  })

  channel = pusher.subscribe('talentiq-events')

  return pusher
}

export function disconnectSocket(): void {
  if (pusher) {
    pusher.disconnect()
    pusher = null
    channel = null
  }
}

export function subscribeToEvent<T>(event: string, callback: (data: T) => void): void {
  getSocket() // Ensure connected
  if (channel) {
    channel.bind(event, callback)
  }
}

export function unsubscribeFromEvent<T>(event: string, callback: (data: T) => void): void {
  if (channel) {
    channel.unbind(event, callback)
  }
}
