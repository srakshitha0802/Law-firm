# Host Change and Error Fix Plan

## Issues Found (40 TypeScript errors)

### 1. Prisma Client Issues (summary, folder fields)
- **Files**: `src/app/api/documents/route.ts`, `src/lib/ocr-worker.ts`
- **Solution**: Regenerate Prisma client

### 2. Duplicate Function Implementations
- **File**: `src/lib/ocr-utils.ts`
- **Functions**: `generateTags`, `processBatchUpload`
- **Solution**: Merge duplicate functions

### 3. BullMQ API Changes
- **File**: `src/lib/ocr-queue-worker.ts`
- **Issue**: `QueueScheduler` is no longer exported from bullmq
- **Solution**: Remove QueueScheduler import

### 4. Missing Dependencies
- **File**: `src/lib/ocr-utils.ts`
- **Issue**: `pdf-parse` module not found
- **Solution**: Install @types/pdf-parse

### 5. Type Safety Issues
- **Files**: `src/components/ui/AILegalAssistant.tsx`, `src/components/ui/DocumentManager.tsx`, AI processors
- **Solution**: Add proper type annotations and fix type issues

## Execution Plan

### Step 1: Regenerate Prisma Client
```bash
npx prisma generate
```

### Step 2: Install Missing Types
```bash
npm install --save-dev @types/pdf-parse
```

### Step 3: Fix Duplicate Functions in ocr-utils.ts
- Merge `generateTags` functions (lines 290 and 524)
- Merge `processBatchUpload` functions (lines 307 and 586)

### Step 4: Fix BullMQ QueueScheduler
- Remove QueueScheduler from imports in ocr-queue-worker.ts

### Step 5: Fix Type Issues
- Add type assertions for Message type in AILegalAssistant
- Fix DocumentManager type issues
- Add proper response typing for AI processors

### Step 6: Test Build
```bash
npm run build
```

