import { http, HttpResponse } from 'msw'
import type { Project } from '@/types'
import { createMockProject } from '../factories'

let projects: Project[] = [
  createMockProject({
    id: '1',
    name: 'Modern Loft Renovation',
    clientId: '1',
    status: 'Active',
    phase: 'Design',
    budget: 150000,
    startDate: '2023-10-01',
    address: '123 Main St, Cityville',
  }),
  createMockProject({
    id: '2',
    name: 'Lakeside Cabin',
    clientId: '2',
    status: 'On Hold',
    phase: 'Permitting',
    budget: 300000,
    startDate: '2023-08-15',
    address: '456 Lake Rd, Townsville',
  }),
]

export const projectHandlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json({
      data: projects,
      meta: {
        page: 1,
        limit: 10,
        total: projects.length,
        totalPages: Math.ceil(projects.length / 10),
      },
    })
  }),

  http.get('/api/projects/:id', ({ params }) => {
    const project = projects.find((item) => item.id === params.id)
    if (!project) {
      return HttpResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }
    return HttpResponse.json(project)
  }),

  http.post('/api/projects', async ({ request }) => {
    const payload = (await request.json()) as Omit<Project, 'id'>
    const project: Project = {
      ...payload,
      id: Math.random().toString(36).slice(2, 9),
    }
    projects = [project, ...projects]
    return HttpResponse.json(project, { status: 201 })
  }),

  http.patch('/api/projects/:id', async ({ params, request }) => {
    const payload = (await request.json()) as Partial<Project>
    const index = projects.findIndex((item) => item.id === params.id)
    if (index === -1) {
      return HttpResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }
    projects[index] = { ...projects[index], ...payload }
    return HttpResponse.json(projects[index])
  }),
]
