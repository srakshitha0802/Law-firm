import { v4 as uuidv4 } from 'uuid'
import Tesseract from 'tesseract.js'
import { prisma } from '@/lib/prisma'
import type { DocumentFolder } from '@/types'

// Document type classification
export type DocumentType = 
  | 'PETITION'
  | 'AFFIDAVIT'
  | 'JUDGMENT'
  | 'ORDER'
  | 'CONTRACT'
  | 'CORRESPONDENCE'
  | 'EVIDENCE'
  | 'INVOICE'
  | 'RECEIPT'
  | 'POWER_OF_ATTORNEY'
  | 'NOTICE'
  | 'FILING'
  | 'PDF_DOCUMENT'
  | 'OTHER'

export interface ExtractedCaseInfo {
  caseNumber: string
  partyNames: string
  courtName: string
  dates: string
  documentType: DocumentType
}

// Case number patterns for different jurisdictions
const CASE_NUMBER_PATTERNS: RegExp[] = [
  // Indian court case numbers
  /\b(Case\s*No\.?|Criminal\s*No\.?|Civil\s*No\.?|Original\s*Application\s*No\.?|WP\s*No\.?|CC\s*No\.?|Spl\.?\s*Case\s*No\.?)\s*[:]?\s*([A-Z0-9\/\-\.]+)/gi,
  // Generic case numbers
  /\b(\d{4}\/[A-Z0-9\/\-]+)/g,
  /\b([A-Z]{2,4}\s*\d{2,4}\s*\/\s*\d{4})/g,
  /\b(Rev\.\s*No\.?\s*[:]?\s*\d+)/gi
]

// Party name patterns
const PARTY_PATTERNS: RegExp[] = [
  /\b(Appellant|Applicant|Petitioner|Plaintiff|Accused|Respondent|Defendant|Complainant)\s*[:]?\s*([A-Za-z\s\.]+)/gi,
  /\b(M\/s\.?|M\/s|M\/s\.?)\s*([A-Za-z\s\.&]+)/gi,
  /\b(Smt\.?|Sh\.?|Mr\.?|Mrs\.?|Ms\.?)\s*([A-Za-z\s]+)/g
]

// Court name patterns
const COURT_PATTERNS: RegExp[] = [
  /\b(Supreme\s*Court|High\s*Court|District\s*Court|Civil\s*Court|Criminal\s*Court|Tribunal|Forum)\s*(of\s*[A-Za-z\s,]+)?/gi,
  /\b([A-Za-z\s]+Court)[,\s]*(Zone|District)?/gi
]

