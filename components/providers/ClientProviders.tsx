'use client'

import React, { useEffect, PropsWithChildren } from 'react'

export default function ClientProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    // Only start MSW in development
    if (process.env.NODE_ENV === 'development') {
      // Dynamically import to avoid including MSW in production bundles
      import('../../mocks/browser')
        .then(({ startWorker }) => {
          startWorker().catch((err: unknown) => {
            // eslint-disable-next-line no-console
            console.error('Failed to start MSW worker', err)
          })
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Failed to load MSW mocks', err)
        })
    }
  }, [])

  return <>{children}</>
}
