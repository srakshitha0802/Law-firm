#!/usr/bin/env node

/**
 * Test AI Document Processing
 */

import { createAIProcessor } from './src/lib/ai/index.js'

const testText = `
AGREEMENT

This Agreement is entered into between:
PARTY A: John Doe, son of Robert Doe, residing at 123 Main Street
PARTY B: Jane Smith, daughter of William Smith, residing at 456 Oak Avenue

TERMS:
1. Party A agrees to provide services
2. Party B agrees to pay $1000
3. This agreement is valid for 1 year

Signed on: January 1, 2024
`

async function testAI() {
  console.log('Testing AI Document Processing System...')
  
  try {
    const processor = await createAIProcessor({
      provider: 'local',
      useCache: true
    })
    
    console.log('AI Processor created successfully')
    
    // Test summarization
    const summary = await processor.summarize(testText, {
      maxSummaryLength: 100
    })
    
    console.log('Summary:', summary.summary)
    console.log('Key Points:', summary.keyPoints)
    
  } catch (error) {
    console.error('AI Test failed:', error.message)
  }
}

testAI()