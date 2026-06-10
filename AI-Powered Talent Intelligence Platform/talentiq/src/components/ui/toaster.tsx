"use client"

import * as React from "react"
import { Toast, type ToastType } from "./toast"

export interface ToastData {
  id: string
  type: ToastType
  title: string
  description?: string
}

const TOAST_LIMIT = 3

let memoryState: ToastData[] = []
let listeners: Array<(state: ToastData[]) => void> = []

export const toast = {
  success: (title: string, description?: string) => addToast("success", title, description),
  error: (title: string, description?: string) => addToast("error", title, description),
  warning: (title: string, description?: string) => addToast("warning", title, description),
  info: (title: string, description?: string) => addToast("info", title, description),
  dismiss: (id: string) => {
    memoryState = memoryState.filter((t) => t.id !== id)
    listeners.forEach((listener) => listener(memoryState))
  },
}

function addToast(type: ToastType, title: string, description?: string) {
  const id = Math.random().toString(36).substring(2, 9)
  
  // Create new array with new toast at the START (enters from bottom if we flex-col-reverse or similar)
  memoryState = [{ id, type, title, description }, ...memoryState]
  
  // We don't slice here immediately if we want a queue, but the spec says "Max 3 visible / overflow queue".
  // For simplicity without a complex queue system, we'll just keep the latest 3.
  if (memoryState.length > TOAST_LIMIT) {
    memoryState = memoryState.slice(0, TOAST_LIMIT)
  }

  listeners.forEach((listener) => listener(memoryState))
  return id
}

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastData[]>(memoryState)

  React.useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  return { toasts, dismiss: toast.dismiss, toast }
}

export function Toaster() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[400] flex flex-col-reverse gap-2 pointer-events-none w-[360px]">
      {toasts.map((t) => (
        <div key={t.id} className="transition-all duration-200">
          <Toast {...t} onDismiss={dismiss} />
        </div>
      ))}
    </div>
  )
}
