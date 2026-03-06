'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Calendar, Scale, Users } from 'lucide-react'

export default function NewsTicker() {
  const [currentDate, setCurrentDate] = useState('')
  const [newsItems] = useState([
    {
      id: 1,
      type: 'victory',
      icon: TrendingUp,
      title: 'Land Acquisition Case Won',
      description: 'Successfully secured land rights for major infrastructure project'
    },
    {
      id: 2,
      type: 'update',
      icon: Calendar,
      title: 'New Court Date Scheduled',
      description: 'Property dispute hearing set for next Monday'
    },
    {
      id: 3,
      type: 'achievement',
      icon: Scale,
      title: '25 Years Milestone',
      description: 'Celebrating 25 years of legal excellence'
    },
    {
      id: 4,
      type: 'team',
      icon: Users,
      title: 'New Advocate Joined',
      description: 'Welcome to our newest family member'
    }
  ])

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString())
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % newsItems.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'victory': return 'bg-green-100 text-green-800 border-green-200'
      case 'update': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'achievement': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'team': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-3 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-300" />
            <span className="text-sm font-medium text-blue-100">Live Updates</span>
          </div>
          
          <div className="flex-1 max-w-4xl">
            <div className="relative h-8 flex items-center">
              {/* Ticker Content */}
              <div 
                className="flex space-x-8 animate-slide-in"
                style={{
                  animation: 'slide-in 20s linear infinite',
                  transform: `translateX(-${currentIndex * 100}%)`
                }}
              >
                {[...newsItems, ...newsItems].map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-full border ${getTypeColor(item.type)}`}
                    style={{ minWidth: '300px' }}
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs opacity-80">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-sm text-blue-200">
            {currentDate}
          </div>
        </div>
      </div>
    </div>
  )
}
