import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group whitespace-nowrap shrink-0 gap-2 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-honey-500 to-honey-600 text-white hover:from-honey-600 hover:to-honey-700 hover:shadow-warm-lg hover:scale-105 active:scale-95 focus:ring-honey-300',
        destructive:
          'bg-gradient-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700 hover:shadow-warm-lg hover:scale-105 focus:ring-coral-300',
        outline:
          'border-2 border-cream-200 bg-white/80 text-honey-700 hover:bg-cream-100 hover:border-honey-300 hover:text-honey-800 focus:ring-honey-300',
        secondary:
          'bg-gradient-to-r from-cream-100 to-cream-200 text-honey-700 hover:from-cream-200 hover:to-cream-300 hover:text-honey-800 hover:shadow-warm-md hover:scale-102 focus:ring-honey-300',
        ghost:
          'text-warmGray-700 hover:text-honey-700 hover:bg-white/60 hover:shadow-soft focus:ring-honey-300',
        link: 'text-honey-600 underline-offset-4 hover:text-honey-700 hover:underline focus:ring-honey-300',
      },
      size: {
        default: 'px-6 py-3 text-sm min-h-[44px]',
        sm: 'px-4 py-2 text-sm min-h-[36px]',
        lg: 'px-8 py-4 text-base min-h-[52px]',
        icon: 'size-9 px-0',
        'icon-sm': 'size-8 px-0',
        'icon-lg': 'size-10 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, asChild = false, loading = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        <span className='relative z-10 flex items-center'>{children}</span>
      </Comp>
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
