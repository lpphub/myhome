import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-2xl border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden relative group',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-gradient-to-r from-honey-500 to-honey-600 text-white hover:from-honey-600 hover:to-honey-700 hover:shadow-warm-md hover:scale-105 focus:ring-honey-300',
        secondary:
          'border-transparent bg-gradient-to-r from-cream-100 to-cream-200 text-honey-700 hover:from-cream-200 hover:to-cream-300 hover:text-honey-800 hover:shadow-warm-sm hover:scale-105 focus:ring-honey-300',
        destructive:
          'border-transparent bg-gradient-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 hover:shadow-warm-md hover:scale-105 focus:ring-coral-300',
        outline:
          'border-2 border-cream-200 bg-white/80 text-honey-700 hover:bg-cream-100 hover:border-honey-300 hover:text-honey-800 hover:shadow-warm-sm hover:scale-105 focus:ring-honey-300',
        success:
          'border-transparent bg-gradient-to-r from-lemon-500 to-lemon-600 text-white hover:from-lemon-600 hover:to-lemon-700 hover:shadow-warm-md hover:scale-105 focus:ring-lemon-300',
        info: 'border-transparent bg-gradient-to-r from-lavender-500 to-lavender-600 text-white hover:from-lavender-600 hover:to-lavender-700 hover:shadow-warm-md hover:scale-105 focus:ring-lavender-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span'

    return <Comp className={cn(badgeVariants({ variant }), className)} ref={ref} {...props} />
  }
)

Badge.displayName = 'Badge'

export { Badge, badgeVariants }