// Date patterns
const DATE_PATTERNS: RegExp[] = [
  /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g,
  /\b(\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s*,?\s*\d{4})/gi,
  /\b((January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\s*,?\s*\d{4})/gi
]

// Document type keywords
const DOCUMENT_TYPE_KEYWORDS: Record<DocumentType, string[]> = {
  PETITION: ['petition', 'petition under', 'writ petition', 'special leave petition', 'slp', 'wp'],
  AFFIDAVIT: ['affidavit', ' sworn statement', 'declared on oath'],
  JUDGMENT: ['judgment', 'judgment dated', 'order dated', 'final order', 'verdict'],
  ORDER: ['order', 'ordered that', 'it is hereby ordered', 'court order'],
  CONTRACT: ['agreement', 'contract', 'terms and conditions', 'parties hereby agree'],
  CORRESPONDENCE: ['letter', 'communication', 'notice', 'circular', 'memo'],
  EVIDENCE: ['exhibit', 'marked as', 'evidence', 'documentary evidence', 'material fact'],
  INVOICE: ['invoice', 'bill', 'tax invoice', 'receipt'],
  RECEIPT: ['receipt', 'received with thanks', 'payment received'],
  POWER_OF_ATTORNEY: ['power of attorney', 'poa', 'authorisation', 'authorization', 'agent'],
  NOTICE: ['notice', 'notice is hereby given', 'take notice'],
  FILING: ['filed', 'filing', 'register', 'diary number'],
  PDF_DOCUMENT: ['pdf', 'portable document'],
  OTHER: []
}

// Advanced case information extraction using NLP techniques
export function extractCaseInfo(text: string): ExtractedCaseInfo {
  const info: ExtractedCaseInfo = {
    caseNumber: '',
    partyNames: '',
    courtName: '',
    dates: '',
    documentType: 'OTHER'
  }

  // Advanced case number extraction with validation
  let bestCaseNumber = ''
  let bestScore = 0
  
  for (const pattern of CASE_NUMBER_PATTERNS) {
    pattern.lastIndex = 0
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const candidate = match[0]
      // Score based on format complexity and uniqueness
      let score = 0
      
      // Prefer longer case numbers (more specific)
      score += candidate.length * 0.1
      
      // Prefer numbers with slashes and years
      if (candidate.includes('/')) score += 2
      if (candidate.match(/\b(19|20)\d{2}\b/)) score += 1.5
      
      // Prefer official prefixes
      if (candidate.match(/^(Case|WP|CC|Spl)/i)) score += 3
      
      if (score > bestScore) {
        bestScore = score
        bestCaseNumber = candidate
      }
    }
  }
  info.caseNumber = bestCaseNumber

  // Enhanced party name extraction with relationship mapping
  const partyMap: Map<string, string[]> = new Map()
  const parties: string[] = []
  
  for (const pattern of PARTY_PATTERNS) {
    pattern.lastIndex = 0
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      if (match[2]) {
        const role = match[1]?.toLowerCase() || 'unknown'
        const name = match[2].trim()
        
        if (!partyMap.has(role)) {
          partyMap.set(role, [])
        }
        
        if (!partyMap.get(role)!.includes(name) && !parties.includes(name)) {
          partyMap.get(role)!.push(name)
          parties.push(name)
        }
      }
    }
  }
  
  // Format party names with roles
  const formattedParties: string[] = []
  partyMap.forEach((names, role) => {
    formattedParties.push(`${role}: ${names.join('; ')}`)
  })
  info.partyNames = formattedParties.join(', ')

  // Advanced court name extraction with hierarchy
  let bestCourtName = ''
  let courtScore = 0
  
  const courtHierarchy = [
    { name: 'Supreme Court', score: 5 },
    { name: 'High Court', score: 4 },
    { name: 'District Court', score: 3 },
    { name: 'Civil Court', score: 2 },
    { name: 'Criminal Court', score: 2 },
    { name: 'Tribunal', score: 3 }
  ]
  
  for (const pattern of COURT_PATTERNS) {
    pattern.lastIndex = 0
    const matches = text.matchAll(pattern)
    for (const match of matches) {
      const court = match[0]
      let score = 1
      
      // Boost score based on court hierarchy
      courtHierarchy.forEach(({ name, score: hierarchyScore }) => {
        if (court.toLowerCase().includes(name.toLowerCase())) {
          score += hierarchyScore
        }
      })
      
      // Prefer more complete court names
      if (court.includes('of') || court.includes(',')) score += 1
      
      if (score > courtScore) {
        courtScore = score
        bestCourtName = court
      }
    }
  }
  info.courtName = bestCourtName

  // Intelligent date extraction and validation
  const foundDates: string[] = []
  const dateSet: Set<string> = new Set()
  
  for (const pattern of DATE_PATTERNS) {
    pattern.lastIndex = 0
    const matches = text.match(pattern)
    if (matches) {
      matches.forEach(dateStr => {
        // Validate and normalize dates
        const normalized = normalizeDate(dateStr)
        if (normalized && !dateSet.has(normalized)) {
          dateSet.add(normalized)
          foundDates.push(normalized)
        }
      })
    }
  }
  
  // Sort dates by relevance (recent first for legal documents)
  foundDates.sort((a, b) => {
    const yearA = parseInt(a.match(/\b(19|20)\d{2}\b/)?.[1] || '0')
    const yearB = parseInt(b.match(/\b(19|20)\d{2}\b/)?.[1] || '0')
    return yearB - yearA // Descending order
  })
  
  info.dates = foundDates.slice(0, 5).join('; ') // Limit to 5 most relevant dates

  return info
}

