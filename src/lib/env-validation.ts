/**
 * Environment Variable Validation
 * Validates that all required environment variables are set on startup
 */

interface EnvConfig {
  required: string[]
  optional: string[]
}

const ENV_CONFIG: EnvConfig = {
  required: [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ],
  optional: [
    'OPENAI_API_KEY',
    'HF_TOKEN',
    'REDIS_HOST',
    'REDIS_PORT',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'AI_PROVIDER',
    'AI_MODEL',
    'TESSERACT_PATH',
    'UPLOAD_DIR',
    'MAX_FILE_SIZE'
  ]
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  missing: string[]
}

export function validateEnvironment(): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const missing: string[] = []

  // Check required variables
  for (const envVar of ENV_CONFIG.required) {
    const value = process.env[envVar]
    if (!value || value.trim() === '') {
      errors.push(`Required environment variable ${envVar} is not set`)
      missing.push(envVar)
    }
  }

  // Check optional variables and warn if missing
  for (const envVar of ENV_CONFIG.optional) {
    const value = process.env[envVar]
    if (!value || value.trim() === '') {
      warnings.push(`Optional environment variable ${envVar} is not set`)
    }
  }

  // Validate specific formats
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET should be at least 32 characters long for security')
  }

  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.length < 32) {
    errors.push('NEXTAUTH_SECRET should be at least 32 characters long for security')
  }

  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('fallback')) {
    warnings.push('DATABASE_URL appears to be using a fallback value')
  }

  // Check AI configuration
  const aiProvider = process.env.AI_PROVIDER
  if (aiProvider === 'openai' && !process.env.OPENAI_API_KEY) {
    warnings.push('AI_PROVIDER is set to openai but OPENAI_API_KEY is not configured')
  }

  if (aiProvider === 'huggingface' && !process.env.HF_TOKEN) {
    warnings.push('AI_PROVIDER is set to huggingface but HF_TOKEN is not configured')
  }

  // Check Redis configuration for queue processing
  if (process.env.REDIS_HOST && !process.env.REDIS_PORT) {
    warnings.push('REDIS_HOST is set but REDIS_PORT is not specified')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    missing
  }
}

export function logValidationResults(result: ValidationResult): void {
  if (result.valid) {
    console.log('✅ Environment validation passed')
  } else {
    console.error('❌ Environment validation failed')
    result.errors.forEach(error => console.error(`  ERROR: ${error}`))
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  Environment warnings:')
    result.warnings.forEach(warning => console.warn(`  WARNING: ${warning}`))
  }
}

export function throwOnValidationFailure(result: ValidationResult): void {
  if (!result.valid) {
    throw new Error(`Environment validation failed:\n${result.errors.join('\n')}`)
  }
}

// Auto-validate on import in development
if (process.env.NODE_ENV === 'development') {
  const result = validateEnvironment()
  logValidationResults(result)
  
  // Don't throw in development, just warn
  if (!result.valid) {
    console.error('⚠️  Some required environment variables are missing. The application may not work correctly.')
  }
}