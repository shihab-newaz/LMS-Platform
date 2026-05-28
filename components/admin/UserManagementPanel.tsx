'use client'

import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/common/Button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useDeactivateUserMutation,
  useReactivateUserMutation,
  useUsersQuery,
  userQueryKeys,
  type User,
  type UserRole,
  type UsersResponse,
} from '@/services'
import { UserCreateSheet } from './UserCreateSheet'
import { UserEditDialog } from './UserEditDialog'

const roleFilters: Array<UserRole | 'ALL'> = [
  'ALL',
  'ADMIN',
  'ARCHITECT',
  'ENGINEER',
  'CLIENT',
]

type UserStatusMutationContext = {
  previousLists: Array<[readonly unknown[], UsersResponse | undefined]>
  previousDetail: User | undefined
  userId: string
}

function roleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'outline' {
  if (role === 'ADMIN') return 'default'
  if (role === 'ARCHITECT') return 'secondary'
  return 'outline'
}

function renderName(user: User) {
  if (user.name && user.name.trim().length > 0) return user.name
  return 'Unnamed user'
}

export function UserManagementPanel() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<UserRole | 'ALL'>('ALL')
  const [includeInactive, setIncludeInactive] = useState(false)

  const queryRole = useMemo(() => (role === 'ALL' ? undefined : role), [role])

  const { data, isLoading, isError, isFetching } = useUsersQuery({
    page,
    limit: 10,
    search: search.trim() || undefined,
    role: queryRole,
    includeInactive,
  })

  const updateUserActiveState = (userId: string, isActive: boolean) => {
    queryClient.setQueriesData<UsersResponse>(
      { queryKey: userQueryKeys.lists() },
      (current) => {
        if (!current) return current
        return {
          ...current,
          data: current.data.map((entry) =>
            entry.id === userId ? { ...entry, isActive } : entry
          ),
        }
      }
    )
    queryClient.setQueryData<User>(userQueryKeys.detail(userId), (current) => {
      if (!current) return current
      return { ...current, isActive }
    })
  }

  const deactivateMutation = useDeactivateUserMutation({
    onSuccess: () => {
      toast.success('User deactivated.')
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: userQueryKeys.lists() })
      const previousLists = queryClient.getQueriesData<UsersResponse>({
        queryKey: userQueryKeys.lists(),
      })
      const previousDetail = queryClient.getQueryData<User>(
        userQueryKeys.detail(userId)
      )
      updateUserActiveState(userId, false)
      return { previousLists, previousDetail, userId }
    },
    onError: (error, userId, context) => {
      const mutationContext = context as UserStatusMutationContext | undefined
      if (mutationContext?.previousLists) {
        for (const [queryKey, snapshot] of mutationContext.previousLists) {
          queryClient.setQueryData(queryKey, snapshot)
        }
      }
      if (mutationContext?.previousDetail) {
        queryClient.setQueryData(
          userQueryKeys.detail(userId),
          mutationContext.previousDetail
        )
      }
      toast.error(
        error instanceof Error ? error.message : 'Failed to deactivate user.'
      )
    },
    onSettled: (_data, _error, userId) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(userId) })
    },
  })

  const reactivateMutation = useReactivateUserMutation({
    onSuccess: () => {
      toast.success('User reactivated.')
    },
    onMutate: async (userId) => {
      await queryClient.cancelQueries({ queryKey: userQueryKeys.lists() })
      const previousLists = queryClient.getQueriesData<UsersResponse>({
        queryKey: userQueryKeys.lists(),
      })
      const previousDetail = queryClient.getQueryData<User>(
        userQueryKeys.detail(userId)
      )
      updateUserActiveState(userId, true)
      return { previousLists, previousDetail, userId }
    },
    onError: (error, userId, context) => {
      const mutationContext = context as UserStatusMutationContext | undefined
      if (mutationContext?.previousLists) {
        for (const [queryKey, snapshot] of mutationContext.previousLists) {
          queryClient.setQueryData(queryKey, snapshot)
        }
      }
      if (mutationContext?.previousDetail) {
        queryClient.setQueryData(
          userQueryKeys.detail(userId),
          mutationContext.previousDetail
        )
      }
      toast.error(
        error instanceof Error ? error.message : 'Failed to reactivate user.'
      )
    },
    onSettled: (_data, _error, userId) => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(userId) })
    },
  })

  const users = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  const onDeactivate = (user: User) => {
    const confirmed = window.confirm(`Deactivate ${renderName(user)}?`)
    if (!confirmed) return
    deactivateMutation.mutate(user.id)
  }

  const onReactivate = (user: User) => {
    reactivateMutation.mutate(user.id)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <CardTitle>User Directory</CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage accounts, roles, and active status for internal users.
            </p>
          </div>
          <UserCreateSheet onCreated={() => setPage(1)} />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setPage(1)
                  setSearch(event.target.value)
                }}
                placeholder="Search by name or email"
                className="pl-9"
              />
            </div>

            <Select
              value={role}
              onValueChange={(value) => {
                setPage(1)
                setRole(value as UserRole | 'ALL')
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                {roleFilters.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={includeInactive ? 'all' : 'active'}
              onValueChange={(value) => {
                setPage(1)
                setIncludeInactive(value === 'all')
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active only</SelectItem>
                <SelectItem value="all">Active + Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">
              Loading users...
            </div>
          ) : isError ? (
            <div className="text-sm text-destructive">
              Failed to load users.
            </div>
          ) : users.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No users found for the selected filters.
            </div>
          ) : (
            <div className="overflow-x-auto border border-border">
              <table className="w-full min-w-175 text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const pending =
                      deactivateMutation.isPending ||
                      reactivateMutation.isPending
                    return (
                      <tr key={user.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">
                          {renderName(user)}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={roleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={user.isActive ? 'secondary' : 'outline'}
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <UserEditDialog user={user} />
                            {user.isActive ? (
                              <Button
                                variant="destructive"
                                size="sm"
                                isLoading={pending}
                                onClick={() => onDeactivate(user)}
                              >
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                isLoading={pending}
                                onClick={() => onReactivate(user)}
                              >
                                Reactivate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              Page {data?.meta.page ?? page} of {totalPages}
              {isFetching ? ' • updating...' : ''}
            </p>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
