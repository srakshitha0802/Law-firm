import { Worker } from 'bullmq'
import path from 'path'
import { processFileForOCR } from './ocr-worker'

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
}

const worker = new Worker('ocr', async job => {
  const { documentId, filePath, mimeType } = job.data
  console.log('Processing OCR job for', documentId)
  await processFileForOCR(documentId, filePath, mimeType)
  return { success: true }
}, { connection })

worker.on('completed', job => {
  console.log('Job completed', job.id)
})

worker.on('failed', (job, err) => {
  console.error('Job failed', job?.id, err)
})

console.log('OCR queue worker started')
