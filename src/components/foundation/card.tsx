import { cva, type VariantProps } from 'class-variance-authority'
import { type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

/**
 * Card — container base para agrupar conteúdo relacionado.
 *
 * Estados: default, hover (com interação), focus (dentro do card).
 * Variantes: default, interactive (com hover sutil), outline.
 */

const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-colors',
  {
    variants: {
      variant: {
        default: '',
        interactive:
          'cursor-pointer hover:border-accent hover:shadow-md',
        outline: 'border-2',
        ghost: 'border-transparent bg-transparent shadow-none',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

function Card({ className, variant, ...props }: CardProps): React.ReactElement {
  return <div className={cn(cardVariants({ variant }), className)} {...props} />
}

Card.displayName = 'Card'

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
}

CardHeader.displayName = 'CardHeader'

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>): React.ReactElement {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
}

CardTitle.displayName = 'CardTitle'

function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>): React.ReactElement {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />
}

CardDescription.displayName = 'CardDescription'

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

CardContent.displayName = 'CardContent'

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
}

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants }
