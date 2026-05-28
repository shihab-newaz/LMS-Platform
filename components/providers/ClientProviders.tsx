'use client'

import React, { PropsWithChildren, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { ThemeProvider } from 'next-themes'

import AuthSessionHandler from '@/components/providers/AuthSessionHandler'

export default function ClientProviders({ children }: PropsWithChildren) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/msw').then(({ initMSW }) => initMSW())
    }
  }, [])

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 60_000,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  )

  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <AuthSessionHandler />
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
