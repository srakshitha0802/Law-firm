/**
 * AI Document Processing API Routes
 * Endpoints for document summarization, classification, entity extraction, and more
 */

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import {
  createAIProcessor,
  summarizeDocument,
  classifyDocument,
  extractEntities,
  analyzeClauses,
  answerQuestion,
  getAvailableProviders,
  type ProcessingOptions
} from '@/lib/ai'

// GET: Check available AI providers
export async function GET(request: NextRequest) {
  try {
    // Get token from cookies or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    // Only ADMIN and ADVOCATE can use AI features
    if (payload.role !== 'ADMIN' && payload.role !== 'ADVOCATE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const providers = await getAvailableProviders()
    
    return NextResponse.json({
      providers,
      message: providers.length > 0 
        ? 'AI processing is available' 
        : 'No AI providers configured. Set API keys in environment variables.'
    })
  } catch (error) {
    console.error('AI providers check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Process document with AI
export async function POST(request: NextRequest) {
  try {
    // Get token from cookies or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    // Only ADMIN and ADVOCATE can use AI features
    if (payload.role !== 'ADMIN' && payload.role !== 'ADVOCATE') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, text, question, options } = body as {
      action: 'summarize' | 'classify' | 'extract' | 'analyze' | 'qa' | 'full'
      text: string
      question?: string
      options?: ProcessingOptions
    }

    if (!text) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    const config = {
      provider: options?.customPrompt ? undefined : undefined // Let auto-detect handle it
    }

    switch (action) {
      case 'summarize': {
        const result = await summarizeDocument(text, options, config)
        return NextResponse.json({ result })
      }
      
      case 'classify': {
        const result = await classifyDocument(text, options, config)
        return NextResponse.json({ result })
      }
      
      case 'extract': {
        const result = await extractEntities(text, options, config)
        return NextResponse.json({ result })
      }
      
      case 'analyze': {
        const result = await analyzeClauses(text, options, config)
        return NextResponse.json({ result })
      }
      
      case 'qa': {
        if (!question) {
          return NextResponse.json(
            { error: 'Question is required for QA action' },
            { status: 400 }
          )
        }
        const result = await answerQuestion(question, text, options, config)
        return NextResponse.json({ result })
      }
      
      case 'full': {
        const { createAIProcessor } = await import('@/lib/ai')
        const processor = await createAIProcessor(config)
        
        const [summary, classification, entities, clauses] = await Promise.all([
          processor.summarize(text, options),
          processor.classify(text, options),
          processor.extractEntities(text, options),
          processor.analyzeClauses(text, options)
        ])
        
        return NextResponse.json({
          result: {
            summary,
            classification,
            entities,
            clauses
          }
        })
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: summarize, classify, extract, analyze, qa, or full' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI processing error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI processing failed' },
      { status: 500 }
    )
  }
}

