// ─── Socket — Demo Mock ────────────────────────────────────────────
// Replaces real Pusher WebSocket with a no-op in-memory event emitter.
// No network connections are made in demo mode.

type EventCallback = (...args: any[]) => void

const eventListeners = new Map<string, EventCallback[]>()

/** Register a callback for a given event name */
export function subscribeToEvent(event: string, callback: EventCallback): void {
  const existing = eventListeners.get(event) || []
  eventListeners.set(event, [...existing, callback])
}

/** Remove a callback for a given event name */
export function unsubscribeFromEvent(event: string, callback: EventCallback): void {
  const existing = eventListeners.get(event) || []
  eventListeners.set(event, existing.filter(cb => cb !== callback))
}

/** Dispatch a mock event to all listeners */
export function dispatchMockEvent(event: string, payload: any): void {
  const listeners = eventListeners.get(event) || []
  listeners.forEach(cb => cb(payload))
}

/** Returns a no-op socket object (satisfies any type that calls .bind/.unbind) */
export function getSocket() {
  return {
    subscribe: () => ({
      bind: () => {},
      unbind: () => {},
    }),
    bind: () => {},
    unbind: () => {},
    disconnect: () => {},
    connect: () => {},
    channel: () => ({
      bind: () => {},
      unbind: () => {},
    }),
  }
}

/** No-op disconnect */
export function disconnectSocket(): void {
  // no-op in demo mode
}
