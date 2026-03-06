'use client'

import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, User, Clock, ArrowRight, Search } from 'lucide-react'

const blogPosts = [
  {
    id: 1,
    title: "Understanding Property Rights in India: A Comprehensive Guide",
    excerpt: "Navigate the complex landscape of Indian property laws with our detailed guide covering ownership rights, registration processes, and dispute resolution mechanisms.",
    author: "Senior Advocate (Father)",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Property Law",
    featured: true,
    image: "/api/placeholder/property-law"
  },
  {
    id: 2,
    title: "Family Law Amendments 2024: What You Need to Know",
    excerpt: "Recent changes in family law legislation have significant implications for divorce proceedings, child custody, and alimony. Stay informed about your rights.",
    author: "Senior Advocate (Mother)",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Family Law",
    featured: true,
    image: "/api/placeholder/family-law"
  },
  {
    id: 3,
    title: "Corporate Compliance Checklist for Indian Businesses",
    excerpt: "Essential compliance requirements for businesses operating in India, including GST, labor laws, environmental regulations, and corporate governance.",
    author: "Junior Advocate (Sister)",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Corporate Law",
    featured: false,
    image: "/api/placeholder/corporate-law"
  },
  {
    id: 4,
    title: "Criminal Defense Strategies: Protecting Your Rights",
    excerpt: "Understanding your constitutional rights during criminal proceedings and effective defense strategies that every accused person should know.",
    author: "Junior Advocate (Cousin)",
    date: "2023-12-28",
    readTime: "7 min read",
    category: "Criminal Law",
    featured: false,
    image: "/api/placeholder/criminal-law"
  },
  {
    id: 5,
    title: "Land Acquisition Laws: Government vs Private Rights",
    excerpt: "Balancing public infrastructure development with private property rights - examining the legal framework governing land acquisition in India.",
    author: "Senior Advocate (Father)",
    date: "2023-12-20",
    readTime: "9 min read",
    category: "Property Law",
    featured: false,
    image: "/api/placeholder/land-acquisition"
  },
  {
    id: 6,
    title: "Legal Documentation Best Practices for Businesses",
    excerpt: "Essential documents every business needs, from incorporation papers to employment contracts, and tips for maintaining legal compliance.",
    author: "Junior Advocate (Sister)",
    date: "2023-12-15",
    readTime: "5 min read",
    category: "Documentation",
    featured: false,
    image: "/api/placeholder/documentation"
  }
]

const categories = [
  { name: "All", count: blogPosts.length },
  { name: "Property Law", count: 2 },
  { name: "Family Law", count: 1 },
  { name: "Corporate Law", count: 1 },
  { name: "Criminal Law", count: 1 },
  { name: "Documentation", count: 1 }
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Legal Insights & Updates</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Stay informed with our expert analysis of Indian laws, court decisions, and legal trends affecting your rights and business.
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
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      {selectedCategory === "All" && !searchQuery && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-white">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-blue-900 font-medium hover:text-blue-800 transition-colors"
                      >
                        Read more
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 
               selectedCategory !== "All" ? `${selectedCategory} Articles` : 
               "All Articles"}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-900 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-flex items-center text-blue-900 font-medium text-sm hover:text-blue-800 transition-colors"
                      >
                        Read more
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any articles matching your search. Try different keywords or browse our categories.
                </p>
                <Button onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for weekly legal insights, case updates, and important legal news.
          </p>
          <div className="max-w-md mx-auto">
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
              />
              <Button type="submit">
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-3">
              Join 5,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
