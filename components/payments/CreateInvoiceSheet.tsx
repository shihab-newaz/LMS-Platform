'use client'

import { useState, type FormEvent } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/common/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useCreateInvoiceMutation,
  useProjectsQuery,
  useUsersQuery,
} from '@/services'

function toCents(value: string) {
  const amount = Number(value || '0')
  if (Number.isNaN(amount) || amount <= 0) {
    return 0
  }
  return Math.round(amount * 100)
}

export function CreateInvoiceSheet() {
  const [open, setOpen] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [clientId, setClientId] = useState('')

  const { data: projects = [] } = useProjectsQuery({ page: 1, limit: 100 })
  const { data: clientsResponse } = useUsersQuery({
    page: 1,
    limit: 100,
    role: 'CLIENT',
    includeInactive: false,
  })

  const clients = clientsResponse?.data ?? []

  const createInvoiceMutation = useCreateInvoiceMutation({
    onSuccess: () => {
      setOpen(false)
      setProjectId('')
      setClientId('')
      toast.success('Invoice created.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create invoice.'
      )
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const amountCents = toCents(String(formData.get('amount') ?? '0'))
    if (!projectId || !clientId || amountCents <= 0) {
      toast.error('Project, client, and valid amount are required.')
      return
    }

    createInvoiceMutation.mutate({
      projectId,
      clientId,
      amountCents,
      currency: String(formData.get('currency') ?? 'BDT'),
      dueDate: String(formData.get('dueDate') ?? '') || undefined,
      description: String(formData.get('description') ?? '') || undefined,
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          New Invoice
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-140">
        <SheetHeader>
          <SheetTitle>Create Invoice</SheetTitle>
          <SheetDescription>
            Create a new project invoice and track payment status.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name || client.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={0}
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                name="currency"
                defaultValue="BDT"
                maxLength={3}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" name="dueDate" type="date" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="Invoice details (optional)"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={createInvoiceMutation.isPending}>
              Create Invoice
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
