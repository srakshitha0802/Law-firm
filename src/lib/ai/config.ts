/**
 * AI Document Processing Configuration
 * 
 * Manages configuration for different AI providers:
 * - OpenAI (GPT-4, GPT-3.5)
 * - Hugging Face Inference API
 * - Local transformers.js
 */

export type AIProvider = 'openai' | 'huggingface' | 'local' | 'auto'

export interface AIConfig {
  provider: AIProvider
  apiKey?: string
  model?: string
  temperature?: number
  maxTokens?: number
  useCache?: boolean
  fallbackProvider?: AIProvider
}

export interface OpenAIConfig {
  model: string
  temperature: number
  maxTokens: number
}

export interface HuggingFaceConfig {
  model: string
  task: string
  waitForModel?: boolean
  useCache?: boolean
}

export interface LocalConfig {
  modelId: string
  quantized: boolean
  device: 'cpu' | 'gpu'
  progressCallback?: (progress: number, status: string) => void
}

// Default configurations
export const DEFAULT_OPENAI_CONFIG: OpenAIConfig = {
  model: 'gpt-4-turbo-preview',
  temperature: 0.3,
  maxTokens: 2000
}

export const DEFAULT_HUGGINGFACE_CONFIG: HuggingFaceConfig = {
  model: 'facebook/bart-large-cnn',
  task: 'summarization',
  waitForModel: true,
  useCache: true
}

export const DEFAULT_LOCAL_CONFIG: LocalConfig = {
  modelId: 'Xenova/distilbart-cnn-12-6',
  quantized: true,
  device: 'cpu'
}

// Configuration validation
export function validateAIConfig(config: AIConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!['openai', 'huggingface', 'local', 'auto'].includes(config.provider)) {
    errors.push('Invalid AI provider')
  }
  
  if (config.provider !== 'local' && !config.apiKey) {
    errors.push(`API key required for ${config.provider} provider`)
  }
  
  if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 1)) {
    errors.push('Temperature must be between 0 and 1')
  }
  
  if (config.maxTokens !== undefined && config.maxTokens < 1) {
    errors.push('Max tokens must be greater than 0')
  }
  
  return { valid: errors.length === 0, errors }
}

// Get configuration from environment variables
export function getAIConfigFromEnv(): AIConfig {
  const provider = (process.env.AI_PROVIDER as AIProvider) || 'auto'
  const apiKey = process.env.OPENAI_API_KEY || process.env.HF_TOKEN
  
  return {
    provider,
    apiKey,
    model: process.env.AI_MODEL,
    temperature: process.env.AI_TEMPERATURE ? parseFloat(process.env.AI_TEMPERATURE) : 0.3,
    maxTokens: process.env.AI_MAX_TOKENS ? parseInt(process.env.AI_MAX_TOKENS) : 2000,
    useCache: process.env.AI_USE_CACHE !== 'false',
    fallbackProvider: provider === 'auto' ? 'local' : undefined
  }
}

// Get provider display name
export function getProviderDisplayName(provider: AIProvider): string {
  const names: Record<AIProvider, string> = {
    openai: 'OpenAI',
    huggingface: 'Hugging Face',
    local: 'Local (Offline)',
    auto: 'Auto-detect'
  }
  return names[provider] || 'Unknown'
}

// Check if provider is available
export async function checkProviderAvailability(provider: AIProvider, apiKey?: string): Promise<boolean> {
  const timeout = 5000 // 5 second timeout
  
  switch (provider) {
    case 'openai':
      if (!apiKey) return false
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        return response.ok
      } catch (error) {
        console.warn('OpenAI availability check failed:', error)
        return false
      }
    case 'huggingface':
      if (!apiKey) return false
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        const response = await fetch('https://huggingface.co/api/whoami', {
          headers: { Authorization: `Bearer ${apiKey}` },
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        return response.ok
      } catch (error) {
        console.warn('Hugging Face availability check failed:', error)
        return false
      }
    case 'local':
      // Local is always available if transformers.js is loaded
      return true
    default:
      return false
  }
}

// Select best available provider
export async function selectBestProvider(
  preferredProvider: AIProvider,
  apiKey?: string
): Promise<AIProvider> {
  if (preferredProvider !== 'auto') {
    const isAvailable = await checkProviderAvailability(preferredProvider, apiKey)
    if (isAvailable) return preferredProvider
  }
  
  // Try API providers first
  if (apiKey) {
    if (await checkProviderAvailability('openai', apiKey)) return 'openai'
    if (await checkProviderAvailability('huggingface', apiKey)) return 'huggingface'
  }
  
  // Fall back to local
  return 'local'
}

