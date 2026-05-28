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
import { Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useCreateClientMutation } from '@/services'
import { toast } from 'sonner'

export function NewClientSheet() {
  const [open, setOpen] = useState(false)
  const createClientMutation = useCreateClientMutation({
    onSuccess: () => {
      setOpen(false)
      toast.success('Client added successfully')
    },
    onError: (error) => {
      toast.error(
        'Failed to add client' +
          (error instanceof Error ? `: ${error.message}` : '.')
      )
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    createClientMutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Add New Client</SheetTitle>
          <SheetDescription>
            Create a new client profile for your contacts.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Alice Johnson"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alice@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" placeholder="555-0123" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" name="company" placeholder="e.g. Tech Corp" />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" isLoading={createClientMutation.isPending}>
              Add Client
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
