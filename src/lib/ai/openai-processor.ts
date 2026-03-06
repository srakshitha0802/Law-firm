/**
 * OpenAI Processor
 * Implementation of AI document processing using OpenAI API (GPT-4, GPT-3.5)
 */

import OpenAI from 'openai'
import {
  BaseAIProcessor,
  SummarizationResult,
  ClassificationResult,
  EntityExtractionResult,
  ClauseAnalysisResult,
  QuestionAnsweringResult,
  ProcessingOptions,
  AIProcessingError,
  ProviderNotAvailableError,
  AIProcessorBuilder
} from './base-ai-processor'
import type { AIConfig, OpenAIConfig } from './config'

// Document types for legal documents
const LEGAL_DOCUMENT_TYPES = [
  'Petition',
  'Affidavit',
  'Judgment',
  'Order',
  'Contract',
  'Correspondence',
  'Evidence',
  'Invoice',
  'Power of Attorney',
  'Notice',
  'Filing',
  'Other'
]

export class OpenAIProcessor extends BaseAIProcessor {
  private client: OpenAI | null = null
  private openaiConfig: OpenAIConfig

  constructor(config: AIConfig) {
    super(config)
    this.openaiConfig = {
      model: config.model || 'gpt-4-turbo-preview',
      temperature: config.temperature ?? 0.3,
      maxTokens: config.maxTokens ?? 2000
    }
    this.client = null
  }

  private async getClient(): Promise<OpenAI> {
    if (!this.client) {
      if (!this.config.apiKey) {
        throw new ProviderNotAvailableError('openai')
      }
      try {
        const OpenAI = (await import('openai')).default
        this.client = new OpenAI({
          apiKey: this.config.apiKey,
          dangerouslyAllowBrowser: false
        })
      } catch (error) {
        throw new AIProcessingError(
          'Failed to initialize OpenAI client',
          'openai',
          'INIT_ERROR',
          error instanceof Error ? error : undefined
        )
      }
    }
    return this.client
  }

  async isAvailable(): Promise<boolean> {
    if (!this.config.apiKey) return false
    try {
      const client = await this.getClient()
      if (!client) return false
      await client.models.list()
      return true
    } catch {
      return false
    }
  }

  getProviderName(): string {
    return `OpenAI (${this.openaiConfig.model})`
  }

  private async makeOpenAIRequest<T>(
    requestFn: () => Promise<T>,
    operation: string,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        // Don't retry on authentication errors
        if (lastError.message.includes('401') || lastError.message.includes('authentication')) {
          throw new AIProcessingError(
            `${operation} failed: Authentication error`,
            'openai',
            'AUTH_ERROR',
            lastError
          )
        }
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break
        }
        
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
        
