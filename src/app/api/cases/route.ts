import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    // Get cases based on user role
    let cases
    if (payload.role === 'ADMIN') {
      // Admin can see all cases
      cases = await prisma.case.findMany({
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          advocate: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          documents: {
            select: {
              id: true,
              filename: true,
              createdAt: true
            }
          },
          hearings: {
            select: {
              id: true,
              date: true,
              purpose: true,
              outcome: true
            },
            orderBy: {
              date: 'desc'
            }
          },
          _count: {
            select: {
              documents: true,
              notes: true,
              reminders: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
    } else if (payload.role === 'ADVOCATE') {
      // Advocate can see their assigned cases
      cases = await prisma.case.findMany({
        where: {
          advocateId: payload.userId
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          advocate: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          documents: {
            select: {
              id: true,
              filename: true,
              createdAt: true
            }
          },
          hearings: {
            select: {
              id: true,
              date: true,
              purpose: true,
              outcome: true
            },
            orderBy: {
              date: 'desc'
            }
          },
          _count: {
            select: {
              documents: true,
              notes: true,
              reminders: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
    } else {
      // Client can see their own cases
      cases = await prisma.case.findMany({
        where: {
          clientId: payload.userId
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          advocate: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          documents: {
            select: {
              id: true,
              filename: true,
              createdAt: true
            }
          },
          hearings: {
            select: {
              id: true,
              date: true,
              purpose: true,
              outcome: true
            },
            orderBy: {
              date: 'desc'
            }
          },
          _count: {
            select: {
              documents: true,
              notes: true,
              reminders: true
            }
          }
        },
        orderBy: {
          updatedAt: 'desc'
        }
      })
    }

    return NextResponse.json({ cases })
  } catch (error) {
    console.error('Cases fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookies or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    // Only ADMIN and ADVOCATE can create cases
    if (payload.role !== 'ADMIN' && payload.role !== 'ADVOCATE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      caseNumber,
      title,
      description,
      caseType,
      courtName,
      clientId,
      firstHearing,
      filingDate
    } = body

    // Generate unique case number if not provided
    let finalCaseNumber = caseNumber
    if (!finalCaseNumber) {
      const year = new Date().getFullYear()
      const count = await prisma.case.count({
        where: {
          caseNumber: {
            startsWith: `${year}/`
          }
        }
      })
      finalCaseNumber = `${year}/${String(count + 1).padStart(4, '0')}`
    }

    // Create case
    const newCase = await prisma.case.create({
      data: {
        caseNumber: finalCaseNumber,
        title,
        description,
        caseType,
        courtName,
        clientId,
        advocateId: payload.userId, // Current user becomes the advocate
        firstHearing: firstHearing ? new Date(firstHearing) : null,
        filingDate: filingDate ? new Date(filingDate) : null
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        advocate: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // TODO: Send notification to client about new case
    // TODO: Create initial reminders for important dates

    return NextResponse.json({ case: newCase }, { status: 201 })
  } catch (error) {
    console.error('Case creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
