'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, FileText, Users, Calendar, ArrowRight } from 'lucide-react'

function SearchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchType, setSearchType] = useState('all')

  const practiceAreas = [
    { id: 'civil', title: 'Civil Law', description: 'Property disputes, contract matters, and civil litigation' },
    { id: 'criminal', title: 'Criminal Law', description: 'Criminal defense and prosecution services' },
    { id: 'family', title: 'Family Law', description: 'Marriage, divorce, and family dispute resolution' },
    { id: 'property', title: 'Property & Land', description: 'Land acquisition and property disputes' },
    { id: 'corporate', title: 'Corporate Law', description: 'Business formation and corporate documentation' },
  ]

  const performSearch = useCallback(async () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = {
        cases: [
          {
            id: '1',
            title: 'Property Dispute Resolution',
            type: 'case',
            category: 'Civil Law',
            description: 'Successful resolution of complex property ownership dispute involving multiple parties.',
            url: '/cases/1'
          },
          {
            id: '2',
            title: 'Corporate Merger Documentation',
            type: 'case',
            category: 'Corporate Law',
            description: 'Complete legal documentation for merger of two technology companies.',
            url: '/cases/2'
          }
        ],
        practiceAreas: practiceAreas.filter(area => 
          area.title.toLowerCase().includes(query.toLowerCase()) ||
          area.description.toLowerCase().includes(query.toLowerCase())
        ).map(area => ({
          ...area,
          type: 'practice',
          url: `/practice-areas#${area.id}`
        })),
        advocates: [
          {
            id: '1',
            name: 'Senior Advocate (Father)',
            type: 'advocate',
            specialization: 'Civil & Criminal Law',
            experience: '25+ Years',
            url: '/advocates#father'
          },
          {
            id: '2',
            name: 'Senior Advocate (Mother)',
            type: 'advocate',
            specialization: 'Family & Property Law',
            experience: '20+ Years',
            url: '/advocates#mother'
          }
        ],
        articles: [
          {
            id: '1',
            title: 'Understanding Property Rights in India',
            type: 'article',
            category: 'Legal Insight',
            description: 'Comprehensive guide to property laws and rights in India.',
            date: '2024-01-15',
            url: '/blog/understanding-property-rights'
          },
          {
            id: '2',
            title: 'Family Law Amendments 2024',
            type: 'article',
            category: 'Legal Update',
            description: 'Recent changes in family law legislation and their implications.',
            date: '2024-01-10',
            url: '/blog/family-law-amendments-2024'
          }
        ]
      }

      let filteredResults: any[] = []
      
      if (searchType === 'all' || searchType === 'cases') {
        filteredResults = [...filteredResults, ...mockResults.cases]
      }
      if (searchType === 'all' || searchType === 'practice') {
        filteredResults = [...filteredResults, ...mockResults.practiceAreas]
      }
      if (searchType === 'all' || searchType === 'advocates') {
        filteredResults = [...filteredResults, ...mockResults.advocates]
      }
      if (searchType === 'all' || searchType === 'articles') {
        filteredResults = [...filteredResults, ...mockResults.articles]
      }
      
      // Filter by query
      if (query) {
        filteredResults = filteredResults.filter(result => {
          const searchText = `${result.title || result.name} ${result.description || ''} ${result.specialization || ''}`.toLowerCase()
          return searchText.includes(query.toLowerCase())
        })
      }
      
      setResults(filteredResults)
      setLoading(false)
    }, 1000)
  }, [query, searchType, practiceAreas])

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [query, performSearch])

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'case':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'practice':
        return <Calendar className="h-5 w-5 text-green-600" />
      case 'advocate':
        return <Users className="h-5 w-5 text-purple-600" />
      case 'article':
        return <FileText className="h-5 w-5 text-orange-600" />
      default:
        return <Search className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryBadge = (type: string, category?: string) => {
    const colors = {
      case: 'bg-blue-100 text-blue-800',
      practice: 'bg-green-100 text-green-800',
      advocate: 'bg-purple-100 text-purple-800',
      article: 'bg-orange-100 text-orange-800'
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
        {category || type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Legal Resources</h1>
          <p className="text-gray-600 mb-8">
            Find cases, practice areas, advocates, and legal insights
          </p>
          
          {/* Search Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={(e) => { e.preventDefault(); performSearch(); }} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for legal information..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </form>
            
            {/* Search Type Filters */}
            <div className="flex justify-center gap-2 mt-4">
              {['all', 'cases', 'practice', 'advocates', 'articles'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSearchType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    searchType === type
                      ? 'bg-blue-900 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div>
            <p className="text-gray-600 mb-6">
              Found {results.length} results for "{query}"
            </p>
            <div className="space-y-4">
              {results.map((result) => (
                <Link
                  key={result.id}
                  href={result.url}
                  className="block bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {result.title || result.name}
                        </h3>
                        {getCategoryBadge(result.type, result.category)}
                      </div>
                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {result.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {result.specialization && (
                            <span className="mr-4">Specialization: {result.specialization}</span>
                          )}
                          {result.experience && (
                            <span className="mr-4">Experience: {result.experience}</span>
                          )}
                          {result.date && (
                            <span>Published: {new Date(result.date).toLocaleDateString()}</span>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any results for "{query}". Try different keywords or browse our practice areas.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/practice-areas">
                <Button variant="outline">Browse Practice Areas</Button>
              </Link>
              <Link href="/consultation">
                <Button>Get Legal Help</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
            <p className="text-gray-600">
              Enter keywords above to search our legal resources, cases, and practice areas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Legal Resources</h1>
          <p className="text-gray-600 mb-8">
            Find cases, practice areas, advocates, and legal insights
          </p>
        </div>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SearchContent />
    </Suspense>
  )
}
