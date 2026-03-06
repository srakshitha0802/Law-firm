'use client'

import { useState } from 'react'
import { Calculator, Clock, AlertCircle, TrendingUp, Scale, FileText, Users, DollarSign } from 'lucide-react'

interface CaseType {
  id: string
  name: string
  icon: React.ElementType
  baseCost: number
  maxCost: number
  avgTime: string
  complexity: string[]
  factors: string[]
}

export default function CostEstimator() {
  const [selectedCase, setSelectedCase] = useState('')
  const [complexity, setComplexity] = useState('medium')
  const [urgency, setUrgency] = useState('normal')

  const caseTypes: CaseType[] = [
    {
      id: 'civil',
      name: 'Civil Law',
      icon: Scale,
      baseCost: 5000,
      maxCost: 15000,
      avgTime: '3-6 months',
      complexity: ['Simple Dispute', 'Standard Litigation', 'Complex Civil Matter'],
      factors: ['Case complexity', 'Number of parties', 'Documentation required', 'Court appearances']
    },
    {
      id: 'criminal',
      name: 'Criminal Law',
      icon: FileText,
      baseCost: 10000,
      maxCost: 50000,
      avgTime: '6-12 months',
      complexity: ['Misdemeanor', 'Felony', 'Federal Case'],
      factors: ['Severity of charges', 'Evidence complexity', 'Witness count', 'Trial length']
    },
    {
      id: 'family',
      name: 'Family Law',
      icon: Users,
      baseCost: 3000,
      maxCost: 20000,
      avgTime: '2-4 months',
      complexity: ['Uncontested Divorce', 'Child Custody', 'Property Division'],
      factors: ['Asset division', 'Child custody issues', 'Spousal support', 'Mediation requirements']
    },
    {
      id: 'property',
      name: 'Property Law',
      icon: FileText,
      baseCost: 7000,
      maxCost: 25000,
      avgTime: '4-8 months',
      complexity: ['Title Verification', 'Property Dispute', 'Registration'],
      factors: ['Property value', 'Title clarity', 'Dispute complexity', 'Documentation']
    },
    {
      id: 'corporate',
      name: 'Corporate Law',
      icon: TrendingUp,
      baseCost: 15000,
      maxCost: 100000,
      avgTime: '6-18 months',
      complexity: ['Business Formation', 'M&A', 'Compliance'],
      factors: ['Company size', 'Transaction value', 'Regulatory complexity', 'Due diligence scope']
    }
  ]

  const complexityMultipliers = {
    simple: 0.8,
    medium: 1.0,
    complex: 1.5
  }

  const urgencyMultipliers = {
    normal: 1.0,
    urgent: 1.3,
    emergency: 1.6
  }

  const calculateEstimate = () => {
    if (!selectedCase) return { min: 0, max: 0, avg: 0 }
    
    const caseType = caseTypes.find(c => c.id === selectedCase)
    if (!caseType) return { min: 0, max: 0, avg: 0 }
    
    const complexityMultiplier = complexityMultipliers[complexity as keyof typeof complexityMultipliers]
    const urgencyMultiplier = urgencyMultipliers[urgency as keyof typeof urgencyMultipliers]
    
    const minCost = caseType.baseCost * complexityMultiplier * urgencyMultiplier
    const maxCost = caseType.maxCost * complexityMultiplier * urgencyMultiplier
    const avgCost = (minCost + maxCost) / 2
    
    return {
      min: Math.round(minCost),
      max: Math.round(maxCost),
      avg: Math.round(avgCost)
    }
  }

  const estimate = calculateEstimate()

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mb-6">
            <Calculator className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Cost Estimator</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant estimates for your legal case with AI-powered calculations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Case Types */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-3 text-indigo-600" />
                Select Case Type
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseTypes.map((caseType) => {
                  const Icon = caseType.icon
                  return (
                    <button
                      key={caseType.id}
                      onClick={() => setSelectedCase(caseType.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                        selectedCase === caseType.id
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          selectedCase === caseType.id ? 'bg-indigo-600' : 'bg-gray-100'
                        }`}>
                          <Icon className={`h-6 w-6 ${selectedCase === caseType.id ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900 mb-1">{caseType.name}</div>
                          <div className="text-sm text-gray-600 mb-2">{caseType.avgTime}</div>
                          <div className="text-lg font-bold text-indigo-600">
                            ₹{caseType.baseCost.toLocaleString('en-IN')} - ₹{caseType.maxCost.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Case Details */}
            {selectedCase && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="h-6 w-6 mr-3 text-indigo-600" />
                  Case Factors
                </h3>
                
                <div className="space-y-6">
                  {/* Complexity */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Case Complexity</label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.keys(complexityMultipliers).map((level) => (
                        <button
                          key={level}
                          onClick={() => setComplexity(level)}
                          className={`px-4 py-3 rounded-xl border-2 font-medium transition-all capitalize ${
                            complexity === level
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Timeline Urgency</label>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.keys(urgencyMultipliers).map((level) => (
                        <button
                          key={level}
                          onClick={() => setUrgency(level)}
                          className={`px-4 py-3 rounded-xl border-2 font-medium transition-all capitalize ${
                            urgency === level
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Factors */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Cost Factors</h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <ul className="space-y-2">
                        {caseTypes.find(c => c.id === selectedCase)?.factors.map((factor, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3"></div>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Estimate Results */}
          <div className="space-y-6">
            {selectedCase ? (
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white sticky top-8">
                <div className="text-center mb-8">
                  <DollarSign className="h-12 w-12 mx-auto mb-4 text-indigo-200" />
                  <h3 className="text-2xl font-bold mb-2">Your Estimate</h3>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-indigo-200">Minimum Cost:</span>
                      <span className="text-2xl font-bold">₹{estimate.min.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-indigo-200">Maximum Cost:</span>
                      <span className="text-2xl font-bold">₹{estimate.max.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-indigo-400">
                      <span className="text-indigo-200">Average Cost:</span>
                      <span className="text-3xl font-bold text-yellow-300">₹{estimate.avg.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-indigo-200">Timeline:</span>
                      <span className="font-semibold">{caseTypes.find(c => c.id === selectedCase)?.avgTime}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-white text-indigo-700 px-6 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                    Get Detailed Quote
                  </button>
                  <button className="w-full bg-indigo-500 text-white px-6 py-4 rounded-xl font-bold hover:bg-indigo-400 transition-colors">
                    Schedule Consultation
                  </button>
                </div>

                <div className="mt-6 p-4 bg-white/10 rounded-xl">
                  <p className="text-xs text-indigo-200 text-center">
                    *This is an automated estimate. Final costs may vary based on case specifics and consultation with our legal team.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Select a case type to see your estimate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
