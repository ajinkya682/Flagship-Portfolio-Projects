"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999]",
        "rounded-md bg-primary-600 px-4 py-2 font-body text-sm font-semibold text-white shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      )}
    >
      Skip to main content
    </a>
  )
}
