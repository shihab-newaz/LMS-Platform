'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5e6ad2]/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          'bg-[#5e6ad2] text-white hover:bg-[#828fff] active:bg-[#5e69d1]',
        secondary:
          'bg-[#0f1011] text-[#f7f8f8] border border-[#23252a] hover:bg-[#141516]',
        ghost: 'text-[#8a8f98] hover:bg-[#141516] hover:text-[#f7f8f8]',
        destructive:
          'text-[#ff0033] hover:bg-[#141516] hover:text-[#ff0033]/90',
      },
      size: {
        default: 'h-9 px-[14px] py-[8px]',
        sm: 'h-8 px-3 text-xs gap-1.5',
        lg: 'h-10 px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  asChild?: boolean
}

function Button({
  className,
  variant,
  size,
  isLoading = false,
  disabled,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      disabled={disabled || isLoading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
