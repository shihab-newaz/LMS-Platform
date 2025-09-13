'use client';

import React, { useState } from 'react';
import { Book, BookOpen, Users, Calendar, Home, Settings, LogOut, Bell, Search, User, Clock, Award, ChevronRight, Menu, X } from 'lucide-react';

interface Course {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  duration: string;
  students: number;
  category: string;
}

export default function IslamicEducationPlatform() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-800">Noor Academy</h1>
              <p className="text-xs text-gray-500">نور أكاديمية</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600 w-64"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>

            <button className="relative text-gray-600 hover:text-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-600 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-700">Ahmad Ali</p>
                <p className="text-xs text-gray-500">Student</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 overflow-hidden`}>
          <nav className="p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 p-8`}>
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Assalamu Alaikum, Ahmad</h2>
            <p className="text-gray-600">Continue your journey in Islamic knowledge</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-green-600" />
                <span className="text-2xl font-bold text-gray-800">124</span>
              </div>
              <p className="text-sm text-gray-600">Hours Learned</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Book className="w-8 h-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-800">6</span>
              </div>
              <p className="text-sm text-gray-600">Active Courses</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-gray-800">3</span>
              </div>
              <p className="text-sm text-gray-600">Certificates</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8 text-purple-600" />
                <span className="text-2xl font-bold text-gray-800">89</span>
              </div>
              <p className="text-sm text-gray-600">Study Partners</p>
            </div>
          </div>

          {/* Courses Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Your Courses</h3>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center space-x-1">
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-green-600" />
                  </div>

                  <div className="p-5">
                    <span className="text-xs text-green-600 font-medium">{course.category}</span>
                    <h4 className="text-base font-semibold text-gray-800 mt-1 mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500">
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

                    <button className="w-full mt-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors">
                      Continue Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
