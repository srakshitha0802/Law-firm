'use client'

import { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  label?: string
  trend?: 'up' | 'down' | 'neutral'
}

export default function AnimatedCounter({ 
  end, 
  duration = 2000, 
  prefix = '', 
  suffix = '', 
  label,
  trend 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById(`counter-${end}`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart)
      
      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, isVisible])

  const getTrendIcon = () => {
    if (!trend) return null
    return (
      <TrendingUp className={`h-4 w-4 ml-2 ${
        trend === 'up' ? 'text-green-600' : 
        trend === 'down' ? 'text-red-600 rotate-180' : 
        'text-gray-500'
      }`} />
    )
  }

  return (
    <div id={`counter-${end}`} className="text-center">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <div className="text-4xl md:text-5xl font-bold text-blue-900 tabular-nums">
          {prefix}{count.toLocaleString()}{suffix}
        </div>
        {getTrendIcon()}
      </div>
      
      {label && (
        <div className="text-lg text-gray-700 font-medium">
          {label}
        </div>
      )}
    </div>
  )
}
