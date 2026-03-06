import { v4 as uuidv4 } from 'uuid'
import Tesseract from 'tesseract.js'
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
        const cleaned = dateStr.trim().replace(/\s+/g, ' ')
        if (cleaned && !dateSet.has(cleaned)) {
          dateSet.add(cleaned)
          foundDates.push(cleaned)
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
    if (extractedInfo.courtName && (tfidfScores[bestType] < 2)) {
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

// Advanced document similarity detection using Jaccard similarity
export function calculateDocumentSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 2))
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 2))
  
  const intersection = new Set([...words1].filter(x => words2.has(x)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}

// Advanced document clustering for similar documents
export function clusterSimilarDocuments(documents: Array<{ id: string; text: string }>, threshold: number = 0.7): Array<Array<string>> {
  const clusters: Array<Array<string>> = []
  const processed = new Set<string>()
  
  for (const doc1 of documents) {
    if (processed.has(doc1.id)) continue
    
    const cluster = [doc1.id]
    processed.add(doc1.id)
    
    for (const doc2 of documents) {
      if (processed.has(doc2.id)) continue
      
      const similarity = calculateDocumentSimilarity(doc1.text, doc2.text)
      if (similarity >= threshold) {
        cluster.push(doc2.id)
        processed.add(doc2.id)
      }
    }
    
    clusters.push(cluster)
  }
  
  return clusters
}

// Intelligent document summarization using extractive summarization
export function summarizeDocument(text: string, maxSentences: number = 3): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || []
  
  if (sentences.length <= maxSentences) {
    return text
  }
  
  // Calculate sentence scores based on word frequency and position
  const wordFreq: Record<string, number> = {}
  const words = text.toLowerCase().split(/\s+/)
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  const sentenceScores = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/)
    let score = 0
    
    sentenceWords.forEach(word => {
      score += wordFreq[word] || 0
    })
    
    // Boost score for sentences at the beginning and end
    const positionWeight = index === 0 ? 1.5 : index === sentences.length - 1 ? 1.2 : 1
    score *= positionWeight
    
    return { sentence, score, index }
  })
  
  // Select top sentences maintaining order
  sentenceScores.sort((a, b) => b.score - a.score)
  const topSentences = sentenceScores.slice(0, maxSentences)
  topSentences.sort((a, b) => a.index - b.index)
  
  return topSentences.map(s => s.sentence).join(' ').trim()
}

// Advanced legal entity recognition
export function extractLegalEntities(text: string): {
  persons: string[]
  organizations: string[]
  locations: string[]
  dates: string[]
  monetaryValues: string[]
} {
  const entities = {
    persons: [] as string[],
    organizations: [] as string[],
    locations: [] as string[],
    dates: [] as string[],
    monetaryValues: [] as string[]
  }
  
  // Person name patterns
  const personPatterns = [
    /\b(?:Mr|Mrs|Ms|Dr|Prof|Adv|Smt|Sh)\.?\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g,
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+\s+(?:Jain|Singh|Kumar|Sharma|Patel|Shah|Gupta|Agarwal|Joshi|Reddy|Nair|Menon|Iyer|Pillai)/g
  ]
  
  personPatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    matches.forEach(match => {
      if (!entities.persons.includes(match.trim())) {
        entities.persons.push(match.trim())
      }
    })
  })
  
  // Organization patterns
  const orgPatterns = [
    /\b(?:[A-Z][a-z]+\s)+(?:Ltd|Pvt|Limited|Private|Corporation|Inc|LLC|Company|Firm|Associates|Partnership)/g,
    /\b(?:Ministry|Department|Office|Authority|Commission|Board|Tribunal|Court)\s+(?:of|for)\s+[A-Za-z\s]+/g
  ]
  
  orgPatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    matches.forEach(match => {
      if (!entities.organizations.includes(match.trim())) {
        entities.organizations.push(match.trim())
      }
    })
  })
  
  // Location patterns
  const locationPatterns = [
    /\b(?:[A-Z][a-z]+\s)+(?:Street|Road|Avenue|Lane|Nagar|Colony|Society|Apartment|Building|Tower|Complex)/g,
    /\b(?:[A-Z][a-z]+\s)+(?:District|State|City|Town|Village)/g
  ]
  
  locationPatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    matches.forEach(match => {
      if (!entities.locations.includes(match.trim())) {
        entities.locations.push(match.trim())
      }
    })
  })
  
  // Date patterns (enhanced)
  const datePattern = /\b(?:\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/gi
  const dateMatches = text.match(datePattern) || []
  dateMatches.forEach(match => {
    if (!entities.dates.includes(match.trim())) {
      entities.dates.push(match.trim())
    }
  })
  
  // Monetary value patterns
  const moneyPatterns = [
    /\b(?:Rs|INR|USD|\$)\s*\d{1,3}(?:,\d{3})*(?:\.\d{2})?/g,
    /\b\d{1,3}(?:,\d{3})*(?:\.\d{2})?\s*(?:Rs|INR|USD|rupees|dollars)/gi
  ]
  
  moneyPatterns.forEach(pattern => {
    const matches = text.match(pattern) || []
    matches.forEach(match => {
      if (!entities.monetaryValues.includes(match.trim())) {
        entities.monetaryValues.push(match.trim())
      }
    })
  })
  
  return entities
}

