/**
 * AI Document Processing Module
 * Factory and entry point for all AI processors
 * Supports OpenAI, Hugging Face API, and Local transformers.js
 */

import {
  getAIConfigFromEnv,
  validateAIConfig,
  selectBestProvider,
  getProviderDisplayName,
  type AIProvider,
  type AIConfig
} from './config'
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
  RateLimitError,
  AIProcessorBuilder
} from './base-ai-processor'

// Import processors
import { OpenAIProcessor, OpenAIProcessorBuilder } from './openai-processor'
import { HuggingFaceProcessor, HuggingFaceProcessorBuilder } from './huggingface-processor'
import { LocalProcessor, LocalProcessorBuilder } from './local-processor'

// Re-export types
export type {
  SummarizationResult,
  ClassificationResult,
  EntityExtractionResult,
  ClauseAnalysisResult,
  QuestionAnsweringResult,
  ProcessingOptions
}
export { AIProcessingError, ProviderNotAvailableError, RateLimitError }

// Cache for processors
const processorCache: Map<string, BaseAIProcessor> = new Map()

/**
 * Create an AI processor based on configuration
 */
export async function createAIProcessor(config?: Partial<AIConfig>): Promise<BaseAIProcessor> {
  const fullConfig: AIConfig = {
    ...getAIConfigFromEnv(),
    ...config
  }

  // Validate config
  const validation = validateAIConfig(fullConfig)
  if (!validation.valid) {
    throw new AIProcessingError(
      `Invalid AI config: ${validation.errors.join(', ')}`,
      fullConfig.provider,
      'INVALID_CONFIG'
    )
  }

  // Auto-select best provider if needed
  if (fullConfig.provider === 'auto') {
    const bestProvider = await selectBestProvider(fullConfig.provider, fullConfig.apiKey)
    fullConfig.provider = bestProvider
  }

  // Check cache
  const cacheKey = `${fullConfig.provider}-${fullConfig.model || 'default'}`
  if (processorCache.has(cacheKey)) {
    return processorCache.get(cacheKey)!
  }

  // Create processor based on provider
  let processor: BaseAIProcessor

  switch (fullConfig.provider) {
    case 'openai':
      processor = new OpenAIProcessor(fullConfig)
      break
    case 'huggingface':
      processor = new HuggingFaceProcessor(fullConfig)
      break
    case 'local':
      processor = new LocalProcessor(fullConfig)
      break
    default:
      throw new AIProcessingError(
        `Unknown provider: ${fullConfig.provider}`,
        fullConfig.provider,
        'UNKNOWN_PROVIDER'
      )
  }

  // Check availability
  const isAvailable = await processor.isAvailable()
  if (!isAvailable) {
    // Try fallback
    if (fullConfig.provider !== 'local') {
      console.warn(`Provider ${fullConfig.provider} not available, falling back to local`)
      const localConfig = { ...fullConfig, provider: 'local' as AIProvider }
      processor = new LocalProcessor(localConfig)
    } else {
      throw new ProviderNotAvailableError(fullConfig.provider)
    }
  }

  // Cache the processor
  processorCache.set(cacheKey, processor)

  return processor
}

/**
 * Convenience function for summarization
 */
export async function summarizeDocument(
  text: string,
  options?: ProcessingOptions,
  config?: Partial<AIConfig>
): Promise<SummarizationResult> {
  const processor = await createAIProcessor(config)
  return processor.summarize(text, options)
}

/**
 * Convenience function for document classification
 */
export async function classifyDocument(
  text: string,
  options?: ProcessingOptions,
  config?: Partial<AIConfig>
): Promise<ClassificationResult> {
  const processor = await createAIProcessor(config)
  return processor.classify(text, options)
}

/**
 * Convenience function for entity extraction
 */
export async function extractEntities(
  text: string,
  options?: ProcessingOptions,
  config?: Partial<AIConfig>
): Promise<EntityExtractionResult> {
  const processor = await createAIProcessor(config)
  return processor.extractEntities(text, options)
}

/**
 * Convenience function for clause analysis
 */
export async function analyzeClauses(
  text: string,
  options?: ProcessingOptions,
  config?: Partial<AIConfig>
): Promise<ClauseAnalysisResult> {
  const processor = await createAIProcessor(config)
  return processor.analyzeClauses(text, options)
}

/**
 * Convenience function for question answering
 */
export async function answerQuestion(
  question: string,
  text: string,
  options?: ProcessingOptions,
  config?: Partial<AIConfig>
): Promise<QuestionAnsweringResult> {
  const processor = await createAIProcessor(config)
  return processor.answerQuestion(question, text, options)
}

/**
 * Process a document with all AI features
 */
export async function processDocument(
  text: string,
  options?: ProcessingOptions,
  config?: Partial<AIConfig>
): Promise<{
  summary: SummarizationResult
  classification: ClassificationResult
  entities: EntityExtractionResult
  clauses: ClauseAnalysisResult
}> {
  const processor = await createAIProcessor(config)

  // Run all operations in parallel
  const [summary, classification, entities, clauses] = await Promise.all([
    processor.summarize(text, options),
    processor.classify(text, options),
    processor.extractEntities(text, options),
    processor.analyzeClauses(text, options)
  ])

  return { summary, classification, entities, clauses }
}

/**
 * Get available providers
 */
export async function getAvailableProviders(apiKey?: string): Promise<AIProvider[]> {
  const providers: AIProvider[] = []

  // Check local
  try {
    const { LocalProcessor } = await import('./local-processor')
    const local = new LocalProcessor({ provider: 'local' })
    if (await local.isAvailable()) {
      providers.push('local')
    }
  } catch {
    // transformers.js not available
  }

  // Check OpenAI
  if (apiKey || process.env.OPENAI_API_KEY) {
    try {
      const { OpenAIProcessor } = await import('./openai-processor')
      const openai = new OpenAIProcessor({ provider: 'openai', apiKey: apiKey || process.env.OPENAI_API_KEY })
      if (await openai.isAvailable()) {
        providers.push('openai')
      }
    } catch {
      // OpenAI not available
    }
  }

  // Check Hugging Face
  if (apiKey || process.env.HF_TOKEN) {
    try {
      const { HuggingFaceProcessor } = await import('./huggingface-processor')
      const hf = new HuggingFaceProcessor({ provider: 'huggingface', apiKey: apiKey || process.env.HF_TOKEN })
      if (await hf.isAvailable()) {
        providers.push('huggingface')
      }
    } catch {
      // Hugging Face not available
    }
  }

  return providers
}

/**
 * Clear the processor cache
 */
export function clearProcessorCache(): void {
  processorCache.clear()
}

// Processor builders
export { OpenAIProcessorBuilder, HuggingFaceProcessorBuilder, LocalProcessorBuilder }

