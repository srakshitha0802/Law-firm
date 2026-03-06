'use client'

import { useState } from 'react'
import { ArrowRight, Play, ExternalLink, Star, TrendingUp } from 'lucide-react'

interface InteractiveCardProps {
  title: string
  description: string
  icon: React.ComponentType<any>
  stats?: { label: string; value: string; trend?: 'up' | 'down' | 'neutral' }[]
  action?: { label: string; href: string; type: 'primary' | 'secondary' }
  badge?: { text: string; color: string }
  hover?: boolean
}

export default function InteractiveCard({ 
  title, 
  description, 
  icon: Icon, 
  stats, 
  action, 
  badge,
  hover = true 
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className={`group relative bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 ${
      hover ? 'hover:shadow-xl hover:border-blue-300 hover:-translate-y-2' : ''
    }`}>
      {/* Badge */}
      {badge && (
        <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
          {badge.text}
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transition-transform duration-300 ${
            isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
          }`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-sm mt-1">{description}</p>
          </div>
        </div>
        
        {/* Action Button */}
        {action && (
          <button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => window.location.href = action.href}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
              action.type === 'primary' 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {action.label}
            <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mt-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">{stat.label}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">{stat.value}</span>
                  {stat.trend && (
                    <div className={`flex items-center ${
                      stat.trend === 'up' ? 'text-green-600' : 
                      stat.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      <TrendingUp className={`h-4 w-4 ${
                        stat.trend === 'down' ? 'rotate-180' : ''
                      }`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Interactive Elements */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <Play className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Watch Demo</span>
          </button>
          <button className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ExternalLink className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Learn More</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 transition-colors ${
                i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Hover Effect Overlay */}
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      )}
    </div>
  )
}
