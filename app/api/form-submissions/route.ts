import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth-helper'
import { hasPermission } from '@/lib/permissions'

// POST - Create a new form submission (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'companyName', 'companySize', 'projectType', 'budget', 'description']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Validate email format
    const emailRegex = /\S+@\S+\.\S+/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Create form submission
    const submission = await prisma.formSubmission.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone || null,
        companyName: body.companyName,
        companySize: body.companySize,
        industry: body.industry || null,
        website: body.website || null,
        projectType: body.projectType,
        budget: body.budget,
        timeline: body.timeline || null,
        description: body.description,
        howHeard: body.howHeard || null,
        newsletter: body.newsletter || false,
        status: 'new',
      },
    })

    return NextResponse.json({
      success: true,
      submission: {
        id: submission.id,
        createdAt: submission.createdAt,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create form submission:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}

// GET - Fetch all form submissions (admin only)
export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or owner
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization membership found' }, { status: 403 })
    }

    // Only admins and owners can view submissions
    if (!hasPermission(membership.role, 'settings:manage')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Fetch all submissions
    const submissions = await prisma.formSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ submissions })
  } catch (error) {
    console.error('Failed to fetch form submissions:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
  }
}
