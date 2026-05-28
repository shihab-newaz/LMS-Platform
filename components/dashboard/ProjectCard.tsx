'use client'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type Project } from '@/services'
import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  project: Project
  index?: number
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const statusVariant =
    project.status === 'IN_PROGRESS' ? 'default' : 'secondary'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
        delay: index * 0.1,
      }}
    >
      <Link href={`/projects/${project.id}`}>
        <Card className="hover:border-primary transition-colors cursor-pointer h-full flex flex-col group bg-card">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <CardTitle className="text-xl font-bold font-display truncate group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              <Badge
                variant={statusVariant}
                className="font-mono uppercase text-xs tracking-wider rounded-none"
              >
                {project.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="text-sm text-muted-foreground line-clamp-2">
              {project.description || 'No description provided.'}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/50 pt-4 text-sm text-muted-foreground flex justify-between font-mono">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {project.startDate
                ? new Date(project.startDate).toLocaleDateString()
                : 'Not scheduled'}
            </div>
            <span>{project.totalTasks ?? 0} tasks</span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  )
}
