'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Scale, 
  Users, 
  FileText, 
  TrendingUp, 
  CheckCircle
} from 'lucide-react'

export default function HeroSection() {
  // Generate deterministic positions for particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: (i * 5.23) % 100,
    top: (i * 7.89) % 100,
    delay: (i * 0.37) % 5,
    duration: 3 + (i * 0.23) % 4
  }))
  const [currentStatIndex, setCurrentStatIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const stats = [
    { value: "50+", label: "Years Combined Experience", icon: Scale },
    { value: "1000+", label: "Cases Won", icon: CheckCircle },
    { value: "25+", label: "Court Representations", icon: Users },
    { value: "98%", label: "Success Rate", icon: TrendingUp }
  ]

  const practiceAreas = [
    { icon: Scale, title: "Civil Law", desc: "Property disputes, contracts", color: "from-blue-500 to-blue-600" },
    { icon: FileText, title: "Criminal Law", desc: "Defense & prosecution", color: "from-red-500 to-red-600" },
    { icon: Users, title: "Family Law", desc: "Marriage, divorce, custody", color: "from-purple-500 to-purple-600" },
    { icon: TrendingUp, title: "Property Law", desc: "Land acquisition, disputes", color: "from-green-500 to-green-600" }
  ]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % stats.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Subtle Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M50 50h50v50H0v30h30h30zm-30 0h30v30H0v30h30zm-15 15h15v15H0v15zm-15 15h15v15h15zm-15 15h15v15h15z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }}
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`
              }}
            />
          ))}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/50 via-blue-900/30 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-indigo-600/10"></div>
      </div>

      {/* Elegant Background Visual */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {/* Subtle Animated Gradient Orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-600/15 to-indigo-600/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>
          
          {/* Subtle Light Rays */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-white/10 via-transparent to-transparent transform -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-y-1/2"></div>
          </div>
          
          {/* Elegant Overlay Pattern */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30h30v30H0v30h30zm-15 15h15v15H0v15zm-15 15h15v15h15z'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-6xl mx-auto">
          {/* Animated Logo */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 rounded-2xl shadow-2xl animate-pulse-slow relative overflow-hidden group">
              <Scale className="h-12 w-12 text-white relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent transform -skew-x-12 -skew-y-12 group-hover:transform skew-x-0 skew-y-0 transition-transform duration-700"></div>
            </div>
            {/* Enhanced Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-2xl animate-ping"></div>
          </div>

          {/* Main Headlines */}
          <div className="mb-8 space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="block text-white animate-slide-in-left drop-shadow-lg">Justice Through</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-300 animate-slide-in-right drop-shadow-lg">
                Legal Excellence
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              <span className="font-semibold text-white">50+ years</span> of combined legal expertise serving 
              <span className="text-blue-300 font-semibold"> India's diverse legal needs</span>
            </p>
          </div>

          {/* Interactive Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <div
                key={index}
                onMouseEnter={() => setIsHovered(stat.label)}
                onMouseLeave={() => setIsHovered(null)}
                className={`relative p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 ${
                  currentStatIndex === index ? 'bg-gradient-to-br from-white/20 to-white/10 scale-105 border-white/40 shadow-xl' : 'hover:bg-gradient-to-br hover:from-white/15 hover:to-white/8 hover:scale-105 hover:shadow-lg'
                }`}
              >
                <div className="flex items-center justify-center mb-3">
                  <stat.icon className={`h-6 w-6 text-blue-300 ${currentStatIndex === index ? 'animate-pulse text-blue-200' : ''}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
                  {stat.value}
                </div>
                <div className="text-sm text-blue-200">
                  {stat.label}
                </div>
                {isHovered === stat.label && (
                  <div className="absolute -top-2 -right-2 w-4 h-4">
                    <div className="w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"></div>
                  </div>
                )}
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-xl blur-sm"></div>
              </div>
            ))}
          </div>

          {/* Interactive Practice Areas */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-white mb-8">Explore Our Expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {practiceAreas.map((area, index) => (
                <div
                  key={index}
                  className="group relative p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer"
                >
                  <div className={`flex items-center justify-center w-16 h-16 bg-gradient-to-br ${area.color} rounded-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <area.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                    {area.title}
                  </h4>
                  <p className="text-blue-200 text-sm">{area.desc}</p>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/consultation">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-800 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center">
                  <Scale className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Start Your Case
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -skew-y-12 group-hover:transform skew-x-0 skew-y-0 transition-transform duration-700"></div>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>
            </Link>
            
            <Link href="/practice-areas">
              <Button 
                variant="outline" 
                size="lg"
                className="group border-2 border-white/40 text-white hover:bg-gradient-to-r hover:from-white hover:to-indigo-50 hover:text-indigo-900 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-white/10"
              >
                <span className="flex items-center">
                  Explore Practice Areas
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Available 24/7</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm">Expert Lawyers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm">Proven Results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
          </div>
          <span className="text-white/60 text-xs animate-pulse">Scroll to explore</span>
        </div>
      </div>

      {/* Mouse Follower Effect */}
      <div
        className="pointer-events-none fixed w-6 h-6 bg-blue-400/20 rounded-full blur-sm transition-transform duration-100 z-50"
        style={{
          transform: `translate(${mousePosition.x - 12}px, ${mousePosition.y - 12}px)`
        }}
      />
    </section>
  )
}
