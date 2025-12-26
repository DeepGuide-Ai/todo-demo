import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-helper'
import { prisma } from '@/lib/prisma'
import { hasPermission } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's membership
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
    })

    if (!membership || !hasPermission(membership.role, 'settings:manage')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch stats for the organization
    const [totalMembers, totalProjects, totalTodos, membersByRole] = await Promise.all([
      prisma.member.count({
        where: { organizationId: membership.organizationId },
      }),
      prisma.project.count(),
      prisma.todo.count(),
      prisma.member.groupBy({
        by: ['role'],
        where: { organizationId: membership.organizationId },
        _count: { role: true },
      }),
    ])

    // Transform membersByRole into a more usable format
    const roleDistribution: Record<string, number> = {}
    membersByRole.forEach((item) => {
      roleDistribution[item.role] = item._count.role
    })

    return NextResponse.json({
      totalMembers,
      totalProjects,
      totalTodos,
      membersByRole: roleDistribution,
    })
  } catch (error) {
    console.error('Failed to fetch admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
