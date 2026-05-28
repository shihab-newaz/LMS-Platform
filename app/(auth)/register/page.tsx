import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BadgeCheck, BellRing } from 'lucide-react'
import { AuthShell } from '@/components/custom/AuthShell'
import { Button } from '@/components/common/Button'
import { RegisterForm } from '@/modules/auth/components/RegisterForm'

export const metadata: Metadata = {
  title: 'Create account | Archi.Flow',
  description:
    'Set up your Archi.Flow account and start managing your projects.',
}

const RegisterPage = () => {
  return (
    <AuthShell
      title="Create your account"
      description="Set up your workspace in minutes and invite your team."
      footer={
        <div className="flex flex-col items-center gap-2">
          <p>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in instead
            </Link>
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BadgeCheck className="h-4 w-4" />
            14-day audit logs • Granular permissions
          </div>
        </div>
      }
      illustration={
        <div className="flex items-center justify-center">
          <Image
            src="/file.svg"
            width={256}
            height={256}
            alt="Placeholder illustration"
            className="mx-auto w-64 max-w-full opacity-90"
          />
        </div>
      }
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Button variant="secondary" className="w-full">
            <BellRing className="h-4 w-4" />
            Invite teammates
          </Button>
        </div>

        <RegisterForm />
      </div>
    </AuthShell>
  )
}

export default RegisterPage
