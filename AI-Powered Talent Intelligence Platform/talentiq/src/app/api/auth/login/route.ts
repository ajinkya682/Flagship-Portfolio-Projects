// DEMO MODE — Stubbed
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
export async function POST() { return NextResponse.json({ data: { user: null, access_token: 'demo' } }) }
