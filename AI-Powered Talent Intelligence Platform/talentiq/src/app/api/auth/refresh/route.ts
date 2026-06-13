export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken, signToken } from '@/lib/jwt'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { refresh_token } = body

    if (!refresh_token) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 400 })
    }

    // In a real implementation we would:
    // 1. Verify the refresh token signature
    // 2. Look it up in the RefreshToken table
    // 3. Issue a new access token
    
    // For MVP, if we receive a valid JWT as refresh_token we just re-issue it
    const decoded = verifyToken(refresh_token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: (decoded as any).sub }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const token = signToken({ sub: user.id, companyId: user.companyId, role: user.role })

    return NextResponse.json({
      access_token: token,
      refresh_token: token // Simplified for MVP
    })

  } catch (error) {
    console.error('Refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
