#!/usr/bin/env node

/**
 * Comprehensive Test Script for Law Firm Application
 * Tests all the fixes and validates the codebase
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const RESET = '\x1b[0m'

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`)
}

function runCommand(command, description) {
  log(`\n${BLUE}Testing: ${description}${RESET}`)
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    log(`✅ ${description} - PASSED`, GREEN)
    return { success: true, output }
  } catch (error) {
    log(`❌ ${description} - FAILED`, RED)
    log(`Error: ${error.message}`, RED)
    return { success: false, error: error.message }
  }
}

function checkFileExists(filePath, description) {
  log(`\n${BLUE}Checking: ${description}${RESET}`)
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} - EXISTS`, GREEN)
    return true
  } else {
    log(`❌ ${description} - MISSING`, RED)
    return false
  }
}

function checkFileContent(filePath, searchString, description) {
  log(`\n${BLUE}Checking: ${description}${RESET}`)
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    if (content.includes(searchString)) {
      log(`✅ ${description} - FOUND`, GREEN)
      return true
    } else {
      log(`❌ ${description} - NOT FOUND`, RED)
      return false
    }
  } catch (error) {
    log(`❌ ${description} - ERROR: ${error.message}`, RED)
    return false
  }
}

async function main() {
  log('🚀 Starting Comprehensive Test Suite for Law Firm Application', BLUE)
  log('=' * 60, BLUE)

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  }

  function recordTest(name, success, details = '') {
    results.tests.push({ name, success, details })
    if (success) {
      results.passed++
    } else {
      results.failed++
    }
  }

  // Test 1: Environment Configuration
  log('\n📋 PHASE 1: Environment Configuration Tests', YELLOW)
  
  const envExists = checkFileExists('.env.local', 'Environment file exists')
  recordTest('Environment file exists', envExists)

  const envHasJWT = checkFileContent('.env.local', 'JWT_SECRET=', 'JWT_SECRET configured')
  recordTest('JWT_SECRET configured', envHasJWT)

  const envHasNextAuth = checkFileContent('.env.local', 'NEXTAUTH_SECRET=', 'NEXTAUTH_SECRET configured')
  recordTest('NEXTAUTH_SECRET configured', envHasNextAuth)

  // Test 2: Database Schema and Migrations
  log('\n🗄️  PHASE 2: Database Tests', YELLOW)
  
  const schemaExists = checkFileExists('prisma/schema.prisma', 'Prisma schema exists')
  recordTest('Prisma schema exists', schemaExists)

  const migrationsExist = checkFileExists('prisma/migrations', 'Database migrations exist')
  recordTest('Database migrations exist', migrationsExist)

  const generateResult = runCommand('npx prisma generate', 'Prisma client generation')
  recordTest('Prisma client generation', generateResult.success)

  // Test 3: TypeScript Compilation
  log('\n🔧 PHASE 3: TypeScript Compilation Tests', YELLOW)
  
  const tscResult = runCommand('npx tsc --noEmit', 'TypeScript compilation check')
  recordTest('TypeScript compilation', tscResult.success)

  // Test 4: Build Process
  log('\n🏗️  PHASE 4: Build Process Tests', YELLOW)
  
  const buildResult = runCommand('npm run build', 'Next.js build process')
  recordTest('Next.js build process', buildResult.success)

  // Test 5: Code Quality Checks
  log('\n✨ PHASE 5: Code Quality Tests', YELLOW)
  
  const lintResult = runCommand('npm run lint', 'ESLint checks')
  recordTest('ESLint checks', lintResult.success)

  // Test 6: Critical File Fixes
  log('\n🔍 PHASE 6: Critical File Fix Validation', YELLOW)
  
  const authFixed = checkFileContent('src/lib/auth.ts', 'throw new Error', 'JWT_SECRET validation fixed')
  recordTest('JWT_SECRET validation fixed', authFixed)

  const middlewareFixed = checkFileContent('src/middleware.ts', 'verifyToken', 'Middleware authentication added')
  recordTest('Middleware authentication added', middlewareFixed)

  const queueFixed = checkFileContent('src/lib/queue.ts', 'ocrQueue: Queue | null', 'Redis connection validation added')
  recordTest('Redis connection validation added', queueFixed)

  const consultationFixed = checkFileContent('src/app/api/consultation/route.ts', 'phoneRegex', 'Consultation validation improved')
  recordTest('Consultation validation improved', consultationFixed)

  const registerFixed = checkFileContent('src/app/api/auth/register/route.ts', 'min(12', 'Password validation strengthened')
  recordTest('Password validation strengthened', registerFixed)

  // Test 7: Database Indexes
  log('\n📊 PHASE 7: Database Index Validation', YELLOW)
  
  const indexesAdded = checkFileContent('prisma/schema.prisma', '@@index', 'Database indexes added')
  recordTest('Database indexes added', indexesAdded)

  const notificationFixed = checkFileContent('prisma/schema.prisma', 'case Case? @relation', 'Notification relation fixed')
  recordTest('Notification relation fixed', notificationFixed)

  // Test 8: Health Check Endpoint
  log('\n🏥 PHASE 8: Health Check Tests', YELLOW)
  
  const healthEndpointExists = checkFileExists('src/app/api/health/route.ts', 'Health check endpoint exists')
  recordTest('Health check endpoint exists', healthEndpointExists)

  // Test 9: Environment Validation
  log('\n🌍 PHASE 9: Environment Validation Tests', YELLOW)
  
  const envValidationExists = checkFileExists('src/lib/env-validation.ts', 'Environment validation utility exists')
  recordTest('Environment validation utility exists', envValidationExists)

  // Test 10: Import/Export Issues
  log('\n📦 PHASE 10: Import/Export Fix Validation', YELLOW)
  
  const authImportFixed = checkFileContent('src/lib/auth.ts', 'import { JWTPayload } from', 'Auth imports fixed')
  recordTest('Auth imports fixed', authImportFixed)

  const ocrImportFixed = !checkFileContent('src/lib/ocr-utils.ts', 'import PDFParse from', 'OCR PDF import issue resolved')
  recordTest('OCR PDF import issue resolved', ocrImportFixed)

  // Summary
  log('\n📊 TEST SUMMARY', BLUE)
  log('=' * 60, BLUE)
  log(`Total Tests: ${results.tests.length}`)
  log(`Passed: ${results.passed}`, GREEN)
  log(`Failed: ${results.failed}`, results.failed > 0 ? RED : GREEN)
  log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`)

  if (results.failed > 0) {
    log('\n❌ FAILED TESTS:', RED)
    results.tests
      .filter(test => !test.success)
      .forEach(test => log(`  - ${test.name}`, RED))
  }

  if (results.passed === results.tests.length) {
    log('\n🎉 ALL TESTS PASSED! The codebase is ready for production.', GREEN)
    process.exit(0)
  } else {
    log('\n⚠️  Some tests failed. Please review the issues above.', YELLOW)
    process.exit(1)
  }
}

main().catch(error => {
  log(`Fatal error: ${error.message}`, RED)
  process.exit(1)
})