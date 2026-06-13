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

    // In a real application, we would aggregate data over time. 
    // Here we return basic aggregates for the dashboard.
    const companyId = auth.companyId

    const [totalJobs, totalApplications, totalInterviews, totalOffers] = await Promise.all([
      prisma.job.count({ where: { companyId } }),
      prisma.application.count({ where: { companyId } }),
      prisma.interview.count({ where: { companyId } }),
      prisma.offer.count({ where: { companyId } }),
    ])

    return NextResponse.json({
      data: {
        metrics: {
          totalJobs,
          totalApplications,
          totalInterviews,
          totalOffers,
        }
      }
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
