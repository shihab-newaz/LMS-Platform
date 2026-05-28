'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/common/Button'

const ForgotPasswordPage = () => {
  const router = useRouter()

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-foreground">
          Reset password coming soon
        </h1>
        <p className="text-sm text-muted-foreground">
          We&apos;re preparing a secure password reset flow. Contact your
          administrator for immediate support.
        </p>
      </div>
      <Button variant="secondary" onClick={() => router.push('/login')}>
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Button>
    </div>
  )
}

export default ForgotPasswordPage
