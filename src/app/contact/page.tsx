import { Button } from '@/components/ui/button'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
              Get in touch with our legal team for any inquiries or to schedule a consultation.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Office Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Office Address</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium">Main Office</p>
                <p>123 Legal District Complex</p>
                <p>Civil Lines, New Delhi</p>
                <p>Delhi - 110001</p>
                <p>India</p>
              </div>
            </div>

            {/* Contact Numbers */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Phone Numbers</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium">Office:</p>
                <p>+91 11 2345 6789</p>
                <p className="font-medium mt-3">Mobile:</p>
                <p>+91 98765 43210</p>
                <p>+91 87654 32109</p>
                <p className="font-medium mt-3">WhatsApp:</p>
                <p>+91 98765 43210</p>
              </div>
            </div>

            {/* Email Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-900 text-white">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-900">Email Addresses</h3>
              </div>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium">General Inquiries:</p>
                <p>info@lawfirm.com</p>
                <p className="font-medium mt-3">Consultations:</p>
                <p>consultation@lawfirm.com</p>
                <p className="font-medium mt-3">Support:</p>
                <p>support@lawfirm.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Working Hours</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our office hours and availability
            </p>
          </div>
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 divide-y divide-gray-200">
                <div className="px-6 py-4 flex justify-between">
                  <span className="font-medium text-gray-900">Monday - Friday</span>
                  <span className="text-gray-600">9:00 AM - 6:00 PM</span>
                </div>
                <div className="px-6 py-4 flex justify-between">
                  <span className="font-medium text-gray-900">Saturday</span>
                  <span className="text-gray-600">10:00 AM - 4:00 PM</span>
                </div>
                <div className="px-6 py-4 flex justify-between">
                  <span className="font-medium text-gray-900">Sunday</span>
                  <span className="text-gray-600">Closed</span>
                </div>
                <div className="px-6 py-4 flex justify-between">
                  <span className="font-medium text-gray-900">Emergency Cases</span>
                  <span className="text-gray-600">24/7 Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Find Us</h2>
            <p className="mt-4 text-lg text-gray-600">
              Visit our office in the heart of the legal district
            </p>
          </div>
          <div className="mt-12">
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-600">Interactive map will be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">123 Legal District Complex, Civil Lines, New Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Take the first step towards resolving your legal matters
            </p>
          </div>
          <div className="mt-8 flex justify-center space-x-4">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-gray-100">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
              Call Us Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