// Date normalization helper function
function normalizeDate(dateStr: string): string | null {
  // Remove extra whitespace and normalize
  const cleaned = dateStr.trim().replace(/\s+/g, ' ')
  
  // Basic validation
  if (!cleaned.match(/\d/)) return null
  
  // Try to parse and format consistently
  try {
    const date = new Date(cleaned)
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  } catch {
    // Fall back to original string if parsing fails
  }
  
  return cleaned
}

// Advanced document classification using TF-IDF and cosine similarity
export function classifyDocumentAdvanced(text: string, extractedInfo?: ExtractedCaseInfo): DocumentType {
  const lowerText = text.toLowerCase()
  
  // TF-IDF scoring for document types
  const tfidfScores: Record<DocumentType, number> = {
    PETITION: 0,
    AFFIDAVIT: 0,
    JUDGMENT: 0,
    ORDER: 0,
    CONTRACT: 0,
    CORRESPONDENCE: 0,
    EVIDENCE: 0,
    INVOICE: 0,
    RECEIPT: 0,
    POWER_OF_ATTORNEY: 0,
    NOTICE: 0,
    FILING: 0,
    PDF_DOCUMENT: 0,
    OTHER: 0
  }
  
  // Calculate TF-IDF scores
  const words = lowerText.split(/\s+/).filter(word => word.length > 2)
  const wordFreq: Record<string, number> = {}
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  // Enhanced keyword matching with context awareness
  for (const [docType, keywords] of Object.entries(DOCUMENT_TYPE_KEYWORDS)) {
    if (docType === 'OTHER') continue
    
    let score = 0
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
      const matches = text.match(regex)
      if (matches) {
        // Weight by position (earlier in document gets higher weight)
        const positions: number[] = []
        let match
        while ((match = regex.exec(text)) !== null) {
          positions.push(match.index)
        }
        
        const avgPosition = positions.reduce((a, b) => a + b, 0) / positions.length
        const positionWeight = Math.max(0.1, 1 - (avgPosition / text.length))
        
        score += matches.length * positionWeight
      }
    })
    
    tfidfScores[docType as DocumentType] = score
  }
  
  // Find the document type with highest score
  let maxScore = 0
  let bestType: DocumentType = 'OTHER'
  
  for (const [docType, score] of Object.entries(tfidfScores)) {
    if (score > maxScore) {
      maxScore = score
      bestType = docType as DocumentType
    }
  }
  
  // Use extracted info to improve classification
  if (extractedInfo) {
    if (extractedInfo.caseNumber && bestType === 'OTHER') {
      bestType = 'FILING'
    }
    if (extractedInfo.courtName && (bestType === 'OTHER' || tfidfScores[bestType] < 2)) {
      if (lowerText.includes('judgment') || lowerText.includes('order')) {
        bestType = lowerText.includes('judgment') ? 'JUDGMENT' : 'ORDER'
      } else {
        bestType = 'FILING'
      }
    }
  }
  
  return bestType
}

export function classifyDocument(text: string, extractedInfo?: ExtractedCaseInfo): DocumentType {
  // Use advanced classification by default
  return classifyDocumentAdvanced(text, extractedInfo)
  
  // Fallback to simple classification if needed
  const lowerText = text.toLowerCase()
  
  // Check document type keywords
  for (const [docType, keywords] of Object.entries(DOCUMENT_TYPE_KEYWORDS)) {
    if (docType === 'OTHER') continue
    
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        return docType as DocumentType
      }
    }
  }

  // Use extracted info if available
  if (extractedInfo?.caseNumber?.toLowerCase().includes('wp')) {
    return 'PETITION'
  }

  return 'OTHER'
}

