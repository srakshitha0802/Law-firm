'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Users, Award, Clock, Target, Zap } from 'lucide-react'

interface StatItem {
  id: number
  icon: React.ComponentType<any>
  value: string
  label: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function AdvancedStats() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedValues, setAnimatedValues] = useState<{ [key: number]: number }>({})

  const stats: StatItem[] = [
    {
      id: 1,
      icon: TrendingUp,
      value: '98%',
      label: 'Success Rate',
      change: '+2%',
      trend: 'up'
    },
    {
      id: 2,
      icon: Users,
      value: '10,000+',
      label: 'Happy Clients',
      change: '+500',
      trend: 'up'
    },
    {
      id: 3,
      icon: Award,
      value: '150+',
      label: 'Awards Won',
      change: '+12',
      trend: 'up'
    },
    {
      id: 4,
      icon: Clock,
      value: '24/7',
      label: 'Availability',
      change: 'Always',
      trend: 'neutral'
    },
    {
      id: 5,
      icon: Target,
      value: '500+',
      label: 'Monthly Cases',
      change: '+25',
      trend: 'up'
    },
    {
      id: 6,
      icon: Zap,
      value: '2hr',
      label: 'Avg Response Time',
      change: '-30min',
      trend: 'down'
    }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const newValues: { [key: number]: number } = {}
    stats.forEach((stat) => {
      const numericValue = parseInt(stat.value.replace(/[^0-9]/g, '')) || 0
      let current = 0
      const increment = numericValue / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= numericValue) {
          current = numericValue
          clearInterval(timer)
        }
        newValues[stat.id] = current
        setAnimatedValues({ ...newValues })
      }, 20)
    })
  }, [isVisible])

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return '↗'
      case 'down': return '↘'
      default: return '→'
    }
  }

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 via-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Performance <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Metrics</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time insights into our legal excellence and client satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`group relative bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-2xl transition-all duration-500 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon Container */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                
                {/* Trend Indicator */}
                <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor(stat.trend)}`}>
                  <span>{stat.change}</span>
                  <span className="text-lg">{getTrendIcon(stat.trend)}</span>
                </div>
              </div>
              
              {/* Value */}
              <div className="mb-2">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 tabular-nums">
                  {stat.value.includes('+') ? stat.value : 
                   stat.value.includes('hr') ? stat.value :
                   animatedValues[stat.id] ? Math.floor(animatedValues[stat.id]).toLocaleString() : '0'}
                </div>
              </div>
              
              {/* Label */}
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
              
              {/* Progress Bar for numeric stats */}
              {!stat.value.includes('+') && !stat.value.includes('hr') && !stat.value.includes('24/7') && (
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: isVisible ? `${Math.min((animatedValues[stat.id] || 0) / (parseInt(stat.value) || 1) * 100, 100)}%` : '0%'
                    }}
                  ></div>
                </div>
              )}
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-8 bg-white rounded-full px-8 py-4 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">Live Data</span>
            </div>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              <span className="text-gray-700 font-medium">Updated Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
