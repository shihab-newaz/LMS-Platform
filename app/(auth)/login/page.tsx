import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Github, ShieldCheck, UserPlus } from 'lucide-react'
import { AuthShell } from '@/components/custom/AuthShell'
import { Button } from '@/components/common/Button'
import { LoginForm } from '@/modules/auth/components/LoginForm'

export const metadata: Metadata = {
  title: 'Sign in | Archi.Flow',
  description: 'Access your architectural project management dashboard.',
}

const LoginPage = () => {
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to manage your projects and clients."
      footer={
        <div className="flex flex-col items-center gap-2">
          <p>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            Secure API-first authentication
          </div>
        </div>
      }
      illustration={
        <div className="flex items-center justify-center">
          <Image
            src="/file.svg"
            alt="Placeholder illustration"
            priority
            width={256}
            height={256}
            className="mx-auto w-64 max-w-full opacity-90"
          />
        </div>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Button variant="secondary" className="w-full">
            <Github className="h-4 w-4" />
            GitHub
          </Button>
          <Button variant="secondary" className="w-full">
            <UserPlus className="h-4 w-4" />
            SSO
          </Button>
        </div>

        <div className="text-center text-xs uppercase tracking-wide text-muted-foreground">
          or continue with email
        </div>

        <LoginForm />
      </div>
    </AuthShell>
  )
}

export default LoginPage
