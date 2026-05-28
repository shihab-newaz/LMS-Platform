'use client'

import { UserManagementPanel } from '@/components/admin/UserManagementPanel'
import { Button } from '@/components/common/Button'
import { useProfileQuery } from '@/services'

export default function UsersPage() {
  const { data: currentUser, isLoading, isError } = useProfileQuery()

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Checking access...</div>
    )
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">Failed to verify access.</div>
    )
  }

  if (currentUser?.role !== 'ADMIN') {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Access Restricted
        </h2>
        <p className="text-muted-foreground">
          Only administrators can access user management.
        </p>
        <Button variant="secondary" onClick={() => window.location.assign('/')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Create and manage users with role-based access and active status.
        </p>
      </div>

      <UserManagementPanel />
    </div>
  )
}
