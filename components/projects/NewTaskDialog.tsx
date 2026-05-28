'use client'

import { Button } from '@/components/common/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import {
  useCreateTaskMutation,
  type TaskStatus,
  useUsersQuery,
} from '@/services'
import { toast } from 'sonner'

interface NewTaskDialogProps {
  phaseId: string
  defaultStatus?: TaskStatus
  trigger?: React.ReactNode
}

export function NewTaskDialog({
  phaseId,
  defaultStatus = 'TODO',
  trigger,
}: NewTaskDialogProps) {
  const [open, setOpen] = useState(false)
  const { data: usersResponse } = useUsersQuery({
    page: 1,
    limit: 100,
    includeInactive: false,
  })
  const users = usersResponse?.data ?? []

  const createTaskMutation = useCreateTaskMutation({
    onSuccess: () => {
      setOpen(false)
      toast.success('Task created successfully')
    },
    onError: (error) => {
      toast.error(
        'Failed to create task' +
          (error instanceof Error ? `: ${error.message}` : '.')
      )
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    createTaskMutation.mutate({
      phaseId,
      title: formData.get('title') as string,
      description: (formData.get('description') as string) || undefined,
      dueDate: (formData.get('dueDate') as string) || undefined,
      assignedTo: (formData.get('assignedTo') as string) || undefined,
      priority: Number(formData.get('priority') as string),
      status: formData.get('status') as TaskStatus,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="secondary" className="w-full">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a task for this project phase.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Review structural drawings"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Task details (optional)"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={defaultStatus} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODO">TODO</SelectItem>
                  <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                  <SelectItem value="DONE">DONE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                name="priority"
                type="number"
                min={1}
                max={5}
                defaultValue={3}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assignee (Optional)</Label>
            <Select name="assignedTo">
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="submit" isLoading={createTaskMutation.isPending}>
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
