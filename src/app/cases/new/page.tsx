'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, CaseType } from '@/types'

export default function NewCasePage() {
  const [user, setUser] = useState<User | null>(null)
  const [clients, setClients] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    description: '',
    caseType: 'CIVIL' as CaseType,
    courtName: '',
    clientId: '',
    firstHearing: '',
    filingDate: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const userResponse = await fetch('/api/auth/me')
        if (!userResponse.ok) {
          router.push('/login')
          return
        }
        const userData = await userResponse.json()
        setUser(userData.user)

        // Only ADMIN and ADVOCATE can create cases
        if (userData.user.role !== 'ADMIN' && userData.user.role !== 'ADVOCATE') {
          router.push('/dashboard')
          return
        }

        // Fetch clients (for ADMIN and ADVOCATE)
        const clientsResponse = await fetch('/api/users/clients')
        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json()
          setClients(clientsData.clients || [])
        }

        // Load scanned data if available
        const scannedData = sessionStorage.getItem('scannedCaseData')
        if (scannedData) {
          try {
            const parsedData = JSON.parse(scannedData)
            setFormData(prev => ({
              ...prev,
              ...parsedData
            }))
            // Clear the scanned data after loading
            sessionStorage.removeItem('scannedCaseData')
          } catch (error) {
            console.error('Failed to parse scanned data:', error)
          }
        }
      } catch (error) {
        console.error('Data fetch error:', error)
        setError('Failed to load required data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create case')
      }

      const result = await response.json()
      router.push(`/cases/${result.case.id}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Case</h1>
              <p className="text-sm text-gray-600">Fill in the details to create a new case</p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="text-red-800">{error}</div>
              </div>
            )}

            {/* Case Number */}
            <div>
              <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700">
                Case Number (Optional)
              </label>
              <input
                type="text"
                id="caseNumber"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Will be auto-generated if left empty"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Case Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Enter case title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Enter case description"
              />
            </div>

            {/* Case Type */}
            <div>
              <label htmlFor="caseType" className="block text-sm font-medium text-gray-700">
                Case Type *
              </label>
              <select
                id="caseType"
                name="caseType"
                value={formData.caseType}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="CIVIL">Civil</option>
                <option value="CRIMINAL">Criminal</option>
                <option value="FAMILY">Family</option>
                <option value="PROPERTY">Property</option>
                <option value="CORPORATE">Corporate</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Court Name */}
            <div>
              <label htmlFor="courtName" className="block text-sm font-medium text-gray-700">
                Court Name *
              </label>
              <input
                type="text"
                id="courtName"
                name="courtName"
                value={formData.courtName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Enter court name"
              />
            </div>

            {/* Client */}
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                Client *
              </label>
              <select
                id="clientId"
                name="clientId"
                value={formData.clientId}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
              {clients.length === 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  No clients available. Please add clients first.
                </p>
              )}
            </div>

            {/* First Hearing */}
            <div>
              <label htmlFor="firstHearing" className="block text-sm font-medium text-gray-700">
                First Hearing Date
              </label>
              <input
                type="date"
                id="firstHearing"
                name="firstHearing"
                value={formData.firstHearing}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Filing Date */}
            <div>
              <label htmlFor="filingDate" className="block text-sm font-medium text-gray-700">
                Filing Date
              </label>
              <input
                type="date"
                id="filingDate"
                name="filingDate"
                value={formData.filingDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || clients.length === 0}
                className="bg-blue-900 hover:bg-blue-800"
              >
                {submitting ? 'Creating...' : 'Create Case'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
