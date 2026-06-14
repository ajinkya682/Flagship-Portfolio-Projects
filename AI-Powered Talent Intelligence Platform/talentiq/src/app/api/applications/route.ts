// DEMO MODE — Stubbed. All data served from frontend Zustand store.
export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
export async function GET() { return NextResponse.json({ data: [] }) }
export async function POST() { return NextResponse.json({ data: null }, { status: 201 }) }
export async function PUT() { return NextResponse.json({ data: null }) }
export async function PATCH() { return NextResponse.json({ data: null }) }
export async function DELETE() { return NextResponse.json({ data: null }) }
