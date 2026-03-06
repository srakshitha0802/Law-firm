import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import CaseDetailClient from './CaseDetailClient'

export const metadata: Metadata = {
  title: 'Case Details - Law Firm Management',
  description: 'View and manage case details, documents, and proceedings',
}

async function getCaseData(caseId: string) {
  const headersList = await headers()
  const token = headersList.get('auth-token') || 
                headersList.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return null
  }

  const payload = verifyToken(token)
  if (!payload) {
    return null
  }

  const caseData = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      },
      advocate: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      },
      documents: {
        where: { isLatest: true },
        include: {
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
      hearings: {
        orderBy: {
          date: 'desc'
        }
      },
      notes: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
              updatedAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  // Check if user has permission to view this case
  if (caseData) {
    if (payload.role === 'CLIENT' && caseData.clientId !== payload.userId) {
      return null
    }
    if (payload.role === 'ADVOCATE' && caseData.advocateId !== payload.userId) {
      return null
    }
  }

  return caseData
}

export default async function CasePage({ params }: { params: { id: string } }) {
  const caseData = await getCaseData(params.id)

  if (!caseData) {
    redirect('/dashboard')
  }

  // Convert null to undefined for type compatibility
  const formattedCaseData = {
    ...caseData,
    description: caseData.description || undefined,
    firstHearing: caseData.firstHearing || undefined,
    nextHearing: caseData.nextHearing || undefined,
    filingDate: caseData.filingDate || undefined,
    judgementDate: caseData.judgementDate || undefined,
    client: caseData.client ? {
      ...caseData.client,
      phone: caseData.client.phone || undefined
    } : caseData.client,
    hearings: caseData.hearings?.map(hearing => ({
      ...hearing,
      courtRoom: hearing.courtRoom || undefined,
      outcome: hearing.outcome || undefined
    })) || [],
    documents: caseData.documents?.map(doc => ({
      ...doc,
      summary: doc.summary || undefined,
      ocrConfidence: doc.ocrConfidence || undefined,
      signaturesDetected: doc.signaturesDetected || false,
      stampsDetected: doc.stampsDetected || false,
      caseNumber: doc.caseNumber || undefined,
      partyNames: doc.partyNames || undefined,
      courtName: doc.courtName || undefined,
      dates: doc.dates || undefined,
      documentType: doc.documentType || undefined,
      folder: doc.folder || undefined,
      tags: doc.tags || undefined,
      status: doc.status || undefined,
      checksum: doc.checksum || undefined
    })) || []
  }

  return <CaseDetailClient caseData={formattedCaseData} />
}
