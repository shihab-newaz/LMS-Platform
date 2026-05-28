'use client'

import { Button } from '@/components/common/Button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
import { useCreateProjectMutation } from '@/services'
import { toast } from 'sonner'
import type { ProjectStatus } from '@/services'

export function NewProjectSheet() {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<ProjectStatus>('PLANNING')
  const createProjectMutation = useCreateProjectMutation({
    onSuccess: () => {
      setOpen(false)
      toast.success('Project created successfully')
    },
    onError: (error) => {
      toast.error(
        'Failed to create project' +
          (error instanceof Error ? `: ${error.message}` : '.')
      )
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    createProjectMutation.mutate({
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      status,
      startDate: (formData.get('startDate') as string) || undefined,
      endDate: (formData.get('endDate') as string) || undefined,
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-135">
        <SheetHeader>
          <SheetTitle>Create New Project</SheetTitle>
          <SheetDescription>
            Add a new architectural project to your portfolio.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Modern Loft Renovation"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="e.g. Residential high-rise renovation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as ProjectStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PLANNING">PLANNING</SelectItem>
                <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                <SelectItem value="COMPLETED">COMPLETED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={createProjectMutation.isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
