/**
 * Local Processor
 * Implementation of AI document processing using transformers.js (runs locally/offline)
 * Uses @xenova/transformers library for running models in the browser or Node.js
 */

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
  AIProcessorBuilder,
  Clause,
  RiskAssessment,
  Entity
} from './base-ai-processor'
import type { AIConfig, LocalConfig } from './config'

// Type for transformers.js pipeline
type PipelineFunction = (input: string | { question: string; context: string }, options?: Record<string, unknown>) => Promise<unknown>

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

export class LocalProcessor extends BaseAIProcessor {
  private localConfig: LocalConfig
  private pipeline: PipelineFunction | null = null
  private classifierPipeline: PipelineFunction | null = null
  private qaPipeline: PipelineFunction | null = null
  private isLoading = false
  private loadPromise: Promise<void> | null = null

  constructor(config: AIConfig) {
    super(config)
    this.localConfig = {
      modelId: config.model || 'Xenova/distilbart-cnn-12-6',
      quantized: true,
      device: 'cpu'
    }
  }

  async isAvailable(): Promise<boolean> {
    // Check if transformers.js is available
    try {
      await import('@xenova/transformers')
      return true
    } catch {
      return false
    }
  }

  getProviderName(): string {
    return `Local (${this.localConfig.modelId})`
  }

  async initialize(): Promise<void> {
    if (this.pipeline && this.classifierPipeline && this.qaPipeline) {
      return
    }

    if (this.isLoading && this.loadPromise) {
      return this.loadPromise
    }

    this.isLoading = true
    this.loadPromise = this.loadModels()
    return this.loadPromise
  }

