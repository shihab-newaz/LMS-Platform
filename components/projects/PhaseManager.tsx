'use client'

import { useState } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/common/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  useCreateProjectPhaseMutation,
  useDeleteProjectPhaseMutation,
  useProjectPhasesQuery,
  useReorderProjectPhasesMutation,
  useUpdateProjectPhaseMutation,
  type ProjectPhase,
} from '@/services'

interface PhaseManagerProps {
  projectId: string
  onActivePhaseChange?: (phaseId: string | null) => void
}

export function PhaseManager({
  projectId,
  onActivePhaseChange,
}: PhaseManagerProps) {
  const [newPhaseName, setNewPhaseName] = useState('')
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const {
    data: phases = [],
    isLoading,
    isError,
  } = useProjectPhasesQuery(projectId, Boolean(projectId))

  const createPhaseMutation = useCreateProjectPhaseMutation({
    onSuccess: (phase) => {
      setNewPhaseName('')
      onActivePhaseChange?.(phase.id)
      toast.success('Phase created.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create phase.'
      )
    },
  })

  const updatePhaseMutation = useUpdateProjectPhaseMutation({
    onSuccess: () => {
      setEditingPhaseId(null)
      setEditingName('')
      toast.success('Phase updated.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update phase.'
      )
    },
  })

  const reorderPhasesMutation = useReorderProjectPhasesMutation({
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reorder phases.'
      )
    },
  })

  const deletePhaseMutation = useDeleteProjectPhaseMutation({
    onSuccess: () => {
      toast.success('Phase removed.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete phase.'
      )
    },
  })

  const createPhase = () => {
    const name = newPhaseName.trim()
    if (!name) {
      toast.error('Phase name is required.')
      return
    }
    createPhaseMutation.mutate({ projectId, name })
  }

  const saveEdit = (phase: ProjectPhase) => {
    const name = editingName.trim()
    if (!name || name === phase.name) {
      setEditingPhaseId(null)
      setEditingName('')
      return
    }
    updatePhaseMutation.mutate({ projectId, phaseId: phase.id, name })
  }

  const reorder = (phaseId: string, direction: 'up' | 'down') => {
    const sorted = [...phases].sort((a, b) => a.position - b.position)
    const index = sorted.findIndex((phase) => phase.id === phaseId)
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (index < 0 || targetIndex < 0 || targetIndex >= sorted.length) {
      return
    }

    const nextOrder = [...sorted]
    const [moved] = nextOrder.splice(index, 1)
    nextOrder.splice(targetIndex, 0, moved)

    reorderPhasesMutation.mutate({
      projectId,
      phaseIds: nextOrder.map((phase) => phase.id),
    })
  }

  const removePhase = (phase: ProjectPhase) => {
    const confirmed = window.confirm(`Delete phase "${phase.name}"?`)
    if (!confirmed) return
    deletePhaseMutation.mutate({ projectId, phaseId: phase.id })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phases</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={newPhaseName}
            onChange={(event) => setNewPhaseName(event.target.value)}
            placeholder="Add phase name"
          />
          <Button
            size="sm"
            isLoading={createPhaseMutation.isPending}
            onClick={createPhase}
          >
            Add
          </Button>
        </div>

        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading phases...</div>
        ) : isError ? (
          <div className="text-sm text-destructive">Failed to load phases.</div>
        ) : phases.length === 0 ? (
          <div className="text-sm text-muted-foreground">No phases yet.</div>
        ) : (
          <div className="space-y-2">
            {[...phases]
              .sort((a, b) => a.position - b.position)
              .map((phase, index, list) => (
                <div
                  key={phase.id}
                  className="flex flex-col gap-2 border border-border px-3 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    {editingPhaseId === phase.id ? (
                      <Input
                        value={editingName}
                        onChange={(event) => setEditingName(event.target.value)}
                        onBlur={() => saveEdit(phase)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter') saveEdit(phase)
                          if (event.key === 'Escape') {
                            setEditingPhaseId(null)
                            setEditingName('')
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <button
                        type="button"
                        className="text-left text-sm font-medium hover:text-primary"
                        onClick={() => {
                          setEditingPhaseId(phase.id)
                          setEditingName(phase.name)
                          onActivePhaseChange?.(phase.id)
                        }}
                      >
                        {phase.name}
                      </button>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {phase.taskCount ?? 0} tasks
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => reorder(phase.id, 'up')}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === list.length - 1}
                      onClick={() => reorder(phase.id, 'down')}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePhase(phase)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
