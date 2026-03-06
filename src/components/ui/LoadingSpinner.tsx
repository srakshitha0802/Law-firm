'use client'

import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Loader2 className={`animate-spin text-blue-600 ${sizeClasses[size]}`} />
        <div className="absolute inset-0 animate-ping">
          <div className={`h-full w-full bg-blue-400 rounded-full opacity-20 ${sizeClasses[size]}`}></div>
        </div>
      </div>
    </div>
  )
}
