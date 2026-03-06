'use client'

import { useState, useEffect } from 'react'
import { Calculator, Scale, Clock, TrendingUp } from 'lucide-react'

export default function CaseCalculator() {
  const [caseType, setCaseType] = useState('')
  const [complexity, setComplexity] = useState('medium')
  const [timeline, setTimeline] = useState('standard')
  const [estimatedCost, setEstimatedCost] = useState(0)
  const [estimatedDuration, setEstimatedDuration] = useState(0)

  const caseTypes = [
    { 
      id: 'civil', 
      name: 'Civil Case', 
      baseCost: 50000, 
      baseDuration: 180,
      icon: Scale,
      description: 'Property disputes, contracts, torts'
    },
    { 
      id: 'criminal', 
      name: 'Criminal Case', 
      baseCost: 75000, 
      baseDuration: 365,
      icon: Scale,
      description: 'Defense, prosecution, appeals'
    },
    { 
      id: 'family', 
      name: 'Family Law', 
      baseCost: 30000, 
      baseDuration: 120,
      icon: Scale,
      description: 'Divorce, custody, maintenance'
    },
    { 
      id: 'property', 
      name: 'Property Case', 
      baseCost: 60000, 
      baseDuration: 240,
      icon: Scale,
      description: 'Land disputes, registration, title issues'
    },
    { 
      id: 'corporate', 
      name: 'Corporate Case', 
      baseCost: 100000, 
      baseDuration: 300,
      icon: Scale,
      description: 'Business formation, compliance, mergers'
    }
  ]

  const complexityMultipliers = {
    simple: 0.7,
    medium: 1.0,
    complex: 1.5,
    highly_complex: 2.0
  }

  const timelineMultipliers = {
    urgent: 1.5,
    standard: 1.0,
        normal: 0.8
  }

  const calculateEstimates = () => {
    if (!caseType) return

    const selectedCase = caseTypes.find(c => c.id === caseType)
    if (!selectedCase) return

    const complexityMultiplier = complexityMultipliers[complexity as keyof typeof complexityMultipliers]
    const timelineMultiplier = timelineMultipliers[timeline as keyof typeof timelineMultipliers]

    const cost = Math.round(selectedCase.baseCost * complexityMultiplier * timelineMultiplier)
    const duration = Math.round(selectedCase.baseDuration * complexityMultiplier)

    setEstimatedCost(cost)
    setEstimatedDuration(duration)
  }

  useEffect(() => {
    calculateEstimates()
  }, [caseType, complexity, timeline])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <Calculator className="h-8 w-8 text-blue-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-900">Case Cost Calculator</h3>
      </div>
      
      <p className="text-gray-600 mb-8">
        Get instant estimates for legal costs and timeline. Actual costs may vary based on case specifics.
      </p>

      <div className="space-y-6">
        {/* Case Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Case Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {caseTypes.map((caseItem) => (
              <button
                key={caseItem.id}
                onClick={() => setCaseType(caseItem.id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  caseType === caseItem.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <caseItem.icon className={`h-6 w-6 mx-auto mb-2 ${
                  caseType === caseItem.id ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <div className={`font-medium ${
                  caseType === caseItem.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {caseItem.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">{caseItem.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Complexity Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Case Complexity</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'simple', label: 'Simple', desc: 'Straightforward case' },
              { id: 'medium', label: 'Medium', desc: 'Some complexity' },
              { id: 'complex', label: 'Complex', desc: 'Multiple issues' },
              { id: 'highly_complex', label: 'Highly Complex', desc: 'Very complicated' }
            ].map((level) => (
              <button
                key={level.id}
                onClick={() => setComplexity(level.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  complexity === level.id
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <div className={`font-medium ${
                  complexity === level.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {level.label}
                </div>
                <div className="text-xs text-gray-500">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Timeline Priority</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'urgent', label: 'Urgent', desc: 'Fast track', color: 'red' },
              { id: 'standard', label: 'Standard', desc: 'Normal process', color: 'blue' },
              { id: 'normal', label: 'Normal', desc: 'Economical', color: 'green' }
            ].map((priority) => (
              <button
                key={priority.id}
                onClick={() => setTimeline(priority.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  timeline === priority.id
                    ? `border-${priority.color}-600 bg-${priority.color}-50 text-${priority.color}-900`
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                }`}
              >
                <div className={`font-medium ${
                  timeline === priority.id ? `text-${priority.color}-900` : 'text-gray-900'
                }`}>
                  {priority.label}
                </div>
                <div className="text-xs text-gray-500">{priority.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {estimatedCost > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Estimated Results</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Scale className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Estimated Cost</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ₹{estimatedCost.toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-gray-500 mt-1">Approximate range</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Estimated Duration</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {estimatedDuration} days
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {estimatedDuration < 180 ? 'Fast track' : estimatedDuration < 365 ? 'Standard' : 'Extended'}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <TrendingUp className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <strong>Note:</strong> These are estimates only. Final costs depend on court fees, 
                documentation requirements, and case complexity. Consult with our advocates for accurate assessment.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.href = '/consultation'}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Get Exact Quote →
        </button>
      </div>
    </div>
  )
}
