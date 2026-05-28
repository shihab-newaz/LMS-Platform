'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/common/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useUpdateUserMutation,
  userQueryKeys,
  type User,
  type UserRole,
  type UsersResponse,
} from '@/services'

const roleOptions: UserRole[] = ['ADMIN', 'ARCHITECT', 'ENGINEER', 'CLIENT']

interface UserEditDialogProps {
  user: User
}

type UserEditMutationContext = {
  previousLists: Array<[readonly unknown[], UsersResponse | undefined]>
  previousDetail: User | undefined
}

export function UserEditDialog({ user }: UserEditDialogProps) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.name ?? '')
  const [role, setRole] = useState<UserRole>(user.role)

  useEffect(() => {
    if (!open) {
      setName(user.name ?? '')
      setRole(user.role)
    }
  }, [open, user.name, user.role])

  const updateUserMutation = useUpdateUserMutation({
    onSuccess: () => {
      setOpen(false)
      toast.success('User updated.')
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: userQueryKeys.lists() })
      await queryClient.cancelQueries({
        queryKey: userQueryKeys.detail(payload.id),
      })

      const previousLists = queryClient.getQueriesData<UsersResponse>({
        queryKey: userQueryKeys.lists(),
      })
      const previousDetail = queryClient.getQueryData<User>(
        userQueryKeys.detail(payload.id)
      )

      queryClient.setQueriesData<UsersResponse>(
        { queryKey: userQueryKeys.lists() },
        (current) => {
          if (!current) return current
          return {
            ...current,
            data: current.data.map((entry) =>
              entry.id === payload.id
                ? {
                    ...entry,
                    name: payload.name ?? entry.name,
                    role: payload.role ?? entry.role,
                  }
                : entry
            ),
          }
        }
      )

      queryClient.setQueryData<User>(
        userQueryKeys.detail(payload.id),
        (current) => {
          if (!current) return current
          return {
            ...current,
            name: payload.name ?? current.name,
            role: payload.role ?? current.role,
          }
        }
      )

      return { previousLists, previousDetail }
    },
    onError: (error, payload, context) => {
      const mutationContext = context as UserEditMutationContext | undefined
      if (mutationContext?.previousLists) {
        for (const [queryKey, snapshot] of mutationContext.previousLists) {
          queryClient.setQueryData(queryKey, snapshot)
        }
      }
      if (mutationContext?.previousDetail) {
        queryClient.setQueryData(
          userQueryKeys.detail(payload.id),
          mutationContext.previousDetail
        )
      }
      toast.error(
        error instanceof Error ? error.message : 'Failed to update user.'
      )
    },
    onSettled: (_data, _error, payload) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.detail(payload.id),
      })
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      toast.error('Name is required.')
      return
    }
    updateUserMutation.mutate({ id: user.id, name: trimmedName, role })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update role and profile name for this user account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`edit-name-${user.id}`}>Full Name</Label>
            <Input
              id={`edit-name-${user.id}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter full name"
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
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={updateUserMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