  private async loadModels(): Promise<void> {
    try {
      const { pipeline } = await import('@xenova/transformers')
      
      // Configure environment
      // env.useBrowserCache = true
      // env.allowLocalModels = false

      // Load summarization pipeline
      this.pipeline = await pipeline('summarization', this.localConfig.modelId, {
        progress_callback: this.localConfig.progressCallback
      }) as PipelineFunction

      // Load text classification pipeline
      this.classifierPipeline = await pipeline('text-classification', 'Xenova/distilbert-base-uncased-finetuned-mnli', {
        progress_callback: this.localConfig.progressCallback
      }) as PipelineFunction

      // Load question answering pipeline
      this.qaPipeline = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad', {
        progress_callback: this.localConfig.progressCallback
      }) as unknown as PipelineFunction
    } catch (error) {
      throw new AIProcessingError(
        'Failed to load local models',
        'local',
        'MODEL_LOAD_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async summarize(text: string, options?: ProcessingOptions): Promise<SummarizationResult> {
    const startTime = Date.now()
    
    try {
      await this.initialize()

      if (!this.pipeline) {
        throw new ProviderNotAvailableError('local')
      }

      // Truncate text to fit model limits
      const maxLength = 1024
      const truncatedText = text.substring(0, maxLength * 4)

      const result = await this.pipeline(truncatedText, {
        max_length: options?.maxTokens || 130,
        min_length: 30,
        do_sample: false
      })

      const processingTime = Date.now() - startTime
      const respObj = result as Record<string, unknown>
      const summaryText = Array.isArray(result) 
        ? ((result[0] as Record<string, unknown>)?.summary_text as string)
        : (respObj?.summary_text as string) || ''

      // Extract key points using simple sentence splitting
      const keyPoints = summaryText
        .split(/[.!?]+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 20)
        .slice(0, 5)

      return {
        summary: summaryText,
        keyPoints,
        confidence: 0.8,
        modelUsed: this.localConfig.modelId,
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Local summarization failed',
        'local',
        'SUMMARIZE_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async classify(text: string, options?: ProcessingOptions): Promise<ClassificationResult> {
    const startTime = Date.now()
    
    try {
      await this.initialize()

      if (!this.classifierPipeline) {
        throw new ProviderNotAvailableError('local')
      }

      // For zero-shot classification, we use a simpler approach
      // since local models don't support it well
      const truncatedText = text.substring(0, 500)
      
      // Use keyword-based classification as fallback
      const classification = this.keywordBasedClassification(truncatedText)
      const processingTime = Date.now() - startTime

      return {
        ...classification,
        modelUsed: 'keyword-based',
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Local classification failed',
        'local',
        'CLASSIFY_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async extractEntities(text: string, options?: ProcessingOptions): Promise<EntityExtractionResult> {
    const startTime = Date.now()
    
    try {
      // Local processor uses regex-based entity extraction
      const entities = this.extractLegalEntities(text)
      const processingTime = Date.now() - startTime

      return {
        entities,
        modelUsed: 'regex-based',
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Local entity extraction failed',
        'local',
        'ENTITY_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async analyzeClauses(text: string, options?: ProcessingOptions): Promise<ClauseAnalysisResult> {
    const startTime = Date.now()
    
    try {
      const clauses = this.extractClauses(text)
      const risks = this.assessRisks(clauses)
      const processingTime = Date.now() - startTime

      return {
        clauses,
        risks,
        summary: this.generateClauseSummary(clauses, risks),
        modelUsed: 'rule-based',
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Local clause analysis failed',
        'local',
        'CLAUSE_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async answerQuestion(question: string, text: string, options?: ProcessingOptions): Promise<QuestionAnsweringResult> {
    const startTime = Date.now()
    
    try {
      await this.initialize()

      if (!this.qaPipeline) {
        throw new ProviderNotAvailableError('local')
      }

      // Truncate text for QA model
      const truncatedContext = text.substring(0, 2000)

      const result = await this.qaPipeline({ question, context: truncatedContext } as { question: string; context: string })
      const processingTime = Date.now() - startTime

      const respObj = result as Record<string, unknown>
      const answer = Array.isArray(result) 
        ? ((result[0] as Record<string, unknown>)?.answer as string)
        : (respObj?.answer as string) || ''

      return {
        question,
        answer: answer || 'Unable to find an answer in the document.',
        confidence: Array.isArray(result) 
          ? ((result[0] as Record<string, unknown>)?.score as number) ?? 0.5
          : (respObj?.score as number) ?? 0.5,
        sources: [{ text: answer }],
        modelUsed: 'distilbert-base-uncased-distilled-squad',
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Local question answering failed',
        'local',
        'QA_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  // Helper methods

  private keywordBasedClassification(text: string): Omit<ClassificationResult, 'modelUsed' | 'processingTime'> {
    const lowerText = text.toLowerCase()
    const scores: Record<string, number> = {}

    const keywords: Record<string, string[]> = {
      'Petition': ['petition', 'writ petition', 'special leave petition', 'slp', 'wp'],
      'Affidavit': ['affidavit', 'sworn statement', 'declared on oath'],
      'Judgment': ['judgment', 'judgment dated', 'order dated', 'final order'],
      'Order': ['ordered that', 'it is hereby ordered', 'court order'],
      'Contract': ['agreement', 'contract', 'terms and conditions', 'parties hereby agree'],
      'Correspondence': ['letter', 'communication', 'notice', 'circular'],
      'Evidence': ['exhibit', 'marked as', 'documentary evidence'],
      'Invoice': ['invoice', 'bill', 'tax invoice'],
      'Power of Attorney': ['power of attorney', 'poa', 'authorisation'],
      'Notice': ['notice', 'notice is hereby given', 'take notice'],
      'Filing': ['filed', 'filing', 'register', 'diary number']
    }

    for (const [docType, typeKeywords] of Object.entries(keywords)) {
      scores[docType] = 0
      for (const keyword of typeKeywords) {
        if (lowerText.includes(keyword)) {
          scores[docType]++
        }
      }
    }

    // Find best match
    let bestType = 'Other'
    let bestScore = 0

    for (const [docType, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score
        bestType = docType
      }
    }

    // Generate alternatives
    const alternatives = Object.entries(scores)
      .filter(([type]) => type !== bestType && scores[type] > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type, score]) => ({
        type,
        confidence: Math.min(score / 5, 0.9)
      }))

    return {
      documentType: bestType,
      category: 'Legal',
      confidence: Math.min(bestScore / 3, 0.95),
      alternativeClassifications: alternatives
    }
  }

  private extractLegalEntities(text: string): Entity[] {
    const entities: Entity[] = []

    // Case number patterns
    const caseNumberPatterns = [
      /\b(Case\s*No\.?|Criminal\s*No\.?|Civil\s*No\.?)\s*[:]?\s*([A-Z0-9\/\-\.]+)/gi,
      /\b(\d{4}\/[A-Z0-9\/\-]+)/g
    ]

    // Party name patterns
    const partyPatterns = [
      /\b(Appellant|Applicant|Petitioner|Plaintiff|Accused|Respondent|Defendant|Complainant)\s*[:]?\s*([A-Za-z\s\.]+)/gi
    ]

    // Court name patterns
    const courtPatterns = [
      /\b(Supreme\s*Court|High\s*Court|District\s*Court|Civil\s*Court|Criminal\s*Court)\s*(of\s*[A-Za-z\s,]+)?/gi
    ]

    // Date patterns
    const datePatterns = [
      /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/g,
      /\b(\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s*,?\s*\d{4})/gi
    ]

    // Extract entities
    for (const pattern of caseNumberPatterns) {
      let match: RegExpExecArray | null
      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'case_number',
          confidence: 0.9
        })
      }
    }

    for (const pattern of partyPatterns) {
      let match: RegExpExecArray | null
      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'party_name',
          confidence: 0.85
        })
      }
    }

    for (const pattern of courtPatterns) {
      let match: RegExpExecArray | null
      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'court_name',
          confidence: 0.9
        })
      }
    }

    for (const pattern of datePatterns) {
      let match: RegExpExecArray | null
      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'date',
          confidence: 0.9
        })
      }
    }

    return entities
  }

  private extractClauses(text: string): Clause[] {
    const clauses: Clause[] = []
    const clauseKeywords = [
      { keyword: 'liability', type: 'Liability' },
      { keyword: 'penalty', type: 'Penalty' },
      { keyword: 'warranty', type: 'Warranty' },
      { keyword: 'indemnity', type: 'Indemnity' },
      { keyword: 'termination', type: 'Termination' },
      { keyword: 'confidentiality', type: 'Confidentiality' },
      { keyword: 'governing law', type: 'Governing Law' },
      { keyword: 'jurisdiction', type: 'Jurisdiction' }
    ]

    const sentences = text.replace(/\r/g, '').split(/\n|(?<=\.|\?|!)/).map(l => l.trim()).filter(Boolean)

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase()
      for (const { keyword, type } of clauseKeywords) {
        if (lower.includes(keyword)) {
          clauses.push({
            text: sentence,
            type,
            importance: this.determineImportance(type)
          })
          break
        }
      }
    }

    return clauses
  }

  private determineImportance(type: string): 'high' | 'medium' | 'low' {
    const highImportance = ['Liability', 'Penalty', 'Indemnity', 'Termination']
    const mediumImportance = ['Warranty', 'Confidentiality', 'Governing Law']

    if (highImportance.includes(type)) return 'high'
    if (mediumImportance.includes(type)) return 'medium'
    return 'low'
  }

  private assessRisks(clauses: Clause[]): RiskAssessment[] {
    const risks: RiskAssessment[] = []

    for (const clause of clauses) {
      const lower = clause.text.toLowerCase()

      if (clause.type === 'Liability' && lower.includes('unlimited')) {
        risks.push({
          level: 'high',
          description: 'Unlimited liability clause detected',
          clause: clause.text.substring(0, 100),
          recommendation: 'Consider negotiating a cap on liability'
        })
      }

      if (clause.type === 'Indemnity' && lower.includes('hold harmless')) {
        risks.push({
          level: 'medium',
          description: 'Hold harmless clause with broad indemnification',
          clause: clause.text.substring(0, 100),
          recommendation: 'Review scope of indemnification obligations'
        })
      }

      if (clause.type === 'Termination' && (lower.includes('immediate') || lower.includes('without notice'))) {
        risks.push({
          level: 'high',
          description: 'Termination without notice period',
          clause: clause.text.substring(0, 100),
          recommendation: 'Negotiate a reasonable notice period'
        })
      }
    }

    return risks
  }

  private generateClauseSummary(clauses: Clause[], risks: RiskAssessment[]): string {
    const clauseCount = clauses.length
    const highRiskCount = risks.filter(r => r.level === 'high').length
    const mediumRiskCount = risks.filter(r => r.level === 'medium').length

    return `Found ${clauseCount} significant clauses, including ${highRiskCount} high-risk and ${mediumRiskCount} medium-risk provisions.`
  }
}

// Builder for Local processor
export class LocalProcessorBuilder extends AIProcessorBuilder {
  build(): LocalProcessor {
    return new LocalProcessor({
      provider: 'local',
      ...this.config
    } as AIConfig)
  }
}

