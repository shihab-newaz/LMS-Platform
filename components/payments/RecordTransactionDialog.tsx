'use client'

import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/common/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  useRecordPaymentTransactionMutation,
  type InvoicePayment,
  type PaymentMethod,
} from '@/services'

const methods: PaymentMethod[] = ['CASH', 'BANK', 'MOBILE']

function toCents(value: string) {
  const amount = Number(value || '0')
  if (Number.isNaN(amount) || amount <= 0) {
    return 0
  }
  return Math.round(amount * 100)
}

interface RecordTransactionDialogProps {
  payment: InvoicePayment
}

export function RecordTransactionDialog({
  payment,
}: RecordTransactionDialogProps) {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState<PaymentMethod>('BANK')

  const recordTransactionMutation = useRecordPaymentTransactionMutation({
    onSuccess: () => {
      setOpen(false)
      toast.success('Transaction recorded.')
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to record transaction.'
      )
    },
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const amountCents = toCents(String(formData.get('amount') ?? '0'))

    if (amountCents <= 0) {
      toast.error('Amount must be greater than zero.')
      return
    }

    recordTransactionMutation.mutate({
      paymentId: payment.id,
      amountCents,
      method,
      reference: String(formData.get('reference') ?? '') || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Record
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Transaction</DialogTitle>
          <DialogDescription>
            Outstanding: {(payment.outstandingCents / 100).toFixed(2)}{' '}
            {payment.currency}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label>Method</Label>
            <Select
              value={method}
              onValueChange={(value) => setMethod(value as PaymentMethod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {methods.map((methodValue) => (
                  <SelectItem key={methodValue} value={methodValue}>
                    {methodValue}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Reference</Label>
            <Input
              id="reference"
              name="reference"
              placeholder="Optional transaction reference"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              isLoading={recordTransactionMutation.isPending}
            >
              Save Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
