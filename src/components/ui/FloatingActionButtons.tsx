'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Phone, Calendar, ArrowUp } from 'lucide-react'

export default function FloatingActionButtons() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setIsVisible(window.scrollY > 300)
      }

      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      <div className="flex flex-col space-y-3">
        {/* Quick Chat */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/consultation'
            }
          }}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Quick Chat</span>
          </div>
          <div className="absolute inset-0 bg-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </button>

        {/* Call */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = 'tel:+919876543210'
            }
          }}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-2">
            <Phone className="h-5 w-5" />
            <span className="text-sm font-medium">Call Now</span>
          </div>
          <div className="absolute inset-0 bg-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </button>

        {/* Schedule */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/consultation'
            }
          }}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="relative z-10 flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Schedule</span>
          </div>
          <div className="absolute inset-0 bg-purple-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </button>

        {/* Scroll to Top */}
        <button
          onClick={scrollToTop}
          className="bg-gray-600 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      {/* Pulse Animation */}
      <div className="absolute -top-1 -right-1">
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
      </div>
    </div>
  )
}