        console.warn(`OpenAI ${operation} attempt ${attempt} failed, retrying in ${delay}ms...`)
      }
    }
    
    throw new AIProcessingError(
      `${operation} failed after ${maxRetries} attempts`,
      'openai',
      'MAX_RETRIES_EXCEEDED',
      lastError || undefined
    )
  }

  async summarize(text: string, options?: ProcessingOptions): Promise<SummarizationResult> {
    const startTime = Date.now()
    
    try {
      const client = await this.getClient()
      if (!client) {
        throw new ProviderNotAvailableError('openai')
      }

      const prompt = this.buildSummarizationPrompt(text, options)

      const response = await this.makeOpenAIRequest(
        () => client.chat.completions.create({
          model: this.openaiConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are a legal document assistant. Provide clear, concise summaries of legal documents.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature ?? this.openaiConfig.temperature,
          max_tokens: options?.maxTokens ?? this.openaiConfig.maxTokens
        }),
        'summarization'
      )

      const summaryText = response.choices[0]?.message?.content || ''
      const processingTime = Date.now() - startTime

      // Parse the summary into structured format
      const { summary, keyPoints } = this.parseSummaryResponse(summaryText)

      return {
        summary,
        keyPoints,
        confidence: 0.9,
        modelUsed: this.openaiConfig.model,
        processingTime,
        tokensUsed: response.usage?.total_tokens
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Summarization failed',
        'openai',
        'SUMMARIZE_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async classify(text: string, options?: ProcessingOptions): Promise<ClassificationResult> {
    const startTime = Date.now()
    
    try {
      const client = await this.getClient()
      if (!client) {
        throw new ProviderNotAvailableError('openai')
      }

      const prompt = `Analyze the following legal document and classify it into one of these categories:
${LEGAL_DOCUMENT_TYPES.join(', ')}

Document content:
${text.substring(0, 3000)}

Respond with JSON format:
{
  "documentType": "<type>",
  "category": "<category>",
  "subcategory": "<optional subcategory>",
  "confidence": <0-1>,
  "alternatives": [{"type": "<type>", "confidence": <0-1>}]
}`

      const response = await client.chat.completions.create({
        model: this.openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'You are a legal document classifier. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 500
      })

      const content = response.choices[0]?.message?.content || ''
      const processingTime = Date.now() - startTime

      const result = this.parseClassificationResponse(content)

      return {
        ...result,
        modelUsed: this.openaiConfig.model,
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Classification failed',
        'openai',
        'CLASSIFY_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async extractEntities(text: string, options?: ProcessingOptions): Promise<EntityExtractionResult> {
    const startTime = Date.now()
    
    try {
      const client = await this.getClient()
      if (!client) {
        throw new ProviderNotAvailableError('openai')
      }

      const prompt = `Extract the following entities from this legal document:
1. Case numbers
2. Party names (appellant, respondent, plaintiff, defendant, etc.)
3. Court names
4. Dates
5. Legal citations
6. Amounts (monetary values)
7. Key legal terms

Document content:
${text.substring(0, 4000)}

Respond with JSON format:
{
  "entities": [
    {
      "text": "<entity text>",
      "type": "case_number|party_name|court_name|date|citation|amount|keyword",
      "confidence": <0-1>,
      "position": {"start": <number>, "end": <number>}
    }
  ]
}`

      const response = await client.chat.completions.create({
        model: this.openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'You are a legal entity extractor. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content || ''
      const processingTime = Date.now() - startTime

      const result = this.parseEntityExtractionResponse(content)

      return {
        ...result,
        modelUsed: this.openaiConfig.model,
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Entity extraction failed',
        'openai',
        'ENTITY_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async analyzeClauses(text: string, options?: ProcessingOptions): Promise<ClauseAnalysisResult> {
    const startTime = Date.now()
    
    try {
      const client = await this.getClient()
      if (!client) {
        throw new ProviderNotAvailableError('openai')
      }

      const prompt = `Analyze the clauses in this legal document. Identify:
1. Important clauses (liability, penalty, warranty, indemnity, termination, etc.)
2. Potential risks or concerns
3. A brief summary of the legal implications

Document content:
${text.substring(0, 4000)}

Respond with JSON format:
{
  "clauses": [
    {
      "text": "<clause excerpt>",
      "type": "<clause type>",
      "importance": "high|medium|low"
    }
  ],
  "risks": [
    {
      "level": "high|medium|low",
      "description": "<risk description>",
      "clause": "<related clause>",
      "recommendation": "<recommendation>"
    }
  ],
  "summary": "<overall analysis summary>"
}`

      const response = await client.chat.completions.create({
        model: this.openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'You are a legal document analyst. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      })

      const content = response.choices[0]?.message?.content || ''
      const processingTime = Date.now() - startTime

      const result = this.parseClauseAnalysisResponse(content)

      return {
        ...result,
        modelUsed: this.openaiConfig.model,
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Clause analysis failed',
        'openai',
        'CLAUSE_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async answerQuestion(question: string, text: string, options?: ProcessingOptions): Promise<QuestionAnsweringResult> {
    const startTime = Date.now()
    
    try {
      const client = await this.getClient()
      if (!client) {
        throw new ProviderNotAvailableError('openai')
      }

      const prompt = `Based on the following legal document, answer the question.
If the answer is not in the document, say so clearly.

Document:
${text.substring(0, 6000)}

Question: ${question}

Respond with JSON format:
{
  "answer": "<your answer>",
  "confidence": <0-1>,
  "sources": [
    {
      "text": "<relevant excerpt>",
      "pageNumber": <number if available>
    }
  ]
}`

      const response = await client.chat.completions.create({
        model: this.openaiConfig.model,
        messages: [
          {
            role: 'system',
            content: 'You are a legal document assistant. Answer questions based only on the provided document. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })

      const content = response.choices[0]?.message?.content || ''
      const processingTime = Date.now() - startTime

      const result = this.parseQuestionAnsweringResponse(content, question)

      return {
        ...result,
        modelUsed: this.openaiConfig.model,
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Question answering failed',
        'openai',
        'QA_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  // Helper methods for building prompts and parsing responses

  private buildSummarizationPrompt(text: string, options?: ProcessingOptions): string {
    const maxLength = options?.maxSummaryLength || 500
    return `Provide a summary of the following legal document in approximately ${maxLength} words.

Also list the key points as bullet points.

Document:
${text.substring(0, 8000)}

Format your response as:
SUMMARY:
<summary text>

KEY POINTS:
- <point 1>
- <point 2>
- <point 3>`
  }

  private parseSummaryResponse(content: string): { summary: string; keyPoints: string[] } {
    const summaryMatch = content.match(/SUMMARY:([\s\S]*?)(?=KEY POINTS:|$)/i)
    const keyPointsMatch = content.match(/KEY POINTS:([\s\S]*)/i)

    const summary = summaryMatch?.[1]?.trim() || content
    const keyPoints: string[] = []

    if (keyPointsMatch) {
      const pointsText = keyPointsMatch[1]
      const points = pointsText.match(/[-•*]\s*(.+)/g)
      if (points) {
        points.forEach(point => {
          keyPoints.push(point.replace(/[-•*]\s*/, '').trim())
        })
      }
    }

    return { summary, keyPoints }
  }

  private parseClassificationResponse(content: string): Omit<ClassificationResult, 'modelUsed' | 'processingTime'> {
    try {
      // Try to parse as JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          documentType: parsed.documentType || 'Other',
          category: parsed.category || 'Legal',
          subcategory: parsed.subcategory,
          confidence: parsed.confidence || 0.7,
          alternativeClassifications: parsed.alternatives || []
        }
      }
    } catch {
      // Fall back to simple parsing
    }

    return {
      documentType: 'Other',
      category: 'Legal',
      confidence: 0.5,
      alternativeClassifications: []
    }
  }

  private parseEntityExtractionResponse(content: string): Omit<EntityExtractionResult, 'modelUsed' | 'processingTime'> {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          entities: parsed.entities || []
        }
      }
    } catch {
      // Fall back to empty
    }

    return { entities: [] }
  }

  private parseClauseAnalysisResponse(content: string): Omit<ClauseAnalysisResult, 'modelUsed' | 'processingTime'> {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          clauses: parsed.clauses || [],
          risks: parsed.risks || [],
          summary: parsed.summary || ''
        }
      }
    } catch {
      // Fall back to simple parsing
    }

    return {
      clauses: [],
      risks: [],
      summary: content
    }
  }

  private parseQuestionAnsweringResponse(content: string, question: string): Omit<QuestionAnsweringResult, 'modelUsed' | 'processingTime'> {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          question,
          answer: parsed.answer || 'Unable to find an answer in the document.',
          confidence: parsed.confidence || 0.5,
          sources: parsed.sources || []
        }
      }
    } catch {
      // Fall back to simple parsing
    }

    return {
      question,
      answer: content,
      confidence: 0.5,
      sources: []
    }
  }
}

// Builder for OpenAI processor
export class OpenAIProcessorBuilder extends AIProcessorBuilder {
  build(): OpenAIProcessor {
    return new OpenAIProcessor({
      provider: 'openai',
      ...this.config
    } as AIConfig)
  }
}