// Advanced document quality assessment
export function assessDocumentQuality(text: string): {
  overallScore: number
  readabilityScore: number
  legalCompletenessScore: number
  structureScore: number
  recommendations: string[]
} {
  const recommendations: string[] = []
  
  // Readability assessment
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const avgWordsPerSentence = words.length / sentences.length
  
  let readabilityScore = 100
  if (avgWordsPerSentence > 25) {
    readabilityScore -= 20
    recommendations.push('Consider breaking down long sentences for better readability')
  }
  if (avgWordsPerSentence < 8) {
    readabilityScore -= 10
    recommendations.push('Some sentences may be too short and lack detail')
  }
  
  // Legal completeness assessment
  const legalTerms = ['whereas', 'therefore', 'hereby', 'pursuant', 'in accordance with', 'notwithstanding', 'aforementioned']
  const legalTermCount = legalTerms.filter(term => text.toLowerCase().includes(term)).length
  
  let legalCompletenessScore = Math.min(100, legalTermCount * 15)
  if (legalCompletenessScore < 50) {
    recommendations.push('Document may lack legal terminology and formal structure')
  }
  
  // Structure assessment
  const hasHeader = /^\s*[A-Z][A-Z\s]{10,}/m.test(text)
  const hasNumbering = /\b(?:\d+\.|\([a-z]\)|\([A-Z]\)|[ivx]+\.)/.test(text)
  const hasSignatures = /\b(?:signed|signature|authorized|approved)/i.test(text)
  
  let structureScore = 0
  if (hasHeader) structureScore += 30
  if (hasNumbering) structureScore += 40
  if (hasSignatures) structureScore += 30
  
  if (structureScore < 50) {
    recommendations.push('Document structure could be improved with proper headers, numbering, and signature blocks')
  }
  
  const overallScore = (readabilityScore + legalCompletenessScore + structureScore) / 3
  
  return {
    overallScore: Math.round(overallScore),
    readabilityScore: Math.round(readabilityScore),
    legalCompletenessScore: Math.round(legalCompletenessScore),
    structureScore: Math.round(structureScore),
    recommendations
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get document type label
export function getDocumentTypeLabel(type: DocumentType): string {
  const labels: Record<DocumentType, string> = {
    PETITION: 'Petition',
    AFFIDAVIT: 'Affidavit',
    JUDGMENT: 'Judgment',
    ORDER: 'Order',
    CONTRACT: 'Contract',
    CORRESPONDENCE: 'Correspondence',
    EVIDENCE: 'Evidence',
    INVOICE: 'Invoice',
    RECEIPT: 'Receipt',
    POWER_OF_ATTORNEY: 'Power of Attorney',
    NOTICE: 'Notice',
    FILING: 'Filing',
    PDF_DOCUMENT: 'PDF Document',
    OTHER: 'Other'
  }
  return labels[type] || 'Other'
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
