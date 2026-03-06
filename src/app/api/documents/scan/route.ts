import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import Tesseract from 'tesseract.js'

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

    // Only ADMIN and ADVOCATE can scan documents
    if (payload.role !== 'ADMIN' && payload.role !== 'ADVOCATE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and PDFs are allowed' },
        { status: 400 }
      )
    }

    // Create scan directory
    const scanDir = path.join(process.cwd(), 'scans')
    await mkdir(scanDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const ext = path.extname(file.name)
    const filename = `scan-${timestamp}-${payload.userId}${ext}`
    const filePath = path.join(scanDir, filename)

    // Save file
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Perform OCR processing
    let extractedText = ''
    let confidence = 85 // Default confidence
    
    try {
      if (file.type.startsWith('image/')) {
        const result = await Tesseract.recognize(filePath, 'eng', {
          logger: m => console.log(m),
        })
        
        extractedText = result.data.text
        confidence = Math.round(((result.confidence as any) || 0) * 100)
      } else if (file.type === 'application/pdf') {
        // TODO: Implement PDF text extraction
        extractedText = ''
        confidence = 50
      }
    } catch (error) {
      console.error('OCR Error:', error)
      extractedText = ''
      confidence = 0
    }

    // Clean up scanned file (optional - keep for debugging)
    // await fs.unlink(filePath)

    return NextResponse.json({
      success: true,
      text: extractedText,
      confidence,
      filename: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Document scan error:', error)
    return NextResponse.json(
      { error: 'Failed to scan document' },
      { status: 500 }
    )
  }
}
