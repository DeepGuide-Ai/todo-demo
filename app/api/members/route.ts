import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { hasPermission } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization membership
    const userMembership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      include: { organization: true },
      orderBy: { createdAt: 'asc' },
    })

    if (!userMembership) {
      return NextResponse.json({ error: 'No organization membership found' }, { status: 403 })
    }

    // Check if user has permission to view members
    if (!hasPermission(userMembership.role, 'member:view')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Fetch all members of the same organization
    const members = await prisma.member.findMany({
      where: { organizationId: userMembership.organizationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: [
        { role: 'asc' }, // owner, admin, member
        { createdAt: 'asc' },
      ],
    })

    return NextResponse.json({ members })
  } catch (error) {
    console.error('Failed to fetch members:', error)
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 })
  }
}
