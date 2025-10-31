import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helper';

export async function GET() {
  try {
    const user = await requireAuth();

    const teamMembers = await prisma.teamMember.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const teamMember = await prisma.teamMember.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
        department: body.department,
        status: body.status || 'active',
        joinDate: body.joinDate || new Date().toISOString().split('T')[0],
        phone: body.phone,
        location: body.location,
        projects: body.projects || 0,
        userId: user.id,
      },
    });

    return NextResponse.json(teamMember);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
