import { Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import DocumentManager from '@/components/ui/DocumentManager'
import { Document, DocumentFolder } from '@/types'

export const metadata: Metadata = {
  title: 'Case Documents - Law Firm Management',
  description: 'Manage case documents with OCR scanning and version control',
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
          email: true
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
        where: { isLatest: true },
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
      }
    }
  })

  if (!caseData) {
    return null
  }

  // Check access
  const hasAccess = payload.role === 'ADMIN' ||
                   caseData.advocateId === payload.userId ||
                   caseData.clientId === payload.userId

  if (!hasAccess) {
    return null
  }

  return { caseData, userRole: payload.role }
}

export default async function CaseDocumentsPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await getCaseData(id)

  if (!result) {
    redirect('/dashboard')
  }

  const { caseData, userRole } = result

// Cast documents to proper type
  const documents: Document[] = caseData.documents.map((doc: any) => ({
    ...doc,
    extractedText: doc.extractedText ?? undefined,
    caseNumber: doc.caseNumber ?? undefined,
    partyNames: doc.partyNames ?? undefined,
    courtName: doc.courtName ?? undefined,
    dates: doc.dates ?? undefined,
    documentType: doc.documentType ?? undefined,
    folder: (doc.folder as DocumentFolder) ?? undefined,
    parentDocId: doc.parentDocId ?? undefined,
    uploadedBy: doc.uploadedBy ? {
      ...doc.uploadedBy,
      role: 'CLIENT' as const,
      phone: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    } : undefined,
    case: undefined
  }))

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {caseData.caseNumber}: {caseData.title}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {caseData.caseType} Case | {caseData.courtName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={`/cases/${caseData.id}`}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Back to Case
              </a>
              {(userRole === 'ADMIN' || userRole === 'ADVOCATE') && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {userRole}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Case Information</h2>
          <div className="bg-white rounded-lg shadow p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-medium">{caseData.client.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Advocate</p>
              <p className="font-medium">{caseData.advocate.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium capitalize">{caseData.status.toLowerCase().replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Documents</p>
              <p className="font-medium">{caseData.documents.length} files</p>
            </div>
          </div>
        </div>

        {/* Document Manager */}
        <DocumentManager
          caseId={caseData.id}
          documents={documents}
        />
      </main>
    </div>
  )
}

