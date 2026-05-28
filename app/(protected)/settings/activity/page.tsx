'use client'

import { useMemo, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/common/Button'
import {
  useActivityLogsQuery,
  useProfileQuery,
  useUsersQuery,
} from '@/services'

const ENTITY_TYPES = [
  'ALL',
  'project',
  'payment',
  'task',
  'user',
  'auth',
] as const

type EntityTypeFilter = (typeof ENTITY_TYPES)[number]

function formatMeta(meta: Record<string, unknown> | null) {
  if (!meta) return '-'
  try {
    return JSON.stringify(meta)
  } catch {
    return '[unserializable meta]'
  }
}

export default function ActivityPage() {
  const {
    data: currentUser,
    isLoading: profileLoading,
    isError: profileError,
  } = useProfileQuery()

  const [page, setPage] = useState(1)
  const [entityType, setEntityType] = useState<EntityTypeFilter>('ALL')
  const [actorId, setActorId] = useState('ALL')
  const [entityId, setEntityId] = useState('')

  const queryEntityType = useMemo(
    () => (entityType === 'ALL' ? undefined : entityType),
    [entityType]
  )
  const queryActorId = useMemo(
    () => (actorId === 'ALL' ? undefined : actorId),
    [actorId]
  )

  const { data: usersResponse } = useUsersQuery({
    page: 1,
    limit: 100,
    includeInactive: true,
  })

  const users = usersResponse?.data ?? []

  const { data, isLoading, isError } = useActivityLogsQuery({
    page,
    limit: 20,
    entityType: queryEntityType,
    actorId: queryActorId,
    entityId: entityId.trim() || undefined,
  })

  if (profileLoading) {
    return (
      <div className="text-sm text-muted-foreground">Checking access...</div>
    )
  }

  if (profileError) {
    return (
      <div className="text-sm text-destructive">Failed to verify access.</div>
    )
  }

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          Access Restricted
        </h2>
        <p className="text-muted-foreground">
          Only administrators can access activity logs.
        </p>
      </div>
    )
  }

  const logs = data?.data ?? []
  const totalPages = data?.meta.totalPages ?? 1

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
        <p className="text-muted-foreground">
          Audit timeline of system changes.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <Select
          value={entityType}
          onValueChange={(value) => {
            setPage(1)
            setEntityType(value as EntityTypeFilter)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Entity Type" />
          </SelectTrigger>
          <SelectContent>
            {ENTITY_TYPES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={actorId}
          onValueChange={(value) => {
            setPage(1)
            setActorId(value)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Actor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">ALL ACTORS</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={entityId}
          onChange={(event) => {
            setPage(1)
            setEntityId(event.target.value)
          }}
          placeholder="Filter by entity ID"
        />

        <Button
          variant="ghost"
          onClick={() => {
            setPage(1)
            setEntityType('ALL')
            setActorId('ALL')
            setEntityId('')
          }}
        >
          Reset Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-muted-foreground">
          Loading activity logs...
        </div>
      ) : isError ? (
        <div className="text-sm text-destructive">
          Failed to load activity logs.
        </div>
      ) : logs.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No activity logs found for current filters.
        </div>
      ) : (
        <div className="overflow-x-auto border border-border">
          <table className="w-full min-w-200 text-sm">
            <thead className="bg-muted/40">
              <tr className="text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Actor</th>
                <th className="px-4 py-3 font-medium">Action</th>
                <th className="px-4 py-3 font-medium">Entity</th>
                <th className="px-4 py-3 font-medium">Entity ID</th>
                <th className="px-4 py-3 font-medium">Meta</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    {log.actorName || log.actorId || '-'}
                  </td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3">{log.entityType || '-'}</td>
                  <td className="px-4 py-3">{log.entityId || '-'}</td>
                  <td
                    className="px-4 py-3 max-w-120 truncate"
                    title={formatMeta(log.meta)}
                  >
                    {formatMeta(log.meta)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Page {data?.meta.page ?? page} of {totalPages}
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
    </div>
  )
}
