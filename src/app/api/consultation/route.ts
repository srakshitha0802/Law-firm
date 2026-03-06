import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { CaseType } from '@/types'
import { requireAuth } from '@/lib/auth-middleware'

// Phone number validation regex (supports various formats)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/

const consultationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone number format'),
  caseType: z.enum(['CIVIL', 'CRIMINAL', 'FAMILY', 'PROPERTY', 'CORPORATE', 'OTHER']).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description too long'),
  preferredDate: z.string().optional().refine((date) => {
    if (!date) return true
    const preferredDate = new Date(date)
    const now = new Date()
    return preferredDate > now
  }, 'Preferred date must be in the future')
})

export async function POST(request: NextRequest) {
  // Check authentication
  const userOrResponse = requireAuth(request)
  if (userOrResponse instanceof Response) {
    return userOrResponse
  }
  
  try {
    const body = await request.json()
    const validatedData = consultationSchema.parse(body)
    const { name, email, phone, caseType, description, preferredDate } = validatedData

    // Check for duplicate consultation requests (same email within 24 hours)
    const existingConsultation = await prisma.consultationRequest.findFirst({
      where: {
        email,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
        }
      }
    })

    if (existingConsultation) {
      return NextResponse.json(
        { error: 'A consultation request with this email was already submitted in the last 24 hours' },
        { status: 409 }
      )
    }

    // Create consultation request
    const consultation = await prisma.consultationRequest.create({
      data: {
        name,
        email,
        phone,
        caseType: caseType as CaseType,
        description,
        preferredDate: preferredDate ? new Date(preferredDate) : null
      }
    })

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to client

    return NextResponse.json({
      message: 'Consultation request submitted successfully',
      consultationId: consultation.id
    }, { status: 201 })
  } catch (error) {
    console.error('Consultation request error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