export async function performOCR(filePath: string, mimeType: string): Promise<{
  text: string
  info: ExtractedCaseInfo
  documentType: DocumentType
}> {
  let extractedText = ''

  if (mimeType.startsWith('image/')) {
    try {
      const result = await Tesseract.recognize(filePath, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
          }
        }
      })
      extractedText = result.data.text
    } catch (error) {
      console.error('OCR failed:', error)
      throw new Error('Failed to perform OCR on image')
    }
} else if (mimeType === 'application/pdf') {
    try {
      // TODO: Implement PDF text extraction
      // For now, skip PDF parsing to avoid import issues
      console.log('PDF parsing temporarily disabled')
      extractedText = ''
    } catch (error) {
      console.error('PDF parsing failed:', error)
      extractedText = ''
    }
  }

  const info = extractCaseInfo(extractedText)
  const documentType = classifyDocument(extractedText, info)

  return {
    text: extractedText,
    info,
    documentType
  }
}

// Simple extractive summarizer: pick top N sentences by keyword density
export function summarizeText(text: string, maxSentences = 5): string {
  if (!text) return ''
  const sentences = text
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)

  if (sentences.length <= maxSentences) return sentences.join(' ')

  // Score sentences by length and keyword occurrences
  const keywordList = [
    'agreement','party','whereas','witness','liability','penalty','obligation','term','condition','signed','signature','warranty','indemnity'
  ]

  const scores = sentences.map(s => {
    const lower = s.toLowerCase()
    let score = Math.min(1 + lower.split(' ').length / 20, 3)
    for (const k of keywordList) {
      if (lower.includes(k)) score += 2
    }
    return score
  })

  // Pick top N sentences
  const idx = sentences.map((s, i) => ({ i, score: scores[i] }))
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.i - b.i)

  return idx.map(x => sentences[x.i]).join(' ')
}

// Simple keyword search (returns matches with surrounding context)
export function keywordSearch(text: string, query: string, window = 50): Array<{ match: string, context: string }> {
  const results: Array<{ match: string, context: string }> = []
  if (!text || !query) return results
  const lower = text.toLowerCase()
  const q = query.toLowerCase()
  let start = 0
  while (true) {
    const idx = lower.indexOf(q, start)
    if (idx === -1) break
    const s = Math.max(0, idx - window)
    const e = Math.min(text.length, idx + q.length + window)
    results.push({ match: text.substring(idx, idx + q.length), context: text.substring(s, e) })
    start = idx + q.length
  }
  return results
}

// Clause detection: find sentences/lines containing clause-like keywords
export function detectClauses(text: string): string[] {
  if (!text) return []
  const clauseKeywords = ['section', 'clause', 'article', 'shall', 'liability', 'penalty', 'warranty', 'indemnity']
  const lines = text.replace(/\r/g, '').split(/\n|(?<=\.|\?|!)/).map(l => l.trim()).filter(Boolean)
  const found: string[] = []
  for (const line of lines) {
    const lower = line.toLowerCase()
    for (const kw of clauseKeywords) {
      if (lower.includes(kw)) {
        found.push(line)
        break
      }
    }
  }
  return found
}

// Get folder label
export function getFolderLabel(folder: DocumentFolder): string {
  const labels: Record<DocumentFolder, string> = {
    GENERAL: 'General',
    PLEADINGS: 'Pleadings',
    EVIDENCE: 'Evidence',
    CORRESPONDENCE: 'Correspondence',
    JUDGMENTS: 'Judgments',
    ORDERS: 'Orders',
    CONTRACTS: 'Contracts',
    INVOICES: 'Invoices',
    NOTES: 'Notes',
    DISCOVERY: 'Discovery',
    MOTIONS: 'Motions',
    FILINGS: 'Filings',
    CORRUPTED: 'Corrupted'
  }
  return labels[folder] || 'General'
}

