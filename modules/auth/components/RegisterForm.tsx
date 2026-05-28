'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail, User } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/common/Button'
import { Input } from '@/components/custom/Input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { registerSchema, type RegisterFormValues } from '@/modules/auth/schemas'
import { useRegisterMutation, type AuthResponse } from '@/services'
import type { ApiError } from '@/lib/apiClient'
import { persistClientAuthTokens, persistClientToken } from '@/lib/auth-token'

const RegisterForm = () => {
  const router = useRouter()
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const registerMutation = useRegisterMutation({
    onSuccess: (response: AuthResponse) => {
      toast.success('Account created! Your profile is ready to go.')

      const accessToken = response.tokens?.accessToken
      const refreshToken = response.tokens?.refreshToken

      if (accessToken && refreshToken) {
        persistClientAuthTokens({ accessToken, refreshToken })
      } else if (accessToken) {
        persistClientToken(accessToken)
      }

      form.reset({
        name: '',
        email: response.user.email,
        password: '',
        confirmPassword: '',
      })

      if (accessToken) {
        router.push('/')
      } else {
        router.push('/login')
      }
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? 'Please review your details and try again.')
    },
  })

  const handleSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Fatima Zahra"
                    startIcon={<User className="h-4 w-4" aria-hidden />}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="you@example.com"
                    type="email"
                    startIcon={<Mail className="h-4 w-4" aria-hidden />}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    allowPasswordToggle
                    startIcon={<Lock className="h-4 w-4" aria-hidden />}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    allowPasswordToggle
                    startIcon={<Lock className="h-4 w-4" aria-hidden />}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={registerMutation.isPending}
        >
          {registerMutation.isPending
            ? 'Creating account...'
            : 'Create account'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </Form>
  )
}

export { RegisterForm }
