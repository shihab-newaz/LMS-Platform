'use client'

import * as React from 'react'
import { motion } from 'framer-motion'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AuthShellProps {
  title: string
  description?: string
  footer?: React.ReactNode
  children: React.ReactNode
  illustration?: React.ReactNode
  className?: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

function AuthShell({
  children,
  className,
  description,
  footer,
  illustration,
  title,
}: AuthShellProps) {
  return (
    <div className="flex min-h-[100svh] flex-col bg-background lg:flex-row">
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden border-r border-border p-12 lg:flex">
        <motion.div
          className="relative z-10 max-w-lg"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          {illustration ?? (
            <div className="space-y-6">
              <h2 className="text-[40px] font-semibold leading-tight tracking-[-1.0px] text-foreground">
                Empower your learning community
              </h2>
              <p className="text-base text-muted-foreground">
                Manage admissions, academics, finance, and communication from a
                single, unified LMS dashboard.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center px-6 py-12 sm:px-8">
        <motion.div
          className={cn('w-full max-w-md', className)}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Card className="border-border bg-card shadow-none">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold tracking-tight text-foreground">
                {title}
              </CardTitle>
              {description ? (
                <CardDescription className="text-muted-foreground">
                  {description}
                </CardDescription>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-6">{children}</CardContent>
            {footer ? (
              <CardFooter className="justify-center text-sm text-muted-foreground">
                {footer}
              </CardFooter>
            ) : null}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export { AuthShell }
export type { AuthShellProps }
