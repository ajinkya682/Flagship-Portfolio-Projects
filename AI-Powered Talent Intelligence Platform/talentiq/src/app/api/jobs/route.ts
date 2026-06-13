export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

// Helper to get authenticated user
async function getAuthUser(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token) as { sub: string, companyId: string, role: string } | null
  
  if (!decoded) return null
  return decoded
}

export async function GET(req: Request) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const jobs = await prisma.job.findMany({
      where: { companyId: auth.companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        stages: true,
        _count: { select: { applications: true } }
      }
    })

    return NextResponse.json({ data: jobs })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (auth.role === 'candidate' || auth.role === 'interviewer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { title, department, location, description } = body

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Default stages to create for a new job
    const defaultStages = [
      { name: 'Applied', color: '#64748b', orderIndex: 0, stageType: 'new' },
      { name: 'Screening', color: '#3b82f6', orderIndex: 1, stageType: 'screening' },
      { name: 'Interview', color: '#f59e0b', orderIndex: 2, stageType: 'interview' },
      { name: 'Offer', color: '#10b981', orderIndex: 3, stageType: 'offer' },
      { name: 'Hired', color: '#22c55e', orderIndex: 4, stageType: 'hired' },
    ]

    const job = await prisma.job.create({
      data: {
        title,
        department,
        location,
        description,
        companyId: auth.companyId,
        createdById: auth.sub,
        stages: {
          create: defaultStages.map(s => ({
            companyId: auth.companyId,
            ...s,
            stageType: s.stageType as any
          }))
        }
      },
      include: { stages: true }
    })

    return NextResponse.json({ data: job }, { status: 201 })
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
