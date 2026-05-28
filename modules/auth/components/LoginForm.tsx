'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { Lock, Mail } from 'lucide-react'
import { useForm, type SubmitHandler } from 'react-hook-form'

import { Button } from '@/components/common/Button'
import { Input } from '@/components/custom/Input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { toast } from 'sonner'
import { loginSchema, type LoginFormValues } from '@/modules/auth/schemas'
import {
  useLoginMutation,
  type AuthResponse,
  type LoginPayload,
} from '@/services'
import type { ApiError } from '@/lib/apiClient'
import { persistClientAuthTokens, persistClientToken } from '@/lib/auth-token'

const LoginForm = () => {
  const router = useRouter()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const loginMutation = useLoginMutation({
    onSuccess: (response: AuthResponse, variables: LoginPayload) => {
      const accessToken = response.tokens?.accessToken
      const refreshToken = response.tokens?.refreshToken

      if (accessToken && refreshToken) {
        const maxAge = variables.rememberMe
          ? 60 * 60 * 24 * 30
          : 60 * 60 * 24 * 7
        persistClientAuthTokens({ accessToken, refreshToken }, maxAge)
      } else if (accessToken) {
        persistClientToken(accessToken)
      }

      toast.success(
        response?.user
          ? `Welcome back, ${response.user.name}!`
          : 'You are now logged in.'
      )

      form.reset({
        email: variables.email,
        password: '',
        rememberMe: variables.rememberMe ?? false,
      })

      router.push('/')
    },
    onError: (error: ApiError) => {
      toast.error(error.message ?? 'Unable to sign in. Please try again.')
    },
  })

  const onSubmit: SubmitHandler<LoginFormValues> = (values) => {
    loginMutation.mutate({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    })
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
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
                    type="password"
                    placeholder="••••••••"
                    startIcon={<Lock className="h-4 w-4" aria-hidden />}
                    allowPasswordToggle
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                  />
                </FormControl>
                <div className="leading-none">
                  <FormLabel className="text-sm font-medium">
                    Remember me
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <Link
            href="/forgot-password"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New to the platform?{' '}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </Form>
  )
}

export { LoginForm }
