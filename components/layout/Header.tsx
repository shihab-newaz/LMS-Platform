'use client'

import React from 'react'
import Link from 'next/link'
import { Bell, Search, User, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface HeaderProps {
  breadcrumbs?: Array<{
    title: string
    href?: string
  }>
}

export default function Header({
  breadcrumbs = [{ title: 'Dashboard' }],
}: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 mb-6 border-b bg-background">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem className="hidden md:block">
                {crumb.href ? (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.title}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-lg font-semibold">
                    {crumb.title}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Search..." className="w-64 pl-10" />
          </div>
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-[#ff0033] rounded-full" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Notifications</h4>
                <Button variant="ghost" size="sm">
                  Mark all read
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-3 p-3 rounded-[8px] hover:bg-accent">
                  <div className="w-2 h-2 bg-[#5e6ad2] rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New assignment posted</p>
                    <p className="text-xs text-muted-foreground">
                      Due in 2 days
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-[8px] hover:bg-accent">
                  <div className="w-2 h-2 bg-[#27a644] rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Task completed</p>
                    <p className="text-xs text-muted-foreground">
                      Congratulations!
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-[8px] hover:bg-accent">
                  <div className="w-2 h-2 bg-[#d0d6e0] rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reminder</p>
                    <p className="text-xs text-muted-foreground">
                      Weekly review tomorrow
                    </p>
                  </div>
                </div>
              </div>
              <Button variant="secondary" className="w-full">
                View all
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profile */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <Link
                href="/profile"
                className="flex items-center space-x-2 p-2 rounded-[8px] hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="text-sm">My Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center space-x-2 p-2 rounded-[8px] hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </Link>
              <Link
                href="/logout"
                className="flex items-center space-x-2 p-2 rounded-[8px] hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Sign Out</span>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
