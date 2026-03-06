import { Queue } from 'bullmq'

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
}

export const ocrQueue = new Queue('ocr', { connection })

export async function addOCRJob(documentId: string, filePath: string, mimeType: string) {
  return ocrQueue.add('process-ocr', { documentId, filePath, mimeType }, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 }
  })
}

export default { addOCRJob }
