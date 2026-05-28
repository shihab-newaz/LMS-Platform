'use client'

import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  type Task,
  type TaskStatus,
} from '@/services'
import { NewTaskDialog } from '@/components/projects/NewTaskDialog'
import { Button } from '@/components/common/Button'

interface TaskBoardProps {
  tasks: Task[]
  phaseId: string
}

const columns: { title: string; status: TaskStatus }[] = [
  { title: 'To Do', status: 'TODO' },
  { title: 'In Progress', status: 'IN_PROGRESS' },
  { title: 'Done', status: 'DONE' },
]

export function TaskBoard({ tasks, phaseId }: TaskBoardProps) {
  const updateTaskMutation = useUpdateTaskMutation({
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update task.'
      )
    },
  })

  const deleteTaskMutation = useDeleteTaskMutation({
    onSuccess: () => {
      toast.success('Task removed.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete task.'
      )
    },
  })

  const updateStatus = (task: Task, status: TaskStatus) => {
    if (status === task.status) return
    updateTaskMutation.mutate({ id: task.id, status })
  }

  const removeTask = (task: Task) => {
    const confirmed = window.confirm(`Delete task "${task.title}"?`)
    if (!confirmed) return
    deleteTaskMutation.mutate(task.id)
  }

  return (
    <div className="grid gap-6 md:grid-cols-3 h-full">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status)
        return (
          <div key={col.status} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-muted-foreground">
                {col.title}
              </h3>
              <Badge variant="secondary" className="rounded-full px-2">
                {colTasks.length}
              </Badge>
            </div>

            <div className="flex flex-col gap-3 bg-muted/30 p-2 rounded-[8px] min-h-[200px]">
              {colTasks.map((task) => (
                <Card
                  key={task.id}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {task.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2 text-xs text-muted-foreground mt-2">
                      <div className="flex justify-between items-center">
                        <span>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString()
                            : 'No due date'}
                        </span>
                        {task.assigneeName && (
                          <span className="bg-secondary px-1.5 py-0.5 rounded-[4px]">
                            {task.assigneeName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            updateStatus(task, value as TaskStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-full text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TODO">TODO</SelectItem>
                            <SelectItem value="IN_PROGRESS">
                              IN_PROGRESS
                            </SelectItem>
                            <SelectItem value="DONE">DONE</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeTask(task)}
                        >
                          Delete
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <span>Priority {task.priority}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <NewTaskDialog phaseId={phaseId} defaultStatus={col.status} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
