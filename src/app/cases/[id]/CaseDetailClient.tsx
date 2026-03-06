'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Case } from '@/types'
import { 
  Calendar, 
  User, 
  FileText, 
  Scale, 
  Clock, 
  Edit,
  ArrowLeft,
  Download,
  Upload
} from 'lucide-react'

interface CaseDetailClientProps {
  caseData: Case
}

export default function CaseDetailClient({ caseData }: CaseDetailClientProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'hearings' | 'notes'>('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'HEARING': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'JUDGEMENT_RESERVED': return 'bg-purple-100 text-purple-800'
      case 'DISMISSED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCaseTypeColor = (type: string) => {
    switch (type) {
      case 'CIVIL': return 'bg-blue-50 text-blue-700'
      case 'CRIMINAL': return 'bg-red-50 text-red-700'
      case 'FAMILY': return 'bg-purple-50 text-purple-700'
      case 'PROPERTY': return 'bg-green-50 text-green-700'
      case 'CORPORATE': return 'bg-indigo-50 text-indigo-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{caseData.title}</h1>
                <p className="text-sm text-gray-600">Case Number: {caseData.caseNumber}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(caseData.status)}`}>
                {caseData.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCaseTypeColor(caseData.caseType)}`}>
                {caseData.caseType}
              </span>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Case
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Scale },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'hearings', label: 'Hearings', icon: Calendar },
              { id: 'notes', label: 'Notes', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-900 text-blue-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Case Details */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Case Details</h2>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Court</dt>
                    <dd className="mt-1 text-sm text-gray-900">{caseData.courtName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Filing Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(caseData.filingDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">First Hearing</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(caseData.firstHearing)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Next Hearing</dt>
                    <dd className="mt-1 text-sm text-gray-900">{formatDate(caseData.nextHearing)}</dd>
                  </div>
                </dl>
                {caseData.description && (
                  <div className="mt-4">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{caseData.description}</dd>
                  </div>
                )}
              </div>

              {/* Recent Documents */}
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Recent Documents</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('documents')}
                  >
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {caseData.documents?.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.originalName}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded by {doc.uploadedBy?.name} • {formatDate(doc.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Client Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Client Information</h2>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{caseData.client?.name}</p>
                    <p className="text-sm text-gray-500">{caseData.client?.email}</p>
                  </div>
                </div>
                {caseData.client?.phone && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Phone:</span> {caseData.client.phone}
                  </p>
                )}
              </div>

              {/* Advocate Info */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Assigned Advocate</h2>
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Scale className="h-6 w-6 text-green-900" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{caseData.advocate?.name}</p>
                    <p className="text-sm text-gray-500">{caseData.advocate?.email}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('documents')}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('hearings')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Hearing
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notes')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Case Documents</h2>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Document management will be available here.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push(`/cases/${caseData.id}/documents`)}
              >
                Go to Document Manager
              </Button>
            </div>
          </div>
        )}

        {/* Hearings Tab */}
        {activeTab === 'hearings' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Hearings & Proceedings</h2>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Hearing
              </Button>
            </div>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hearings scheduled yet.</p>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Case Notes</h2>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No notes added yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
