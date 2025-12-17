import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/lib/utils'

const cardVariants = cva('relative overflow-hidden rounded-2xl transition-all duration-300', {
  variants: {
    variant: {
      default:
        'bg-white border border-cream-200 shadow-card hover:border-honey-300 hover:shadow-warm-md',
      warm: 'bg-gradient-to-br from-cream-50 to-honey-50 border border-honey-200 shadow-soft hover:shadow-warm-lg hover:border-honey-300',
      soft: 'bg-white/80 backdrop-blur-sm border border-cream-100 shadow-warm-sm hover:bg-white/90 hover:shadow-warm-md',
      glass:
        'bg-white/60 backdrop-blur-lg border border-white/30 shadow-warm-md hover:bg-white/80 hover:shadow-warm-lg',
    },
    hoverable: {
      true: 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer group',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    hoverable: false,
  },
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  decorative?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, hoverable, decorative, children, ...props }, ref) => {
    return (
      <div className={cn(cardVariants({ variant, hoverable, className }))} ref={ref} {...props}>
        {/* 装饰性元素 */}
        {decorative && (
          <>
            <div className='absolute top-0 right-0 w-32 h-32 bg-honey-100 rounded-full filter blur-2xl opacity-30' />
            <div className='absolute bottom-0 left-0 w-24 h-24 bg-coral-100 rounded-full filter blur-2xl opacity-20' />
          </>
        )}

        {/* 悬停光效 */}
        {hoverable && (
          <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        )}

        {/* 内容区域 */}
        <div className='relative z-10'>{children}</div>
      </div>
    )
  }
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6 pb-0', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-bold text-honey-700 leading-none', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-warmGray-500 text-sm', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
