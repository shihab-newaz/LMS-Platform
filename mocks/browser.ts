import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)

// Export a start function consumers can call
export async function startWorker() {
  if (typeof window === 'undefined') return
  await worker.start({ quiet: true })
}
