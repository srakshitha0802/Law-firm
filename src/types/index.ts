export type UserRole = 'ADMIN' | 'ADVOCATE' | 'CLIENT'
export type CaseType = 'CIVIL' | 'CRIMINAL' | 'FAMILY' | 'PROPERTY' | 'CORPORATE' | 'OTHER'
export type CaseStatus = 'PENDING' | 'ACTIVE' | 'HEARING' | 'JUDGEMENT_RESERVED' | 'COMPLETED' | 'DISMISSED'
export type ReminderType = 'HEARING' | 'FILING_DEADLINE' | 'FOLLOW_UP' | 'DOCUMENT_REQUIRED' | 'CUSTOM'
export type ReminderStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE'
export type NotificationType = 'CASE_UPDATE' | 'HEARING_SCHEDULED' | 'DOCUMENT_UPLOADED' | 'REMINDER' | 'SYSTEM'
export type ConsultationStatus = 'PENDING' | 'ASSIGNED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
export type DocumentStatus = 'ACTIVE' | 'ARCHIVED' | 'DELETED'
export type DocumentFolder = 'GENERAL' | 'PLEADINGS' | 'EVIDENCE' | 'CORRESPONDENCE' | 'JUDGMENTS' | 'ORDERS' | 'CONTRACTS' | 'INVOICES' | 'NOTES' | 'DISCOVERY' | 'MOTIONS' | 'FILINGS' | 'CORRUPTED'

export interface User {
  id: string
  email: string
  name: string
  role: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Case {
  id: string
  caseNumber: string
  title: string
  description?: string
  caseType: string
  status: string
  courtName: string
  clientId: string
  advocateId: string
  firstHearing?: Date
  nextHearing?: Date
  filingDate?: Date
  judgementDate?: Date
  createdAt: Date
  updatedAt: Date
  client?: User
  advocate?: User
  documents?: Document[]
  notes?: CaseNote[]
  hearings?: Hearing[]
}

export interface Document {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  path: string
  uploadedById: string
  caseId: string
  createdAt: Date
  updatedAt: Date
  extractedText?: string | null
  summary?: string | null
  ocrConfidence?: number | null
  signaturesDetected?: boolean
  stampsDetected?: boolean
  caseNumber?: string | null
  partyNames?: string | null
  courtName?: string | null
  dates?: string | null
  documentType?: string | null
  folder?: string
  tags?: string | null
  status?: string
  version: number
  parentDocId?: string | null
  isLatest: boolean
  checksum?: string | null
  uploadedBy?: User
  case?: Case
  parentDoc?: Document | null
  childDocs?: Document[]
}

export interface CaseNote {
  id: string
  content: string
  caseId: string
  authorId: string
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
  case?: Case
  author?: User
}

export interface Reminder {
  id: string
  title: string
  message: string
  dueDate: Date
  type: string
  status: string
  caseId: string
  userId: string
  createdAt: Date
  updatedAt: Date
  case?: Case
  user?: User
}

export interface Hearing {
  id: string
  caseId: string
  date: Date
  time: string
  courtRoom?: string
  purpose: string
  outcome?: string
  createdAt: Date
  updatedAt: Date
  case?: Case
}

export interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  userId: string
  caseId?: string
  createdAt: Date
  user?: User
}

export interface ConsultationRequest {
  id: string
  name: string
  email: string
  phone: string
  caseType?: string
  description: string
  preferredDate?: Date
  status: string
  createdAt: Date
  updatedAt: Date
  assignedToId?: string
  assignedTo?: User
}

export interface JWTPayload {
  userId: string
  email: string
  role: UserRole
  name: string
}
