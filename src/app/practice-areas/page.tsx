import { Button } from '@/components/ui/button'
import Link from 'next/link'

const practiceAreas = [
  {
    title: "Civil Law",
    description: "Comprehensive civil litigation services including contract disputes, property matters, tort claims, and civil rights violations.",
    problems: [
      "Breach of contract disputes",
      "Property ownership conflicts", 
      "Tort claims and damages",
      "Civil rights violations",
      "Injunctions and declaratory relief"
    ],
    approach: "We take a methodical approach to civil cases, focusing on thorough documentation, strategic negotiation, and aggressive litigation when necessary. Our goal is to protect your rights and achieve favorable outcomes efficiently.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  },
  {
    title: "Criminal Law",
    description: "Expert criminal defense services for all types of criminal matters, from minor offenses to serious criminal charges.",
    problems: [
      "White-collar crimes",
      "Financial fraud",
      "Regulatory violations",
      "Assault and violent crimes",
      "Drug-related offenses"
    ],
    approach: "Our criminal defense team provides vigorous representation, protecting your constitutional rights at every stage. We conduct thorough investigations, challenge evidence, and develop strong defense strategies.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  },
  {
    title: "Family Law",
    description: "Compassionate and professional family law services addressing marriage, divorce, child custody, and family dispute resolution.",
    problems: [
      "Divorce and separation",
      "Child custody and visitation",
      "Alimony and maintenance",
      "Property division",
      "Domestic violence matters"
    ],
    approach: "We handle family matters with sensitivity and professionalism, focusing on amicable resolutions while protecting your interests. Our approach prioritizes the well-being of all parties involved, especially children.",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
  },
  {
    title: "Property & Land Disputes",
    description: "Specialized legal services for all property-related matters including land acquisition, title disputes, and real estate transactions.",
    problems: [
      "Land title disputes",
      "Property boundary conflicts",
      "Real estate transaction issues",
      "Land acquisition matters",
      "Property registration problems"
    ],
    approach: "Our property law team has extensive experience in handling complex land and real estate matters. We provide comprehensive due diligence, documentation review, and litigation support to protect your property interests.",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
  },
  {
    title: "Corporate & Documentation",
    description: "Complete corporate legal services including business formation, compliance, contracts, and commercial documentation.",
    problems: [
      "Business formation and structuring",
      "Regulatory compliance",
      "Contract drafting and review",
      "Corporate governance",
      "Mergers and acquisitions"
    ],
    approach: "We provide comprehensive corporate legal support, ensuring your business complies with all regulatory requirements while protecting your commercial interests. Our services cover everything from startup formation to complex corporate transactions.",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
  },
  {
    title: "Documentation Services",
    description: "Professional legal drafting, verification, and authentication services for all types of legal documents.",
    problems: [
      "Legal agreement drafting",
      "Document verification",
      "Affidavit preparation",
      "Power of attorney documents",
      "Legal notice drafting"
    ],
    approach: "Our documentation services ensure all your legal documents are properly drafted, verified, and compliant with applicable laws. We pay meticulous attention to detail to prevent future legal complications.",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  }
]

export default function PracticeAreasPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Practice Areas
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Comprehensive legal services across multiple practice areas, 
              delivered with expertise and dedication.
            </p>
          </div>
        </div>
      </div>

      {/* Practice Areas */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {practiceAreas.map((area, index) => (
              <div key={index} className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <h2 className="text-3xl font-extrabold text-gray-900">{area.title}</h2>
                  <p className="mt-4 text-lg text-gray-600">{area.description}</p>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900">Common Issues We Handle:</h3>
                    <ul className="mt-3 space-y-2">
                      {area.problems.map((problem, problemIndex) => (
                        <li key={problemIndex} className="flex items-start">
                          <svg className="flex-shrink-0 h-5 w-5 text-blue-900 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 text-gray-600">{problem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900">Our Approach:</h3>
                    <p className="mt-2 text-gray-600">{area.approach}</p>
                  </div>
                </div>
                
                <div className={`mt-8 lg:mt-0 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="bg-gray-100 rounded-lg p-8 h-full flex items-center justify-center">
                    <svg className="h-24 w-24 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={area.icon} />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Our Firm</h2>
            <p className="mt-4 text-lg text-gray-600">
              The advantages of working with our experienced legal team
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Deep Expertise</h3>
              <p className="mt-2 text-gray-600">Specialized knowledge across all major practice areas</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Proven Results</h3>
              <p className="mt-2 text-gray-600">Track record of successful outcomes across case types</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-900 text-white mx-auto">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Personal Attention</h3>
              <p className="mt-2 text-gray-600">Dedicated focus on each client's unique needs</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white">
            Need Legal Assistance?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Contact us to discuss how we can help with your specific legal matter
          </p>
          <div className="mt-8">
            <Link href="/consultation">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
