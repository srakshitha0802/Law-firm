/**
 * Base AI Processor
 * Abstract base class for all AI document processing implementations
 */

import type { AIConfig, AIProvider } from './config'

// Result types
export interface SummarizationResult {
  summary: string
  keyPoints: string[]
  confidence: number
  modelUsed: string
  processingTime: number
  tokensUsed?: number
}

export interface ClassificationResult {
  documentType: string
  category: string
  subcategory?: string
  confidence: number
  alternativeClassifications: Array<{
    type: string
    confidence: number
  }>
  modelUsed: string
  processingTime: number
}

export interface EntityExtractionResult {
  entities: Entity[]
  modelUsed: string
  processingTime: number
}

export interface Entity {
  text: string
  type: 'case_number' | 'party_name' | 'court_name' | 'date' | 'citation' | 'amount' | 'keyword'
  confidence: number
  position?: {
    start: number
    end: number
  }
}

export interface ClauseAnalysisResult {
  clauses: Clause[]
  risks: RiskAssessment[]
  summary: string
  modelUsed: string
  processingTime: number
}

export interface Clause {
  text: string
  type: string
  importance: 'high' | 'medium' | 'low'
  pageNumber?: number
  lineNumber?: number
}

export interface RiskAssessment {
  level: 'high' | 'medium' | 'low'
  description: string
  clause?: string
  recommendation?: string
}

export interface QuestionAnsweringResult {
  question: string
  answer: string
  confidence: number
  sources: Array<{
    text: string
    pageNumber?: number
  }>
  modelUsed: string
  processingTime: number
}

export interface ProcessingOptions {
  maxSummaryLength?: number
  maxTokens?: number
  temperature?: number
  language?: string
  customPrompt?: string
}

// Base processor interface
export abstract class BaseAIProcessor {
  protected config: AIConfig
  protected provider: AIProvider

  constructor(config: AIConfig) {
    this.config = config
    this.provider = config.provider
  }

  // Abstract methods that must be implemented by each processor
  abstract summarize(text: string, options?: ProcessingOptions): Promise<SummarizationResult>
  abstract classify(text: string, options?: ProcessingOptions): Promise<ClassificationResult>
  abstract extractEntities(text: string, options?: ProcessingOptions): Promise<EntityExtractionResult>
  abstract analyzeClauses(text: string, options?: ProcessingOptions): Promise<ClauseAnalysisResult>
  abstract answerQuestion(question: string, text: string, options?: ProcessingOptions): Promise<QuestionAnsweringResult>

  // Common methods
  abstract isAvailable(): Promise<boolean>
  abstract getProviderName(): string

  // Utility method to estimate tokens
  protected estimateTokens(text: string): number {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4)
  }

  // Utility method to truncate text if needed
  protected truncateText(text: string, maxTokens: number): string {
    const maxChars = maxTokens * 4
    if (text.length <= maxChars) return text
    return text.substring(0, maxChars)
  }

  // Utility method to measure processing time
  protected measureTime<T>(fn: () => Promise<T>): Promise<T> & { time: number } {
    const start = Date.now()
    const result = fn() as Promise<T> & { time: number }
    result.time = Date.now() - start
    return result
  }
}

// Factory function type
export type ProcessorFactory = (config: AIConfig) => BaseAIProcessor

// Error classes
export class AIProcessingError extends Error {
  constructor(
    message: string,
    public provider: AIProvider,
    public code?: string,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'AIProcessingError'
  }
}

export class ProviderNotAvailableError extends AIProcessingError {
  constructor(provider: AIProvider) {
    super(
      `Provider ${provider} is not available`,
      provider,
      'PROVIDER_UNAVAILABLE'
    )
  }
}

export class RateLimitError extends AIProcessingError {
  constructor(provider: AIProvider, retryAfter?: number) {
    super(
      `Rate limit exceeded for provider ${provider}`,
      provider,
      'RATE_LIMIT',
      new Error(`Retry after ${retryAfter || 'unknown'} seconds`)
    )
    this.retryAfter = retryAfter
  }
  retryAfter?: number
}

// Abstract builder for processors
export abstract class AIProcessorBuilder {
  protected config: Partial<AIConfig> = {}

  setProvider(provider: AIProvider): this {
    this.config.provider = provider
    return this
  }

  setApiKey(apiKey: string): this {
    this.config.apiKey = apiKey
    return this
  }

  setModel(model: string): this {
    this.config.model = model
    return this
  }

  setTemperature(temperature: number): this {
    this.config.temperature = temperature
    return this
  }

  setMaxTokens(maxTokens: number): this {
    this.config.maxTokens = maxTokens
    return this
  }

  setUseCache(useCache: boolean): this {
    this.config.useCache = useCache
    return this
  }

  abstract build(): BaseAIProcessor
}

