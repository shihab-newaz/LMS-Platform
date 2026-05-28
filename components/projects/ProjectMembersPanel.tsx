'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/common/Button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useAddProjectMemberMutation,
  useProfileQuery,
  useProjectMembersQuery,
  useRemoveProjectMemberMutation,
  useUpdateProjectMemberRoleMutation,
  useUsersQuery,
  type ProjectMember,
  type ProjectMemberRole,
} from '@/services'

const memberRoles: ProjectMemberRole[] = ['OWNER', 'MEMBER', 'VIEWER']

interface ProjectMembersPanelProps {
  projectId: string
}

function displayName(member: ProjectMember) {
  return member.userName || member.userEmail
}

export function ProjectMembersPanel({ projectId }: ProjectMembersPanelProps) {
  const { data: currentUser } = useProfileQuery()
  const isAdmin = currentUser?.role === 'ADMIN'

  const {
    data: members = [],
    isLoading,
    isError,
  } = useProjectMembersQuery(projectId, Boolean(projectId))
  const { data: usersResponse } = useUsersQuery({
    page: 1,
    limit: 100,
    includeInactive: false,
  })

  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedRole, setSelectedRole] = useState<ProjectMemberRole>('MEMBER')

  const addMemberMutation = useAddProjectMemberMutation({
    onSuccess: () => {
      setSelectedUserId('')
      setSelectedRole('MEMBER')
      toast.success('Project member added.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to add member.'
      )
    },
  })

  const updateMemberRoleMutation = useUpdateProjectMemberRoleMutation({
    onSuccess: () => {
      toast.success('Member role updated.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update role.'
      )
    },
  })

  const removeMemberMutation = useRemoveProjectMemberMutation({
    onSuccess: () => {
      toast.success('Member removed.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to remove member.'
      )
    },
  })

  const users = usersResponse?.data ?? []
  const existingUserIds = useMemo(
    () => new Set(members.map((member) => member.userId)),
    [members]
  )
  const availableUsers = users.filter((user) => !existingUserIds.has(user.id))

  const addMember = () => {
    if (!selectedUserId) {
      toast.error('Select a user first.')
      return
    }
    addMemberMutation.mutate({
      projectId,
      userId: selectedUserId,
      role: selectedRole,
    })
  }

  const changeRole = (member: ProjectMember, role: ProjectMemberRole) => {
    if (!isAdmin || role === member.role) return
    updateMemberRoleMutation.mutate({ projectId, memberId: member.id, role })
  }

  const removeMember = (member: ProjectMember) => {
    if (!isAdmin) return
    const confirmed = window.confirm(
      `Remove ${displayName(member)} from this project?`
    )
    if (!confirmed) return
    removeMemberMutation.mutate({ projectId, memberId: member.id })
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>Team Members</CardTitle>
        <p className="text-sm text-muted-foreground">
          Assign project collaborators and manage their project-level
          permissions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAdmin && (
          <div className="grid gap-2 md:grid-cols-3">
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger className="w-full md:col-span-2">
                <SelectValue placeholder="Select a user to add" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as ProjectMemberRole)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {memberRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                size="sm"
                isLoading={addMemberMutation.isPending}
                onClick={addMember}
              >
                Add
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading members...
          </div>
        ) : isError ? (
          <div className="text-sm text-destructive">
            Failed to load members.
          </div>
        ) : members.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No members assigned yet.
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col gap-2 border border-border px-3 py-3 md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{displayName(member)}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.userEmail}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <Select
                      value={member.role}
                      onValueChange={(value) =>
                        changeRole(member, value as ProjectMemberRole)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {memberRoles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline">{member.role}</Badge>
                  )}

                  {isAdmin && (
                    <Button
                      variant="destructive"
                      size="sm"
                      isLoading={removeMemberMutation.isPending}
                      onClick={() => removeMember(member)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
