export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt'

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

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')

    const applications = await prisma.application.findMany({
      where: { 
        companyId: auth.companyId,
        ...(jobId ? { jobId } : {})
      },
      orderBy: { createdAt: 'desc' },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        job: { select: { id: true, title: true } },
        currentStage: true
      }
    })

    return NextResponse.json({ data: applications })
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const auth = await getAuthUser(req)
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { jobId, candidateId } = body

    if (!jobId || !candidateId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the first stage for this job
    const firstStage = await prisma.pipelineStage.findFirst({
      where: { companyId: auth.companyId, jobId: null }, // or specifically bound to job
      orderBy: { orderIndex: 'asc' }
    })

    if (!firstStage) {
      return NextResponse.json({ error: 'No pipeline stages found' }, { status: 400 })
    }

    const application = await prisma.application.create({
      data: {
        companyId: auth.companyId,
        jobId,
        candidateId,
        currentStageId: firstStage.id,
      },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
        job: { select: { id: true, title: true } },
        currentStage: true
      }
    })

    // TODO: Trigger Inngest job for resume parsing if resumeUrl is provided

    return NextResponse.json({ data: application }, { status: 201 })
  } catch (error) {
    console.error('Create application error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
