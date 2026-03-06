'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Send, Phone, Calendar, Clock, User, Bot, CheckCircle } from 'lucide-react'

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: '👋 Welcome to Legal Excellence! I\'m your AI legal assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const botResponses = [
    'I can help you with information about our legal services, case consultations, and practice areas.',
    'Our experienced advocates specialize in civil, criminal, family, and property law.',
    'Would you like to schedule a consultation? I can check available time slots.',
    'I can provide information about case costs, timelines, and legal procedures.',
    'Our success rate is 98% with over 1000+ cases handled successfully.',
    'Let me connect you with the right legal expert for your specific needs.'
  ]

  const sendMessage = () => {
    if (inputMessage.trim() === '') return

    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      const botMessage = {
        id: messages.length + 2,
        sender: 'bot',
        content: randomResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
      isOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
    }`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col border border-gray-200 ${
        isOpen ? 'scale-100' : 'scale-95'
      }`}>
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bot className="h-6 w-6" />
            <div>
              <div className="font-semibold">Legal Assistant</div>
              <div className="text-xs opacity-75">Online • Ready to help</div>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
            >
              <div className={`max-w-[80%] ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                  : 'bg-white text-gray-800 border border-gray-200'
              } rounded-2xl p-4 shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {message.sender === 'bot' ? (
                      <Bot className="h-4 w-4 text-blue-600" />
                    ) : (
                      <User className="h-4 w-4 text-blue-600" />
                    )}
                    <span className="text-xs font-medium">
                      {message.sender === 'bot' ? 'Legal Assistant' : 'You'}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm leading-relaxed">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl p-4 shadow-md">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">Legal Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          <div className="flex space-x-2 mb-3">
            <button
              onClick={() => window.location.href = 'tel:+919876543210'}
              className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              <Phone className="h-4 w-4" />
              <span>Call Now</span>
            </button>
            <button
              onClick={() => window.location.href = '/consultation'}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  sendMessage()
                }
              }}
              placeholder="Type your legal question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 group relative overflow-hidden"
        >
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6" />
            <span className="font-medium">Chat with Legal Expert</span>
          </div>
          <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        </button>
      )}
    </div>
  )
}
