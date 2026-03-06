import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs/promises'
import {
  extractCaseInfo,
  classifyDocument,
  processBatchUpload,
  detectFolder,
  generateTags,
  calculateChecksum,
  performOCR,
  detectSignaturesStamps,
  summarizeText,
  type DocumentType
} from '@/lib/ocr-utils'
import type { DocumentFolder } from '@/types'

// Type for Prisma where conditions
interface DocumentSearchConditions {
  isLatest: boolean
  status?: 'ACTIVE' | 'ARCHIVED' | 'DELETED'
  caseId?: string
  documentType?: string
  folder?: string
  createdAt?: {
    gte?: Date
    lte?: Date
  }
  OR?: Array<{
    extractedText?: { contains: string }
    originalName?: { contains: string }
    caseNumber?: { contains: string }
    partyNames?: { contains: string }
    courtName?: { contains: string }
    tags?: { contains: string }
  }>
}

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), 'uploads')

async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    // Directory already exists
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const caseId = searchParams.get('caseId')
    const documentId = searchParams.get('id')
    const includeVersions = searchParams.get('includeVersions') === 'true'

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

    // Get single document by ID
    if (documentId) {
      const document = await prisma.document.findUnique({
        where: { id: documentId },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          case: {
            select: {
              id: true,
              caseNumber: true,
              title: true
            }
          },
          parentDoc: includeVersions ? {
            select: {
              id: true,
              version: true,
              createdAt: true,
              uploadedBy: {
                select: { name: true }
              }
            }
          } : false,
          childDocs: includeVersions ? {
            select: {
              id: true,
              version: true,
              createdAt: true,
              uploadedBy: {
                select: { name: true }
              }
            },
            orderBy: {
              version: 'asc'
            }
          } : false
        }
      })

      if (!document) {
        return NextResponse.json(
          { error: 'Document not found' },
          { status: 404 }
        )
      }

      // Check access rights - fetch case details for access check
      const caseData = await prisma.case.findUnique({
        where: { id: document.caseId },
        select: {
          advocateId: true,
          clientId: true
        }
      })

      const hasAccess = payload.role === 'ADMIN' || 
                       caseData?.advocateId === payload.userId ||
                       caseData?.clientId === payload.userId ||
                       document.uploadedById === payload.userId

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      return NextResponse.json({ document })
    }

    // Get documents for a case
    if (caseId) {
      // First verify user has access to this case
      const caseData = await prisma.case.findUnique({
        where: { id: caseId },
        select: {
          id: true,
          advocateId: true,
          clientId: true
        }
      })

      if (!caseData) {
        return NextResponse.json(
          { error: 'Case not found' },
          { status: 404 }
        )
      }

      const hasAccess = payload.role === 'ADMIN' ||
                       caseData.advocateId === payload.userId ||
                       caseData.clientId === payload.userId

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      const documents = await prisma.document.findMany({
        where: {
          caseId: caseId,
          isLatest: true
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json({ documents })
    }

    // Get all documents (admin only)
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const documents = await prisma.document.findMany({
      where: {
        isLatest: true
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit for performance
    })

    return NextResponse.json({ documents })
  } catch (error) {
    console.error('Documents fetch error:', error)
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

    // Only ADMIN and ADVOCATE can upload documents
    if (payload.role !== 'ADMIN' && payload.role !== 'ADVOCATE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const caseId = formData.get('caseId') as string
    const parentDocId = formData.get('parentDocId') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!caseId) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      )
    }

    // Verify case exists and user has access
    const caseData = await prisma.case.findUnique({
      where: { id: caseId },
      select: {
        id: true,
        caseNumber: true,
        advocateId: true,
        clientId: true,
        documents: {
          where: { isLatest: true },
          orderBy: { version: 'desc' },
          take: 1
        }
      }
    })

    if (!caseData) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      )
    }

    const hasAccess = payload.role === 'ADMIN' ||
                     caseData.advocateId === payload.userId

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/webp'
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: PDF, JPEG, PNG, TIFF, WebP' },
        { status: 400 }
      )
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Generate unique filename
    const ext = path.extname(file.name)
    const uniqueFilename = `${uuidv4()}${ext}`
    const filePath = path.join(UPLOAD_DIR, uniqueFilename)

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    // Perform OCR (images) or PDF text extraction, then analyze
    let extractedText = ''
    let caseNumber = ''
    let partyNames = ''
    let courtName = ''
    let dates = ''
    let documentType = 'OTHER'
    let summary = ''
    let tags: string[] = []
    let checksum = ''
    let signaturesDetected = false
    let stampsDetected = false
    let ocrConfidence: number | null = null

    try {
      const ocrResult = await performOCR(filePath, file.type)
      extractedText = ocrResult.text || ''
      caseNumber = ocrResult.info.caseNumber || ''
      partyNames = ocrResult.info.partyNames || ''
      courtName = ocrResult.info.courtName || ''
      dates = ocrResult.info.dates || ''
      documentType = ocrResult.documentType || 'OTHER'

      // Summarize and tag
      summary = summarizeText(extractedText, 6)
      tags = generateTags(ocrResult.info, documentType as DocumentType)

      // Detect signatures/stamps (text-based placeholder)
      const detection = await detectSignaturesStamps(filePath, file.type, extractedText)
      signaturesDetected = detection.signatures
      stampsDetected = detection.stamps

      checksum = await calculateChecksum(filePath)
    } catch (err) {
      console.error('OCR/process error:', err)
    }

    // Determine version number
    const latestVersion = caseData.documents[0]?.version || 0
    const newVersion = latestVersion + 1

    // If updating an existing document, mark old version as not latest
    if (parentDocId) {
      await prisma.document.update({
        where: { id: parentDocId },
        data: { isLatest: false }
      })
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: filePath,
        uploadedById: payload.userId,
        caseId: caseId,
        extractedText: extractedText,
        summary: summary,
        ocrConfidence: ocrConfidence || undefined,
        signaturesDetected: signaturesDetected,
        stampsDetected: stampsDetected,
        caseNumber: caseNumber || caseData.caseNumber,
        partyNames: partyNames,
        courtName: courtName,
        dates: dates,
        version: newVersion,
        parentDocId: parentDocId || null,
        isLatest: true,
        documentType: documentType,
        tags: tags.length ? JSON.stringify(tags) : null,
        checksum: checksum || null
      },
      include: {
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        case: {
          select: {
            id: true,
            caseNumber: true,
            title: true
          }
        }
      }
    })

    // If PDF, enqueue background worker for scanned PDF OCR via BullMQ
    if (file.type === 'application/pdf') {
      try {
        const { addOCRJob } = await import('@/lib/queue')
        await addOCRJob(document.id, document.path, document.mimeType)
      } catch (err) {
        console.error('Failed to enqueue OCR job:', err)
        // Fallback to immediate background processing
        setImmediate(() => {
          import('@/lib/ocr-worker')
            .then(mod => mod.processScannedPDF(document.id, document.path, document.mimeType))
            .catch(err => console.error('Failed to process scanned PDF in background:', err))
        })
      }
    }

    // Create notification for case update
    await prisma.notification.create({
      data: {
        title: 'Document Uploaded',
        message: `${payload.name} uploaded a new document: ${file.name}`,
        type: 'DOCUMENT_UPLOADED',
        userId: caseData.clientId,
        caseId: caseId
      }
    })

    return NextResponse.json({ document }, { status: 201 })
  } catch (error) {
    console.error('Document upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      )
    }

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

    // Only ADMIN can delete documents
    if (payload.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can delete documents' },
        { status: 403 }
      )
    }

    // Get document with case info
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        case: {
          select: {
            advocateId: true
          }
        }
      }
    })

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Delete file from disk
    try {
      await fs.unlink(document.path)
    } catch (error) {
      console.error('File deletion error:', error)
    }

    // Delete document from database (cascade will handle versions)
    await prisma.document.delete({
      where: { id: documentId }
    })

    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Document delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Batch upload endpoint