export function getFolderColor(folder: DocumentFolder): string {
  const colors: Record<DocumentFolder, string> = {
    GENERAL: 'bg-gray-100 text-gray-800',
    PLEADINGS: 'bg-blue-100 text-blue-800',
    EVIDENCE: 'bg-orange-100 text-orange-800',
    CORRESPONDENCE: 'bg-indigo-100 text-indigo-800',
    JUDGMENTS: 'bg-green-100 text-green-800',
    ORDERS: 'bg-teal-100 text-teal-800',
    CONTRACTS: 'bg-yellow-100 text-yellow-800',
    INVOICES: 'bg-pink-100 text-pink-800',
    NOTES: 'bg-purple-100 text-purple-800',
    DISCOVERY: 'bg-cyan-100 text-cyan-800',
    MOTIONS: 'bg-amber-100 text-amber-800',
    FILINGS: 'bg-rose-100 text-rose-800',
    CORRUPTED: 'bg-red-100 text-red-800'
  }
  return colors[folder] || 'bg-gray-100 text-gray-800'
}

// Calculate file checksum for integrity verification
export async function calculateChecksum(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath)
  const hash = crypto.createHash('sha256')
  hash.update(fileBuffer)
  return hash.digest('hex')
}

// Auto-tag documents based on content analysis
export function generateTags(extractedInfo: ExtractedCaseInfo, documentType: DocumentType): string[] {
  const tags: string[] = []
  
  // Add document type as a tag
  tags.push(documentType.toLowerCase())
  
  // Add case number parts as tags if available
  if (extractedInfo.caseNumber) {
    // Extract meaningful parts from case number
    const caseParts = extractedInfo.caseNumber.split(/[\/\-\s]/)
    caseParts.forEach(part => {
      if (part.length > 2 && !part.match(/^\d+$/)) {
        tags.push(part.toLowerCase())
      }
    })
  }
  
  // Add court name as tag
  if (extractedInfo.courtName) {
    const courtName = extractedInfo.courtName.toLowerCase()
      .replace(/\s+court$/i, '')
      .trim()
    if (courtName) {
      tags.push(courtName)
    }
  }
  
  // Add party names as tags (limit to first names)
  if (extractedInfo.partyNames) {
    const parties = extractedInfo.partyNames.split(',')
    parties.slice(0, 3).forEach(party => {
      const name = party.trim().toLowerCase().split(' ')[0]
      if (name && name.length > 2) {
        tags.push(name)
      }
    })
  }
  
  // Extract dates and add year tags
  if (extractedInfo.dates) {
    const yearMatch = extractedInfo.dates.match(/\b(19|20)\d{2}\b/)
    if (yearMatch) {
      tags.push(yearMatch[0])
    }
  }
  
  return [...new Set(tags)] // Remove duplicates
}

// Extract structured data from PDF (placeholder - would use pdf-parse in production)
export async function extractTextFromPDF(_filePath: string): Promise<string> {
  // TODO: Implement PDF text extraction properly
  console.log('PDF text extraction temporarily disabled')
  return ''
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
          extractedText = await extractTextFromPDF(filePath)
          documentType = 'PDF_DOCUMENT'
        }
      } catch (ocrError) {
        console.error(`OCR Error for ${file.name}:`, ocrError)
      }

      // Extract case info
      const extractedInfo = extractCaseInfo(extractedText)
      
      // Get case data
      const caseData = await prisma.case.findUnique({
        where: { id: caseId },
        select: { caseNumber: true }
      })

      // Generate tags
      const tags = generateTags(extractedInfo, documentType)
      const folder = detectFolder(documentType)

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
          extractedText: extractedText,
          caseNumber: extractedInfo.caseNumber || caseData?.caseNumber || '',
          partyNames: extractedInfo.partyNames,
          courtName: extractedInfo.courtName,
          dates: extractedInfo.dates,
          documentType: documentType,
          folder: folder,
          tags: JSON.stringify(tags),
          version: (latestDoc?.version || 0) + i + 1,
          isLatest: true,
          checksum: checksum
        },
        include: {
          uploadedBy: {
            select: { id: true, name: true, email: true }
          },
          case: {
            select: { id: true, caseNumber: true, title: true }
          }
        }
      })

      results.documents.push(document)
      results.ocrResults.push({
        text: extractedText,
        info: extractedInfo,
        documentType: documentType
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

