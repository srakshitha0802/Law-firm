'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Document } from '@/types'
import { Sparkles, Brain, FileText, Search, RefreshCw } from 'lucide-react'

// Format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get document type label
function getDocumentTypeLabel(type?: string): string {
  const labels: Record<string, string> = {
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
  return labels[type || 'OTHER'] || 'Other'
}

// Get document type color
function getDocumentTypeColor(type?: string): string {
  const colors: Record<string, string> = {
    PETITION: 'bg-blue-100 text-blue-800',
    AFFIDAVIT: 'bg-purple-100 text-purple-800',
    JUDGMENT: 'bg-green-100 text-green-800',
    ORDER: 'bg-teal-100 text-teal-800',
    CONTRACT: 'bg-yellow-100 text-yellow-800',
    CORRESPONDENCE: 'bg-gray-100 text-gray-800',
    EVIDENCE: 'bg-orange-100 text-orange-800',
    INVOICE: 'bg-pink-100 text-pink-800',
    RECEIPT: 'bg-rose-100 text-rose-800',
    POWER_OF_ATTORNEY: 'bg-indigo-100 text-indigo-800',
    NOTICE: 'bg-amber-100 text-amber-800',
    FILING: 'bg-cyan-100 text-cyan-800',
    PDF_DOCUMENT: 'bg-red-100 text-red-800',
    OTHER: 'bg-gray-100 text-gray-800'
  }
  return colors[type || 'OTHER'] || 'bg-gray-100 text-gray-800'
}

interface DocumentManagerProps {
  caseId: string
  documents: Document[]
  onDocumentUploaded?: (document: Document) => void
  onDocumentDeleted?: (documentId: string) => void
}

export default function DocumentManager({
  caseId,
  documents,
  onDocumentUploaded,
  onDocumentDeleted
}: DocumentManagerProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [showExtractedModal, setShowExtractedModal] = useState(false)
  const [activeExtractedText, setActiveExtractedText] = useState<Document | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [isAIProcessing, setIsAIProcessing] = useState(false)
  const [aiProcessingDoc, setAiProcessingDoc] = useState<string | null>(null)
const [aiResult, setAIResult] = useState<{
    summary?: string
    documentType?: string
    category?: string
    confidence?: number
    entities?: Array<{ text: string; type: string; confidence: number }>
    keyPoints?: string[]
  } | null>(null)
  const [showAIModal, setShowAIModal] = useState(false)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'image/webp'
    ]

    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: PDF, JPEG, PNG, TIFF, WebP')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit')
      return
    }

    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('caseId', caseId)

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }

      const { document } = await response.json()
      setSuccess(`Document "${file.name}" uploaded successfully`)
      
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      if (onDocumentUploaded) {
        onDocumentUploaded(document)
      }

      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload document'
      setError(errorMessage)
    } finally {
      setIsUploading(false)
      setUploadProgress(100)
    }
  }

  const handleDownload = async (doc: Document) => {
    try {
      const response = await fetch(`/api/documents/${doc.id}?action=download`)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = doc.originalName
      window.document.body.appendChild(a)
      a.click()
      window.document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch {
      setError('Failed to download document')
    }
  }

  const handlePreview = async (document: Document) => {
    try {
      const response = await fetch(`/api/documents/${document.id}?action=preview`)
      if (!response.ok) throw new Error('Preview failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch {
      setError('Failed to preview document')
    }
  }

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/documents?id=${documentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Delete failed')
      }

      setSuccess('Document deleted successfully')
      
      if (onDocumentDeleted) {
        onDocumentDeleted(documentId)
      }

      router.refresh()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document'
      setError(errorMessage)
    }
  }

  const handleViewVersions = async (document: Document) => {
    setSelectedDocument(document)
    setShowVersionHistory(true)
  }

  const handleViewExtracted = (document: Document) => {
    setActiveExtractedText(document)
    setShowExtractedModal(true)
  }

  const detectClausesClient = (text?: string) => {
    if (!text) return [] as string[]
    const clauseKeywords = ['section','clause','article','shall','liability','penalty','warranty','indemnity']
    const lines = text.replace(/\r/g, '').split(/\n|(?<=\.|\?|!)/).map(l => l.trim()).filter(Boolean)
    return lines.filter(l => clauseKeywords.some(kw => l.toLowerCase().includes(kw)))
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.partyNames?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.extractedText?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === 'all' || doc.documentType === filterType
    
    return matchesSearch && matchesType
  })

  const documentTypes = [...new Set(documents.map(d => d.documentType).filter((t): t is string => Boolean(t)))]

  const handleAIAnalysis = async (document: Document, action: 'summarize' | 'classify' | 'extract') => {
    if (!document.extractedText) {
      setError('No extracted text available for AI analysis')
      return
    }

    setAiProcessingDoc(document.id)
    setIsAIProcessing(true)
    setAIResult(null)

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          text: document.extractedText,
          documentId: document.id
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'AI processing failed')
      }

      const result = await response.json()
      setAIResult(result)
      setShowAIModal(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'AI processing failed'
      setError(errorMessage)
    } finally {
      setIsAIProcessing(false)
      setAiProcessingDoc(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Document Management</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : '+ Upload Document'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.tiff,.webp"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Search and Filters */}
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            {documentTypes.map(type => (
              <option key={type} value={type}>{getDocumentTypeLabel(type)}</option>
            ))}
          </select>
        </div>

        {/* Progress Bar */}
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">Uploading document...</p>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
            {success}
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="p-6">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{doc.originalName}</div>
                          {doc.caseNumber && (
                            <div className="text-xs text-gray-500">Case: {doc.caseNumber}</div>
                          )}
                          {doc.version > 1 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              v{doc.version}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDocumentTypeColor(doc.documentType || undefined)}`}>
                        {getDocumentTypeLabel(doc.documentType || undefined)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(doc.size)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handlePreview(doc)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Preview"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleViewVersions(doc)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Version History"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleViewExtracted(doc)}
                          className="text-gray-600 hover:text-gray-900"
                          title="View Extracted Text"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        {doc.extractedText && (
                          <div className="relative group">
                            <button
                              onClick={() => handleAIAnalysis(doc, 'summarize')}
                              disabled={isAIProcessing}
                              className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                              title="AI Analysis"
                            >
                              {isAIProcessing && aiProcessingDoc === doc.id ? (
                                <RefreshCw className="h-5 w-5 animate-spin" />
                              ) : (
                                <Sparkles className="h-5 w-5" />
                              )}
                            </button>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              AI Analysis
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Version History Modal */}
      {showVersionHistory && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Version History</h3>
              <button
                onClick={() => {
                  setShowVersionHistory(false)
                  setSelectedDocument(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium">{selectedDocument.originalName}</h4>
                <p className="text-sm text-gray-500">Current Version: {selectedDocument.version}</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex-shrink-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-green-900">Version {selectedDocument.version} (Latest)</p>
                    <p className="text-xs text-green-700">
                      {selectedDocument.uploadedBy?.name} • {new Date(selectedDocument.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedDocument)}
                    className="text-green-600 hover:text-green-800 text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extracted Text Modal */}
      {showExtractedModal && activeExtractedText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Extracted Text & Summary</h3>
              <button
                onClick={() => {
                  setShowExtractedModal(false)
                  setActiveExtractedText(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-medium">{activeExtractedText.originalName}</h4>
                <p className="text-sm text-gray-500">Uploaded: {new Date(activeExtractedText.createdAt).toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                {activeExtractedText.summary && (
                  <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                    <h5 className="font-medium">Summary</h5>
                    <p className="text-sm text-gray-700 mt-2">{activeExtractedText.summary}</p>
                  </div>
                )}

                <div>
                  <h5 className="font-medium mb-2">Detected Clauses</h5>
                  <div className="space-y-2">
                    {detectClausesClient(activeExtractedText.extractedText || '').length === 0 ? (
                      <p className="text-sm text-gray-500">No clause-like lines detected.</p>
                    ) : (
                      detectClausesClient(activeExtractedText.extractedText || '').map((cl, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 border border-gray-100 rounded">
                          <p className="text-sm text-gray-700">{cl}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h5 className="font-medium mb-2">Full Extracted Text</h5>
                  <div className="p-4 bg-white border border-gray-100 rounded max-h-64 overflow-y-auto text-sm whitespace-pre-wrap">
                    {activeExtractedText.extractedText || (<span className="text-gray-400">No extracted text available.</span>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Modal */}
      {showAIModal && aiResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                AI Analysis Result
              </h3>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {aiResult.summary && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Summary
                  </h4>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">{aiResult.summary}</p>
                  </div>
                </div>
              )}
              
              {aiResult.documentType && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Brain className="h-4 w-4 mr-2 text-green-600" />
                    Classification
                  </h4>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      Type: <strong>{aiResult.documentType}</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      Category: <strong>{aiResult.category || "Legal"}</strong>
                    </p>
                    <p className="text-sm text-gray-700">
                      Confidence: <strong>{(Number(aiResult.confidence) * 100).toFixed(1)}%</strong>
                    </p>
                  </div>
                </div>
              )}
              
              {Array.isArray(aiResult.entities) && aiResult.entities.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium mb-2 flex items-center">
                    <Search className="h-4 w-4 mr-2 text-orange-600" />
                    Extracted Entities
                  </h4>
                  <div className="space-y-2">
                    {aiResult.entities.map((entity, idx) => (
                      <div key={idx} className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm font-medium">{entity.text}</p>
                        <p className="text-xs text-gray-500">Type: {entity.type} | Confidence: {(Number(entity.confidence) * 100).toFixed(0)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {Array.isArray(aiResult.keyPoints) && aiResult.keyPoints.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 text-purple-600" />
                    Key Points
                  </h4>
                  <ul className="list-disc list-inside space-y-2">
{aiResult.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

