'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react'

const faqData = [
  {
    category: "General Legal Questions",
    questions: [
      {
        question: "How do I know if I need a lawyer?",
        answer: "You may need a lawyer if you're facing legal disputes, complex transactions, criminal charges, or need legal documents reviewed. It's always better to consult early rather than wait until problems escalate."
      },
      {
        question: "What should I bring to my first consultation?",
        answer: "Bring all relevant documents (contracts, notices, court papers), identification, and a written timeline of events. Be prepared to explain your situation clearly and concisely."
      },
      {
        question: "How are legal fees calculated?",
        answer: "Legal fees vary based on case complexity, time required, and lawyer experience. We offer transparent fee structures and provide detailed estimates before proceeding with any legal work."
      }
    ]
  },
  {
    category: "Civil Law",
    questions: [
      {
        question: "What is the statute of limitations for civil cases in India?",
        answer: "The Limitation Act, 1963 specifies different periods: 3 years for contracts, 12 years for property disputes, and 30 years for mortgages. Consult a lawyer to understand specific limitations for your case."
      },
      {
        question: "How long do civil cases typically take?",
        answer: "Civil cases can take 2-5 years depending on complexity, court backlog, and appeals. Simple matters may resolve faster through settlement or alternative dispute resolution."
      },
      {
        question: "What documents are needed for property registration?",
        answer: "You'll need sale deed, previous ownership documents, property tax receipts, identity proof, and address proof. The exact requirements may vary by state and property type."
      }
    ]
  },
  {
    category: "Criminal Law",
    questions: [
      {
        question: "What are my rights if arrested?",
        answer: "You have the right to remain silent, legal counsel, be informed of charges, and apply for bail. Don't answer questions without your lawyer present. These rights are protected under the Constitution."
      },
      {
        question: "What's the difference between bailable and non-bailable offenses?",
        answer: "Bailable offenses allow bail as a matter of right, while non-bailable offenses require court discretion for bail. The seriousness of the offense determines which category applies."
      },
      {
        question: "How long can criminal proceedings take?",
        answer: "Criminal cases can take 2-7 years depending on complexity. Sessions court cases typically take longer than magistrate court cases. Appeals can extend the timeline further."
      }
    ]
  },
  {
    category: "Family Law",
    questions: [
      {
        question: "What are the grounds for divorce in India?",
        answer: "Under Hindu law, grounds include adultery, cruelty, desertion, conversion, mental disorder, and irretrievable breakdown. Special Marriage Act provides different grounds. Consultation is essential to understand your specific situation."
      },
      {
        question: "How is child custody determined?",
        answer: "Courts consider the child's welfare as paramount. Factors include child's age, preference (if old enough), parents' financial capacity, and moral character. Joint custody is often preferred."
      },
      {
        question: "What is maintenance and how is it calculated?",
        answer: "Maintenance is financial support for spouses/children. Courts consider husband's income, wife's earning capacity, children's needs, and standard of living. No fixed formula applies to all cases."
      }
    ]
  },
  {
    category: "Property & Land",
    questions: [
      {
        question: "What is the difference between lease and rent?",
        answer: "Lease typically exceeds 1 year and requires registration, while rent is usually monthly and doesn't require registration. Leases offer more legal protection to both parties."
      },
      {
        question: "How can I verify property title?",
        answer: "Check sale deed, previous chain of title, encumbrance certificate, and property tax records. Title insurance and legal verification are recommended for high-value transactions."
      },
      {
        question: "What are RERA regulations?",
        answer: "Real Estate Regulatory Act protects homebuyers by requiring timely project completion, transparent pricing, and proper approvals. Developers must register projects and provide detailed information."
      }
    ]
  }
]

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const filteredFAQs = faqData.filter(category => {
    const matchesCategory = selectedCategory === "All" || category.category === selectedCategory
    const hasMatchingQuestions = category.questions.some(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
    return matchesCategory && (searchQuery === "" || hasMatchingQuestions)
  })

  const allQuestions = filteredFAQs.flatMap(category => category.questions)

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="h-12 w-12 text-blue-200 mr-4" />
            <h1 className="text-4xl font-bold text-white">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Find answers to common legal questions. Can't find what you're looking for? 
            <a href="/contact" className="text-white underline hover:text-blue-200 transition-colors">Contact us</a>
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {["All", ...faqData.map(c => c.category)].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {allQuestions.length > 0 ? (
            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <div key={category.category} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-blue-900 text-white px-6 py-4">
                    <h2 className="text-xl font-semibold">{category.category}</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {category.questions.map((faq, questionIndex) => {
                      const globalIndex = allQuestions.indexOf(faq)
                      const isExpanded = expandedItems.includes(globalIndex)
                      
                      return (
                        <div key={questionIndex} className="border-gray-200">
                          <button
                            onClick={() => toggleExpanded(globalIndex)}
                            className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
                          >
                            <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5 text-blue-900 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          {isExpanded && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                              <div className="prose prose-sm max-w-none text-gray-700">
                                {faq.answer.split('\n').map((paragraph, index) => (
                                  <p key={index} className={index > 0 ? 'mt-3' : ''}>
                                    {paragraph}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any FAQs matching your search. Try different keywords or browse our categories.
              </p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                className="px-6 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our legal team is here to help with personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/consultation"
              className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
            >
              Schedule Consultation
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
