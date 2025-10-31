import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth-helper'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params
    const body = await request.json()
    const { title, description, completed, priority, dueDate } = body

    const todo = await prisma.todo.update({
      where: { id, userId: user.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate }),
      }
    })

    return NextResponse.json(todo)
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    await prisma.todo.delete({
      where: { id, userId: user.id }
    })

    return NextResponse.json({ message: 'Todo deleted successfully' })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 })
  }
}
