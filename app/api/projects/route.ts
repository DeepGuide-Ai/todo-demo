import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helper';

export async function GET() {
  try {
    const user = await requireAuth();

    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(projects);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await request.json();

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || '',
        status: body.status || 'planning',
        progress: body.progress || 0,
        team: JSON.stringify(body.team || []),
        dueDate: body.dueDate,
        priority: body.priority || 'medium',
        tags: JSON.stringify(body.tags || []),
        userId: user.id,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
