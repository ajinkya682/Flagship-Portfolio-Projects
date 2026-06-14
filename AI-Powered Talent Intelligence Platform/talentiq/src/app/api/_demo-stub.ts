// ─── DEMO MODE — API Route Stub ─────────────────────────────────────
// This file stubs all API routes in demo mode.
// No Prisma, JWT, or database calls are made.
// All data comes from the frontend Zustand store instead.

import { NextResponse } from 'next/server'

export function demoResponse(data: any = [], status = 200) {
  return NextResponse.json({ data, meta: { demo: true } }, { status })
}

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
