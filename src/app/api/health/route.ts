import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateEnvironment } from '@/lib/env-validation'

export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, { status: 'ok' | 'error'; message?: string; responseTime?: number }> = {}

  // Check database connection
  try {
    const dbStart = Date.now()
    await prisma.$queryRaw`SELECT 1`
    checks.database = {
      status: 'ok',
      responseTime: Date.now() - dbStart
    }
  } catch (error) {
    checks.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed'
    }
  }

  // Check environment configuration
  const envValidation = validateEnvironment()
  checks.environment = {
    status: envValidation.valid ? 'ok' : 'error',
    message: envValidation.valid ? undefined : `${envValidation.errors.length} errors, ${envValidation.warnings.length} warnings`
  }

  // Check Redis connection (if configured)
  if (process.env.REDIS_HOST) {
    try {
      const { ocrQueue } = await import('@/lib/queue')
      if (ocrQueue) {
        checks.redis = { status: 'ok' }
      } else {
        checks.redis = { status: 'error', message: 'Queue not initialized' }
      }
    } catch (error) {
      checks.redis = {
        status: 'error',
        message: error instanceof Error ? error.message : 'Redis connection failed'
      }
    }
  }

  // Check AI provider availability (if configured)
  if (process.env.AI_PROVIDER && process.env.AI_PROVIDER !== 'local') {
    try {
      const { checkProviderAvailability } = await import('@/lib/ai/config')
      const apiKey = process.env.OPENAI_API_KEY || process.env.HF_TOKEN
      const isAvailable = await checkProviderAvailability(process.env.AI_PROVIDER as any, apiKey)
      
      checks.ai_provider = {
        status: isAvailable ? 'ok' : 'error',
        message: isAvailable ? undefined : `${process.env.AI_PROVIDER} provider not available`
      }
    } catch (error) {
      checks.ai_provider = {
        status: 'error',
        message: error instanceof Error ? error.message : 'AI provider check failed'
      }
    }
  }

  const totalResponseTime = Date.now() - startTime
  const allHealthy = Object.values(checks).every(check => check.status === 'ok')

  const response = {
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    responseTime: totalResponseTime,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    checks
  }

  return NextResponse.json(response, {
    status: allHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}