'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Bot, Send, Mic, Paperclip, Lightbulb, BookOpen, Scale, Clock, CheckCircle, AlertCircle, User } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface LegalTopic {
  id: string
  title: string
  description: string
  icon: React.ElementType
  category: string
}

export default function AILegalAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Legal Assistant. I can help you with legal information, case assessments, document analysis, and connect you with the right legal experts. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'What are my rights in a civil dispute?',
        'How long does a divorce case take?',
        'What documents do I need for property registration?',
        'Can you help me understand criminal charges?'
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [messageIdCounter, setMessageIdCounter] = useState(2)

  const generateId = useCallback(() => {
    const id = `msg-${messageIdCounter}`
    setMessageIdCounter(prev => prev + 1)
    return id
  }, [messageIdCounter])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const legalTopics: LegalTopic[] = [
    {
      id: 'civil',
      title: 'Civil Law',
      description: 'Property disputes, contracts, torts',
      icon: Scale,
      category: 'Civil Matters'
    },
    {
      id: 'criminal',
      title: 'Criminal Law',
      description: 'Defense, charges, legal procedures',
      icon: AlertCircle,
      category: 'Criminal Defense'
    },
    {
      id: 'family',
      title: 'Family Law',
      description: 'Divorce, custody, adoption',
      icon: User,
      category: 'Family Matters'
    },
    {
      id: 'corporate',
      title: 'Corporate Law',
      description: 'Business formation, compliance',
      icon: BookOpen,
      category: 'Business Law'
    }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = useCallback(async (userMessage: string) => {
    setIsTyping(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const responses = [
      {
        content: `Based on your query about "${userMessage}", I can provide the following insights:\n\n• This falls under civil jurisdiction with typical resolution time of 3-6 months\n• Required documentation includes identity proof, contract copies, and evidence\n• Estimated costs range from ₹5,000 to ₹15,000 depending on complexity\n• I recommend scheduling a consultation with our civil law experts`,
        suggestions: ['Schedule consultation', 'View cost estimator', 'Download case checklist']
      },
      {
        content: `I've analyzed your legal question. Here's what I found:\n\n• This type of case has a 96% success rate in our firm\n• Average resolution time is 4.2 months\n• Key factors: documentation quality, evidence strength, legal precedent\n• Next steps: document review, strategy session, court filing`,
        suggestions: ['Book strategy session', 'Prepare documents', 'Review success factors']
      },
      {
        content: `Legal Analysis Complete:\n\n📋 Case Type: ${userMessage.includes('divorce') ? 'Family Law' : 'Civil Matter'}\n⏱️ Estimated Timeline: 3-6 months\n💰 Cost Range: ₹5,000 - ₹20,000\n🎯 Success Probability: 94%\n\nWould you like me to connect you with a specialized lawyer for this case?`,
        suggestions: ['Connect with lawyer', 'Detailed cost analysis', 'Case timeline']
      }
    ]
    
    const responseIndex = Math.floor(Math.random() * responses.length)
    const response = responses[responseIndex]
    
    setMessages(prev => [...prev, {
      id: generateId(),
      type: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    }])
    
    setIsTyping(false)
  }, [generateId])

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return
    
    const userMessage = {
      id: generateId(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage] as Message[])
    setInput('')
    generateAIResponse(input)
  }, [input, generateId, generateAIResponse])

  const handleTopicSelect = (topic: LegalTopic) => {
    const topicMessage = `Tell me more about ${topic.title}`
    handleSendMessage()
    setTimeout(() => {
      setInput(topicMessage)
    }, 100)
  }

  const handleVoiceInput = () => {
    setIsListening(true)
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false)
      setInput('Voice input: What are my legal rights in a property dispute?')
    }, 3000)
  }

  const handleDocumentUpload = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: '📄 Document Analysis Complete:\n\n• Document Type: Legal Agreement\n• Pages: 12\n• Key Clauses: 5 identified\n• Risk Areas: 2 medium-risk items found\n• Recommendation: Review clauses 3 and 7 with legal counsel\n\nWould you like a detailed analysis report?',
        timestamp: new Date(),
        suggestions: ['Get detailed report', 'Schedule review', 'Upload another document']
      }])
    }, 2000)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl mb-6 animate-pulse">
            <Bot className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Legal Assistant</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant legal guidance powered by advanced artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Topics */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Lightbulb className="h-6 w-6 mr-3 text-yellow-500" />
                Quick Topics
              </h3>
              <div className="space-y-3">
                {legalTopics.map((topic) => {
                  const Icon = topic.icon
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic)}
                      className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-purple-700">{topic.title}</div>
                          <div className="text-sm text-gray-600">{topic.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold text-gray-900">AI Legal Assistant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDocumentUpload}
                    disabled={isAnalyzing}
                    className="p-2 text-gray-500 hover:text-purple-600 transition-colors disabled:opacity-50"
                  >
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className="p-2 text-gray-500 hover:text-purple-600 transition-colors disabled:opacity-50"
                  >
                    <Mic className={`h-5 w-5 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-start space-x-2 mb-2">
                        {message.type === 'assistant' && (
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div className="text-sm text-gray-500">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      
                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-500 mb-2">Suggested actions:</div>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                {isAnalyzing && (
                  <div className="mb-3 p-3 bg-yellow-50 rounded-xl flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-500 border-t-transparent"></div>
                    <span className="text-yellow-700 text-sm">Analyzing document...</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask your legal question..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    disabled={isTyping || isAnalyzing}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping || isAnalyzing}
                    className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Bar */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">24/7 Available</h4>
            <p className="text-sm text-gray-600">Get instant legal guidance anytime</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">98% Accuracy</h4>
            <p className="text-sm text-gray-600">AI-powered legal analysis</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center shadow-lg border border-gray-100">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">Free to Use</h4>
            <p className="text-sm text-gray-600">No cost for initial consultation</p>
          </div>
        </div>
      </div>
    </section>
  )
}
