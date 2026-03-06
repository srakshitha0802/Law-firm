import { Button } from '@/components/ui/button'
import Link from 'next/link'

const advocates = [
  {
    name: "Senior Advocate (Father)",
    experience: "25+ Years",
    specialization: "Civil & Criminal Law",
    courts: "Supreme Court, High Courts, District Courts",
    role: "Senior Advocate",
    description: "Extensive experience in complex civil litigation and criminal defense. Known for strategic legal thinking and successful case outcomes."
  },
  {
    name: "Senior Advocate (Mother)", 
    experience: "20+ Years",
    specialization: "Family & Property Law",
    courts: "High Courts, Family Courts, Civil Courts",
    role: "Senior Advocate",
    description: "Specialized in family law matters and property disputes. Compassionate approach to sensitive family cases with focus on amicable resolutions."
  },
  {
    name: "Junior Advocate (Sister)",
    experience: "5 Years",
    specialization: "Corporate & Documentation",
    courts: "High Courts, Company Law Board, Tribunals",
    role: "Junior Advocate", 
    description: "Expertise in corporate law, business formation, and legal documentation. Modern approach to corporate legal needs and compliance."
  },
  {
    name: "Junior Advocate (Cousin)",
    experience: "5 Years", 
    specialization: "Civil Litigation & Arbitration",
    courts: "District Courts, Arbitration Tribunals",
    role: "Junior Advocate",
    description: "Focus on civil litigation and alternative dispute resolution. Efficient case management and client communication."
  }
]

export default function AdvocatesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Our Legal Team
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Meet our experienced advocates dedicated to providing exceptional legal representation 
              with integrity and professionalism.
            </p>
          </div>
        </div>
      </div>

      {/* Team Stats */}
      <div className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">50+</div>
              <div className="mt-1 text-gray-600">Combined Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">4</div>
              <div className="mt-1 text-gray-600">Dedicated Advocates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-900">1000+</div>
              <div className="mt-1 text-gray-600">Cases Successfully Handled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Advocates Grid */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {advocates.map((advocate, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">{advocate.name}</h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-900">
                        {advocate.role}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Experience:</span> {advocate.experience}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Specialization:</span> {advocate.specialization}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Courts:</span> {advocate.courts}
                      </p>
                    </div>
                    <p className="mt-4 text-gray-700">
                      {advocate.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approach Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Approach</h2>
            <p className="mt-4 text-lg text-gray-600">
              How we work to achieve the best outcomes for our clients
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Case Analysis</h3>
              <p className="mt-2 text-gray-600">Thorough evaluation of legal positions and potential outcomes</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Clear Communication</h3>
              <p className="mt-2 text-gray-600">Regular updates and transparent client communication</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Strategic Planning</h3>
              <p className="mt-2 text-gray-600">Developing effective legal strategies for each case</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Dedicated Representation</h3>
              <p className="mt-2 text-gray-600">Committed advocacy throughout the legal process</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to Work With Our Team?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Schedule a consultation to discuss your legal needs with our experienced advocates
          </p>
          <div className="mt-8">
            <Link href="/consultation">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
