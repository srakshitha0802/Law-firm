import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import path from 'path'
import { getFolderLabel, getDocumentTypeLabel } from '@/lib/ocr-utils'
import type { DocumentFolder, DocumentStatus } from '@/types'

// Type for document update data
interface DocumentUpdateData {
  folder?: DocumentFolder
  tags?: string | null
  status?: DocumentStatus
  extractedText?: string | null
  caseNumber?: string | null
  partyNames?: string | null
  courtName?: string | null
  dates?: string | null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const version = searchParams.get('version')

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

    // Get the document (original or specific version)
    let document
    if (action === 'version' && version) {
      document = await prisma.document.findFirst({
        where: {
          OR: [
            { id: id },
            { parentDocId: id }
          ],
          version: parseInt(version)
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
    } else {
      document = await prisma.document.findUnique({
        where: { id },
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
          parentDoc: {
            select: {
              id: true,
              version: true,
              createdAt: true
            }
          },
          childDocs: {
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
          }
        }
      })
    }

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      )
    }

    // Check access rights
    const caseData = await prisma.case.findUnique({
      where: { id: document.caseId },
      select: {
        id: true,
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

    // If action is 'download', serve the file
    if (action === 'download') {
      try {
        const fileBuffer = await fs.readFile(document.path)
        
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': document.mimeType,
            'Content-Disposition': `attachment; filename="${document.originalName}"`,
            'Content-Length': document.size.toString()
          }
        })
      } catch (error) {
        console.error('File download error:', error)
        return NextResponse.json(
          { error: 'File not found on disk' },
          { status: 404 }
        )
      }
    }

    // If action is 'preview', return file for preview
    if (action === 'preview') {
      try {
        const fileBuffer = await fs.readFile(document.path)
        
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': document.mimeType,
            'Content-Disposition': `inline; filename="${document.originalName}"`,
            'Content-Length': document.size.toString()
          }
        })
      } catch (error) {
        console.error('File preview error:', error)
        return NextResponse.json(
          { error: 'File not found on disk' },
          { status: 404 }
        )
      }
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error('Document fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { extractedText, caseNumber, partyNames, courtName, dates, tags } = body

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

    // Only ADMIN and ADVOCATE can update documents
    if (payload.role !== 'ADMIN' && payload.role !== 'ADVOCATE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const document = await prisma.document.findUnique({
      where: { id },
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

    const hasAccess = payload.role === 'ADMIN' ||
                     document.case?.advocateId === payload.userId

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        extractedText: extractedText ?? document.extractedText,
        caseNumber: caseNumber ?? document.caseNumber,
        partyNames: partyNames ?? document.partyNames,
        courtName: courtName ?? document.courtName,
        dates: dates ?? document.dates
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

    return NextResponse.json({ document: updatedDocument })
  } catch (error) {
    console.error('Document update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH endpoint for updating document folder, tags, and other metadata
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { folder, tags, status, extractedText, caseNumber, partyNames, courtName, dates } = body

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

    // Only ADMIN and ADVOCATE can update documents
    if (payload.role !== 'ADMIN' && payload.role !== 'ADVOCATE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const document = await prisma.document.findUnique({
      where: { id },
      include: {
        case: {
          select: {
            advocateId: true,
            clientId: true
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

    const hasAccess = payload.role === 'ADMIN' ||
                     document.case?.advocateId === payload.userId ||
                     document.uploadedById === payload.userId

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Prepare update data
    const updateData: DocumentUpdateData = {}
    
    if (folder) updateData.folder = folder as DocumentFolder
    if (tags) updateData.tags = Array.isArray(tags) ? JSON.stringify(tags) : tags
    if (status) updateData.status = status
    if (extractedText !== undefined) updateData.extractedText = extractedText
    if (caseNumber !== undefined) updateData.caseNumber = caseNumber
    if (partyNames !== undefined) updateData.partyNames = partyNames
    if (courtName !== undefined) updateData.courtName = courtName
    if (dates !== undefined) updateData.dates = dates

    const updatedDocument = await prisma.document.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({ 
      document: updatedDocument,
      message: 'Document updated successfully'
    })
  } catch (error) {
    console.error('Document patch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

