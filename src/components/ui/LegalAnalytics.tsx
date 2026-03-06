'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Users, DollarSign, Clock, Award, Target } from 'lucide-react'

interface AnalyticsData {
  casesWon: number
  successRate: number
  avgCaseDuration: string
  clientSatisfaction: number
  revenue: number
  activeCases: number
  monthlyGrowth: number
}

export default function LegalAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    casesWon: 1247,
    successRate: 96.8,
    avgCaseDuration: '4.2 months',
    clientSatisfaction: 98.5,
    revenue: 2847500,
    activeCases: 89,
    monthlyGrowth: 12.4
  })

  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    // Simulate real-time data fetch
    const timer = setTimeout(() => {
      setAnalytics(prev => ({
        ...prev,
        casesWon: prev.casesWon + Math.floor(Math.random() * 5),
        revenue: prev.revenue + Math.floor(Math.random() * 10000),
        activeCases: prev.activeCases + Math.floor(Math.random() * 3) - 1
      }))
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [selectedPeriod])

  const performanceMetrics = [
    {
      label: 'Cases Won',
      value: analytics.casesWon,
      change: '+12.4%',
      trend: 'up',
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Success Rate',
      value: `${analytics.successRate}%`,
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Client Satisfaction',
      value: `${analytics.clientSatisfaction}%`,
      change: '+0.8%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Avg Duration',
      value: analytics.avgCaseDuration,
      change: '-15%',
      trend: 'down',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const caseTypeDistribution = [
    { type: 'Civil Law', count: 342, percentage: 27.4, color: 'bg-blue-500' },
    { type: 'Criminal Law', count: 287, percentage: 23.0, color: 'bg-red-500' },
    { type: 'Family Law', count: 298, percentage: 23.9, color: 'bg-green-500' },
    { type: 'Property Law', count: 198, percentage: 15.9, color: 'bg-purple-500' },
    { type: 'Corporate Law', count: 122, percentage: 9.8, color: 'bg-orange-500' }
  ]

  const monthlyData = [
    { month: 'Jan', cases: 89, revenue: 1250000 },
    { month: 'Feb', cases: 94, revenue: 1420000 },
    { month: 'Mar', cases: 102, revenue: 1680000 },
    { month: 'Apr', cases: 98, revenue: 1390000 },
    { month: 'May', cases: 112, revenue: 1890000 },
    { month: 'Jun', cases: 124, revenue: 2140000 }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Legal Analytics</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real-time insights and performance metrics powered by AI
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-800 rounded-xl p-1">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${
                  selectedPeriod === period
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {performanceMetrics.map((metric, index) => {
            const Icon = metric.icon
            const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
            return (
              <div key={index} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    {metric.change}
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{metric.value}</div>
                <div className="text-gray-400 text-sm">{metric.label}</div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Case Type Distribution */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <PieChart className="h-6 w-6 mr-3 text-purple-400" />
              Case Distribution
            </h3>
            <div className="space-y-4">
              {caseTypeDistribution.map((caseType, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <div className={`w-4 h-4 ${caseType.color} rounded-full mr-3`}></div>
                    <span className="text-gray-300">{caseType.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{caseType.count}</div>
                    <div className="text-gray-400 text-sm">{caseType.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-green-400" />
              Monthly Performance
            </h3>
            <div className="space-y-3">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-white font-bold">{data.cases}</div>
                      <div className="text-gray-400 text-xs">cases</div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">₹{(data.revenue / 1000).toFixed(1)}K</div>
                      <div className="text-gray-400 text-xs">revenue</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Stats Bar */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">{analytics.activeCases}</div>
              <div className="text-purple-200 text-sm">Active Cases</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">₹{(analytics.revenue / 1000).toFixed(1)}K</div>
              <div className="text-purple-200 text-sm">Total Revenue</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{analytics.monthlyGrowth}%</div>
              <div className="text-purple-200 text-sm">Growth Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">{analytics.casesWon}</div>
              <div className="text-purple-200 text-sm">Cases Won</div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent"></div>
              <span className="text-white">Updating analytics...</span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
