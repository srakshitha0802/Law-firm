import { v4 as uuidv4 } from 'uuid'
import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import type { DocumentFolder } from '@/types'
import { extractCaseInfo, classifyDocument, type DocumentType, type ExtractedCaseInfo } from './ocr-utils'

// Perform OCR on image or PDF files
export async function performOCR(filePath: string, mimeType: string): Promise<{
  text: string
  info: ExtractedCaseInfo
  documentType: DocumentType
}> {
  let extractedText = ''
  
  try {
    if (mimeType.startsWith('image/')) {
      // Use Tesseract for image OCR
      const Tesseract = (await import('tesseract.js')).default
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: m => console.log(m),
      })
      
      extractedText = result.data.text
    } else if (mimeType === 'application/pdf') {
      // TODO: Implement PDF text extraction using pdf-parse
      console.log('PDF text extraction not yet implemented')
      extractedText = ''
    }
  } catch (error) {
    console.error('OCR processing failed:', error)
    extractedText = ''
  }

  // Extract case information using advanced algorithms
  const extractedInfo = extractCaseInfo(extractedText)
  const documentType = classifyDocument(extractedText, extractedInfo)

  return {
    text: extractedText,
    info: extractedInfo,
    documentType
  }
}

// Calculate checksum for file integrity
export async function calculateChecksum(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath)
  return crypto.createHash('md5').update(fileBuffer).digest('hex')
}

// Detect folder based on document type
export function detectFolder(documentType: DocumentType): DocumentFolder {
  const folderMap: Record<DocumentType, DocumentFolder> = {
    PETITION: 'PLEADINGS',
    AFFIDAVIT: 'PLEADINGS',
    JUDGMENT: 'JUDGMENTS',
    ORDER: 'ORDERS',
    CONTRACT: 'CONTRACTS',
    CORRESPONDENCE: 'CORRESPONDENCE',
    EVIDENCE: 'EVIDENCE',
    INVOICE: 'INVOICES',
    RECEIPT: 'INVOICES',
    POWER_OF_ATTORNEY: 'FILINGS',
    NOTICE: 'CORRESPONDENCE',
    FILING: 'FILINGS',
    PDF_DOCUMENT: 'GENERAL',
    OTHER: 'GENERAL'
  }
  
  return folderMap[documentType] || 'GENERAL'
}

// Process single document upload
export async function processDocumentUpload(
  file: File,
  caseId: string,
  userId: string
): Promise<{
  document: Awaited<ReturnType<typeof prisma.document.create>>
  ocrResult: {
    text: string
    info: ExtractedCaseInfo
    documentType: DocumentType
  } | null
}> {
  const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
  
  // Ensure upload directory exists
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  // Generate unique filename
  const ext = path.extname(file.name)
  const uniqueFilename = `${uuidv4()}${ext}`
  const filePath = path.join(UPLOAD_DIR, uniqueFilename)

  // Save file
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  // Perform OCR
  let ocrResult = null
  try {
    ocrResult = await performOCR(filePath, file.type)
  } catch (error) {
    console.error('OCR processing failed:', error)
  }

  // Get case info for default case number
  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    select: { caseNumber: true }
  })

  // Get latest version number
  const latestDoc = await prisma.document.findFirst({
    where: { caseId },
    orderBy: { version: 'desc' },
    select: { version: true }
  })

  const version = (latestDoc?.version || 0) + 1

  // Create document record
  const document = await prisma.document.create({
    data: {
      filename: uniqueFilename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      path: filePath,
      uploadedById: userId,
      caseId: caseId,
      extractedText: ocrResult?.text || '',
      caseNumber: ocrResult?.info.caseNumber || caseData?.caseNumber || '',
      partyNames: ocrResult?.info.partyNames || '',
      courtName: ocrResult?.info.courtName || '',
      dates: ocrResult?.info.dates || '',
      version: version,
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
    }
  })

  return { document, ocrResult }
}

// Process multiple documents in batch
export async function processBatchUpload(
  files: File[],
  caseId: string,
  userId: string
): Promise<{
  documents: Array<Awaited<ReturnType<typeof prisma.document.create>>>
  ocrResults: Array<{
    text: string
    info: ExtractedCaseInfo
    documentType: DocumentType
  } | null>
  errors: Array<{ filename: string; error: string }>
}> {
  const UPLOAD_DIR = path.join(process.cwd(), 'uploads')
  await fs.mkdir(UPLOAD_DIR, { recursive: true })

  const results: {
    documents: Array<Awaited<ReturnType<typeof prisma.document.create>>>
    ocrResults: Array<{
      text: string
      info: ExtractedCaseInfo
      documentType: DocumentType
    } | null>
    errors: Array<{ filename: string; error: string }>
  } = {
    documents: [],
    ocrResults: [],
    errors: []
  }

  // Get latest version number for the case
  const latestDoc = await prisma.document.findFirst({
    where: { caseId },
    orderBy: { version: 'desc' },
    select: { version: true }
  })

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    
    try {
      // Generate unique filename
      const ext = path.extname(file.name)
      const uniqueFilename = `${uuidv4()}${ext}`
      const filePath = path.join(UPLOAD_DIR, uniqueFilename)

      // Save file
      const buffer = Buffer.from(await file.arrayBuffer())
      await fs.writeFile(filePath, buffer)

      // Calculate checksum
      const checksum = await calculateChecksum(filePath)

      // Perform OCR
      let extractedText = ''
      let documentType = 'OTHER' as DocumentType
      
      try {
        if (file.type.startsWith('image/')) {
          const ocrResult = await performOCR(filePath, file.type)
          extractedText = ocrResult.text
          documentType = ocrResult.documentType
        } else if (file.type === 'application/pdf') {
          // TODO: Implement PDF text extraction
          extractedText = ''
          documentType = 'PDF_DOCUMENT'
        }
      } catch (ocrError) {
        console.error(`OCR Error for ${file.name}:`, ocrError)
      }

      // Create document record
      const document = await prisma.document.create({
        data: {
          filename: uniqueFilename,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          path: filePath,
          uploadedById: userId,
          caseId: caseId,
          extractedText,
          caseNumber: '', // Will be extracted from OCR
          partyNames: '', // Will be extracted from OCR
          courtName: '', // Will be extracted from OCR
          dates: '', // Will be extracted from OCR
          documentType,
          folder: detectFolder(documentType),
          tags: '', // Will be generated from OCR
          status: 'ACTIVE',
          version: (latestDoc?.version || 0) + i + 1,
          parentDocId: null,
          isLatest: true,
          checksum
        }
      })

      results.documents.push(document)
      results.ocrResults.push({
        text: extractedText,
        info: {
          caseNumber: '',
          partyNames: '',
          courtName: '',
          dates: '',
          documentType
        },
        documentType
      })
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error)
      results.errors.push({
        filename: file.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return results
}
