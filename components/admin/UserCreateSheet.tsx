'use client'

import { useMemo, useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/common/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  useCreateUserMutation,
  type CreateUserPayload,
  type UserRole,
} from '@/services'

const roleOptions: UserRole[] = ['ADMIN', 'ARCHITECT', 'ENGINEER', 'CLIENT']

interface UserCreateSheetProps {
  onCreated?: () => void
}

export function UserCreateSheet({ onCreated }: UserCreateSheetProps) {
  const [open, setOpen] = useState(false)
  const [role, setRole] = useState<UserRole>('ARCHITECT')

  const createUserMutation = useCreateUserMutation({
    onSuccess: () => {
      setOpen(false)
      toast.success('User created successfully.')
      onCreated?.()
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create user.'
      )
    },
  })

  const roleLabel = useMemo(
    () => role.charAt(0) + role.slice(1).toLowerCase(),
    [role]
  )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const payload: CreateUserPayload = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      password: String(formData.get('password') ?? ''),
      role,
    }

    if (!payload.name || !payload.email || !payload.password) {
      toast.error('Name, email, and password are required.')
      return
    }

    createUserMutation.mutate(payload)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-140">
        <SheetHeader>
          <SheetTitle>Create User</SheetTitle>
          <SheetDescription>
            Add a new user with an application role and secure credentials.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Maya Rahman"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="maya@archiflow.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((roleOption) => (
                  <SelectItem key={roleOption} value={roleOption}>
                    {roleOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Selected: {roleLabel}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={createUserMutation.isPending}>
              Create User
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
