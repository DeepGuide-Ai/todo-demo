import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-helper'

export async function GET() {
  try {
    const user = await requireAuth()

    const todos = await prisma.todo.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(todos)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log("Failed to fetch TODO lists", error)
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { title, description, priority, dueDate } = body

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description: description || '',
        priority: priority || 'medium',
        dueDate: dueDate || null,
        userId: user.id,
      }
    })

    return NextResponse.json(todo, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.log("Failed to create TODO", error)
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 })
  }
}
