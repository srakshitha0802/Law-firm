'use client'

import { useState } from 'react'
import { Check, Clock, FileText, Users, Scale } from 'lucide-react'

interface Step {
  id: number
  title: string
  description: string
  icon: React.ComponentType<any>
  status: 'pending' | 'active' | 'completed'
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
}

export default function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed'
    if (stepId === currentStep) return 'active'
    return 'pending'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white border-green-600'
      case 'active': return 'bg-blue-500 text-white border-blue-600'
      case 'pending': return 'bg-gray-200 text-gray-500 border-gray-300'
      default: return 'bg-gray-200 text-gray-500 border-gray-300'
    }
  }

  const getIconColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'active': return 'text-blue-600'
      case 'pending': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1">
            <div className="flex items-center">
              {/* Step Number */}
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all duration-300 ${getStatusColor(getStepStatus(step.id))}`}
              >
                {getStepStatus(step.id) === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              {/* Step Content */}
              <div className="ml-4 flex-1">
                <div className="flex items-center mb-2">
                  <step.icon className={`h-5 w-5 mr-2 ${getIconColor(getStepStatus(step.id))}`} />
                  <h3 className={`font-semibold ${getStepStatus(step.id) === 'active' ? 'text-blue-900' : 'text-gray-700'}`}>
                    {step.title}
                  </h3>
                </div>
                <p className={`text-sm ${getStepStatus(step.id) === 'active' ? 'text-blue-700' : 'text-gray-600'}`}>
                  {step.description}
                </p>
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4">
                <div className={`h-full transition-all duration-300 ${
                  getStepStatus(step.id) === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
