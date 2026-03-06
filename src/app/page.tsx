'use client'

import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/ui/HeroSection'
import LiveChat from '@/components/ui/LiveChat'
import NewsTicker from '@/components/ui/NewsTicker'
import AdvancedStats from '@/components/ui/AdvancedStats'
import CaseTracker from '@/components/ui/CaseTracker'
import ConsultationScheduler from '@/components/ui/ConsultationScheduler'
import TrustBadges from '@/components/ui/TrustBadges'
import FloatingActionButtons from '@/components/ui/FloatingActionButtons'
import CostEstimator from '@/components/ui/CostEstimator'
import LegalAnalytics from '@/components/ui/LegalAnalytics'

export default function Home() {
  return (
    <Layout>
      <LiveChat />
      <NewsTicker />
      <HeroSection />
      <FloatingActionButtons />
      <TrustBadges />
      <AdvancedStats />
      <CaseTracker />
      <CostEstimator />
      <LegalAnalytics />
      <ConsultationScheduler />
      
      {/* Achievement Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text mb-6 leading-tight">
              50+ Years of Legal Excellence
            </h2>
            <p className="text-2xl text-yellow-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              A legacy of trust, integrity, and unwavering commitment to justice. 
              Serving clients across India with dedication and expertise since 1974.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2 animate-pulse">1000+</div>
              <div className="text-yellow-100">Cases Won</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2 animate-pulse">25+</div>
              <div className="text-yellow-100">Court Representations</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-400 mb-2 animate-pulse">98%</div>
              <div className="text-yellow-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
