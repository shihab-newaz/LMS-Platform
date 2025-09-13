import { http, HttpResponse } from 'msw'

export interface Course {
  id: number
  title: string
  instructor: string
  progress: number
  duration: string
  students: number
  category: string
}

const courses: Course[] = [
  { id: 1, title: 'Quran Recitation & Tajweed', instructor: 'Sheikh Ahmad Hassan', progress: 65, duration: '12 weeks', students: 234, category: 'Quran Studies' },
  { id: 2, title: 'Introduction to Hadith Sciences', instructor: 'Dr. Fatima Al-Zahra', progress: 30, duration: '8 weeks', students: 189, category: 'Hadith' },
  { id: 3, title: 'Islamic History: The Prophets', instructor: 'Ustadh Ibrahim Malik', progress: 80, duration: '10 weeks', students: 456, category: 'History' },
]

export const handlers = [
  // GET /api/courses
  http.get('/api/courses', () => {
    return HttpResponse.json(courses)
  }),

  // GET /api/courses/:id
  http.get('/api/courses/:id', ({ params }) => {
    const { id } = params as Record<string, string>
    const course = courses.find((c) => String(c.id) === String(id))
    if (!course) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(course)
  }),

  // POST /api/login
  http.post('/api/login', async ({ request }) => {
    const info = await request.json()
    return HttpResponse.json({
      id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
      firstName: 'John',
      lastName: 'Maverick',
    })
  }),
]
