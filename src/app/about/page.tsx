import { Button } from '@/components/ui/button'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              About Our Firm
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              A legacy of legal excellence built on integrity, experience, and unwavering commitment to justice.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-extrabold text-gray-900">Our Legacy</h2>
              <p className="mt-4 text-lg text-gray-600">
                Founded on the principles of justice and ethical practice, our firm has been serving the legal needs 
                of individuals and businesses for over two decades. We believe in providing personalized attention 
                to each case while maintaining the highest standards of professional integrity.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Our approach combines traditional legal wisdom with modern legal practices, ensuring that our clients 
                receive comprehensive representation that addresses both immediate concerns and long-term objectives.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:col-span-1">
              <div className="bg-gray-100 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Philosophy</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-900 text-white">
                        <span className="text-sm font-bold">1</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Client First</h4>
                      <p className="mt-1 text-gray-600">Every decision is made with the client's best interests at heart.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-900 text-white">
                        <span className="text-sm font-bold">2</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Integrity Always</h4>
                      <p className="mt-1 text-gray-600">We uphold the highest ethical standards in all our dealings.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-900 text-white">
                        <span className="text-sm font-bold">3</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Excellence in Practice</h4>
                      <p className="mt-1 text-gray-600">We strive for the best possible outcomes through diligent work.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Core Values</h2>
            <p className="mt-4 text-lg text-gray-600">
              The principles that guide our practice and define our commitment to clients
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Trust</h3>
              <p className="mt-2 text-gray-600">
                Building lasting relationships through transparency and reliability
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Expertise</h3>
              <p className="mt-2 text-gray-600">
                Deep legal knowledge and extensive courtroom experience
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Diligence</h3>
              <p className="mt-2 text-gray-600">
                Meticulous preparation and attention to every detail
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            Experience the Difference
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Let us put our experience and dedication to work for you
          </p>
          <div className="mt-8">
            <Link href="/consultation">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                Schedule a Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
