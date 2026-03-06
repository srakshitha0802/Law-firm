'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Calendar, User, Scale, FileText, TrendingUp, ChevronRight } from 'lucide-react'

interface Case {
  id: string
  title: string
  client: string
  type: string
  status: 'PENDING' | 'ACTIVE' | 'HEARING' | 'COMPLETED'
  date: string
  progress: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
}

export default function CaseTracker() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('ALL')
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [animatedProgress, setAnimatedProgress] = useState<{ [key: string]: number }>({})

  const [cases] = useState<Case[]>([
    {
      id: '1',
      title: 'Property Dispute Resolution',
      client: 'Rajesh Kumar',
      type: 'Civil Law',
      status: 'ACTIVE',
      date: '2024-01-15',
      progress: 65,
      priority: 'HIGH'
    },
    {
      id: '2',
      title: 'Criminal Defense Case',
      client: 'Priya Sharma',
      type: 'Criminal Law',
      status: 'HEARING',
      date: '2024-01-10',
      progress: 85,
      priority: 'HIGH'
    },
    {
      id: '3',
      title: 'Family Law Mediation',
      client: 'Amit Patel',
      type: 'Family Law',
      status: 'PENDING',
      date: '2024-01-18',
      progress: 25,
      priority: 'MEDIUM'
    },
    {
      id: '4',
      title: 'Contract Agreement Review',
      client: 'Sneha Reddy',
      type: 'Corporate Law',
      status: 'COMPLETED',
      date: '2024-01-05',
      progress: 100,
      priority: 'LOW'
    }
  ])

  useEffect(() => {
    const newProgress: { [key: string]: number } = {}
    cases.forEach((case_) => {
      let current = 0
      const target = case_.progress
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        newProgress[case_.id] = current
        setAnimatedProgress({ ...newProgress })
      }, 30)
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'ACTIVE': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'HEARING': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-100'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100'
      case 'LOW': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 60) return 'bg-blue-500'
    if (progress >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'ALL' || case_.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Live Case <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Tracker</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time monitoring of all active legal cases and proceedings
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search cases by title, client, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="HEARING">Hearing</option>
                <option value="COMPLETED">Completed</option>
              </select>
              
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCases.map((case_) => (
            <div
              key={case_.id}
              className={`group bg-white rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                selectedCase === case_.id ? 'ring-2 ring-indigo-500 border-indigo-500' : ''
              }`}
              onClick={() => setSelectedCase(selectedCase === case_.id ? null : case_.id)}
            >
              {/* Case Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {case_.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{case_.client}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Scale className="h-4 w-4" />
                        <span>{case_.type}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Priority Badge */}
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(case_.priority)}`}>
                    {case_.priority}
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(case_.status)}`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    case_.status === 'ACTIVE' ? 'bg-blue-500 animate-pulse' :
                    case_.status === 'HEARING' ? 'bg-orange-500 animate-pulse' : ''
                  }`}></div>
                  {case_.status}
                </div>
              </div>

              {/* Progress Section */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Case Progress</span>
                    <span className="font-semibold">{animatedProgress[case_.id] || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(case_.progress)} rounded-full transition-all duration-1000 ease-out relative`}
                      style={{ width: `${animatedProgress[case_.id] || 0}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>

                {/* Case Details */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{case_.date}</span>
                  </div>
                  
                  <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    selectedCase === case_.id ? 'rotate-90' : 'group-hover:translate-x-1'
                  }`} />
                </div>
              </div>

              {/* Expanded Details */}
              {selectedCase === case_.id && (
                <div className="border-t border-gray-100 p-6 bg-gray-50 animate-slide-down">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Case ID:</span>
                      <span className="font-semibold text-gray-900 ml-2">#{case_.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="font-semibold text-gray-900 ml-2">2 hours ago</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Assigned Lawyer:</span>
                      <span className="font-semibold text-gray-900 ml-2">Adv. Sharma</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Hearing:</span>
                      <span className="font-semibold text-indigo-600 ml-2">Jan 25, 2024</span>
                    </div>
                  </div>
                  
                  <button className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                    View Full Case Details
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <span>Load More Cases</span>
            <TrendingUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
