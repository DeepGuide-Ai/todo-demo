import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getSession()

    if (!user?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's organization membership with role
    const membership = await prisma.member.findFirst({
      where: {
        userId: user.user.id,
      },
      include: {
        organization: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc', // Get the first (primary) organization
      },
    })

    if (!membership) {
      return NextResponse.json(null)
    }

    return NextResponse.json({
      role: membership.role,
      organization: membership.organization,
    })
  } catch (error) {
    console.error('Failed to fetch membership:', error)
    return NextResponse.json({ error: 'Failed to fetch membership' }, { status: 500 })
  }
}