export async function PATCH(request: NextRequest) {
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

    // Only ADMIN and ADVOCATE can upload documents
    if (payload.role !== 'ADMIN' && payload.role !== 'ADVOCATE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    
    // Handle batch upload
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const files = formData.getAll('files') as File[]
      const caseId = formData.get('caseId') as string

      if (!files || files.length === 0) {
        return NextResponse.json(
          { error: 'No files provided' },
          { status: 400 }
        )
      }

      if (!caseId) {
        return NextResponse.json(
          { error: 'Case ID is required' },
          { status: 400 }
        )
      }

      // Verify case exists and user has access
      const caseData = await prisma.case.findUnique({
        where: { id: caseId },
        select: {
          id: true,
          caseNumber: true,
          advocateId: true,
          clientId: true
        }
      })

      if (!caseData) {
        return NextResponse.json(
          { error: 'Case not found' },
          { status: 404 }
        )
      }

      const hasAccess = payload.role === 'ADMIN' ||
                       caseData.advocateId === payload.userId

      if (!hasAccess) {
        return NextResponse.json(
          { error: 'Access denied' },
          { status: 403 }
        )
      }

      // Process batch upload
      const results = await processBatchUpload(files, caseId, payload.userId)

      // Create notification
      await prisma.notification.create({
        data: {
          title: 'Documents Uploaded',
          message: `${payload.name} uploaded ${results.documents.length} new document(s)`,
          type: 'DOCUMENT_UPLOADED',
          userId: caseData.clientId,
          caseId: caseId
        }
      })

      return NextResponse.json({
        success: true,
        uploaded: results.documents.length,
        errorCount: results.errors.length,
        documents: results.documents,
        errors: results.errors
      }, { status: 201 })
    }

    // Handle search request
    const body = await request.json()
    const { query, caseId, documentType, folder, dateFrom, dateTo } = body

    if (!query && !caseId) {
      return NextResponse.json(
        { error: 'Search query or case ID is required' },
        { status: 400 }
      )
    }

    // Build search conditions
    const whereConditions: DocumentSearchConditions = {
      isLatest: true,
      status: 'ACTIVE'
    }

    if (caseId) {
      whereConditions.caseId = caseId
    }

    if (documentType) {
      whereConditions.documentType = documentType
    }

    if (folder) {
      whereConditions.folder = folder
    }

    if (dateFrom || dateTo) {
      whereConditions.createdAt = {}
      if (dateFrom) whereConditions.createdAt.gte = new Date(dateFrom)
      if (dateTo) whereConditions.createdAt.lte = new Date(dateTo)
    }

    // Text search in extracted text and metadata
    if (query) {
      whereConditions.OR = [
        { extractedText: { contains: query } },
        { originalName: { contains: query } },
        { caseNumber: { contains: query } },
        { partyNames: { contains: query } },
        { courtName: { contains: query } },
        { tags: { contains: query } }
      ]
    }

    const documents = await prisma.document.findMany({
      where: whereConditions,
      include: {
        uploadedBy: {
          select: { id: true, name: true, email: true }
        },
        case: {
          select: { id: true, caseNumber: true, title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })

    return NextResponse.json({ documents, count: documents.length })
  } catch (error) {
    console.error('Batch upload/search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

