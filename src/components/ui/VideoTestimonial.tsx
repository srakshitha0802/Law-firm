'use client'

import { useState } from 'react'
import { Play, Pause, Volume2, Star, Quote } from 'lucide-react'

export default function VideoTestimonial({ 
  testimonial 
}: { 
  testimonial: {
    id: number
    name: string
    role: string
    content: string
    rating: number
    videoUrl?: string
    thumbnail?: string
  }
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
      {/* Video Container */}
      <div className="relative aspect-video bg-gray-900">
        {/* Video Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-white" />
            </div>
            <p className="text-white/80 text-sm">Video Testimonial</p>
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={togglePlay}
              className="bg-white/20 backdrop-blur-sm p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 text-white" />
              ) : (
                <Play className="h-5 w-5 text-white" />
              )}
            </button>
            
            <div className="flex items-center space-x-3">
              <Volume2 className="h-5 w-5 text-white/80 hover:text-white transition-colors cursor-pointer" />
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-white/80 hover:text-white text-sm transition-colors"
              >
                Transcript
              </button>
            </div>
          </div>
        </div>

        {/* Thumbnail Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Testimonial Content */}
      <div className="p-6">
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex space-x-1">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <span className="ml-3 text-sm text-gray-500">Client Rating</span>
        </div>

        {/* Quote */}
        <div className="relative mb-4">
          <Quote className="absolute -top-2 -left-2 h-8 w-8 text-blue-200" />
          <p className="text-gray-700 italic text-lg leading-relaxed pl-6">
            "{testimonial.content}"
          </p>
        </div>

        {/* Client Info */}
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900 text-lg">{testimonial.name}</div>
            <div className="text-gray-600">{testimonial.role}</div>
          </div>
          
          {/* Play Button */}
          <button
            onClick={togglePlay}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 group"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Watch Story</span>
              </>
            )}
          </button>
        </div>

        {/* Transcript (Toggle) */}
        {showTranscript && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Video Transcript</h4>
            <div className="text-gray-700 space-y-2">
              <p>[00:00] Introduction and client background</p>
              <p>[00:15] Initial legal challenge description</p>
              <p>[00:30] Our approach and strategy</p>
              <p>[00:45] Case proceedings and timeline</p>
              <p>[01:00] Successful outcome and resolution</p>
              <p>[01:15] Client testimonial and satisfaction</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
