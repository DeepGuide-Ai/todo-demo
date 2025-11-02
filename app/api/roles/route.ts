import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { DEFAULT_ROLES, hasPermission } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to view roles
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization membership found' }, { status: 403 })
    }

    // Verify user has permission to view roles
    if (!hasPermission(membership.role, 'roles:view')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Return default roles
    return NextResponse.json({ roles: DEFAULT_ROLES })
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 })
  }
}
