// DEMO MODE — Stubbed (File uploads disabled, returns mock URL)
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ ok: true }) }
export async function POST() { return NextResponse.json({ url: 'https://example.com/mock-upload.pdf', ok: true }) }
