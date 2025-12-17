import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-xl border bg-white/80 transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-warmGray-400 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-cream-200 text-warmGray-700 focus:border-honey-400 focus:ring-honey-200 hover:border-honey-300',
        error:
          'border-coral-200 text-warmGray-700 focus:border-coral-400 focus:ring-coral-200 hover:border-coral-300',
        ghost:
          'border-transparent bg-white/60 text-warmGray-700 focus:border-honey-400 focus:ring-honey-200 hover:bg-white/80 hover:border-cream-200',
      },
      size: {
        sm: 'h-9 px-3 py-2 text-sm min-h-[36px]',
        default: 'h-10 px-4 py-3 text-sm min-h-[44px]',
        lg: 'h-12 px-4 py-4 text-base min-h-[48px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
