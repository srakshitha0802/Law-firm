'use client'

import { useState, useEffect } from 'react'
import { Award, Shield, Users, CheckCircle, Star, TrendingUp, Clock } from 'lucide-react'

interface TrustBadge {
  icon: React.ComponentType<any>
  title: string
  description: string
  color: string
  delay: number
}

export default function TrustBadges() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const badges: TrustBadge[] = [
    {
      icon: Award,
      title: "Award Winning",
      description: "50+ Legal Excellence Awards",
      color: "from-yellow-400 to-yellow-600",
      delay: 0
    },
    {
      icon: Shield,
      title: "Fully Licensed",
      description: "Bar Council Certified",
      color: "from-blue-400 to-blue-600",
      delay: 100
    },
    {
      icon: Users,
      title: "10,000+ Clients",
      description: "Trusted by thousands",
      color: "from-green-400 to-green-600",
      delay: 200
    },
    {
      icon: CheckCircle,
      title: "98% Success Rate",
      description: "Proven track record",
      color: "from-purple-400 to-purple-600",
      delay: 300
    },
    {
      icon: Star,
      title: "5-Star Reviews",
      description: "4.9/5.0 rating",
      color: "from-orange-400 to-orange-600",
      delay: 400
    },
    {
      icon: TrendingUp,
      title: "Growing Fast",
      description: "200% growth in 5 years",
      color: "from-pink-400 to-pink-600",
      delay: 500
    }
  ]

  return (
    <div className="py-16 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trusted excellence backed by <span className="font-semibold text-indigo-600">proven results</span> and industry recognition
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {badges.map((badge, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${badge.delay}ms` }}
            >
              {/* Icon Container */}
              <div className={`w-20 h-20 bg-gradient-to-br ${badge.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300`}>
                <badge.icon className="h-10 w-10 text-white" />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.title}</h3>
              <p className="text-gray-600">{badge.description}</p>
              
              {/* Animated Underline */}
              <div className={`w-16 h-1 bg-gradient-to-r ${badge.color} rounded-full mx-auto mt-4`}></div>
            </div>
          ))}
        </div>
        
        {/* Additional Trust Elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-4 shadow-lg border border-indigo-100">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              <span className="text-gray-700 font-medium">24/7 Support</span>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-gray-700 font-medium">Free Consultation</span>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-gray-700 font-medium">100% Confidential</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
