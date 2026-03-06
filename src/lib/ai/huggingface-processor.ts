/**
 * Hugging Face Processor
 * Implementation of AI document processing using Hugging Face Inference API
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
  RiskAssessment
} from './base-ai-processor'
import type { AIConfig, HuggingFaceConfig } from './config'

interface Entity {
  text: string
  type: 'case_number' | 'party_name' | 'court_name' | 'date' | 'citation' | 'amount' | 'keyword'
  confidence: number
}

interface ClauseKeyword {
  keyword: string
  type: string
}

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

export class HuggingFaceProcessor extends BaseAIProcessor {
  private hfConfig: HuggingFaceConfig
  private apiBase = 'https://api-inference.huggingface.co/models'

  constructor(config: AIConfig) {
    super(config)
    this.hfConfig = {
      model: config.model || 'facebook/bart-large-cnn',
      task: 'summarization',
      waitForModel: true,
      useCache: config.useCache ?? true
    }
  }

  async isAvailable(): Promise<boolean> {
    if (!this.config.apiKey) return false
    try {
      const response = await fetch('https://huggingface.co/api/whoami', {
        headers: { Authorization: `Bearer ${this.config.apiKey}` }
      })
      return response.ok
    } catch {
      return false
    }
  }

  getProviderName(): string {
    return `Hugging Face (${this.hfConfig.model})`
  }

  async summarize(text: string, options?: ProcessingOptions): Promise<SummarizationResult> {
    const startTime = Date.now()
    
    try {
      if (!this.config.apiKey) {
        throw new ProviderNotAvailableError('huggingface')
      }

      // For summarization, we use a summarization model
      const model = this.hfConfig.model
      const response = await this.queryHuggingFace(model, {
        inputs: text.substring(0, 8000),
        parameters: {
          max_length: options?.maxTokens || 200,
          min_length: 50,
          do_sample: false
        }
      })

      const processingTime = Date.now() - startTime
      const summaryText = (Array.isArray(response) ? (response[0] as Record<string, unknown>)?.summary_text : (response as Record<string, unknown>)?.summary_text) as string || ''

      // Extract key points using a simple heuristic
      const { summary, keyPoints } = this.parseSummaryResponse(summaryText)

      return {
        summary,
        keyPoints,
        confidence: 0.85,
        modelUsed: model,
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Summarization failed',
        'huggingface',
        'SUMMARIZE_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async classify(text: string, options?: ProcessingOptions): Promise<ClassificationResult> {
    const startTime = Date.now()
    
    try {
      if (!this.config.apiKey) {
        throw new ProviderNotAvailableError('huggingface')
      }

      // Use zero-shot classification for document type
      const model = 'facebook/bart-large-mnli'
      const response = await this.queryHuggingFace(model, {
        inputs: text.substring(0, 2000),
        parameters: {
          candidate_labels: LEGAL_DOCUMENT_TYPES.join(', ')
        }
      })

      const processingTime = Date.now() - startTime
      const result = this.parseClassificationResponse(response)

      return {
        ...result,
        modelUsed: model,
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Classification failed',
        'huggingface',
        'CLASSIFY_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async extractEntities(text: string, options?: ProcessingOptions): Promise<EntityExtractionResult> {
    const startTime = Date.now()
    
    try {
      if (!this.config.apiKey) {
        throw new ProviderNotAvailableError('huggingface')
      }

      // Hugging Face doesn't have a good NER model for legal documents
      // Fall back to regex-based extraction similar to ocr-utils
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
        'Entity extraction failed',
        'huggingface',
        'ENTITY_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async analyzeClauses(text: string, options?: ProcessingOptions): Promise<ClauseAnalysisResult> {
    const startTime = Date.now()
    
    try {
      if (!this.config.apiKey) {
        throw new ProviderNotAvailableError('huggingface')
      }

      // Use QA model to extract clauses
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
        'Clause analysis failed',
        'huggingface',
        'CLAUSE_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  async answerQuestion(question: string, text: string, options?: ProcessingOptions): Promise<QuestionAnsweringResult> {
    const startTime = Date.now()
    
    try {
      if (!this.config.apiKey) {
        throw new ProviderNotAvailableError('huggingface')
      }

      // Use QA model
      const model = 'deepset/roberta-base-squad2'
      const response = await this.queryHuggingFace(model, {
        inputs: {
          question,
          context: text.substring(0, 4000)
        }
      })

      const processingTime = Date.now() - startTime
      const respObj = response as Record<string, unknown>
      const answer = Array.isArray(response) 
        ? ((response[0] as Record<string, unknown>)?.answer as string) 
        : (respObj?.answer as string) || ''

      return {
        question,
        answer: answer || 'Unable to find an answer in the document.',
        confidence: Array.isArray(response) 
          ? ((response[0] as Record<string, unknown>)?.score as number) ?? 0.5
          : (respObj?.score as number) ?? 0.5,
        sources: [{ text: answer }],
        modelUsed: model,
        processingTime
      }
    } catch (error) {
      if (error instanceof AIProcessingError) throw error
      throw new AIProcessingError(
        'Question answering failed',
        'huggingface',
        'QA_ERROR',
        error instanceof Error ? error : undefined
      )
    }
  }

  // Helper methods

  private async queryHuggingFace(model: string, inputs: Record<string, unknown>): Promise<unknown> {
    if (!this.config.apiKey) {
      throw new ProviderNotAvailableError('huggingface')
    }

    const response = await fetch(`${this.apiBase}/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...inputs,
        options: {
          wait_for_model: this.hfConfig.waitForModel,
          use_cache: this.hfConfig.useCache
        }
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new AIProcessingError(
        error.error || 'Hugging Face API error',
        'huggingface',
        'API_ERROR'
      )
    }

    return response.json()
  }

  private parseSummaryResponse(content: string): { summary: string; keyPoints: string[] } {
    const summary = content.trim()
    // Extract sentences as key points
    const keyPoints = summary
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20)
      .slice(0, 5)

    return { summary, keyPoints }
  }

  private parseClassificationResponse(response: unknown): Omit<ClassificationResult, 'modelUsed' | 'processingTime'> {
    try {
      const respObj = response as Record<string, unknown>
      const labels = (respObj?.labels as string[]) || (Array.isArray(response) ? (response[0] as Record<string, unknown>)?.labels : []) as string[] || []
      const scores = (respObj?.scores as number[]) || (Array.isArray(response) ? (response[0] as Record<string, unknown>)?.scores : []) as number[] || []

      if (labels.length > 0) {
        return {
          documentType: labels[0],
          category: 'Legal',
          confidence: scores[0] || 0.7,
          alternativeClassifications: labels.slice(1, 4).map((label: string, i: number) => ({
            type: label,
            confidence: scores[i + 1] ?? 0.5
          }))
        }
      }
    } catch {
      // Fall back to default
    }

    return {
      documentType: 'Other',
      category: 'Legal',
      confidence: 0.5,
      alternativeClassifications: []
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

    // Extract case numbers
    for (const pattern of caseNumberPatterns) {
      let match
      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'case_number',
          confidence: 0.9
        })
      }
    }

    // Extract party names
    for (const pattern of partyPatterns) {
      let match
      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'party_name',
          confidence: 0.85
        })
      }
    }

    // Extract court names
    for (const pattern of courtPatterns) {
      let match
      while ((match = pattern.exec(text)) !== null) {
        entities.push({
          text: match[0],
          type: 'court_name',
          confidence: 0.9
        })
      }
    }

    // Extract dates
    for (const pattern of datePatterns) {
      let match
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
    const clauseKeywords: ClauseKeyword[] = [
      { keyword: 'liability', type: 'Liability' },
      { keyword: 'penalty', type: 'Penalty' },
      { keyword: 'warranty', type: 'Warranty' },
      { keyword: 'indemnity', type: 'Indemnity' },
      { keyword: 'termination', type: 'Termination' },
      { keyword: 'confidentiality', type: 'Confidentiality' },
      { keyword: 'governing law', type: 'Governing Law' },
      { keyword: 'jurisdiction', type: 'Jurisdiction' },
      { keyword: 'force majeure', type: 'Force Majeure' },
      { keyword: 'severability', type: 'Severability' }
    ]

    const sentences = text.replace(/\r/g, '').split(/\n|(?<=\.|\?|!)/).map(l => l.trim()).filter(Boolean)

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase()
      for (const { keyword, type } of clauseKeywords) {
        if (lower.includes(keyword)) {
          clauses.push({
            text: sentence,
            type,
            importance: this.determineImportance(type),
            pageNumber: undefined,
            lineNumber: undefined
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

      if (clause.type === 'Termination') {
        if (lower.includes('immediate') || lower.includes('without notice')) {
          risks.push({
            level: 'high',
            description: 'Termination without notice period',
            clause: clause.text.substring(0, 100),
            recommendation: 'Negotiate a reasonable notice period'
          })
        }
      }
    }

    return risks
  }

  private generateClauseSummary(clauses: Clause[], risks: RiskAssessment[]): string {
    const clauseCount = clauses.length
    const highRiskCount = risks.filter((r: RiskAssessment) => r.level === 'high').length
    const mediumRiskCount = risks.filter((r: RiskAssessment) => r.level === 'medium').length

    return `Found ${clauseCount} significant clauses, including ${highRiskCount} high-risk and ${mediumRiskCount} medium-risk provisions.`
  }

  private parseQuestionAnsweringResponse(response: unknown, question: string): Omit<QuestionAnsweringResult, 'modelUsed' | 'processingTime'> {
    const respObj = response as Record<string, unknown>
    return {
      question,
      answer: (respObj?.answer as string) || '',
      confidence: (respObj?.score as number) ?? 0.5,
      sources: [{ text: (respObj?.answer as string) || '' }]
    }
  }
}

// Builder for Hugging Face processor
export class HuggingFaceProcessorBuilder extends AIProcessorBuilder {
  build(): HuggingFaceProcessor {
    return new HuggingFaceProcessor({
      provider: 'huggingface',
      ...this.config
    } as AIConfig)
  }
}

