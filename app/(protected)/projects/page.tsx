'use client'

import { toast } from 'sonner'
import { Button } from '@/components/common/Button'
import {
  useArchiveProjectMutation,
  useProjectsQuery,
  type Project,
} from '@/services'
import { ProjectCard } from '@/components/dashboard/ProjectCard'
import { NewProjectSheet } from '@/components/projects/NewProjectSheet'

export default function ProjectsPage() {
  const { data: projects = [], isLoading, isError } = useProjectsQuery()
  const archiveProjectMutation = useArchiveProjectMutation({
    onSuccess: () => {
      toast.success('Project archived.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to archive project.'
      )
    },
  })

  const onArchiveProject = (project: Project) => {
    const confirmed = window.confirm(`Archive project "${project.name}"?`)
    if (!confirmed) return
    archiveProjectMutation.mutate(project.id)
  }

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading projects...</div>
    )
  }

  if (isError) {
    return (
      <div className="text-sm text-destructive">Failed to load projects.</div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your architectural portfolio.
          </p>
        </div>
        <NewProjectSheet />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <div key={project.id} className="space-y-2">
            <ProjectCard project={project} index={index} />
            <div className="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                isLoading={archiveProjectMutation.isPending}
                onClick={() => onArchiveProject(project)}
              >
                Archive
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
