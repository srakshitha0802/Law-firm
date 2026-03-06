'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, Upload, FileText, AlertCircle, CheckCircle, Zap, Calendar, Users, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { extractCaseInfo, classifyDocument, extractLegalEntities, assessDocumentQuality } from '@/lib/ocr-utils'
import type { DocumentType, ExtractedCaseInfo } from '@/lib/ocr-utils'

interface ScannedData {
  caseNumber?: string
  courtName?: string
  caseType?: string
  parties?: {
    plaintiffs?: string[]
    defendants?: string[]
  }
  dates?: string[]
  advocate?: {
    name?: string
    mobile?: string
    appearanceDate?: string
  }
  extractedText: string
  confidence: number
  quality: {
    overallScore: number
    readabilityScore: number
    legalCompletenessScore: number
    structureScore: number
    recommendations: string[]
  }
}

export default function AdvocateScanner() {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<ScannedData | null>(null)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError('')
      setScannedData(null)
    }
  }, [])

  const processScannedDocument = useCallback(async (file: File) => {
    setIsScanning(true)
    setError('')

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)

      // Send to OCR processing endpoint
      const response = await fetch('/api/documents/scan', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Scanning failed')
      }

      const result = await response.json()
      
      // Extract structured information using advanced algorithms
      const extractedInfo = extractCaseInfo(result.text)
      const documentType = classifyDocument(result.text)
      const entities = extractLegalEntities(result.text)
      const quality = assessDocumentQuality(result.text)

      // Process and structure the data
      const structuredData: ScannedData = {
        caseNumber: extractedInfo.caseNumber || undefined,
        courtName: extractedInfo.courtName || undefined,
        caseType: documentType,
        parties: {
          plaintiffs: entities.persons?.slice(0, 3), // Limit to first 3 persons as plaintiffs
          defendants: entities.persons?.slice(3, 6) // Next persons as defendants
        },
        dates: extractedInfo.dates ? extractedInfo.dates.split('; ').filter(d => d.trim()) : [],
        advocate: {
          name: entities.persons?.[0], // First person as advocate
          mobile: entities.monetaryValues?.[0], // First monetary value might be mobile
          appearanceDate: entities.dates?.[0] // First date as appearance
        },
        extractedText: result.text,
        confidence: result.confidence || 0,
        quality
      }

      setScannedData(structuredData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Scanning failed. Please try again.')
    } finally {
      setIsScanning(false)
    }
  }, [])

  const handleScan = useCallback(() => {
    if (selectedFile) {
      processScannedDocument(selectedFile)
    }
  }, [selectedFile, processScannedDocument])

  const handleCreateCase = useCallback(() => {
    if (!scannedData) return

    // Navigate to new case form with pre-filled data
    const caseData = {
      title: scannedData.caseNumber || `Scanned Case - ${new Date().toLocaleDateString()}`,
      caseType: scannedData.caseType || 'CIVIL',
      courtName: scannedData.courtName || '',
      description: `Scanned document processed with AI. Confidence: ${scannedData.confidence}%\n\nExtracted parties:\n${scannedData.parties?.plaintiffs?.join(', ') || ''}\nvs\n${scannedData.parties?.defendants?.join(', ') || ''}`,
      firstHearing: scannedData.dates?.[0] || '',
      filingDate: scannedData.advocate?.appearanceDate || ''
    }

    // Store in sessionStorage for the new case form
    sessionStorage.setItem('scannedCaseData', JSON.stringify(caseData))
    
    // Navigate to new case page
    window.location.href = '/cases/new'
  }, [scannedData])

  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Camera className="h-6 w-6 text-blue-900" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Document Scanner</h2>
            <p className="text-sm text-gray-600">Scan legal documents to extract case information</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            Powered by AI OCR
          </div>
          <Zap className="h-4 w-4 text-yellow-500" />
        </div>
      </div>

      {/* File Upload */}
      <div className="mb-6">
        <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="space-y-4 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-900 hover:text-blue-800">
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  ref={fileInputRef}
                  type="file"
                  className="sr-only"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, PDF up to 10MB
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Scan Button */}
      <div className="mb-6">
        <Button
          onClick={handleScan}
          disabled={!selectedFile || isScanning}
          className="w-full"
        >
          {isScanning ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Scanning Document...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Scan & Extract Information
            </>
          )}
        </Button>
      </div>

      {/* Scanned Results */}
      {scannedData && (
        <div className="space-y-6">
          {/* Success Header */}
          <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Document Scanned Successfully</h3>
              <p className="text-xs text-green-600">
                Confidence: {scannedData.confidence}% | Quality Score: {scannedData.quality.overallScore}/100
              </p>
            </div>
          </div>

          {/* Extracted Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Case Details
              </h4>
              
              {scannedData.caseNumber && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500">Case Number</p>
                  <p className="text-sm text-gray-900">{scannedData.caseNumber}</p>
                </div>
              )}

              {scannedData.courtName && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500">Court Name</p>
                  <p className="text-sm text-gray-900">{scannedData.courtName}</p>
                </div>
              )}

              {scannedData.caseType && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500">Document Type</p>
                  <p className="text-sm text-gray-900">{scannedData.caseType}</p>
                </div>
              )}

              {scannedData.dates && scannedData.dates.length > 0 && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-500">Extracted Dates</p>
                  <div className="space-y-1">
                    {scannedData.dates.map((date, index) => (
                      <p key={index} className="text-sm text-gray-900">{date}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Parties & Advocate */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Parties & Advocate
              </h4>

              {scannedData.parties && (
                <div className="space-y-3">
                  {scannedData.parties.plaintiffs && scannedData.parties.plaintiffs.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-medium text-blue-500">Plaintiffs/Applicants</p>
                      <div className="space-y-1">
                        {scannedData.parties.plaintiffs.map((plaintiff, index) => (
                          <p key={index} className="text-sm text-blue-900">{plaintiff}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {scannedData.parties.defendants && scannedData.parties.defendants.length > 0 && (
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs font-medium text-red-500">Defendants/Respondents</p>
                      <div className="space-y-1">
                        {scannedData.parties.defendants.map((defendant, index) => (
                          <p key={index} className="text-sm text-red-900">{defendant}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {scannedData.advocate && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs font-medium text-green-500">Advocate Information</p>
                  {scannedData.advocate.name && (
                    <p className="text-sm text-green-900">Name: {scannedData.advocate.name}</p>
                  )}
                  {scannedData.advocate.mobile && (
                    <p className="text-sm text-green-900">Mobile: {scannedData.advocate.mobile}</p>
                  )}
                  {scannedData.advocate.appearanceDate && (
                    <p className="text-sm text-green-900">Appearance: {scannedData.advocate.appearanceDate}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quality Assessment */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Document Quality Assessment</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{scannedData.quality.overallScore}</p>
                <p className="text-xs text-gray-500">Overall Score</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getQualityColor(scannedData.quality.readabilityScore)}`}>
                  {scannedData.quality.readabilityScore}
                </p>
                <p className="text-xs text-gray-500">Readability</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getQualityColor(scannedData.quality.legalCompletenessScore)}`}>
                  {scannedData.quality.legalCompletenessScore}
                </p>
                <p className="text-xs text-gray-500">Legal Completeness</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${getQualityColor(scannedData.quality.structureScore)}`}>
                  {scannedData.quality.structureScore}
                </p>
                <p className="text-xs text-gray-500">Structure</p>
              </div>
            </div>

            {scannedData.quality.recommendations.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-700">Recommendations:</p>
                <ul className="mt-2 text-sm text-gray-600 space-y-1">
                  {scannedData.quality.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setScannedData(null)
                setSelectedFile(null)
                if (fileInputRef.current) {
                  fileInputRef.current.value = ''
                }
              }}
            >
              Scan Another Document
            </Button>
            <Button
              onClick={handleCreateCase}
              className="bg-blue-900 hover:bg-blue-800"
            >
              Create Case with This Data
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
