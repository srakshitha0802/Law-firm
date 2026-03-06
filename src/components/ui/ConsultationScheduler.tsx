'use client'

import { useState } from 'react'
import { Calendar, Clock, Phone, Mail, CheckCircle, AlertCircle, Video } from 'lucide-react'

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export default function ConsultationScheduler() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    caseType: '',
    description: ''
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '02:00 PM', available: true },
    { id: '5', time: '03:00 PM', available: true },
    { id: '6', time: '04:00 PM', available: false },
    { id: '7', time: '05:00 PM', available: true }
  ]

  const caseTypes = [
    { name: 'Civil Law', estimatedCost: '₹5,000 - ₹15,000' },
    { name: 'Criminal Law', estimatedCost: '₹10,000 - ₹50,000' },
    { name: 'Family Law', estimatedCost: '₹3,000 - ₹20,000' },
    { name: 'Property Law', estimatedCost: '₹7,000 - ₹25,000' },
    { name: 'Corporate Law', estimatedCost: '₹15,000 - ₹1,00,000' },
    { name: 'Other', estimatedCost: '₹2,000 - ₹10,000' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSuccess(true)
    setIsSubmitting(false)
  }

  const isFormValid = () => {
    return formData.name && formData.email && formData.phone && selectedDate && selectedTime && formData.caseType
  }

  if (isSuccess) {
    return (
      <div className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-2xl p-12 border border-green-200">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Consultation Scheduled!</h3>
            <p className="text-lg text-gray-600 mb-8">
              Your consultation has been successfully scheduled. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Consultation Details:</h4>
              <div className="space-y-3 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Case Type:</span>
                  <span className="font-medium">{formData.caseType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Type:</span>
                  <span className="font-medium">Video Call</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false)
                setCurrentStep(1)
                setFormData({ name: '', email: '', phone: '', caseType: '', description: '' })
                setSelectedDate('')
                setSelectedTime('')
              }}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Schedule Another Consultation
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Schedule <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Consultation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book a consultation with our expert lawyers in 2 simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[
            { step: 1, label: 'Date & Time' },
            { step: 2, label: 'Case Details' }
          ].map(({ step, label }) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                currentStep >= step 
                  ? 'bg-indigo-600 text-white scale-110' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
              </div>
              <div className={`ml-3 text-sm font-medium ${
                currentStep >= step ? 'text-indigo-600' : 'text-gray-500'
              }`}>
                {label}
              </div>
              {step < 2 && (
                <div className={`w-20 h-1 mx-8 transition-all duration-300 ${
                  currentStep > step ? 'bg-indigo-600' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Step 1: Select Date & Time */}
          <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 ${
            currentStep === 1 ? 'border-indigo-500 shadow-2xl' : 'border-transparent'
          }`}>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-indigo-600" />
              Select Date & Time
            </h3>
            
            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">Available Time Slots</label>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-xl border transition-all duration-300 text-sm font-medium ${
                      selectedTime === slot.time
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : slot.available
                          ? 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Clock className="h-4 w-4 inline mr-2" />
                    {slot.time}
                    {!slot.available && <span className="block text-xs">Unavailable</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Case Details */}
          <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300 ${
            currentStep === 2 ? 'border-indigo-500 shadow-2xl' : 'border-transparent'
          }`}>
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Mail className="h-6 w-6 mr-2 text-indigo-600" />
              Case Details
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
                <select
                  value={formData.caseType}
                  onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">Select case type...</option>
                  {caseTypes.map((type) => (
                    <option key={type.name} value={type.name}>{type.name} - {type.estimatedCost}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Briefly describe your legal issue..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Video className="h-5 w-5" />
                    <span>Schedule Video Consultation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentStep(Math.min(2, currentStep + 1))}
            disabled={
              (currentStep === 1 && (!selectedDate || !selectedTime))
            }
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 2 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
