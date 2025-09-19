'use client';

import React, { useState } from 'react';
import { 
  Book, BookOpen, Users, Calendar, Home, Settings, LogOut, Bell, Search, User, Clock, Award, ChevronRight, Menu, X 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent,CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  duration: string;
  students: number;
  category: string;
}

export default function Homepage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const courses: Course[] = [
    { id: 1, title: 'Quran Recitation & Tajweed', instructor: 'Sheikh Ahmad Hassan', progress: 65, duration: '12 weeks', students: 234, category: 'Quran Studies' },
    { id: 2, title: 'Introduction to Hadith Sciences', instructor: 'Dr. Fatima Al-Zahra', progress: 30, duration: '8 weeks', students: 189, category: 'Hadith' },
    { id: 3, title: 'Islamic History: The Prophets', instructor: 'Ustadh Ibrahim Malik', progress: 80, duration: '10 weeks', students: 456, category: 'History' },
    { id: 4, title: 'Arabic Language Fundamentals', instructor: 'Sister Maryam Abdullah', progress: 45, duration: '16 weeks', students: 312, category: 'Arabic' },
    { id: 5, title: 'Fiqh: Islamic Jurisprudence', instructor: 'Sheikh Omar Suleiman', progress: 20, duration: '14 weeks', students: 278, category: 'Fiqh' },
    { id: 6, title: 'Seerah: Life of Prophet Muhammad ﷺ', instructor: 'Dr. Yasir Qadhi', progress: 90, duration: '6 weeks', students: 567, category: 'Seerah' },
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'quran', label: 'Quran Studies', icon: Book },
    { id: 'hadith', label: 'Hadith', icon: BookOpen },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 border-b border-border bg-background">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Noor Academy</h1>
              <p className="text-xs text-muted-foreground">نور أكاديمية</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                placeholder="Search courses..."
                className="pl-10 pr-4 w-64"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-600 rounded-full"></span>
            </Button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-5 h-5 text-foreground" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-foreground">Ahmad Ali</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`transition-all duration-300 bg-background border-r border-border fixed top-16 bottom-0 overflow-hidden ${sidebarOpen ? 'w-64' : 'w-0'}`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Button
                      variant={activeSection === item.id ? 'secondary' : 'ghost'}
                      className="w-full justify-start space-x-3"
                      onClick={() => setActiveSection(item.id)}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 pt-8 border-t border-border">
              <Button variant="ghost" className="w-full justify-start space-x-3">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 p-8 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-1">Assalamu Alaikum, Ahmad</h2>
            <p className="text-muted-foreground">Continue your journey in Islamic knowledge</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="flex items-center justify-between">
                <Clock className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-foreground">124</span>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">Hours Learned</CardFooter>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between">
                <Book className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-foreground">6</span>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">Active Courses</CardFooter>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between">
                <Award className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-foreground">3</span>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">Certificates</CardFooter>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between">
                <Users className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-foreground">89</span>
              </CardContent>
              <CardFooter className="text-sm text-muted-foreground">Study Partners</CardFooter>
            </Card>
          </div>

          {/* Courses Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-foreground">Your Courses</h3>
              <Button variant="link" size="sm" className="flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-green-600" />
                  </div>

                  <CardContent>
                    <Badge variant="secondary">{course.category}</Badge>
                    <h4 className="text-base font-semibold text-foreground mt-1 mb-2">{course.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{course.instructor}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2 rounded-full" />
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{course.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{course.students} students</span>
                        </span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-4">
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
