import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Project } from '@/services'
import { Activity, CheckCircle, Clock, ListTodo } from 'lucide-react'

interface StatsOverviewProps {
  projects: Project[]
}

export function StatsOverview({ projects }: StatsOverviewProps) {
  const activeProjects = projects.filter(
    (p) => p.status === 'IN_PROGRESS'
  ).length
  const completedProjects = projects.filter(
    (p) => p.status === 'COMPLETED'
  ).length
  const planningProjects = projects.filter(
    (p) => p.status === 'PLANNING'
  ).length
  const totalOpenTasks = projects.reduce(
    (acc, p) => acc + (p.openTasks ?? 0),
    0
  )

  const stats = [
    {
      title: 'Active Projects',
      value: activeProjects,
      icon: Activity,
      description: 'Currently in progress',
    },
    {
      title: 'Open Tasks',
      value: totalOpenTasks,
      icon: ListTodo,
      description: 'Across loaded projects',
    },
    {
      title: 'Planning',
      value: planningProjects,
      icon: Clock,
      description: 'Waiting to start',
    },
    {
      title: 'Completed',
      value: completedProjects,
      icon: CheckCircle,
      description: 'Successfully delivered',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium font-mono uppercase tracking-wider text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display tracking-tight">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
