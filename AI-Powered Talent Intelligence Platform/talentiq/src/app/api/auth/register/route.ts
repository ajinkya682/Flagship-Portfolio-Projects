export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, companyName } = body

    if (!name || !email || !password || !companyName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const companySlug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    const company = await prisma.company.create({
      data: {
        name: companyName,
        slug: companySlug,
        plan: 'starter'
      }
    })

    const passwordHash = await bcrypt.hash(password, 10)
    const [firstName, ...lastNameParts] = name.split(' ')

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName: lastNameParts.join(' '),
        passwordHash,
        companyId: company.id,
        role: 'company_admin'
      }
    })

    const token = signToken({ sub: user.id, companyId: company.id, role: user.role })

    return NextResponse.json({
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`.trim(),
        role: user.role,
        company: {
          id: company.id,
          name: company.name,
          plan: company.plan
        }
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
